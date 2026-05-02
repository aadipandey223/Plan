import { useMemo, useState, useEffect, useRef } from "react";
import {
  BookOpen, Calendar, CheckCircle, CheckSquare, Clock, BarChart2,
  AlertTriangle, ShieldAlert, Play, Square, Flame, GripVertical,
  Download, Upload, Search, Timer, Pause, RotateCcw, Target,
  TrendingUp, Zap, Bell, ChevronDown, ChevronUp, Star, BookMarked,
  Trophy, RefreshCw, Lock, Copy, Check,
} from "lucide-react";

// ─── Subject color system ────────────────────────────────────────────────────
const SUBJECT_COLORS = {
  "Compiler Design": {
    bg: "bg-violet-500/10 dark:bg-violet-500/10",
    border: "border-violet-400/30 dark:border-violet-500/20",
    badge: "bg-violet-500 text-white",
    badgeSoft: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
    bar: "bg-violet-500",
    dot: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-400",
    gradient: "from-violet-500/20 to-purple-500/10",
    accent: "violet",
  },
  "Computer Networks-II": {
    bg: "bg-blue-500/10 dark:bg-blue-500/10",
    border: "border-blue-400/30 dark:border-blue-500/20",
    badge: "bg-blue-500 text-white",
    badgeSoft: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    bar: "bg-blue-500",
    dot: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400",
    gradient: "from-blue-500/20 to-cyan-500/10",
    accent: "blue",
  },
  "Software Engineering": {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/10",
    border: "border-emerald-400/30 dark:border-emerald-500/20",
    badge: "bg-emerald-500 text-white",
    badgeSoft: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    gradient: "from-emerald-500/20 to-teal-500/10",
    accent: "emerald",
  },
  "Full Stack Web Development": {
    bg: "bg-orange-500/10 dark:bg-orange-500/10",
    border: "border-orange-400/30 dark:border-orange-500/20",
    badge: "bg-orange-500 text-white",
    badgeSoft: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
    bar: "bg-orange-500",
    dot: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-400",
    gradient: "from-orange-500/20 to-amber-500/10",
    accent: "orange",
  },
  DevOps: {
    bg: "bg-rose-500/10 dark:bg-rose-500/10",
    border: "border-rose-400/30 dark:border-rose-500/20",
    badge: "bg-rose-500 text-white",
    badgeSoft: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
    bar: "bg-rose-500",
    dot: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    gradient: "from-rose-500/20 to-pink-500/10",
    accent: "rose",
  },
};

const SUBJECTS = Object.keys(SUBJECT_COLORS);

const SUBJECT_SHORT = {
  "Compiler Design": "CD",
  "Computer Networks-II": "CN",
  "Software Engineering": "SE",
  "Full Stack Web Development": "FS",
  DevOps: "DO",
};

// ─── Syllabus data (unchanged) ───────────────────────────────────────────────
const SYLLABUS_DATA = {
  "Compiler Design": {
    topics: [
      { name: "Compiler Phases + Diagram", priority: "high", expected: true },
      { name: "Lexical Analysis (tokens, regex, LEX)", priority: "high", expected: false },
      { name: "FIRST & FOLLOW", priority: "high", expected: false },
      { name: "LL(1) parsing table", priority: "high", expected: true },
      { name: "LR(0), SLR, CLR, LALR", priority: "high", expected: false },
      { name: "Syntax Directed Translation (SDT / SDD)", priority: "high", expected: false },
      { name: "3 Address Code", priority: "high", expected: true },
      { name: "Quadruples / Triples", priority: "high", expected: false },
      { name: "DAG", priority: "high", expected: false },
      { name: "CSE Optimization", priority: "high", expected: false },
      { name: "Dead Code & Peephole", priority: "high", expected: false },
      { name: "Backpatching", priority: "mid", expected: false },
      { name: "Activation Record", priority: "mid", expected: false },
      { name: "Symbol Table", priority: "mid", expected: false },
    ],
    pyqs: [
      { text: "Compiler phases + lexical (2023)", expected: false },
      { text: "Parsing concepts (2024)", expected: false },
      { text: "SDT application (2022)", expected: false },
      { text: "Intermediate code (2023)", expected: false },
      { text: "Code Optimization (2024)", expected: false },
      { text: "Construct LL(1) parsing table", expected: true },
      { text: "Write 3-address code for expression", expected: true },
    ],
  },
  "Computer Networks-II": {
    topics: [
      { name: "Link State Routing", priority: "high", expected: true },
      { name: "Distance Vector Routing", priority: "high", expected: false },
      { name: "CRC + Error Detection", priority: "high", expected: true },
      { name: "CSMA/CD", priority: "high", expected: false },
      { name: "ALOHA", priority: "high", expected: false },
      { name: "RTP Protocol", priority: "high", expected: true },
      { name: "RTCP & RTSP", priority: "high", expected: false },
      { name: "Socket Programming", priority: "high", expected: false },
      { name: "TCP vs UDP", priority: "high", expected: false },
      { name: "SDN + OpenFlow", priority: "mid", expected: false },
      { name: "VLAN", priority: "mid", expected: false },
      { name: "SNMP", priority: "mid", expected: false },
    ],
    pyqs: [
      { text: "Routing Algorithms Link State vs Distance Vector (2023)", expected: false },
      { text: "CRC / MAC comparison (2024)", expected: false },
      { text: "RTP / multimedia (2022)", expected: false },
      { text: "SDN architecture (2023)", expected: false },
      { text: "Socket programming basics (2024)", expected: false },
      { text: "Solve CRC numerical", expected: true },
      { text: "Explain RTP protocol in detail", expected: true },
    ],
  },
  "Software Engineering": {
    topics: [
      { name: "SDLC Models", priority: "high", expected: true },
      { name: "Requirement Engineering", priority: "high", expected: false },
      { name: "SRS Structure", priority: "high", expected: false },
      { name: "Cohesion & Coupling", priority: "high", expected: false },
      { name: "Unit / Integration Testing", priority: "high", expected: false },
      { name: "White vs Black box", priority: "high", expected: false },
      { name: "Cyclomatic complexity", priority: "mid", expected: false },
      { name: "Function Point", priority: "mid", expected: false },
      { name: "COCOMO Model", priority: "mid", expected: false },
      { name: "Maintenance types", priority: "mid", expected: false },
    ],
    pyqs: [
      { text: "SDLC phases and models (2023)", expected: false },
      { text: "SRS document structure (2024)", expected: false },
      { text: "Design principles (2022)", expected: false },
      { text: "Testing methodologies (2023)", expected: false },
      { text: "Metrics and complexity (2024)", expected: false },
      { text: "Explain SDLC models with diagrams", expected: true },
    ],
  },
  "Full Stack Web Development": {
    topics: [
      { name: "HTML (forms, tags)", priority: "high", expected: false },
      { name: "CSS (box model, positioning)", priority: "high", expected: false },
      { name: "JavaScript DOM", priority: "high", expected: false },
      { name: "JavaScript Events", priority: "high", expected: false },
      { name: "PHP Form handling", priority: "high", expected: false },
      { name: "PHP DB connectivity", priority: "high", expected: false },
      { name: "AJAX implementation", priority: "mid", expected: false },
      { name: "JSON vs XML", priority: "mid", expected: false },
      { name: "React basics", priority: "mid", expected: false },
    ],
    pyqs: [
      { text: "HTML/CSS layout creation (2023)", expected: false },
      { text: "JS event handling (2024)", expected: false },
      { text: "PHP form submission (2022)", expected: false },
      { text: "AJAX requests (2023)", expected: false },
      { text: "Short notes on JSON/XML (2024)", expected: false },
    ],
  },
  DevOps: {
    topics: [
      { name: "Git workflows", priority: "high", expected: false },
      { name: "Docker containers", priority: "high", expected: false },
      { name: "CI/CD (Jenkins)", priority: "high", expected: false },
      { name: "Kubernetes architecture", priority: "mid", expected: false },
      { name: "Testing tools integration", priority: "mid", expected: false },
    ],
    pyqs: [
      { text: "DevOps basics and culture (2023)", expected: false },
      { text: "Git version control (2024)", expected: false },
      { text: "CI/CD pipeline (2022)", expected: false },
      { text: "Docker vs VM (2023)", expected: false },
      { text: "Kubernetes orchestration (2024)", expected: false },
    ],
  },
};

