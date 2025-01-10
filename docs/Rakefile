require "rake"
require "jekyll"

# ローカルサーバーを起動
desc "Build and preview the site locally"
task :go do
  sh "bundle exec jekyll serve"
end

# サイトをビルドして docs/ にコピー
desc "Build site and deploy to GitHub Pages"
task :deploy do
  sh "bundle exec jekyll build"
  sh "rm -rf docs/*"       # docs ディレクトリをクリーンアップ
  sh "cp -r _site/* docs/" # _site の内容を docs にコピー
  sh "touch docs/.nojekyll" # GitHub PagesでJekyllをスキップ
  puts "Site built and copied to docs/"
end
