import { useState, useEffect, useCallback } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const PLAYERS = [
  { id: 1, name: "LEBRON", surname: "James", team: "Lakers", position: "SF", era: "2000s", championships: 4, allStar: true, mvp: true, image: "🏀" },
  { id: 2, name: "JORDAN", surname: "Jordan", team: "Bulls", position: "SG", era: "90s", championships: 6, allStar: true, mvp: true, image: "🐂" },
  { id: 3, name: "KOBE", surname: "Bryant", team: "Lakers", position: "SG", era: "2000s", championships: 5, allStar: true, mvp: true, image: "🐍" },
  { id: 4, name: "CURRY", surname: "Curry", team: "Warriors", position: "PG", era: "2010s", championships: 4, allStar: true, mvp: true, image: "🍛" },
  { id: 5, name: "MAGIC", surname: "Johnson", team: "Lakers", position: "PG", era: "80s", championships: 5, allStar: true, mvp: true, image: "✨" },
  { id: 6, name: "BIRD", surname: "Bird", team: "Celtics", position: "SF", era: "80s", championships: 3, allStar: true, mvp: true, image: "🦅" },
  { id: 7, name: "SHAQ", surname: "O'Neal", team: "Lakers", position: "C", era: "2000s", championships: 4, allStar: true, mvp: true, image: "⚡" },
  { id: 8, name: "DURANT", surname: "Durant", team: "Warriors", position: "SF", era: "2010s", championships: 2, allStar: true, mvp: true, image: "🌃" },
  { id: 9, name: "GIANNIS", surname: "Antetokounmpo", team: "Bucks", position: "PF", era: "2020s", championships: 1, allStar: true, mvp: true, image: "🦌" },
  { id: 10, name: "DUNCAN", surname: "Duncan", team: "Spurs", position: "PF", era: "2000s", championships: 5, allStar: true, mvp: true, image: "🏰" },
  { id: 11, name: "HAKEEM", surname: "Olajuwon", team: "Rockets", position: "C", era: "90s", championships: 2, allStar: true, mvp: false, image: "🌙" },
  { id: 12, name: "PIPPEN", surname: "Pippen", team: "Bulls", position: "SF", era: "90s", championships: 6, allStar: true, mvp: false, image: "🐂" },
];

const WORDLE_ANSWERS = ["LEBRON", "JORDAN", "KOBE", "CURRY", "MAGIC", "BIRD", "SHAQ", "DURANT", "GIANNIS", "DUNCAN"];
const TODAY_WORD = WORDLE_ANSWERS[new Date().getDate() % WORDLE_ANSWERS.length];

const CONNECTIONS_DATA = [
  {
    category: "Lakers Legends", color: "#FFD700", players: ["Kobe Bryant", "Magic Johnson", "Shaquille O'Neal", "LeBron James"]
  },
  {
    category: "Bulls Dynasty", color: "#CE1141", players: ["Michael Jordan", "Scottie Pippen", "Dennis Rodman", "Horace Grant"]
  },
  {
    category: "3-Point Kings", color: "#1D428A", players: ["Steph Curry", "Ray Allen", "Reggie Miller", "Kyle Korver"]
  },
  {
    category: "Defensive Giants", color: "#00843D", players: ["Hakeem Olajuwon", "Bill Russell", "Ben Wallace", "Dikembe Mutombo"]
  },
];
const ALL_CONNECTION_PLAYERS = CONNECTIONS_DATA.flatMap(g => g.players).sort(() => Math.random() - 0.5);

const CAREER_PATH_PLAYERS = [
  { name: "LeBron James", path: ["Cleveland Cavaliers", "Miami Heat", "Cleveland Cavaliers", "Los Angeles Lakers"] },
  { name: "Kevin Durant", path: ["Seattle SuperSonics", "Oklahoma City Thunder", "Golden State Warriors", "Brooklyn Nets", "Phoenix Suns"] },
  { name: "Shaquille O'Neal", path: ["Orlando Magic", "Los Angeles Lakers", "Miami Heat", "Phoenix Suns", "Cleveland Cavaliers", "Boston Celtics"] },
  { name: "Kobe Bryant", path: ["Charlotte Hornets", "Los Angeles Lakers"] },
];
const TODAY_CAREER = CAREER_PATH_PLAYERS[new Date().getDate() % CAREER_PATH_PLAYERS.length];

