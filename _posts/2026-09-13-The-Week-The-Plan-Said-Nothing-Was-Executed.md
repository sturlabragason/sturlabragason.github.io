---
layout: post
title: "The week the plan said nothing was executed"
date: 2026-09-13
categories: [blog]
tags: [AI, agents, LLM, orchestration, Multica, Claude Code, OpenCode, OKF, automation, cost, routing, testing, operations, weekly]
---

<style>
    .e-content p {
        text-align: justify;
    }
</style>

On the 30th of August I had a research note headed "planned, nothing executed" and a daemon crash-looping every ten seconds. A week later there were 20 agents on the board and 94 closed tickets. This is what got built that week, where each piece came from, what it added, and how I know it works. Written a week late from the git log and the agents' own notes.

## Multica, the orchestrator

The problem the note starts from is four pools of inference and no single place to aim them: a metered Claude endpoint on Azure AI Foundry, a work Claude Code seat, a personal Claude Code seat, and a flat-rate OpenAI-compatible provider used through OpenCode. Every session on the machine had been going to the expensive model by default because one environment variable said so, and the flat-rate plan sat nearly unused.

The obvious design is a gateway in front of all four. It doesn't work, and the reason is licensing rather than code. Anthropic doesn't support routing Claude Code to non-Claude models through a gateway, and setting a gateway credential in a session disables the subscription seat for that session. So any orchestrator that holds every provider key in one process can't use either seat. That ruled out the single-process agent frameworks and left process-per-worker designs.

