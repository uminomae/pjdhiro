---
title: "Pages Categories: 用語"
layout: archive
permalink: /pages-categories/word/
exclude_from_yearly: true
sidebar:
  nav: docs
  nav2: ""
  nav3: cat-design-topics
  nav4: ""
  nav5: ""
---

{% assign dialogue_pages = site.pages | where_exp: "page", "page.categories contains '用語'" %}
<ul class="taxonomy__entries">
  {% for page in dialogue_pages %}
    <li>
      <a href="{{ page.url | relative_url }}">{{ page.title }}</a>
    </li>
  {% endfor %}
</ul>