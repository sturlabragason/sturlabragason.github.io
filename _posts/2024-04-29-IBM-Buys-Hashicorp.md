---
layout: post
title: "Enterprises should switch from Terraform to OpenTofu"
date: 2024-04-29
categories: [blog]
tags: [IBM, HashiCorp, acquisition, open source, Terraform, OpenTofu, BUSL, MPL 2.0, IBM acquisitions, Linux Foundation, infrastructure management, cloud tools, software practices]
---

Short version: I believe enterprises should switch over from Terraform to OpenTofu.


Long version: 

As some of you may already be aware, IBM and HashiCorp officially announced on April 24 that IBM would be acquiring HashiCorp ([HashiCorp Blog](https://www.hashicorp.com/blog/hashicorp-joins-ibm), [IBM Newsroom](https://newsroom.ibm.com/2024-04-24-IBM-to-Acquire-HashiCorp-Inc-Creating-a-Comprehensive-End-to-End-Hybrid-Cloud-Platform), [Reuters](https://www.reuters.com/markets/deals/ibm-buy-hashicorp-64-billion-deal-expand-cloud-software-2024-04-24/)). This move comes after HashiCorp's [controversial decision last August](https://www.hashicorp.com/blog/hashicorp-adopts-business-source-license) to abandon the open-source [MPL 2.0 license](https://choosealicense.com/licenses/mpl-2.0/) in favor of the [BUSL](https://www.hashicorp.com/bsl), which has been [likened to a bait and switch tactic](https://www.linuxfoundation.org/blog/how-open-source-foundations-protect-the-licensing-integrity-of-open-source-projects).

Red Hat, a subsidiary of IBM, has in the past similarly limited access to the open source code of CentOS, marking a significant shift in their open source strategy ([The Register](https://www.theregister.com/2023/07/07/red_hat_open_source/)). These actions raise concerns about IBM's historical approach to monetizing open source products. The [Linux Foundation has endorsed OpenTofu](https://www.linuxfoundation.org/press/announcing-opentofu), which has already gained [significant traction](https://opentofu.org/supporters/). Here is a [recent article](https://medium.com/netpremacy-global-services/the-beginning-of-the-end-for-terraform-cfffcd2c5420) that highlights the challenges facing Terraform and why OpenTofu might be a suitable replacement.

Given these developments and the strategic implications for infrastructure management, I strongly recommend that enterprises transition from Terraform to OpenTofu and advocate for this change with our customers as well for the following reasons:

1. IBM's history with open source acquisitions is troubling. Their involvement often leads to prioritizing revenue generation over community and product integrity, potentially stifling innovation and alienating users.
2. The move from MPL 2.0 to BUSL by HashiCorp signals a shift away from truly open source models, which may restrict how our engineers and customers use these tools.
3. The Linux Foundation’s support for OpenTofu suggests a robust, community-backed alternative that remains faithful to open source principles.

