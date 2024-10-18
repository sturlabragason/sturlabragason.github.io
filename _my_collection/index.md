---
layout: default
title: "My Collection Index"
---


# Session Notes

<ul>
{% for note in site.1316 %}
  <li><a href="{{ note.url }}">{{ note.title }}</a> - {{ note.date | date: "%b %-d, %Y" }}</li>
{% endfor %}
</ul>