const STORAGE_KEY = "semester-study-plan-v2";
const LEGACY_STORAGE_KEY = "semester-study-plan-v1";
const MOCKS_KEY = "semester-mocks-v1";
const REVISION_GAPS = { "Not Understood": [1, 3, 7], Weak: [2, 5, 10], Important: [3, 7, 14], none: [2, 5, 10] };
const DEFAULT_POMODORO_SECONDS = 25 * 60;

const FLAG_CONFIG = {
  none: { label: "No Flag", color: "text-slate-400", bg: "" },
  "Not Understood": { label: "Not Understood", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
  Weak: { label: "Weak", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
  Important: { label: "Important", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
};

const toDateStr = (date) => new Date(date).toISOString().split("T")[0];
const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return toDateStr(d);
};
const dayIndexFromPlan = (day) => (day.week - 1) * 6 + (day.day - 1);

const generateSyllabus = () => {
  const plans = [];
  SUBJECTS.forEach((subject) => {
    const data = SYLLABUS_DATA[subject];
    let topicIdx = 0;
    let pyqIdx = 0;
    for (let w = 1; w <= 3; w++) {
      for (let d = 1; d <= 6; d++) {
        const dayTopics = [];
        const dayPyqs = [];
        if (topicIdx < data.topics.length) {
          dayTopics.push({ id: `t_${topicIdx}`, ...data.topics[topicIdx], completed: false, flag: "none" });
          topicIdx++;
        }
        if (topicIdx < data.topics.length && (w * d) % 2 === 0) {
          dayTopics.push({ id: `t_${topicIdx}`, ...data.topics[topicIdx], completed: false, flag: "none" });
          topicIdx++;
        }
        if (pyqIdx < data.pyqs.length) {
          dayPyqs.push({ id: `p_${pyqIdx}`, name: data.pyqs[pyqIdx].text, expected: data.pyqs[pyqIdx].expected, completed: false });
          pyqIdx++;
        }
        if (dayTopics.length === 0) {
          dayTopics.push({ id: `rev_${w}_${d}`, name: "Revision & Practice", priority: "mid", completed: false, flag: "none" });
        }
        plans.push({ id: `${subject.replace(/\s+/g, "")}_W${w}_D${d}`, subject, week: w, day: d, topics: dayTopics, pyqs: dayPyqs });
      }
    }
  });
  return plans;
};

const normalizePlan = (rawPlan) => {
  if (!Array.isArray(rawPlan) || rawPlan.length === 0) return generateSyllabus();
  return rawPlan.map((day) => ({
    ...day,
    topics: (day.topics || []).map((t) => ({ ...t, completed: Boolean(t.completed), flag: t.flag || "none", note: t.note || "", completedAt: t.completedAt || null })),
    pyqs: (day.pyqs || []).map((p) => ({ ...p, completed: Boolean(p.completed), note: p.note || "", completedAt: p.completedAt || null })),
  }));
};

const loadState = () => {
  try {
    const v2Raw = localStorage.getItem(STORAGE_KEY);
    if (v2Raw) {
      const parsed = JSON.parse(v2Raw);
      if (parsed && parsed.version === 2) {
        return { plan: normalizePlan(parsed.plan), revisions: Array.isArray(parsed.revisions) ? parsed.revisions : [], mocks: Array.isArray(parsed.mocks) ? parsed.mocks : [], settings: parsed.settings || {} };
      }
    }
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const plan = normalizePlan(JSON.parse(legacyRaw));
      const mocks = JSON.parse(localStorage.getItem(MOCKS_KEY) || "[]");
      return { plan, revisions: [], mocks: Array.isArray(mocks) ? mocks : [], settings: {} };
    }
  } catch { /* fall through */ }
  return { plan: generateSyllabus(), revisions: [], mocks: [], settings: {} };
};

// ─── Reusable mini components ────────────────────────────────────────────────
function SubjectBadge({ subject, size = "sm" }) {
  const c = SUBJECT_COLORS[subject];
  const short = SUBJECT_SHORT[subject];
  return (
    <span className={`inline-flex items-center font-bold rounded-md ${c.badgeSoft} ${size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5"}`}>
      {short}
    </span>
  );
}

function ProgressRing({ percent, size = 48, stroke = 4, color = "stroke-emerald-500" }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * percent) / 100;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" className={`${color} transition-all duration-700`} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  );
}

