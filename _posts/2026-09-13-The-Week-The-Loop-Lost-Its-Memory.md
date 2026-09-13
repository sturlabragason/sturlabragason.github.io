---
layout: post
title: "The week the loop lost its memory"
date: 2026-09-13
categories: [blog]
tags: [AI, agents, LLM, orchestration, automation, git, failover, change management, operations, developer practices, weekly]
---

<style>
    .e-content p {
        text-align: justify;
    }
</style>

The daily loop came online on Monday the 7th, wrote three retros nobody could read, found out on Thursday, and by Sunday had a rule for how changes to itself get tested. This is the second backfill, written on the 13th from the retros, the agents' journal and the git log. Unlike the first week, the record this time was mostly written by the loop itself.

## Three retros, each the first

The daily-retro job ran for the first time at 05:05 UTC on the 7th. Its entry opens with "This is the first daily-retro run" and immediately found two things wrong with its own inputs: the lane-share script died with `Argument list too long` because it passed the whole ticket list as a python argv, and the retro's cron fired at 07:00 local, before the two sensor scans it was supposed to read at 07:30 and 07:45. A process that can't see its own sensors on any weekday is a fair thing to find on day one.

The entry for the 8th also opens with "This is the first daily-retro run since the segment was created." It wasn't. The 7th's entry existed, on a branch, and the run on the 8th was cut from a master that had never seen it.

It took until the 10th for a run to notice. That morning's retro reports master sitting on a commit from 07:17 on the 7th with nothing merged since, and 58 of 61 local branches ahead of it. The three prior entries were recovered with `git log --all` rather than a file read, which is not what the process brief says to do. The same morning the trending-repos sensor hit the wall from the other side: the script it had been told to use since the 7th didn't exist in any fresh checkout. It existed once, on one agent's branch, and the sensor had been reporting it missing for three consecutive days.

The part I'd underline is that the process built to catch drift ran three times on top of the drift and reported a clean board each time. Both the retro and the sensor found it eventually, but only because each one tried to read a file it had itself written earlier.

## Four fixes before nine

The ticket was filed at 06:23 UTC on the 10th, asking for a design decision rather than a patch. By the commit timestamps the first fix landed at 06:29, with the journal entry two minutes ahead of it. I can't tell from the record what happened in those six minutes.

What the entry does say is that merging was measured before it was attempted. Replaying all 62 branches into master in commit-date order conflicted on 48. Almost none of those were disagreements about work. A health-check TTL cache that every check rewrites was tracked in git. The repo had no `.gitignore`, so agents' scratch files went into every baseline commit. And each knowledge segment had one shared append-only log file, the exact hazard the journal's one-file-per-entry design had removed everywhere else. Remove those three and the same replay drops to 10 conflicts, all old commits master had already superseded.

The decision was merge back at run end into the local trunk. Cutting worktrees from the latest known-good tip was rejected because it chains lineages and never converges; a periodic human merge pass was rejected because that is what had not been happening.

Then the fix needed fixing three times in the next nine minutes. `for-each-ref` matches one path component, so `refs/heads/agent/*` matched none of the `agent/<lane>/<id>` branches and the sweep silently did nothing. Pre-hygiene branches still carried the cache file, so every one conflicted modify/delete, and the `check-ignore` call that was supposed to resolve that needed `--no-index` because a conflicted path sits in the index. And the agents' shared instruction file turned out to be the other big conflict source, because the daemon injects a per-run runtime block into it and every `git commit -a` captured it; that became a git clean filter rather than a rule to remember. The same commit fixed a `return` at top level that aborted the sweep under `set -e` instead of exiting 0.

Four commits on one script in one morning, two of them for code that silently did nothing, is a good argument for the thing that came two days later.

