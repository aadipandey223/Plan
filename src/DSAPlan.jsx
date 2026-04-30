import { useState, useEffect, useMemo } from "react";
import { plan } from "./planData";
import StudyPlanner from "./StudyPlanner";
import { 
  CheckCircle2, Circle, Clock, ChevronDown, ChevronRight, 
  BarChart, ListTodo, CalendarClock, Trophy, Play,
  User, Sun, Moon, Flame
} from "lucide-react";

// Standard icon for LeetCode

const LeetCodeIcon = ({ className }) => (
  <img 
    src={"/leetcode.png"}
    alt="LeetCode" 
    className={`object-contain rounded-[4px] ${className}`} 
  />
);

const diffColor = (diff) => {
  if (diff === "Hard") return "text-rose-600 bg-rose-100 border-rose-200 dark:text-rose-400 dark:bg-rose-400/10 dark:border-rose-400/20";
  if (diff === "Medium" || diff === "Hard/Medium") return "text-amber-600 bg-amber-100 border-amber-200 dark:text-amber-400 dark:bg-amber-400/10 dark:border-amber-400/20";
  if (diff === "Easy+" || diff === "Easy→Pattern") return "text-emerald-700 bg-emerald-100 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-400/10 dark:border-emerald-400/20";
  return "text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-400/10 dark:border-slate-400/20";
};

const weekColors = [
  "from-violet-200 to-purple-300 border-violet-300 dark:from-violet-900/40 dark:to-purple-950/40 dark:border-violet-700/30",
  "from-blue-200 to-cyan-300 border-blue-300 dark:from-blue-900/40 dark:to-cyan-950/40 dark:border-blue-700/30",
  "from-emerald-200 to-teal-300 border-emerald-300 dark:from-emerald-900/40 dark:to-teal-950/40 dark:border-emerald-700/30",
  "from-orange-200 to-amber-300 border-orange-300 dark:from-orange-900/40 dark:to-amber-950/40 dark:border-orange-700/30",
  "from-pink-200 to-rose-300 border-pink-300 dark:from-pink-900/40 dark:to-rose-950/40 dark:border-pink-700/30",
  "from-indigo-200 to-blue-300 border-indigo-300 dark:from-indigo-900/40 dark:to-blue-950/40 dark:border-indigo-700/30",
  "from-cyan-200 to-sky-300 border-cyan-300 dark:from-cyan-900/40 dark:to-sky-950/40 dark:border-cyan-700/30",
  "from-amber-200 to-yellow-300 border-amber-300 dark:from-amber-900/40 dark:to-yellow-950/40 dark:border-amber-700/30",
];

const weekAccents = [
  "bg-violet-600 text-white", "bg-blue-600 text-white", "bg-emerald-600 text-white",
  "bg-orange-600 text-white", "bg-pink-600 text-white", "bg-indigo-600 text-white",
  "bg-cyan-600 text-white", "bg-amber-600 text-white",
];

