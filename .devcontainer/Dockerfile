FROM ruby:3.2

# Set working directory
WORKDIR /workspace

# Install bundler
RUN gem install bundler

# Copy Gem files first for caching
COPY Gemfile Gemfile.lock* ./
RUN bundle install

# Copy the rest of the project
COPY . .

CMD ["bash"]
