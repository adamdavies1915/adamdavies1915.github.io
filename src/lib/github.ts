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
  link: string;
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

        // Parse title from summary.md if it starts with a heading
        let title = repo.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        let cleanSummary = summary;

        if (summary) {
          const lines = summary.trim().split('\n');
          const firstLine = lines[0].trim();

          // Check if first line is a markdown heading (# Title or ## Title)
          const headingMatch = firstLine.match(/^#{1,2}\s+(.+)$/);
          if (headingMatch) {
            title = headingMatch[1].trim();
            // Remove the title line from the summary
            cleanSummary = lines.slice(1).join('\n').trim();
          }
        }

        return {
          title,
          description: repo.description || 'No description available',
          emoji: getEmojiForLanguage(repo.language),
          link: repo.html_url,
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
