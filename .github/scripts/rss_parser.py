import feedparser
import json
from jinja2 import Environment, FileSystemLoader
from datetime import datetime
import pytz

# Load RSS feed URLs
with open('.github/scripts/feeds.json', 'r') as f:
    feeds = json.load(f)

# Fetch and parse RSS feeds
news_items = []
for feed_url in feeds:
    feed = feedparser.parse(feed_url)
    for entry in feed.entries:
        # Parse the publication date string into a datetime object
        published_datetime = datetime.strptime(entry.published, '%a, %d %b %Y %H:%M:%S %z')

        news_items.append({
            'title': entry.title,
            'link': entry.link,
            'published': published_datetime,
        })


# Sort news items by publication date
news_items.sort(key=lambda x: x['published'], reverse=True)

# Load Jinja2 template
env = Environment(loader=FileSystemLoader('.github/templates'))
template = env.get_template('news.html')

# Render new HTML page
with open('curated_news/index.html', 'w') as f:
    f.write(template.render(news_items=news_items))
