---
layout: post
title: "Why I Built My Own News Feed"
date: 2023-06-15
categories: [blog]
tags: [Personalized News Feed, News Aggregation, RSS Feeds, GitHub Pages, Python, GitHub Actions, Filter Bubbles, Media Bias, Code Automation, Web Scraping, Jinja2, News Curation, Web Development, CSS, Software Development]
---

<img src = "https://sturlabragason.github.io/images/0ee3f89b-acde-4c7e-8a98-753e9c9ded30.jpeg" alt = "City" />

## Why?

Navigating the current media landscape can be overwhelming. With an endless stream of information, some reliable and some not, sorting through the noise to find trustworthy and relevant news is a challenge. The situation is complicated by the focus of many media outlets on views and click-traffic over factual accuracy, contributing to an increase in sensationalized, divisive stories. The drive for profits in media can often lead to compromised news quality. I believe the purpose of news is to inform, not to generate revenue. Social media platforms, too, play a role in this information overload. They often amplify our existing beliefs and confine us within digital echo chambers, limiting our exposure to different viewpoints and fueling polarization. Here are [some more reasons why](https://www.visualcapitalist.com/problems-with-media/).

> Confronted with these challenges, I sought a solution tailored to my needs: accurate updates on local, regional, and global events without having to sift through sensationalized posts or rehashed content from platforms like Reddit, TikTok, or Instagram.

This situation demands a different approach, a personalized news feed. This tool can filter the noise, presenting reliable, balanced information tailored to my preferences. By ensuring I receive news from diverse, trustworthy sources, I can stay informed and navigate the media landscape with confidence. The paradox here lies in the act of filtering. While cautioning against echo chambers, I'm advocating for a personalized news feed. But here's the distinction: this is not about reinforcing biases or excluding differing views. It's about curating a diverse, reliable news diet from sources known for their factual integrity. To learn more about this you can start by this short talk on [Filter bubbles by Joan Blades and John Gable](https://www.ted.com/talks/joan_blades_and_john_gable_free_yourself_from_your_filter_bubbles). I would caution the reader to verify your news sources, perhaps by reviewing their rating on sites such as [Allsides](https://www.allsides.com/media-bias/ratings) or [Adfontes Media](https://adfontesmedia.com/interactive-media-bias-chart/).

## How?

I decided to use the following approach since I've had to set up personalized RSS feeds before, the configurations and sources getting lost each time I switch to a new device, OS, browser etc. 

> If all of the below seems overwhelming I highly recommend trying [Brave browser](https://brave.com/), which has essentially the same feature already built in! For more information on Brave RSS [start here](https://brave.com/brave-today-rss/). This allows you to both select from their offered sources or simply adding your own sources by the click of their "Follow this source in one click" button, which is just awesome!

To construct my personalized news feed, I leveraged a combination of RSS feeds, GitHub Pages, Python, and GitHub Actions. RSS, or 'Really Simple Syndication,' is a time-tested technology used to deliver updates from websites in a chronological list, acting as a personalized news wire service. This approach enables users to follow their preferred websites and receive updates directly. GitHub Pages, Python, and GitHub Actions provide the technological backbone of the solution. GitHub Pages hosts a website directly from a repository, offering a platform accessible across devices. Python, renowned for its rich ecosystem of libraries, is used to parse RSS feeds. And GitHub Actions allows for the automation of tasks, such as fetching and updating the news feed.

To automate this process, I set up a GitHub Actions workflow to fetch and parse the RSS feeds every hour.

<script src="https://gist.github.com/sturlabragason/9fe9fe61ece57327bd745a264216dccb.js"></script>

With the `feedparser` Python module, I parsed the RSS feeds from the chosen sources, extracting relevant news items for my personalized feed. To create the actual news feed, I used Jinja2 to inject the extracted news items into an HTML template, generating a static HTML page. This page was then committed and pushed to the GitHub Pages repository. Here is my rss_parser.py.

<script src="https://gist.github.com/sturlabragason/78098ab2fb3562a7f3647ca805d5e982.js"></script>

Constructed from my feeds.

<script src="https://gist.github.com/sturlabragason/f26b0f199f52369edbd5306a16142f1a.js"></script>

And injected into my HTML Template.

<script src="https://gist.github.com/sturlabragason/faafabb8521ef8dd549e3bb74609d693.js"></script>

Lastly, I employed [CSS to enhance the reading experience](https://github.com/sturlabragason/sturlabragason.github.io/blob/main/curated_news/styles.css), applying the [Catppuccin Mocha](https://github.com/catppuccin/catppuccin) color scheme for a visually appealing interface. 

The complete code is spread around this repository [sturlabragason/sturlabragason.github.io](https://github.com/sturlabragason/sturlabragason.github.io)

Remember, today's media environment requires vigilance and critical thinking. It's up to us to actively seek reliable sources and engage with diverse perspectives.

> The newsfeed is found here [https://sturlabragason.github.io/curated_news/](https://sturlabragason.github.io/curated_news/). Since I mostly read the news on my phone, the experience is optimized for mobile.