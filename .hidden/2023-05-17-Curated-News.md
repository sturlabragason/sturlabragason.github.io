---
title: "Crafting a Personalized News Feed: A Stand Against Media Chaos"
date: 2023-05-22
---

# Part 1: The State of Today's Media

## The Problem

In today's fast-paced digital era, our information environment is in a state of flux. The media landscape is often filled with sensationalism, polarization, and misinformation. This barrage of conflicting narratives can serve to amplify societal discord and create a sense of chaos.

News, once a source of unbiased information and a tool for informed decision-making, has increasingly become a battlefield for narratives. Many outlets seem to prioritize generating views and clicks over delivering accurate, balanced news. This often leads to the propagation of sensationalized stories and polarizing headlines, driving divisions rather than fostering understanding.

Additionally, the sheer volume of information available can be overwhelming. The relentless stream of news, both real and fake, from myriad sources makes it challenging to sift through the noise and discern the truth.

The problem is further exacerbated by social media platforms, where algorithms often amplify content that aligns with our existing beliefs, thereby reinforcing biases and isolating us in echo chambers. This has serious implications for our ability to understand differing viewpoints and contributes to societal polarization.

In such a landscape, finding reliable and balanced news becomes akin to finding a needle in a haystack. The need for a solution is clear - a personalized news feed that filters through the noise, avoids echo chambers, and presents information from reliable, diverse sources.

## The Need

Given these challenges, there is a pressing need for a personalized news feed – a space where one can find balanced and trusted sources of information, tailored to individual interests.

In the era of the 24-hour news cycle, sifting through the maelstrom to find a kernel of truth has become a Herculean task. Individuals are left to navigate this stormy sea of information, often without the necessary tools to effectively do so. The sheer volume of news, coupled with the noise of sensationalism, makes it difficult to identify reliable sources and keep track of the stories that truly matter.

A personalized news feed can be a beacon amidst the chaos, offering a tailored selection of news from diverse, trusted sources. It can sidestep the noise and focus on delivering relevant, accurate news that aligns with your interests. This curated approach to news consumption could help foster a more informed, engaged, and discerning readership.

More than just a convenience, a personalized news feed could serve as a tool to combat the echo chambers prevalent in social media and the broader internet. By offering a variety of viewpoints from across the ideological spectrum, it encourages users to engage with differing perspectives, fostering a more balanced understanding of the issues at hand.

In the next section, we delve into the technical side of creating such a personalized news feed, exploring how technologies like RSS feeds, Python, and GitHub Pages can be harnessed to build a trusted, balanced, and accessible news source.


# Part 2: Building a Solution

## The RSS Solution

I found a potential remedy in the world of RSS feeds. For the uninitiated, RSS stands for 'Really Simple Syndication', and it's a format that's been in use for decades to deliver updates from websites - think of it as a personalized news wire service. 

RSS feeds provide a simple, chronological list of updates from a website, whether it's a blog, a news site, or even a podcast. You choose which websites you want to follow, and updates get delivered to you as they're published. It’s a great tool to keep track of updates from your favorite websites without the need to visit each site individually or get drowned in the sea of social media updates.

However, using RSS feeds isn't without challenges. The main one being that traditional RSS readers require a device-specific setup. If you're like me, hopping from one device to another throughout the day - desktop, laptop, smartphone - setting up and maintaining a consistent RSS feed on each can be a cumbersome task. Moreover, if you come across a new source you'd like to follow, you have to add it manually to each of your devices. 

I needed a solution that was persistent and accessible across devices, providing a unified reading experience regardless of where I chose to consume my news. This is where GitHub Pages, Python, and GitHub Actions come into play, providing the backbone for a more seamless RSS experience.

In the next section, we'll explore how these technologies were harnessed to create a robust and personalized news feed.

## The Tech Stack

Enter GitHub Pages and Python, coupled with the continuous integration power of GitHub Actions. This triumvirate of technologies formed the foundation of my solution.