export default function DSAPlan() {
  const [plannerMode, setPlannerMode] = useState("dsa");
  const [activeWeek, setActiveWeek] = useState(0);
  const [expandedDay, setExpandedDay] = useState(null);
  const [activeTab, setActiveTab] = useState("plan"); // "plan" | "backlog" | "profile"
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("dsa-theme");
    return saved || "dark";
  });

  // Load progress. Modernized to support objects {status: "done", date: "YYYY-MM-DD"}
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("dsa-progress-v2");
    if (saved) return JSON.parse(saved);
    
    // Migrate v1 to v2 if exists
    const oldSaved = localStorage.getItem("dsa-progress-v1");
    if (oldSaved) {
      const parsed = JSON.parse(oldSaved);
      const migrated = {};
      const today = new Date().toISOString().split('T')[0];
      for (const key in parsed) {
        migrated[key] = { status: parsed[key], date: today };
      }
      return migrated;
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem("dsa-progress-v2", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem("dsa-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTask = (taskId, newStatus) => {
    setProgress((prev) => {
      const current = prev[taskId] || {};
      const currentStatus = current.status;
      const nextProgress = { ...prev };
      
      const today = new Date().toISOString().split('T')[0];

      if (currentStatus === newStatus) {
        delete nextProgress[taskId];
      } else {
        nextProgress[taskId] = { status: newStatus, date: today };
      }
      return nextProgress;
    });
  };

  const getStatus = (taskId) => progress[taskId]?.status || "todo";

  const w = plan[activeWeek];

  // Calculate overall stats & Streak
  const stats = useMemo(() => {
    let total = 0, done = 0, later = 0;
    const completedDates = new Set();
    
    plan.forEach((wk, wi) => {
      wk.days.forEach((day, di) => {
        // DSA Problems
        day.problems.forEach((p, pi) => {
          total++;
          const id = `w${wi}-d${di}-p${pi}`;
          const stat = getStatus(id);
          if (stat === "done") {
            done++;
            if (progress[id]?.date) completedDates.add(progress[id].date);
          }
          if (stat === "later") later++;
        });

        // Non-DSA Task
        if (day.nonDsa) {
          total++;
          const id = `w${wi}-d${di}-nondsa`;
          const stat = getStatus(id);
          if (stat === "done") {
            done++;
            if (progress[id]?.date) completedDates.add(progress[id].date);
          }
          if (stat === "later") later++;
        }

        // Spaced Repetition Task
        if (day.spaced) {
          total++;
          const id = `w${wi}-d${di}-spaced`;
          const stat = getStatus(id);
          if (stat === "done") {
            done++;
            if (progress[id]?.date) completedDates.add(progress[id].date);
          }
          if (stat === "later") later++;
        }
      });
    });

    // Calculate streak
    const datesArr = Array.from(completedDates).sort().reverse(); 
    let currentStreak = 0;
    let checkDate = new Date();
    checkDate.setHours(0,0,0,0);
    
    let previousDate = new Date(checkDate);
    previousDate.setDate(previousDate.getDate() - 1);

    const todayStr = checkDate.toISOString().split('T')[0];
    const yestStr = previousDate.toISOString().split('T')[0];

    let streakCounterDateId = datesArr.includes(todayStr) ? todayStr : (datesArr.includes(yestStr) ? yestStr : null);
    
    if (streakCounterDateId) {
       let tempDate = new Date(streakCounterDateId);
       while (true) {
         const dStr = tempDate.toISOString().split('T')[0];
         if (datesArr.includes(dStr)) {
           currentStreak++;
           tempDate.setDate(tempDate.getDate() - 1);
         } else {
           break;
         }
       }
    }

    return { 
      total, done, later, 
      percent: Math.round((done / total) * 100) || 0,
      streak: currentStreak,
      completedDates
    };
  }, [progress]);

  // Aggregate backlog items
  const backlogItems = useMemo(() => {
    const items = [];
    plan.forEach((wk, wi) => {
      wk.days.forEach((day, di) => {
        // DSA Problems
        day.problems.forEach((p, pi) => {
          const id = `w${wi}-d${di}-p${pi}`;
          if (getStatus(id) === "later") {
            items.push({ id, type: 'dsa', p, weekNum: wk.week, dayNum: day.day });
          }
        });
        
        // Non-DSA
        const nonDsaId = `w${wi}-d${di}-nondsa`;
        if (getStatus(nonDsaId) === "later") {
          items.push({ id: nonDsaId, type: 'nondsa', p: { name: day.nonDsa }, weekNum: wk.week, dayNum: day.day });
        }

        // Spaced
        const spacedId = `w${wi}-d${di}-spaced`;
        if (getStatus(spacedId) === "later") {
          items.push({ id: spacedId, type: 'spaced', p: { name: day.spaced }, weekNum: wk.week, dayNum: day.day });
        }
      });
    });
    return items;
  }, [progress]);

  const getProblemLink = (p) => {
    if (!p || !p.name || !p.lc || p.lc === "personal" || p.diff === "—") return null;

    // Clean name from markers to generate an exact slug/search text
    let cleanName = p.name.replace(/^Re-solve:\s*/i, '').replace(/\s*\(.*?\)/g, '').trim();

    if (p.lc === "GFG") {
      // Use the first part before a slash (e.g., for "Aggressive Cows / Allocate Books")
      const qName = encodeURIComponent(cleanName.split("/")[0].trim());
      return `https://www.geeksforgeeks.org/explore?page=1&text=${qName}`;
    }
    
    // Standard LeetCode link based on problem name slug
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `https://leetcode.com/problems/${slug}/`;
  };

  const renderProblem = (p, id, indexLabel = null, showContext = false) => {
    const status = getStatus(id);
    const isDone = status === "done";
    const isLater = status === "later";
    const problemLink = getProblemLink(p);

    return (
      <div 
        key={id} 
        className={`group flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl p-3 sm:p-4 border transition-all duration-300 ${
          isDone ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 opacity-70' :
          isLater ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30' :
          'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
      >
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <button 
            onClick={() => toggleTask(id, "done")}
            className="flex-shrink-0 outline-none focus:ring-2 focus:ring-emerald-500 rounded-full mt-1 sm:mt-0 p-1 -m-1"
          >
            {isDone 
              ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
              : <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400" />
            }
          </button>
          
          {indexLabel && (
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold flex-shrink-0 mt-1 sm:mt-0">
              {indexLabel}
            </div>
          )}
          
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1 sm:mb-0">
              <span className={`text-sm sm:text-base leading-tight font-medium transition-colors ${
                isDone ? 'text-slate-400 dark:text-emerald-200/50 line-through' : 'text-slate-800 dark:text-slate-200'
              }`}>
                {p.name}
              </span>
              
              {showContext && (
                <span className="text-[9px] sm:text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  W{showContext.weekNum} D{showContext.dayNum}
                </span>
              )}
            </div>
            {p.lc && (
              <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest mt-1 flex flex-wrap items-center gap-2">
                {p.lc !== "personal" && p.lc !== "GFG" && <span>LC #{p.lc}</span>}
                {p.diff && p.diff !== "—" && (
                  <span className={`px-1.5 py-0.5 rounded font-bold border ${diffColor(p.diff)}`}>
                    {p.diff}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-1.5 mt-2 sm:mt-0 w-full sm:w-auto">
          {/* LeetCode or GFG Direct Link Icon */}
          {problemLink && (
            <a 
              href={problemLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`p-1.5 rounded-lg border transition-all ${
                p.lc === "GFG" 
                ? "text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50" 
                : "text-amber-500 border-amber-200 bg-amber-50 hover:bg-amber-100 dark:text-amber-500 dark:border-amber-900/50 dark:bg-amber-950/30 dark:hover:bg-amber-950/50"
              }`}
              title={p.lc === "GFG" ? `Open ${p.name.split("/")[0]} in GFG` : "Open in LeetCode"}
            >
              {p.lc === "GFG" ? (
                <span className="font-black text-[10px] tracking-widest">GFG</span>
              ) : (
                <LeetCodeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </a>
          )}

          <button
            onClick={() => toggleTask(id, "later")}
            title="Do Later"
            className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:px-2 sm:py-1 rounded-lg sm:rounded text-xs font-semibold sm:font-normal transition-colors flex-1 sm:flex-none ${
              isLater 
              ? 'bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-600/20 dark:text-amber-400 dark:border-amber-600/30' 
              : 'bg-slate-100 text-slate-600 border border-transparent hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isLater ? 'Due' : 'Later'}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div 
      style={{ fontFamily: "'IBM Plex Mono', 'Courier New', monospace" }}
      className="min-h-screen pb-24 selection:bg-indigo-500/30 transition-colors duration-300 bg-slate-50 text-slate-700 dark:bg-[#07070a] dark:text-slate-300"
    >
      {/* Top Header / Progress Dashboard */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b mb-4 sm:mb-6 transition-colors bg-white/90 border-slate-200 dark:bg-[#07070a]/90 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 flex-shrink-0 text-white">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-base sm:text-lg font-bold leading-tight truncate max-w-[120px] sm:max-w-full text-slate-900 dark:text-white">
                Elite DSA
              </h1>
              <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate">
                Aditya Pandey
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
              <button
                onClick={() => setPlannerMode("dsa")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  plannerMode === "dsa"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                DSA
              </button>
              <button
                onClick={() => setPlannerMode("semester")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  plannerMode === "semester"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Semester
              </button>
            </div>

            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full transition-colors bg-slate-100 text-indigo-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-emerald-500 text-xs sm:text-sm font-bold">{stats.percent}% Done</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest">
                  {stats.done} / {stats.total} Tasks
                </span>
              </div>
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border border-slate-300 dark:border-slate-700 overflow-hidden flex-shrink-0">
                <img src="/profile.png" alt="Profile" className="w-[85%] h-[85%] rounded-full object-cover z-0 bg-white dark:bg-slate-900" />
                <svg className="absolute inset-0 w-full h-full -rotate-90 z-10" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="none" className="stroke-transparent" strokeWidth="4"></circle>
                  <circle cx="20" cy="20" r="18" fill="none" className="stroke-emerald-500 transition-all duration-1000" strokeWidth="4" strokeDasharray="113" strokeDashoffset={113 - (113 * stats.percent / 100)} strokeLinecap="round"></circle>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        <div className="sm:hidden flex items-center p-1 mb-4 rounded-lg bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <button
            onClick={() => setPlannerMode("dsa")}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-bold transition-colors ${
              plannerMode === "dsa" ? "bg-indigo-600 text-white" : "text-slate-500"
            }`}
          >
            DSA
          </button>
          <button
            onClick={() => setPlannerMode("semester")}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-bold transition-colors ${
              plannerMode === "semester" ? "bg-emerald-600 text-white" : "text-slate-500"
            }`}
          >
            Semester
          </button>
        </div>
        {plannerMode === "semester" && (
          <div className="mb-6">
            <StudyPlanner />
          </div>
        )}
        {plannerMode === "dsa" && (
          <>
        
        {/* Navigation Tabs */}
        <div className="flex p-1 mb-6 sm:mb-8 rounded-xl border w-full sm:w-fit mx-auto lg:mx-0 shadow-inner bg-slate-100 border-slate-200 dark:bg-slate-900/80 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab("plan")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "plan" 
                ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-white" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span className="hidden sm:inline">Full Plan</span>
          </button>
          <button 
            onClick={() => setActiveTab("backlog")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "backlog" 
                ? "bg-amber-100 text-amber-700 border border-amber-200 shadow-sm dark:bg-amber-600/20 dark:text-amber-400 dark:border-amber-500/10" 
                : "text-slate-500 hover:text-amber-600 dark:hover:text-amber-400"
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            <span className="hidden sm:inline">Due Later</span>
            {stats.later > 0 && (
              <span className="bg-amber-500 text-white dark:text-amber-950 text-[10px] px-1.5 py-0.5 rounded-md ml-1">{stats.later}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "profile" 
                ? "bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm dark:bg-indigo-600/20 dark:text-indigo-400 dark:border-indigo-500/10" 
                : "text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </button>
        </div>

        {/* Tab 3: Profile System & Calendar */}
        {activeTab === "profile" && (
          <div className="animate-in fade-in duration-500 slide-in-from-bottom-4 space-y-6">
            
            {/* Profile Overview Card */}
            <div className="p-6 sm:p-8 rounded-3xl border bg-white border-slate-200 shadow-sm dark:bg-slate-900/50 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border-4 border-slate-50 dark:border-[#07070a] shadow-xl overflow-hidden shadow-indigo-500/20">
                     <img src="/profile.png" alt="Aditya Pandey" className="w-full h-full object-cover bg-white dark:bg-slate-900" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white w-10 h-10 rounded-full border-4 border-slate-50 dark:border-[#07070a] flex items-center justify-center tooltip" title="Current Streak">
                    <Flame className="w-5 h-5 fill-current" />
                  </div>
                </div>

                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-2xl sm:text-3xl font-black mb-1 text-slate-900 dark:text-white">Aditya Pandey</h2>
                  <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-4">Elite DSA Candidate</p>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8">
                    <div>
                      <div className="text-3xl font-black text-emerald-500">{stats.done}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Solved</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-rose-500">{stats.streak}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Day Streak</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-indigo-500">{stats.percent}%</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Completion</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar / Activity Tracker Dummy implementation visually matching GitHub grid */}
            <div className="p-6 sm:p-8 rounded-3xl border bg-white border-slate-200 shadow-sm dark:bg-slate-900/50 dark:border-slate-800">
              <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Activity Streak</h3>
              <p className="text-xs text-slate-500 mb-6">Tracking your problem solving consistency over the last month.</p>
              
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {/* Generate 30 blank days, highlight ones solved */}
                {Array.from({ length: 30 }).map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - (29 - i));
                  const dStr = d.toISOString().split('T')[0];
                  const hasActivity = stats.completedDates.has(dStr);
                  
                  return (
                    <div 
                      key={i} 
                      title={dStr}
                      className={`w-5 h-5 sm:w-8 sm:h-8 rounded-sm sm:rounded transition-colors ${
                        hasActivity 
                          ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
                          : 'bg-slate-200 dark:bg-slate-800'
                      }`} 
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-slate-500 uppercase">
                 <span>Less</span>
                 <div className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-800"></div>
                 <div className="w-3 h-3 rounded-sm bg-emerald-500/50"></div>
                 <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                 <span>More</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: The Plan */}
        {activeTab === "plan" && (
          <div className="animate-in fade-in duration-500">
            {/* Week Carousel */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 mb-2 -mx-3 px-3 sm:mx-0 sm:px-0 hide-scrollbar snap-x snap-mandatory">
              {plan.map((wk, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveWeek(i); setExpandedDay(null); }}
                  className={`flex-shrink-0 px-4 py-3 sm:px-5 sm:py-4 rounded-xl border transition-all relative overflow-hidden group snap-center sm:snap-align-none ${
                    activeWeek === i
                      ? `${weekAccents[i]} border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-indigo-500/20 scale-100`
                      : "bg-white border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 scale-[0.98] dark:bg-slate-900/40 dark:border-slate-800/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80"
                  }`}
                >
                  <div className="text-xs sm:text-sm font-black tracking-widest min-w-[3.5rem] sm:min-w-[4rem] text-center">
                    WEEK {i + 1}
                  </div>
                </button>
              ))}
            </div>

            {/* Active Week Header */}
            <div className={`relative rounded-2xl sm:rounded-3xl border bg-gradient-to-br ${weekColors[activeWeek]} p-5 sm:p-8 mb-6 sm:mb-10 overflow-hidden shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/10`}>
              <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10 pointer-events-none mix-blend-overlay rotate-12 scale-150 sm:scale-100 transform origin-top-right text-slate-900 dark:text-white">
                <BarChart className="w-32 h-32 sm:w-48 sm:h-48" />
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-1 sm:mb-2">
                <span className={`${weekAccents[activeWeek]} text-[10px] sm:text-xs font-black tracking-widest px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md shadow-sm w-fit`}>
                  W{w.week}
                </span>
                <span className="font-extrabold tracking-tight text-xl sm:text-2xl drop-shadow-sm leading-tight pr-10 sm:pr-0 text-slate-900 dark:text-white">
                  {w.theme}
                </span>
              </div>
            </div>

            {/* Days List */}
            <div className="space-y-4">
              {w.days.map((day, di) => {
                const dayIdPrefix = `w${activeWeek}-d${di}`;
                const key = dayIdPrefix;
                const isOpen = expandedDay === key;

                // check if entire day is complete
                const isDayComplete = day.problems.every((_, pi) => getStatus(`${dayIdPrefix}-p${pi}`) === "done");

                return (
                  <div
                    key={di}
                    className={`border rounded-2xl transition-all duration-300 ${
                      isOpen 
                        ? 'shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 my-6 dark:shadow-black/50 dark:ring-slate-700/50' 
                        : 'hover:border-slate-300 dark:hover:border-slate-700'
                    } ${
                      isDayComplete && !isOpen
                        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-950/10"
                        : day.isMock && day.isOA
                        ? "border-amber-200 bg-amber-50 dark:border-amber-600/30 dark:bg-amber-950/10"
                        : day.isMock
                        ? "border-rose-200 bg-rose-50 dark:border-rose-700/30 dark:bg-rose-950/10"
                        : day.isRevision
                        ? "border-teal-200 bg-teal-50 dark:border-teal-700/30 dark:bg-teal-950/10"
                        : "border-slate-200 bg-white dark:border-slate-800/80 dark:bg-slate-900/30"
                    }`}
                  >
                    {/* Day Reveal Header */}
                    <button
                      className="w-full text-left p-4 sm:p-5 flex items-center gap-4 group"
                      onClick={() => setExpandedDay(isOpen ? null : key)}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-inner transition-transform group-hover:scale-105 flex-shrink-0 ${
                        isDayComplete ? "bg-emerald-500/20 text-emerald-500 font-bold" :
                        day.isMock && day.isOA ? "bg-amber-100 text-amber-700 dark:bg-amber-600 dark:text-amber-100" :
                        day.isMock ? "bg-rose-100 text-rose-700 dark:bg-rose-700 dark:text-rose-100" :
                        day.isRevision ? "bg-teal-100 text-teal-700 dark:bg-teal-700 dark:text-teal-100" :
                        weekAccents[activeWeek]
                      }`}>
                        {isDayComplete ? <CheckCircle2 className="w-5 h-5"/> : day.day}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`font-semibold truncate transition-colors ${
                            isDayComplete ? 'text-emerald-600 dark:text-emerald-400/80' : 'text-slate-900 dark:text-slate-100'
                          }`}>
                            {day.pattern}
                          </span>
                          {/* Badges */}
                          {day.isMock && day.isOA && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30 border px-1.5 py-0.5 rounded tracking-widest uppercase">OA SIM</span>}
                          {day.isMock && !day.isOA && <span className="text-[10px] font-bold bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30 border px-1.5 py-0.5 rounded tracking-widest uppercase">MOCK</span>}
                          {day.isRevision && <span className="text-[10px] font-bold bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/30 border px-1.5 py-0.5 rounded tracking-widest uppercase">REVISION</span>}
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                          <span className="flex items-center gap-1 opacity-70"><Clock className="w-3 h-3" /> {day.timeSplit.split('|')[0].trim()}</span>
                          <span className="hidden sm:inline opacity-50">•</span>
                          <span className="hidden sm:inline truncate opacity-70">{day.timeSplit}</span>
                        </div>
                      </div>

                      <div className={`p-2 rounded-full transition-colors ${
                        isOpen 
                          ? 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white' 
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-500 dark:group-hover:bg-slate-800 dark:group-hover:text-slate-300'
                      }`}>
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* Content Body */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="p-4 sm:p-5 pt-0 mt-2 border-t space-y-5 border-slate-200 dark:border-slate-800/50">
                        
                        {/* DSA Tasks */}
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Play className="w-3 h-3 text-indigo-500" /> Action Items
                          </h4>
                          <div className="space-y-2.5">
                            {day.problems.map((p, pi) => renderProblem(p, `${dayIdPrefix}-p${pi}`, pi + 1))}
                          </div>
                        </div>

                        {/* Non-DSA & Spaced Rep */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className={`relative border rounded-xl p-4 transition-all duration-300 group ${
                            getStatus(`${dayIdPrefix}-nondsa`) === "done"
                              ? "bg-emerald-50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/30 opacity-70"
                              : getStatus(`${dayIdPrefix}-nondsa`) === "later"
                              ? "bg-amber-50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/30"
                              : "bg-indigo-50/50 border-indigo-100 hover:bg-indigo-100/50 dark:bg-indigo-950/10 dark:border-indigo-900/20 dark:hover:bg-indigo-950/20"
                          }`}>
                            <div className="flex justify-between items-start gap-2 mb-3">
                              <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                Theory / CS 
                              </div>
                              <button 
                                onClick={() => toggleTask(`${dayIdPrefix}-nondsa`, "done")}
                                className="transition-transform active:scale-90"
                              >
                                {getStatus(`${dayIdPrefix}-nondsa`) === "done" 
                                  ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                  : <Circle className="w-5 h-5 text-indigo-300 dark:text-indigo-800" />
                                }
                              </button>
                            </div>
                            <div className={`text-sm font-medium leading-relaxed mb-4 ${getStatus(`${dayIdPrefix}-nondsa`) === "done" ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-700 dark:text-slate-200"}`}>
                              {day.nonDsa}
                            </div>
                            <button
                              onClick={() => toggleTask(`${dayIdPrefix}-nondsa`, "later")}
                              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                getStatus(`${dayIdPrefix}-nondsa`) === "later"
                                ? "bg-amber-200 text-amber-800 dark:bg-amber-600/30 dark:text-amber-400"
                                : "bg-white/80 text-slate-500 hover:bg-white dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-800"
                              }`}
                            >
                              <Clock className="w-3 h-3" />
                              {getStatus(`${dayIdPrefix}-nondsa`) === "later" ? "Due Later" : "Snooze"}
                            </button>
                          </div>
                          
                          {day.spaced && (
                            <div className={`relative border rounded-xl p-4 transition-all duration-300 group ${
                              getStatus(`${dayIdPrefix}-spaced`) === "done"
                                ? "bg-emerald-50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/30 opacity-70"
                                : getStatus(`${dayIdPrefix}-spaced`) === "later"
                                ? "bg-amber-50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/30"
                                : "bg-purple-50/50 border-purple-100 hover:bg-purple-100/50 dark:bg-purple-950/10 dark:border-purple-900/20 dark:hover:bg-purple-950/20"
                            }`}>
                              <div className="flex justify-between items-start gap-2 mb-3">
                                <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                                  Spaced Rep
                                </div>
                                <button 
                                  onClick={() => toggleTask(`${dayIdPrefix}-spaced`, "done")}
                                  className="transition-transform active:scale-90"
                                >
                                  {getStatus(`${dayIdPrefix}-spaced`) === "done" 
                                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    : <Circle className="w-5 h-5 text-purple-300 dark:text-purple-800" />
                                  }
                                </button>
                              </div>
                              <div className={`text-sm font-medium leading-relaxed mb-4 ${getStatus(`${dayIdPrefix}-spaced`) === "done" ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-700 dark:text-slate-200"}`}>
                                {day.spaced}
                              </div>
                              <button
                                onClick={() => toggleTask(`${dayIdPrefix}-spaced`, "later")}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                  getStatus(`${dayIdPrefix}-spaced`) === "later"
                                  ? "bg-amber-200 text-amber-800 dark:bg-amber-600/30 dark:text-amber-400"
                                  : "bg-white/80 text-slate-500 hover:bg-white dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-800"
                                }`}
                              >
                                <Clock className="w-3 h-3" />
                                {getStatus(`${dayIdPrefix}-spaced`) === "later" ? "Due Later" : "Snooze"}
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Backlog / Later List */}
        {activeTab === "backlog" && (
          <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-wide mb-1 text-slate-900 dark:text-white">Due Later / Backlog</h2>
              <p className="text-sm text-slate-500">Tasks you snoozed. Mark them done here when complete.</p>
            </div>

            {backlogItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 border rounded-2xl text-center bg-slate-50 border-slate-200 dark:bg-slate-900/30 dark:border-slate-800/50">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-slate-200 dark:bg-slate-800">
                  <CheckCircle2 className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-bold mb-1 text-slate-700 dark:text-slate-300">Zero Backlog</h3>
                <p className="text-sm text-slate-500 max-w-sm">You have no tasks marked for later! You're crushing it.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {backlogItems.map(item => renderProblem(item.p, item.id, null, { weekNum: item.weekNum, dayNum: item.dayNum }))}
              </div>
            )}
          </div>
        )}
          </>
        )}

      </main>
    </div>
  );
}