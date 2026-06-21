cat > /mnt/user-data/outputs/App.jsx << 'ENDOFFILE'
import { useState, useEffect, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const COURSES = [
  // ── e4 OPENINGS ──────────────────────────────────────────────────────────
  {
    id: "italian",
    title: "Italian Game",
    badge: "Beginner",
    category: "e4 Openings",
    description: "The classic 1.e4 e5 — control the center and develop rapidly.",
    duration: "2h 10m",
    free: true,
    lines: [
      {
        id: "giuoco-piano",
        title: "Giuoco Piano",
        playerColor: "black",
        explanation: "You play Black. White opens 1.e4 and develops toward the Italian. Find the correct responses.",
        moves: ["e4","e5","Nf3","Nc6","Bc4","Bc5","c3","Nf6","d4","exd4","cxd4","Bb4+","Bd2","Bxd2+","Nbxd2","d5"],
        moveExplanations: { "e5":"Claim the center.","Nc6":"Develop and defend e5.","Bc5":"Mirror the bishop.","Nf6":"Attack e4.","exd4":"Open the center.","Bb4+":"Check and gain time.","Bxd2+":"Take and check again.","d5":"Strike the center." },
      },
      {
        id: "two-knights",
        title: "Two Knights Defense",
        playerColor: "black",
        explanation: "3...Nf6 is more aggressive than Bc5 — counterattack immediately.",
        moves: ["e4","e5","Nf3","Nc6","Bc4","Nf6","Ng5","d5","exd5","Na5","Bb5+","c6","dxc6","bxc6","Be2","h6","Nf3","e4"],
        moveExplanations: { "e5":"Center.","Nc6":"Develop.","Nf6":"The Two Knights — attack e4.","d5":"Counter in the center.","Na5":"Attack the bishop.","c6":"Accept the pawn.","bxc6":"Open the b-file.","h6":"Kick the knight.","e4":"Gain space." },
      },
      {
        id: "evans-gambit",
        title: "Evans Gambit",
        playerColor: "black",
        explanation: "White sacrifices b4 for rapid development. Accept it and defend accurately.",
        moves: ["e4","e5","Nf3","Nc6","Bc4","Bc5","b4","Bxb4","c3","Ba5","d4","exd4","O-O","Nf6","cxd4","d6"],
        moveExplanations: { "e5":"Center.","Nc6":"Develop.","Bc5":"Italian setup.","Bxb4":"Accept the gambit!","Ba5":"Retreat safely.","exd4":"Open lines.","Nf6":"Develop with tempo.","d6":"Solidify." },
      },
    ],
  },
  {
    id: "fried-liver",
    title: "Fried Liver Attack",
    badge: "Intermediate",
    category: "e4 Openings",
    description: "White sacrifices a knight on f7 for a devastating kingside attack.",
    duration: "1h 30m",
    free: true,
    lines: [
      {
        id: "fried-liver-main",
        title: "Main Line — Knight Sacrifice",
        playerColor: "black",
        explanation: "You play Black. White will sacrifice on f7 — you must defend precisely.",
        moves: ["e4","e5","Nf3","Nc6","Bc4","Nf6","Ng5","d5","exd5","Nxd5","Nxf7","Kxf7","Qf3+","Ke6","Nc3","Ncb4","O-O","c6","d4","Nd3"],
        moveExplanations: { "e5":"Center.","Nc6":"Develop.","Nf6":"Two Knights.","d5":"Counter.","Nxd5":"Capture.","Kxf7":"Must take — the king will be hunted.","Ke6":"King moves up — risky but forced.","Ncb4":"Attack the queen.","c6":"Defend d5.","Nd3":"Fork threat." },
      },
      {
        id: "fried-liver-decline",
        title: "Declining with 5...Nd4",
        playerColor: "black",
        explanation: "Instead of accepting the sacrifice, Black can try to sidestep with Nd4.",
        moves: ["e4","e5","Nf3","Nc6","Bc4","Nf6","Ng5","d5","exd5","Nd4","c3","b5","Bf1","Nxd5","Ne4","Qh4","Ng3","Bg4","Qb3","Nb6"],
        moveExplanations: { "e5":"Center.","Nc6":"Develop.","Nf6":"Two Knights.","d5":"Counter.","Nd4":"Dodge the fried liver!","b5":"Gain time attacking the bishop.","Nxd5":"Recapture.","Qh4":"Active queen.","Bg4":"Pin the knight.","Nb6":"Regroup." },
      },
    ],
  },
  {
    id: "scandinavian",
    title: "Scandinavian Defense",
    badge: "Beginner",
    category: "e4 Openings",
    description: "1...d5 immediately challenges White's center — simple and solid.",
    duration: "1h 45m",
    free: true,
    lines: [
      {
        id: "scandi-main",
        title: "Main Line — 2...Qxd5",
        playerColor: "black",
        explanation: "You play Black. Recapture with the queen and develop actively.",
        moves: ["e4","d5","exd5","Qxd5","Nc3","Qa5","d4","Nf6","Nf3","Bf5","Bc4","e6","Bd2","Bb4","Nd5","Qd8"],
        moveExplanations: { "d5":"Challenge the center immediately.","Qxd5":"Recapture with the queen.","Qa5":"The best square — eyes the queenside.","Nf6":"Develop and prepare to castle.","Bf5":"Active bishop outside the pawn chain.","e6":"Solid center.","Bb4":"Pin the knight.","Qd8":"Retreat to safety." },
      },
      {
        id: "scandi-modern",
        title: "Modern Variation — 2...Nf6",
        playerColor: "black",
        explanation: "Instead of recapturing immediately, develop the knight first.",
        moves: ["e4","d5","exd5","Nf6","d4","Nxd5","Nf3","g6","c4","Nb6","Nc3","Bg7","Be3","O-O","Qd2","Nc6"],
        moveExplanations: { "d5":"Challenge.","Nf6":"Develop first — the modern way.","Nxd5":"Recapture.","g6":"Fianchetto setup.","Nb6":"Regroup the knight.","Bg7":"Powerful fianchettoed bishop.","O-O":"Castle to safety.","Nc6":"Develop the queenside." },
      },
    ],
  },
  {
    id: "sicilian",
    title: "Sicilian Defense",
    badge: "Intermediate",
    category: "e4 Openings",
    description: "The most combative reply to 1.e4 — asymmetric and deeply strategic.",
    duration: "4h 30m",
    free: false,
    lines: [
      {
        id: "najdorf",
        title: "Najdorf Variation",
        playerColor: "black",
        explanation: "The sharpest Sicilian — beloved by Fischer and Kasparov.",
        moves: ["e4","c5","Nf3","d6","d4","cxd4","Nxd4","Nf6","Nc3","a6","Bg5","e6","f4","Be7","Qf3","Qc7"],
        moveExplanations: { "c5":"The Sicilian.","d6":"Flexible.","cxd4":"Open the c-file.","Nf6":"Develop.","a6":"The Najdorf — stop Nb5.","e6":"Solid.","Be7":"Develop and castle.","Qc7":"Centralize." },
      },
      {
        id: "dragon",
        title: "Dragon Variation",
        playerColor: "black",
        explanation: "The Dragon — Black fianchettoes the bishop for long-term pressure.",
        moves: ["e4","c5","Nf3","d6","d4","cxd4","Nxd4","Nf6","Nc3","g6","Be3","Bg7","f3","O-O","Qd2","Nc6","Bc4","Bd7","O-O-O","Rc8"],
        moveExplanations: { "c5":"Sicilian.","d6":"Flexible.","cxd4":"Open c-file.","Nf6":"Develop.","g6":"Dragon setup!","Bg7":"The Dragon bishop — powerful diagonal.","O-O":"Castle kingside.","Nc6":"Develop.","Bd7":"Prepare Rc8.","Rc8":"Attack on the c-file." },
      },
      {
        id: "scheveningen",
        title: "Scheveningen Variation",
        playerColor: "black",
        explanation: "Solid pawn structure with e6 — flexible and resilient.",
        moves: ["e4","c5","Nf3","e6","d4","cxd4","Nxd4","Nf6","Nc3","d6","Be2","Be7","O-O","O-O","f4","Nc6","Be3","Bd7"],
        moveExplanations: { "c5":"Sicilian.","e6":"Scheveningen setup.","cxd4":"Open.","Nf6":"Develop.","d6":"Solid.","Be7":"Prepare castle.","O-O":"Castle.","Nc6":"Develop.","Bd7":"Complete development." },
      },
      {
        id: "kan",
        title: "Kan / Taimanov Variation",
        playerColor: "black",
        explanation: "4...e6 with a6 — flexible and hard to attack.",
        moves: ["e4","c5","Nf3","e6","d4","cxd4","Nxd4","a6","Nc3","Qc7","Bd3","Nf6","O-O","Nc6","Nxc6","bxc6","f4","d6"],
        moveExplanations: { "c5":"Sicilian.","e6":"Solid.","cxd4":"Open.","a6":"Kan move — prepare b5.","Qc7":"Flexible queen.","Nf6":"Develop.","Nc6":"Develop.","bxc6":"Recapture — open b-file.","d6":"Center." },
      },
    ],
  },
  {
    id: "french",
    title: "French Defense",
    badge: "Beginner",
    category: "e4 Openings",
    description: "1...e6 — solid and counterattacking from a cramped but resilient structure.",
    duration: "2h 30m",
    free: false,
    lines: [
      {
        id: "french-advance",
        title: "Advance Variation",
        playerColor: "black",
        explanation: "White pushes e5 and gains space. Black counterattacks with c5.",
        moves: ["e4","e6","d4","d5","e5","c5","c3","Nc6","Nf3","Qb6","Be2","cxd4","cxd4","Nge7","Nc3","Nf5","Na4","Qd8"],
        moveExplanations: { "e6":"French.","d5":"Challenge the center.","c5":"Counterattack the base.","Nc6":"Develop.","Qb6":"Attack d4.","cxd4":"Exchange.","Nge7":"Develop — knight goes to f5.","Nf5":"Perfect knight post.","Qd8":"Retreat safely." },
      },
      {
        id: "french-winawer",
        title: "Winawer Variation",
        playerColor: "black",
        explanation: "3...Bb4 — pin the knight and create an unbalanced game.",
        moves: ["e4","e6","d4","d5","Nc3","Bb4","e5","c5","a3","Bxc3+","bxc3","Ne7","Qg4","Qc7","Qxg7","Rg8","Qxh7","cxd4","Ne2","Nbc6"],
        moveExplanations: { "e6":"French.","d5":"Center.","Bb4":"Winawer — pin!","c5":"Attack d4.","Bxc3+":"Take the knight.","Ne7":"Develop.","Qc7":"Defend g7.","Rg8":"Trap the queen.","cxd4":"Open.","Nbc6":"Develop." },
      },
      {
        id: "french-classical",
        title: "Classical Variation",
        playerColor: "black",
        explanation: "3...Nf6 — develop naturally and fight for the center.",
        moves: ["e4","e6","d4","d5","Nc3","Nf6","Bg5","Be7","e5","Nfd7","Bxe7","Qxe7","f4","O-O","Nf3","c5","Qd2","Nc6"],
        moveExplanations: { "e6":"French.","d5":"Center.","Nf6":"Classical — develop.","Be7":"Prepare to castle.","Nfd7":"Retreat — avoid the pin.","Qxe7":"Recapture.","O-O":"Castle.","c5":"Attack.","Nc6":"Develop." },
      },
    ],
  },
  {
    id: "caro-kann",
    title: "Caro-Kann Defense",
    badge: "Beginner",
    category: "e4 Openings",
    description: "1...c6 — solid, sound, and leads to healthy pawn structures.",
    duration: "2h 00m",
    free: false,
    lines: [
      {
        id: "caro-classical",
        title: "Classical Variation",
        playerColor: "black",
        explanation: "Develop the bishop outside the pawn chain before closing it in.",
        moves: ["e4","c6","d4","d5","Nc3","dxe4","Nxe4","Bf5","Ng3","Bg6","h4","h6","Nf3","Nd7","h5","Bh7","Bd3","Bxd3","Qxd3","e6"],
        moveExplanations: { "c6":"Caro-Kann.","d5":"Challenge.","dxe4":"Exchange.","Bf5":"The key move — bishop outside the chain!","Bg6":"Retreat.","h6":"Stop h5.","Nd7":"Develop.","Bh7":"Retreat.","e6":"Solid." },
      },
      {
        id: "caro-advance",
        title: "Advance Variation",
        playerColor: "black",
        explanation: "White gains space with e5 — Black must find counterplay quickly.",
        moves: ["e4","c6","d4","d5","e5","Bf5","Nf3","e6","Be2","Nd7","O-O","Ne7","Nbd2","h6","Nb3","Bg6","Be3","Nf5"],
        moveExplanations: { "c6":"Caro.","d5":"Challenge.","Bf5":"Develop the bishop before e6 closes the diagonal.","e6":"Solid.","Nd7":"Develop.","Ne7":"Knight goes to f5.","h6":"Prevent Ng5.","Bg6":"Regroup.","Nf5":"Perfect square." },
      },
    ],
  },
  {
    id: "pirc",
    title: "Pirc Defense",
    badge: "Intermediate",
    category: "e4 Openings",
    description: "Allow White a big center, then undermine it — hypermodern style.",
    duration: "1h 45m",
    free: false,
    lines: [
      {
        id: "pirc-classical",
        title: "Classical System",
        playerColor: "black",
        explanation: "Fianchetto the bishop and attack White's center from the flanks.",
        moves: ["e4","d6","d4","Nf6","Nc3","g6","Nf3","Bg7","Be2","O-O","O-O","c6","a4","Nbd7","h3","e5","dxe5","dxe5"],
        moveExplanations: { "d6":"Pirc setup.","Nf6":"Develop.","g6":"Fianchetto.","Bg7":"The powerful Pirc bishop.","O-O":"Castle.","c6":"Prepare d5.","Nbd7":"Develop.","e5":"Strike the center!","dxe5":"Exchange." },
      },
    ],
  },
  {
    id: "ruy-lopez",
    title: "Ruy Lopez (Spanish)",
    badge: "Intermediate",
    category: "e4 Openings",
    description: "The most classical opening — pressure on e5 from move 3.",
    duration: "3h 30m",
    free: false,
    lines: [
      {
        id: "ruy-morphy",
        title: "Morphy Defense — Main Line",
        playerColor: "black",
        explanation: "3...a6 — the most common reply to the Spanish.",
        moves: ["e4","e5","Nf3","Nc6","Bb5","a6","Ba4","Nf6","O-O","Be7","Re1","b5","Bb3","d6","c3","O-O","h3","Nb8","d4","Nbd7"],
        moveExplanations: { "e5":"Center.","Nc6":"Develop.","a6":"Morphy — attack the bishop.","Nf6":"Develop.","Be7":"Prepare castle.","b5":"Drive the bishop back.","d6":"Solid center.","O-O":"Castle.","Nb8":"The mysterious retreat — regroup.","Nbd7":"Better square." },
      },
      {
        id: "ruy-berlin",
        title: "Berlin Defense",
        playerColor: "black",
        explanation: "3...Nf6 — the drawing weapon of top GMs. Simplify and hold.",
        moves: ["e4","e5","Nf3","Nc6","Bb5","Nf6","O-O","Nxe4","d4","Nd6","Bxc6","dxc6","dxe5","Nf5","Qxd8+","Kxd8","Nc3","Bd7"],
        moveExplanations: { "e5":"Center.","Nc6":"Develop.","Nf6":"Berlin!","Nxe4":"Take the pawn.","Nd6":"Retreat.","dxc6":"Doubled pawns — but solid.","Nf5":"Active.","Kxd8":"King in the center — counterintuitive but fine.","Bd7":"Develop." },
      },
      {
        id: "ruy-exchange",
        title: "Exchange Variation",
        playerColor: "black",
        explanation: "White exchanges on c6 and gets a structural advantage — Black must fight back.",
        moves: ["e4","e5","Nf3","Nc6","Bb5","a6","Bxc6","dxc6","O-O","Qd6","d3","Ne7","Nbd2","Ng6","Nc4","Qd8","Ne3","Bd6"],
        moveExplanations: { "e5":"Center.","Nc6":"Develop.","a6":"Morphy.","dxc6":"Recapture — open the d-file.","Qd6":"Active queen.","Ne7":"Develop.","Ng6":"Attack f4.","Qd8":"Simplify.","Bd6":"Develop." },
      },
    ],
  },
  {
    id: "kings-gambit",
    title: "King's Gambit",
    badge: "Intermediate",
    category: "e4 Openings",
    description: "White sacrifices f4 for a lightning-fast attack — romantic and dangerous.",
    duration: "2h 00m",
    free: false,
    lines: [
      {
        id: "kings-gambit-accepted",
        title: "King's Gambit Accepted",
        playerColor: "black",
        explanation: "Accept the pawn and try to hold it while developing.",
        moves: ["e4","e5","f4","exf4","Nf3","g5","Bc4","g4","O-O","gxf3","Qxf3","Qf6","e5","Qxe5","Bxf7+","Kxf7","d4","Qxd4+","Be3","Qb4"],
        moveExplanations: { "e5":"Center.","exf4":"Accept!","g5":"Hold the pawn.","g4":"Aggressive — kick the knight.","gxf3":"Take.","Qf6":"Defend f4.","Qxe5":"Take the pawn.","Kxf7":"Take the bishop.","Qxd4+":"Check.","Qb4":"Safe." },
      },
      {
        id: "kings-gambit-declined",
        title: "King's Gambit Declined — Falkbeer",
        playerColor: "black",
        explanation: "Counter immediately with d5 — don't accept the gambit.",
        moves: ["e4","e5","f4","d5","exd5","e4","d3","Nf6","dxe4","Nxe4","Nf3","Bc5","Qe2","Bf5","Nc3","Qe7","Be3","Bxe3","Qxe3","O-O-O"],
        moveExplanations: { "e5":"Center.","d5":"Falkbeer Counter-Gambit!","e4":"Counter-gambit.","Nf6":"Develop.","Nxe4":"Take.","Bc5":"Active bishop.","Bf5":"Develop.","Qe7":"Centralize.","Bxe3":"Exchange.","O-O-O":"Castle queenside." },
      },
    ],
  },
  {
    id: "four-knights",
    title: "Four Knights Game",
    badge: "Beginner",
    category: "e4 Openings",
    description: "Both sides develop all four knights — classical and symmetrical.",
    duration: "1h 30m",
    free: false,
    lines: [
      {
        id: "four-knights-main",
        title: "Main Line — Spanish Four Knights",
        playerColor: "black",
        explanation: "White plays Bb5 — mirror the position symmetrically.",
        moves: ["e4","e5","Nf3","Nc6","Nc3","Nf6","Bb5","Bb4","O-O","O-O","d3","d6","Ne2","Ne7","c3","Ba5","Ng3","c6"],
        moveExplanations: { "e5":"Center.","Nc6":"Develop.","Nf6":"Four Knights.","Bb4":"Mirror!","O-O":"Castle.","d6":"Solid.","Ne7":"Regroup.","Ba5":"Retreat.","c6":"Prepare d5." },
      },
    ],
  },
  {
    id: "alekhines",
    title: "Alekhine's Defense",
    badge: "Intermediate",
    category: "e4 Openings",
    description: "1...Nf6 — invite White to overextend the center, then attack it.",
    duration: "1h 45m",
    free: false,
    lines: [
      {
        id: "alekhines-four-pawns",
        title: "Four Pawns Attack",
        playerColor: "black",
        explanation: "White builds a massive center — attack it before it crushes you.",
        moves: ["e4","Nf6","e5","Nd5","d4","d6","c4","Nb6","f4","dxe5","fxe5","Nc6","Be3","Bf5","Nc3","e6","Nf3","Be7","Be2","O-O"],
        moveExplanations: { "Nf6":"Alekhine!","Nd5":"Retreat — invite overextension.","d6":"Challenge.","Nb6":"Regroup.","dxe5":"Strike!","Nc6":"Develop.","Bf5":"Active.","e6":"Solid.","Be7":"Develop.","O-O":"Castle." },
      },
    ],
  },
  {
    id: "petroff",
    title: "Petrov's Defense",
    badge: "Beginner",
    category: "e4 Openings",
    description: "1...e5 2.Nf3 Nf6 — symmetrical and solid drawing weapon.",
    duration: "1h 30m",
    free: false,
    lines: [
      {
        id: "petroff-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Counter-attack e4 immediately instead of defending e5.",
        moves: ["e4","e5","Nf3","Nf6","Nxe5","d6","Nf3","Nxe4","d4","d5","Bd3","Nc6","O-O","Be7","c4","Nb4","Be2","O-O"],
        moveExplanations: { "e5":"Center.","Nf6":"Petrov — counter-attack!","d6":"Drive the knight back.","Nxe4":"Take the pawn.","d5":"Solid.","Nc6":"Develop.","Be7":"Prepare castle.","Nb4":"Attack.","O-O":"Castle." },
      },
    ],
  },
  {
    id: "philidor",
    title: "Philidor Defense",
    badge: "Beginner",
    category: "e4 Openings",
    description: "1...d6 — solid but slightly passive. Good for beginners.",
    duration: "1h 00m",
    free: false,
    lines: [
      {
        id: "philidor-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Solid setup — control e5 with the pawn and develop carefully.",
        moves: ["e4","e5","Nf3","d6","d4","Nf6","Nc3","Nbd7","Bc4","Be7","O-O","O-O","a4","c6","Ba2","Qc7"],
        moveExplanations: { "e5":"Center.","d6":"Philidor — solid.","Nf6":"Develop.","Nbd7":"Flexible development.","Be7":"Prepare castle.","O-O":"Castle.","c6":"Strengthen center.","Qc7":"Active queen." },
      },
    ],
  },
  {
    id: "vienna",
    title: "Vienna Game",
    badge: "Beginner",
    category: "e4 Openings",
    description: "2.Nc3 — flexible and often leads to sharp play.",
    duration: "1h 15m",
    free: false,
    lines: [
      {
        id: "vienna-main",
        title: "Vienna Gambit",
        playerColor: "black",
        explanation: "White plays f4 — a gambit setup. Handle it precisely.",
        moves: ["e4","e5","Nc3","Nf6","f4","d5","fxe5","Nxe4","Nf3","Bg4","Qe2","Nxc3","dxc3","Bxf3","Qxf3","Nc6","Bb5","Bc5"],
        moveExplanations: { "e5":"Center.","Nf6":"Develop.","d5":"Counter in the center.","Nxe4":"Take the pawn.","Bg4":"Pin the knight.","Nxc3":"Take.","Bxf3":"Exchange.","Nc6":"Develop.","Bc5":"Active." },
      },
    ],
  },
  {
    id: "ponziani",
    title: "Ponziani Opening",
    badge: "Beginner",
    category: "e4 Openings",
    description: "1.e4 e5 2.Nf3 Nc6 3.c3 — prepare d4 immediately.",
    duration: "1h 00m",
    free: false,
    lines: [
      {
        id: "ponziani-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Challenge White's center with d5 before it gets too strong.",
        moves: ["e4","e5","Nf3","Nc6","c3","d5","Qb3","Qd6","exd5","Nd4","Nxd4","exd4","Bc4","dxc3","Nxc3","Nf6"],
        moveExplanations: { "e5":"Center.","Nc6":"Develop.","d5":"Counter immediately!","Qd6":"Defend d5 and develop.","Nd4":"Active knight.","exd4":"Take.","dxc3":"Exchange.","Nf6":"Develop." },
      },
    ],
  },
  {
    id: "scotch",
    title: "Scotch Game",
    badge: "Beginner",
    category: "e4 Openings",
    description: "3.d4 — open the center immediately and fight for the initiative.",
    duration: "1h 30m",
    free: false,
    lines: [
      {
        id: "scotch-main",
        title: "Main Line — Mieses Variation",
        playerColor: "black",
        explanation: "After 3...exd4 White recaptures — find the best development.",
        moves: ["e4","e5","Nf3","Nc6","d4","exd4","Nxd4","Nf6","Nxc6","bxc6","e5","Qe7","Qe2","Nd5","c4","Ba6","b3","g6"],
        moveExplanations: { "e5":"Center.","Nc6":"Develop.","exd4":"Take in the center.","Nf6":"Develop.","bxc6":"Recapture — open b-file.","Qe7":"Defend e5.","Nd5":"Active knight.","Ba6":"Attack c4.","g6":"Fianchetto." },
      },
      {
        id: "scotch-gambit",
        title: "Scotch Gambit",
        playerColor: "black",
        explanation: "White offers a pawn for rapid development — defend accurately.",
        moves: ["e4","e5","Nf3","Nc6","d4","exd4","Bc4","Bc5","c3","Nf6","e5","d5","Bb5","Ne4","cxd4","Bb6","Nc3","O-O"],
        moveExplanations: { "e5":"Center.","Nc6":"Develop.","exd4":"Take.","Bc5":"Active bishop.","Nf6":"Develop.","d5":"Counter.","Ne4":"Active.","Bb6":"Retreat safely.","O-O":"Castle." },
      },
    ],
  },
  {
    id: "bishops-opening",
    title: "Bishop's Opening",
    badge: "Beginner",
    category: "e4 Openings",
    description: "2.Bc4 — develop the bishop immediately and keep options open.",
    duration: "1h 00m",
    free: false,
    lines: [
      {
        id: "bishops-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Respond symmetrically and develop naturally.",
        moves: ["e4","e5","Bc4","Nf6","d3","Bc5","Nf3","d6","c3","O-O","O-O","Bb6","Bb3","Nc6","Nbd2","Ne7"],
        moveExplanations: { "e5":"Center.","Nf6":"Develop and attack e4.","Bc5":"Mirror.","d6":"Solid.","O-O":"Castle.","Bb6":"Retreat safely.","Nc6":"Develop.","Ne7":"Regroup." },
      },
    ],
  },
  // ── d4 OPENINGS ──────────────────────────────────────────────────────────
  {
    id: "queens-gambit",
    title: "Queen's Gambit",
    badge: "Intermediate",
    category: "d4 Openings",
    description: "1.d4 d5 2.c4 — White offers a pawn to gain central control.",
    duration: "3h 00m",
    free: false,
    lines: [
      {
        id: "qgd",
        title: "Queen's Gambit Declined",
        playerColor: "black",
        explanation: "Decline with 2...e6 — solid and strategic.",
        moves: ["d4","d5","c4","e6","Nc3","Nf6","Bg5","Be7","e3","O-O","Nf3","Nbd7","Rc1","c6","Bd3","dxc4","Bxc4","Nd5"],
        moveExplanations: { "d5":"Center.","e6":"Decline — solid.","Nf6":"Develop.","Be7":"Prepare castle.","O-O":"Castle.","Nbd7":"Develop.","c6":"Strengthen.","dxc4":"Exchange.","Nd5":"Centralize." },
      },
      {
        id: "qga",
        title: "Queen's Gambit Accepted",
        playerColor: "black",
        explanation: "Accept with 2...dxc4 and try to hold the extra pawn.",
        moves: ["d4","d5","c4","dxc4","Nf3","Nf6","e3","e6","Bxc4","c5","O-O","a6","Bb3","b5","a4","b4","Nbd2","Bb7"],
        moveExplanations: { "d5":"Center.","dxc4":"Accept!","Nf6":"Develop.","e6":"Solid.","c5":"Counter the center.","a6":"Prepare b5.","b5":"Gain space.","b4":"Push forward.","Bb7":"Active bishop." },
      },
      {
        id: "slav",
        title: "Slav Defense",
        playerColor: "black",
        explanation: "2...c6 — solid support for d5 without closing the c8 bishop.",
        moves: ["d4","d5","c4","c6","Nf3","Nf6","Nc3","dxc4","a4","Bf5","e3","e6","Bxc4","Bb4","O-O","O-O","Qe2","Nbd7"],
        moveExplanations: { "d5":"Center.","c6":"Slav — support d5.","Nf6":"Develop.","dxc4":"Take.","Bf5":"Develop the bishop before e6.","e6":"Now close it.","Bb4":"Pin.","O-O":"Castle.","Nbd7":"Develop." },
      },
      {
        id: "semi-slav",
        title: "Semi-Slav Defense",
        playerColor: "black",
        explanation: "Combine the Slav and QGD — very solid setup.",
        moves: ["d4","d5","c4","c6","Nf3","Nf6","Nc3","e6","e3","Nbd7","Bd3","dxc4","Bxc4","b5","Bd3","Bd6","O-O","O-O"],
        moveExplanations: { "d5":"Center.","c6":"Slav structure.","Nf6":"Develop.","e6":"Semi-Slav.","Nbd7":"Develop.","dxc4":"Exchange.","b5":"Gain space.","Bd6":"Develop.","O-O":"Castle." },
      },
      {
        id: "chigorin",
        title: "Chigorin Defense",
        playerColor: "black",
        explanation: "2...Nc6 — unusual but fighting.",
        moves: ["d4","d5","c4","Nc6","Nf3","Bg4","cxd5","Bxf3","gxf3","Qxd5","e3","e5","Nc3","Bb4","Bd2","Bxc3","bxc3","Nf6"],
        moveExplanations: { "d5":"Center.","Nc6":"Chigorin!","Bg4":"Pin the knight.","Bxf3":"Exchange.","Qxd5":"Recapture.","e5":"Active.","Bb4":"Pin.","Bxc3":"Exchange.","Nf6":"Develop." },
      },
    ],
  },
  {
    id: "kings-indian",
    title: "King's Indian Defense",
    badge: "Intermediate",
    category: "d4 Openings",
    description: "Fianchetto the king's bishop and counterattack White's center.",
    duration: "3h 30m",
    free: false,
    lines: [
      {
        id: "kid-main",
        title: "Main Line — Classical",
        playerColor: "black",
        explanation: "Let White build the center, then strike with e5.",
        moves: ["d4","Nf6","c4","g6","Nc3","Bg7","e4","d6","Nf3","O-O","Be2","e5","O-O","Nc6","d5","Ne7","Ne1","Nd7","Nd3","f5"],
        moveExplanations: { "Nf6":"KID setup.","g6":"Fianchetto.","Bg7":"The KID bishop.","d6":"Solid.","O-O":"Castle.","e5":"Strike the center!","Nc6":"Develop.","Ne7":"Maneuver.","Nd7":"Prepare f5.","f5":"Kingside attack!" },
      },
      {
        id: "kid-samisch",
        title: "Sämisch Variation",
        playerColor: "black",
        explanation: "White plays f3 — aggressive. Black must counterattack queenside.",
        moves: ["d4","Nf6","c4","g6","Nc3","Bg7","e4","d6","f3","O-O","Be3","e5","d5","Nh5","Qd2","Qh4+","g3","Nxg3","Qf2","Nxf1"],
        moveExplanations: { "Nf6":"KID.","g6":"Fianchetto.","Bg7":"Bishop.","d6":"Solid.","O-O":"Castle.","e5":"Counter.","Nh5":"Attack g3.","Qh4+":"Check!","Nxg3":"Sack!","Nxf1":"Material." },
      },
      {
        id: "kid-four-pawns",
        title: "Four Pawns Attack",
        playerColor: "black",
        explanation: "White builds a massive center with four pawns — attack it immediately.",
        moves: ["d4","Nf6","c4","g6","Nc3","Bg7","e4","d6","f4","O-O","Nf3","c5","d5","e6","Be2","exd5","cxd5","Re8","Nd2","Na6"],
        moveExplanations: { "Nf6":"KID.","g6":"Fianchetto.","Bg7":"Bishop.","d6":"Solid.","O-O":"Castle.","c5":"Counter!","e6":"Attack d5.","Re8":"Pressure e4.","Na6":"Regroup." },
      },
    ],
  },
  {
    id: "nimzo-indian",
    title: "Nimzo-Indian Defense",
    badge: "Intermediate",
    category: "d4 Openings",
    description: "3...Bb4 — pin the knight and fight for the center dynamically.",
    duration: "2h 30m",
    free: false,
    lines: [
      {
        id: "nimzo-rubinstein",
        title: "Rubinstein Variation",
        playerColor: "black",
        explanation: "4.e3 — solid. Create pressure with c5 and the bishop pair.",
        moves: ["d4","Nf6","c4","e6","Nc3","Bb4","e3","O-O","Bd3","d5","Nf3","c5","O-O","Nc6","a3","Bxc3","bxc3","dxc4","Bxc4","Qc7"],
        moveExplanations: { "Nf6":"Develop.","e6":"Nimzo setup.","Bb4":"The Nimzo pin!","O-O":"Castle.","d5":"Center.","c5":"Attack d4.","Nc6":"Develop.","Bxc3":"Give the bishop pair.","dxc4":"Exchange.","Qc7":"Active." },
      },
      {
        id: "nimzo-classical",
        title: "Classical Variation",
        playerColor: "black",
        explanation: "4.Qc2 — White avoids the doubled pawns. Black plays d5.",
        moves: ["d4","Nf6","c4","e6","Nc3","Bb4","Qc2","d5","cxd5","Qxd5","Nf3","Qf5","Qxf5","exf5","a3","Be7","Bg5","Be6","e3","Nbd7"],
        moveExplanations: { "Nf6":"Develop.","e6":"Nimzo.","Bb4":"Pin.","d5":"Fight for center.","Qxd5":"Recapture.","Qf5":"Active.","exf5":"Recapture.","Be7":"Develop.","Be6":"Active bishop.","Nbd7":"Develop." },
      },
    ],
  },
  {
    id: "queens-indian",
    title: "Queen's Indian Defense",
    badge: "Intermediate",
    category: "d4 Openings",
    description: "3...b6 — fianchetto the queen's bishop and fight the center.",
    duration: "2h 00m",
    free: false,
    lines: [
      {
        id: "qid-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Fianchetto and fight for e4.",
        moves: ["d4","Nf6","c4","e6","Nf3","b6","g3","Bb7","Bg2","Be7","O-O","O-O","Nc3","Ne4","Qc2","Nxc3","Qxc3","d5","cxd5","exd5"],
        moveExplanations: { "Nf6":"Develop.","e6":"Solid.","b6":"QID setup.","Bb7":"Fianchetto.","Be7":"Prepare castle.","O-O":"Castle.","Ne4":"Active knight.","Nxc3":"Exchange.","d5":"Strike the center.","exd5":"Recapture." },
      },
    ],
  },
  {
    id: "grunfeld",
    title: "Grünfeld Defense",
    badge: "Advanced",
    category: "d4 Openings",
    description: "Give White the center, then attack it with every piece.",
    duration: "3h 00m",
    free: false,
    lines: [
      {
        id: "grunfeld-exchange",
        title: "Exchange Variation",
        playerColor: "black",
        explanation: "White builds a massive center — Black attacks it with c5 and Bg7.",
        moves: ["d4","Nf6","c4","g6","Nc3","d5","cxd5","Nxd5","e4","Nxc3","bxc3","Bg7","Bc4","c5","Ne2","Nc6","Be3","O-O","O-O","cxd4"],
        moveExplanations: { "Nf6":"Grünfeld setup.","g6":"Fianchetto.","d5":"Challenge immediately.","Nxd5":"Recapture.","Nxc3":"Take the knight.","Bg7":"The Grünfeld bishop — pressure d4.","c5":"Attack the center.","Nc6":"Develop.","O-O":"Castle.","cxd4":"Destroy the center." },
      },
    ],
  },
  {
    id: "dutch",
    title: "Dutch Defense",
    badge: "Intermediate",
    category: "d4 Openings",
    description: "1...f5 — fight for e4 and plan a kingside attack.",
    duration: "2h 00m",
    free: false,
    lines: [
      {
        id: "dutch-leningrad",
        title: "Leningrad Variation",
        playerColor: "black",
        explanation: "Fianchetto and build a kingside attack.",
        moves: ["d4","f5","c4","Nf6","g3","g6","Bg2","Bg7","Nf3","O-O","O-O","d6","Nc3","Qe8","d5","Na6","Nd4","Nc5"],
        moveExplanations: { "f5":"Dutch!","Nf6":"Develop.","g6":"Leningrad.","Bg7":"Fianchetto.","O-O":"Castle.","d6":"Solid.","Qe8":"Prepare e5.","Na6":"Develop.","Nc5":"Active." },
      },
      {
        id: "dutch-classical",
        title: "Classical Variation — Stonewall",
        playerColor: "black",
        explanation: "Build the Stonewall pawn structure — solid and attacking.",
        moves: ["d4","f5","c4","Nf6","g3","e6","Bg2","Be7","Nf3","O-O","O-O","d5","Nc3","c6","b3","Ne4","Bb2","Nd7","Qc2","Ndf6"],
        moveExplanations: { "f5":"Dutch.","Nf6":"Develop.","e6":"Stonewall setup.","Be7":"Prepare castle.","O-O":"Castle.","d5":"Complete the Stonewall.","c6":"Solid.","Ne4":"Strong outpost.","Nd7":"Regroup.","Ndf6":"Complete." },
      },
    ],
  },
  {
    id: "benoni",
    title: "Modern Benoni",
    badge: "Advanced",
    category: "d4 Openings",
    description: "1...c5 — counterattack the center and fight for active play.",
    duration: "2h 30m",
    free: false,
    lines: [
      {
        id: "benoni-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Dynamic counterplay with e6 and g6.",
        moves: ["d4","Nf6","c4","c5","d5","e6","Nc3","exd5","cxd5","d6","e4","g6","Nf3","Bg7","Be2","O-O","O-O","Re8","Nd2","Na6"],
        moveExplanations: { "Nf6":"Develop.","c5":"Benoni!","e6":"Challenge d5.","exd5":"Exchange.","d6":"Solid.","g6":"Fianchetto.","Bg7":"Powerful bishop.","O-O":"Castle.","Re8":"Pressure e4.","Na6":"Regroup to c7." },
      },
    ],
  },
  {
    id: "benko",
    title: "Benko Gambit",
    badge: "Advanced",
    category: "d4 Openings",
    description: "Sacrifice b5 and a6 pawns for long-term queenside pressure.",
    duration: "2h 00m",
    free: false,
    lines: [
      {
        id: "benko-main",
        title: "Main Line — Accepted",
        playerColor: "black",
        explanation: "Give two pawns for lasting queenside pressure.",
        moves: ["d4","Nf6","c4","c5","d5","b5","cxb5","a6","bxa6","Bxa6","Nc3","d6","Nf3","g6","g3","Bg7","Bg2","O-O","O-O","Nbd7"],
        moveExplanations: { "Nf6":"Develop.","c5":"Counter.","b5":"Benko Gambit!","a6":"Second pawn offer.","Bxa6":"Develop with tempo.","d6":"Solid.","g6":"Fianchetto.","Bg7":"Pressure a1-h8.","O-O":"Castle.","Nbd7":"Develop." },
      },
    ],
  },
  {
    id: "budapest",
    title: "Budapest Gambit",
    badge: "Intermediate",
    category: "d4 Openings",
    description: "1...Nf6 2...e5 — counterattack immediately and unbalance the game.",
    duration: "1h 30m",
    free: false,
    lines: [
      {
        id: "budapest-main",
        title: "Main Line — Fajarowicz",
        playerColor: "black",
        explanation: "Sacrifice a pawn for rapid development and piece activity.",
        moves: ["d4","Nf6","c4","e5","dxe5","Ne4","Nf3","Bb4+","Nbd2","Nc6","a3","Bxd2+","Bxd2","Nxd2","Qxd2","O-O"],
        moveExplanations: { "Nf6":"Develop.","e5":"Budapest!","Ne4":"Active knight.","Bb4+":"Check.","Nc6":"Develop.","Bxd2+":"Exchange.","Nxd2":"Take.","O-O":"Castle." },
      },
    ],
  },
  // ── FLANK OPENINGS ───────────────────────────────────────────────────────
  {
    id: "english",
    title: "English Opening",
    badge: "Intermediate",
    category: "Flank Openings",
    description: "1.c4 — control d5 and develop flexibly. Reversal of Sicilian ideas.",
    duration: "2h 30m",
    free: false,
    lines: [
      {
        id: "english-symmetrical",
        title: "Symmetrical Variation",
        playerColor: "black",
        explanation: "Mirror White's setup — solid and flexible.",
        moves: ["c4","c5","Nf3","Nf6","Nc3","Nc6","g3","g6","Bg2","Bg7","O-O","O-O","d4","cxd4","Nxd4","Nxd4","Qxd4","d6"],
        moveExplanations: { "c5":"Mirror!","Nf6":"Develop.","Nc6":"Develop.","g6":"Fianchetto.","Bg7":"Bishop.","O-O":"Castle.","cxd4":"Exchange.","Nxd4":"Take.","d6":"Solid." },
      },
      {
        id: "english-four-knights",
        title: "Four Knights Variation",
        playerColor: "black",
        explanation: "Develop all four knights — solid and classical.",
        moves: ["c4","e5","Nc3","Nf6","Nf3","Nc6","g3","d5","cxd5","Nxd5","Bg2","Nb6","O-O","Be7","d3","O-O","a3","Be6"],
        moveExplanations: { "e5":"Active.","Nf6":"Develop.","Nc6":"Four Knights.","d5":"Counter.","Nxd5":"Take.","Nb6":"Regroup.","Be7":"Develop.","O-O":"Castle.","Be6":"Active." },
      },
    ],
  },
  {
    id: "reti",
    title: "Réti Opening",
    badge: "Intermediate",
    category: "Flank Openings",
    description: "1.Nf3 — hypermodern, flexible, and transposes everywhere.",
    duration: "1h 45m",
    free: false,
    lines: [
      {
        id: "reti-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Set up a solid center and develop normally.",
        moves: ["Nf3","d5","g3","Nf6","Bg2","c6","O-O","Bg4","d3","Nbd7","Nbd2","e5","e4","dxe4","dxe4","Bc5"],
        moveExplanations: { "d5":"Claim the center.","Nf6":"Develop.","c6":"Solid.","Bg4":"Pin.","Nbd7":"Develop.","e5":"Counter.","dxe4":"Exchange.","Bc5":"Active bishop." },
      },
    ],
  },
  {
    id: "kings-indian-attack",
    title: "King's Indian Attack",
    badge: "Beginner",
    category: "Flank Openings",
    description: "Set up Nf3, g3, Bg2, d3, Nbd2 regardless of Black's moves.",
    duration: "1h 30m",
    free: false,
    lines: [
      {
        id: "kia-main",
        title: "vs French Setup",
        playerColor: "white",
        explanation: "You play White. Build the KIA setup and launch a kingside attack.",
        moves: ["e4","e6","d3","d5","Nd2","Nf6","Ngf3","c5","g3","Nc6","Bg2","Be7","O-O","O-O","Re1","b5","e5","Nd7"],
        moveExplanations: { "d3":"KIA structure.","Nd2":"Flexible development.","Ngf3":"Complete the setup.","g3":"Fianchetto.","Bg2":"The KIA bishop.","O-O":"Castle.","Re1":"Support e4.","e5":"Attack!" },
      },
    ],
  },
  {
    id: "catalan",
    title: "Catalan Opening",
    badge: "Intermediate",
    category: "Flank Openings",
    description: "Combine d4, c4, and g3 — long-term pressure on the queenside.",
    duration: "2h 00m",
    free: false,
    lines: [
      {
        id: "catalan-open",
        title: "Open Catalan",
        playerColor: "black",
        explanation: "Take on c4 and try to hold it while White develops.",
        moves: ["d4","Nf6","c4","e6","g3","d5","Bg2","dxc4","Nf3","Bd7","Qc2","Bc6","a4","Bb4+","Bd2","Bxd2+","Nfxd2","b5","axb5","Bxg2"],
        moveExplanations: { "Nf6":"Develop.","e6":"Solid.","d5":"Center.","dxc4":"Accept!","Bd7":"Develop.","Bc6":"Active.","Bb4+":"Check.","Bxd2+":"Exchange.","b5":"Hold the pawn.","Bxg2":"Take the bishop." },
      },
    ],
  },
  {
    id: "london",
    title: "London System",
    badge: "Beginner",
    category: "Flank Openings",
    description: "d4, Nf3, Bf4 — solid, simple, and hard to beat.",
    duration: "1h 30m",
    free: false,
    lines: [
      {
        id: "london-main",
        title: "Main Line",
        playerColor: "white",
        explanation: "You play White. Build the London setup — Bf4, e3, Bd3.",
        moves: ["d4","d5","Nf3","Nf6","Bf4","e6","e3","Bd6","Bg3","O-O","Bd3","c5","c3","Nc6","Nbd2","Re8"],
        moveExplanations: { "Nf3":"Develop.","Bf4":"London bishop!","e3":"Solid.","Bg3":"Retreat.","Bd3":"Develop.","c3":"Solid center.","Nbd2":"Flexible." },
      },
    ],
  },
  {
    id: "trompowsky",
    title: "Trompowsky Attack",
    badge: "Intermediate",
    category: "Flank Openings",
    description: "1.d4 Nf6 2.Bg5 — avoid main lines and create imbalances.",
    duration: "1h 30m",
    free: false,
    lines: [
      {
        id: "tromp-main",
        title: "Main Line — 2...Ne4",
        playerColor: "black",
        explanation: "Attack the bishop immediately.",
        moves: ["d4","Nf6","Bg5","Ne4","Bf4","c5","f3","Qa5+","c3","Nf6","d5","e6","e4","d6","Nd2","exd5","exd5","Be7"],
        moveExplanations: { "Nf6":"Normal.","Ne4":"Attack the bishop!","c5":"Counter.","Qa5+":"Check.","Nf6":"Develop.","e6":"Solid.","d6":"Center.","Be7":"Develop." },
      },
    ],
  },
  {
    id: "torre",
    title: "Torre Attack",
    badge: "Beginner",
    category: "Flank Openings",
    description: "1.d4 2.Nf3 3.Bg5 — simple development with early bishop activity.",
    duration: "1h 00m",
    free: false,
    lines: [
      {
        id: "torre-main",
        title: "Main Line",
        playerColor: "white",
        explanation: "You play White. Develop naturally and pressure the center.",
        moves: ["d4","Nf6","Nf3","e6","Bg5","h6","Bh4","c5","e3","Qb6","Qc1","Nc6","c3","g5","Bg3","Ne4"],
        moveExplanations: { "Nf3":"Develop.","Bg5":"Torre move!","Bh4":"Retreat.","e3":"Solid.","Qc1":"Defend b2.","c3":"Solid." },
      },
    ],
  },
  {
    id: "colle",
    title: "Colle System",
    badge: "Beginner",
    category: "Flank Openings",
    description: "d4, Nf3, e3, Bd3 — simple and solid for beginners.",
    duration: "1h 00m",
    free: false,
    lines: [
      {
        id: "colle-main",
        title: "Colle-Koltanowski",
        playerColor: "white",
        explanation: "Build the Colle setup and prepare e4.",
        moves: ["d4","d5","Nf3","Nf6","e3","e6","Bd3","c5","c3","Nc6","Nbd2","Bd6","O-O","O-O","dxc5","Bxc5","e4","Qc7"],
        moveExplanations: { "Nf3":"Develop.","e3":"Colle.","Bd3":"Develop.","c3":"Solid.","Nbd2":"Flexible.","O-O":"Castle.","dxc5":"Exchange.","e4":"Attack!" },
      },
    ],
  },
  {
    id: "bird",
    title: "Bird's Opening",
    badge: "Intermediate",
    category: "Flank Openings",
    description: "1.f4 — fight for e5 and prepare a kingside attack.",
    duration: "1h 30m",
    free: false,
    lines: [
      {
        id: "bird-main",
        title: "Main Line",
        playerColor: "white",
        explanation: "You play White. Develop and attack the kingside.",
        moves: ["f4","d5","Nf3","g6","e3","Bg7","Be2","Nf6","O-O","O-O","d3","c5","Qe1","Nc6","Qh4","d4"],
        moveExplanations: { "Nf3":"Develop.","e3":"Solid.","Be2":"Prepare castle.","O-O":"Castle.","d3":"Solid.","Qe1":"Queen to the kingside.","Qh4":"Attack!" },
      },
    ],
  },
  {
    id: "from-gambit",
    title: "From's Gambit (vs Bird)",
    badge: "Intermediate",
    category: "Flank Openings",
    description: "1.f4 e5 — counter the Bird with an immediate pawn sacrifice.",
    duration: "1h 00m",
    free: false,
    lines: [
      {
        id: "from-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Sacrifice e5 and attack immediately.",
        moves: ["f4","e5","fxe5","d6","exd6","Bxd6","Nf3","g5","d4","g4","Ne5","Nf6","Nc3","Nh5","Nd5","Qh4+","g3","Nxg3","hxg3","Qxg3+"],
        moveExplanations: { "e5":"From's Gambit!","d6":"Attack.","Bxd6":"Develop.","g5":"Aggressive.","g4":"Push.","Nf6":"Develop.","Nh5":"Attack g3.","Qh4+":"Check.","Nxg3":"Sack!","Qxg3+":"Check!" },
      },
    ],
  },
  {
    id: "sokolsky",
    title: "Sokolsky / Polish Opening",
    badge: "Beginner",
    category: "Flank Openings",
    description: "1.b4 — the Polish! Unusual and disorienting.",
    duration: "1h 00m",
    free: false,
    lines: [
      {
        id: "polish-main",
        title: "Main Line",
        playerColor: "white",
        explanation: "You play White with the unusual 1.b4.",
        moves: ["b4","e5","Bb2","Bxb4","Bxe5","Nf6","Nf3","O-O","e3","d5","c4","c6","Be2","Re8","Bg3","Bd6","Bxd6","Qxd6"],
        moveExplanations: { "Bb2":"Develop.","Bxe5":"Win the pawn back.","Nf3":"Develop.","e3":"Solid.","c4":"Center.","Be2":"Develop.","Bg3":"Regroup.","Bxd6":"Exchange." },
      },
    ],
  },
  {
    id: "kings-fianchetto",
    title: "King's Fianchetto",
    badge: "Beginner",
    category: "Flank Openings",
    description: "1.g3 — hypermodern and flexible.",
    duration: "1h 00m",
    free: false,
    lines: [
      {
        id: "kf-main",
        title: "Main Line",
        playerColor: "white",
        explanation: "Fianchetto and control the long diagonal.",
        moves: ["g3","d5","Bg2","e5","d3","Nf6","Nf3","Nc6","O-O","Be7","Nbd2","O-O","e4","dxe4","dxe4","Bg4"],
        moveExplanations: { "Bg2":"Fianchetto!","d3":"Solid.","Nf3":"Develop.","O-O":"Castle.","Nbd2":"Flexible.","e4":"Strike!" },
      },
    ],
  },
  // ── GAMBITS ──────────────────────────────────────────────────────────────
  {
    id: "smithmorra",
    title: "Smith-Morra Gambit",
    badge: "Intermediate",
    category: "Gambits",
    description: "vs Sicilian: sacrifice c3 for rapid development and open lines.",
    duration: "1h 30m",
    free: false,
    lines: [
      {
        id: "morra-accepted",
        title: "Accepted — Main Line",
        playerColor: "black",
        explanation: "Accept the pawn and try to hold it.",
        moves: ["e4","c5","d4","cxd4","c3","dxc3","Nxc3","Nc6","Nf3","d6","Bc4","e6","O-O","Nf6","Qe2","Be7","Rd1","e5"],
        moveExplanations: { "c5":"Sicilian.","cxd4":"Exchange.","dxc3":"Accept!","Nc6":"Develop.","d6":"Solid.","e6":"Solid.","Nf6":"Develop.","Be7":"Develop.","e5":"Hold the center." },
      },
      {
        id: "morra-declined",
        title: "Declined — 3...Nf6",
        playerColor: "black",
        explanation: "Decline with Nf6 and play a reversed Alapin.",
        moves: ["e4","c5","d4","cxd4","c3","Nf6","e5","Nd5","cxd4","d6","Nf3","Nc6","Bc4","Nb6","Bb3","dxe5","dxe5","Be6"],
        moveExplanations: { "c5":"Sicilian.","cxd4":"Exchange.","Nf6":"Decline!","Nd5":"Retreat.","d6":"Attack e5.","Nc6":"Develop.","Nb6":"Regroup.","dxe5":"Take.","Be6":"Develop." },
      },
    ],
  },
  {
    id: "danish-gambit",
    title: "Danish Gambit",
    badge: "Intermediate",
    category: "Gambits",
    description: "Sacrifice two pawns for devastating development — wild and fun.",
    duration: "1h 00m",
    free: false,
    lines: [
      {
        id: "danish-main",
        title: "Main Line — Accepted",
        playerColor: "black",
        explanation: "Accept both pawns and try to survive the attack.",
        moves: ["e4","e5","d4","exd4","c3","dxc3","Bc4","cxb2","Bxb2","d5","Bxd5","Nf6","Bxf7+","Kxf7","Qxd8","Bb4+","Qd2","Bxd2+","Nxd2","Ke8"],
        moveExplanations: { "e5":"Center.","exd4":"Take.","dxc3":"Take again!","cxb2":"Take the second pawn.","d5":"Counter.","Nf6":"Develop.","Kxf7":"Must take.","Bb4+":"Check.","Bxd2+":"Exchange.","Ke8":"King retreats." },
      },
    ],
  },
  {
    id: "halloween-gambit",
    title: "Halloween Gambit",
    badge: "Advanced",
    category: "Gambits",
    description: "Sacrifice a knight on move 4 for a wild attack — tricky and dangerous.",
    duration: "1h 00m",
    free: false,
    lines: [
      {
        id: "halloween-main",
        title: "Main Line",
        playerColor: "white",
        explanation: "You play White. Sacrifice the knight and go for the king.",
        moves: ["e4","e5","Nf3","Nc6","Nc3","Nf6","Nxe5","Nxe5","d4","Nc6","d5","Ne5","f4","Ng6","e5","Ng8","d6","cxd6","exd6","Qb6"],
        moveExplanations: { "Nxe5":"The Halloween Gambit!","d4":"Massive center.","d5":"Push forward.","f4":"More space.","e5":"Keep attacking.","d6":"Destroy the structure." },
      },
    ],
  },
  {
    id: "blackmar-diemer",
    title: "Blackmar-Diemer Gambit",
    badge: "Intermediate",
    category: "Gambits",
    description: "1.d4 d5 2.e4 — sacrifice for a lead in development.",
    duration: "1h 15m",
    free: false,
    lines: [
      {
        id: "bdg-main",
        title: "Main Line — Euwe Variation",
        playerColor: "white",
        explanation: "You play White. Open lines and attack the king.",
        moves: ["d4","d5","e4","dxe4","Nc3","Nf6","f3","exf3","Nxf3","e6","Bg5","Be7","Bd3","O-O","O-O","Nbd7","Qe1","c5","Qh4","h6"],
        moveExplanations: { "e4":"Gambit!","Nc3":"Develop.","f3":"Gambit the second pawn.","Nxf3":"Develop.","Bg5":"Pin.","Bd3":"Develop.","O-O":"Castle.","Qe1":"Prepare Qh4.","Qh4":"Attack!" },
      },
    ],
  },
  {
    id: "albin-counter",
    title: "Albin Counter-Gambit",
    badge: "Intermediate",
    category: "Gambits",
    description: "vs QGD: 2...e5 — counter-gambit for sharp play.",
    duration: "1h 00m",
    free: false,
    lines: [
      {
        id: "albin-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Sacrifice a pawn for active counterplay.",
        moves: ["d4","d5","c4","e5","dxe5","d4","Nf3","Nc6","g3","Bg4","Bg2","Qd7","O-O","O-O-O","Nbd2","Bh3","Ne4","Bxg2","Kxg2","f5"],
        moveExplanations: { "d5":"Center.","e5":"Albin Counter-Gambit!","d4":"Passed pawn.","Nc6":"Develop.","Bg4":"Pin.","Qd7":"Prepare castle queenside.","O-O-O":"Castle queenside.","Bh3":"Attack the bishop.","f5":"Kingside attack." },
      },
    ],
  },
  {
    id: "staunton-gambit",
    title: "Staunton Gambit (vs Dutch)",
    badge: "Intermediate",
    category: "Gambits",
    description: "2.e4 against the Dutch — sacrifice for rapid development.",
    duration: "1h 00m",
    free: false,
    lines: [
      {
        id: "staunton-main",
        title: "Main Line",
        playerColor: "white",
        explanation: "You play White. Sacrifice e4 for quick development.",
        moves: ["d4","f5","e4","fxe4","Nc3","Nf6","Bg5","d5","f3","exf3","Nxf3","e6","Bd3","Be7","O-O","O-O","Ne5","c6"],
        moveExplanations: { "e4":"Staunton Gambit!","Nc3":"Develop.","Bg5":"Pin.","f3":"Open lines.","Nxf3":"Develop.","Bd3":"Develop.","O-O":"Castle.","Ne5":"Active knight." },
      },
    ],
  },
  // ── TACTICAL OPENINGS ────────────────────────────────────────────────────
  {
    id: "scholars-mate",
    title: "Scholar's Mate (Defense)",
    badge: "Beginner",
    category: "Tactics",
    description: "Learn to defend against the Scholar's Mate and punish it.",
    duration: "30m",
    free: true,
    lines: [
      {
        id: "scholars-defense",
        title: "Defending Scholar's Mate",
        playerColor: "black",
        explanation: "White tries the 4-move checkmate. Defend and punish it.",
        moves: ["e4","e5","Bc4","Nc6","Qh5","g6","Qf3","Nf6","Qb3","Nd4","Qxb7","Rb8","Qa6","Nc2+","Ke2","Nd4+","Kd1","Nc2"],
        moveExplanations: { "e5":"Center.","Nc6":"Defend e5 and develop.","g6":"Block the queen — don't play Nf6 yet.","Nf6":"Now develop — the queen has nowhere to go.","Nd4":"Attack the queen!","Rb8":"Trap the queen.","Nc2+":"Fork!","Nd4+":"Check.","Nc2":"Winning." },
      },
    ],
  },
  {
    id: "legal-trap",
    title: "Légal Trap",
    badge: "Beginner",
    category: "Tactics",
    description: "Sacrifice the queen to deliver checkmate — a classic trap.",
    duration: "30m",
    free: true,
    lines: [
      {
        id: "legal-main",
        title: "Main Line",
        playerColor: "white",
        explanation: "You play White. Set the trap and deliver the queen sacrifice.",
        moves: ["e4","e5","Nf3","Nc6","Bc4","d6","Nc3","Bg4","Nxe5","Bxd1","Bxf7+","Ke7","Nd5"],
        moveExplanations: { "Nf3":"Develop.","Bc4":"Italian.","Nc3":"Develop.","Nxe5":"The Légal sacrifice!","Bxf7+":"Check!","Nd5":"Checkmate — Qd5 is coming!" },
      },
    ],
  },
  {
    id: "elephants-trap",
    title: "Elephant Trap",
    badge: "Beginner",
    category: "Tactics",
    description: "Win the queen in the QGD with a sneaky bishop trap.",
    duration: "30m",
    free: true,
    lines: [
      {
        id: "elephant-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Lure White's queen to a5, then trap it.",
        moves: ["d4","d5","c4","e6","Nc3","Nf6","Bg5","Nbd7","cxd5","exd5","Nxd5","Nxd5","Bxd8","Bb4+","Qd2","Bxd2+","Kxd2","Kxd8"],
        moveExplanations: { "d5":"Center.","e6":"Solid.","Nf6":"Develop.","Nbd7":"Elephant Trap setup.","exd5":"Exchange.","Nxd5":"Take.","Bb4+":"Check — the trap is sprung!","Bxd2+":"Take the queen!","Kxd2":"King recaptures.","Kxd8":"Black wins!" },
      },
    ],
  },
  {
    id: "fishing-pole",
    title: "Fishing Pole Trap",
    badge: "Intermediate",
    category: "Tactics",
    description: "Sacrifice pieces for a deadly attack on the king.",
    duration: "45m",
    free: false,
    lines: [
      {
        id: "fishing-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Sacrifice the knight and go for the king.",
        moves: ["e4","e5","Nf3","Nc6","Bb5","Nf6","O-O","Ng4","h3","h5","hxg4","hxg4","Ne1","Qh4","f4","g3","Ng2","Qh1+","Kf2","g2"],
        moveExplanations: { "e5":"Center.","Nc6":"Develop.","Nf6":"Berlin.","Ng4":"Fishing pole!","h5":"Push — attack!","hxg4":"Accept.","Qh4":"Attack.","g3":"Push.","Qh1+":"Check!","g2":"Promote threat." },
      },
    ],
  },
  {
    id: "mortimer-trap",
    title: "Mortimer Trap",
    badge: "Intermediate",
    category: "Tactics",
    description: "In the Ruy Lopez, lure White into a knight fork.",
    duration: "30m",
    free: false,
    lines: [
      {
        id: "mortimer-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Play Ne7 to lure White, then fork.",
        moves: ["e4","e5","Nf3","Nc6","Bb5","Ne7","Nxe5","c6","Nxf7","Rxf7","Bxc6","dxc6","O-O","Ng6"],
        moveExplanations: { "e5":"Center.","Nc6":"Develop.","Ne7":"The Mortimer Trap move!","c6":"Attack.","dxc6":"Take.","Rxf7":"Take.","Ng6":"Fork!" },
      },
    ],
  },
  {
    id: "noah-ark-trap",
    title: "Noah's Ark Trap",
    badge: "Intermediate",
    category: "Tactics",
    description: "In the Ruy Lopez, trap White's bishop with c5-b5.",
    duration: "30m",
    free: false,
    lines: [
      {
        id: "noah-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Lure the bishop to c4, then trap it with pawns.",
        moves: ["e4","e5","Nf3","Nc6","Bb5","a6","Ba4","d6","d4","b5","Bb3","Nxd4","Nxd4","exd4","Qxd4","c5","Qd5","Be6","Qc6+","Bd7","Qd5","c4"],
        moveExplanations: { "e5":"Center.","Nc6":"Develop.","a6":"Morphy.","d6":"Solid.","b5":"Drive the bishop.","Nxd4":"Exchange.","c5":"Noah's Ark — trap the bishop!","Be6":"Develop.","Bd7":"Defend.","c4":"The bishop is trapped!" },
      },
    ],
  },
  // ── ENDGAMES ─────────────────────────────────────────────────────────────
  {
    id: "endgame-basics",
    title: "Essential Endgames",
    badge: "Beginner",
    category: "Endgames",
    description: "The building blocks every chess player must know.",
    duration: "3h 00m",
    free: false,
    lines: [
      {
        id: "kg-pawn-opp",
        title: "King & Pawn — Opposition",
        playerColor: "white",
        explanation: "Learn to use the opposition to promote your pawn.",
        moves: ["e4","Kd6","Ke3","Ke6","Kf4","Kf6","e5+","Ke6","Ke4","Ke7","Kd5","Kd7","e6+","Ke7","Ke5","Ke8","Kd6","Kd8","e7+","Ke8"],
        moveExplanations: { "Ke3":"King forward!","Ke6":"Opposition.","Kf4":"Step sideways.","Kf6":"Mirror.","e5+":"Advance.","Ke4":"Take opposition.","Kd5":"Forward.","e6+":"Advance.","Ke5":"Close in.","Kd6":"Key square!","e7+":"Almost there.","Ke8":"Forced." },
      },
      {
        id: "rook-king-mate",
        title: "Rook & King vs King",
        playerColor: "white",
        explanation: "Force checkmate with rook and king — essential technique.",
        moves: ["Rd8+","Ke7","Rh8","Kd6","Kd4","Kc6","Kc4","Kb6","Kb4","Ka6","Ka4","Kb6","Rh6+","Kc5","Ka5","Kd4","Rh4+","Ke3","Ka4","Kf3"],
        moveExplanations: { "Rd8+":"Cut the king.","Rh8":"Control the h-file.","Kd4":"King forward.","Kc4":"Step closer.","Kb4":"Closer.","Ka4":"Corner the king.","Rh6+":"Check.","Ka5":"Box the king.","Rh4+":"Check again.","Ka4":"Corner!" },
      },
    ],
  },
  {
    id: "pawn-endgames",
    title: "Pawn Endgames",
    badge: "Beginner",
    category: "Endgames",
    description: "Master pawn endgame concepts — triangulation, zugzwang, passed pawns.",
    duration: "2h 00m",
    free: false,
    lines: [
      {
        id: "pawn-breakthrough",
        title: "Pawn Breakthrough",
        playerColor: "white",
        explanation: "Sacrifice pawns to create a passed pawn that promotes.",
        moves: ["b5","axb5","a5","bxa5","c5","b4","c6","b3","c7","b2","c8=Q","b1=Q","Qc6+","Ka7","Qb7"],
        moveExplanations: { "b5":"Breakthrough!","a5":"Second pawn.","c5":"Third pawn.","b4":"Push.","c6":"Advance.","b3":"Push.","c7":"Almost!","b2":"Racing.","c8=Q":"Queen!","b1=Q":"Queen too!","Qc6+":"Check.","Qb7":"Mate!" },
      },
    ],
  },
  {
    id: "rook-endgames",
    title: "Rook Endgames",
    badge: "Intermediate",
    category: "Endgames",
    description: "Philidor and Lucena positions — the two most important rook endings.",
    duration: "2h 00m",
    free: false,
    lines: [
      {
        id: "lucena-position",
        title: "Lucena Position — Winning",
        playerColor: "white",
        explanation: "Build a bridge with the rook to shelter the king and promote.",
        moves: ["Rd1+","Ke7","Rd4","Ke8","Kc7","Ke7","Re4+","Kf6","Re6+","Kf5","Re5+","Kf4","Re4+","Kf3","Rf4+","Ke3","Rf8","Kd3"],
        moveExplanations: { "Rd1+":"Drive the king away.","Rd4":"The key — prepare to build the bridge.","Ke8":"Forced.","Kc7":"King advances.","Re4+":"Check.","Re6+":"Check.","Re5+":"Check.","Re4+":"Last check.","Rf4+":"The bridge!","Rf8":"Promote!" },
      },
    ],
  },
  // ── SPECIAL OPENINGS ────────────────────────────────────────────────────
  {
    id: "hippo",
    title: "Hippopotamus Defense",
    badge: "Intermediate",
    category: "Special",
    description: "Develop all pieces behind pawns, then strike — unorthodox but solid.",
    duration: "1h 30m",
    free: false,
    lines: [
      {
        id: "hippo-main",
        title: "Main Setup",
        playerColor: "black",
        explanation: "Build the Hippo — all pieces behind pawns, then counterattack.",
        moves: ["e4","e6","d4","d6","Nf3","Ne7","Nc3","g6","Be3","Bg7","Qd2","b6","O-O-O","Bb7","Kb1","Nd7","h4","h6"],
        moveExplanations: { "e6":"Hippo.","d6":"Hippo.","Ne7":"Hippo.","g6":"Hippo.","Bg7":"Hippo.","b6":"Hippo.","Bb7":"All pieces behind pawns.","Nd7":"Complete the setup.","h6":"Prevent h5." },
      },
    ],
  },
  {
    id: "nimzowitsch",
    title: "Nimzowitsch Defense",
    badge: "Intermediate",
    category: "Special",
    description: "1.e4 Nc6 — hypermodern defense, control e4 with pieces not pawns.",
    duration: "1h 15m",
    free: false,
    lines: [
      {
        id: "nimzo-def-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Control e4 from a distance — hypermodern style.",
        moves: ["e4","Nc6","d4","d5","e5","f6","f4","fxe5","fxe5","e6","Nf3","Nge7","Bb5","Bd7","Bxc6","Bxc6","O-O","Nf5"],
        moveExplanations: { "Nc6":"Nimzowitsch!","d5":"Counter.","f6":"Attack e5.","fxe5":"Exchange.","e6":"Solid.","Nge7":"Develop.","Bd7":"Develop.","Bxc6":"Exchange.","Nf5":"Active knight." },
      },
    ],
  },
  {
    id: "larsen",
    title: "Larsen's Opening",
    badge: "Intermediate",
    category: "Special",
    description: "1.b3 — fianchetto the queen's bishop and control the long diagonal.",
    duration: "1h 00m",
    free: false,
    lines: [
      {
        id: "larsen-main",
        title: "Main Line",
        playerColor: "white",
        explanation: "Control the a8-h1 diagonal and develop flexibly.",
        moves: ["b3","e5","Bb2","Nc6","c4","Nf6","Nf3","e4","Nd4","Bc5","Nxc6","dxc6","e3","Bf5","Qc2","Qe7","Be2","O-O-O"],
        moveExplanations: { "Bb2":"The long diagonal!","c4":"Control d5.","Nf3":"Develop.","Nd4":"Central knight.","Nxc6":"Exchange.","e3":"Solid.","Qc2":"Develop.","Be2":"Prepare castle." },
      },
    ],
  },
  {
    id: "st-george",
    title: "St. George Defense",
    badge: "Beginner",
    category: "Special",
    description: "1.e4 a6 — sidestep all theory and play your own game.",
    duration: "45m",
    free: false,
    lines: [
      {
        id: "st-george-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Unusual but playable — prepare b5 and fianchetto.",
        moves: ["e4","a6","d4","b5","Nf3","Bb7","Bd3","e6","O-O","Nf6","Re1","c5","c3","Nc6","Nbd2","Be7","e5","Nd5"],
        moveExplanations: { "a6":"St. George!","b5":"Queenside expansion.","Bb7":"Fianchetto!","e6":"Solid.","Nf6":"Develop.","c5":"Counter.","Nc6":"Develop.","Be7":"Develop.","Nd5":"Central knight." },
      },
    ],
  },
  {
    id: "grob",
    title: "Grob Attack",
    badge: "Beginner",
    category: "Special",
    description: "1.g4 — the Grob! Unusual, tricky, and hard to prepare for.",
    duration: "45m",
    free: false,
    lines: [
      {
        id: "grob-main",
        title: "Main Line",
        playerColor: "white",
        explanation: "Play 1.g4 and hope Black doesn't know the refutation!",
        moves: ["g4","d5","Bg2","Bxg4","c4","c6","cxd5","cxd5","Qb3","Bf3","Bxf3","Nf6","d4","e6","Nc3","Bb4","Bg5","O-O"],
        moveExplanations: { "Bg2":"Fianchetto.","cxd5":"Exchange.","Qb3":"Attack b7 and d5.","Bxf3":"Take.","d4":"Center.","Nc3":"Develop.","Bg5":"Pin." },
      },
    ],
  },
  {
    id: "accelerated-dragon",
    title: "Accelerated Dragon",
    badge: "Intermediate",
    category: "e4 Openings",
    description: "Sicilian with g6 before d6 — faster fianchetto.",
    duration: "2h 00m",
    free: false,
    lines: [
      {
        id: "acc-dragon-main",
        title: "Main Line — Maroczy Bind",
        playerColor: "black",
        explanation: "Fianchetto early and fight for the d4 square.",
        moves: ["e4","c5","Nf3","Nc6","d4","cxd4","Nxd4","g6","c4","Nf6","Nc3","d6","Be2","Nxd4","Qxd4","Bg7","Be3","O-O","Qd2","Be6"],
        moveExplanations: { "c5":"Sicilian.","Nc6":"Develop.","cxd4":"Exchange.","g6":"Accelerated Dragon!","Nf6":"Develop.","d6":"Solid.","Nxd4":"Exchange.","Bg7":"The Dragon bishop.","O-O":"Castle.","Be6":"Active." },
      },
    ],
  },
  {
    id: "grand-prix",
    title: "Grand Prix Attack (vs Sicilian)",
    badge: "Intermediate",
    category: "e4 Openings",
    description: "f4 against the Sicilian — simple, aggressive, and effective.",
    duration: "1h 30m",
    free: false,
    lines: [
      {
        id: "gpa-main",
        title: "Main Line",
        playerColor: "white",
        explanation: "You play White. Attack on the kingside with f4-f5.",
        moves: ["e4","c5","Nc3","Nc6","f4","g6","Nf3","Bg7","Bc4","e6","f5","exf5","exf5","d5","fxg6","dxc4","gxf7+","Kxf7","Ng5+","Ke8"],
        moveExplanations: { "Nc3":"Develop.","f4":"Grand Prix!","Nf3":"Develop.","Bc4":"Attack f7.","f5":"Attack!","fxg6":"Exchange.","gxf7+":"Sack!","Ng5+":"Check." },
      },
    ],
  },
  {
    id: "alapin",
    title: "Alapin Variation (vs Sicilian)",
    badge: "Intermediate",
    category: "e4 Openings",
    description: "2.c3 against the Sicilian — solid and leads to positional play.",
    duration: "1h 30m",
    free: false,
    lines: [
      {
        id: "alapin-main",
        title: "Main Line — 2...Nf6",
        playerColor: "black",
        explanation: "Attack e4 immediately and fight for the center.",
        moves: ["e4","c5","c3","Nf6","e5","Nd5","d4","cxd4","cxd4","d6","Nf3","Nc6","Bc4","Nb6","Bb3","dxe5","dxe5","Be6"],
        moveExplanations: { "c5":"Sicilian.","Nf6":"Attack e4!","Nd5":"Retreat.","cxd4":"Exchange.","d6":"Attack e5.","Nc6":"Develop.","Nb6":"Regroup.","dxe5":"Take.","Be6":"Develop." },
      },
      {
        id: "alapin-d5",
        title: "Variation — 2...d5",
        playerColor: "black",
        explanation: "Counter in the center immediately.",
        moves: ["e4","c5","c3","d5","exd5","Qxd5","d4","Nc6","Nf3","Bg4","Be2","cxd4","cxd4","e6","Nc3","Qa5","d5","exd5","Nxd5","O-O-O"],
        moveExplanations: { "c5":"Sicilian.","d5":"Counter!","Qxd5":"Recapture.","Nc6":"Develop.","Bg4":"Pin.","cxd4":"Exchange.","e6":"Solid.","Qa5":"Active.","O-O-O":"Castle queenside." },
      },
    ],
  },
  {
    id: "closed-sicilian",
    title: "Closed Sicilian",
    badge: "Beginner",
    category: "e4 Openings",
    description: "2.Nc3 and 3.g3 — avoid Sicilian theory and build slowly.",
    duration: "1h 30m",
    free: false,
    lines: [
      {
        id: "closed-sic-main",
        title: "Main Line",
        playerColor: "white",
        explanation: "You play White. Build a kingside attack with g3 and f4.",
        moves: ["e4","c5","Nc3","Nc6","g3","g6","Bg2","Bg7","d3","d6","f4","e6","Nf3","Nge7","O-O","O-O","Be3","Nd4","Nxd4","cxd4"],
        moveExplanations: { "Nc3":"Closed Sicilian.","g3":"Fianchetto setup.","Bg2":"Bishop.","d3":"Solid.","f4":"Kingside attack.","Nf3":"Develop.","O-O":"Castle.","Be3":"Develop.","Nxd4":"Exchange." },
      },
    ],
  },
  {
    id: "polish-defense",
    title: "Polish Defense (Black)",
    badge: "Beginner",
    category: "Special",
    description: "1.d4 b5 — immediate queenside expansion as Black.",
    duration: "45m",
    free: false,
    lines: [
      {
        id: "polish-def-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Expand on the queenside immediately.",
        moves: ["d4","b5","e4","Bb7","Bd3","e6","Nf3","Nf6","O-O","c5","c3","Be7","Re1","O-O","Nbd2","d6","e5","Nfd7"],
        moveExplanations: { "b5":"Polish!","Bb7":"Fianchetto.","e6":"Solid.","Nf6":"Develop.","c5":"Counter.","Be7":"Develop.","O-O":"Castle.","d6":"Solid.","Nfd7":"Prepare f6." },
      },
    ],
  },
  {
    id: "kings-gambit-white",
    title: "King's Gambit (Playing White)",
    badge: "Intermediate",
    category: "Gambits",
    description: "Learn to attack with the King's Gambit as White.",
    duration: "2h 00m",
    free: false,
    lines: [
      {
        id: "kg-muzio",
        title: "Muzio Gambit",
        playerColor: "white",
        explanation: "Sacrifice the knight on f3 for a devastating attack.",
        moves: ["e4","e5","f4","exf4","Nf3","g5","Bc4","g4","O-O","gxf3","Qxf3","Qf6","e5","Qxe5","Bxf7+","Kxf7","d4","Qxd4+","Be3","Qf6","Nc3","Ne7","Nd5","Nxd5","Qxd5+","Ke8"],
        moveExplanations: { "f4":"King's Gambit.","Bc4":"Muzio setup.","O-O":"Sacrifice the knight!","Qxf3":"Take the pawn.","e5":"Open.","Bxf7+":"Sack on f7!","d4":"Open more lines.","Be3":"Develop.","Nc3":"Develop.","Nd5":"Attack." },
      },
    ],
  },
  {
    id: "botvinnik-english",
    title: "Botvinnik System (English)",
    badge: "Advanced",
    category: "Flank Openings",
    description: "c4, g3, Bg2, Nc3, e4 — powerful pawn center in the English.",
    duration: "2h 00m",
    free: false,
    lines: [
      {
        id: "botvinnik-main",
        title: "Main Line",
        playerColor: "white",
        explanation: "Build the Botvinnik center — c4, d3, e4, g3.",
        moves: ["c4","Nf6","Nc3","c5","g3","d5","cxd5","Nxd5","Bg2","Nc7","Qb3","Nc6","d3","e5","Nf3","Be7","O-O","O-O","Nd2","Nd4"],
        moveExplanations: { "Nc3":"Botvinnik.","g3":"Fianchetto.","Bg2":"Bishop.","cxd5":"Exchange.","Qb3":"Attack.","d3":"Solid.","Nf3":"Develop.","O-O":"Castle.","Nd2":"Regroup." },
      },
    ],
  },
  {
    id: "modern-defense",
    title: "Modern Defense",
    badge: "Intermediate",
    category: "Special",
    description: "1...g6 — fianchetto and let White overextend.",
    duration: "1h 30m",
    free: false,
    lines: [
      {
        id: "modern-main",
        title: "Main Line vs e4",
        playerColor: "black",
        explanation: "Hypermodern — let White take the center, then attack it.",
        moves: ["e4","g6","d4","Bg7","Nc3","d6","f4","Nc6","Nf3","Bg4","Be3","e5","dxe5","dxe5","Qxd8+","Rxd8","fxe5","Nxe5","Nxe5","Bxe5"],
        moveExplanations: { "g6":"Modern!","Bg7":"The Modern bishop.","d6":"Solid.","Nc6":"Develop.","Bg4":"Pin.","e5":"Strike!","dxe5":"Exchange.","Rxd8":"Take.","Nxe5":"Win material." },
      },
    ],
  },
  {
    id: "robatsch",
    title: "Robatsch / Modern (vs d4)",
    badge: "Intermediate",
    category: "Special",
    description: "1.d4 g6 — fianchetto against d4 openings.",
    duration: "1h 15m",
    free: false,
    lines: [
      {
        id: "robatsch-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Fianchetto and play for e5 or c5.",
        moves: ["d4","g6","c4","Bg7","e4","d6","Nc3","Nc6","Be3","e5","dxe5","dxe5","Qxd8+","Nxd8","Nd5","c6","Nc3","Ne6","Nf3","Nf4"],
        moveExplanations: { "g6":"Robatsch.","Bg7":"Fianchetto.","d6":"Solid.","Nc6":"Develop.","e5":"Strike!","dxe5":"Exchange.","Nxd8":"Take.","c6":"Center.","Ne6":"Develop.","Nf4":"Active." },
      },
    ],
  },
  {
    id: "kings-gambit-defence-var",
    title: "Falkbeer Counter-Gambit",
    badge: "Intermediate",
    category: "Gambits",
    description: "vs King's Gambit: 2...d5 — counterattack immediately.",
    duration: "1h 00m",
    free: false,
    lines: [
      {
        id: "falkbeer-main",
        title: "Nimzowitsch Variation",
        playerColor: "black",
        explanation: "Counterattack the center with d5.",
        moves: ["e4","e5","f4","d5","exd5","c6","Nc3","exf4","Nf3","Bd6","d4","Ne7","Bxf4","Bxf4","Qxf4","O-O","Bc4","dxc5","O-O","Nd5"],
        moveExplanations: { "e5":"Center.","d5":"Falkbeer!","c6":"Support.","exf4":"Take.","Bd6":"Develop.","Ne7":"Develop.","Bxf4":"Exchange.","O-O":"Castle.","dxc5":"Take.","Nd5":"Central knight." },
      },
    ],
  },
  {
    id: "latvian",
    title: "Latvian Gambit",
    badge: "Advanced",
    category: "Gambits",
    description: "1.e4 e5 2.Nf3 f5 — wild and dangerous for both sides.",
    duration: "1h 00m",
    free: false,
    lines: [
      {
        id: "latvian-main",
        title: "Main Line",
        playerColor: "black",
        explanation: "Sacrifice f5 for a wild attacking game.",
        moves: ["e4","e5","Nf3","f5","Nxe5","Qf6","d4","d6","Nc4","fxe4","Nc3","Qf7","d5","Be7","Be3","Nf6","Be2","O-O"],
        moveExplanations: { "e5":"Center.","f5":"Latvian Gambit!","Qf6":"Attack.","d6":"Develop.","fxe4":"Take.","Qf7":"Regroup.","Be7":"Develop.","Nf6":"Develop.","O-O":"Castle." },
      },
    ],
  },
];

const BADGE_COLORS = {
  Beginner:     { bg: "#EAF3DE", color: "#3B6D11" },
  Intermediate: { bg: "#FAEEDA", color: "#854F0B" },
  Advanced:     { bg: "#FCEBEB", color: "#A32D2D" },
};

const CATEGORIES = ["All", "e4 Openings", "d4 Openings", "Flank Openings", "Gambits", "Tactics", "Endgames", "Special"];

export default function ChessApp() {
  const [view, setView]                     = useState("home");
  const [activeCourse, setActiveCourse]     = useState(null);
  const [activeLine, setActiveLine]         = useState(null);
  const [completedLines, setCompletedLines] = useState({});
  const [showUpgrade, setShowUpgrade]       = useState(false);

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
    <div style={{ fontFamily:"'Georgia', serif", background:"#0d0d0d", minHeight:"100vh", color:"#e8e0d0" }}>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 28px", borderBottom:"1px solid #222", background:"#0d0d0d", position:"sticky", top:0, zIndex:10 }}>
        <div onClick={() => setView("home")} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
          <span style={{ fontSize:22 }}>♟</span>
          <span style={{ fontSize:17, fontWeight:700, letterSpacing:"0.04em", color:"#e8e0d0" }}>ChessPath</span>
        </div>
        <div style={{ display:"flex", gap:28 }}>
          {["home","courses"].map(v => (
            <span key={v} onClick={() => setView(v)} style={{ fontSize:14, cursor:"pointer", color:view===v?"#c9a84c":"#888", fontFamily:"system-ui", textTransform:"capitalize" }}>{v}</span>
          ))}
        </div>
        <button onClick={() => setShowUpgrade(true)} style={{ background:"#c9a84c", color:"#0d0d0d", border:"none", borderRadius:6, padding:"8px 16px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"system-ui" }}>Go Pro</button>
      </nav>

      {view === "home"    && <HomeView courses={COURSES} onOpenLine={openLine} onUpgrade={() => setShowUpgrade(true)} />}
      {view === "courses" && <CoursesView courses={COURSES} onOpenLine={openLine} completedLines={completedLines} />}
      {view === "trainer" && activeCourse && activeLine && (
        <MoveTrainer
          course={activeCourse}
          line={activeLine}
          onBack={() => setView("courses")}
          onComplete={() => markComplete(activeCourse.id, activeLine.id)}
          completedLines={completedLines}
          onSelectLine={setActiveLine}
        />
      )}
    </div>
  );
}

function MoveTrainer({ course, line, onBack, onComplete, completedLines, onSelectLine }) {
  const [game, setGame]                   = useState(new Chess());
  const [moveIndex, setMoveIndex]         = useState(0);
  const [status, setStatus]               = useState("idle");
  const [wrongSquares, setWrongSquares]   = useState(null);
  const [lastCorrectFen, setLastCorrectFen] = useState(new Chess().fen());

  const playerColor = line.playerColor;
  const moves       = line.moves;

  const isPlayerTurn = useCallback((idx) => {
    if (playerColor === "black") return idx % 2 === 1;
    return idx % 2 === 0;
  }, [playerColor]);

  const getHint = () => {
    if (moveIndex >= moves.length) return null;
    const exp  = moves[moveIndex];
    const expl = line.moveExplanations?.[exp];
    return expl ? `Play ${exp} — ${expl}` : `Play ${exp}`;
  };

  const playComputerMove = useCallback((currentGame, idx) => {
    if (idx >= moves.length || isPlayerTurn(idx)) return;
    setTimeout(() => {
      const g = new Chess(currentGame.fen());
      try {
        g.move(moves[idx]);
        setLastCorrectFen(g.fen());
        setGame(g);
        const next = idx + 1;
        setMoveIndex(next);
        if (next >= moves.length) { setStatus("complete"); onComplete(); }
        else { setStatus("idle"); if (!isPlayerTurn(next)) playComputerMove(g, next); }
      } catch(e) { console.error(e); }
    }, 600);
  }, [moves, isPlayerTurn, onComplete]);

  useEffect(() => {
    const g = new Chess();
    setGame(g); setMoveIndex(0); setStatus("idle");
    setLastCorrectFen(g.fen()); setWrongSquares(null);
    if (!isPlayerTurn(0)) playComputerMove(g, 0);
  }, [line]);

  function onPieceDrop(src, tgt) {
    if (status === "complete" || moveIndex >= moves.length || !isPlayerTurn(moveIndex)) return false;
    const g = new Chess(game.fen());
    let move;
    try { move = g.move({ from:src, to:tgt, promotion:"q" }); } catch { return false; }
    if (!move) return false;
    const normalize = s => s.replace(/[+#!?]/g,"");
    const correct = normalize(move.san) === normalize(moves[moveIndex]);
    if (correct) {
      setLastCorrectFen(g.fen()); setGame(g); setStatus("correct"); setWrongSquares(null);
      const next = moveIndex + 1; setMoveIndex(next);
      if (next >= moves.length) { setStatus("complete"); onComplete(); }
      else { setTimeout(() => setStatus("idle"), 800); if (!isPlayerTurn(next)) playComputerMove(g, next); }
      return true;
    } else {
      setWrongSquares({ [src]:{ background:"rgba(220,50,50,0.5)" }, [tgt]:{ background:"rgba(220,50,50,0.5)" } });
      setStatus("wrong");
      setTimeout(() => { setGame(new Chess(lastCorrectFen)); setStatus("idle"); setWrongSquares(null); }, 800);
      return false;
    }
  }

  const reset = () => {
    const g = new Chess();
    setGame(g); setMoveIndex(0); setStatus("idle");
    setLastCorrectFen(g.fen()); setWrongSquares(null);
    if (!isPlayerTurn(0)) playComputerMove(g, 0);
  };

  const progress = Math.round((moveIndex / moves.length) * 100);

  return (
    <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", minHeight:"calc(100vh - 53px)" }}>
      <div style={{ background:"#080808", borderRight:"1px solid #1a1a1a", padding:"20px 0", overflowY:"auto" }}>
        <div onClick={onBack} style={{ padding:"4px 20px 16px", fontSize:13, color:"#c9a84c", cursor:"pointer", fontFamily:"system-ui" }}>← All courses</div>
        <div style={{ padding:"0 20px 14px", borderBottom:"1px solid #1a1a1a" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#e8e0d0" }}>{course.title}</div>
          <div style={{ fontSize:11, color:"#555", fontFamily:"system-ui", marginTop:3 }}>{course.lines.length} lines</div>
        </div>
        {course.lines.map(l => {
          const done   = !!completedLines[`${course.id}-${l.id}`];
          const active = l.id === line.id;
          return (
            <div key={l.id} onClick={() => onSelectLine(l)} style={{ padding:"10px 20px", cursor:"pointer", background:active?"#1a1508":"transparent", borderLeft:active?"2px solid #c9a84c":"2px solid transparent", display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:13, color:done?"#c9a84c":"#333" }}>{done?"✓":"○"}</span>
              <span style={{ fontSize:12, color:active?"#e8e0d0":"#666", fontFamily:"system-ui", lineHeight:1.4 }}>{l.title}</span>
            </div>
          );
        })}
      </div>

      <div style={{ padding:"32px 36px", display:"flex", gap:40, alignItems:"flex-start", flexWrap:"wrap" }}>
        <div style={{ flexShrink:0 }}>
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            boardWidth={400}
            boardOrientation={playerColor}
            customSquareStyles={wrongSquares || {}}
            arePiecesDraggable={status !== "complete" && isPlayerTurn(moveIndex)}
            customBoardStyle={{ borderRadius:"6px", overflow:"hidden" }}
            customDarkSquareStyle={{ backgroundColor:"#b58863" }}
            customLightSquareStyle={{ backgroundColor:"#f0d9b5" }}
          />
          <div style={{ marginTop:12, height:4, background:"#1e1e1e", borderRadius:2 }}>
            <div style={{ height:4, background:"#c9a84c", borderRadius:2, width:`${progress}%`, transition:"width 0.4s" }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
            <span style={{ fontSize:11, color:"#555", fontFamily:"system-ui" }}>Move {moveIndex} of {moves.length}</span>
            <span style={{ fontSize:11, color:"#555", fontFamily:"system-ui" }}>{progress}%</span>
          </div>
          <button onClick={reset} style={{ marginTop:10, width:"100%", padding:"8px", cursor:"pointer", background:"transparent", color:"#888", border:"1px solid #222", borderRadius:6, fontSize:13, fontFamily:"system-ui" }}>↺ Restart line</button>
        </div>

        <div style={{ flex:1, minWidth:260 }}>
          <div style={{ fontSize:12, color:"#555", fontFamily:"system-ui", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>{course.title}</div>
          <h2 style={{ fontSize:22, fontWeight:700, color:"#e8e0d0", marginBottom:12, lineHeight:1.3 }}>{line.title}</h2>
          <p style={{ fontSize:14, color:"#777", lineHeight:1.7, marginBottom:24, fontFamily:"system-ui" }}>{line.explanation}</p>

          {status === "complete" ? (
            <div style={{ padding:"20px", background:"#0d1a0d", border:"1px solid #1a3a1a", borderRadius:10, marginBottom:20 }}>
              <div style={{ fontSize:22, marginBottom:6 }}>✓</div>
              <div style={{ fontSize:16, fontWeight:700, color:"#4caf50", marginBottom:6, fontFamily:"system-ui" }}>Line complete!</div>
              <div style={{ fontSize:13, color:"#4caf50aa", fontFamily:"system-ui" }}>You played all {moves.length} moves correctly.</div>
            </div>
          ) : status === "correct" ? (
            <div style={{ padding:"16px 20px", background:"#0d1a0d", border:"1px solid #1a3a1a", borderRadius:10, marginBottom:20 }}>
              <div style={{ fontSize:14, color:"#4caf50", fontFamily:"system-ui", fontWeight:700 }}>✓ Correct!</div>
              <div style={{ fontSize:13, color:"#4caf50aa", fontFamily:"system-ui", marginTop:4 }}>{line.moveExplanations?.[moves[moveIndex-1]] || ""}</div>
            </div>
          ) : status === "wrong" ? (
            <div style={{ padding:"16px 20px", background:"#1a0d0d", border:"1px solid #3a1a1a", borderRadius:10, marginBottom:20 }}>
              <div style={{ fontSize:14, color:"#e05555", fontFamily:"system-ui", fontWeight:700 }}>✗ Not quite — try again</div>
              <div style={{ fontSize:13, color:"#e05555aa", fontFamily:"system-ui", marginTop:4 }}>Piece returned. Think about the hint.</div>
            </div>
          ) : (
            <div style={{ padding:"16px 20px", background:"#111", border:"1px solid #1e1e1e", borderRadius:10, marginBottom:20 }}>
              {isPlayerTurn(moveIndex) ? (
                <>
                  <div style={{ fontSize:12, color:"#555", fontFamily:"system-ui", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Your move</div>
                  <div style={{ fontSize:15, color:"#c9a84c", fontFamily:"system-ui", fontWeight:600 }}>{getHint()}</div>
                </>
              ) : (
                <div style={{ fontSize:14, color:"#555", fontFamily:"system-ui" }}>Waiting for opponent...</div>
              )}
            </div>
          )}

          <div style={{ background:"#0a0a0a", border:"1px solid #1a1a1a", borderRadius:8, padding:"14px 18px" }}>
            <div style={{ fontSize:11, color:"#555", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10, fontFamily:"system-ui" }}>Moves played</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {moves.slice(0, moveIndex).map((m, i) => (
                <span key={i} style={{ fontSize:13, padding:"3px 8px", borderRadius:4, background:i===moveIndex-1?"#1a1508":"#111", color:i===moveIndex-1?"#c9a84c":"#444", border:i===moveIndex-1?"1px solid #c9a84c44":"1px solid #1e1e1e", fontFamily:"system-ui" }}>{m}</span>
              ))}
              {moveIndex === 0 && <span style={{ fontSize:13, color:"#333", fontFamily:"system-ui" }}>No moves yet</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeView({ courses, onOpenLine, onUpgrade }) {
  const freeCourses = courses.filter(c => c.free);
  return (
    <div>
      <div style={{ padding:"72px 28px 56px", textAlign:"center", borderBottom:"1px solid #1a1a1a", background:"radial-gradient(ellipse at 50% 0%, #1a1508 0%, #0d0d0d 70%)" }}>
        <div style={{ fontSize:52, marginBottom:8 }}>♟</div>
        <h1 style={{ fontSize:42, fontWeight:700, color:"#e8e0d0", margin:"0 0 16px", lineHeight:1.2 }}>
          Master chess,<br /><span style={{ color:"#c9a84c" }}>move by move</span>
        </h1>
        <p style={{ fontSize:17, color:"#888", maxWidth:500, margin:"0 auto 12px", lineHeight:1.7, fontFamily:"system-ui" }}>
          {courses.length}+ courses covering every opening, gambit, and endgame. Play the moves yourself — instant feedback, wrong moves snap back.
        </p>
        <p style={{ fontSize:14, color:"#555", marginBottom:32, fontFamily:"system-ui" }}>{courses.filter(c=>c.free).length} free courses to start — no account needed.</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          <button onClick={() => onOpenLine(freeCourses[0], freeCourses[0].lines[0])} style={{ background:"#c9a84c", color:"#0d0d0d", border:"none", borderRadius:8, padding:"13px 28px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"system-ui" }}>
            Try it free
          </button>
          <button onClick={onUpgrade} style={{ background:"transparent", color:"#e8e0d0", border:"1px solid #333", borderRadius:8, padding:"13px 28px", fontSize:15, cursor:"pointer", fontFamily:"system-ui" }}>
            View all {courses.length} courses
          </button>
        </div>
      </div>
      <div style={{ padding:"40px 28px" }}>
        <h2 style={{ fontSize:14, letterSpacing:"0.1em", color:"#888", textTransform:"uppercase", fontFamily:"system-ui", fontWeight:600, marginBottom:20 }}>Free courses — start here</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:16 }}>
          {freeCourses.map(c => <CourseCard key={c.id} course={c} onOpenLine={onOpenLine} completedLines={{}} />)}
        </div>
      </div>
      <div style={{ padding:"0 28px 56px", display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:20 }}>
        {[
          { icon:"♜", title:"Play the moves", desc:"Move pieces yourself. Instant right/wrong feedback." },
          { icon:"↺", title:"Wrong move snaps back", desc:"Mistake? The piece returns and you try again." },
          { icon:"◈", title:`${courses.length}+ courses`, desc:"Every major opening, gambit, and endgame." },
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

function CoursesView({ courses, onOpenLine, completedLines }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = courses.filter(c => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ padding:"36px 28px" }}>
      <h2 style={{ fontSize:26, fontWeight:700, color:"#e8e0d0", marginBottom:6 }}>All courses</h2>
      <p style={{ fontSize:14, color:"#666", fontFamily:"system-ui", marginBottom:20 }}>{courses.length} courses covering every opening, gambit, and endgame.</p>

      <input
        placeholder="Search courses..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width:"100%", maxWidth:340, padding:"9px 14px", background:"#111", border:"1px solid #222", borderRadius:8, color:"#e8e0d0", fontSize:14, fontFamily:"system-ui", marginBottom:16, outline:"none" }}
      />

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid", fontSize:12, fontFamily:"system-ui", cursor:"pointer", background:activeCategory===cat?"#c9a84c":"transparent", color:activeCategory===cat?"#0d0d0d":"#666", borderColor:activeCategory===cat?"#c9a84c":"#333" }}>{cat}</button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16 }}>
        {filtered.map(c => <CourseCard key={c.id} course={c} onOpenLine={onOpenLine} completedLines={completedLines} />)}
      </div>
      {filtered.length === 0 && <div style={{ color:"#555", fontFamily:"system-ui", marginTop:20 }}>No courses found.</div>}
    </div>
  );
}

function CourseCard({ course, onOpenLine, completedLines = {} }) {
  const badge     = BADGE_COLORS[course.badge] || BADGE_COLORS.Beginner;
  const doneCount = course.lines.filter(l => completedLines[`${course.id}-${l.id}`]).length;
  return (
    <div style={{ background:"#111", border:"1px solid #1e1e1e", borderRadius:12, padding:"20px", overflow:"hidden" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <span style={{ fontSize:11, padding:"3px 9px", borderRadius:5, fontFamily:"system-ui", fontWeight:600, background:badge.bg, color:badge.color }}>{course.badge}</span>
        {!course.free && <span style={{ fontSize:11, color:"#c9a84c", fontFamily:"system-ui" }}>⭐ Pro</span>}
        {course.free && <span style={{ fontSize:11, color:"#4caf50", fontFamily:"system-ui" }}>Free</span>}
      </div>
      <div style={{ fontSize:11, color:"#444", fontFamily:"system-ui", marginBottom:4 }}>{course.category}</div>
      <div style={{ fontSize:15, fontWeight:700, color:"#e8e0d0", marginBottom:6 }}>{course.title}</div>
      <div style={{ fontSize:13, color:"#666", lineHeight:1.6, marginBottom:14, fontFamily:"system-ui" }}>{course.description}</div>
      {doneCount > 0 && (
        <div style={{ marginBottom:12 }}>
          <div style={{ height:3, background:"#1e1e1e", borderRadius:2 }}>
            <div style={{ height:3, background:"#c9a84c", borderRadius:2, width:`${Math.round((doneCount/course.lines.length)*100)}%` }} />
          </div>
          <div style={{ fontSize:11, color:"#555", fontFamily:"system-ui", marginTop:4 }}>{doneCount}/{course.lines.length} lines</div>
        </div>
      )}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {course.lines.map(l => {
          const done = !!completedLines?.[`${course.id}-${l.id}`];
          return (
            <div key={l.id} onClick={() => onOpenLine(course, l)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"#0a0a0a", border:"1px solid #1a1a1a", borderRadius:8, cursor:"pointer" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#c9a84c"}
              onMouseLeave={e => e.currentTarget.style.borderColor="#1a1a1a"}>
              <span style={{ fontSize:14, color:done?"#c9a84c":"#333" }}>{done?"✓":"▶"}</span>
              <span style={{ fontSize:13, color:done?"#c9a84c":"#aaa", fontFamily:"system-ui", flex:1 }}>{l.title}</span>
              {!course.free && <span style={{ fontSize:11, color:"#555", fontFamily:"system-ui" }}>Pro</span>}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop:14, fontSize:12, color:"#444", fontFamily:"system-ui" }}>⏱ {course.duration}</div>
    </div>
  );
}

function UpgradeModal({ onClose }) {
  const plans = [
    { name:"Pro", price:"$12", period:"/month", features:[`All ${COURSES.length}+ courses`,"Multiple lines per opening","Spaced repetition drills","Progress tracking","New courses monthly"], highlight:true },
    { name:"Team", price:"$8", period:"/user/mo", features:["Everything in Pro","Coach dashboard","Student reports","Custom courses","Priority support"], highlight:false },
  ];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#111", border:"1px solid #222", borderRadius:16, padding:"36px", maxWidth:560, width:"100%" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
          <div>
            <h2 style={{ fontSize:22, fontWeight:700, color:"#e8e0d0", margin:0 }}>Upgrade to Pro</h2>
            <p style={{ fontSize:14, color:"#666", marginTop:6, fontFamily:"system-ui" }}>Unlock all {COURSES.length}+ courses.</p>
          </div>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#555", fontSize:22, cursor:"pointer" }}>×</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:24 }}>
          {plans.map(p => (
            <div key={p.name} style={{ border:`1px solid ${p.highlight?"#c9a84c":"#222"}`, borderRadius:12, padding:"20px 18px" }}>
              {p.highlight && <div style={{ fontSize:11, background:"#c9a84c22", color:"#c9a84c", padding:"3px 8px", borderRadius:4, display:"inline-block", marginBottom:10, fontFamily:"system-ui", fontWeight:600 }}>Most popular</div>}
              <div style={{ fontSize:16, fontWeight:700, color:"#e8e0d0", marginBottom:4 }}>{p.name}</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:2, marginBottom:14 }}>
                <span style={{ fontSize:26, fontWeight:700, color:p.highlight?"#c9a84c":"#e8e0d0" }}>{p.price}</span>
                <span style={{ fontSize:13, color:"#555", fontFamily:"system-ui" }}>{p.period}</span>
              </div>
              {p.features.map(f => (
                <div key={f} style={{ fontSize:13, color:"#888", fontFamily:"system-ui", marginBottom:6, display:"flex", gap:7 }}>
                  <span style={{ color:"#c9a84c" }}>✓</span> {f}
                </div>
              ))}
              <button style={{ width:"100%", marginTop:16, background:p.highlight?"#c9a84c":"transparent", color:p.highlight?"#0d0d0d":"#e8e0d0", border:p.highlight?"none":"1px solid #333", borderRadius:7, padding:"10px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"system-ui" }}>
                {p.highlight?"Start 7-day free trial":"Contact us"}
              </button>
            </div>
          ))}
        </div>
        <p style={{ fontSize:12, color:"#444", textAlign:"center", fontFamily:"system-ui" }}>Cancel anytime. No card required for trial.</p>
      </div>
    </div>
  );
}
ENDOFFILE
echo "done"
