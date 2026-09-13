---
layout: post
title: "The week the plan said nothing was executed"
date: 2026-09-13
categories: [blog]
tags: [AI, agents, LLM, orchestration, automation, cost, routing, backups, operations, developer practices, weekly]
---

<style>
    .e-content p {
        text-align: justify;
    }
</style>

The plan for the agent swarm is dated the 30th of August, and its header still reads "planned, nothing executed". A week later there were 94 closed tickets, 20 agents on the board, and the first real number on whether cheap routing costs correctness. I'm writing this a week late from the git log and the agents' own notes, because the daily retro that should have written it for me didn't exist yet.

## What the plan said

It's a careful document. Four pools of inference, an explanation of why a single-process agent graph can't use the subscription seats, and a pick of an orchestrator that makes no model calls of its own and can spawn a different CLI with a different environment per agent. Three lanes on day one, three phases, each with a gate. Phase 1 was "stop the crash loop", because the daemon was restarting every ten seconds against a port another service had taken. The restart counter was at 279.

The note also names its biggest open problem, in a section headed exactly that. The work lane needs its own credentials, the coding CLI reads those from one file per home directory, and the orchestrator can't override the home directory. A config-dir override might work. The note calls it unverified and says phase 2 tests it before the lane is assumed to exist.

## The plan lasted about a day

The same date carries two daemon fixes in git and thirty tickets that are now closed. Health checks for five lanes, credential setup for two of them, a weekly retro, a daily standup.

So the "unverified" config-dir question got answered on day one by doing it, and by the end of the week it was the mechanism holding the whole thing up. The three planned lanes became 20 agents once every provider got fanned out into a cheap, a mid and an expensive tier, and by the 5th the lane table in the agents' shared instructions was already stale.

The plan wasn't wrong. Its analysis of the constraint, seats versus gateways, still drives the lane design. What didn't survive was the gated-phase shape. Nobody ran phase 1's three-part gate; the daemon got fixed, tickets flowed, and the gate became moot.

What did survive was the plan's insistence on provider-side evidence, "never from the agent's own summary". Two days in that became a rule: no config fix closes without a live probe from the affected lane.

## Routing was the week's real argument

The worry showed up on the first day. One ticket asks whether the expensive lane is doing all the work instead of delegating, and my own comment on another reads "it seems not routing is ever happening!"

By the 2nd there was a number. The retro on the 1st counted 48 tickets for the week and the metered top-tier lane took 16 of them, while the two flat-rate lanes took 3 between them, because they were pinned to model ids that didn't resolve. Cheap work was silently falling through to the expensive lane. The response was a script the retro could run to print tickets per agent and the share held by the expensive tier against a 15% cap. Measure it first, then argue.

The argument moved on the 6th, to the question the cost counter couldn't answer: is the cheap lane actually producing worse work? An audit went through all 94 closed tickets and found the non-expensive lanes escalated or reworked on 3 of them, 5.2%, against 1 (2.8%) for the top tier. Under the audit's own 10% threshold, routing stays as it is.

Two findings from that audit matter more than the headline. First, twelve of the sixteen non-clean tickets traced to infrastructure: a dead credential file, an org spend limit, an undeployed model pin, a runtime offline. All 27 failed rows in the task queue carried an infra failure reason, and none recorded a lane giving a wrong answer. Second, the first pass at counting was wrong, because it keyed on who the ticket was assigned to, and the expensive lane had been the squad leader for most of the window. Its triage runs sat on tickets it never executed, which inflated every cheap lane's apparent escalation rate; 11 of 14 apparent cheap-to-expensive escalations dissolved on reading them. The right key is the first task row that isn't the leader's.

The expensive share itself was still 38.3% on the 6th, against the 15% cap. It was falling, 51.7% on the 30th to 25.9% on the 5th, as two changes pushed the default router off the metered lane and onto the flat-rate seat. And the share script turned out to die with `Argument list too long` on a 30-day window, which the audit noted and did not fix.

## The migration that got measured out of existence

One epic was to move the orchestrator's control plane off the laptop and onto the Kubernetes cluster. Stage 1, on the 5th, settled the target shape and recommended proceeding. The same evening a second look asked the question the epic hadn't, whether the move earns its cost, and answered no.

The reasoning is short. The headline benefit was backups, and the board genuinely had none: no timer, no cron, no dumps on disk. But a dump of the live database ran in 1.8 seconds and produced 5.2 MB, so a systemd timer on the laptop closes that gap without any migration. The resilience benefit ran the wrong direction, because the daemon and three of the five auth classes are bound to the laptop and can't move, so the cluster would be a second hard dependency rather than a replacement for the first. And the target node was at 151% of RAM in committed limits with no swap, and its Postgres had been OOM-killed 423 times.

The component being migrated away from was the one that wasn't crashing: zero restarts since the 2nd, containers up six days.

I think this is the best decision of the week. Stage 1 had already found the node capacity problem and recommended proceeding anyway; the cost-benefit note applied the same gate that had already cancelled in-cluster workers to the control plane too, and got a different answer.

The backup timer it recommended instead is not in the week's git log. As of the 6th the board was still unbacked; the notes say so twice.

## A drill that lived for an afternoon

On the afternoon of the 6th an agent added a monthly hands-on ops drill: a runbook plus a scheduled announcer that would chase me to walk backup restore, credential rotation and a manual revert once a month. Building it surfaced three real constraints. The scheduler ORs day-of-month against day-of-week, so "first Monday" isn't expressible in its cron. The CLI can't update an existing agent's environment, so a secret can only be rotated through the web UI. And a run-only scheduled job can't read a repo, so the runbook had to be duplicated into the tracking ticket.

By that evening I'd retired it. Recovery work goes to agents. What has to stay trustworthy is the documentation plus executable tests that validate it, not a human walking the path once a month.

One thing the record gets wrong here, which is the kind of thing this series is for. The retirement note says the runbook "was never actually committed to the repo" and exists only in the ticket body. The git log says otherwise: two commits landed it that afternoon, and the file is on master now. The note was written by a cheap lane and I can't tell from it what it read, but the checkout disagrees with it, and a note that contradicts the git log is the same species of problem as the audit keying on the assignee.

What the retirement didn't retire is the gap. There's still no off-machine backup and no snapshot or restore script. A recovery path no agent has run is unverified in exactly the way a path no human has walked was. I chose to make the rails exist and be tested rather than keep a calendar reminder, and at the end of the week the rails didn't exist yet.

## The record started on the 5th

This post could be written at all because on the 5th the swarm adopted a shared knowledge directory, split into single-writer lane segments plus an append-only journal where one entry is one new file, so concurrent runs can't collide. Nearly everything above from the 5th and 6th comes from that journal. Everything from the 30th to the 4th comes from commit messages and ticket titles, which is why the first half of this post is thinner than the second.

The next day an agent reviewed an upstream tool for the same format and didn't adopt it, because it writes outside the bundle root and emits YAML no parser accepts. What transferred was the defect class: our own write script quoted scalars by heuristic and our lint checked front matter with regexes, so both got hardened the same day.
