# RAG Technology with Azure Search OpenAI Demo

I've been approached by multiple clients interested in exploring [Retrievable Augmented Generative](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview) (RAG) technology, signaling a clear demand for accessible and simple solutions. For a quick and straightforward implemention we've used the [Azure Search OpenAI Demo](https://github.com/Azure-Samples/azure-search-openai-demo) (ASOD). Built using [python](https://www.python.org/), [TypeScript](https://www.typescriptlang.org/), [bicep](https://github.com/Azure/bicep) and [azure developer CLI](https://github.com/Azure/azure-dev); it offers an easy way to set up a complete RAG solution in the client's environment in a very short time. 

We wanted to demystify RAG technology, offering enhanced search capabilities powered by OpenAI and Azure AI Search, with each implementation specifically tailored to meet the needs of our clients. 

![Diagram](https://raw.githubusercontent.com/Azure-Samples/azure-search-openai-demo/main/docs/images/appcomponents.png)

If you, like me, are super impatient and believe you know best, our fork of of the code can be found here [Devoteam/azure-search-openai](https://github.com/Devoteam/azure-search-openai), you can also try our demo application at [devoteam-asod.azurewebsites.net](https://devoteam-asod.azurewebsites.net/). If you don't have access to the Devoteam Github organization go ahead and [join our organization](https://github.com/Devoteam?view_as=public#joining-this-github-organization). If you want to know more, please read on! 🙂


#### Our Approach

Our primary goals were the following:
- Empower clients to seamlessly interact with their data.
- Streamline deployment to Azure, ensuring all necessary services are up and running swiftly.
- Simplify the process of updating the RAG search index with new data.

> Empower clients to seamlessly interact with their data.

After deployment, ASOD provides a user-friendly web application frontend, facilitating straightforward engagement with data. This interface is designed for intuitive use, allowing users to query their data effortlessly. Responses are enriched with citations directly linked to the source documents, available as PDFs within the solution, enhancing transparency and trust in the provided information. Our customizations to ASOD included the integration of GitHub workflows and Azure DevOps pipelines. We've tailored the branding and dialogue prompts to fit each client's scenario. We also enable GPT-4V which allows the solution to engage with visual data like graphs and images. We've also created an integration with Microsoft Teams, permitting direct service queries through outgoing webhooks. This setup offers a tangible demonstration of RAG technology's benefits, making its potential immediately evident. Users can see the relevance and accuracy of search results firsthand, showcasing the power of integrating RAG into their data management and search strategies.

![Screenshot of the ASOD interface](https://files.catbox.moe/kfzdvh.png)

</br>

> Streamline deployment to Azure, ensuring all necessary services are up and running swiftly.

We implemented pipelines in both Azure DevOps and GitHub to automate what used to be a manual build and deployment process, originally designed for execution from a developer's laptop. Utilizing Azure DevOps hosted agents and GitHub Workflow agents made setting up the necessary Python and Node.js prerequisites straightforward. Experimenting with a self-hosted agent offered a clear insight: automated build pipelines significantly streamline the deployment process, outperforming manual prerequisite setups on a developer’s workstation by a wide margin. All in all, the build process now takes roughly 20 minutes, requiring minimal interaction—just a single click to deploy.

![Screenshot of the Build](https://files.catbox.moe/4vzco5.png)

</br>

> Simplify the process of updating the RAG search index with new data.

Updating the RAG search index with new data is very simple. By adding new PDFs to a designated directory, we start a backend process that segments the documents, uploads them to a cloud storage account, and indexes them for search. This process enables the GPT models to access and incorporate this new data into their responses, keeping the search index current with just a single click to initiate the process.

![Screenshot of the Build](https://files.catbox.moe/snew1v.png)

#### Next steps

We've also been exploring alternative AI solutions, and we are assessing various models and indexes:

- **[MIQU 1.70b](https://medium.com/@AIWorldBlog/revolutionizing-ai-miqu-1-70b-breaks-new-ground-92e92f38f6ae):**  A open-source contender to GPT4.

- **[OLlama](https://ollama.com/):** Enabling developers to get started using open-source models in a very simple way.

- **[Llama Index](https://www.llamaindex.ai/):** An indexing service that offers enhanced search capabilities.

- Smaller models such as **Mistral**, **Llama**, and **Phi** are also under consideration for scenarios where a lighter or more specialized approach is beneficial.

- Experiments using the [Azure AI CLI](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/cli-install?tabs=windows%2Cterminal) and [Azure AI Studio](https://ai.azure.com/).

These explorations are part of our commitment to staying at the forefront of AI, ensuring we offer cutting-edge solutions to our clients.

For more information about any of the above feel free to reach out to the author.






#########
Customization 

As above, adding github workflows and azure devops pipelines

Custom branding and tailored prompts to meet specific client use cases.
We've enabled the optional GPT-4V, allowing the solution to understand and discuss visual data such as graphs, images, etc.
MS Teams integration, enabling queries to the service through an outgoing webhook, akin to a direct API.

Code sample



### Lessons Learned and Best Practices

Regional restrictions


Additional prerequsites included 

prereqs require openai access already enabled in the customers environment as well as the computer vision respnonsible ai agreement having been approved

The deployment process of the Azure Search OpenAI Demo involved key steps, utilizing Azure DevOps and GitHub for efficiency. We faced challenges like regional availability issues in West Europe and restrictions on OpenAI and Azure Vision services.

navigate around the regional constraints effectively.

the build process relies heavily on a

### Future Directions

Building on the success of our current project, we plan to explore further enhancements and expansions to better meet emerging customer needs. This includes integrating more advanced AI models to improve search accuracy and user experience. 

Adding open-source models, and llama-index.

also exlporing creating production ready solution using azure ai studio

