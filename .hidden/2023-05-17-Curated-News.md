---
title: "Creating a Personalized News Feed with GitHub Actions"
date: 2023-05-16
---

In a world filled with polarizing, clickbait news, it's hard to find trustworthy sources. That's why I decided to take matters into my own hands and aggregate my own news feed.

I've always been a fan of RSS feeds, but I found their setup often tied to the device I was using. Anytime I got a new device, I'd have to start from scratch. Wanting a more durable solution, I turned to GitHub Pages and Python.

I started by identifying reliable news sources and gathering their RSS feed URLs. I stored these in a simple JSON file which I would later parse using Python's `feedparser` module. (Here the Python script should go)

Each hour, a GitHub Actions workflow fetches and parses the RSS feeds, extracts the relevant news items, and sorts them by publication date. (Here the YAML configuration should go)

The collected news items are then plugged into a Jinja2 HTML template. This template is used to generate a static HTML page, which is committed and pushed to my GitHub Pages repository. (Here the HTML template should go)

In order to keep the news readable and easy on the eyes, I applied a dark mode theme to the website using CSS. This included customizing text, background, and link colors, using the Catpuccino Mocha theme colors. (Here the CSS should go)

As a result, I now have a personalized news feed that I can access from any device, with news from sources I trust, updated every hour. All of this with just a few lines of code and a bit of configuration.

I'll be writing more detailed instructions on how to set this up in the future, so stay tuned if you're interested in creating your own personalized news feed.

Until then, keep coding and keep informed!
