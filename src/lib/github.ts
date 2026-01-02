export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
}

export interface GitHubProject {
  title: string;
  description: string;
  emoji: string;
  liveUrl: string | null;
  github: string;
  tags: string[];
  summary: string | null;
  stars: number;
  language: string | null;
  lastUpdated: Date;
  source: 'github';
}

const GITHUB_API_BASE = 'https://api.github.com';

// Language to emoji mapping
const languageEmojis: Record<string, string> = {
  TypeScript: '🔷',
  JavaScript: '🟨',
  Python: '🐍',
  Rust: '🦀',
  Go: '🐹',
  Java: '☕',
  Kotlin: '🟣',
  'C#': '💜',
  Ruby: '💎',
  PHP: '🐘',
  Swift: '🍎',
  HTML: '🌐',
  CSS: '🎨',
  default: '📦',
};

function getEmojiForLanguage(language: string | null): string {
  if (!language) return languageEmojis.default;
  return languageEmojis[language] || languageEmojis.default;
}

export async function fetchGitHubProjects(
  username: string,
  topic: string = 'sideproject'
): Promise<GitHubProject[]> {
  const token = import.meta.env.GITHUB_TOKEN;

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'adamdavies-website',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    // Fetch repos with the specified topic
    const searchUrl = `${GITHUB_API_BASE}/search/repositories?q=user:${username}+topic:${topic}&sort=updated&per_page=20`;

    const response = await fetch(searchUrl, { headers });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const repos: GitHubRepo[] = data.items || [];

    // Fetch summary.md for each repo
    const projects = await Promise.all(
      repos.map(async (repo): Promise<GitHubProject> => {
        let summary: string | null = null;

        try {
          const summaryUrl = `${GITHUB_API_BASE}/repos/${repo.full_name}/contents/summary.md`;
          const summaryResponse = await fetch(summaryUrl, { headers });

          if (summaryResponse.ok) {
            const summaryData = await summaryResponse.json();
            // GitHub returns base64 encoded content
            summary = Buffer.from(summaryData.content, 'base64').toString('utf-8');
          }
        } catch (err) {
          // summary.md doesn't exist or error fetching
          console.log(`No summary.md for ${repo.name}`);
        }

        // Parse title, emoji, and URL from summary.md
        let title = repo.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        let cleanSummary = summary;
        let emoji = getEmojiForLanguage(repo.language);
        let liveUrl: string | null = null;

        if (summary) {
          const lines = summary.trim().split('\n');
          let firstLine = lines[0].trim();

          // Check if first line is a markdown heading (# Title or ## Title)
          const headingMatch = firstLine.match(/^#{1,2}\s+(.+)$/);
          if (headingMatch) {
            let titleText = headingMatch[1].trim();

            // Extract emoji from title (at start or end)
            const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)\s*|\s*(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/gu;
            const emojiMatch = titleText.match(emojiRegex);
            if (emojiMatch) {
              emoji = emojiMatch[0].trim();
              titleText = titleText.replace(emojiRegex, '').trim();
            }

            title = titleText;
            // Remove the title line from the summary
            cleanSummary = lines.slice(1).join('\n').trim();
          }

          // Extract URL from summary (look for markdown link or bare URL)
          if (cleanSummary) {
            // Match markdown links like [text](url) or bare URLs
            const markdownLinkMatch = cleanSummary.match(/\[(?:live|demo|website|link|visit|view)[^\]]*\]\((https?:\/\/[^\)]+)\)/i);
            const bareLinkMatch = cleanSummary.match(/(?:^|\s)(https?:\/\/(?!github\.com)[^\s]+)/m);

            if (markdownLinkMatch) {
              liveUrl = markdownLinkMatch[1];
              // Remove the markdown link from summary
              cleanSummary = cleanSummary.replace(markdownLinkMatch[0], '').trim();
            } else if (bareLinkMatch) {
              liveUrl = bareLinkMatch[1];
              // Remove the bare URL from summary
              cleanSummary = cleanSummary.replace(bareLinkMatch[1], '').trim();
            }

            // Clean up any leftover empty lines
            cleanSummary = cleanSummary.replace(/\n{3,}/g, '\n\n').trim();
          }
        }

        return {
          title,
          description: repo.description || 'No description available',
          emoji,
          liveUrl,
          github: repo.html_url,
          tags: [repo.language, ...repo.topics.filter(t => t !== topic)].filter(Boolean) as string[],
          summary: cleanSummary,
          stars: repo.stargazers_count,
          language: repo.language,
          lastUpdated: new Date(repo.pushed_at),
          source: 'github',
        };
      })
    );

    return projects.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    return [];
  }
}
