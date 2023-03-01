---
layout: post
title: "Building a Cloud-Based Analytics Interface with Terraform, Azure Functions, and Pwsh."
date: 2023-03-01
categories: [blog]
tags: [terraform, pwsh, azure functions, azure synapse, cloud compliance, serverless, infrastructure as code, API calls, data querying, data analytics]
---

## Introduction

In this blog post, we will explore how Terraform, Azure Functions, and Pwsh can be used together to query a Synapse serverless instance and expose some of the data through API calls. 

<b><u> As the solution is proprietary, I will only share the necessary sections of the code.</b></u>

Prior knowledge of the following tools is assumed:

- [**Terraform**](https://www.terraform.io/) is an open-source infrastructure as code (IAC) tool used to build, change, and version infrastructure safely and efficiently. It codifies APIs into declarative configuration files that can be shared amongst team members, treated as code, edited, reviewed, and versioned.

- [**Pwsh**](https://docs.microsoft.com/en-us/powershell/) (PowerShell) is a cross-platform task automation and configuration management framework from Microsoft, consisting of a command-line shell and scripting language built on the .NET Framework. PowerShell provides full access to COM and WMI, enabling administrators to perform administrative tasks on both local and remote Windows systems.

- [**Azure Functions**](https://azure.microsoft.com/en-us/services/functions/) is a serverless compute service that enables you to run event-triggered code without having to provision or manage infrastructure. You can use Azure Functions to build web, mobile, and IoT applications with seamless integration to other Azure services.

- [**Azure Synapse**](https://azure.microsoft.com/en-us/services/synapse-analytics/) is a limitless analytics service that brings together big data and data warehousing. It gives you the freedom to query data on your terms, using either serverless on-demand or provisioned resources—at scale.

With the cost of Synapse Serverless being low, this approach allows for cost-effective querying of large amounts of data, making it an ideal solution for organizations with budget constraints. Together, Terraform, Azure Functions, and Pwsh provide a powerful toolset for querying and exposing data from a Synapse serverless instance through APIs, making it easier to manage and monitor cloud compliance while keeping costs low. 

## Setting up the Environment

To set up the environment for this project, we utilized Azure DevOps and Terraform to deploy the managed compliance solution for Azure. The solution included various resources such as Azure Functions, Synapse serverless instance, and storage accounts, all of which were deployed using Terraform. 

Terraform is deployed using Azure Devops Pipelines and several ´__variables__´ are replaced before running ´terraform apply´ allowing for some of the tricks we see in the code later. The default Azure Devops agents also have both [Azure CLI and PowerShell installed](https://github.com/actions/runner-images/blob/main/images/linux/Ubuntu2204-Readme.md).


## Using Terraform to Provision the Synapse Serverless Instance and creating the database

Explain what Terraform is and how it was used in this project
Discuss the process of provisioning the Synapse serverless instance using Terraform

Below are relevant parts of the code 

<script src="https://gist.github.com/sturlabragason/96ef1058be3a69913ac70e8947f00883.js"></script>

The code defines and creates the Azure Synapse workspace and a database on the serverless endpoint. It also grants the function apps managed identity access to the Synapse serverless database.

Here's a step-by-step breakdown of the code:

1. The code defines the Azure Synapse workspace.

2. The code creates a null resource called synapse_create_db, which will execute a local PowerShell script to create a database on the serverless endpoint. The script uses the following steps:
   - Login to Azure using the service principal created for the user.
   - Get an access token to authenticate with the Azure SQL database.
   - Create a PowerShell function called SqlQuery that will execute a SQL query against the Azure SQL database.
   - Define a SQL query to create a database called "dbCompliance" if it does not already exist.
   - Call the SqlQuery function with the server instance, database, access token, and SQL query parameters to create the database.
   - The provisioner block uses PowerShell to execute the script.

3. The code creates another null resource called synapse_sql_access, which will execute a local PowerShell script to grant access to the function apps managed identity to the Synapse serverless database. The script uses the following steps:
   - Get a list of users that need access to the database, which includes the name of the function app and the name of the Synapse workspace.
   - Login to Azure using the service principal created for the user.
   - Get an access token to authenticate with the Azure SQL database.
   - Create a PowerShell function called SqlQuery that will execute a SQL query against the Azure SQL database.
   - For each user in the list, define two SQL queries:
     - The first query creates a login for the user if it does not already exist.
     - The second query creates a user for the login in the "dbCompliance" database and adds the user to the db_owner role.
   - Call the SqlQuery function with the server instance, database, access token, and SQL query parameters for each query to grant access to each user.
   - The provisioner block uses PowerShell to execute the script.

The final output of this code would be the creation of an Azure Synapse workspace, a database on the serverless endpoint, and the necessary permissions granted to the function apps managed identity to access the database.


## Querying the Synapse Serverless Instance

Pwsh (PowerShell) is a cross-platform task automation and configuration management framework from Microsoft, consisting of a command-line shell and scripting language built on the .NET Framework. PowerShell provides full access to COM and WMI, enabling administrators to perform administrative tasks on both local and remote Windows systems.

In this project, we used Pwsh to query the Synapse serverless instance. We extracted data related to cloud compliance, such as data access logs, user activities, and data retention policies. This data is essential for managing and monitoring cloud compliance in a cost-effective manner.



## Exposing Data to API Calls

<script src="https://gist.github.com/sturlabragason/b8515e52fb2baefcc2855d168d2f02f9.js"></script>

Azure Functions is a serverless compute service that enables you to run event-triggered code without having to provision or manage infrastructure. We used Azure Functions to build an API that exposes the data extracted from the Synapse instance.

The API calls are used in the web interface for managed cloud compliance. With the API, users can query the Synapse instance for compliance-related data, providing an efficient and cost-effective way to manage cloud compliance.

## Conclusion

In this blog post, we explored how Terraform, Azure Functions, and Pwsh can be used together to query a Synapse serverless instance and expose some of the data through API calls. We discussed the challenges we faced during the setup process, how we used Terraform to provision the Synapse instance, how we used Pwsh to query the data, and how we used Azure Functions to expose the data to API calls.

This approach provides organizations with a cost-effective way to manage and monitor cloud compliance while maintaining scalability and flexibility. Insights gained from this project can be applied to other projects, and we recommend exploring more cloud-based analytics interfaces that utilize these technologies."