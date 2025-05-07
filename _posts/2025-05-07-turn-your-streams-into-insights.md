---

layout: post
title: "Turn Your Streams into Insights: Downloading Your Spotify History & Analyzing It with ChatGPT"
subtitle: "A step-by-step guide to transforming raw listening data into meaningful patterns"
cover-img: /assets/img/spotify-history/cover.png
thumbnail-img: /assets/img/spotify-history/thumb.png
share-img: /assets/img/spotify-history/cover.png
tags: \[spotify, music-data, tutorial, analysis]
author: Adam Davies
---

Ever wondered what your music habits say about you? Whether you’re a stats nerd, a curious listener, or just looking for a new way to appreciate your favorite tunes, analyzing your Spotify data can be surprisingly addictive—and revealing. From genre deep-dives to discovering your true top artists (not just the ones Spotify Wrapped wants you to see), your streaming history is a treasure trove of insights.

With a little help from ChatGPT, you can go beyond the surface and turn raw JSON logs into digestible charts, trends, and even music recommendations tailored to your taste.

To get started, head over to your Spotify **Privacy page** and request your **Extended streaming history** via the **Download your data** tool. Spotify says this can take up to 30 days, but in my experience, it usually arrives within a few hours. When it does, you’ll get an email with a link to download a zipped archive of your streaming history.

Inside the archive, you’ll find JSON files with names like `Streaming_History_Audio_*.json`. Each one contains a detailed log of your listens—timestamped (in UTC), with metadata for artist, track, album, and playback duration. It’s not the prettiest format, but it’s rich with potential.

Here’s where ChatGPT comes in. I opened a new chat and gave it a short summary of the data format from the readme file included in the download:

> Each stream in the file starts with a timestamp (`ts`) in UTC. It includes metadata like artist, track, album, and milliseconds played. Here's a sample entry:
>
> ```json
> {
>   "ts": "2023-05-01 13:30:30",
>   "ms_played": 186000,
>   "master_metadata_track_name": "Seventeen",
>   "master_metadata_album_artist_name": "Sjowgren"
> }
> ```

Then I simply asked:

> "Can you analyze my Spotify listening history?"

The results were pretty incredible. ChatGPT returned bar charts and summaries showing:

* My top artists and tracks by total listening time
* Hour-by-hour listening patterns (adjusted for time zone)
* Skip-rate trends and platform/device breakdowns
* Genre clusters and playlist habits

Once I had that overview, I started asking deeper questions:

* "What genres do I listen to the most?"
* "How does my weekend listening differ from weekdays?"
* "What artists am I missing out on that I'd probably love?"

It even created curated playlist prompts for Spotify’s AI DJ and grouped suggestions by energy, mood, and time of day. I got genre expansion ideas (like indie R\&B and modern psych-pop) and even a rundown of "Tier 2" artists I listen to in the 5–35 hour range.

In the next section, I’ll include prompt examples and a few of the actual playlists ChatGPT helped me build. Whether you’re looking to rediscover old favorites or expand into new sonic territory, your streaming history is the perfect place to start.
