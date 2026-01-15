# sturlabragason.github.io

My personal website and CV built with Jekyll, featuring automated content generation and dynamic components.

## Features

- **Modern CV Page**: Responsive CV with dark mode toggle and mobile optimization
- **Curated News Feed**: Automated RSS aggregation with deduplication and image lazy loading
- **Maze Gallery**: Procedurally generated mazes with monthly updates
- **Dark Mode**: System-aware theme switching with user preference persistence
- **Mobile Optimized**: Responsive design across all components

## Tech Stack

- **Static Site Generator**: Jekyll with Minima theme
- **Frontend**: HTML, CSS with custom dark mode support
- **Backend Automation**: Python scripts for RSS parsing and maze generation
- **CI/CD**: GitHub Actions for automated content updates
- **Content**: Markdown posts, collections, and curated RSS feeds

## Setup Instructions

### Prerequisites
- Ruby and Jekyll installed locally
- Python 3.8+ with pip
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sturlabragason.github.io.git
   cd sturlabragason.github.io
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r scripts/requirements.txt
   ```

3. **Install Jekyll dependencies**
   ```bash
   bundle install
   ```

4. **Run the development server**
   ```bash
   bundle exec jekyll serve
   ```

5. **Generate content locally (optional)**
   ```bash
   # Update RSS feed
   python scripts/rss_parser.py
   
   # Generate new mazes
   python scripts/maze_generator.py
   python scripts/update_html.py
   ```

### Project Structure

```
├── _config.yml              # Jekyll configuration
├── assets/                  # CSS and static assets
├── _posts/                  # Blog posts
├── cv/                      # CV content and PDFs
├── mazes/                   # Generated maze gallery
├── curated_news/            # Generated news feed
├── scripts/                 # Python automation scripts
│   ├── rss_parser.py        # RSS feed parser with deduplication
│   ├── maze_generator.py    # Procedural maze generation
│   └── update_html.py       # HTML template renderer
└── .github/
    ├── workflows/           # GitHub Actions CI/CD
    └── templates/           # Jinja2 templates for generated content
```

## Automation

### RSS News Feed
- **Frequency**: Hourly updates via GitHub Actions
- **Features**: Deduplication, image extraction, lazy loading
- **Sources**: Configured in `.github/scripts/feeds.json`

### Maze Gallery
- **Frequency**: Monthly regeneration
- **Quantity**: 50 unique mazes per batch
- **Format**: High-resolution PNG images

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `bundle exec jekyll serve`
5. Submit a pull request

## License

Personal project - All rights reserved.
