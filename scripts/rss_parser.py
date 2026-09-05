"""
RSS Feed Parser for Curated News

This script fetches RSS feeds from multiple sources, deduplicates articles,
extracts images, and generates a static HTML page for the curated news feed.

Features:
- Multi-source RSS aggregation with per-source name and category labels
- Article deduplication by URL and by normalised title
- Keyword blocklist, recency window and per-feed item cap (scripts/filters.json)
- Topic tagging from keyword rules
- Image extraction from summaries
- Lazy loading for images
- Date-based sorting

Author: Sturla Bragason
"""

import json
import re
from datetime import datetime, timedelta, timezone

import feedparser
from jinja2 import Environment, FileSystemLoader
from bs4 import BeautifulSoup


def load_feeds():
    """Return a list of {url, source, category} dicts.

    Accepts both the current object form ({"feeds": [{"url": ...}]}) and the
    legacy flat list of URL strings.
    """
    with open('scripts/feeds.json', 'r') as f:
        raw = json.load(f)

    entries = raw['feeds'] if isinstance(raw, dict) else raw
    feeds = []
    for entry in entries:
        if isinstance(entry, str):
            feeds.append({'url': entry, 'source': '', 'category': ''})
        else:
            feeds.append({
                'url': entry['url'],
                'source': entry.get('source', ''),
                'category': entry.get('category', ''),
            })
    return feeds


def load_filters():
    """Load scripts/filters.json, tolerating a missing file."""
    try:
        with open('scripts/filters.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        data = {}
    data.setdefault('max_age_days', 0)
    data.setdefault('max_items_per_feed', 0)
    data.setdefault('exclude_keywords', [])
    data.setdefault('tag_rules', {})
    return data


def parse_date(entry):
    """Return a timezone-aware datetime for an entry, or None."""
    date_string = entry.get('published', '')
    if date_string:
        cleaned = date_string.replace('GMT', '+0000')
        try:
            return datetime.strptime(cleaned, '%a, %d %b %Y %H:%M:%S %z')
        except ValueError:
            pass
    # Fall back to feedparser's normalised struct_time (always UTC).
    parsed = entry.get('published_parsed') or entry.get('updated_parsed')
    if parsed:
        return datetime(*parsed[:6], tzinfo=timezone.utc)
    print(f"Could not parse date: {date_string!r}")
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


def is_blocked(text, exclude_keywords):
    lowered = text.lower()
    return any(keyword.lower() in lowered for keyword in exclude_keywords)


def derive_tags(text, tag_rules):
    lowered = text.lower()
    tags = []
    for tag, keywords in tag_rules.items():
        for keyword in keywords:
            if re.search(r'\b' + re.escape(keyword.lower()) + r'\b', lowered):
                tags.append(tag)
                break
    return tags


def normalise_title(title):
    return re.sub(r'\s+', ' ', title or '').strip().lower()


def fetch_and_parse(feeds, filters):
    news_items = []
    seen_links = set()
    seen_titles = set()
    exclude_keywords = filters['exclude_keywords']
    tag_rules = filters['tag_rules']
    max_items_per_feed = filters['max_items_per_feed']

    for feed in feeds:
        feed_url = feed['url']
        kept_from_feed = 0
        try:
            parsed_feed = feedparser.parse(feed_url)
            for entry in parsed_feed.entries:
                if max_items_per_feed and kept_from_feed >= max_items_per_feed:
                    break

                link = entry.get('link')
                title = entry.get('title')
                if not link or not title:
                    continue
                if link in seen_links:
                    continue

                title_key = normalise_title(title)
                if title_key in seen_titles:
                    continue

                raw_summary = entry.summary if 'summary' in entry else ''
                summary = process_summary(raw_summary)

                if is_blocked(f"{title} {summary}", exclude_keywords):
                    continue

                published_datetime = parse_date(entry)

                image = None
                if raw_summary:
                    soup = BeautifulSoup(raw_summary, "html.parser")
                    img_tag = soup.find('img')
                    if img_tag and img_tag.get('src'):
                        image = img_tag['src']

                seen_links.add(link)
                seen_titles.add(title_key)
                kept_from_feed += 1

                news_items.append({
                    'title': title,
                    'link': link,
                    'published': published_datetime,
                    'summary': summary,
                    'image': image,
                    'source': feed['source'],
                    'category': feed['category'],
                    'tags': derive_tags(f"{title} {summary}", tag_rules),
                })
        except Exception as e:
            print(f'Failed to fetch or parse feed {feed_url}: {str(e)}')
    return news_items


def render_page(news_items):
    env = Environment(loader=FileSystemLoader('.github/templates'))
    template = env.get_template('news.html')
    with open('curated_news/index.html', 'w') as f:
        f.write(template.render(news_items=news_items))


def main():
    feeds = load_feeds()
    filters = load_filters()
    news_items = fetch_and_parse(feeds, filters)

    # Drop items without a usable publication date.
    news_items = [item for item in news_items if item['published'] is not None]

    # Recency window.
    max_age_days = filters['max_age_days']
    if max_age_days:
        cutoff = datetime.now(timezone.utc) - timedelta(days=max_age_days)
        news_items = [item for item in news_items if item['published'] >= cutoff]

    # Newest first.
    news_items.sort(key=lambda x: x['published'], reverse=True)
    render_page(news_items)


if __name__ == "__main__":
    main()
