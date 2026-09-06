# curated_news

A small hand-picked news feed served at `/curated_news/`.

## Files

| File | Owner | Notes |
| --- | --- | --- |
| `index.html` | **generated** | Written by `.github/workflows/rss_update.yml` (hourly + on render changes). Do **not** edit by hand or regenerate it inside a feature branch — that is what caused repeated merge conflicts, because the hourly job commits a new `index.html` to `main` every hour. |
| `styles.css` | source | Page styling. |
| `app.js` | source | Progressive enhancement: search, source/tag filters, relative times, theme toggle. |

## Making changes

Edit the sources only:

- Markup: `.github/templates/news.html`
- Styling: `curated_news/styles.css`
- Behaviour: `curated_news/app.js`
- Feed list / filters: `scripts/feeds.json`
- Parser: `scripts/rss_parser.py`

On merge to `main`, the `Update RSS Feed` workflow re-runs `scripts/rss_parser.py`
and commits the refreshed `index.html`. To preview locally:

```bash
pip install -r scripts/requirements.txt
python scripts/rss_parser.py
open curated_news/index.html
```
