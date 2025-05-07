FROM jekyll/jekyll:pages
WORKDIR /srv/jekyll

# ---- build deps for native gems ----
RUN apk add --no-cache build-base libffi-dev openssl-dev cmake git

# ---- install Ruby gems outside the project tree ----
COPY Gemfile Gemfile.lock ./
RUN bundle config set --local path "/usr/local/bundle" \
 && bundle install --jobs 4 --retry 3 \
 && bundle clean --force

# (optional) remove compilers to slim image
# RUN apk del build-base libffi-dev openssl-dev cmake git

# ---- copy the rest of your site ----
COPY . .

EXPOSE 4000
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--watch",  "--force_polling", "--incremental"]
