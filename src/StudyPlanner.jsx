import { useMemo, useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  CheckSquare,
  Clock,
  BarChart2,
  AlertTriangle,
  ShieldAlert,
  Play,
  Square,
  Flame,
  GripVertical,
  Download,
  Upload,
  Search,
  Timer,
  Pause,
  RotateCcw,
} from "lucide-react";

const SUBJECTS = [
  "Compiler Design",
  "Computer Networks-II",
  "Software Engineering",
  "Full Stack Web Development",
  "DevOps",
];

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
          dayPyqs.push({
            id: `p_${pyqIdx}`,
            name: data.pyqs[pyqIdx].text,
            expected: data.pyqs[pyqIdx].expected,
            completed: false,
          });
          pyqIdx++;
        }
        if (dayTopics.length === 0) {
          dayTopics.push({ id: `rev_${w}_${d}`, name: "Revision & Practice", priority: "mid", completed: false, flag: "none" });
        }
        plans.push({
          id: `${subject.replace(/\s+/g, "")}_W${w}_D${d}`,
          subject,
          week: w,
          day: d,
          topics: dayTopics,
          pyqs: dayPyqs,
        });
      }
    }
  });
  return plans;
};

const normalizePlan = (rawPlan) => {
  if (!Array.isArray(rawPlan) || rawPlan.length === 0) return generateSyllabus();
  return rawPlan.map((day) => ({
    ...day,
    topics: (day.topics || []).map((t) => ({
      ...t,
      completed: Boolean(t.completed),
      flag: t.flag || "none",
      note: t.note || "",
      completedAt: t.completedAt || null,
    })),
    pyqs: (day.pyqs || []).map((p) => ({
      ...p,
      completed: Boolean(p.completed),
      note: p.note || "",
      completedAt: p.completedAt || null,
    })),
  }));
};