const GRID_PLAYERS = [
  { name: "Kobe", teams: ["Lakers"], position: "SG", drafted: "1996", championships: 5 },
  { name: "Magic", teams: ["Lakers"], position: "PG", drafted: "1979", championships: 5 },
  { name: "Shaq", teams: ["Lakers", "Heat"], position: "C", drafted: "1992", championships: 4 },
  { name: "LeBron", teams: ["Cavaliers", "Heat", "Lakers"], position: "SF", drafted: "2003", championships: 4 },
  { name: "Curry", teams: ["Warriors"], position: "PG", drafted: "2009", championships: 4 },
  { name: "Jordan", teams: ["Bulls"], position: "SG", drafted: "1984", championships: 6 },
  { name: "Duncan", teams: ["Spurs"], position: "PF", drafted: "1997", championships: 5 },
  { name: "Bird", teams: ["Celtics"], position: "SF", drafted: "1978", championships: 3 },
  { name: "Giannis", teams: ["Bucks"], position: "PF", drafted: "2013", championships: 1 },
];
const GRID_ROWS = ["Lakers", "Bulls", "Warriors"];
const GRID_COLS = ["PG", "SG/SF", "C/PF"];
const GRID_ANSWERS = {
  "Lakers-PG/SG/SF": ["Magic", "LeBron"], "Lakers-SG/SF": ["Kobe", "LeBron"], "Lakers-C/PF": ["Shaq"],
  "Bulls-PG/SG/SF": ["Jordan"], "Bulls-SG/SF": ["Jordan"], "Bulls-C/PF": [],
  "Warriors-PG/SG/SF": ["Curry"], "Warriors-SG/SF": ["Curry"], "Warriors-C/PF": [],
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=Barlow+Condensed:wght@600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --court: #0a0a0f;
    --court2: #13131a;
    --court3: #1c1c27;
    --orange: #FF6B1A;
    --orange2: #ff8c42;
    --gold: #FFD700;
    --text: #f0f0f5;
    --text2: #9090a8;
    --green: #4caf50;
    --red: #f44336;
    --blue: #2196f3;
    --yellow: #FFD700;
    --radius: 12px;
  }

  body { background: var(--court); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  .nav {
    background: rgba(10,10,15,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,107,26,0.2);
    padding: 0 24px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .nav-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    color: var(--orange);
    letter-spacing: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .nav-logo span { color: var(--text); }
  .nav-back {
    background: rgba(255,107,26,0.15);
    border: 1px solid rgba(255,107,26,0.3);
    color: var(--orange);
    padding: 8px 18px;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
  }
  .nav-back:hover { background: rgba(255,107,26,0.3); }

  /* HOMEPAGE */
  .hero {
    padding: 80px 24px 48px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: -60px; left: 50%; transform: translateX(-50%);
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(255,107,26,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-eyebrow {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 4px;
    color: var(--orange);
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .hero-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(56px, 10vw, 110px);
    line-height: 0.9;
    letter-spacing: 2px;
    margin-bottom: 20px;
  }
  .hero-title .accent { color: var(--orange); }
  .hero-sub {
    font-size: 17px;
    color: var(--text2);
    max-width: 480px;
    margin: 0 auto 48px;
    line-height: 1.6;
    font-weight: 300;
  }

  /* GAMES GRID */
  .games-section { padding: 0 24px 80px; max-width: 1100px; margin: 0 auto; width: 100%; }
  .section-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 4px;
    color: var(--text2);
    text-transform: uppercase;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .section-label::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08); }

  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
  .game-card {
    background: var(--court2);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: var(--radius);
    padding: 28px 24px;
    cursor: pointer;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }
  .game-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,107,26,0.06) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.25s;
  }
  .game-card:hover { border-color: rgba(255,107,26,0.4); transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
  .game-card:hover::before { opacity: 1; }
  .game-emoji { font-size: 36px; margin-bottom: 16px; display: block; }
  .game-title { font-family: 'Barlow Condensed', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 8px; }
  .game-desc { font-size: 14px; color: var(--text2); line-height: 1.5; font-weight: 300; }
  .game-badge {
    display: inline-block;
    margin-top: 16px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 4px;
    background: rgba(255,107,26,0.15);
    color: var(--orange);
  }

  /* GAME WRAPPER */
  .game-wrapper { flex: 1; padding: 32px 24px; max-width: 760px; margin: 0 auto; width: 100%; }
  .game-header { margin-bottom: 32px; }
  .game-header h1 { font-family: 'Bebas Neue', sans-serif; font-size: 42px; letter-spacing: 1px; color: var(--text); }
  .game-header p { color: var(--text2); font-size: 15px; margin-top: 6px; font-weight: 300; }

  /* WORDLE */
  .wordle-grid { display: flex; flex-direction: column; gap: 6px; margin-bottom: 28px; align-items: center; }
  .wordle-row { display: flex; gap: 6px; }
  .wordle-cell {
    width: 56px; height: 56px;
    border: 2px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 26px; font-weight: 700;
    transition: all 0.3s;
    text-transform: uppercase;
  }
  .wordle-cell.correct { background: var(--green); border-color: var(--green); color: #fff; }
  .wordle-cell.present { background: #e5a700; border-color: #e5a700; color: #fff; }
  .wordle-cell.absent { background: #3a3a4a; border-color: #3a3a4a; color: var(--text2); }
  .wordle-cell.active { border-color: var(--orange); }
  .wordle-keyboard { display: flex; flex-direction: column; gap: 6px; align-items: center; }
  .kb-row { display: flex; gap: 5px; }
  .kb-key {
    min-width: 38px; height: 52px; padding: 0 6px;
    background: var(--court3); border: none; border-radius: 6px;
    color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
  }
  .kb-key:hover { background: rgba(255,107,26,0.3); }
  .kb-key.correct { background: var(--green); }
  .kb-key.present { background: #e5a700; }
  .kb-key.absent { background: #2a2a35; color: #555; }
  .kb-key.wide { min-width: 56px; font-size: 11px; }

  /* CONNECTIONS */
  .connections-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 20px; }
  .conn-item {
    background: var(--court3);
    border: 2px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 14px 8px;
    text-align: center;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;
    line-height: 1.3;
  }
  .conn-item:hover { border-color: var(--orange); }
  .conn-item.selected { border-color: var(--orange); background: rgba(255,107,26,0.2); }
  .conn-result {
    border-radius: 10px;
    padding: 16px;
    text-align: center;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 15px;
  }
  .conn-result .cat-players { font-size: 12px; font-weight: 400; opacity: 0.8; margin-top: 4px; }
  .btn { padding: 12px 28px; border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-primary { background: var(--orange); color: #fff; }
  .btn-primary:hover { background: var(--orange2); }
  .btn-secondary { background: var(--court3); color: var(--text); }
  .btn-secondary:hover { background: rgba(255,255,255,0.1); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-row { display: flex; gap: 10px; flex-wrap: wrap; }

  /* CAREER PATH */
  .career-path { display: flex; flex-direction: column; gap: 0; margin-bottom: 32px; }
  .career-step {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: var(--court2);
    border-left: 3px solid var(--orange);
    margin-bottom: 4px;
    border-radius: 0 8px 8px 0;
  }
  .career-step-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    color: var(--orange);
    min-width: 28px;
  }
  .career-step-team { font-size: 16px; font-weight: 500; }
  .career-step-hidden {
    background: var(--court3);
    padding: 14px 20px;
    border-radius: 8px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text2);
    font-size: 14px;
  }
  .guess-input {
    width: 100%;
    background: var(--court2);
    border: 2px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 14px 18px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    margin-bottom: 12px;
    outline: none;
    transition: border-color 0.2s;
  }
  .guess-input:focus { border-color: var(--orange); }
  .guess-input::placeholder { color: var(--text2); }
  .attempts { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .attempt-pill {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
  }
  .attempt-pill.wrong { background: rgba(244,67,54,0.2); color: #f44336; }

  /* BOX2BOX GRID */
  .grid-table { width: 100%; border-collapse: separate; border-spacing: 6px; }
  .grid-table th {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.5px;
    padding: 12px 8px;
    color: var(--orange);
    text-align: center;
  }
  .grid-table .row-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--orange);
    padding: 8px 16px 8px 0;
    white-space: nowrap;
  }
  .grid-cell {
    background: var(--court2);
    border: 2px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    width: 120px; height: 90px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    padding: 8px;
    vertical-align: middle;
  }
  .grid-cell:hover { border-color: var(--orange); background: rgba(255,107,26,0.1); }
  .grid-cell.correct { border-color: var(--green); background: rgba(76,175,80,0.15); cursor: default; }
  .grid-cell.incorrect { border-color: var(--red); background: rgba(244,67,54,0.1); }
  .grid-cell .cell-name { font-size: 14px; font-weight: 600; }
  .grid-cell .cell-hint { font-size: 11px; color: var(--text2); margin-top: 4px; }

  /* BINGO */
  .bingo-card { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 24px; }
  .bingo-header-row {
    display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 6px;
  }
  .bingo-col-header {
    background: var(--orange);
    color: #fff;
    text-align: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;
    border-radius: 8px;
    padding: 8px 4px;
  }
  .bingo-cell {
    background: var(--court2);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 10px 6px;
    text-align: center;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    min-height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    line-height: 1.3;
  }
  .bingo-cell.free { background: var(--orange); color: #fff; font-weight: 700; }
  .bingo-cell.marked { background: rgba(76,175,80,0.3); border-color: var(--green); color: #fff; }
  .bingo-cell:hover:not(.free) { border-color: var(--orange); }

  /* WHO ARE YA */
  .player-reveal {
    background: var(--court2);
    border-radius: var(--radius);
    padding: 32px;
    text-align: center;
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
  }
  .player-silhouette {
    font-size: 100px;
    display: block;
    margin-bottom: 16px;
    transition: filter 0.5s;
  }
  .player-silhouette.hidden { filter: brightness(0) blur(2px); }
  .clue-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
  .clue-item {
    background: var(--court2);
    border-radius: 8px;
    padding: 12px 18px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }
  .clue-label { color: var(--text2); font-weight: 300; }
  .clue-value { font-weight: 600; color: var(--text); }
  .clue-hidden { filter: blur(6px); user-select: none; }

  /* SHARED */
  .result-banner {
    background: var(--court3);
    border-radius: var(--radius);
    padding: 24px;
    text-align: center;
    margin-bottom: 20px;
  }
  .result-banner.win { border: 1px solid rgba(76,175,80,0.4); background: rgba(76,175,80,0.1); }
  .result-banner.lose { border: 1px solid rgba(244,67,54,0.3); background: rgba(244,67,54,0.08); }
  .result-title { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 1px; }
  .result-sub { color: var(--text2); font-size: 14px; margin-top: 6px; }
  .divider { height: 1px; background: rgba(255,255,255,0.07); margin: 24px 0; }
  .info-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--court3);
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 13px;
    color: var(--text2);
    margin-right: 8px;
    margin-bottom: 8px;
  }
  .score-badge {
    background: rgba(255,107,26,0.15);
    border: 1px solid rgba(255,107,26,0.3);
    color: var(--orange);
    border-radius: 8px;
    padding: 8px 18px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1px;
    display: inline-block;
    margin-bottom: 16px;
  }

  @media (max-width: 600px) {
    .connections-grid { grid-template-columns: repeat(2, 1fr); }
    .bingo-card { gap: 4px; }
    .bingo-cell { font-size: 10px; min-height: 56px; }
    .wordle-cell { width: 46px; height: 46px; font-size: 22px; }
  }
`;

// ─── WORDLE GAME ──────────────────────────────────────────────────────────────
function WordleGame() {
  const MAX_GUESSES = 6;
  const WORD = TODAY_WORD;
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);

  const getLetterState = (word, guess) => {
    const result = Array(guess.length).fill("absent");
    const wordArr = word.split("");
    const used = Array(word.length).fill(false);
    guess.split("").forEach((l, i) => { if (l === wordArr[i]) { result[i] = "correct"; used[i] = true; } });
    guess.split("").forEach((l, i) => {
      if (result[i] === "correct") return;
      const idx = wordArr.findIndex((wl, wi) => wl === l && !used[wi]);
      if (idx !== -1) { result[i] = "present"; used[idx] = true; }
    });
    return result;
  };

  const usedLetters = {};
  guesses.forEach(({ guess, states }) => {
    guess.split("").forEach((l, i) => {
      const s = states[i];
      if (!usedLetters[l] || s === "correct" || (s === "present" && usedLetters[l] === "absent")) usedLetters[l] = s;
    });
  });

  const submit = () => {
    if (current.length !== WORD.length) { setShake(true); setTimeout(() => setShake(false), 500); return; }
    const states = getLetterState(WORD, current.toUpperCase());
    const newGuesses = [...guesses, { guess: current.toUpperCase(), states }];
    setGuesses(newGuesses);
    setCurrent("");
    if (current.toUpperCase() === WORD) { setWon(true); setGameOver(true); }
    else if (newGuesses.length >= MAX_GUESSES) { setGameOver(true); }
  };

  const handleKey = useCallback((key) => {
    if (gameOver) return;
    if (key === "ENTER") { submit(); return; }
    if (key === "⌫" || key === "BACKSPACE") { setCurrent(c => c.slice(0, -1)); return; }
    if (/^[A-Z]$/.test(key) && current.length < WORD.length) setCurrent(c => c + key);
  }, [current, gameOver]);

  useEffect(() => {
    const handler = (e) => handleKey(e.key.toUpperCase());
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  const rows = [...guesses];
  while (rows.length < MAX_GUESSES) rows.push(null);
  const KEYS = [["Q","W","E","R","T","Y","U","I","O","P"],["A","S","D","F","G","H","J","K","L"],["ENTER","Z","X","C","V","B","N","M","⌫"]];

  return (
    <div>
      <div className="game-header">
        <h1>🏀 HOOPDLE</h1>
        <p>Guess the NBA legend in {MAX_GUESSES} tries — {WORD.length} letters</p>
      </div>
      {gameOver && (
        <div className={`result-banner ${won ? "win" : "lose"}`}>
          <div className="result-title">{won ? "SWISH! 🎉" : "GAME OVER"}</div>
          <div className="result-sub">{won ? `You got it in ${guesses.length}!` : `The answer was ${WORD}`}</div>
        </div>
      )}
      <div className="wordle-grid">
        {rows.map((row, ri) => (
          <div key={ri} className="wordle-row" style={shake && ri === guesses.length ? {animation:"shake 0.4s"} : {}}>
            {Array.from({ length: WORD.length }).map((_, ci) => {
              const letter = row ? row.guess[ci] : (ri === guesses.length ? current[ci] : "");
              const state = row ? row.states[ci] : "";
              return (
                <div key={ci} className={`wordle-cell ${state} ${!row && ri === guesses.length && letter ? "active" : ""}`}>
                  {letter || ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="wordle-keyboard">
        {KEYS.map((row, ri) => (
          <div key={ri} className="kb-row">
            {row.map(k => (
              <button key={k} className={`kb-key ${k.length > 1 ? "wide" : ""} ${usedLetters[k] || ""}`} onClick={() => handleKey(k)}>{k}</button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CONNECTIONS GAME ─────────────────────────────────────────────────────────
function ConnectionsGame() {
  const [players, setPlayers] = useState(ALL_CONNECTION_PLAYERS);
  const [selected, setSelected] = useState([]);
  const [solved, setSolved] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [msg, setMsg] = useState("");

  const toggle = (p) => {
    if (solved.flatMap(s => s.players).includes(p)) return;
    setSelected(s => s.includes(p) ? s.filter(x => x !== p) : s.length < 4 ? [...s, p] : s);
  };

  const submit = () => {
    if (selected.length !== 4) return;
    const match = CONNECTIONS_DATA.find(g => g.players.every(p => selected.includes(p)) && selected.every(p => g.players.includes(p)));
    if (match) {
      setSolved(s => [...s, match]);
      setSelected([]);
      setMsg(`✅ "${match.category}" — Nice!`);
    } else {
      setMistakes(m => m + 1);
      setSelected([]);
      setMsg(`❌ Not quite! ${4 - mistakes - 1 > 0 ? `${4 - mistakes - 1} mistakes left` : "Last chance!"}`);
    }
  };

  const isSolved = (p) => solved.flatMap(s => s.players).includes(p);

  return (
    <div>
      <div className="game-header">
        <h1>🔗 CONNECTIONS</h1>
        <p>Find four groups of four basketball players</p>
      </div>
      {solved.map(g => (
        <div key={g.category} className="conn-result" style={{ background: g.color + "33", border: `2px solid ${g.color}66` }}>
          <div style={{ color: g.color, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18 }}>{g.category}</div>
          <div className="cat-players">{g.players.join(" · ")}</div>
        </div>
      ))}
      {solved.length < 4 && (
        <>
          <div className="connections-grid">
            {players.filter(p => !isSolved(p)).map(p => (
              <div key={p} className={`conn-item ${selected.includes(p) ? "selected" : ""}`} onClick={() => toggle(p)}>{p}</div>
            ))}
          </div>
          {msg && <div style={{ marginBottom: 12, fontSize: 14, color: msg.startsWith("✅") ? "var(--green)" : "var(--red)" }}>{msg}</div>}
          <div className="btn-row">
            <button className="btn btn-primary" disabled={selected.length !== 4} onClick={submit}>Submit</button>
            <button className="btn btn-secondary" onClick={() => setSelected([])}>Deselect All</button>
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: "var(--text2)" }}>Mistakes: {mistakes}/4</div>
        </>
      )}
      {solved.length === 4 && (
        <div className="result-banner win"><div className="result-title">PERFECT! 🏆</div><div className="result-sub">You found all four groups!</div></div>
      )}
    </div>
  );
}

// ─── CAREER PATH GAME ────────────────────────────────────────────────────────
function CareerPathGame() {
  const player = TODAY_CAREER;
  const [revealed, setRevealed] = useState(1);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  const MAX_ATTEMPTS = 5;

  const submit = () => {
    if (!guess.trim()) return;
    const correct = guess.trim().toLowerCase().includes(player.name.split(" ")[1].toLowerCase()) ||
      guess.trim().toLowerCase().includes(player.name.toLowerCase());
    if (correct) { setWon(true); return; }
    const newAttempts = [...attempts, guess.trim()];
    setAttempts(newAttempts);
    setGuess("");
    if (revealed < player.path.length) setRevealed(r => r + 1);
    if (newAttempts.length >= MAX_ATTEMPTS) setLost(true);
  };

  return (
    <div>
      <div className="game-header">
        <h1>🗺️ CAREER PATH</h1>
        <p>Guess the player from their team history</p>
      </div>
      <div className="career-path">
        {player.path.map((team, i) => (
          i < revealed ? (
            <div key={i} className="career-step">
              <span className="career-step-num">{i + 1}</span>
              <span className="career-step-team">{team}</span>
            </div>
          ) : (
            <div key={i} className="career-step-hidden">
              <span className="career-step-num" style={{ color: "var(--text2)" }}>{i + 1}</span>
              <span>🔒 Hidden — guess to reveal</span>
            </div>
          )
        ))}
      </div>
      {attempts.length > 0 && (
        <div className="attempts">
          {attempts.map((a, i) => <span key={i} className="attempt-pill wrong">✗ {a}</span>)}
        </div>
      )}
      {!won && !lost && (
        <>
          <input className="guess-input" value={guess} onChange={e => setGuess(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="Enter player name..." />
          <div className="btn-row">
            <button className="btn btn-primary" onClick={submit}>Guess</button>
            {revealed < player.path.length && (
              <button className="btn btn-secondary" onClick={() => setRevealed(r => r + 1)}>Reveal next team</button>
            )}
          </div>
        </>
      )}
      {won && <div className="result-banner win"><div className="result-title">CORRECT! 🎉</div><div className="result-sub">It was {player.name} in {attempts.length + 1} guess{attempts.length !== 0 ? "es" : ""}!</div></div>}
      {lost && <div className="result-banner lose"><div className="result-title">GAME OVER</div><div className="result-sub">The answer was {player.name}</div></div>}
    </div>
  );
}

// ─── BOX2BOX GRID ─────────────────────────────────────────────────────────────
function Box2BoxGame() {
  const [answers, setAnswers] = useState({});
  const [input, setInput] = useState({});
  const [activeCell, setActiveCell] = useState(null);
  const [score, setScore] = useState(0);

  const posMap = { "PG": ["PG"], "SG/SF": ["SG", "SF"], "C/PF": ["C", "PF"] };

  const checkAnswer = (row, col, val) => {
    const candidate = GRID_PLAYERS.find(p =>
      p.teams.includes(row) && posMap[col].some(pos => p.position === pos) &&
      p.name.toLowerCase() === val.toLowerCase()
    );
    if (candidate) {
      setAnswers(a => ({ ...a, [`${row}-${col}`]: candidate.name }));
      setScore(s => s + 1);
      setActiveCell(null);
      return true;
    }
    setAnswers(a => ({ ...a, [`${row}-${col}`]: "❌" }));
    setTimeout(() => setAnswers(a => { const n = {...a}; delete n[`${row}-${col}`]; return n; }), 800);
    return false;
  };

  return (
    <div>
      <div className="game-header">
        <h1>⬛ BOX2BOX GRID</h1>
        <p>Name a player that fits both the team (row) and position (column)</p>
      </div>
      <div className="score-badge">Score: {score} / 9</div>
      <div style={{ overflowX: "auto" }}>
        <table className="grid-table">
          <thead>
            <tr>
              <th></th>
              {GRID_COLS.map(c => <th key={c}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {GRID_ROWS.map(row => (
              <tr key={row}>
                <td className="row-label">{row}</td>
                {GRID_COLS.map(col => {
                  const key = `${row}-${col}`;
                  const ans = answers[key];
                  return (
                    <td key={col}>
                      {ans ? (
                        <div className={`grid-cell ${ans === "❌" ? "incorrect" : "correct"}`}>
                          <div className="cell-name">{ans}</div>
                        </div>
                      ) : activeCell === key ? (
                        <div className="grid-cell" style={{ padding: 4 }}>
                          <input
                            autoFocus
                            style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 12, textAlign: "center" }}
                            value={input[key] || ""}
                            onChange={e => setInput(i => ({ ...i, [key]: e.target.value }))}
                            onKeyDown={e => { if (e.key === "Enter") { checkAnswer(row, col, input[key] || ""); setInput(i => ({ ...i, [key]: "" })); } if (e.key === "Escape") setActiveCell(null); }}
                            placeholder="Player name"
                          />
                        </div>
                      ) : (
                        <div className="grid-cell" onClick={() => setActiveCell(key)}>
                          <div className="cell-hint">Click to answer</div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 16, fontSize: 13, color: "var(--text2)" }}>
        Example: Lakers + PG/SG/SF → "Magic", "Kobe", "LeBron"
      </div>
    </div>
  );
}

// ─── BINGO ────────────────────────────────────────────────────────────────────
const BINGO_ITEMS = [
  "Lakers Legend", "6-time Champ", "Triple Double King", "Slam Dunk Champ", "3x MVP",
  "NYC Native", "GOAT Debate", "Scoring Title", "Finals MVP", "Point Guard",
  "60-pt Game", "FREE SPACE", "Draft #1 Pick", "Olympic Gold", "Defensive POY",
  "Small Forward", "Hall of Famer", "Rookie of Year", "Center", "Power Forward",
  "5 Rings", "Celtics Legend", "Warriors Dynasty", "2-time Champion", "All-Time Blocks",
];

function BingoGame() {
  const [marked, setMarked] = useState(new Set([11]));
  const [bingo, setBingo] = useState(false);

  const toggle = (i) => {
    if (i === 11) return;
    const next = new Set(marked);
    next.has(i) ? next.delete(i) : next.add(i);
    setMarked(next);
    checkBingo(next);
  };

  const checkBingo = (m) => {
    const lines = [
      [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],
      [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],
      [0,6,12,18,24],[4,8,12,16,20]
    ];
    if (lines.some(line => line.every(i => m.has(i)))) setBingo(true);
  };

  const COLS = ["B","I","N","G","O"];

  return (
    <div>
      <div className="game-header">
        <h1>🎰 BASKETBALL BINGO</h1>
        <p>Mark the squares that match today's NBA trivia challenge</p>
      </div>
      {bingo && <div className="result-banner win"><div className="result-title">BINGO! 🎉</div><div className="result-sub">You got five in a row!</div></div>}
      <div className="bingo-header-row">
        {COLS.map(c => <div key={c} className="bingo-col-header">{c}</div>)}
      </div>
      <div className="bingo-card">
        {BINGO_ITEMS.map((item, i) => (
          <div key={i} className={`bingo-cell ${i === 11 ? "free" : marked.has(i) ? "marked" : ""}`} onClick={() => toggle(i)}>
            {i === 11 ? "FREE" : item}
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: "var(--text2)" }}>Click squares to mark them. Get 5 in a row (horizontal, vertical, or diagonal) to win!</p>
    </div>
  );
}

// ─── WHO ARE YA ───────────────────────────────────────────────────────────────
const WHO_PLAYERS = [
  { name: "LeBron James", emoji: "👑", team: "Lakers", position: "SF", era: "2000s-present", rings: 4, hint1: "4x NBA Champion", hint2: "Known as 'The King'" },
  { name: "Stephen Curry", emoji: "🎯", team: "Warriors", position: "PG", era: "2010s-present", rings: 4, hint1: "Greatest shooter ever", hint2: "3x NBA Champion" },
  { name: "Giannis Antetokounmpo", emoji: "🦌", team: "Bucks", position: "PF", era: "2010s-present", rings: 1, hint1: "2021 Finals MVP", hint2: "The Greek Freak" },
];
const TODAY_WHO = WHO_PLAYERS[new Date().getDate() % WHO_PLAYERS.length];

function WhoAreYaGame() {
  const player = TODAY_WHO;
  const [cluesRevealed, setCluesRevealed] = useState(1);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [won, setWon] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const clues = [
    { label: "Team", value: player.team },
    { label: "Position", value: player.position },
    { label: "Era", value: player.era },
    { label: "Rings", value: `${player.rings}` },
    { label: "Clue", value: player.hint1 },
    { label: "Nickname", value: player.hint2 },
  ];

  const submit = () => {
    if (!guess.trim()) return;
    const correct = guess.toLowerCase().includes(player.name.split(" ").pop().toLowerCase());
    if (correct) { setWon(true); setRevealed(true); return; }
    const newAttempts = [...attempts, guess.trim()];
    setAttempts(newAttempts);
    setGuess("");
    if (cluesRevealed < clues.length) setCluesRevealed(c => c + 1);
    if (newAttempts.length >= 6) setRevealed(true);
  };

  return (
    <div>
      <div className="game-header">
        <h1>👤 WHO ARE YA?</h1>
        <p>Guess the NBA player from the clues</p>
      </div>
      <div className="player-reveal">
        <span className={`player-silhouette ${!revealed ? "hidden" : ""}`}>{player.emoji}</span>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 1 }}>
          {revealed ? player.name : "??? ???"}
        </div>
      </div>
      <div className="clue-list">
        {clues.map((clue, i) => (
          <div key={i} className="clue-item">
            <span className="clue-label">{clue.label}</span>
            <span className={`clue-value ${i >= cluesRevealed ? "clue-hidden" : ""}`}>{clue.value}</span>
          </div>
        ))}
      </div>
      {attempts.length > 0 && (
        <div className="attempts" style={{ marginBottom: 12 }}>
          {attempts.map((a, i) => <span key={i} className="attempt-pill wrong">✗ {a}</span>)}
        </div>
      )}
      {!won && !revealed && (
        <>
          <input className="guess-input" value={guess} onChange={e => setGuess(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="Enter player name..." />
          <div className="btn-row">
            <button className="btn btn-primary" onClick={submit}>Guess</button>
          </div>
        </>
      )}
      {won && <div className="result-banner win"><div className="result-title">YOU GOT IT! 🏀</div><div className="result-sub">It was {player.name} in {attempts.length + 1} guess{attempts.length !== 0 ? "es" : ""}!</div></div>}
      {revealed && !won && <div className="result-banner lose"><div className="result-title">REVEALED</div><div className="result-sub">The answer was {player.name}</div></div>}
    </div>
  );
}

// ─── GAMES REGISTRY ───────────────────────────────────────────────────────────
const GAMES = [
  { id: "wordle",      emoji: "🔤", title: "Hoopdle",         desc: "Guess the NBA legend's name in 6 tries — Wordle style",         badge: "DAILY",    component: WordleGame },
  { id: "connections", emoji: "🔗", title: "Connections",     desc: "Group 16 players into 4 themed basketball categories",           badge: "DAILY",    component: ConnectionsGame },
  { id: "career",      emoji: "🗺️", title: "Career Path",     desc: "Identify the player from their team-by-team career journey",    badge: "DAILY",    component: CareerPathGame },
  { id: "grid",        emoji: "⬛", title: "Box2Box Grid",    desc: "Fill a 3×3 grid with players matching both team and position",   badge: "STRATEGY", component: Box2BoxGame },
  { id: "bingo",       emoji: "🎰", title: "Basketball Bingo", desc: "Mark your card as NBA facts and stats are read out",            badge: "LIVE",     component: BingoGame },
  { id: "who",         emoji: "👤", title: "Who Are Ya?",     desc: "Identify the mystery player from gradually revealed clues",      badge: "DAILY",    component: WhoAreYaGame },
];

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeGame, setActiveGame] = useState(null);
  const game = GAMES.find(g => g.id === activeGame);

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo" onClick={() => setActiveGame(null)}>
            🏀 <span>BALL</span>IQ
          </div>
          {activeGame && <button className="nav-back" onClick={() => setActiveGame(null)}>← All Games</button>}
        </nav>

        {!activeGame ? (
          <>
            <div className="hero">
              <div className="hero-eyebrow">The Ultimate Basketball Brain Test</div>
              <h1 className="hero-title">BALL<br /><span className="accent">IQ</span></h1>
              <p className="hero-sub">Daily basketball trivia games for true hoops fans. Test your knowledge of NBA legends, teams, and history.</p>
            </div>
            <div className="games-section">
              <div className="section-label">Choose your game</div>
              <div className="games-grid">
                {GAMES.map(g => (
                  <div key={g.id} className="game-card" onClick={() => setActiveGame(g.id)}>
                    <span className="game-emoji">{g.emoji}</span>
                    <div className="game-title">{g.title}</div>
                    <div className="game-desc">{g.desc}</div>
                    <div className="game-badge">{g.badge}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="game-wrapper">
            {game && <game.component />}
          </div>
        )}
      </div>
    </>
  );
}