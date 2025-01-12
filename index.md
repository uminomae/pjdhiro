---
# layout: single
# layout: home
author_profile: true
sidebar:
  nav: docs
layout: splash
title: "HOME"
permalink: /
feature_row:
  - title: "Project Design"
    excerpt: "プロジェクトデザインについて"
    url: /project-design/
    btn_label: "Learn More"
    btn_class: "btn--primary"
  - title: "Posts"
    excerpt: "ブログ記事"
    url: /categories/
    posts: true
    btn_label: "View Posts"
    btn_class: "btn--primary"
  - title: "About"
    excerpt: "このサイトについて"
    url: /about/
    btn_label: "Read More"
    btn_class: "btn--primary"
---

## Get Started


このサイトでは、プロジェクトデザインや心理的安全性に関する体験や知見を共有しています。  
対人スキルや感情処理の視点を取り入れたアプローチを紹介します。

{% include feature_row %}

## 最新のBLOG記事

<ul>
  {% for post in site.posts limit:5 %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      <span class="date">{{ post.date | date: "%Y-%m-%d" }}</span>
    </li>
  {% endfor %}
</ul>
