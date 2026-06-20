import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const COURSES = [
  {
    id: "italian",
    title: "Italian Game",
    badge: "Beginner",
    description: "The classic 1.e4 e5 — learn the key ideas and plans from move 1.",
    lessons: 12,
    duration: "2h 10m",
    free: true,
    lessons_data: [
      {
        title: "Introduction — control the center",
        explanation: "White opens with 1.e4, immediately staking a claim in the center. Controlling the center gives your pieces more space and more options. This is the foundation of most classical openings.",
        fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1",
        moves: ["1. e4"],
      },
      {
        title: "Black responds symmetrically",
        explanation: "Black mirrors with 1...e5, also claiming the center. This leads to open, tactical games where both sides fight for the initiative. The symmetry won't last long.",
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1",
        moves: ["1. e4", "e5"],
      },
      {
        title: "The knight develops",
        explanation: "2.Nf3 develops the knight to its most natural square, attacks the e5 pawn, and prepares to castle. A key principle: develop knights before bishops.",
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        moves: ["1. e4", "e5", "2. Nf3"],
      },
      {
        title: "Black defends and develops",
        explanation: "2...Nc6 defends the e5 pawn and develops a piece at the same time. This is the most natural and popular response. Both sides are following good opening principles.",
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        moves: ["1. e4", "e5", "2. Nf3", "Nc6"],
      },
      {
        title: "The Italian bishop",
        explanation: "3.Bc4 is the defining move of the Italian Game. The bishop targets f7, the weakest square in Black's camp. White is preparing to castle and building pressure.",
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        moves: ["1. e4", "e5", "2. Nf3", "Nc6", "3. Bc4"],
      },
      {
        title: "Black mirrors — the Giuoco Piano",
        explanation: "3...Bc5 mirrors White's bishop, also targeting the center diagonally. This is the Giuoco Piano ('quiet game' in Italian) — though it often leads to sharp tactical battles.",
        fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        moves: ["1. e4", "e5", "2. Nf3", "Nc6", "3. Bc4", "Bc5"],
      },
    ],
  },
  {
    id: "sicilian",
    title: "Sicilian Defense",
    badge: "Intermediate",
    description: "The most popular response to 1.e4 — master the key variations and counterplay.",
    lessons: 24,
    duration: "4h 30m",
    free: false,
    lessons_data: [
      {
        title: "The Sicilian — an asymmetric reply",
        explanation: "Instead of matching e5, Black plays 1...c5. This grabs queenside space and avoids symmetry. Black is fighting for the initiative from a different angle.",
        fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        moves: ["1. e4", "c5"],
      },
      {
        title: "White opens the center",
        explanation: "2.Nf3 develops the knight and prepares d4 — the key pawn advance that opens the center. White wants to use the extra central space to launch a kingside attack.",
        fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        moves: ["1. e4", "c5", "2. Nf3"],
      },
    ],
  },
  {
    id: "endgames",
    title: "King & Pawn Endgames",
    badge: "Beginner",
    description: "Essential endgame technique — the building blocks every player must know.",
    lessons: 10,
    duration: "1h 45m",
    free: false,
    lessons_data: [
      {
        title: "The opposition",
        explanation: "In king and pawn endings, 'opposition' is crucial. When kings face each other with one square between them, the player who does NOT have to move holds the opposition — a key advantage.",
        fen: "8/8/8/3k4/8/3K4/8/8 w - - 0 1",
        moves: ["Opposition position"],
      },
    ],
  },
];

const BADGE_COLORS = {
  Beginner: { bg: "#EAF3DE", color: "#3B6D11" },
  Intermediate: { bg: "#FAEEDA", color: "#854F0B" },
  Advanced: { bg: "#FCEBEB", color: "#A32D2D" },
};

