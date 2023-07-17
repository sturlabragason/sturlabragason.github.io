import feedparser
import json
from jinja2 import Environment, FileSystemLoader
from datetime import datetime
from bs4 import BeautifulSoup

def load_feeds():
    with open('.github/scripts/feeds.json', 'r') as f:
        feeds = json.load(f)
    return feeds

def parse_date(date_string):
    if 'GMT' in date_string:
        date_string = date_string.replace('GMT', '+0000')
    try:
        # Parse the publication date string into a datetime object
        return datetime.strptime(date_string, '%a, %d %b %Y %H:%M:%S %z')
    except ValueError:
        print(f'Could not parse date: {date_string}')
        return None

def process_summary(summary):
    summary = BeautifulSoup(summary, "html.parser").get_text()
    if summary:  
        if len(summary) >= 200:  
            substring = summary[:200]  
            index = substring.find('. ')  
            if index != -1:  
                return substring[:index + 1]
            else:  
                return substring
        else:  
            return summary.split('. ')[0]
    return ''

def fetch_and_parse(feeds):
    news_items = []
    for feed_url in feeds:
        try:
            feed = feedparser.parse(feed_url)
            for entry in feed.entries:
                published_datetime = parse_date(entry.published)
                summary = process_summary(entry.summary if 'summary' in entry else '')
                news_items.append({
                    'title': entry.title,
                    'link': entry.link,
                    'published': published_datetime,
                    'summary': summary,
                })
        except Exception as e:
            print(f'Failed to fetch or parse feed {feed_url}: {str(e)}')
    return news_items

def render_page(news_items):
    # Load Jinja2 template
    env = Environment(loader=FileSystemLoader('.github/templates'))
    template = env.get_template('news.html')

    # Render new HTML page
    with open('curated_news/index.html', 'w') as f:
        f.write(template.render(news_items=news_items))

def main():
    feeds = load_feeds()
    news_items = fetch_and_parse(feeds)
    # Filter out news_items with 'None' publication date
    news_items = [item for item in news_items if item['published'] is not None]
    # Sort news items by publication date
    news_items.sort(key=lambda x: x['published'], reverse=True)
    render_page(news_items)

if __name__ == "__main__":
    main()