const loadState = () => {
  try {
    const v2Raw = localStorage.getItem(STORAGE_KEY);
    if (v2Raw) {
      const parsed = JSON.parse(v2Raw);
      if (parsed && parsed.version === 2) {
        return {
          plan: normalizePlan(parsed.plan),
          revisions: Array.isArray(parsed.revisions) ? parsed.revisions : [],
          mocks: Array.isArray(parsed.mocks) ? parsed.mocks : [],
          settings: parsed.settings || {},
        };
      }
    }

    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const plan = normalizePlan(JSON.parse(legacyRaw));
      const mocks = JSON.parse(localStorage.getItem(MOCKS_KEY) || "[]");
      return { plan, revisions: [], mocks: Array.isArray(mocks) ? mocks : [], settings: {} };
    }
  } catch {
    // fall through
  }

  return {
    plan: generateSyllabus(),
    revisions: [],
    mocks: [],
    settings: {},
  };
};

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
  const fileInputRef = useRef(null);

  useEffect(() => {
    const state = {
      version: 2,
      plan: studyPlan,
      revisions,
      mocks,
      settings: { startDate, examDate },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [studyPlan, revisions, mocks, startDate, examDate]);

  useEffect(() => {
    if (!pomodoroRunning) return undefined;
    const timer = setInterval(() => {
      setPomodoroSeconds((prev) => {
        if (prev <= 1) {
          setPomodoroRunning(false);
          return DEFAULT_POMODORO_SECONDS;
        }
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
          next.push({
            id: `${key}|${sourceId}`,
            key,
            subject,
            topicName,
            dueDate,
            completed: false,
            sourceId,
          });
        }
      });
      return next;
    });
  };

  const updatePlan = (updater) => setStudyPlan((prev) => updater(prev));

  const updateDay = (dayId, updater) => {
    updatePlan((prev) => prev.map((day) => (day.id === dayId ? updater(day) : day)));
  };

  const toggleTopic = (dayPlan, topicIdx) => {
    updateDay(dayPlan.id, (day) => {
      const topics = [...day.topics];
      const nowCompleted = !topics[topicIdx].completed;
      const completedAt = nowCompleted ? toDateStr(new Date()) : null;
      topics[topicIdx] = { ...topics[topicIdx], completed: nowCompleted, completedAt };
      if (nowCompleted) {
        scheduleRevisions(day.subject, topics[topicIdx].name, topics[topicIdx].flag || "none", completedAt, day.id);
      }
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

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event, dayPlan, type, targetIndex) => {
    event.preventDefault();
    if (!draggedItem || draggedItem.dayId !== dayPlan.id || draggedItem.type !== type) return;
    if (draggedItem.index === targetIndex) {
      setDraggedItem(null);
      return;
    }
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

  const markRevisionDone = (revisionId) => {
    setRevisions((prev) => prev.map((r) => (r.id === revisionId ? { ...r, completed: true } : r)));
  };

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
          day.topics.forEach((t) => {
            if (!t.completed) carryTopics.push({ ...t });
          });
          day.pyqs.forEach((p) => {
            if (!p.completed) carryPyqs.push({ ...p });
          });
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
  };

  const todaysPlan = useMemo(() => {
    const todayIdx = Math.max(0, Math.floor((new Date(todaysDate) - new Date(startDate)) / (24 * 3600 * 1000)));
    const next = [];
    SUBJECTS.forEach((sub) => {
      const subDays = studyPlan
        .filter((p) => p.subject === sub)
        .sort((a, b) => a.week * 10 + a.day - (b.week * 10 + b.day));
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
      .map((d) => ({
        ...d,
        topics: d.topics.filter((t) => t.name.toLowerCase().includes(q)),
        pyqs: d.pyqs.filter((p) => p.name.toLowerCase().includes(q)),
      }))
      .filter((d) => d.topics.length > 0 || d.pyqs.length > 0);
  }, [todaysPlan, searchText]);

  const subjectProgress = useMemo(() => {
    const stats = {};
    SUBJECTS.forEach((sub) => {
      const days = studyPlan.filter((p) => p.subject === sub);
      const totalTopics = days.reduce((acc, day) => acc + day.topics.length, 0) || 1;
      const totalPyqs = days.reduce((acc, day) => acc + day.pyqs.length, 0) || 1;
      const doneTopics = days.reduce((acc, day) => acc + day.topics.filter((t) => t.completed).length, 0);
      const donePyqs = days.reduce((acc, day) => acc + day.pyqs.filter((p) => p.completed).length, 0);
      const weakTopics = days.reduce(
        (acc, day) => acc + day.topics.filter((t) => t.flag === "Weak" || t.flag === "Not Understood").length,
        0,
      );
      const expectedTotal = days.reduce(
        (acc, day) =>
          acc +
          day.topics.filter((t) => t.expected).length +
          day.pyqs.filter((p) => p.expected).length,
        0,
      );
      const expectedDone = days.reduce(
        (acc, day) =>
          acc +
          day.topics.filter((t) => t.expected && t.completed).length +
          day.pyqs.filter((p) => p.expected && p.completed).length,
        0,
      );
      const completion = Math.round((doneTopics / totalTopics) * 100);
      const pyqPercent = Math.round((donePyqs / totalPyqs) * 100);
      const expectedPercent = expectedTotal ? Math.round((expectedDone / expectedTotal) * 100) : 0;
      const readiness = Math.max(0, Math.round(completion * 0.5 + pyqPercent * 0.3 + expectedPercent * 0.2 - weakTopics * 1.2));
      stats[sub] = { percent: completion, weak: weakTopics, pyqPercent, expectedPercent, readiness };
    });
    return stats;
  }, [studyPlan]);

  const expectedData = useMemo(() => {
    const out = {};
    SUBJECTS.forEach((sub) => {
      const subDays = studyPlan.filter((p) => p.subject === sub);
      const topics = [];
      const pyqs = [];
      subDays.forEach((day) => {
        day.topics.forEach((t) => {
          if (t.expected) topics.push(t);
        });
        day.pyqs.forEach((p) => {
          if (p.expected) pyqs.push(p);
        });
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
          items.push({ id: `${day.id}-topic-${idx}`, day, type: "topic", text: t.name, score });
        }
      });
      day.pyqs.forEach((p, idx) => {
        if (!p.completed) items.push({ id: `${day.id}-pyq-${idx}`, day, type: "pyq", text: p.name, score: p.expected ? 9 : 5 });
      });
    });
    return items.sort((a, b) => b.score - a.score).slice(0, 5);
  }, [filteredTodaysPlan]);

  const pomodoroText = `${String(Math.floor(pomodoroSeconds / 60)).padStart(2, "0")}:${String(pomodoroSeconds % 60).padStart(2, "0")}`;

  const exportBackup = () => {
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      plan: studyPlan,
      revisions,
      mocks,
      settings: { startDate, examDate },
    };
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
    } catch {
      // ignore bad import
    } finally {
      event.target.value = "";
    }
  };

  const daysLeft = examDate ? Math.ceil((new Date(examDate) - new Date(todaysDate)) / (24 * 3600 * 1000)) : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3 dark:bg-slate-900/40 dark:border-slate-800">
          <div className="text-xs text-slate-500 mb-1">Plan Start Date</div>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full text-sm bg-transparent outline-none" />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 dark:bg-slate-900/40 dark:border-slate-800">
          <div className="text-xs text-slate-500 mb-1">Exam Date</div>
          <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="w-full text-sm bg-transparent outline-none" />
          {daysLeft !== null && <div className="text-xs mt-1 text-amber-500">{daysLeft >= 0 ? `${daysLeft} day(s) left` : "Exam date passed"}</div>}
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 dark:bg-slate-900/40 dark:border-slate-800">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-2"><Timer className="w-3 h-3" /> Focus Timer</div>
          <div className="flex items-center gap-2">
            <span className="font-bold">{pomodoroText}</span>
            <button onClick={() => setPomodoroRunning((v) => !v)} className="px-2 py-1 rounded bg-indigo-600 text-white text-xs">
              {pomodoroRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <button onClick={() => { setPomodoroRunning(false); setPomodoroSeconds(DEFAULT_POMODORO_SECONDS); }} className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-xs">
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative grow max-w-sm">
          <Search className="w-4 h-4 absolute left-2 top-2.5 text-slate-400" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search topics / PYQs..."
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
          />
        </div>
        <button onClick={() => setFocusMode((v) => !v)} className={`px-3 py-2 rounded-lg text-sm ${focusMode ? "bg-emerald-600 text-white" : "bg-slate-200 dark:bg-slate-800"}`}>
          Focus Mode
        </button>
        <button onClick={moveUnfinishedFromPreviousDays} className="px-3 py-2 rounded-lg text-sm bg-amber-500 text-white">Carry Forward</button>
        <button onClick={exportBackup} className="px-3 py-2 rounded-lg text-sm bg-slate-200 dark:bg-slate-800 flex items-center gap-1"><Download className="w-4 h-4" /> Export</button>
        <button onClick={() => fileInputRef.current?.click()} className="px-3 py-2 rounded-lg text-sm bg-slate-200 dark:bg-slate-800 flex items-center gap-1"><Upload className="w-4 h-4" /> Import</button>
        <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={importBackup} />
      </div>

      <div className="flex flex-wrap gap-2 p-1 rounded-xl border w-full sm:w-fit bg-slate-100 border-slate-200 dark:bg-slate-900/80 dark:border-slate-800">
        {[
          { id: "today", icon: Calendar, label: "Today" },
          { id: "plan", icon: BookOpen, label: "Study Plan" },
          { id: "expected", icon: Flame, label: "Expected PYQs" },
          { id: "progress", icon: BarChart2, label: "Dashboard" },
          { id: "mocks", icon: ShieldAlert, label: "Mocks" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "today" && (
        <div className="space-y-4">
          {focusMode && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 dark:bg-slate-900/40 dark:border-slate-800">
              <h3 className="font-bold mb-2">Top 5 Focus Tasks</h3>
              <ul className="space-y-2 text-sm">
                {focusTasks.map((task) => (
                  <li key={task.id} className="flex justify-between">
                    <span>{task.text}</span>
                    <span className="text-xs text-slate-500">{task.day.subject}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-xl p-4 dark:bg-slate-900/40 dark:border-slate-800">
            <h3 className="font-bold mb-2">Due Revisions ({dueRevisions.length})</h3>
            {dueRevisions.length === 0 ? (
              <p className="text-sm text-slate-500">No revisions due for now.</p>
            ) : (
              <div className="space-y-2">
                {dueRevisions.map((rev) => (
                  <div key={rev.id} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-950">
                    <span className="text-sm">{rev.subject}: {rev.topicName}</span>
                    <button onClick={() => markRevisionDone(rev.id)} className="text-xs px-2 py-1 rounded bg-emerald-600 text-white">Done</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {filteredTodaysPlan.map((day) => (
            <div key={day.id} className="bg-white border border-slate-200 rounded-xl p-4 dark:bg-slate-900/40 dark:border-slate-800">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{day.subject}</h3>
                <p className="text-sm text-slate-500">Week {day.week} / Day {day.day} • {addDays(startDate, dayIndexFromPlan(day))}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {day.topics.map((t, idx) => (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, day.id, "topics", idx)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, day, "topics", idx)}
                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    >
                      <GripVertical className="w-4 h-4 mt-1 text-slate-500" />
                      <button onClick={() => toggleTopic(day, idx)} className="mt-0.5">
                        {t.completed ? <CheckSquare className="w-5 h-5 text-emerald-500" /> : <Square className="w-5 h-5 text-slate-500" />}
                      </button>
                      <span className={t.completed ? "line-through text-slate-500 text-sm" : "text-sm"}>{t.name}</span>
                      <input
                        value={t.note || ""}
                        onChange={(e) => updateTopicNote(day, idx, e.target.value)}
                        placeholder="note"
                        className="ml-auto text-xs w-28 border border-slate-300 dark:border-slate-700 rounded px-1 py-0.5 bg-transparent"
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {day.pyqs.map((p, idx) => (
                    <div
                      key={p.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, day.id, "pyqs", idx)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, day, "pyqs", idx)}
                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    >
                      <GripVertical className="w-4 h-4 mt-1 text-slate-500" />
                      <button onClick={() => togglePYQ(day, idx)} className="mt-0.5">
                        {p.completed ? <CheckSquare className="w-5 h-5 text-indigo-500" /> : <Square className="w-5 h-5 text-slate-500" />}
                      </button>
                      <span className={p.completed ? "line-through text-slate-500 text-sm" : "text-sm"}>{p.name}</span>
                      <input
                        value={p.note || ""}
                        onChange={(e) => updatePyqNote(day, idx, e.target.value)}
                        placeholder="note"
                        className="ml-auto text-xs w-28 border border-slate-300 dark:border-slate-700 rounded px-1 py-0.5 bg-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "expected" && (
        <div className="space-y-4">
          {SUBJECTS.map((sub) => (
            <div key={sub} className="bg-white border border-slate-200 rounded-xl p-4 dark:bg-slate-900/40 dark:border-slate-800">
              <h3 className="font-bold text-amber-500 mb-3">{sub}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm">
                  {expectedData[sub].topics.map((t, i) => (
                    <li key={`${sub}-t-${i}`} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {t.name}
                    </li>
                  ))}
                </ul>
                <ul className="space-y-2 text-sm">
                  {expectedData[sub].pyqs.map((p, i) => (
                    <li key={`${sub}-p-${i}`} className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-500" />
                      {p.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "plan" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedSubject}</h2>
            <select
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {SUBJECTS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
          {[1, 2, 3].map((week) => {
            const weekDays = studyPlan.filter((p) => p.subject === selectedSubject && p.week === week).sort((a, b) => a.day - b.day);
            return (
              <div key={week} className="bg-white border border-slate-200 rounded-xl dark:bg-slate-900/40 dark:border-slate-800">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 font-semibold">Week {week}</div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {weekDays.map((day) => (
                    <div key={day.id} className="p-4 space-y-3">
                      <div className="font-semibold text-emerald-500">Day {day.day}</div>
                      {day.topics.map((t, idx) => (
                        <div key={t.id} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
                          <button onClick={() => toggleTopic(day, idx)}>
                            {t.completed ? <CheckSquare className="w-5 h-5 text-emerald-500" /> : <Square className="w-5 h-5 text-slate-500" />}
                          </button>
                          <span className={`flex-1 text-sm ${t.completed ? "line-through text-slate-500" : ""}`}>{t.name}</span>
                          <select
                            value={t.flag}
                            onChange={(e) => updateTopicFlag(day, idx, e.target.value)}
                            className="text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1"
                          >
                            <option value="none">No Flag</option>
                            <option value="Not Understood">Not Understood</option>
                            <option value="Weak">Weak</option>
                            <option value="Important">Important</option>
                          </select>
                          <input
                            value={t.note || ""}
                            onChange={(e) => updateTopicNote(day, idx, e.target.value)}
                            placeholder="notes"
                            className="text-xs w-24 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1"
                          />
                        </div>
                      ))}
                      {day.pyqs.map((p, idx) => (
                        <div key={p.id} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800">
                          <button onClick={() => togglePYQ(day, idx)}>
                            {p.completed ? <CheckSquare className="w-5 h-5 text-indigo-500" /> : <Square className="w-5 h-5 text-slate-500" />}
                          </button>
                          <span className={`text-sm ${p.completed ? "line-through text-slate-500" : ""}`}>{p.name}</span>
                          <input
                            value={p.note || ""}
                            onChange={(e) => updatePyqNote(day, idx, e.target.value)}
                            placeholder="notes"
                            className="ml-auto text-xs w-24 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "progress" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUBJECTS.map((sub) => (
            <div key={sub} className="bg-white border border-slate-200 rounded-xl p-4 dark:bg-slate-900/40 dark:border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">{sub}</h3>
                <span className="text-emerald-500 font-bold">{subjectProgress[sub].percent}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mb-3">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${subjectProgress[sub].percent}%` }} />
              </div>
              <div className="text-sm text-amber-500 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Weak topics: {subjectProgress[sub].weak}
              </div>
              <div className="text-xs mt-2 text-slate-500">
                PYQ: {subjectProgress[sub].pyqPercent}% • Expected: {subjectProgress[sub].expectedPercent}% • Readiness: {subjectProgress[sub].readiness}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "mocks" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((week) => {
            const mock = mocks.find((m) => m.week === week);
            const weekDays = studyPlan.filter((p) => p.week === week);
            const isUnlocked = weekDays.length > 0 && weekDays.every((d) => d.topics.every((t) => t.completed));
            return (
              <div key={week} className="bg-white border border-slate-200 rounded-xl p-4 dark:bg-slate-900/40 dark:border-slate-800">
                <h3 className="font-bold mb-3">Week {week} Mock</h3>
                {mock ? (
                  <div className="text-emerald-500 font-bold">{mock.score}% complete ({mock.date})</div>
                ) : isUnlocked ? (
                  <button
                    onClick={() => {
                      const score = Math.floor(Math.random() * 30) + 70;
                      setMocks((prev) => [...prev.filter((m) => m.week !== week), { week, score, date: todaysDate }]);
                    }}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" /> Start Mock
                  </button>
                ) : (
                  <div className="text-sm text-slate-500 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Locked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {mocks.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 dark:bg-slate-900/40 dark:border-slate-800">
          <h3 className="font-bold mb-2">Mock Trend</h3>
          <div className="flex gap-2 items-end h-24">
            {mocks
              .sort((a, b) => a.week - b.week)
              .map((m) => (
                <div key={`mock-${m.week}`} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-indigo-500/70 rounded-t" style={{ height: `${m.score}%` }} />
                  <span className="text-[10px] mt-1">W{m.week}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
