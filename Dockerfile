FROM jekyll/jekyll:4.2.2

WORKDIR /srv/jekyll

# Copy Gemfile and Gemfile.lock first for better caching
COPY Gemfile* ./

# Install dependencies
RUN bundle install

# Copy the rest of the site
COPY . .

# Build the site
RUN bundle exec jekyll build

# Expose port 4000
EXPOSE 4000

# Start the Jekyll server
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--livereload"]