The same day got a backstop: a cron job that runs the dry-run sweep daily and logs the ahead-of-master count, report-only. Nothing machine-checks that a run actually calls the merge-back script; a growing count in that log is the only signal. As of the 12th two runs had merged back cleanly, and on the 13th an unexplained two-blank-line diff on the instruction file showed up in a worktree and was discarded without diagnosis. The fifty-odd stale branches are still there; deleting them is reflog-only recovery and I haven't decided.

## The seat died and the loop didn't say so

The daily retro for the 11th has three comments on it, at 06:15, 07:00 and 08:00 UTC, and all three are the same line: "You've hit your individual spend limit". There is no retro entry for the 11th. The next thing on the ticket is me, on the 13th, asking why every work task is failing and whether the lane has a health check.

It had one. The router watchdog had done its job and flipped the squad leader to the metered fallback lane. But leadership was the only thing it flipped. Eight scheduled jobs were assigned directly to the dead seat's agents, and eight open tickets were pinned to them, so the retro, the standup, the estimate backfill and the sensors all kept dispatching into a dead seat for two days. A seat failover has three surfaces, squad leader, scheduled-job assignee and open-ticket assignee, and flipping only the first looks like a working failover and is not.

Two more things fell out of the same investigation. The watchdog's cron trigger had a next-run time stuck eleven hours in the past while the backend reported healthy; toggling the trigger off and on re-armed it. And the hourly stalled-ticket sweep was active with an empty trigger list, which means it could never fire and nothing in the workspace noticed. An active scheduled job with zero triggers is silently dead.

On my own question about cheaper fallback models: there aren't any reachable. The coding CLI on the metered backend addresses one vendor's deployments only, so its cheapest tier is the floor for work-context failover, and the cheaper flat-rate lanes are on the wrong side of the pool boundary.

There's a small echo here. The retro on the 7th flagged the model-probe cache as stale because it still said the work seat was at its spend limit, contradicted by the live probe that morning. Four days later it was true again.

## A rule for changing the rules

On the evening of the 12th a ticket recorded my request verbatim: "We need a way to be able to prototype things, evaluate them, promote them, and version control them. So far on most tools we have just been implementing them globally and rolling out with no easy way to roll back." The change methodology is stamped two minutes after it, and the prerequisite, getting the agent config directories and the scheduled-job, agent and squad definitions into git at all, ten minutes after that.

The methodology is four stages, and the parts I'd hold it to are the ones with teeth: a prototype is a named `-rc` copy in one scope, never an edit to the global file; promotion is one commit that names its own rollback command; rollback is the default response to a regression, not investigation. A per-surface table says what those mean for a hook, a skill, a scheduled-job prompt, a config file.

On the 13th it got a visibility layer. A registry lists what is under test, a status script exits 1 when a row has been testing more than 21 days, and the Monday retro roll-up now rules promote, keep or drop on every row. The registry was seeded with eight changes from the 7th onward that had never been formally promoted, so the merge-back fix and the clean filter are now retroactively prototypes, with their first review due on the 14th. The prompt change to the retro job was itself the first real use of the new import path, and the re-export showed the snapshot carries volatile fields like `updated_at` and `last_run_*`, so a clean diff isn't possible yet.

Two things I'd flag. First, stage 4 says rollback paths get walked by hand and points at the monthly ops drill. That drill was retired on the 6th, covered in last week's post. The methodology cites a process that doesn't run. Second, an evaluation the same day put five tools through it and dropped three, which is the right ratio, but the two it kept are both prompt-side: a repo-digest wrapper for the daily scan, and a compressed instruction file for one lane, measured at 2,043 words against a 3,397-word baseline that loads on every turn before a runtime block of roughly 4,000 words. Neither has passed a check yet. The methodology's first real test is whether Monday's review says "keep testing" on all eleven rows, which would mean it has a registry and no verdicts.

Expensive-lane share, for the record: 15.6% on the 9th and 15.4% on the 10th, the only two live readings since the share script was fixed, both over the 15% cap. There was no reading on the 11th or 12th, for the reason above.
