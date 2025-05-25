---
title: "Pages Categories: サイト編集"
layout: archive
permalink: /pages-categories/dev/
exclude_from_yearly: true
sidebar:
  nav: docs
  nav2: ""
  nav3: ""
  nav4: cat-side-notes
  nav5: ""
---

{% assign dialogue_pages = site.pages | where_exp: "page", "page.categories contains 'サイト編集'" %}
<ul class="taxonomy__entries">
  {% for page in dialogue_pages %}
    <li>
      <a href="{{ page.url | relative_url }}">{{ page.title }}</a>
    </li>
  {% endfor %}
</ul>