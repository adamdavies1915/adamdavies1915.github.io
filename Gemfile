# frozen_string_literal: true
source "https://rubygems.org"

# ---------- primary tool‑chain ----------
# One gem bundles the exact Jekyll + plugin versions GitHub Pages uses.
gem "github-pages", group: :jekyll_plugins
gem "webrick", "~> 1.8"

# ---------- optional Windows helpers ----------
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"   # time‑zone data missing on Windows
  gem "tzinfo-data"
end

# Faster file‑watching on Windows
gem "wdm", "~> 0.1", platforms: %i[mingw x64_mingw mswin]
