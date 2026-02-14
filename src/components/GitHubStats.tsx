import React, { useState, useEffect } from "react";
import { Github, TrendingUp, Code2, GitBranch, Star, Users } from "lucide-react";

interface GitHubUser {
  login: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string;
  avatar_url: string;
}

interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  stargazers_count: number;
  language: string;
}

interface GitHubStatsProps {
  username: string;
  theme: string;
}

const GitHubStats: React.FC<GitHubStatsProps> = ({ username, theme }) => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user data
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const userData = await userRes.json();
        setUser(userData);

        // Fetch repos
        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?sort=stars&per_page=6`
        );
        if (!reposRes.ok) throw new Error("Failed to fetch repos");
        const reposData = await reposRes.json();
        setRepos(reposData);

        // Calculate languages
        const langCount: Record<string, number> = {};
        reposData.forEach((repo: GitHubRepo) => {
          if (repo.language) {
            langCount[repo.language] = (langCount[repo.language] || 0) + 1;
          }
        });
        setLanguages(langCount);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username]);

  if (loading) {
    return (
      <div className={`p-8 rounded-2xl border ${
        theme === 'dark'
          ? 'bg-slate-900/50 border-slate-800/50'
          : 'bg-white border-slate-200'
      } animate-pulse`}>
        <div className="h-40 bg-slate-700/20 rounded-lg"></div>
      </div>
    );
  }

  if (error|| !user) {
    return (
      <div className={`p-6 rounded-2xl border text-center ${
        theme === 'dark'
          ? 'bg-slate-900/50 border-slate-800/50 text-slate-400'
          : 'bg-white border-slate-200 text-slate-600'
      }`}>
        <Github size={32} className="mx-auto mb-3 opacity-50" />
        <p className="font-medium">Unable to load GitHub stats</p>
        <p className="text-sm opacity-75">Please check your GitHub username</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className={`p-6 rounded-2xl border transition-all hover:scale-105 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900/80 to-slate-950/80 border-slate-800/50 hover:border-cyan-400/30'
            : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 hover:border-cyan-400/30'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <Code2 size={20} className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} />
            <span className={`text-xs font-mono uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
              Public Repos
            </span>
          </div>
          <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
            {user.public_repos}
          </p>
        </div>

        <div className={`p-6 rounded-2xl border transition-all hover:scale-105 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900/80 to-slate-950/80 border-slate-800/50 hover:border-emerald-400/30'
            : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 hover:border-emerald-400/30'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <Users size={20} className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} />
            <span className={`text-xs font-mono uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
              Followers
            </span>
          </div>
          <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
            {user.followers}
          </p>
        </div>

        <div className={`p-6 rounded-2xl border transition-all hover:scale-105 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900/80 to-slate-950/80 border-slate-800/50 hover:border-violet-400/30'
            : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 hover:border-violet-400/30'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <GitBranch size={20} className={theme === 'dark' ? 'text-violet-400' : 'text-violet-600'} />
            <span className={`text-xs font-mono uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
              Following
            </span>
          </div>
          <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
            {user.following}
          </p>
        </div>
      </div>

      {/* Top Repositories */}
      {repos.length > 0 && (
        <div>
          <h4 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
            <TrendingUp size={18} />
            Top Repositories
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {repos.slice(0, 4).map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-xl border transition-all hover:scale-105 hover:-translate-y-1 group ${
                  theme === 'dark'
                    ? 'bg-slate-900/50 border-slate-800/50 hover:border-cyan-400/40 hover:bg-slate-800/50'
                    : 'bg-white border-slate-200 hover:border-cyan-400/40 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className={`font-bold truncate flex-1 group-hover:text-cyan-400 transition-colors ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {repo.name}
                  </h5>
                </div>
                <p className={`text-xs line-clamp-2 mb-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>
                  {repo.description || "No description"}
                </p>
                <div className="flex items-center justify-between">
                  {repo.language && (
                    <span className={`text-xs px-2 py-1 rounded-full font-mono ${
                      theme === 'dark'
                        ? 'bg-slate-800/50 text-slate-400'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {repo.language}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-xs font-semibold">
                    <Star size={12} className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} />
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                      {repo.stargazers_count}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Language Breakdown */}
      {Object.keys(languages).length > 0 && (
        <div>
          <h4 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
            <Code2 size={18} />
            Languages
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(languages)
              .sort(([, a], [, b]) => b - a)
              .map(([lang, count]) => (
                <div
                  key={lang}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-slate-800/50 text-slate-300 border border-slate-700/50'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"></span>
                  {lang}{" "}
                  <span className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                    ({count})
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubStats;