I picked [Multica](https://github.com/multica-ai/multica), an open-source issue tracker whose assignee can be an agent, plus a local daemon that finds agent CLIs on `PATH`, spawns one per task in an isolated directory, and streams the output back as issue comments. Three things fall out of it without building anything. Each agent record carries its own environment map, so one agent can be Claude Code pointed at Foundry while another is OpenCode pointed at the flat-rate provider, concurrently. Squads give a one-hop dispatcher: assign a ticket to the squad, the leader reads the roster, posts one delegation comment, and stops. And the board is a web kanban with a phone app, which was the requirement that decided it over a terminal UI.

The install already existed on the box from June, two months behind upstream and dead. The daemon was restarting every ten seconds, restart counter at 279, because another local service had taken port 8080 and the daemon's own health probe accepted any HTTP response as "backend alive". The fixes were a port move to 8088, a dual-stack loopback binding fix so `localhost` resolved to the right thing, and pointing the daemon's server URL at the machine hostname so sandboxed tasks could reach the control plane. Postgres, backend and frontend run under podman; the daemon is a systemd user unit.

The gate I wrote for that phase was three parts: `systemctl --user status` reads `active (running)` with the counter no longer climbing, `multica issue list` returns JSON rather than a parse error, and a ticket created on the phone shows up on the desktop board. All three passed on day one.

## Lanes, and the seat problem

The plan's stated open problem was the work seat. Claude Code reads credentials from one file per home directory, and Multica can't override `HOME`. The note guessed that `CLAUDE_CONFIG_DIR` would point Claude Code at a separate config directory and marked it unverified.

It works. Each Claude Code lane now gets its own config directory injected through its environment, so the work seat, the personal seat and the Foundry endpoint are separate processes with separate credentials and nothing shared at runtime. Two days in, the three planned lanes became 20 agents when every provider got fanned out into an opus, a sonnet and a haiku tier, so a squad can be composed of the cheap version of a lane for lookups and the expensive one for review.

The test for a lane is a live probe from the provider side, never the agent's own summary. That was in the plan and on the 2nd it became a rule: no config or environment fix closes without a live probe from the affected lane. Two scripts carry it. `probe-models.sh` asks each lane which model it can actually reach and writes the answer to a cache; `lane-health.sh` asks whether the lane is up right now, with the cheapest model on the lane, and caches the result with a TTL so the router can afford to check before every dispatch. The health script got its first real fix on the 6th, when tier names like `claude-work-sonnet` weren't resolving to the seat they run on.

## A counter for the cost ladder

The routing policy is a ladder sorted by price: cheap flat-rate models take lookups and drafting, mid-tier takes most feature work, the expensive tier is for planning, review and judging. The worry from day one was that it wasn't happening. My own comment on a ticket from the 30th reads "it seems not routing is ever happening!"

By the 2nd there was a number. The retro counted 48 tickets for the week, and the metered opus lane took 16 of them while the two flat-rate OpenCode lanes took 3 between them, because they were pinned to model ids that didn't resolve. Cheap work was silently falling through to the expensive lane.

`lane-share.sh` is the answer. It prints closed tickets per agent over a trailing window and the share held by any agent whose live model is opus, discovered from the agent list rather than hardcoded, and exits 1 when the share is over a threshold. The cap is 15%. The retro runs it weekly.

On the 6th an audit asked the question the counter couldn't: is the cheap lane producing worse work? It went through all 94 closed tickets and found the non-opus lanes escalated or reworked on 3 of them (5.2%), against 1 (2.8%) for opus. Under the audit's own 10% threshold, routing stays. Two findings from it matter more than the headline. Twelve of the sixteen non-clean tickets traced to infrastructure, a dead credential file, an org spend limit, an undeployed model pin, a runtime offline, and none recorded a lane giving a wrong answer. And the first count was wrong, because it keyed on the assignee, and the opus lane had been squad leader for most of the window; its triage runs sat on tickets it never executed, which inflated every cheap lane's apparent escalation rate. 11 of 14 apparent escalations dissolved on reading them. The right key is the first task row that isn't the leader's.

The opus share was 51.7% on the 30th, 25.9% on the 5th, and 38.3% on the 6th, still over the cap, as two changes moved the default router off Foundry and onto the work seat. And `lane-share.sh` died with `Argument list too long` on a 30-day window because it passed the whole ticket list as a Python argv. The audit noted it; the fix came the following week.

## A shared memory the agents can't corrupt

Until the 5th, what an agent learned lived in issue comments and was gone by the next run. On the 5th the swarm adopted [OKF](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md), Google Cloud's Open Knowledge Format, as a knowledge bundle in the repo. Each lane and each scheduled process owns exactly one segment directory and writes only there. Cross-cutting notes go to a shared journal where one entry is one new file named after the date and the actor, so two concurrent runs can't generate the same path and there's no shared file to append to.

Two scripts enforce it. `okf-write.sh` is the only sanctioned writer and refuses a segment the actor doesn't own. `okf-lint.sh --staged` reads the diff before it lands and fails the run if any changed path crosses a segment boundary or is a journal file named after another actor. That check is what makes concurrent writers safe; it's enforced at the diff, where it's cheap, not at runtime.

On the 6th an agent reviewed an upstream OKF tool and didn't adopt it, because it writes outside the bundle root and emits YAML no parser accepts. What transferred was the defect class: our own writer quoted scalars by heuristic and the lint checked front matter with regexes, so both got hardened the same day. Nearly everything in this post from the 5th on comes from that journal; everything before it comes from commit messages and ticket titles, which is why the first half is thinner.

## Cheap reads off the expensive model

Also on the 6th, a review of Spotify's shunt approach to token reduction turned into a hook. A pre-tool gate blocks whole-file reads over 350 lines and redirects them to `bulk-read.sh`, which sends the file to a cheap lane (haiku by default, a local model on request) and returns a line-cited digest, so the file body never enters the expensive model's context. A sibling script does the same for boilerplate writes. Ranged reads are never blocked, there's a kill switch, and the threshold is an environment variable. The digest cites line numbers on purpose so the caller can verify a claim without re-reading the file.

## Two things that got measured out of existence

One epic was to move Multica's control plane off the laptop and onto the Kubernetes cluster. The stage that settled the target shape recommended proceeding. The same evening a cost-benefit pass answered no. The headline benefit was backups, and the board had none, but a `pg_dump -Fc` of the live database ran in 1.8 seconds and produced 5.2 MB, so a systemd timer closes that gap without a migration. The resilience benefit ran the wrong way, because the daemon and three of the five auth classes are bound to the laptop, so the cluster would be a second hard dependency rather than a replacement. And the target node was at 151% of RAM in committed limits with no swap and a Postgres that had been OOM-killed 423 times, while the containers being migrated away from had zero restarts in six days. Best decision of the week. The backup timer it recommended instead still wasn't in the git log at the end of it.

The other was a monthly hands-on ops drill: a runbook plus a scheduled announcer that would chase me to walk backup restore, credential rotation and a manual revert. Building it surfaced three real constraints of the platform. Multica's scheduler ORs day-of-month against day-of-week, so "first Monday" isn't expressible. `multica agent update` has no way to change an existing agent's environment, so a secret can only be rotated through the web UI. And a run-only scheduled job can't read a repo, so the runbook had to be duplicated into the ticket. I retired it the same evening: recovery work goes to agents, and what has to stay trustworthy is the docs plus executable tests that validate them, not a human walking the path once a month. The gap it was covering is still open. There's no off-machine backup and no restore script, and a recovery path no agent has run is unverified in exactly the way a path no human has walked was.

The retirement note, written by a cheap lane, says the runbook "was never actually committed". Two commits say otherwise and the file is on master. A note that contradicts the git log is the same species of problem as the audit keying on the assignee, and it's the reason every number above says where it came from.
