---
layout: post
title: "Experimenting with AI Agents for Terraform Deployments"
date: 2023-04-15
categories: [blog]
tags: [AI, Language Models, LLM, Terraform, Infrastructure, Automation, AgentGPT]
---

<style>
    .e-content p {
        text-align: justify;
    }
</style>

> Note: While this post uses infrastructure deployment as an example, this pattern of using AI agents to check and fix their own work applies to almost any process.

<img src = "https://sturlabragason.github.io/images/ff6353af-3365-403a-a2be-62e274aa2e87.jpeg" alt = "Clouds"  style="display: block; margin: auto;" /> 

## AI Agents Managing Infrastructure

Infrastructure deployments often fail for simple reasons—syntax errors, missing variables, or configuration conflicts that you only catch after waiting for the pipeline to run.

I wanted to see if AI agents could help here. Instead of just generating code, could an agent run the tools, interpret the errors, and fix them on its own?

This post explores a workflow where an LLM agent manages the Terraform lifecycle, effectively turning "code and hope" into a self-correcting loop.

## The Workflow: Detect, Fix, Deploy

The idea is to have an agent that doesn't just write code, but "understands" the deployment process. Here is how it works:

1.  **The Prompt:** We send the Terraform code to the agent via an API.
2.  **The Plan:** The agent runs `terraform plan`. This is the dry run that tells us exactly what will change.
3.  **The Decision:** The agent looks at the output.
    *   **If there’s an error:** It reads the error message, looks up the specific resource documentation if needed, and attempts to patch the code. Then it restarts the process.
    *   **If it works:** It compares the plan against the original request. If they match, it proceeds to `terraform apply`.

## Visualizing the Process

Here is a visual representation of that loop:

<img src = "https://sturlabragason.github.io/images/diagram.png" alt = "Diagram" />


Using a [Github Workflow](https://docs.github.com/en/actions/using-workflows), the implementation looks like this:

<script src="https://gist.github.com/sturlabragason/dfbfa723db8219f5c12a8eddeba9a1ab.js"></script>

The python script, `terraform_llm_agent_workflow.py`, handles the logic:

<script src="https://gist.github.com/sturlabragason/6b619686d7a1375dd270f47221ac127a.js"></script>

*Note: For this example, I've combined the functions into a single file for clarity, but in production, you would split these up.*

## Why This Matters

This approach shifts the developer's role from "fixing syntax" to "defining intent."

*   **Self-Correction:** The agent catches many of the typo-level errors that usually waste a developer's time.
*   **Validation:** It enforces a check between "what I asked for" and "what terraform is about to do" before applying.

## The Reality

It’s not magic. LLM agents can get stuck in loops, repeatedly trying the same failed fix. They can also hallucinate properties that don't exist, especially with complex providers. You still need to review what they do.

But as a proof of concept, it shows how we can move beyond simple code completion to actual task execution. Tools like [AgentGPT](https://github.com/reworkd/AgentGPT) allow for even more complex chains of thought.


