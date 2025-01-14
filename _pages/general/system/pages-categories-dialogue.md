---
title: "Pages Categories: 対話"
layout: archive
permalink: /pages-categories/dialogue/
exclude_from_yearly: true
sidebar:
  nav: docs
  nav2: ""
  nav3: cat-design-topics
  nav4: ""
  nav5: ""
---

{% assign dialogue_pages = site.pages | where_exp: "page", "page.categories contains '対話'" %}
<ul class="taxonomy__entries">
  {% for page in dialogue_pages %}
    <li>
      <a href="{{ page.url | relative_url }}">{{ page.title }}</a>
    </li>
  {% endfor %}
</ul>