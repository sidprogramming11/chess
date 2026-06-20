import { useState, useEffect, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

// ─── COURSE DATA ────────────────────────────────────────────────────────────
// Each line is a sequence of moves. The trainer plays white moves automatically
// and prompts the user to play black moves (or vice versa).
// playerColor: which side the learner plays
// moves: full move sequence in UCI format (e4, e5, Nf3, Nc6, ...)

const COURSES = [
  {
    id: "italian",
    title: "Italian Game",
    badge: "Beginner",
    description: "The classic 1.e4 e5 — learn the key ideas, plans, and variations.",
    duration: "2h 10m",
    free: true,
    lines: [
      {
        id: "giuoco-piano",
        title: "Main line — Giuoco Piano",
        playerColor: "black",
        explanation: "You play Black. White will make moves automatically. Your job is to find Black's correct response each time. The hint will tell you which piece to move and where.",
        moves: ["e4","e5","Nf3","Nc6","Bc4","Bc5","c3","Nf6","d4","exd4","cxd4","Bb4+","Bd2","Bxd2+","Nbxd2","d5"],
        moveExplanations: {
          "e5":    "Claim your share of the center symmetrically.",
          "Nc6":   "Defend the e5 pawn and develop a piece — two goals at once.",
          "Bc5":   "Mirror White's bishop. Both bishops eye the center diagonally.",
          "Nf6":   "Attack White's e4 pawn and develop your knight to its best square.",
          "exd4":  "Capture in the center — open the position for your pieces.",
          "Bb4+":  "Check! Force White to deal with the threat before castling.",
          "Bxd2+": "Take the bishop and give another check — keep the initiative.",
          "d5":    "Strike the center! This is the key freeing move for Black.",
        },
      },
      {
        id: "two-knights",
        title: "Variation — Two Knights Defense",
        playerColor: "black",
        explanation: "Instead of 3...Bc5, Black plays 3...Nf6 — a more aggressive, counterattacking choice.",
        moves: ["e4","e5","Nf3","Nc6","Bc4","Nf6","Ng5","d5","exd5","Na5","Bb5+","c6","dxc6","bxc6","Be2","h6","Nf3","e4"],
        moveExplanations: {
          "e5":   "Claim the center.",
          "Nc6":  "Develop and defend e5.",
          "Nf6":  "The Two Knights! Attack e4 immediately instead of mirroring with Bc5.",
          "d5":   "The only correct response to Ng5 — counterattack in the center.",
          "Na5":  "Attack the bishop and gain time. Don't capture on d5 yet.",
          "c6":   "Accept the pawn sacrifice — this is the Ulvestad/main line.",
          "bxc6": "Recapture and open the b-file for your rook.",
          "h6":   "Kick the knight away from g5.",
          "e4":   "Gain space and push White's knight back.",
        },
      },
      {
        id: "evans-gambit",
        title: "Variation — Evans Gambit",
        playerColor: "black",
        explanation: "White sacrifices a pawn with 4.b4 to gain rapid development. Black must know how to handle it.",
        moves: ["e4","e5","Nf3","Nc6","Bc4","Bc5","b4","Bxb4","c3","Ba5","d4","exd4","O-O","Nf6","cxd4","d6"],
        moveExplanations: {
          "e5":   "Claim the center.",
          "Nc6":  "Develop and defend.",
          "Bc5":  "The Italian bishop — sets up the Evans.",
          "Bxb4": "Accept the gambit! Take the pawn.",
          "Ba5":  "Retreat safely. Don't let White fork with c3.",
          "exd4": "Capture in the center and open lines.",
          "Nf6":  "Develop with tempo, attacking e4.",
          "d6":   "Solidify your center and prepare to develop the dark bishop.",
        },
      },
    ],
  },
  {
    id: "sicilian",
    title: "Sicilian Defense",
    badge: "Intermediate",
    description: "The most combative reply to 1.e4 — asymmetric, rich, and deeply strategic.",
    duration: "4h 30m",
    free: false,
    lines: [
      {
        id: "najdorf",
        title: "Main line — Najdorf Variation",
        playerColor: "black",
        explanation: "You play Black in the sharpest Sicilian variation, beloved by Fischer and Kasparov.",
        moves: ["e4","c5","Nf3","d6","d4","cxd4","Nxd4","Nf6","Nc3","a6","Bg5","e6","f4","Be7","Qf3","Qc7"],
        moveExplanations: {
          "c5":   "The Sicilian — fight for the center from the flank.",
          "d6":   "Prepare Nf6 and keep options open.",
          "cxd4": "Capture in the center — open the c-file for your rook.",
          "Nf6":  "Develop and attack e4.",
          "a6":   "The Najdorf move! Prevent Nb5 and prepare b5.",
          "e6":   "Solid — open the diagonal for your dark bishop.",
          "Be7":  "Develop and prepare to castle kingside.",
          "Qc7":  "Centralize the queen and prepare counterplay.",
        },
      },
    ],
  },
  {
    id: "queens-gambit",
    title: "Queen's Gambit",
    badge: "Intermediate",
    description: "1.d4 d5 2.c4 — White offers a pawn to gain central control.",
    duration: "3h 00m",
    free: false,
    lines: [
      {
        id: "qgd",
        title: "Main line — Queen's Gambit Declined",
        playerColor: "black",
        explanation: "You play Black, declining the gambit with 2...e6. Solid and strategic.",
        moves: ["d4","d5","c4","e6","Nc3","Nf6","Bg5","Be7","e3","O-O","Nf3","Nbd7","Rc1","c6","Bd3","dxc4","Bxc4","Nd5"],
        moveExplanations: {
          "d5":   "Claim the center immediately.",
          "e6":   "Decline the gambit — solid and principled.",
          "Nf6":  "Develop the knight to its best square.",
          "Be7":  "Develop and prepare to castle.",
          "O-O":  "Castle to safety.",
          "Nbd7": "Develop the queenside knight — it will go to f8 or b6.",
          "c6":   "Strengthen the center and prepare to challenge with dxc4.",
          "dxc4": "Release the tension — now you'll fight for the c4 pawn.",
          "Nd5":  "Centralize the knight with gain of tempo.",
        },
      },
    ],
  },
];

const BADGE_COLORS = {
  Beginner:     { bg: "#EAF3DE", color: "#3B6D11" },
  Intermediate: { bg: "#FAEEDA", color: "#854F0B" },
  Advanced:     { bg: "#FCEBEB", color: "#A32D2D" },
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function ChessApp() {
  const [view, setView]                   = useState("home");
  const [activeCourse, setActiveCourse]   = useState(null);
  const [activeLine, setActiveLine]       = useState(null);
  const [completedLines, setCompletedLines] = useState({});
  const [showUpgrade, setShowUpgrade]     = useState(false);

  const openLine = (course, line) => {
    if (!course.free) { setShowUpgrade(true); return; }
    setActiveCourse(course);
    setActiveLine(line);
    setView("trainer");
  };

  const markComplete = (courseId, lineId) => {
    setCompletedLines(p => ({ ...p, [`${courseId}-${lineId}`]: true }));
  };

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#0d0d0d", minHeight: "100vh", color: "#e8e0d0" }}>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 28px", borderBottom:"1px solid #222", background:"#0d0d0d", position:"sticky", top:0, zIndex:10 }}>
        <div onClick={() => setView("home")} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
          <span style={{ fontSize:22 }}>♟</span>
          <span style={{ fontSize:17, fontWeight:700, letterSpacing:"0.04em", color:"#e8e0d0" }}>ChessPath</span>
        </div>
        <div style={{ display:"flex", gap:28 }}>
          {["home","courses"].map(v => (
            <span key={v} onClick={() => setView(v)} style={{ fontSize:14, cursor:"pointer", color: view===v ? "#c9a84c" : "#888", fontFamily:"system-ui", textTransform:"capitalize" }}>{v}</span>
          ))}
        </div>
        <button onClick={() => setShowUpgrade(true)} style={{ background:"#c9a84c", color:"#0d0d0d", border:"none", borderRadius:6, padding:"8px 16px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"system-ui" }}>Go Pro</button>
      </nav>

      {view === "home"    && <HomeView    courses={COURSES} onOpenLine={openLine} onUpgrade={() => setShowUpgrade(true)} />}
      {view === "courses" && <CoursesView courses={COURSES} onOpenLine={openLine} completedLines={completedLines} />}
      {view === "trainer" && activeCourse && activeLine && (
        <MoveTrainer
          course={activeCourse}
          line={activeLine}
          onBack={() => setView("courses")}
          onComplete={() => { markComplete(activeCourse.id, activeLine.id); }}
          completedLines={completedLines}
          allLines={activeCourse.lines}
          onSelectLine={(line) => setActiveLine(line)}
        />
      )}
    </div>
  );
}

// ─── MOVE TRAINER ────────────────────────────────────────────────────────────
function MoveTrainer({ course, line, onBack, onComplete, completedLines, allLines, onSelectLine }) {
  const [game, setGame]               = useState(new Chess());
  const [moveIndex, setMoveIndex]     = useState(0);
  const [status, setStatus]           = useState("idle"); // idle | correct | wrong | complete
  const [wrongSquares, setWrongSquares] = useState(null);
  const [lastCorrectFen, setLastCorrectFen] = useState(new Chess().fen());
  const isComplete = completedLines[`${course.id}-${line.id}`];

  const playerColor = line.playerColor; // "white" or "black"
  const moves       = line.moves;

  // Which move index is it the player's turn?
  // playerColor=black means player plays odd indices (0-based: 1,3,5...)
  // playerColor=white means player plays even indices (0,2,4...)
  const isPlayerTurn = useCallback((idx) => {
    if (playerColor === "black") return idx % 2 === 1;
    return idx % 2 === 0;
  }, [playerColor]);

  // Get current expected move
  const expectedMove = moves[moveIndex];

  // Get hint text
  const getHint = () => {
    if (moveIndex >= moves.length) return null;
    const exp = moves[moveIndex];
    const expl = line.moveExplanations?.[exp];
    // Parse move to get piece hint
    return expl ? `Play ${exp} — ${expl}` : `Play ${exp}`;
  };

  // Auto-play computer moves
  const playComputerMove = useCallback((currentGame, idx) => {
    if (idx >= moves.length) return;
    if (isPlayerTurn(idx)) return;

    setTimeout(() => {
      const move = moves[idx];
      const g = new Chess(currentGame.fen());
      try {
        g.move(move);
        setLastCorrectFen(g.fen());
        setGame(g);
        const nextIdx = idx + 1;
        setMoveIndex(nextIdx);
        if (nextIdx >= moves.length) {
          setStatus("complete");
          onComplete();
        } else {
          setStatus("idle");
          // If next move is also computer's, keep going
          if (!isPlayerTurn(nextIdx)) {
            playComputerMove(g, nextIdx);
          }
        }
      } catch(e) {
        console.error("Computer move failed", move, e);
      }
    }, 600);
  }, [moves, isPlayerTurn, onComplete]);

  // Start — play computer's first moves if needed
  useEffect(() => {
    const g = new Chess();
    setGame(g);
    setMoveIndex(0);
    setStatus("idle");
    setLastCorrectFen(g.fen());
    setWrongSquares(null);
    // If player is black, computer plays first
    if (!isPlayerTurn(0)) {
      playComputerMove(g, 0);
    }
  }, [line]);

  // Handle player dropping a piece
  function onPieceDrop(sourceSquare, targetSquare) {
    if (status === "complete") return false;
    if (moveIndex >= moves.length) return false;
    if (!isPlayerTurn(moveIndex)) return false;

    // Try the move
    const g = new Chess(game.fen());
    let move;
    try {
      move = g.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    } catch {
      return false;
    }
    if (!move) return false;

    // Check if it matches the expected move
    const expected = moves[moveIndex];
    const playedSan = move.san;

    // Normalize: strip + and # for comparison
    const normalize = s => s.replace(/[+#!?]/g, "");
    const correct = normalize(playedSan) === normalize(expected);

    if (correct) {
      setLastCorrectFen(g.fen());
      setGame(g);
      setStatus("correct");
      setWrongSquares(null);
      const nextIdx = moveIndex + 1;
      setMoveIndex(nextIdx);

      if (nextIdx >= moves.length) {
        setStatus("complete");
        onComplete();
      } else {
        setTimeout(() => setStatus("idle"), 800);
        // Play computer response
        if (!isPlayerTurn(nextIdx)) {
          playComputerMove(g, nextIdx);
        }
      }
      return true;
    } else {
      // Wrong move — flash and snap back
      setWrongSquares({ [sourceSquare]: { background: "rgba(220,50,50,0.5)" }, [targetSquare]: { background: "rgba(220,50,50,0.5)" } });
      setStatus("wrong");
      setTimeout(() => {
        setGame(new Chess(lastCorrectFen));
        setStatus("idle");
        setWrongSquares(null);
      }, 800);
      return false;
    }
  }

  const reset = () => {
    const g = new Chess();
    setGame(g);
    setMoveIndex(0);
    setStatus("idle");
    setLastCorrectFen(g.fen());
    setWrongSquares(null);
    if (!isPlayerTurn(0)) playComputerMove(g, 0);
  };

  const progress = Math.round((moveIndex / moves.length) * 100);
  const hint = getHint();

  const customSquareStyles = wrongSquares || {};

  return (
    <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", minHeight:"calc(100vh - 53px)" }}>
      {/* Sidebar */}
      <div style={{ background:"#080808", borderRight:"1px solid #1a1a1a", padding:"20px 0", overflowY:"auto" }}>
        <div onClick={onBack} style={{ padding:"4px 20px 16px", fontSize:13, color:"#c9a84c", cursor:"pointer", fontFamily:"system-ui" }}>← All courses</div>
        <div style={{ padding:"0 20px 14px", borderBottom:"1px solid #1a1a1a" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#e8e0d0" }}>{course.title}</div>
          <div style={{ fontSize:11, color:"#555", fontFamily:"system-ui", marginTop:3 }}>{course.lines.length} lines</div>
        </div>
        <div style={{ paddingTop:8 }}>
          {course.lines.map((l) => {
            const done = !!completedLines[`${course.id}-${l.id}`];
            const active = l.id === line.id;
            return (
              <div key={l.id} onClick={() => onSelectLine(l)} style={{ padding:"10px 20px", cursor:"pointer", background: active ? "#1a1508" : "transparent", borderLeft: active ? "2px solid #c9a84c" : "2px solid transparent", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:13, color: done ? "#c9a84c" : "#333", flexShrink:0 }}>{done ? "✓" : "○"}</span>
                <span style={{ fontSize:12, color: active ? "#e8e0d0" : "#666", fontFamily:"system-ui", lineHeight:1.4 }}>{l.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main */}
      <div style={{ padding:"32px 36px", display:"flex", gap:40, alignItems:"flex-start", flexWrap:"wrap" }}>
        {/* Board column */}
        <div style={{ flexShrink:0 }}>
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            boardWidth={400}
            boardOrientation={playerColor}
            customSquareStyles={customSquareStyles}
            arePiecesDraggable={status !== "complete" && isPlayerTurn(moveIndex)}
            customBoardStyle={{ borderRadius:"6px", overflow:"hidden" }}
            customDarkSquareStyle={{ backgroundColor:"#b58863" }}
            customLightSquareStyle={{ backgroundColor:"#f0d9b5" }}
          />

          {/* Progress bar */}
          <div style={{ marginTop:12, height:4, background:"#1e1e1e", borderRadius:2 }}>
            <div style={{ height:4, background:"#c9a84c", borderRadius:2, width:`${progress}%`, transition:"width 0.4s" }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
            <span style={{ fontSize:11, color:"#555", fontFamily:"system-ui" }}>Move {moveIndex} of {moves.length}</span>
            <span style={{ fontSize:11, color:"#555", fontFamily:"system-ui" }}>{progress}%</span>
          </div>

          <button onClick={reset} style={{ marginTop:10, width:"100%", padding:"8px", cursor:"pointer", background:"transparent", color:"#888", border:"1px solid #222", borderRadius:6, fontSize:13, fontFamily:"system-ui" }}>
            ↺ Restart line
          </button>
        </div>

        {/* Info column */}
        <div style={{ flex:1, minWidth:260 }}>
          <div style={{ fontSize:12, color:"#555", fontFamily:"system-ui", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>{course.title}</div>
          <h2 style={{ fontSize:22, fontWeight:700, color:"#e8e0d0", marginBottom:12, lineHeight:1.3 }}>{line.title}</h2>
          <p style={{ fontSize:14, color:"#777", lineHeight:1.7, marginBottom:24, fontFamily:"system-ui" }}>{line.explanation}</p>

          {/* Status box */}
          {status === "complete" ? (
            <div style={{ padding:"20px", background:"#0d1a0d", border:"1px solid #1a3a1a", borderRadius:10, marginBottom:20 }}>
              <div style={{ fontSize:22, marginBottom:6 }}>✓</div>
              <div style={{ fontSize:16, fontWeight:700, color:"#4caf50", marginBottom:6, fontFamily:"system-ui" }}>Line complete!</div>
              <div style={{ fontSize:13, color:"#4caf50aa", fontFamily:"system-ui" }}>You played all {moves.length} moves correctly. Try the next variation.</div>
            </div>
          ) : status === "correct" ? (
            <div style={{ padding:"16px 20px", background:"#0d1a0d", border:"1px solid #1a3a1a", borderRadius:10, marginBottom:20 }}>
              <div style={{ fontSize:14, color:"#4caf50", fontFamily:"system-ui", fontWeight:700 }}>✓ Correct!</div>
              <div style={{ fontSize:13, color:"#4caf50aa", fontFamily:"system-ui", marginTop:4 }}>{line.moveExplanations?.[moves[moveIndex - 1]] || ""}</div>
            </div>
          ) : status === "wrong" ? (
            <div style={{ padding:"16px 20px", background:"#1a0d0d", border:"1px solid #3a1a1a", borderRadius:10, marginBottom:20 }}>
              <div style={{ fontSize:14, color:"#e05555", fontFamily:"system-ui", fontWeight:700 }}>✗ Not quite — try again</div>
              <div style={{ fontSize:13, color:"#e05555aa", fontFamily:"system-ui", marginTop:4 }}>The piece has been returned. Think about the hint below.</div>
            </div>
          ) : (
            <div style={{ padding:"16px 20px", background:"#111", border:"1px solid #1e1e1e", borderRadius:10, marginBottom:20 }}>
              {isPlayerTurn(moveIndex) ? (
                <>
                  <div style={{ fontSize:12, color:"#555", fontFamily:"system-ui", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Your move</div>
                  <div style={{ fontSize:15, color:"#c9a84c", fontFamily:"system-ui", fontWeight:600 }}>{hint}</div>
                </>
              ) : (
                <div style={{ fontSize:14, color:"#555", fontFamily:"system-ui" }}>Waiting for opponent...</div>
              )}
            </div>
          )}

          {/* Move history */}
          <div style={{ background:"#0a0a0a", border:"1px solid #1a1a1a", borderRadius:8, padding:"14px 18px" }}>
            <div style={{ fontSize:11, color:"#555", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10, fontFamily:"system-ui" }}>Moves played</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {moves.slice(0, moveIndex).map((m, i) => (
                <span key={i} style={{ fontSize:13, padding:"3px 8px", borderRadius:4, background: i === moveIndex - 1 ? "#1a1508" : "#111", color: i === moveIndex - 1 ? "#c9a84c" : "#444", border: i === moveIndex - 1 ? "1px solid #c9a84c44" : "1px solid #1e1e1e", fontFamily:"system-ui" }}>{m}</span>
              ))}
              {moveIndex === 0 && <span style={{ fontSize:13, color:"#333", fontFamily:"system-ui" }}>No moves yet</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HOME ────────────────────────────────────────────────────────────────────
function HomeView({ courses, onOpenLine, onUpgrade }) {
  return (
    <div>
      <div style={{ padding:"72px 28px 56px", textAlign:"center", borderBottom:"1px solid #1a1a1a", background:"radial-gradient(ellipse at 50% 0%, #1a1508 0%, #0d0d0d 70%)" }}>
        <div style={{ fontSize:52, marginBottom:8 }}>♟</div>
        <h1 style={{ fontSize:42, fontWeight:700, color:"#e8e0d0", margin:"0 0 16px", lineHeight:1.2 }}>
          Master chess,<br /><span style={{ color:"#c9a84c" }}>move by move</span>
        </h1>
        <p style={{ fontSize:17, color:"#888", maxWidth:480, margin:"0 auto 32px", lineHeight:1.7, fontFamily:"system-ui" }}>
          Play the moves yourself. Get instant feedback. The board snaps back if you're wrong. Learn lines until they're automatic.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          <button onClick={() => onOpenLine(courses[0], courses[0].lines[0])} style={{ background:"#c9a84c", color:"#0d0d0d", border:"none", borderRadius:8, padding:"13px 28px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"system-ui" }}>
            Try it free — Italian Game
          </button>
          <button onClick={onUpgrade} style={{ background:"transparent", color:"#e8e0d0", border:"1px solid #333", borderRadius:8, padding:"13px 28px", fontSize:15, cursor:"pointer", fontFamily:"system-ui" }}>
            View pricing
          </button>
        </div>
      </div>

      <div style={{ padding:"40px 28px" }}>
        <h2 style={{ fontSize:14, letterSpacing:"0.1em", color:"#888", textTransform:"uppercase", fontFamily:"system-ui", fontWeight:600, marginBottom:20 }}>Featured courses</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:16 }}>
          {courses.map(c => <CourseCard key={c.id} course={c} onOpenLine={onOpenLine} />)}
        </div>
      </div>

      <div style={{ padding:"0 28px 56px", display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:20 }}>
        {[
          { icon:"♜", title:"Play the moves", desc:"You move the pieces yourself — not just watch. The board tells you if you're right or wrong instantly." },
          { icon:"↺", title:"Instant correction", desc:"Wrong move? The piece snaps back to where it was so you can try again." },
          { icon:"◈", title:"Multiple variations", desc:"Each opening has several lines — not just the main move, but the key variations too." },
        ].map(f => (
          <div key={f.title} style={{ background:"#111", border:"1px solid #1e1e1e", borderRadius:10, padding:"20px 18px" }}>
            <div style={{ fontSize:24, marginBottom:10 }}>{f.icon}</div>
            <div style={{ fontSize:14, fontWeight:700, color:"#e8e0d0", marginBottom:6, fontFamily:"system-ui" }}>{f.title}</div>
            <div style={{ fontSize:13, color:"#666", lineHeight:1.6, fontFamily:"system-ui" }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COURSES ─────────────────────────────────────────────────────────────────
function CoursesView({ courses, onOpenLine, completedLines }) {
  return (
    <div style={{ padding:"36px 28px" }}>
      <h2 style={{ fontSize:26, fontWeight:700, color:"#e8e0d0", marginBottom:6 }}>All courses</h2>
      <p style={{ fontSize:14, color:"#666", fontFamily:"system-ui", marginBottom:28 }}>Build your repertoire from the ground up.</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:20 }}>
        {courses.map(c => <CourseCard key={c.id} course={c} onOpenLine={onOpenLine} completedLines={completedLines} expanded />)}
      </div>
    </div>
  );
}

function CourseCard({ course, onOpenLine, completedLines = {}, expanded = false }) {
  const badge = BADGE_COLORS[course.badge] || BADGE_COLORS.Beginner;
  const doneCount = course.lines.filter(l => completedLines[`${course.id}-${l.id}`]).length;

  return (
    <div style={{ background:"#111", border:"1px solid #1e1e1e", borderRadius:12, padding:"20px", overflow:"hidden" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <span style={{ fontSize:11, padding:"3px 9px", borderRadius:5, fontFamily:"system-ui", fontWeight:600, background:badge.bg, color:badge.color }}>{course.badge}</span>
        {!course.free && <span style={{ fontSize:11, color:"#c9a84c", fontFamily:"system-ui" }}>⭐ Pro</span>}
      </div>
      <div style={{ fontSize:16, fontWeight:700, color:"#e8e0d0", marginBottom:6 }}>{course.title}</div>
      <div style={{ fontSize:13, color:"#666", lineHeight:1.6, marginBottom:14, fontFamily:"system-ui" }}>{course.description}</div>

      {doneCount > 0 && (
        <div style={{ marginBottom:12 }}>
          <div style={{ height:3, background:"#1e1e1e", borderRadius:2 }}>
            <div style={{ height:3, background:"#c9a84c", borderRadius:2, width:`${Math.round((doneCount/course.lines.length)*100)}%` }} />
          </div>
          <div style={{ fontSize:11, color:"#555", fontFamily:"system-ui", marginTop:4 }}>{doneCount}/{course.lines.length} lines complete</div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {course.lines.map(l => {
          const done = !!completedLines?.[`${course.id}-${l.id}`];
          return (
            <div
              key={l.id}
              onClick={() => onOpenLine(course, l)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"#0a0a0a", border:"1px solid #1a1a1a", borderRadius:8, cursor:"pointer" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#c9a84c"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a1a"}
            >
              <span style={{ fontSize:14, color: done ? "#c9a84c" : "#333" }}>{done ? "✓" : "▶"}</span>
              <span style={{ fontSize:13, color: done ? "#c9a84c" : "#aaa", fontFamily:"system-ui", flex:1 }}>{l.title}</span>
              {!course.free && <span style={{ fontSize:11, color:"#555", fontFamily:"system-ui" }}>Pro</span>}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop:14, fontSize:12, color:"#444", fontFamily:"system-ui" }}>⏱ {course.duration}</div>
    </div>
  );
}

// ─── UPGRADE MODAL ───────────────────────────────────────────────────────────
function UpgradeModal({ onClose }) {
  const plans = [
    { name:"Pro", price:"$12", period:"/month", features:["All opening courses","All endgame courses","Multiple lines per opening","Progress tracking","New courses monthly"], highlight:true },
    { name:"Team", price:"$8", period:"/user/mo", features:["Everything in Pro","Coach dashboard","Student progress reports","Custom course builder","Priority support"], highlight:false },
  ];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#111", border:"1px solid #222", borderRadius:16, padding:"36px", maxWidth:560, width:"100%" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
          <div>
            <h2 style={{ fontSize:22, fontWeight:700, color:"#e8e0d0", margin:0 }}>Upgrade to Pro</h2>
            <p style={{ fontSize:14, color:"#666", marginTop:6, fontFamily:"system-ui" }}>Unlock every course, line, and feature.</p>
          </div>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#555", fontSize:22, cursor:"pointer" }}>×</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:24 }}>
          {plans.map(p => (
            <div key={p.name} style={{ border:`1px solid ${p.highlight ? "#c9a84c" : "#222"}`, borderRadius:12, padding:"20px 18px" }}>
              {p.highlight && <div style={{ fontSize:11, background:"#c9a84c22", color:"#c9a84c", padding:"3px 8px", borderRadius:4, display:"inline-block", marginBottom:10, fontFamily:"system-ui", fontWeight:600 }}>Most popular</div>}
              <div style={{ fontSize:16, fontWeight:700, color:"#e8e0d0", marginBottom:4 }}>{p.name}</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:2, marginBottom:14 }}>
                <span style={{ fontSize:26, fontWeight:700, color: p.highlight ? "#c9a84c" : "#e8e0d0" }}>{p.price}</span>
                <span style={{ fontSize:13, color:"#555", fontFamily:"system-ui" }}>{p.period}</span>
              </div>
              {p.features.map(f => (
                <div key={f} style={{ fontSize:13, color:"#888", fontFamily:"system-ui", marginBottom:6, display:"flex", gap:7 }}>
                  <span style={{ color:"#c9a84c" }}>✓</span> {f}
                </div>
              ))}
              <button style={{ width:"100%", marginTop:16, background: p.highlight ? "#c9a84c" : "transparent", color: p.highlight ? "#0d0d0d" : "#e8e0d0", border: p.highlight ? "none" : "1px solid #333", borderRadius:7, padding:"10px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"system-ui" }}>
                {p.highlight ? "Start 7-day free trial" : "Contact us"}
              </button>
            </div>
          ))}
        </div>
        <p style={{ fontSize:12, color:"#444", textAlign:"center", fontFamily:"system-ui" }}>Cancel anytime. No credit card required for trial.</p>
      </div>
    </div>
  );
}
