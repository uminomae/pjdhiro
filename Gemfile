source "https://rubygems.org"

# GitHub Pages用（本番）
gem "github-pages", group: :jekyll_plugins

# gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]
gem "tzinfo-data"
gem "wdm", "~> 0.1.0" if Gem.win_platform?

# 追加---
gem 'mutex_m'
# gem 'httpclient', '~> 2.8.2.3'
gem 'faraday-retry'
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
end