export default function ChessApp() {
  const [view, setView] = useState("home");
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState({});
  const [showUpgrade, setShowUpgrade] = useState(false);

  const openCourse = (course) => {
    if (!course.free) { setShowUpgrade(true); return; }
    setActiveCourse(course);
    setActiveLesson(0);
    setView("lesson");
  };

  const nextLesson = () => {
    setCompletedLessons(p => ({ ...p, [`${activeCourse.id}-${activeLesson}`]: true }));
    if (activeLesson < activeCourse.lessons_data.length - 1) setActiveLesson(l => l + 1);
  };

  const totalCompleted = Object.keys(completedLessons).length;

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#0d0d0d", minHeight: "100vh", color: "#e8e0d0" }}>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", borderBottom: "1px solid #222", background: "#0d0d0d", position: "sticky", top: 0, zIndex: 10 }}>
        <div onClick={() => setView("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <span style={{ fontSize: 22 }}>♟</span>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "0.04em", color: "#e8e0d0" }}>ChessPath</span>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {["home", "courses"].map(v => (
            <span key={v} onClick={() => setView(v)} style={{ fontSize: 14, cursor: "pointer", color: view === v ? "#c9a84c" : "#888", fontFamily: "system-ui", textTransform: "capitalize" }}>{v}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {totalCompleted > 0 && <span style={{ fontSize: 12, color: "#c9a84c", fontFamily: "system-ui" }}>✓ {totalCompleted} completed</span>}
          <button onClick={() => setShowUpgrade(true)} style={{ background: "#c9a84c", color: "#0d0d0d", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "system-ui" }}>Go Pro</button>
        </div>
      </nav>

      {view === "home" && <HomeView courses={COURSES} onOpenCourse={openCourse} onUpgrade={() => setShowUpgrade(true)} />}
      {view === "courses" && <CoursesView courses={COURSES} onOpenCourse={openCourse} completedLessons={completedLessons} />}
      {view === "lesson" && activeCourse && (
        <LessonView
          course={activeCourse}
          lessonIndex={activeLesson}
          completedLessons={completedLessons}
          onNext={nextLesson}
          onPrev={() => { if (activeLesson > 0) setActiveLesson(l => l - 1); }}
          onBack={() => setView("courses")}
          onSelectLesson={setActiveLesson}
        />
      )}
    </div>
  );
}

function HomeView({ courses, onOpenCourse, onUpgrade }) {
  return (
    <div>
      <div style={{ padding: "72px 28px 56px", textAlign: "center", borderBottom: "1px solid #1a1a1a", background: "radial-gradient(ellipse at 50% 0%, #1a1508 0%, #0d0d0d 70%)" }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>♟</div>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: "#e8e0d0", margin: "0 0 16px", lineHeight: 1.2 }}>
          Master chess,<br /><span style={{ color: "#c9a84c" }}>one opening at a time</span>
        </h1>
        <p style={{ fontSize: 17, color: "#888", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7, fontFamily: "system-ui" }}>
          Structured lessons, interactive boards, and spaced repetition — so openings stick in your memory, not just your notes.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => onOpenCourse(courses[0])} style={{ background: "#c9a84c", color: "#0d0d0d", border: "none", borderRadius: 8, padding: "13px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "system-ui" }}>
            Start free — Italian Game
          </button>
          <button onClick={onUpgrade} style={{ background: "transparent", color: "#e8e0d0", border: "1px solid #333", borderRadius: 8, padding: "13px 28px", fontSize: 15, cursor: "pointer", fontFamily: "system-ui" }}>
            View pricing
          </button>
        </div>
      </div>

      <div style={{ padding: "40px 28px" }}>
        <h2 style={{ fontSize: 14, letterSpacing: "0.1em", color: "#888", textTransform: "uppercase", fontFamily: "system-ui", fontWeight: 600, marginBottom: 20 }}>Featured courses</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {courses.map(c => <CourseCard key={c.id} course={c} onOpen={onOpenCourse} />)}
        </div>
      </div>

      <div style={{ padding: "0 28px 56px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
        {[
          { icon: "♜", title: "Interactive boards", desc: "Every lesson plays out on a real board you can move pieces on." },
          { icon: "⟳", title: "Spaced repetition", desc: "Drill sequences until they're automatic." },
          { icon: "◈", title: "Step-by-step", desc: "Each move explained with ideas, not just notation." },
        ].map(f => (
          <div key={f.title} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: "20px 18px" }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e8e0d0", marginBottom: 6, fontFamily: "system-ui" }}>{f.title}</div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6, fontFamily: "system-ui" }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoursesView({ courses, onOpenCourse, completedLessons }) {
  return (
    <div style={{ padding: "36px 28px" }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, color: "#e8e0d0", marginBottom: 6 }}>All courses</h2>
      <p style={{ fontSize: 14, color: "#666", fontFamily: "system-ui", marginBottom: 28 }}>Build your repertoire from the ground up.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {courses.map(c => {
          const done = c.lessons_data.filter((_, i) => completedLessons[`${c.id}-${i}`]).length;
          return <CourseCard key={c.id} course={c} onOpen={onOpenCourse} completed={done} />;
        })}
      </div>
    </div>
  );
}

function CourseCard({ course, onOpen, completed }) {
  const badge = BADGE_COLORS[course.badge] || BADGE_COLORS.Beginner;
  const pct = completed && course.lessons_data.length ? Math.round((completed / course.lessons_data.length) * 100) : 0;
  return (
    <div
      onClick={() => onOpen(course)}
      style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "20px", cursor: "pointer" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#c9a84c"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e1e"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 5, fontFamily: "system-ui", fontWeight: 600, background: badge.bg, color: badge.color }}>{course.badge}</span>
        {!course.free && <span style={{ fontSize: 11, color: "#c9a84c", fontFamily: "system-ui" }}>⭐ Pro</span>}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#e8e0d0", marginBottom: 6 }}>{course.title}</div>
      <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 14, fontFamily: "system-ui" }}>{course.description}</div>
      {completed > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ height: 3, background: "#1e1e1e", borderRadius: 2 }}>
            <div style={{ height: 3, background: "#c9a84c", borderRadius: 2, width: `${pct}%` }} />
          </div>
          <div style={{ fontSize: 11, color: "#666", fontFamily: "system-ui", marginTop: 4 }}>{completed}/{course.lessons_data.length} lessons</div>
        </div>
      )}
      <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#555", fontFamily: "system-ui" }}>
        <span>▶ {course.lessons} lessons</span>
        <span>⏱ {course.duration}</span>
      </div>
    </div>
  );
}

