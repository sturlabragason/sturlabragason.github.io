---
layout: post
title: "Building a Cloud-Based Analytics Interface with Terraform, Azure Functions, and Pwsh."
date: 2023-03-01
categories: [blog]
tags: [terraform, pwsh, azure functions, azure synapse, proprietary solution, serverless, infrastructure as code, API calls, data querying, data analytics]
---

## Introduction

Data analytics have become an essential tool for businesses today. However, querying large volumes of data can be expensive and time-consuming, leading to organizations seeking cost-effective and efficient solutions. In this blog post, we will explore how to leverage Terraform, Azure Functions, and Pwsh to query Synapse serverless instances and expose data through APIs, providing a cost-effective alternative for businesses to analyze their data.

<b><u> Note:</u></b> Sharing only the necessary code, since this is a part of proprietary solution for managed cloud compliance that automates compliance monitoring and reporting, provides expert knowledge, and helps organizations meet global standards, identify risks, and enforce policies in their cloud environment.

Prior knowledge of the following tools is assumed:

- [**Terraform**](https://www.terraform.io/) is an open-source infrastructure as code (IAC) tool used to build, change, and version infrastructure safely and efficiently. It codifies APIs into declarative configuration files that can be shared amongst team members, treated as code, edited, reviewed, and versioned.

- [**Pwsh**](https://docs.microsoft.com/en-us/powershell/) (PowerShell) is a cross-platform task automation and configuration management framework from Microsoft, consisting of a command-line shell and scripting language built on the .NET Framework. PowerShell provides full access to COM and WMI, enabling administrators to perform administrative tasks on both local and remote Windows systems.

- [**Azure Functions**](https://azure.microsoft.com/en-us/services/functions/) is a serverless compute service that enables you to run event-triggered code without having to provision or manage infrastructure. You can use Azure Functions to build web, mobile, and IoT applications with seamless integration to other Azure services.

- [**Azure Synapse**](https://azure.microsoft.com/en-us/services/synapse-analytics/) is a limitless analytics service that brings together big data and data warehousing. It gives you the freedom to query data on your terms, using either serverless on-demand or provisioned resources—at scale.

Due to its low cost, Synapse Serverless is a cost-effective solution for querying large volumes of data, making it suitable for organizations with budgetary constraints. Terraform, Azure Functions, and Pwsh together provide a robust toolset for querying and exposing data from a Synapse serverless instance through APIs.

## Setting up the Environment

The environment used for this project was Azure DevOps and Terraform for deploying the solution to Azure. The solution involves multiple resources, including Azure Functions and Synapse serverless instances which were all deployed using Terraform. Additionally, other components related to the solution were deployed using Azure Pipelines.

In this setup, the Terraform code is deployed using Azure DevOps Pipelines. Prior to running <code>terraform apply</code>, several <code>__variables__</code> are replaced, enabling certain features in the code later. It is worth noting that the default Azure DevOps agents come equipped with both Azure CLI and PowerShell [pre-installed](https://github.com/actions/runner-images/blob/main/images/linux/Ubuntu2204-Readme.md). 

## Using Terraform to Provision the Synapse Serverless Instance and creating the database

The code creates an Azure Synapse Workspace, followed by the creation of a database, and finally granting access to the database via connection to the serverless instance.

Here are the relevant code snippets:

<script src="https://gist.github.com/sturlabragason/96ef1058be3a69913ac70e8947f00883.js"></script>

The code defines and creates the Azure Synapse workspace and a database on the serverless endpoint. It also grants the function apps managed identity access to the Synapse serverless database.

Here's a step-by-step breakdown of the code:

- The code defines the Azure Synapse workspace.

- The code creates a null resource called synapse_create_db, which will execute a local PowerShell script to create a database on the serverless endpoint. 

- The code creates another null resource called synapse_sql_access, which will execute a local PowerShell script to grant access to the function apps managed identity to the Synapse serverless database.


## Exposing Data to API Calls
Azure Functions is a serverless compute service that enables you to run event-triggered code without having to provision or manage infrastructure. I used Azure Functions to build an API that exposes the data extracted from the Synapse instance. At this point the SQL database created in the previous step has already been populated with data from the proprietary solution.

By deploying an API through Azure Functions, users can efficiently and cost-effectively query a specific slice of the Synapse data exposed by the API instance as determined by the code.

We create an Azure Windows Function App and deploy it using a zip file, with the app settings configured to include several environment variables. The function app is given access to various Azure resources such as storage accounts, a SQL database, and a Synapse workspace.

Here are the relevant code snippets:

<script src="https://gist.github.com/sturlabragason/b8515e52fb2baefcc2855d168d2f02f9.js"></script>


## Querying the Synapse Serverless Instance

As mentioned in the previous section, the PowerShell code below has been deployed  This was done through the deployment of the <code>"null_resource" "deploy"</code> resource. 

The Powershell code connects to the Synapse Serverless Endpoint and queries the database created earlier. The results of the query are returned as a response to the API query.

<script src="https://gist.github.com/sturlabragason/e056da97409eb9fe688739b40d1c9c08.js"></script>

## Conclusion

In this blog post, we explored how Terraform, Azure Functions, and Pwsh can be used to query a Synapse serverless instance and expose data through API calls. We also saw how this solution can be cost-effective for organizations with budgetary constraints due to the low cost of Synapse Serverless.

Using Terraform, we provisioned the Synapse Serverless instance, created a database, and granted access to the database via connection to the serverless instance. We also used Azure Functions to build an API that exposes the data extracted from the Synapse instance.

This solution provides a robust toolset for querying and exposing data from a Synapse serverless instance through APIs, making it an ideal solution for organizations that require efficient and cost-effective data querying and analytics capabilities.

<b><u> Note:</u></b> This solution is part of a larger proprietary solution, and therefore, only the necessary sections of the code have been shared in this blog post.

Thank you for reading!