GitHub Pages is a service provided by GitHub that allows you to host a website directly from a GitHub repository. It's a fantastic tool for hosting static websites, and in our case, it provides the perfect platform for our news feed. The biggest advantage is its accessibility - the hosted website can be accessed from any device with an internet connection, which solves our device-specific setup issue.

Python is our programming language of choice for this project. Known for its simplicity and readability, Python is equipped with a rich ecosystem of libraries that makes it an ideal language for tasks like parsing RSS feeds and generating HTML. Specifically, we'll be using the `feedparser` module, which simplifies the process of parsing RSS feeds.

Lastly, we have GitHub Actions. GitHub Actions is a CI/CD (Continuous Integration/Continuous Delivery) service provided by GitHub. It enables us to automate tasks such as fetching and parsing the RSS feeds and updating our GitHub Pages site. We can set it up to run our Python script at regular intervals, ensuring our news feed is always up-to-date.

By leveraging these technologies, we're able to create a personalized news feed that not only overcomes the limitations of traditional RSS readers but also enriches the reading experience by delivering content from trusted sources directly to the reader, no matter what device they're using. In the following sections, we'll delve into how this was done step by step.

## Assembling the Sources

The first step was to identify reliable news sources. It's crucial to ensure the information we consume is accurate, impartial, and well-researched. In an era where misinformation can spread like wildfire, the choice of news sources significantly impacts our understanding of the world.

To assist in this task, I turned to Ad Fontes Media's [Interactive Media Bias Chart](https://adfontesmedia.com/interactive-media-bias-chart/). This resource provides an analysis of various news sources, rating them on factors such as reliability and bias. By examining these ratings, I was able to curate a list of trusted and balanced news outlets.

Once I had identified these reliable sources, I collected their RSS feed URLs. For the uninitiated, RSS (Really Simple Syndication) is a web feed format used to publish frequently updated information. It allows us to easily access and consume a website's content without needing to manually visit each site.

These RSS feed URLs were then compiled into a straightforward JSON file. JSON (JavaScript Object Notation) is a lightweight data-interchange format that's easy to read and write for humans and easy to parse and generate for machines. This JSON file would serve as the foundation for our news feed, ready to be parsed and processed into a clean, personalized news digest.

## Parsing the Feeds

The next step in our journey was to parse the RSS feeds from the assembled sources. For this task, Python proved to be an invaluable ally, specifically its powerful `feedparser` module.

For those unfamiliar with it, `feedparser` is a Python library that parses feeds in all known formats, including Atom and RSS. It abstracts away the complexities of dealing with XML and gives us easy access to the content we care about: the news items.

Here's a basic example of how it works:

```python
import feedparser

def parse_feeds(feed_urls):
    news_items = []
    for url in feed_urls:
        feed = feedparser.parse(url)
        news_items.extend(feed.entries)
    return news_items
```

In our case, the input to the `parse_feeds` function would be the list of feed URLs stored in our JSON file. The function fetches each feed, parses it, and collects all the entries (i.e., news items) into a single list.

This way, I was able to extract relevant news items from each feed, providing the raw material for our personalized news feed. Note that this is a simplification, and error handling, feed refreshing, and other important details are not shown here but were included in the actual implementation.

## Automating Updates
To ensure the news stayed fresh, I set up a GitHub Actions workflow. This workflow would fetch and parse the RSS feeds every hour, extracting relevant news items and ordering them by publication date.

## Generating the HTML
These news items were then injected into a Jinja2 HTML template, generating a static HTML page. This page was committed and pushed to my GitHub Pages repository, making it publicly accessible.

## Styling the Page
To enhance the reading experience, I applied a dark mode theme using CSS, specifically using the soothing Catpuccino Mocha theme colors.

## The Result
The outcome? A personalized news feed, accessible from any device, replete with trusted sources, updated every hour. And all this was achieved with just a few lines of code and some configuration.

## The Brave Browser Alternative
For those who prefer a ready-made solution, the Brave browser has a feature called Brave News, which can be configured to achieve a similar result. It's always good to have options!