function InteractiveBoard({ fen }) {
  const [game, setGame] = useState(new Chess(fen));

  function onPieceDrop(sourceSquare, targetSquare) {
    try {
      const move = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
      if (move === null) return false;
      setGame(new Chess(game.fen()));
      return true;
    } catch {
      return false;
    }
  }

  return (
    <div style={{ flexShrink: 0 }}>
      <Chessboard
        position={game.fen()}
        onPieceDrop={onPieceDrop}
        boardWidth={380}
        customBoardStyle={{ borderRadius: "6px", overflow: "hidden" }}
        customDarkSquareStyle={{ backgroundColor: "#b58863" }}
        customLightSquareStyle={{ backgroundColor: "#f0d9b5" }}
      />
      <button
        onClick={() => setGame(new Chess(fen))}
        style={{ marginTop: 10, width: "100%", padding: "8px", cursor: "pointer", background: "transparent", color: "#888", border: "1px solid #222", borderRadius: 6, fontSize: 13, fontFamily: "system-ui" }}
      >
        ↺ Reset position
      </button>
    </div>
  );
}

function LessonView({ course, lessonIndex, completedLessons, onNext, onPrev, onBack, onSelectLesson }) {
  const lesson = course.lessons_data[lessonIndex];
  const isCompleted = !!completedLessons[`${course.id}-${lessonIndex}`];
  const isLast = lessonIndex === course.lessons_data.length - 1;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "calc(100vh - 53px)" }}>
      {/* Sidebar */}
      <div style={{ background: "#080808", borderRight: "1px solid #1a1a1a", padding: "20px 0", overflowY: "auto" }}>
        <div onClick={onBack} style={{ padding: "4px 20px 16px", fontSize: 13, color: "#c9a84c", cursor: "pointer", fontFamily: "system-ui" }}>← All courses</div>
        <div style={{ padding: "0 20px 14px", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#e8e0d0" }}>{course.title}</div>
          <div style={{ fontSize: 11, color: "#555", fontFamily: "system-ui", marginTop: 3 }}>{course.lessons_data.length} lessons</div>
        </div>
        <div style={{ paddingTop: 8 }}>
          {course.lessons_data.map((l, i) => {
            const done = !!completedLessons[`${course.id}-${i}`];
            const active = i === lessonIndex;
            return (
              <div key={i} onClick={() => onSelectLesson(i)} style={{ padding: "10px 20px", cursor: "pointer", background: active ? "#1a1508" : "transparent", borderLeft: active ? "2px solid #c9a84c" : "2px solid transparent", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: done ? "#c9a84c" : "#333", flexShrink: 0 }}>{done ? "✓" : `${i + 1}`}</span>
                <span style={{ fontSize: 12, color: active ? "#e8e0d0" : "#666", fontFamily: "system-ui", lineHeight: 1.4 }}>{l.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main */}
      <div style={{ padding: "32px 36px", display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <InteractiveBoard key={`${course.id}-${lessonIndex}`} fen={lesson.fen} />
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button onClick={onPrev} disabled={lessonIndex === 0} style={{ flex: 1, background: "transparent", color: lessonIndex === 0 ? "#333" : "#e8e0d0", border: "1px solid #222", borderRadius: 6, padding: "8px", fontSize: 13, cursor: lessonIndex === 0 ? "default" : "pointer", fontFamily: "system-ui" }}>← Prev</button>
            <button onClick={onNext} style={{ flex: 1, background: "#c9a84c", color: "#0d0d0d", border: "none", borderRadius: 6, padding: "8px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "system-ui" }}>
              {isLast ? (isCompleted ? "✓ Done" : "Finish") : "Next →"}
            </button>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: 12, color: "#555", fontFamily: "system-ui", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Lesson {lessonIndex + 1} of {course.lessons_data.length}</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#e8e0d0", marginBottom: 16, lineHeight: 1.3 }}>{lesson.title}</h2>
          <p style={{ fontSize: 16, color: "#aaa", lineHeight: 1.8, marginBottom: 24, fontFamily: "system-ui" }}>{lesson.explanation}</p>

          <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 8, padding: "14px 18px", fontFamily: "system-ui" }}>
            <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Move sequence</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {lesson.moves.map((m, i) => (
                <span key={i} style={{ fontSize: 14, padding: "4px 10px", borderRadius: 5, fontWeight: 600, background: i === lesson.moves.length - 1 ? "#1a1508" : "#111", color: i === lesson.moves.length - 1 ? "#c9a84c" : "#666", border: i === lesson.moves.length - 1 ? "1px solid #c9a84c44" : "1px solid #1e1e1e" }}>{m}</span>
              ))}
            </div>
          </div>

          {isCompleted && (
            <div style={{ marginTop: 16, padding: "12px 16px", background: "#0d1a0d", border: "1px solid #1a3a1a", borderRadius: 8, fontSize: 13, color: "#4caf50", fontFamily: "system-ui" }}>✓ Lesson completed</div>
          )}
        </div>
      </div>
    </div>
  );
}

function UpgradeModal({ onClose }) {
  const plans = [
    { name: "Pro", price: "$12", period: "/month", features: ["All opening courses", "All endgame courses", "Spaced repetition drills", "Progress tracking", "New courses monthly"], highlight: true },
    { name: "Team", price: "$8", period: "/user/mo", features: ["Everything in Pro", "Coach dashboard", "Student progress reports", "Custom course builder", "Priority support"], highlight: false },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#111", border: "1px solid #222", borderRadius: 16, padding: "36px", maxWidth: 560, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#e8e0d0", margin: 0 }}>Upgrade to Pro</h2>
            <p style={{ fontSize: 14, color: "#666", marginTop: 6, fontFamily: "system-ui" }}>Unlock every course, drill, and feature.</p>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#555", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          {plans.map(p => (
            <div key={p.name} style={{ border: `1px solid ${p.highlight ? "#c9a84c" : "#222"}`, borderRadius: 12, padding: "20px 18px" }}>
              {p.highlight && <div style={{ fontSize: 11, background: "#c9a84c22", color: "#c9a84c", padding: "3px 8px", borderRadius: 4, display: "inline-block", marginBottom: 10, fontFamily: "system-ui", fontWeight: 600 }}>Most popular</div>}
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e8e0d0", marginBottom: 4 }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 14 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: p.highlight ? "#c9a84c" : "#e8e0d0" }}>{p.price}</span>
                <span style={{ fontSize: 13, color: "#555", fontFamily: "system-ui" }}>{p.period}</span>
              </div>
              {p.features.map(f => (
                <div key={f} style={{ fontSize: 13, color: "#888", fontFamily: "system-ui", marginBottom: 6, display: "flex", gap: 7 }}>
                  <span style={{ color: "#c9a84c" }}>✓</span> {f}
                </div>
              ))}
              <button style={{ width: "100%", marginTop: 16, background: p.highlight ? "#c9a84c" : "transparent", color: p.highlight ? "#0d0d0d" : "#e8e0d0", border: p.highlight ? "none" : "1px solid #333", borderRadius: 7, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "system-ui" }}>
                {p.highlight ? "Start 7-day free trial" : "Contact us"}
              </button>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#444", textAlign: "center", fontFamily: "system-ui" }}>Cancel anytime. No credit card required for trial.</p>
      </div>
    </div>
  );
}
