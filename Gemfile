source "https://rubygems.org"

# GitHub Pages用（本番）
# CI は Gemfile.lock を持たない（.gitignore）ため毎回解決し直す。バージョンを固定しないと
# 古い github-pages(=jekyll 3.9.0/liquid 4.0.3)が選ばれ、Ruby 3.3 で liquid が
# `undefined method 'tainted?'` で落ちる（2026-08-21）。ローカルの解決結果と同じ 232 に固定する。
gem "github-pages", "~> 232", group: :jekyll_plugins

gem "tzinfo-data"
gem "wdm", "~> 0.1.0" if Gem.win_platform?

# 追加---
gem 'mutex_m'
gem 'faraday-retry'
gem 'ostruct'
gem "minimal-mistakes-jekyll"
# ----

# ローカル環境用
group :jekyll_plugins do
  gem "jekyll-paginate"
  gem "jekyll-sitemap"
  gem "jekyll-gist"
  gem "jekyll-feed"
  gem "jemoji"
  gem "jekyll-include-cache"
  gem "jekyll-algolia"
  gem "jekyll-paginate-v2"
  gem "openssl", "~> 3.3.2"
end

gem "rake", "~> 13.2"
