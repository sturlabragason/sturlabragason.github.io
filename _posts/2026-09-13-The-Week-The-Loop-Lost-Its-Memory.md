---
layout: post
title: "The week the loop lost its memory"
date: 2026-09-13
categories: [blog]
tags: [AI, agents, LLM, orchestration, Multica, Claude Code, git, autopilots, failover, change management, gitingest, testing, operations, weekly]
---

<style>
    .e-content p {
        text-align: justify;
    }
</style>

The daily improvement loop came online on Monday the 7th, wrote three retros nobody could read, found out on Thursday, and by Sunday had a methodology for how changes to itself get tested and rolled back. This is what got built in the second week, where it came from, what it adds and how it's checked. Unlike the first week, the record was mostly written by the loop itself.

## The daily loop and its sensors

The loop is a set of Multica autopilots, scheduled prompts that open a run on a lane. Three sensors run on weekday mornings before the retro: an AI-practice scan at 07:30, an ecosystem scan at 07:45, and from the 10th a session-insights pass at 07:50 that reads the previous day's Claude Code transcripts. The daily retro runs at 08:00, reads the three, and writes one entry into its own segment of the knowledge bundle. A daily release-notes process added the same day writes an entry every weekday evening from the tickets closed that day, so anything the loop changes shows up there without a lane having to write it.

The ecosystem scan got retooled on the 7th, at my request, around GitHub Trending with Hacker News demoted to secondary. GitHub publishes no API for `/trending` and the third-party mirrors go stale silently, so `github-trending.sh` scrapes the page and parses the markup. It exits non-zero with "parsed 0 repositories" when the markup changes, so a broken scraper can't masquerade as a quiet day. The three windows are read differently by design: daily is breakout noise, weekly is the one to trust, monthly is what already became durable, and a repo present in two or three windows is the strongest signal on the page. Trending is where a tool shows up; HN is where a practice or an argument shows up.

Day one found two things wrong with the loop's own inputs. The retro's cron fired at 07:00, before the sensors it was supposed to read, and `lane-share.sh` died with `Argument list too long`. Both were fixed the same week. What the loop didn't find is the subject of the next section.

## Deterministic gates before an agent runs

A pattern from a Google Developers Blog post on the 2nd, tiered routing, where cheap deterministic checks run before any model call, became a rule for autopilots on the 8th. If a scheduled job exists to check whether there's work, it doesn't get a schedule trigger. A zero-cost shell script runs from cron, performs the filter, and calls `multica autopilot trigger` only when candidates exist; the prompt then assumes there is work to do. The first application was the hourly stalled-ticket sweep, which had been spinning up an agent 168 times a week to run a bash query and exit silently. `stalled-sweep-pregate.sh` replaces those runs. The check is whether the autopilot's run list shows skipped runs on quiet days and no missed real trigger; nothing is recorded against it yet.

## Merge-back, or why three retros were each the first

The retro on the 7th opens "This is the first daily-retro run". So does the one on the 8th. The 7th's entry existed, on a branch, and the run on the 8th was cut from a master that had never seen it. It took until the 10th for a run to notice that master was sitting on a commit from the 7th with 58 of 61 local branches ahead of it, and that the trending script the ecosystem scan had been told to use for three days existed only on one agent's branch. The process built to catch drift ran three times on top of the drift and reported a clean board each time.

The cause is that Multica gives each run a fresh checkout on its own branch and nothing merges it back. The fix was measured before it was attempted. Replaying all 62 branches into master in commit-date order conflicted on 48, and almost none were disagreements about work. A health-check TTL cache that every check rewrites was tracked in git. The repo had no `.gitignore`, so agents' scratch files went into every baseline commit. And each knowledge segment had one shared append-only log file, the exact hazard the journal's one-file-per-entry design had removed everywhere else. Remove those three and the same replay drops to 10 conflicts, all old commits master had already superseded.

`merge-back.sh` merges the current run's branch into the trunk in the main checkout, and `--sweep` merges every agent branch the trunk doesn't contain. Conflicts are never auto-resolved: the merge is aborted, the paths are printed, and the script exits 2. Every run that commits calls it before exit. It needed fixing three times in its first nine minutes. `for-each-ref` matches one path component, so the sweep matched no `agent/<lane>/<id>` branches and silently did nothing. Old branches still carried the cache file, so every one conflicted modify/delete, and the `check-ignore` call meant to resolve that needed `--no-index` because a conflicted path sits in the index. And the agents' shared instruction file was the other big conflict source, because the daemon injects a per-run runtime block into it and every `git commit -a` captured it; that became a git clean filter in `.gitattributes` rather than a rule to remember.

The backstop is `merge-back-sweep-report.sh`, a cron job that runs the sweep as a dry run daily and logs the ahead-of-master count, report-only, following the trust ramp of report first, scoped writes second, unattended writes last. The success check is `git branch --no-merged master | grep -c agent/` staying at 0 across a week of runs. As of the 12th two runs had merged back cleanly. On the 13th an unexplained two-blank-line diff on the instruction file showed up in a worktree and was discarded without diagnosis. Watching that.

