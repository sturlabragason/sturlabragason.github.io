---
layout: post
title: "Title: Enhancing CI/CD with AI: A Practical Example with Terraform."
date: 2023-04-15
categories: [blog]
tags: [AI, Language Models, LLM, software development, Terraform, code validation, error fixing, infrastructure, terraform plan, terraform apply, AgentGPT, Auto-GPT]
---

## Introduction:

In the modern era of software development, artificial intelligence (AI) is playing an increasingly significant role in making the coding process more efficient and less error-prone. AI-powered Language Models (LLMs) can now assist developers in various tasks, from validating code to fixing it before deployment. In this blog post, we will explore an example of using LLM agents to streamline the process.

Let's look at a simple example of working with Terraform code.

## Example: Dynamically applying fixes to Terraform Code with LLM Agents

Here's how LLM agents can assist in creating infrastructure with Terraform:

1. **Sending the code to the LLM agent:** First, the LLM agent is sent a copy of the Terraform code via an API. The agent then predicts what to expect from the code execution and saves the expected outcome.

2. **Executing terraform plan:** The LLM agent runs the 'terraform plan' command, which generates an execution plan detailing the changes to be made to the infrastructure. The output of this command is sent back to the LLM agent for interpretation.

3. **Interpreting the output:** Based on the output received from 'terraform plan', the LLM agent takes one of the following actions:

    a) **If there's an error:**
        - The LLM agent locates the source of the error and queries the documentation for the specific resource/s involved.
        - It then makes an attempt to fix the error and pushes a commit to back to the repository with the updated code, starting the process over.

    b) **If there's no error:**
        - The LLM agent compares the expected outcome it saved earlier with the interpreted outcome of the 'terraform plan' command.
        - If the two outcomes roughly match, the LLM agent can proceed to execute the 'terraform apply' command, deploying the infrastructure changes as planned.

Here is the process visualized:

@startmermaid
graph TB
    A[Terraform Code] --> B[Send Code to LLM Agent via API]
    B --> C[Predict & Save Expected Outcome]
    C --> D[Execute Terraform Plan]
    D --> E[Interpret Output]
    E --> F[Error Found?]
    F -->|Yes| G[Locate Error Source & Query Docs]
    G --> H[Fix Error & Push Commit]
    H --> A
    E --> I[Compare Expected and Interpreted Outcomes]
    F -->|No| I
    I --> J[Execute Terraform Apply]
@endmermaid


Here is some imagined psudocode of what it might work like:

<script src="https://gist.github.com/sturlabragason/dfbfa723db8219f5c12a8eddeba9a1ab.js"></script>

 python terraform_llm_agent_workflow.py would then contain something like:

 <script src="https://gist.github.com/sturlabragason/6b619686d7a1375dd270f47221ac127a.js"></script>


Work is already being done in this same field for example with [AgentGPT](https://github.com/reworkd/AgentGPT) and [Auto-GPT](https://github.com/Significant-Gravitas/Auto-GPT).