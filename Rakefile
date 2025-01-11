require "rake"
require "jekyll"

desc "Clean _site directory"
task :clean do
  sh "rm -rf _site"
end

desc "Build the site"
task :build do
  sh "bundle exec jekyll build"
end

desc "Serve the site locally"
task :serve do
  sh "bundle exec jekyll serve --watch --livereload"
end

desc "Build and preview the site locally"
task :go => [:build, :serve] do
# task :go => [:clean, :build, :serve] do
  puts "Site is being built and served..."
end