## The seat died and the loop didn't say so

The retro for the 11th has three comments, at 06:15, 07:00 and 08:00, all the same line: "You've hit your individual spend limit". There's no retro entry for the 11th. The next thing on the ticket is me, on the 13th, asking why every work task is failing.

The router watchdog, an autopilot that runs `lane-health.sh` and flips the squad leader when the work seat goes red, had done its job and flipped the leader to the metered fallback. But a seat failover has three surfaces: squad leader, autopilot assignee, and open-ticket assignee. Eight autopilots and eight open tickets were pinned directly to the dead seat's agents, so the retro, the standup and the sensors kept dispatching into it for two days. Flipping only the first surface looks like a working failover and isn't.

Two more things fell out. The watchdog's own cron trigger had a next-run time stuck eleven hours in the past while the backend reported healthy; toggling the trigger off and on re-armed it. And the hourly stalled-ticket sweep was active with an empty trigger list, so it could never fire and nothing noticed. An active autopilot with zero triggers is silently dead, and there's no check for that yet. On cheaper fallback models: Claude Code on Foundry addresses one vendor's deployments only, so the haiku tier there is the floor for work-context failover, and the flat-rate lanes are on the wrong side of the pool boundary.

## Every tool surface under git

On the evening of the 12th I wrote, in a ticket, "We need a way to be able to prototype things, evaluate them, promote them, and version control them. So far on most tools we have just been implementing them globally and rolling out with no easy way to roll back."

The prerequisite landed ten minutes later. There are five Claude Code config homes on the machine, one per lane, none of them a git repository, and the autopilot prompts, agent definitions and squad instructions existed only as live state in Multica's database. `export-claude-home.sh` copies skills, hooks, settings and the instruction file from each home into `claude-home/<home>/` in the repo, never touching credentials, history or session state. `export-multica-config.sh` dumps every agent, autopilot and squad to JSON through the CLI, which redacts secrets. The `import-*.sh` counterparts push a committed version back, and the Multica one only pushes the text field each surface is edited through, never model, environment, membership or trigger fields, so a stale export can't clobber routing. Rollback is `git revert` plus import. The first real promotion through it, a prompt change to the retro autopilot, worked on the 13th. The re-export showed the snapshot carries volatile fields like `updated_at` and `last_run_*`, so a clean drift diff isn't possible until those are stripped.

## A methodology for changing the rules

The methodology itself is four stages, written two minutes after the ticket. A prototype is a named `-rc` or `-candidate` copy in one lane, project or worktree, never an edit to the global file, committed from the first draft. Evaluation needs a machine-checkable success condition written before the run, a run against real work, and an isolated verifier that reads only the artifact and the check, not the author's transcript, because the run that wrote a change over-reports its success. Promotion is one commit that names its own rollback command. Rollback is the default response to a regression, not investigation.

On the 13th it got a registry. `docs/prototypes.md` lists every change under test with its surface, scope, start date, success check and last evidence; `prototype-status.sh` exits 1 when a row has been testing for more than 21 days without a decision, and `--unregistered` lists closed tickets that changed a tool and have no row. The Monday retro rules promote, keep or drop on every row. It was seeded with eight changes from the 7th onward that had never been formally promoted, so the merge-back script and the clean filter are retroactively prototypes, first review on the 14th.

The same day five candidate tools went through it. [gitingest](https://github.com/coderamp-labs/gitingest) turns a repo you haven't cloned into one text blob with a token count, which fills the gap in front of the bulk-read shunt for the daily scan; it's a prototype as `repo-digest.sh`, and the check is that over a week every scan finding about a repo cites a digest-derived file path or symbol rather than the README. Prompt compression is the second prototype: the instruction files loaded on every turn total 3,397 words before the runtime block, several rules appear two or three times, and a compressed candidate for one lane is 2,043 words. It's promoted only if a five-issue replay on the candidate shows no behaviour diff to an isolated verifier, a lesson borrowed from a GitHub Copilot cost write-up where offline evaluation missed a regression that online behaviour exposed. Three were dropped: a second orchestrator that drives harnesses on provider API keys, which the seat constraint forbids; an A2A client with no A2A agent on the other side; and a chat-only skill with nowhere to be invoked in an issue run.

Two things I'd flag. Stage 4 of the methodology says rollback paths get walked by hand and points at the monthly ops drill, which I retired last week; it cites a process that doesn't run. And the first Monday review could plausibly say "keep testing" on all eleven rows, which would mean the methodology has a registry and no verdicts. The opus share, for the record: 15.6% on the 9th and 15.4% on the 10th, the only two live readings since the counter was fixed, both over the cap, and no reading on the 11th or 12th for the reason above.
