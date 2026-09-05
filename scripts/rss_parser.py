"""
RSS Feed Parser for Curated News

This script fetches RSS feeds from multiple sources, deduplicates articles,
extracts images, and generates a static HTML page for the curated news feed.

Features:
- Multi-source RSS aggregation with named sources and tags (scripts/feeds.json)
- Query-based tag rules per feed (title terms -> extra tags, e.g. cloud-native)
- Article deduplication by URL and by domain+title
- Freshness filter (max_age_days) and junk-title filter (drop_titles_matching)
- Minimum Hacker News points filter for low-signal HN posts
- Image extraction from summaries
- Lazy loading for images
- Date-based sorting

Author: Sturla Bragason
"""

import feedparser
import json
import re
from urllib.parse import urlparse
from datetime import datetime, timedelta, timezone
from jinja2 import Environment, FileSystemLoader
from bs4 import BeautifulSoup

CONFIG_PATH = 'scripts/feeds.json'


def load_config():
    with open(CONFIG_PATH, 'r') as f:
        config = json.load(f)
    # Backwards compatibility: a plain list of URLs is still valid config.
    if isinstance(config, list):
        config = {'feeds': [{'url': url} for url in config]}
    config.setdefault('filters', {})
    return config


def parse_date(date_string):
    if 'GMT' in date_string:
        date_string = date_string.replace('GMT', '+0000')
    try:
        # Parse the publication date string into a datetime object
        return datetime.strptime(date_string, '%a, %d %b %Y %H:%M:%S %z')
    except ValueError:
        pass
    try:
        # ISO 8601 dates (Atom feeds, e.g. small-tech.org)
        parsed = datetime.fromisoformat(date_string.replace('Z', '+00:00'))
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed
    except ValueError:
        print(f'Could not parse date: {date_string}')
        return None

def clean_boilerplate(text):
    """Strip redundant Hacker News boilerplate lines from a summary.

    The article link is already the item heading, so the "Article URL" and
    "Comments URL" lines add noise. Points / comment counts are kept but
    condensed onto a single tidy line.
    """
    kept = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith(('Article URL:', 'Comments URL:')):
            continue
        line = line.replace('# Comments:', 'Comments:')
        kept.append(line)
    if kept and all(part.split(':')[0] in ('Points', 'Comments') for part in kept):
        return ' · '.join(kept)
    return '\n'.join(kept)


def process_summary(summary):
    summary = BeautifulSoup(summary, "html.parser").get_text()
    summary = clean_boilerplate(summary)
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


def source_name(feed_url, feed_dict):
    """Human-readable source label for an item."""
    explicit = feed_dict.get('name')
    if explicit:
        return explicit
    try:
        title = feed_dict.get('feed', {}).get('title')
        if title:
            return str(title)
    except Exception:
        pass
    return urlparse(feed_url).netloc


def match_queries(title, queries):
    """Return extra tags from query rules whose terms all appear in the title."""
    tags = []
    lower = title.lower()
    for query in queries or []:
        terms = query.get('terms', [])
        if terms and all(term.lower() in lower for term in terms):
            tags.extend(query.get('tags', []))
    return tags


def hn_points(entry):
    """Extract the HN points count from a hnrss summary ('Points: N')."""
    match = re.search(r'Points:\s*(\d+)', entry.get('summary', '') or '')
    return int(match.group(1)) if match else None


def item_is_stale(published_datetime, max_age_days):
    if published_datetime is None:
        return False
    cutoff = datetime.now(timezone.utc) - timedelta(days=max_age_days)
    return published_datetime < cutoff


def fetch_and_parse(config):
    news_items = []
    seen_links = set()      # Track seen links to prevent duplicates
    seen_titles = set()     # Cross-feed duplicate stories (same domain + title)
    filters = config['filters']
    drop_patterns = [re.compile(pattern, re.IGNORECASE)
                     for pattern in filters.get('drop_titles_matching', [])]
    max_age_days = filters.get('max_age_days')
    min_hn_points = filters.get('min_hn_points')

    for feed_dict in config['feeds']:
        feed_url = feed_dict['url']
        try:
            feed = feedparser.parse(feed_url)
            name = source_name(feed_url, feed_dict)
            base_tags = list(feed_dict.get('tags', []))
            queries = feed_dict.get('queries', [])
            is_hn = 'hnrss.org' in feed_url

            for entry in feed.entries:
                # Skip if we've already seen this link
                if entry.link in seen_links:
                    continue

                title = entry.title
                if any(pattern.search(title) for pattern in drop_patterns):
                    continue

                if is_hn and min_hn_points is not None:
                    points = hn_points(entry)
                    if points is not None and points < min_hn_points:
                        continue

                published_datetime = parse_date(entry.published) \
                    if 'published' in entry else None
                if published_datetime is None and filters.get('require_published_date'):
                    continue
                if max_age_days and item_is_stale(published_datetime, max_age_days):
                    continue

                key = (urlparse(entry.link).netloc.lower(), title.strip().lower())
                if filters.get('deduplicate_by_domain_title') and key in seen_titles:
                    continue

                seen_links.add(entry.link)
                seen_titles.add(key)

                summary = process_summary(entry.summary if 'summary' in entry else '')

                # Extract image if available
                image = None
                if 'summary' in entry:
                    soup = BeautifulSoup(entry.summary, "html.parser")
                    img_tag = soup.find('img')
                    if img_tag and img_tag.get('src'):
                        image = img_tag['src']

                tags = base_tags + match_queries(title, queries)

                news_items.append({
                    'title': title,
                    'link': entry.link,
                    'published': published_datetime,
                    'summary': summary,
                    'image': image,
                    'source': name,
                    'tags': sorted(set(tags)),
                })
        except Exception as e:
            print(f'Failed to fetch or parse feed {feed_url}: {str(e)}')
    return news_items


def render_page(news_items):
    # Load Jinja2 template
    env = Environment(loader=FileSystemLoader('.github/templates'), autoescape=True)
    template = env.get_template('news.html')

    # Filter controls are built from the sources / tags actually present.
    sources = sorted({item['source'] for item in news_items if item.get('source')})
    tags = sorted({tag for item in news_items for tag in item.get('tags', [])})
    generated_at = datetime.now(timezone.utc)

    # Render new HTML page
    with open('curated_news/index.html', 'w') as f:
        f.write(template.render(
            news_items=news_items,
            sources=sources,
            tags=tags,
            generated_at=generated_at,
        ))


def main():
    config = load_config()
    news_items = fetch_and_parse(config)
    # Sort news items by publication date
    news_items.sort(key=lambda x: x['published'], reverse=True)
    render_page(news_items)


if __name__ == "__main__":
    main()