function ReadinessBar({ value, max = 100 }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-rose-500";
  const label = pct >= 70 ? "Good" : pct >= 40 ? "Fair" : "Needs Work";
  const labelColor = pct >= 70 ? "text-emerald-500" : pct >= 40 ? "text-amber-500" : "text-rose-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${labelColor}`}>{label}</span>
    </div>
  );
}

function PomodoroWidget({ seconds, running, onToggle, onReset }) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const pct = Math.round(((DEFAULT_POMODORO_SECONDS - seconds) / DEFAULT_POMODORO_SECONDS) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center">
        <ProgressRing percent={pct} size={52} stroke={3} color={running ? "stroke-indigo-500" : "stroke-slate-400"} />
        <span className="absolute text-[11px] font-bold tabular-nums text-slate-800 dark:text-slate-100">{mins}:{secs}</span>
      </div>
      <div className="flex gap-1.5">
        <button onClick={onToggle} className={`p-2 rounded-lg transition-colors ${running ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40"}`}>
          {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button onClick={onReset} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function StudyPlanner() {
  const initial = useMemo(() => loadState(), []);
  const [activeTab, setActiveTab] = useState("today");
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [studyPlan, setStudyPlan] = useState(initial.plan);
  const [revisions, setRevisions] = useState(initial.revisions);
  const [mocks, setMocks] = useState(initial.mocks);
  const [startDate, setStartDate] = useState(initial.settings.startDate || toDateStr(new Date()));
  const [examDate, setExamDate] = useState(initial.settings.examDate || "");
  const [searchText, setSearchText] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(DEFAULT_POMODORO_SECONDS);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [expandedTopicNote, setExpandedTopicNote] = useState(null);
  const [copiedTopic, setCopiedTopic] = useState(null);
  const [carryConfirm, setCarryConfirm] = useState(false);
  const [mockScoreInput, setMockScoreInput] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    const state = { version: 2, plan: studyPlan, revisions, mocks, settings: { startDate, examDate } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [studyPlan, revisions, mocks, startDate, examDate]);

  useEffect(() => {
    if (!pomodoroRunning) return undefined;
    const timer = setInterval(() => {
      setPomodoroSeconds((prev) => {
        if (prev <= 1) { setPomodoroRunning(false); return DEFAULT_POMODORO_SECONDS; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [pomodoroRunning]);

  const scheduleRevisions = (subject, topicName, flag, completedDate, sourceId) => {
    const gaps = REVISION_GAPS[flag] || REVISION_GAPS.none;
    setRevisions((prev) => {
      const next = [...prev];
      gaps.forEach((gap) => {
        const dueDate = addDays(completedDate, gap);
        const key = `${subject}|${topicName}|${dueDate}`;
        if (!next.some((r) => r.key === key)) {
          next.push({ id: `${key}|${sourceId}`, key, subject, topicName, dueDate, completed: false, sourceId });
        }
      });
      return next;
    });
  };

  const updatePlan = (updater) => setStudyPlan((prev) => updater(prev));
  const updateDay = (dayId, updater) => updatePlan((prev) => prev.map((day) => (day.id === dayId ? updater(day) : day)));

  const toggleTopic = (dayPlan, topicIdx) => {
    updateDay(dayPlan.id, (day) => {
      const topics = [...day.topics];
      const nowCompleted = !topics[topicIdx].completed;
      const completedAt = nowCompleted ? toDateStr(new Date()) : null;
      topics[topicIdx] = { ...topics[topicIdx], completed: nowCompleted, completedAt };
      if (nowCompleted) scheduleRevisions(day.subject, topics[topicIdx].name, topics[topicIdx].flag || "none", completedAt, day.id);
      return { ...day, topics };
    });
  };

  const updateTopicFlag = (dayPlan, topicIdx, flag) => {
    updateDay(dayPlan.id, (day) => {
      const topics = [...day.topics];
      topics[topicIdx] = { ...topics[topicIdx], flag };
      return { ...day, topics };
    });
  };

  const togglePYQ = (dayPlan, pyqIdx) => {
    updateDay(dayPlan.id, (day) => {
      const pyqs = [...day.pyqs];
      const nowCompleted = !pyqs[pyqIdx].completed;
      pyqs[pyqIdx] = { ...pyqs[pyqIdx], completed: nowCompleted, completedAt: nowCompleted ? toDateStr(new Date()) : null };
      return { ...day, pyqs };
    });
  };

  const updateTopicNote = (dayPlan, topicIdx, note) => {
    updateDay(dayPlan.id, (day) => {
      const topics = [...day.topics];
      topics[topicIdx] = { ...topics[topicIdx], note };
      return { ...day, topics };
    });
  };

  const updatePyqNote = (dayPlan, pyqIdx, note) => {
    updateDay(dayPlan.id, (day) => {
      const pyqs = [...day.pyqs];
      pyqs[pyqIdx] = { ...pyqs[pyqIdx], note };
      return { ...day, pyqs };
    });
  };

  const handleDragStart = (event, dayId, type, index) => {
    setDraggedItem({ dayId, type, index });
    event.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; };
  const handleDrop = (event, dayPlan, type, targetIndex) => {
    event.preventDefault();
    if (!draggedItem || draggedItem.dayId !== dayPlan.id || draggedItem.type !== type) return;
    if (draggedItem.index === targetIndex) { setDraggedItem(null); return; }
    updateDay(dayPlan.id, (day) => {
      const items = [...day[type]];
      const [moved] = items.splice(draggedItem.index, 1);
      items.splice(targetIndex, 0, moved);
      return { ...day, [type]: items };
    });
    setDraggedItem(null);
  };

  const todaysDate = toDateStr(new Date());

  const dueRevisions = useMemo(
    () => revisions.filter((r) => !r.completed && r.dueDate <= todaysDate).sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [revisions, todaysDate],
  );

  const upcomingRevisions = useMemo(
    () => revisions.filter((r) => !r.completed && r.dueDate > todaysDate).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5),
    [revisions, todaysDate],
  );

  const markRevisionDone = (revisionId) => setRevisions((prev) => prev.map((r) => (r.id === revisionId ? { ...r, completed: true } : r)));

  const moveUnfinishedFromPreviousDays = () => {
    const todayIdx = Math.floor((new Date(todaysDate) - new Date(startDate)) / (24 * 3600 * 1000));
    if (Number.isNaN(todayIdx) || todayIdx < 1) return;
    updatePlan((prev) => {
      const next = [...prev];
      const carryTopics = [];
      const carryPyqs = [];
      next.forEach((day) => {
        const idx = dayIndexFromPlan(day);
        if (idx < todayIdx) {
          day.topics.forEach((t) => { if (!t.completed) carryTopics.push({ ...t }); });
          day.pyqs.forEach((p) => { if (!p.completed) carryPyqs.push({ ...p }); });
        }
      });
      return next.map((day) => {
        if (dayIndexFromPlan(day) !== todayIdx) return day;
        return {
          ...day,
          topics: [...day.topics, ...carryTopics.slice(0, 3).map((t, i) => ({ ...t, id: `${t.id}_cf_t_${i}` }))],
          pyqs: [...day.pyqs, ...carryPyqs.slice(0, 2).map((p, i) => ({ ...p, id: `${p.id}_cf_p_${i}` }))],
        };
      });
    });
    setCarryConfirm(false);
  };

  const todaysPlan = useMemo(() => {
    const todayIdx = Math.max(0, Math.floor((new Date(todaysDate) - new Date(startDate)) / (24 * 3600 * 1000)));
    const next = [];
    SUBJECTS.forEach((sub) => {
      const subDays = studyPlan.filter((p) => p.subject === sub).sort((a, b) => a.week * 10 + a.day - (b.week * 10 + b.day));
      const dueDay = subDays.find((d) => dayIndexFromPlan(d) <= todayIdx && (d.topics.some((t) => !t.completed) || d.pyqs.some((p) => !p.completed)));
      const nextDay = dueDay || subDays.find((d) => d.topics.some((t) => !t.completed) || d.pyqs.some((p) => !p.completed));
      if (nextDay) next.push(nextDay);
    });
    return next;
  }, [studyPlan, startDate, todaysDate]);

  const filteredTodaysPlan = useMemo(() => {
    if (!searchText.trim()) return todaysPlan;
    const q = searchText.toLowerCase();
    return todaysPlan
      .map((d) => ({ ...d, topics: d.topics.filter((t) => t.name.toLowerCase().includes(q)), pyqs: d.pyqs.filter((p) => p.name.toLowerCase().includes(q)) }))
      .filter((d) => d.topics.length > 0 || d.pyqs.length > 0);
  }, [todaysPlan, searchText]);

  const todayStats = useMemo(() => {
    let total = 0, done = 0;
    todaysPlan.forEach((d) => {
      total += d.topics.length + d.pyqs.length;
      done += d.topics.filter((t) => t.completed).length + d.pyqs.filter((p) => p.completed).length;
    });
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [todaysPlan]);

  const subjectProgress = useMemo(() => {
    const stats = {};
    SUBJECTS.forEach((sub) => {
      const days = studyPlan.filter((p) => p.subject === sub);
      const totalTopics = days.reduce((acc, day) => acc + day.topics.length, 0) || 1;
      const totalPyqs = days.reduce((acc, day) => acc + day.pyqs.length, 0) || 1;
      const doneTopics = days.reduce((acc, day) => acc + day.topics.filter((t) => t.completed).length, 0);
      const donePyqs = days.reduce((acc, day) => acc + day.pyqs.filter((p) => p.completed).length, 0);
      const weakTopics = days.reduce((acc, day) => acc + day.topics.filter((t) => t.flag === "Weak" || t.flag === "Not Understood").length, 0);
      const expectedTotal = days.reduce((acc, day) => acc + day.topics.filter((t) => t.expected).length + day.pyqs.filter((p) => p.expected).length, 0);
      const expectedDone = days.reduce((acc, day) => acc + day.topics.filter((t) => t.expected && t.completed).length + day.pyqs.filter((p) => p.expected && p.completed).length, 0);
      const completion = Math.round((doneTopics / totalTopics) * 100);
      const pyqPercent = Math.round((donePyqs / totalPyqs) * 100);
      const expectedPercent = expectedTotal ? Math.round((expectedDone / expectedTotal) * 100) : 0;
      const readiness = Math.max(0, Math.round(completion * 0.5 + pyqPercent * 0.3 + expectedPercent * 0.2 - weakTopics * 1.2));
      stats[sub] = { percent: completion, weak: weakTopics, pyqPercent, expectedPercent, readiness, doneTopics, totalTopics, donePyqs, totalPyqs };
    });
    return stats;
  }, [studyPlan]);

  const overallProgress = useMemo(() => {
    let total = 0, done = 0;
    SUBJECTS.forEach((sub) => {
      const s = subjectProgress[sub];
      total += s.totalTopics + s.totalPyqs;
      done += s.doneTopics + s.donePyqs;
    });
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [subjectProgress]);

  const expectedData = useMemo(() => {
    const out = {};
    SUBJECTS.forEach((sub) => {
      const subDays = studyPlan.filter((p) => p.subject === sub);
      const topics = [];
      const pyqs = [];
      subDays.forEach((day) => {
        day.topics.forEach((t) => { if (t.expected) topics.push(t); });
        day.pyqs.forEach((p) => { if (p.expected) pyqs.push(p); });
      });
      out[sub] = { topics, pyqs };
    });
    return out;
  }, [studyPlan]);

  const focusTasks = useMemo(() => {
    const items = [];
    filteredTodaysPlan.forEach((day) => {
      day.topics.forEach((t, idx) => {
        if (!t.completed) {
          const score = (t.priority === "high" ? 10 : 6) + (t.flag === "Not Understood" ? 6 : t.flag === "Weak" ? 4 : 0) + (t.expected ? 2 : 0);
          items.push({ id: `${day.id}-topic-${idx}`, day, type: "topic", text: t.name, score, flag: t.flag });
        }
      });
      day.pyqs.forEach((p, idx) => {
        if (!p.completed) items.push({ id: `${day.id}-pyq-${idx}`, day, type: "pyq", text: p.name, score: p.expected ? 9 : 5, flag: "none" });
      });
    });
    return items.sort((a, b) => b.score - a.score).slice(0, 5);
  }, [filteredTodaysPlan]);

  const daysLeft = examDate ? Math.ceil((new Date(examDate) - new Date(todaysDate)) / (24 * 3600 * 1000)) : null;

  const exportBackup = () => {
    const payload = { version: 2, exportedAt: new Date().toISOString(), plan: studyPlan, revisions, mocks, settings: { startDate, examDate } };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `study-planner-backup-${todaysDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || !Array.isArray(parsed.plan)) return;
      setStudyPlan(normalizePlan(parsed.plan));
      setRevisions(Array.isArray(parsed.revisions) ? parsed.revisions : []);
      setMocks(Array.isArray(parsed.mocks) ? parsed.mocks : []);
      setStartDate(parsed.settings?.startDate || toDateStr(new Date()));
      setExamDate(parsed.settings?.examDate || "");
    } catch { /* ignore */ } finally { event.target.value = ""; }
  };

  // ─── Topic row (shared between Today and Plan tabs) ──────────────────────
  const renderTopicRow = (t, idx, day, showFlag = true) => {
    const noteKey = `${day.id}-${t.id}`;
    const isExpanded = expandedTopicNote === noteKey;
    const flagCfg = FLAG_CONFIG[t.flag] || FLAG_CONFIG.none;
    return (
      <div
        key={t.id}
        draggable
        onDragStart={(e) => handleDragStart(e, day.id, "topics", idx)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, day, "topics", idx)}
        className={`group rounded-xl border transition-all duration-200 ${
          t.completed
            ? "bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/50 opacity-60"
            : `bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 ${flagCfg.bg}`
        }`}
      >
        <div className="flex items-center gap-2 px-3 py-2.5">
          <GripVertical className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 cursor-grab flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <button onClick={() => toggleTopic(day, idx)} className="flex-shrink-0 focus:outline-none">
            {t.completed
              ? <CheckSquare className="w-5 h-5 text-emerald-500" />
              : <Square className="w-5 h-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />}
          </button>
          <span className={`flex-1 text-sm leading-snug ${t.completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-200"}`}>
            {t.name}
          </span>
          {t.expected && !t.completed && (
            <span title="Expected in exam" className="flex-shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </span>
          )}
          {t.priority === "high" && !t.completed && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded flex-shrink-0">High</span>
          )}
          {showFlag && (
            <select
              value={t.flag}
              onChange={(e) => updateTopicFlag(day, idx, e.target.value)}
              className={`text-[10px] font-semibold rounded-lg border-0 bg-transparent cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-400 flex-shrink-0 ${flagCfg.color}`}
            >
              {Object.entries(FLAG_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          )}
          <button
            onClick={() => {
              navigator.clipboard.writeText(t.name);
              setCopiedTopic(t.id);
              setTimeout(() => setCopiedTopic(null), 1500);
            }}
            title="Copy topic name"
            className="flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors opacity-0 group-hover:opacity-100"
          >
            {copiedTopic === t.id
              ? <Check className="w-3.5 h-3.5 text-emerald-500" />
              : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setExpandedTopicNote(isExpanded ? null : noteKey)}
            className="flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
        {isExpanded && (
          <div className="px-3 pb-3">
            <textarea
              value={t.note || ""}
              onChange={(e) => updateTopicNote(day, idx, e.target.value)}
              placeholder="Add notes, formulas, or reminders..."
              rows={2}
              className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 resize-none"
            />
          </div>
        )}
      </div>
    );
  };

  const renderPyqRow = (p, idx, day) => (
    <div
      key={p.id}
      draggable
      onDragStart={(e) => handleDragStart(e, day.id, "pyqs", idx)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, day, "pyqs", idx)}
      className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-200 ${
        p.completed
          ? "bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/50 opacity-60"
          : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      <GripVertical className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 cursor-grab flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      <button onClick={() => togglePYQ(day, idx)} className="flex-shrink-0 focus:outline-none">
        {p.completed
          ? <CheckSquare className="w-5 h-5 text-indigo-500" />
          : <Square className="w-5 h-5 text-slate-400 dark:text-slate-500 hover:text-indigo-400 transition-colors" />}
      </button>
      <span className={`flex-1 text-sm leading-snug ${p.completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-200"}`}>
        {p.name}
      </span>
      {p.expected && (
        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0">
          Expected
        </span>
      )}
      <input
        value={p.note || ""}
        onChange={(e) => updatePyqNote(day, idx, e.target.value)}
        placeholder="note"
        className="text-xs w-24 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-transparent text-slate-600 dark:text-slate-400 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-400 flex-shrink-0"
      />
    </div>
  );

  // ─── RENDER ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">

      {/* ── Header banner ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-6 shadow-xl shadow-indigo-500/20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookMarked className="w-5 h-5 text-indigo-200" />
              <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Semester Planner</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-1">Study Dashboard</h1>
            <p className="text-indigo-200 text-sm">{SUBJECTS.length} subjects · 3 weeks · Spaced revision</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-black text-white">{overallProgress.pct}%</div>
              <div className="text-indigo-200 text-[10px] uppercase tracking-widest font-bold">Overall</div>
            </div>
            <ProgressRing percent={overallProgress.pct} size={64} stroke={5} color="stroke-white" />
          </div>
        </div>
        {/* Exam countdown */}
        {daysLeft !== null && (
          <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${daysLeft >= 0 ? "bg-white/20 text-white" : "bg-rose-500/30 text-rose-200"}`}>
            <Clock className="w-3.5 h-3.5" />
            {daysLeft >= 0 ? `${daysLeft} days until exam` : "Exam date passed"}
          </div>
        )}
      </div>

      {/* ── Settings row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
            <Calendar className="w-3 h-3" /> Plan Start
          </div>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full text-sm bg-transparent outline-none text-slate-800 dark:text-slate-200 font-medium" />
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
            <Target className="w-3 h-3" /> Exam Date
          </div>
          <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="w-full text-sm bg-transparent outline-none text-slate-800 dark:text-slate-200 font-medium" />
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
            <Timer className="w-3 h-3" /> Pomodoro
          </div>
          <PomodoroWidget
            seconds={pomodoroSeconds}
            running={pomodoroRunning}
            onToggle={() => setPomodoroRunning((v) => !v)}
            onReset={() => { setPomodoroRunning(false); setPomodoroSeconds(DEFAULT_POMODORO_SECONDS); }}
          />
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search topics / PYQs..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <button
          onClick={() => setFocusMode((v) => !v)}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${focusMode ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400"}`}
        >
          <Zap className="w-4 h-4" /> Focus
        </button>
        {carryConfirm ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Carry unfinished tasks?</span>
            <button onClick={moveUnfinishedFromPreviousDays} className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors">Yes</button>
            <button onClick={() => setCarryConfirm(false)} className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">No</button>
          </div>
        ) : (
          <button onClick={() => setCarryConfirm(true)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400 transition-all">
            <RefreshCw className="w-4 h-4" /> Carry Forward
          </button>
        )}
        <button onClick={exportBackup} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 transition-all">
          <Download className="w-4 h-4" /> Export
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 transition-all">
          <Upload className="w-4 h-4" /> Import
        </button>
        <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={importBackup} />
      </div>

      {/* ── Tab bar ── */}
      <div className="flex gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 w-full sm:w-fit">
        {[
          { id: "today", icon: Calendar, label: "Today" },
          { id: "plan", icon: BookOpen, label: "Study Plan" },
          { id: "expected", icon: Flame, label: "Expected" },
          { id: "progress", icon: BarChart2, label: "Dashboard" },
          { id: "mocks", icon: ShieldAlert, label: "Mocks" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          TODAY TAB
      ════════════════════════════════════════════════════════════════════ */}
      {activeTab === "today" && (
        <div className="space-y-5">

          {/* Daily progress summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-emerald-500">{todayStats.done}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Done Today</div>
            </div>
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-slate-700 dark:text-slate-200">{todayStats.total - todayStats.done}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Remaining</div>
            </div>
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-indigo-500">{todayStats.pct}%</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Today's Progress</div>
            </div>
          </div>

          {/* Focus mode panel */}
          {focusMode && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-emerald-800 dark:text-emerald-300">Top 5 Priority Tasks</h3>
              </div>
              <div className="space-y-2">
                {focusTasks.map((task, i) => {
                  const flagCfg = FLAG_CONFIG[task.flag] || FLAG_CONFIG.none;
                  return (
                    <div key={task.id} className="flex items-center gap-3 bg-white dark:bg-slate-900/60 rounded-xl px-4 py-3 border border-emerald-100 dark:border-emerald-900/30">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">{task.text}</span>
                      {task.flag !== "none" && <span className={`text-[10px] font-bold ${flagCfg.color}`}>{flagCfg.label}</span>}
                      <SubjectBadge subject={task.day.subject} size="xs" />
                    </div>
                  );
                })}
                {focusTasks.length === 0 && <p className="text-sm text-emerald-700 dark:text-emerald-400">All tasks done for today!</p>}
              </div>
            </div>
          )}

          {/* Due revisions */}
          {dueRevisions.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-amber-800 dark:text-amber-300">Due Revisions</h3>
                <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{dueRevisions.length}</span>
              </div>
              <div className="space-y-2">
                {dueRevisions.map((rev) => {
                  const c = SUBJECT_COLORS[rev.subject];
                  return (
                    <div key={rev.id} className="flex items-center gap-3 bg-white dark:bg-slate-900/60 rounded-xl px-4 py-3 border border-amber-100 dark:border-amber-900/30">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c?.dot || "bg-slate-400"}`} />
                      <span className="flex-1 text-sm text-slate-800 dark:text-slate-200">
                        <span className={`font-semibold ${c?.text || ""}`}>{rev.subject.split(" ")[0]}</span>: {rev.topicName}
                      </span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">{rev.dueDate}</span>
                      <button onClick={() => markRevisionDone(rev.id)} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors">
                        Done
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming revisions (collapsed) */}
          {upcomingRevisions.length > 0 && (
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold">Upcoming revisions</span>
                <div className="flex gap-1.5 ml-2 flex-wrap">
                  {upcomingRevisions.map((rev) => (
                    <span key={rev.id} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                      {rev.topicName.split(" ").slice(0, 2).join(" ")} · {rev.dueDate}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subject cards */}
          {filteredTodaysPlan.map((day) => {
            const c = SUBJECT_COLORS[day.subject];
            const totalItems = day.topics.length + day.pyqs.length;
            const doneItems = day.topics.filter((t) => t.completed).length + day.pyqs.filter((p) => p.completed).length;
            const pct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;
            return (
              <div key={day.id} className={`rounded-2xl border overflow-hidden ${c.border} bg-white dark:bg-slate-900/50`}>
                {/* Card header */}
                <div className={`bg-gradient-to-r ${c.gradient} px-5 py-4 border-b ${c.border}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl ${c.badge} flex items-center justify-center text-xs font-black flex-shrink-0`}>
                        {SUBJECT_SHORT[day.subject]}
                      </span>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 leading-tight">{day.subject}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Week {day.week} · Day {day.day} · {addDays(startDate, dayIndexFromPlan(day))}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className={`text-lg font-black ${c.text}`}>{pct}%</div>
                        <div className="text-[10px] text-slate-400">{doneItems}/{totalItems}</div>
                      </div>
                      <ProgressRing percent={pct} size={40} stroke={3} color={`stroke-current ${c.text}`} />
                    </div>
                  </div>
                  {/* Mini progress bar */}
                  <div className="mt-3 h-1.5 bg-white/40 dark:bg-slate-800/40 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${c.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {/* Topics + PYQs */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3" /> Topics
                    </div>
                    <div className="space-y-1.5">
                      {day.topics.map((t, idx) => renderTopicRow(t, idx, day, true))}
                    </div>
                  </div>
                  {day.pyqs.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                        <Star className="w-3 h-3" /> PYQs
                      </div>
                      <div className="space-y-1.5">
                        {day.pyqs.map((p, idx) => renderPyqRow(p, idx, day))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredTodaysPlan.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">All caught up!</p>
              <p className="text-sm mt-1">No pending tasks for today.</p>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          STUDY PLAN TAB
      ════════════════════════════════════════════════════════════════════ */}
      {activeTab === "plan" && (
        <div className="space-y-6">
          {/* Subject pill selector */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {SUBJECTS.map((sub) => {
              const c = SUBJECT_COLORS[sub];
              const isActive = selectedSubject === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                    isActive ? `${c.badge} border-transparent shadow-lg` : `bg-white dark:bg-slate-900/60 ${c.border} ${c.text} hover:shadow-md`
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${isActive ? "bg-white/20" : c.badgeSoft}`}>
                    {SUBJECT_SHORT[sub]}
                  </span>
                  <span className="hidden sm:inline">{sub}</span>
                  <span className="sm:hidden">{SUBJECT_SHORT[sub]}</span>
                </button>
              );
            })}
          </div>

          {/* Subject progress summary */}
          {(() => {
            const s = subjectProgress[selectedSubject];
            const c = SUBJECT_COLORS[selectedSubject];
            return (
              <div className={`rounded-2xl border ${c.border} bg-gradient-to-br ${c.gradient} p-5`}>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">{selectedSubject}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">3 weeks · {s.totalTopics} topics · {s.totalPyqs} PYQs</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className={`text-2xl font-black ${c.text}`}>{s.percent}%</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Topics</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-indigo-500">{s.pyqPercent}%</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">PYQs</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-black ${s.weak > 0 ? "text-amber-500" : "text-emerald-500"}`}>{s.weak}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Weak</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Exam Readiness</div>
                  <ReadinessBar value={s.readiness} />
                </div>
              </div>
            );
          })()}

          {/* Week sections */}
          {[1, 2, 3].map((week) => {
            const weekDays = studyPlan.filter((p) => p.subject === selectedSubject && p.week === week).sort((a, b) => a.day - b.day);
            const weekDone = weekDays.reduce((acc, d) => acc + d.topics.filter((t) => t.completed).length + d.pyqs.filter((p) => p.completed).length, 0);
            const weekTotal = weekDays.reduce((acc, d) => acc + d.topics.length + d.pyqs.length, 0);
            const c = SUBJECT_COLORS[selectedSubject];
            return (
              <div key={week} className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className={`${c.badge} text-xs font-black px-2.5 py-1 rounded-lg`}>Week {week}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{weekDone}/{weekTotal} done</span>
                  </div>
                  <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${c.bar} transition-all duration-700`} style={{ width: `${weekTotal ? Math.round((weekDone / weekTotal) * 100) : 0}%` }} />
                  </div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {weekDays.map((day) => (
                    <div key={day.id} className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${c.text}`}>Day {day.day}</span>
                        <span className="text-xs text-slate-400">· {addDays(startDate, dayIndexFromPlan(day))}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          {day.topics.map((t, idx) => renderTopicRow(t, idx, day, true))}
                        </div>
                        {day.pyqs.length > 0 && (
                          <div className="space-y-1.5">
                            {day.pyqs.map((p, idx) => renderPyqRow(p, idx, day))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          EXPECTED PYQs TAB
      ════════════════════════════════════════════════════════════════════ */}
      {activeTab === "expected" && (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-4 flex items-start gap-3">
            <Flame className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">High-probability exam questions</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">These topics and PYQs are marked as likely to appear. Prioritize these.</p>
            </div>
          </div>
          {SUBJECTS.map((sub) => {
            const c = SUBJECT_COLORS[sub];
            const data = expectedData[sub];
            const total = data.topics.length + data.pyqs.length;
            const done = data.topics.filter((t) => t.completed).length + data.pyqs.filter((p) => p.completed).length;
            if (total === 0) return null;
            return (
              <div key={sub} className={`rounded-2xl border ${c.border} overflow-hidden`}>
                <div className={`bg-gradient-to-r ${c.gradient} px-5 py-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className={`${c.badge} text-xs font-black px-2.5 py-1 rounded-lg`}>{SUBJECT_SHORT[sub]}</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{sub}</span>
                  </div>
                  <span className={`text-sm font-bold ${c.text}`}>{done}/{total} done</span>
                </div>
                <div className="bg-white dark:bg-slate-900/50 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.topics.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3" /> Expected Topics
                      </div>
                      <div className="space-y-1.5">
                        {data.topics.map((t, i) => (
                          <div key={i} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm ${t.completed ? "opacity-50 bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800" : `bg-white dark:bg-slate-900/50 ${c.border}`}`}>
                            <CheckCircle className={`w-4 h-4 flex-shrink-0 ${t.completed ? "text-emerald-500" : "text-slate-300 dark:text-slate-600"}`} />
                            <span className={t.completed ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"}>{t.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {data.pyqs.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-amber-400" /> Expected PYQs
                      </div>
                      <div className="space-y-1.5">
                        {data.pyqs.map((p, i) => (
                          <div key={i} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm ${p.completed ? "opacity-50 bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800" : "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30"}`}>
                            <Flame className={`w-4 h-4 flex-shrink-0 ${p.completed ? "text-slate-300" : "text-amber-500"}`} />
                            <span className={p.completed ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"}>{p.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          DASHBOARD TAB
      ════════════════════════════════════════════════════════════════════ */}
      {activeTab === "progress" && (
        <div className="space-y-5">
          {/* Overall summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-indigo-500">{overallProgress.pct}%</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Overall</div>
            </div>
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-emerald-500">{overallProgress.done}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Completed</div>
            </div>
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-slate-600 dark:text-slate-300">{overallProgress.total - overallProgress.done}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Remaining</div>
            </div>
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-amber-500">{SUBJECTS.reduce((acc, s) => acc + subjectProgress[s].weak, 0)}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Weak Topics</div>
            </div>
          </div>

          {/* Per-subject cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUBJECTS.map((sub) => {
              const s = subjectProgress[sub];
              const c = SUBJECT_COLORS[sub];
              return (
                <div key={sub} className={`bg-white dark:bg-slate-900/60 border ${c.border} rounded-2xl p-5 space-y-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`${c.badge} text-xs font-black px-2.5 py-1 rounded-lg`}>{SUBJECT_SHORT[sub]}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight">{sub}</span>
                    </div>
                    <ProgressRing percent={s.percent} size={44} stroke={4} color={`stroke-current ${c.text}`} />
                  </div>

                  {/* Stat bars */}
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        <span>Topics</span><span className={c.text}>{s.percent}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${c.bar}`} style={{ width: `${s.percent}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        <span>PYQs</span><span className="text-indigo-500">{s.pyqPercent}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-500 transition-all duration-700" style={{ width: `${s.pyqPercent}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        <span>Expected</span><span className="text-amber-500">{s.expectedPercent}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-amber-500 transition-all duration-700" style={{ width: `${s.expectedPercent}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Readiness + weak */}
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-500">Exam Readiness</span>
                      <span className="font-black text-slate-700 dark:text-slate-300">{s.readiness}/100</span>
                    </div>
                    <ReadinessBar value={s.readiness} />
                    {s.weak > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{s.weak} weak/not-understood topic{s.weak > 1 ? "s" : ""} — needs attention</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Revision schedule preview */}
          {revisions.filter((r) => !r.completed).length > 0 && (
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200">Upcoming Revision Schedule</h3>
              </div>
              <div className="space-y-2">
                {revisions.filter((r) => !r.completed).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 8).map((rev) => {
                  const c = SUBJECT_COLORS[rev.subject];
                  const isOverdue = rev.dueDate <= todaysDate;
                  return (
                    <div key={rev.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm ${isOverdue ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30" : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700"}`}>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c?.dot || "bg-slate-400"}`} />
                      <span className="flex-1 text-slate-700 dark:text-slate-300">{rev.topicName}</span>
                      <SubjectBadge subject={rev.subject} size="xs" />
                      <span className={`text-[10px] font-bold ${isOverdue ? "text-amber-600 dark:text-amber-400" : "text-slate-400"}`}>{rev.dueDate}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          MOCKS TAB
      ════════════════════════════════════════════════════════════════════ */}
      {activeTab === "mocks" && (
        <div className="space-y-5">
          <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800/30 rounded-2xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">Mock Exam Tracker</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">Complete all topics in a week to unlock its mock. Enter your score after attempting.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((week) => {
              const mock = mocks.find((m) => m.week === week);
              const weekDays = studyPlan.filter((p) => p.week === week);
              const isUnlocked = weekDays.length > 0 && weekDays.every((d) => d.topics.every((t) => t.completed));
              const scoreVal = mockScoreInput[week] ?? "";
              return (
                <div key={week} className={`rounded-2xl border overflow-hidden ${mock ? "border-emerald-300 dark:border-emerald-700/40" : isUnlocked ? "border-indigo-300 dark:border-indigo-700/40" : "border-slate-200 dark:border-slate-800"}`}>
                  <div className={`px-5 py-4 ${mock ? "bg-emerald-50 dark:bg-emerald-900/20" : isUnlocked ? "bg-indigo-50 dark:bg-indigo-900/20" : "bg-slate-50 dark:bg-slate-900/40"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-slate-800 dark:text-slate-200">Week {week} Mock</span>
                      {!isUnlocked && !mock && <Lock className="w-4 h-4 text-slate-400" />}
                      {mock && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                    </div>
                    {mock ? (
                      <div>
                        <div className="text-3xl font-black text-emerald-500">{mock.score}%</div>
                        <div className="text-xs text-slate-400 mt-0.5">Attempted on {mock.date}</div>
                        <div className="mt-3 h-2 bg-white/60 dark:bg-slate-800/60 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${mock.score}%` }} />
                        </div>
                      </div>
                    ) : isUnlocked ? (
                      <div className="space-y-2 mt-2">
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={scoreVal}
                            onChange={(e) => setMockScoreInput((prev) => ({ ...prev, [week]: e.target.value }))}
                            placeholder="Score %"
                            className="flex-1 text-sm rounded-xl border border-indigo-200 dark:border-indigo-700/40 bg-white dark:bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800 dark:text-slate-200"
                          />
                          <button
                            onClick={() => {
                              const score = Math.min(100, Math.max(0, Number(scoreVal) || 0));
                              setMocks((prev) => [...prev.filter((m) => m.week !== week), { week, score, date: todaysDate }]);
                              setMockScoreInput((prev) => ({ ...prev, [week]: "" }));
                            }}
                            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5" /> Save
                          </button>
                        </div>
                        <p className="text-xs text-indigo-500 dark:text-indigo-400">Unlocked! Enter your score after attempting.</p>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <p className="text-xs text-slate-400">Complete all Week {week} topics to unlock.</p>
                        <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-400 rounded-full transition-all duration-700"
                            style={{ width: `${weekDays.length ? Math.round((weekDays.reduce((a, d) => a + d.topics.filter((t) => t.completed).length, 0) / weekDays.reduce((a, d) => a + d.topics.length, 0)) * 100) : 0}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mock trend chart */}
          {mocks.length > 0 && (
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <BarChart2 className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200">Mock Score Trend</h3>
              </div>
              <div className="flex items-end gap-4 h-32">
                {mocks.sort((a, b) => a.week - b.week).map((m) => (
                  <div key={`mock-${m.week}`} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-sm font-black text-indigo-500">{m.score}%</span>
                    <div className="w-full rounded-t-xl bg-indigo-500/20 dark:bg-indigo-500/10 relative overflow-hidden" style={{ height: "80px" }}>
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-xl transition-all duration-700"
                        style={{ height: `${m.score}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">W{m.week}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
