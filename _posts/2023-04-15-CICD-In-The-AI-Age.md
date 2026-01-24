---
layout: post
title: "Fixing Terraform errors with AI Agents"
date: 2023-04-15
categories: [blog]
tags: [AI, LLM, Terraform, Infrastructure, Automation]
---

<style>
    .e-content p {
        text-align: justify;
    }
</style>

I spend a lot of time fixing stupid Terraform errors. Missing brackets, wrong resource names, or just forgetting a required argument. It’s annoying to wait for a pipeline just to be told I made a typo.

So I wrote a script to see if an AI agent could fix them for me.

The idea was simple: instead of just using an LLM to generate code that I then have to debug, I wanted an agent that could run the commands itself, see the error, and try to fix it.

## The Loop

I set up a feedback loop that looks like this:

<img src = "https://sturlabragason.github.io/images/diagram.png" alt = "Diagram" />

It creates a wrapper around the Terraform CLI. When I push code, the agent runs `terraform plan`.
If the plan fails, the agent grabs the error output, reads the docs (or just hallucinates them, let's be honest), and applies a patch to the file. Then it runs `plan` again.
If the plan succeeds, it compares the result to what I actually asked for. If it matches, it runs `terraform apply`.

## The Implementation

I used a GitHub Workflow to trigger the agent. It’s nothing fancy, just a python script running in a container.

Here is the workflow config:
<script src="https://gist.github.com/sturlabragason/dfbfa723db8219f5c12a8eddeba9a1ab.js"></script>

And here is the python script that actually drives the logic. I mashed it all into one file here so it's easier to read, but you’d probably want to split this up in a real project.

<script src="https://gist.github.com/sturlabragason/6b619686d7a1375dd270f47221ac127a.js"></script>

## Does it actually work?

Sort of.

For syntax errors and missing arguments, it’s great. It catches the stuff I usually miss when I’m rushing. It feels pretty magical to push broken code and watch a commit come back a minute later with the fix.

But it’s definitely not perfect. It can get into update loops where it tries the same broken fix over and over. It also struggles with complex logic errors where the infrastructure state doesn't match the code in subtle ways.

It’s not going to replace a senior DevOps engineer anytime soon, but as a sanity check before I bother a human reviewer? It’s surprisingly useful.


