import { useEffect, useMemo, useState } from "react";
import "./AmazonWow.css";

const STORAGE_KEY = "amazonWowTracker";

const initialQuestions = [
  { id: "1-1", section: "Arrays & Strings", title: "Find max difference between max and min of all subarrays of size k", link: "https://leetcode.com/problems/sliding-window-maximum/", difficulty: "hard" },
  { id: "1-2", section: "Arrays & Strings", title: "Count unique palindromic substrings in a string", link: "https://leetcode.com/problems/palindromic-substrings/", difficulty: "medium" },
  { id: "1-3", section: "Arrays & Strings", title: "Sliding window — find all anagrams of a pattern in a string", link: "https://leetcode.com/problems/find-all-anagrams-in-a-string/", difficulty: "medium" },
  { id: "1-4", section: "Arrays & Strings", title: "Two pointer — container with most water", link: "https://leetcode.com/problems/container-with-most-water/", difficulty: "medium" },
  { id: "1-5", section: "Arrays & Strings", title: "Counting inversions in an array", link: "https://practice.geeksforgeeks.org/problems/inversion-of-array/0", difficulty: "hard" },
  { id: "1-6", section: "Arrays & Strings", title: "Find leftmost and rightmost set bit, count total set bits", link: "https://leetcode.com/problems/number-of-1-bits/", difficulty: "easy" },
  { id: "1-7", section: "Arrays & Strings", title: "Permutation of size N, find number of subarrays having median = x", link: "https://leetcode.com/problems/count-subarrays-with-median-k/", difficulty: "hard" },
  { id: "1-8", section: "Arrays & Strings", title: "Group strings that can be made identical by replacing wildcards", link: "https://leetcode.com/problems/group-anagrams/", difficulty: "medium" },
  { id: "1-9", section: "Arrays & Strings", title: "Maximum subarray sum (Kadane's algorithm)", link: "https://leetcode.com/problems/maximum-subarray/", difficulty: "medium" },
  { id: "1-10", section: "Arrays & Strings", title: "Trapping rain water", link: "https://leetcode.com/problems/trapping-rain-water/", difficulty: "hard" },
  { id: "1-11", section: "Arrays & Strings", title: "Rotate a matrix 90 degrees in-place", link: "https://leetcode.com/problems/rotate-image/", difficulty: "medium" },
  { id: "1-12", section: "Arrays & Strings", title: "Find mean, median, and mode of an array", link: "https://www.hackerrank.com/challenges/s10-basic-statistics/problem", difficulty: "easy" },
  { id: "2-1", section: "Linked Lists", title: "Reverse a linked list in groups of k", link: "https://leetcode.com/problems/reverse-nodes-in-k-group/", difficulty: "hard" },
  { id: "2-2", section: "Linked Lists", title: "Alternate reversal — odd-indexed groups reversed, even kept same", link: "https://practice.geeksforgeeks.org/problems/reverse-alternate-nodes-in-link-list/1", difficulty: "hard" },
  { id: "2-3", section: "Linked Lists", title: "Detect and remove a cycle in a linked list", link: "https://leetcode.com/problems/linked-list-cycle-ii/", difficulty: "medium" },
  { id: "2-4", section: "Linked Lists", title: "Merge two sorted linked lists", link: "https://leetcode.com/problems/merge-two-sorted-lists/", difficulty: "easy" },
  { id: "2-5", section: "Linked Lists", title: "Find the middle of a linked list", link: "https://leetcode.com/problems/middle-of-the-linked-list/", difficulty: "easy" },
  { id: "2-6", section: "Linked Lists", title: "Clone a linked list with random pointers", link: "https://leetcode.com/problems/copy-list-with-random-pointer/", difficulty: "medium" },
  { id: "3-1", section: "Trees & BST", title: "Level order traversal in spiral (zigzag) form", link: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/", difficulty: "medium" },
  { id: "3-2", section: "Trees & BST", title: "Find distance between two given nodes in a binary tree", link: "https://practice.geeksforgeeks.org/problems/min-distance-between-two-given-nodes-of-a-binary-tree/1", difficulty: "medium" },
  { id: "3-3", section: "Trees & BST", title: "Detect and fix a violation of BST property", link: "https://leetcode.com/problems/recover-binary-search-tree/", difficulty: "hard" },
  { id: "3-4", section: "Trees & BST", title: "Lowest common ancestor in a BST", link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", difficulty: "medium" },
  { id: "3-5", section: "Trees & BST", title: "Check if a binary tree is balanced", link: "https://leetcode.com/problems/balanced-binary-tree/", difficulty: "easy" },
  { id: "3-6", section: "Trees & BST", title: "Serialize and deserialize a binary tree", link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", difficulty: "hard" },
  { id: "3-7", section: "Trees & BST", title: "Diameter of a binary tree", link: "https://leetcode.com/problems/diameter-of-binary-tree/", difficulty: "easy" },
  { id: "4-1", section: "Graphs", title: "Number of islands using DFS", link: "https://leetcode.com/problems/number-of-islands/", difficulty: "medium" },
  { id: "4-2", section: "Graphs", title: "Find the largest connected component in a 0/1 matrix", link: "https://leetcode.com/problems/max-area-of-island/", difficulty: "medium" },
  { id: "4-3", section: "Graphs", title: "Word Ladder — reach target string in minimum steps (BFS)", link: "https://leetcode.com/problems/word-ladder/", difficulty: "hard" },
  { id: "4-4", section: "Graphs", title: "Bipartite graph check (family of ants problem)", link: "https://leetcode.com/problems/is-graph-bipartite/", difficulty: "medium" },
  { id: "4-5", section: "Graphs", title: "Detect cycle in directed and undirected graph", link: "https://leetcode.com/problems/course-schedule/", difficulty: "medium" },
  { id: "4-6", section: "Graphs", title: "Topological sort", link: "https://leetcode.com/problems/course-schedule-ii/", difficulty: "medium" },
  { id: "4-7", section: "Graphs", title: "Dijkstra's shortest path algorithm", link: "https://leetcode.com/problems/network-delay-time/", difficulty: "medium" },
  { id: "5-1", section: "Dynamic Programming", title: "Stickler Thief / House Robber (1D DP)", link: "https://leetcode.com/problems/house-robber/", difficulty: "medium" },
  { id: "5-2", section: "Dynamic Programming", title: "Longest Palindromic Subsequence", link: "https://leetcode.com/problems/longest-palindromic-subsequence/", difficulty: "medium" },
  { id: "5-3", section: "Dynamic Programming", title: "Longest Common Subsequence", link: "https://leetcode.com/problems/longest-common-subsequence/", difficulty: "medium" },
  { id: "5-4", section: "Dynamic Programming", title: "Coin change problem", link: "https://leetcode.com/problems/coin-change/", difficulty: "medium" },
  { id: "5-5", section: "Dynamic Programming", title: "K-th Symbol in Grammar", link: "https://leetcode.com/problems/k-th-symbol-in-grammar/", difficulty: "medium" },
  { id: "5-6", section: "Dynamic Programming", title: "0-1 Knapsack", link: "https://practice.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1", difficulty: "medium" },
  { id: "5-7", section: "Dynamic Programming", title: "Number of trailing zeroes in N!", link: "https://leetcode.com/problems/factorial-trailing-zeroes/", difficulty: "medium" },
  { id: "6-1", section: "Advanced DSA", title: "LRU Cache — full implementation", link: "https://leetcode.com/problems/lru-cache/", difficulty: "medium" },
  { id: "6-2", section: "Advanced DSA", title: "Trie implementation — insert, search, startsWith", link: "https://leetcode.com/problems/implement-trie-prefix-tree/", difficulty: "medium" },
  { id: "6-3", section: "Advanced DSA", title: "Find strings NOT a prefix of any other string using Trie", link: "https://leetcode.com/problems/short-encoding-of-words/", difficulty: "medium" },
  { id: "6-4", section: "Advanced DSA", title: "Merge K sorted lists", link: "https://leetcode.com/problems/merge-k-sorted-lists/", difficulty: "hard" },
  { id: "6-5", section: "Advanced DSA", title: "Infix to postfix conversion using stack", link: "https://practice.geeksforgeeks.org/problems/infix-to-postfix-1587115620/1", difficulty: "medium" },
  { id: "6-6", section: "Advanced DSA", title: "Hard array problem: optimize O(n³) → O(n²) → O(n log n) → O(n)", link: "#", difficulty: "hard" },
  { id: "7-1", section: "Operating Systems", title: "Explain Banker's Algorithm with an example", link: "#", difficulty: "theory" },
  { id: "7-2", section: "Operating Systems", title: "What is Thrashing and how to prevent it?", link: "#", difficulty: "theory" },
  { id: "7-3", section: "Operating Systems", title: "Explain Deadlock — conditions, prevention, avoidance, recovery", link: "#", difficulty: "theory" },
  { id: "7-4", section: "Operating Systems", title: "Semaphore vs Mutex — difference and use cases", link: "#", difficulty: "theory" },
  { id: "7-5", section: "Operating Systems", title: "Process vs thread — difference and when to use each", link: "#", difficulty: "theory" },
  { id: "7-6", section: "Operating Systems", title: "What is paging and segmentation?", link: "#", difficulty: "theory" },
  { id: "7-7", section: "Operating Systems", title: "CPU scheduling algorithms — FCFS, SJF, RR, Priority", link: "#", difficulty: "theory" },
  { id: "7-8", section: "Operating Systems", title: "What is a context switch?", link: "#", difficulty: "theory" },
  { id: "8-1", section: "DBMS", title: "Explain ACID properties with examples", link: "#", difficulty: "theory" },
  { id: "8-2", section: "DBMS", title: "Difference between DELETE, TRUNCATE, DROP", link: "#", difficulty: "theory" },
  { id: "8-3", section: "DBMS", title: "Normalization forms — 1NF, 2NF, 3NF, BCNF with examples", link: "#", difficulty: "theory" },
  { id: "8-4", section: "DBMS", title: "Indexing — clustered vs non-clustered index", link: "#", difficulty: "theory" },
  { id: "8-5", section: "DBMS", title: "What is a transaction? Explain commit and rollback", link: "#", difficulty: "theory" },
  { id: "8-6", section: "DBMS", title: "SQL joins — INNER, LEFT, RIGHT, FULL OUTER with examples", link: "#", difficulty: "theory" },
  { id: "8-7", section: "DBMS", title: "What is a deadlock in DBMS and how to handle it?", link: "#", difficulty: "theory" },
  { id: "9-1", section: "OOPs", title: "Four pillars of OOPs with real-world examples", link: "#", difficulty: "theory" },
  { id: "9-2", section: "OOPs", title: "Types of inheritance", link: "#", difficulty: "theory" },
  { id: "9-3", section: "OOPs", title: "Difference between abstract class and interface", link: "#", difficulty: "theory" },
  { id: "9-4", section: "OOPs", title: "Polymorphism — compile-time vs runtime", link: "#", difficulty: "theory" },
  { id: "9-5", section: "OOPs", title: "Method overloading vs overriding", link: "#", difficulty: "theory" },
  { id: "9-6", section: "OOPs", title: "Constructor and destructor — purpose and usage", link: "#", difficulty: "theory" },
  { id: "9-7", section: "OOPs", title: "Difference between linear and non-linear data structures", link: "#", difficulty: "theory" },
  { id: "10-1", section: "Computer Networks", title: "OSI model — all 7 layers and their functions", link: "#", difficulty: "theory" },
  { id: "10-2", section: "Computer Networks", title: "TCP vs UDP — differences and when to use each", link: "#", difficulty: "theory" },
  { id: "10-3", section: "Computer Networks", title: "What is DNS and how does it resolve a domain?", link: "#", difficulty: "theory" },
  { id: "10-4", section: "Computer Networks", title: "HTTP vs HTTPS — difference and how SSL/TLS works", link: "#", difficulty: "theory" },
  { id: "10-5", section: "Computer Networks", title: "What is a socket?", link: "#", difficulty: "theory" },
  { id: "10-6", section: "Computer Networks", title: "Difference between L1, L2, L3 cache", link: "#", difficulty: "theory" },
  { id: "11-1", section: "Leadership Principles", title: "Customer Obsession: went beyond scope for a user", link: "#", difficulty: "theory" },
  { id: "11-2", section: "Leadership Principles", title: "Ownership: took responsibility outside your role", link: "#", difficulty: "theory" },
  { id: "11-3", section: "Leadership Principles", title: "Invent and Simplify: simplified a complex process", link: "#", difficulty: "theory" },
  { id: "11-4", section: "Leadership Principles", title: "Are Right A Lot: decision with incomplete information", link: "#", difficulty: "theory" },
  { id: "11-5", section: "Leadership Principles", title: "Learn and Be Curious: new skill picked up on your own", link: "#", difficulty: "theory" },
  { id: "11-6", section: "Leadership Principles", title: "Insist on Highest Standards: pushed back on low-quality work", link: "#", difficulty: "theory" },
  { id: "11-7", section: "Leadership Principles", title: "Think Big: proposed an ambitious idea", link: "#", difficulty: "theory" },
  { id: "11-8", section: "Leadership Principles", title: "Bias for Action: acted quickly without full approval", link: "#", difficulty: "theory" },
  { id: "11-9", section: "Leadership Principles", title: "Frugality: achieved more with fewer resources", link: "#", difficulty: "theory" },
  { id: "11-10", section: "Leadership Principles", title: "Earn Trust: rebuild trust with a teammate", link: "#", difficulty: "theory" },
  { id: "11-11", section: "Leadership Principles", title: "Dive Deep: discovered a root cause others missed", link: "#", difficulty: "theory" },
  { id: "11-12", section: "Leadership Principles", title: "Have Backbone: disagreed with manager", link: "#", difficulty: "theory" },
  { id: "11-13", section: "Leadership Principles", title: "Deliver Results: delivered under tight deadline", link: "#", difficulty: "theory" },
  { id: "11-14", section: "Leadership Principles", title: "Tell me about a time you failed — what did you learn?", link: "#", difficulty: "theory" },
  { id: "11-15", section: "Leadership Principles", title: "Teammates didn't agree with your idea — what did you do?", link: "#", difficulty: "theory" },
  { id: "11-16", section: "Leadership Principles", title: "What will you do if given a deadline you cannot realistically meet?", link: "#", difficulty: "theory" }
].map((q) => ({ ...q, isDone: false, reviewLater: false }));

function getStatus(item) {
  if (item.isDone) return { code: "done", text: "Completed", icon: "✅" };
  if (item.reviewLater) return { code: "later", text: "Review Later", icon: "⭐" };
  return { code: "pending", text: "Pending", icon: "⏳" };
}

export default function AmazonWow({ theme = "dark", onToggleTheme }) {
  const [appData, setAppData] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const merged = initialQuestions.map((iq) => {
          const found = parsed.find((p) => p.id === iq.id);
          return found ? { ...iq, isDone: !!found.isDone, reviewLater: !!found.reviewLater } : iq;
        });
        setAppData(merged);
        return;
      } catch (_) {
        // Fall through to defaults.
      }
    }
    setAppData(initialQuestions);
  }, []);

  useEffect(() => {
    if (appData.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    }
  }, [appData]);

  const grouped = useMemo(() => {
    const sections = {};
    appData.forEach((item) => {
      if (!sections[item.section]) sections[item.section] = [];
      sections[item.section].push(item);
    });
    return sections;
  }, [appData]);

  const globalCompleted = useMemo(
    () => appData.filter((i) => i.isDone).length,
    [appData]
  );
  const globalTotal = appData.length;
  const globalPct = globalTotal ? Math.round((globalCompleted / globalTotal) * 100) : 0;

  const matchesFilter = (item) => {
    const status = getStatus(item);
    if (currentFilter === "all") return true;
    if (currentFilter === "done") return status.code === "done";
    if (currentFilter === "later") return status.code === "later";
    if (currentFilter === "pending") return status.code === "pending";
    return true;
  };

  const toggleDone = (id) => {
    setAppData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isDone: !item.isDone } : item))
    );
  };

  const toggleLater = (id) => {
    setAppData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, reviewLater: !item.reviewLater } : item
      )
    );
  };

  return (
    <div className="amazon-wow-root" data-theme={theme === "dark" ? "dark" : "light"}>
      <div className="wow-ambient-orb" />
      <div className="wow-container">
        <header className="wow-header wow-glass-panel">
          <div className="wow-header-content">
            <h1>Amazon WOW</h1>
            <p>Preparation Dashboard</p>
          </div>
          <button className="wow-theme-toggle" onClick={onToggleTheme} aria-label="Toggle Theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </header>

        <div className="wow-dashboard">
          <div className="wow-progress-container wow-glass-panel">
            <div className="wow-progress-header">
              <span className="wow-progress-title">Mastery Level</span>
              <span className="wow-progress-stats">{globalCompleted} / {globalTotal} ({globalPct}%)</span>
            </div>
            <div className="wow-progress-track">
              <div className="wow-progress-fill" style={{ width: `${globalPct}%` }} />
            </div>
          </div>

          <div className="wow-filters">
            {[
              { id: "all", label: "All Quests" },
              { id: "pending", label: "In Progress" },
              { id: "later", label: "Review Later" },
              { id: "done", label: "Completed" }
            ].map((f) => (
              <button
                key={f.id}
                className={`wow-filter-btn ${currentFilter === f.id ? "active" : ""}`}
                onClick={() => setCurrentFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          {Object.entries(grouped).map(([secName, items]) => {
            const secTotal = items.length;
            const secCompleted = items.filter((i) => i.isDone).length;
            const filteredItems = items.filter(matchesFilter);
            if (!filteredItems.length && currentFilter !== "all") return null;

            return (
              <div key={secName} className="wow-section-wrapper">
                <div className="wow-section-title">
                  <span>{secName}</span>
                  <span className="wow-section-progress">{secCompleted} / {secTotal}</span>
                </div>
                <div className="wow-grid">
                  {filteredItems.map((item) => {
                    const status = getStatus(item);
                    return (
                      <div key={item.id} className={`wow-q-card wow-glass-panel ${item.isDone ? "done" : ""}`}>
                        <div className="wow-q-card-left">
                          <div className="wow-checkbox-wrapper">
                            <input
                              type="checkbox"
                              className="wow-custom-checkbox"
                              checked={item.isDone}
                              onChange={() => toggleDone(item.id)}
                            />
                          </div>
                          <div className="wow-q-details">
                            <div className="wow-q-title">{item.title}</div>
                            <div className="wow-q-meta">
                              <span className={`wow-tag wow-diff-${item.difficulty}`}>{item.difficulty}</span>
                              {item.link !== "#" ? (
                                <a href={item.link} target="_blank" rel="noreferrer" className="wow-lc-link">
                                  🔗 Practice
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="wow-q-card-right">
                          <div className={`wow-status-badge wow-status-${status.code}`}>
                            <span>{status.icon}</span> {status.text}
                          </div>
                          <button
                            className={`wow-later-btn ${item.reviewLater ? "active" : ""}`}
                            onClick={() => toggleLater(item.id)}
                          >
                            {item.reviewLater ? "★ Saved" : "☆ Later"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
