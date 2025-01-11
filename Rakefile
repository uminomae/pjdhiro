require "rake"
require "jekyll"


desc "Clean _site directory"
task :clean do
  sh "rm -rf _site"
end

desc "Build the site"
task :build do
  ENV["JEKYLL_ENV"] ||= "development" # デフォルトで "development" を設定
  sh "bundle exec jekyll build"
end

desc "Serve the site locally"
task :serve do
  ENV["JEKYLL_ENV"] ||= "development" # デフォルトで "development" を設定
  sh "bundle exec jekyll serve"
end

# # 変更があったファイルのみ
# desc "Serve the site locally with incremental build"
# task :serve do
#   sh "bundle exec jekyll serve --incremental"
# end

desc "Build and preview the site locally"
task :go => [:build, :serve] do
# task :go => [:clean, :build, :serve] do
  puts "Site is being built and served..."
end


desc "Build for production"
task :build_production do
  ENV["JEKYLL_ENV"] = "production" # 本番環境モード
  sh "bundle exec jekyll build"
end