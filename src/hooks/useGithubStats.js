import { useEffect, useState } from "react";

const CACHE_KEY = "cx-github-stats";
const TTL_MS = 60 * 60 * 1000;

/**
 * Public GitHub profile numbers (repos, followers) for a live hero stat.
 * Unauthenticated (60 req/h per IP), cached for an hour in sessionStorage,
 * and silently `null` on any failure so the UI just omits the stat.
 *
 * @param {string} user GitHub login
 */
export const useGithubStats = (user) => {
  const [stats, setStats] = useState(() => {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
      return cached && cached.user === user && Date.now() - cached.at < TTL_MS ? cached.stats : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (stats) return;
    const ctrl = new AbortController();
    fetch(`https://api.github.com/users/${encodeURIComponent(user)}`, {
      signal: ctrl.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data || typeof data.public_repos !== "number") return;
        const next = { repos: data.public_repos, followers: data.followers ?? 0 };
        setStats(next);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ user, at: Date.now(), stats: next }));
        } catch {
          /* cache is best-effort */
        }
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [user, stats]);

  return stats;
};
