---
layout: post
title: "How I Used Terraform, Azure Functions, and Pwsh to Build a Cloud Compliance Web Interface with Synapse Serverless"
date: 2023-03-01
categories: [blog]
tags: [terraform, pwsh, azure-functions, azure-synapse]
---

## Introduction

In this blog post, we will explore how Terraform, Azure Functions, and Pwsh can be used together to query a Synapse serverless instance and expose some of the data through API calls. 

- **Terraform** is an open-source infrastructure as code (IAC) tool used to build, change, and version infrastructure safely and efficiently. It codifies APIs into declarative configuration files that can be shared amongst team members, treated as code, edited, reviewed, and versioned.

- **Pwsh** (PowerShell) is a cross-platform task automation and configuration management framework from Microsoft, consisting of a command-line shell and scripting language built on the .NET Framework. PowerShell provides full access to COM and WMI, enabling administrators to perform administrative tasks on both local and remote Windows systems.

- **Azure Functions** is a serverless compute service that enables you to run event-triggered code without having to provision or manage infrastructure. You can use Azure Functions to build web, mobile, and IoT applications with seamless integration to other Azure services.

- **Azure Synapse** is a limitless analytics service that brings together big data and data warehousing. It gives you the freedom to query data on your terms, using either serverless on-demand or provisioned resources—at scale.

With the cost of Synapse Serverless being low, this approach allows for cost-effective querying of large amounts of data, making it an ideal solution for organizations with budget constraints. Together, Terraform, Azure Functions, and Pwsh provide a powerful toolset for querying and exposing data from a Synapse serverless instance through APIs, making it easier to manage and monitor cloud compliance while keeping costs low. 


<script src="https://gist.github.com/sturlabragason/0691ee74a713834217209e48ca40edc6.js"></script>
