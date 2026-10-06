const fs = require('fs');

const assets = JSON.parse(fs.readFileSync('assets_b64.json'));
const boardB64 = assets.board;
const titleB64 = assets.title;
const avatarB64 = assets.avatar;

const starterQuestions = [
  { q: "What is 2 + 3?", a: "5", options: ["4", "5", "6", "7"] },
  { q: "Which planet is known as the Red Planet?", a: "Mars", options: ["Venus", "Mars", "Jupiter", "Saturn"] },
  { q: "How many days are in a leap year?", a: "366", options: ["364", "365", "366", "367"] },
  { q: "What is the capital of France?", a: "Paris", options: ["Berlin", "Madrid", "Rome", "Paris"] },
  { q: "What gas do plants absorb from the air?", a: "Carbon dioxide", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"] },
  { q: "What is 7 multiplied by 8?", a: "56", options: ["54", "56", "58", "64"] },
  { q: "How many continents are there on Earth?", a: "7", options: ["5", "6", "7", "8"] },
  { q: "What is the largest mammal in the world?", a: "Blue whale", options: ["African Elephant", "Blue whale", "Giraffe", "Hippopotamus"] },
  { q: "What is the freezing point of water in Celsius?", a: "0°C", options: ["-5°C", "0°C", "32°C", "100°C"] },
  { q: "How many sides does an octagon have?", a: "8", options: ["6", "7", "8", "10"] },
  { q: "What is the hardest natural mineral?", a: "Diamond", options: ["Gold", "Granite", "Diamond", "Quartz"] },
  { q: "What is 15 divided by 3?", a: "5", options: ["3", "4", "5", "6"] },
  { q: "Which ocean is the largest on Earth?", a: "Pacific", options: ["Atlantic", "Indian", "Pacific", "Arctic"] },
  { q: "What is the color of an emerald gemstone?", a: "Green", options: ["Blue", "Red", "Green", "Yellow"] },
  { q: "How many hours are in 2 days?", a: "48", options: ["24", "36", "48", "72"] },
  { q: "What do bees collect to make honey?", a: "Nectar", options: ["Pollen", "Nectar", "Leaves", "Sap"] },
  { q: "What is 9 squared (9 x 9)?", a: "81", options: ["72", "81", "90", "99"] },
  { q: "Which season comes after winter?", a: "Spring", options: ["Summer", "Autumn", "Spring", "Monsoon"] },
  { q: "What is the boiling point of water in Celsius?", a: "100°C", options: ["50°C", "90°C", "100°C", "212°C"] },
  { q: "What is the name of our home galaxy?", a: "Milky Way", options: ["Andromeda", "Milky Way", "Whirlpool", "Sombrero"] }
];

const htmlContent = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Snakes and Ladder</title>
  <meta name="description" content="An interactive 3D Snakes and Ladder learning game featuring local multiplayer, CPU opponent, choose-the-correct-answer quizzes, trophies, dice physics, and Web Audio sound effects.">
  <meta property="og:title" content="Snakes and Ladder">
  <meta property="og:description" content="An interactive 3D Snakes and Ladder learning game featuring local multiplayer, CPU opponent, choose-the-correct-answer quizzes, trophies, dice physics, and Web Audio sound effects.">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <style>
    /* CSS Reset & System Rounded Typography */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      min-height: 100vh;
      width: 100%;
      overflow-x: hidden;
      font-family: 'Trebuchet MS', 'Arial Rounded MT Bold', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: radial-gradient(circle at 50% 20%, #0d2856 0%, #081738 50%, #030a1c 100%);
      color: #ffffff;
      line-height: 1.4;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 24px;
    }

    /* Screen Reader Only Utility */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Header & Mandatory Title */
    .app-header {
      width: 100%;
      max-width: 1320px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .title-img {
      width: min(72vw, 720px);
      height: 120px;
      object-fit: cover;
      object-position: left 40%;
      filter: drop-shadow(0 8px 16px rgba(0, 20, 60, 0.85));
      display: block;
    }

    .sound-toggle-btn {
      background: linear-gradient(135deg, #094b9e 0%, #062b61 100%);
      border: 2px solid #40e8ff;
      color: #e0f4ff;
      border-radius: 9999px;
      padding: 10px 18px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3);
      transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .sound-toggle-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(64, 232, 255, 0.4);
    }

    .sound-toggle-btn:focus-visible {
      outline: 3px solid #ffd85b;
      outline-offset: 2px;
    }

    /* Outer Wrapper */
    .main-container {
      width: 100%;
      max-width: 1320px;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* SETTINGS SCREEN */
    .settings-panel {
      width: 100%;
      max-width: 840px;
      background: linear-gradient(165deg, rgba(9, 45, 102, 0.95) 0%, rgba(4, 22, 56, 0.98) 100%);
      border: 3px solid #40e8ff;
      border-radius: 24px;
      padding: clamp(20px, 4vw, 36px);
      box-shadow: 0 0 35px rgba(255, 215, 0, 0.35), 0 12px 30px rgba(0, 0, 0, 0.6);
      margin-top: 10px;
    }

    .settings-panel h1 {
      font-size: clamp(26px, 4vw, 34px);
      color: #ffd85b;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
      margin-bottom: 6px;
      text-align: center;
    }

    .settings-subtitle {
      color: #aae0ff;
      font-size: clamp(14px, 2vw, 17px);
      text-align: center;
      margin-bottom: 28px;
    }

    .settings-section {
      background: rgba(3, 14, 38, 0.6);
      border: 1px solid rgba(64, 232, 255, 0.3);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 22px;
    }

    .settings-section-title {
      font-size: 18px;
      font-weight: 700;
      color: #ffd85b;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Mode Selection Cards */
    .mode-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .mode-card {
      background: linear-gradient(145deg, #0d3875 0%, #07224d 100%);
      border: 2px solid rgba(64, 232, 255, 0.4);
      border-radius: 14px;
      padding: 16px 12px;
      color: #ffffff;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s ease;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }

    .mode-card:hover {
      border-color: #40e8ff;
      transform: translateY(-2px);
    }

    .mode-card[aria-pressed="true"], .mode-card.active {
      border-color: #ffd85b;
      background: linear-gradient(145deg, #1852a3 0%, #0e3472 100%);
      outline: 3px solid #ffd85b;
      box-shadow: 0 0 16px rgba(255, 216, 91, 0.6);
    }

    .player-count-group {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid rgba(64, 232, 255, 0.2);
    }

    .count-btn {
      flex: 1;
      min-width: 50px;
      padding: 10px;
      background: #092c61;
      border: 2px solid rgba(64, 232, 255, 0.4);
      color: #ffffff;
      font-weight: 700;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .count-btn.active, .count-btn[aria-pressed="true"] {
      border-color: #ffd85b;
      background: #1878ee;
      box-shadow: 0 0 10px rgba(255, 216, 91, 0.5);
    }

    /* Player Names Form */
    .player-inputs-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .player-input-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .player-badge-dot {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 13px;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
      flex-shrink: 0;
    }

    .text-input {
      flex: 1;
      padding: 10px 14px;
      border-radius: 10px;
      border: 2px solid rgba(64, 232, 255, 0.4);
      background: #041433;
      color: #ffffff;
      font-size: 15px;
      font-family: inherit;
    }

    .text-input:focus {
      outline: none;
      border-color: #ffd85b;
      box-shadow: 0 0 8px rgba(255, 216, 91, 0.5);
    }

    .names-action-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 14px;
      flex-wrap: wrap;
    }

    .btn-save-names {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      font-weight: 700;
      padding: 10px 20px;
      border-radius: 10px;
      border: 2px solid #34d399;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      transition: all 0.15s ease;
    }

    .btn-save-names:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(16, 185, 129, 0.4);
    }

    .names-save-status {
      font-size: 14px;
      font-weight: 700;
      color: #34d399;
    }

    .names-save-status.unsaved {
      color: #f59e0b;
    }

    /* Question Editor Details */
    details.question-details {
      background: rgba(3, 14, 38, 0.6);
      border: 1px solid rgba(64, 232, 255, 0.3);
      border-radius: 16px;
      padding: 16px 20px;
      margin-bottom: 24px;
    }

    details.question-details summary {
      font-size: 18px;
      font-weight: 700;
      color: #ffd85b;
      cursor: pointer;
      user-select: none;
      outline: none;
      padding: 4px 0;
    }

    details.question-details summary:focus-visible {
      outline: 2px solid #ffd85b;
      outline-offset: 4px;
    }

    .q-editor-content {
      padding-top: 18px;
    }

    .editor-mode-tab-title {
      font-size: 15px;
      font-weight: 700;
      color: #67e8f9;
      margin-bottom: 8px;
    }

    .bulk-textareas-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 12px;
    }

    .bulk-textarea {
      width: 100%;
      height: 120px;
      background: #041433;
      border: 2px solid rgba(64, 232, 255, 0.4);
      border-radius: 10px;
      padding: 10px;
      color: #ffffff;
      font-family: inherit;
      font-size: 13px;
      resize: vertical;
    }

    .bulk-textarea:focus {
      outline: none;
      border-color: #ffd85b;
    }

    .btn-secondary {
      background: #0b3979;
      color: #ffffff;
      font-weight: 700;
      border: 2px solid #40e8ff;
      border-radius: 8px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.15s ease;
    }

    .btn-secondary:hover {
      background: #124d9e;
      border-color: #ffd85b;
    }

    .single-editor-box {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(64, 232, 255, 0.2);
    }

    .single-editor-fields {
      display: grid;
      grid-template-columns: 100px 1.2fr 1fr 1.2fr;
      gap: 10px;
      margin-bottom: 12px;
    }

    .editor-status-msg {
      margin-top: 8px;
      font-size: 14px;
      font-weight: 700;
      min-height: 20px;
    }

    .editor-status-msg.success { color: #34d399; }
    .editor-status-msg.error { color: #f87171; }

    /* Start Game Big Button */
    .btn-start-game {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #10b981 0%, #047857 100%);
      border: 3px solid #6ee7b7;
      border-radius: 16px;
      color: #ffffff;
      font-size: 22px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 0 25px rgba(16, 185, 129, 0.5), 0 6px 16px rgba(0, 0, 0, 0.4);
      transition: all 0.2s ease;
      letter-spacing: 0.5px;
    }

    .btn-start-game:hover {
      transform: translateY(-2px) scale(1.01);
      box-shadow: 0 0 35px rgba(16, 185, 129, 0.7), 0 8px 22px rgba(0, 0, 0, 0.5);
    }

    .btn-start-game:focus-visible {
      outline: 4px solid #ffd85b;
      outline-offset: 3px;
    }

    /* GAME SCREEN */
    .game-screen {
      width: 100%;
      display: none;
      flex-direction: column;
      align-items: center;
    }

    .game-nav-bar {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }

    .nav-btn {
      background: #092c61;
      border: 2px solid #40e8ff;
      color: #e0f4ff;
      border-radius: 12px;
      padding: 10px 18px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      transition: all 0.15s ease;
    }

    .nav-btn:hover {
      background: #0f4089;
      border-color: #ffd85b;
      transform: translateY(-1px);
    }

    .game-layout-grid {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 310px;
      gap: 24px;
      align-items: start;
    }

    /* BOARD COLUMN */
    .board-column {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Metallic Rounded Board Frame with Golden Halo */
    .board-frame-container {
      position: relative;
      width: 100%;
      border-radius: 20px;
      background: linear-gradient(135deg, #02a5eb 0%, #0876ed 35%, #582bc2 70%, #40e8ff 100%);
      padding: 10px;
      box-shadow: 
        0 0 35px rgba(255, 215, 0, 0.45),
        0 0 15px rgba(64, 232, 255, 0.6),
        inset 0 0 20px rgba(8, 118, 237, 0.6),
        0 16px 36px rgba(0, 10, 30, 0.8);
      overflow: hidden;
    }

    .board-aspect-box {
      position: relative;
      width: 100%;
      aspect-ratio: 5 / 4;
      border-radius: 14px;
      overflow: hidden;
      background: #061838;
    }

    /* Mandatory Board Asset Alignment */
    .board-artwork-img {
      position: absolute;
      left: 49.5%;
      top: 52.8%;
      width: 120%;
      height: 123%;
      transform: translate(-50%, -50%);
      object-fit: fill;
      pointer-events: none;
      user-select: none;
      z-index: 1;
    }

    /* 5x4 Serpentine Board Hit Areas Grid */
    .board-squares-grid {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(4, 1fr);
      z-index: 2;
    }

    .square-hit-area {
      position: relative;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.001);
    }

    /* Question Button on Squares */
    .q-btn {
      position: absolute;
      top: 11%;
      right: 7%;
      width: clamp(22px, 3.4vw, 34px);
      height: clamp(22px, 3.4vw, 34px);
      border-radius: 50%;
      border: 2px solid #ffffff;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-weight: 900;
      font-size: clamp(12px, 1.8vw, 17px);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.6);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      z-index: 5;
    }

    /* Square 10 specific offset so it doesn't cover baked number 10 */
    .square-hit-area[data-square="10"] .q-btn {
      right: 24%;
    }

    /* Column repeating colors */
    .q-btn.col-1 { background: #18a75b; }
    .q-btn.col-2 { background: #1878ee; }
    .q-btn.col-3 { background: #8a4de1; }
    .q-btn.col-4 { background: #ff5d66; }
    .q-btn.col-5 { background: #ef8b20; }

    /* When saved question exists, turn green with soft green glow */
    .q-btn.has-saved-question {
      background: #18a75b !important;
      box-shadow: 0 0 12px rgba(24, 167, 91, 0.9), 0 2px 6px rgba(0, 0, 0, 0.4) !important;
    }

    .q-btn:hover {
      transform: scale(1.15);
    }

    .q-btn:focus-visible {
      outline: 3px solid #ffd85b;
      outline-offset: 2px;
    }

    /* Tokens Layer inside Board Aspect Box */
    .tokens-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
    }

    /* Player Token Component */
    .player-token {
      position: absolute;
      width: clamp(24px, 4vw, 42px);
      height: clamp(24px, 4vw, 42px);
      border-radius: 50%;
      border: 2px solid #ffffff;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: clamp(12px, 2vw, 17px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.5);
      transition: left 0.25s ease-out, top 0.25s ease-out, transform 0.25s ease-out;
      transform: translate(-50%, -50%);
      pointer-events: auto;
      user-select: none;
    }

    .player-token.hop {
      transform: translate(-50%, -50%) translateY(-16px) scale(1.1);
    }

    /* STARTING DOCK */
    .starting-dock {
      background: linear-gradient(145deg, #061c47 0%, #030e24 100%);
      border: 2px solid #40e8ff;
      border-radius: 16px;
      padding: 12px 18px;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .starting-dock h3 {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #40e8ff;
      text-align: center;
    }

    .dock-slot {
      position: relative;
      min-height: 48px;
      width: 100%;
      background: rgba(4, 15, 38, 0.8);
      border: 1px dashed rgba(64, 232, 255, 0.4);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Crying Emoji Overlay on Snake Bite */
    .snake-cry-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      font-size: clamp(60px, 12vw, 110px);
      z-index: 50;
      pointer-events: none;
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.8));
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .snake-cry-overlay.show {
      transform: translate(-50%, -50%) scale(1);
    }

    /* RIGHT CONTROL COLUMN */
    .control-column {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .control-panel {
      width: 100%;
      background: linear-gradient(180deg, #fffdf7 0%, #f7f1e5 100%);
      border: 3.5px solid #40e8ff;
      outline: 3px solid #0876ed;
      outline-offset: 2px;
      border-radius: 24px;
      padding: 20px 16px;
      box-shadow: 0 14px 32px rgba(0, 15, 45, 0.65);
      color: #1a2744;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .turn-header {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #0876ed;
      text-transform: uppercase;
      text-align: center;
    }

    .active-player-name {
      font-size: 22px;
      font-weight: 900;
      color: #0d2856;
      text-align: center;
      margin-top: -8px;
    }

    .turn-status {
      font-size: 14px;
      font-weight: 700;
      color: #334155;
      text-align: center;
      min-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px 10px;
      background: rgba(8, 118, 237, 0.08);
      border-radius: 10px;
      width: 100%;
    }

    /* Mascot Avatar + Floating Animated Question Marks */
    .dice-stage-row {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      gap: 12px;
      padding: 8px 0;
    }

    .mascot-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .floating-mascot-questions {
      position: absolute;
      top: -24px;
      display: flex;
      gap: 10px;
      font-size: 18px;
      font-weight: 900;
      color: #0876ed;
      text-shadow: 0 0 8px rgba(64, 232, 255, 0.8);
      pointer-events: none;
    }

    .floating-mascot-questions span {
      display: inline-block;
      animation: floatQ 1.8s ease-in-out infinite alternate;
    }
    .floating-mascot-questions span:nth-child(2) { animation-delay: 0.4s; }
    .floating-mascot-questions span:nth-child(3) { animation-delay: 0.8s; }

    @keyframes floatQ {
      0% { transform: translateY(0) scale(0.9); }
      100% { transform: translateY(-7px) scale(1.15); color: #ff5d66; }
    }

    .mascot-avatar-box {
      width: 84px;
      height: 98px;
      border-radius: 14px;
      border: 3px solid #40e8ff;
      overflow: hidden;
      background: #0d2856;
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
      flex-shrink: 0;
    }

    .mascot-avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* STATIONARY 96x96px DICE BUTTON & 3D CSS CUBE */
    .dice-btn {
      width: 96px;
      height: 96px;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 600px;
      outline: none;
      border-radius: 16px;
      position: relative;
    }

    .dice-btn:focus-visible {
      outline: 3px solid #0876ed;
      outline-offset: 4px;
    }

    .dice-cube {
      width: 76px;
      height: 76px;
      position: relative;
      transform-style: preserve-3d;
      transform: rotateX(-12deg) rotateY(16deg);
      transition: transform 1s cubic-bezier(0.2, 0.8, 0.3, 1);
    }

    .dice-face {
      position: absolute;
      width: 76px;
      height: 76px;
      background: linear-gradient(135deg, #32dfff 0%, #087cf4 30%, #0a439f 70%, #061c52 100%);
      border: 2px solid #ffd85b;
      border-radius: 15px;
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 8px rgba(64, 232, 255, 0.5);
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      padding: 8px;
      align-items: center;
      justify-items: center;
    }

    /* 6 Faces Placed at 38px */
    .face-front  { transform: translateZ(38px); }
    .face-back   { transform: rotateY(180deg) translateZ(38px); }
    .face-right  { transform: rotateY(90deg) translateZ(38px); }
    .face-left   { transform: rotateY(-90deg) translateZ(38px); }
    .face-top    { transform: rotateX(90deg) translateZ(38px); }
    .face-bottom { transform: rotateX(-90deg) translateZ(38px); }

    /* Recessed Glowing Golden Pips */
    .pip {
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: radial-gradient(circle, #fff7c2 0%, #ffd85b 60%, #b8860b 100%);
      box-shadow: 0 0 6px #ffd85b, inset 0 1px 2px rgba(0, 0, 0, 0.6);
    }

    /* Pip Grid Positioning */
    .pip-c  { grid-column: 2; grid-row: 2; }
    .pip-tl { grid-column: 1; grid-row: 1; }
    .pip-tr { grid-column: 3; grid-row: 1; }
    .pip-ml { grid-column: 1; grid-row: 2; }
    .pip-mr { grid-column: 3; grid-row: 2; }
    .pip-bl { grid-column: 1; grid-row: 3; }
    .pip-br { grid-column: 3; grid-row: 3; }

    /* Glowing Move Spaces Button */
    .btn-move-spaces {
      width: 100%;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      border: 3px solid #6ee7b7;
      border-radius: 14px;
      padding: 12px 18px;
      font-size: 17px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 0 18px rgba(16, 185, 129, 0.6);
      animation: pulseGlow 1.2s infinite alternate;
      display: none;
      text-align: center;
    }

    @keyframes pulseGlow {
      0% { transform: scale(1); box-shadow: 0 0 12px rgba(16, 185, 129, 0.5); }
      100% { transform: scale(1.02); box-shadow: 0 0 22px rgba(16, 185, 129, 0.9); }
    }

    /* Player List & Trophy Counter */
    .player-list-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .player-item-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-radius: 12px;
      background: #f1ebd9;
      border: 2px solid transparent;
      transition: all 0.2s ease;
    }

    .player-item-card.active-turn {
      background: #ffffff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-width: 2px;
    }

    .player-info-left {
      display: flex;
      align-items: center;
      gap: 10px;
      overflow: hidden;
    }

    .player-item-name {
      font-size: 15px;
      font-weight: 800;
      color: #1a2744;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 130px;
    }

    .trophy-badge {
      font-size: 15px;
      font-weight: 800;
      color: #b45309;
      background: #fef3c7;
      border: 1px solid #fcd34d;
      padding: 4px 8px;
      border-radius: 9999px;
      white-space: nowrap;
    }

    /* AUTHOR FOOTER SIGNATURE - Under control box */
    .author-signature-block {
      margin-top: 18px;
      text-align: center;
      user-select: none;
    }

    .signature-author-name {
      font-size: 18px;
      font-weight: 900;
      color: #ffd85b;
      text-shadow: 0 0 12px rgba(255, 216, 91, 0.8), 0 2px 4px rgba(0, 0, 0, 0.9);
      letter-spacing: 0.5px;
    }

    .signature-author-role {
      font-size: 13px;
      font-weight: 600;
      color: #fce7b0;
      margin-top: 2px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    }

    /* QUESTION MODAL DIALOG - CHOOSE THE CORRECT ANSWER */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(3, 10, 28, 0.88);
      backdrop-filter: blur(5px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 16px;
    }

    .modal-window {
      width: 100%;
      max-width: 560px;
      background: linear-gradient(165deg, #0d3875 0%, #061e47 100%);
      border: 3.5px solid #40e8ff;
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 0 40px rgba(64, 232, 255, 0.5), 0 20px 40px rgba(0, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .modal-window h2 {
      font-size: 22px;
      color: #ffd85b;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    }

    .modal-question-text {
      font-size: 19px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.4;
      background: rgba(4, 15, 38, 0.75);
      border: 1.5px solid rgba(64, 232, 255, 0.35);
      padding: 16px;
      border-radius: 14px;
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4);
    }

    .modal-instruction {
      font-size: 14px;
      font-weight: 800;
      color: #67e8f9;
      letter-spacing: 1px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Multiple Choice Grid */
    .modal-choices-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 2px;
    }

    .choice-btn {
      background: linear-gradient(145deg, #0a2e66 0%, #051a3d 100%);
      border: 2px solid rgba(64, 232, 255, 0.4);
      border-radius: 14px;
      padding: 14px 14px;
      color: #ffffff;
      font-size: 16px;
      font-weight: 700;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.15s ease;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      position: relative;
      user-select: none;
    }

    .choice-btn:hover {
      border-color: #40e8ff;
      background: linear-gradient(145deg, #10428d 0%, #092857 100%);
      transform: translateY(-2px);
    }

    .choice-btn:focus-visible {
      outline: 3px solid #ffd85b;
      outline-offset: 2px;
    }

    .choice-btn.selected {
      border-color: #ffd85b !important;
      background: linear-gradient(145deg, #1653a6 0%, #0c3672 100%) !important;
      box-shadow: 0 0 16px rgba(255, 216, 91, 0.7) !important;
      outline: 2px solid #ffd85b;
    }

    .choice-btn.is-correct {
      border-color: #34d399 !important;
      background: linear-gradient(145deg, #057a55 0%, #03543f 100%) !important;
      box-shadow: 0 0 18px rgba(52, 211, 153, 0.9) !important;
    }

    .choice-btn.is-wrong {
      border-color: #f87171 !important;
      background: linear-gradient(145deg, #991b1b 0%, #7f1d1d 100%) !important;
      box-shadow: 0 0 16px rgba(248, 113, 113, 0.7) !important;
      animation: shakeChoice 0.35s ease-in-out;
    }

    @keyframes shakeChoice {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-6px); }
      50% { transform: translateX(6px); }
      75% { transform: translateX(-4px); }
    }

    .choice-letter {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(64, 232, 255, 0.2);
      border: 1.5px solid #40e8ff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 900;
      color: #ffd85b;
      flex-shrink: 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .choice-btn.selected .choice-letter {
      background: #ffd85b;
      color: #07224d;
      border-color: #ffffff;
    }

    .choice-btn.is-correct .choice-letter {
      background: #34d399;
      color: #064e3b;
      border-color: #ffffff;
    }

    .choice-btn.is-wrong .choice-letter {
      background: #f87171;
      color: #ffffff;
      border-color: #ffffff;
    }

    .choice-text {
      flex: 1;
      word-break: break-word;
    }

    .modal-actions-row {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 12px;
      margin-top: 4px;
    }

    .modal-feedback {
      font-size: 15px;
      font-weight: 800;
      min-height: 24px;
    }
    .modal-feedback.correct { color: #34d399; }
    .modal-feedback.incorrect { color: #f87171; }
    .modal-feedback.warn { color: #f59e0b; }

    /* FULL-SCREEN VICTORY OVERLAY */
    .victory-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, rgba(14, 52, 114, 0.98) 0%, rgba(4, 18, 48, 0.99) 100%);
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 200;
      padding: 24px;
      text-align: center;
    }

    .victory-content-card {
      background: linear-gradient(145deg, #0a2d66 0%, #051636 100%);
      border: 4px solid #ffd85b;
      border-radius: 28px;
      padding: clamp(24px, 5vw, 44px);
      box-shadow: 0 0 50px rgba(255, 216, 91, 0.6), 0 20px 50px rgba(0, 0, 0, 0.8);
      max-width: 560px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      position: relative;
      z-index: 210;
    }

    .victory-trophy-icon {
      font-size: clamp(64px, 12vw, 96px);
      filter: drop-shadow(0 0 20px #ffd85b);
      animation: bounceTrophy 1.5s infinite alternate;
    }

    @keyframes bounceTrophy {
      0% { transform: translateY(0) scale(1); }
      100% { transform: translateY(-12px) scale(1.08); }
    }

    .victory-title {
      font-size: clamp(32px, 6vw, 46px);
      color: #ffd85b;
      font-weight: 900;
      text-shadow: 0 3px 12px rgba(0, 0, 0, 0.8);
    }

    .victory-player-name {
      font-size: clamp(22px, 4vw, 28px);
      color: #40e8ff;
      font-weight: 800;
    }

    .victory-reason {
      font-size: 18px;
      color: #e0f2fe;
    }

    /* Confetti Particle Animation */
    .confetti-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
      z-index: 205;
    }

    .confetti-piece {
      position: absolute;
      width: 10px;
      height: 18px;
      opacity: 0.9;
      animation: confettiFall linear infinite;
    }

    @keyframes confettiFall {
      0% { transform: translateY(-40px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(105vh) rotate(720deg); opacity: 0.2; }
    }

    /* Toast Notification */
    .toast-notice {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #0d2856;
      border: 2px solid #ffd85b;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 15px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      z-index: 300;
      transition: transform 0.3s ease;
      pointer-events: none;
    }
    .toast-notice.show {
      transform: translateX(-50%) translateY(0);
    }

    /* RESPONSIVE DESIGN */
    @media (max-width: 850px) {
      .game-layout-grid {
        grid-template-columns: 1fr;
      }
      .control-panel {
        max-width: 440px;
      }
    }

    @media (max-width: 540px) {
      .modal-choices-grid {
        grid-template-columns: 1fr;
      }
      .single-editor-fields {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .app-header {
        padding: 8px 12px;
      }
      .title-img {
        width: min(64vw, 250px);
        height: 46px;
      }
      .sound-toggle-btn {
        padding: 8px 12px;
        font-size: 13px;
      }
      .settings-panel {
        padding: 16px;
        border-radius: 18px;
      }
      .mode-cards {
        grid-template-columns: 1fr;
      }
      .bulk-textareas-grid {
        grid-template-columns: 1fr;
      }
      .board-frame-container {
        padding: 6px;
        border-radius: 14px;
      }
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>

  <!-- Accessible Live Announcement Region -->
  <div id="srLiveAnnouncer" class="sr-only" aria-live="assertive"></div>

  <!-- Header & Mandatory Title Image -->
  <header class="app-header">
    <img src="${titleB64}" alt="SNAKES AND LADDER" class="title-img" />
    <button id="soundToggleBtn" class="sound-toggle-btn" aria-pressed="true" aria-label="Toggle sound">
      🔊 Sound on
    </button>
  </header>

  <main class="main-container">

    <!-- SETTINGS SCREEN -->
    <section id="settingsScreen" class="settings-panel" aria-labelledby="settingsHeading">
      <h1 id="settingsHeading">Set up your game</h1>
      <p class="settings-subtitle">Choose how to play, save the player names, and add your learning questions.</p>

      <!-- Play Modes -->
      <div class="settings-section">
        <div class="settings-section-title">🎮 Choose Mode</div>
        <div class="mode-cards" role="radiogroup" aria-label="Game Mode">
          <button id="modeCpuBtn" class="mode-card active" role="radio" aria-checked="true" aria-pressed="true">
            🤖 Versus computer
          </button>
          <button id="modeVariousBtn" class="mode-card" role="radio" aria-checked="false" aria-pressed="false">
            👥 Various players
          </button>
        </div>

        <div id="playerCountGroup" class="player-count-group" style="display: none;">
          <span style="font-weight: 700; color: #67e8f9; font-size: 15px;">Number of players:</span>
          <button class="count-btn active" data-count="2" aria-pressed="true">2</button>
          <button class="count-btn" data-count="3" aria-pressed="false">3</button>
          <button class="count-btn" data-count="4" aria-pressed="false">4</button>
          <button class="count-btn" data-count="5" aria-pressed="false">5</button>
        </div>
      </div>

      <!-- Player Names -->
      <div class="settings-section">
        <div class="settings-section-title">👤 Player Names (Optional)</div>
        <div id="playerInputsGrid" class="player-inputs-grid">
          <!-- Rendered dynamically based on mode and count -->
        </div>
        <div class="names-action-row">
          <button id="saveNamesBtn" class="btn-save-names">Save player names</button>
          <span id="namesSaveStatus" class="names-save-status">✓ Names loaded</span>
        </div>
      </div>

      <!-- Question Editor Details -->
      <details id="questionDetails" class="question-details">
        <summary>Add or edit my questions</summary>
        <div class="q-editor-content">
          <div class="editor-mode-tab-title">Bulk Import (1 to 20 matching questions & answers)</div>
          <div class="bulk-textareas-grid">
            <div>
              <label for="bulkQTextarea" style="font-size: 13px; font-weight: 700; color: #aae0ff; display: block; margin-bottom: 4px;">Questions, one per line</label>
              <textarea id="bulkQTextarea" class="bulk-textarea" placeholder="What is 2 + 2?&#10;What is the capital of France?"></textarea>
            </div>
            <div>
              <label for="bulkATextarea" style="font-size: 13px; font-weight: 700; color: #aae0ff; display: block; margin-bottom: 4px;">Answers, one per line</label>
              <textarea id="bulkATextarea" class="bulk-textarea" placeholder="4&#10;Paris"></textarea>
            </div>
          </div>
          <button id="importBulkBtn" class="btn-secondary">Import Bulk Questions</button>
          <div id="bulkStatusMsg" class="editor-status-msg" aria-live="polite"></div>

          <!-- Single Square Editor -->
          <div class="single-editor-box">
            <div class="editor-mode-tab-title">Single Square Editor</div>
            <div class="single-editor-fields">
              <div>
                <label for="singleSquareSelect" style="font-size: 13px; font-weight: 700; color: #aae0ff; display: block; margin-bottom: 4px;">Square</label>
                <select id="singleSquareSelect" class="text-input" style="padding: 9px;">
                  <!-- Options 1 to 20 -->
                </select>
              </div>
              <div>
                <label for="singleQInput" style="font-size: 13px; font-weight: 700; color: #aae0ff; display: block; margin-bottom: 4px;">Question</label>
                <input type="text" id="singleQInput" class="text-input" placeholder="Enter question" />
              </div>
              <div>
                <label for="singleAInput" style="font-size: 13px; font-weight: 700; color: #aae0ff; display: block; margin-bottom: 4px;">Correct Answer</label>
                <input type="text" id="singleAInput" class="text-input" placeholder="Correct choice" />
              </div>
              <div>
                <label for="singleDistractorsInput" style="font-size: 13px; font-weight: 700; color: #aae0ff; display: block; margin-bottom: 4px;">Other Choices</label>
                <input type="text" id="singleDistractorsInput" class="text-input" placeholder="e.g. Venus, Jupiter, Saturn" />
              </div>
            </div>
            <div style="display: flex; gap: 10px;">
              <button id="saveSingleSquareBtn" class="btn-secondary">Save this square</button>
              <button id="clearSingleSquareBtn" class="btn-secondary" style="border-color: #f87171; color: #fca5a5;">Clear this square</button>
            </div>
            <div id="singleStatusMsg" class="editor-status-msg" aria-live="polite"></div>
          </div>
        </div>
      </details>

      <button id="startGameBtn" class="btn-start-game">Start the game ▶</button>
    </section>

    <!-- GAME SCREEN -->
    <section id="gameScreen" class="game-screen" aria-label="Game Screen">
      <div class="game-nav-bar">
        <button id="backToSettingsBtn" class="nav-btn">← Back to settings</button>
        <button id="restartGameBtn" class="nav-btn">↻ Restart game</button>
      </div>

      <div class="game-layout-grid">
        <!-- BOARD COLUMN -->
        <div class="board-column">
          <div class="board-frame-container">
            <div id="boardAspectBox" class="board-aspect-box" aria-label="Snakes and Ladder Game Board, 20 Squares">
              <!-- Mandatory Board Image -->
              <img src="${boardB64}" alt="Snakes and Ladder Board Artwork" class="board-artwork-img" />

              <!-- 5x4 Grid for 20 Hit Areas and Question Buttons -->
              <div id="boardSquaresGrid" class="board-squares-grid"></div>

              <!-- Tokens Layer -->
              <div id="tokensLayer" class="tokens-layer"></div>

              <!-- Crying Emoji on Snake Bite -->
              <div id="snakeCryOverlay" class="snake-cry-overlay" aria-hidden="true">😭</div>
            </div>
          </div>

          <!-- STARTING DOCK -->
          <div class="starting-dock" aria-label="Starting Dock">
            <h3>STARTING DOCK</h3>
            <div id="dockSlot" class="dock-slot"></div>
          </div>
        </div>

        <!-- RIGHT CONTROL COLUMN -->
        <aside class="control-column" aria-label="Game Controls and Status">
          <div class="control-panel">
            <div class="turn-header">CURRENT TURN</div>
            <div id="activePlayerName" class="active-player-name">Player 1</div>
            <div id="turnStatus" class="turn-status" aria-live="polite">Click the dice to roll.</div>

            <!-- Avatar + 3D Dice Stage -->
            <div class="dice-stage-row">
              <div class="mascot-container" aria-label="Game Mascot">
                <div class="floating-mascot-questions" aria-hidden="true">
                  <span>?</span>
                  <span>?</span>
                  <span>?</span>
                </div>
                <div class="mascot-avatar-box">
                  <img src="${avatarB64}" alt="Side mascot avatar" class="mascot-avatar-img" />
                </div>
              </div>

              <!-- Stationary 96x96px Button with 3D 76x76px Cube -->
              <button id="diceBtn" class="dice-btn" aria-label="Roll dice">
                <div id="diceCube" class="dice-cube">
                  <!-- 1 (Front) -->
                  <div class="dice-face face-front">
                    <div class="pip pip-c"></div>
                  </div>
                  <!-- 6 (Back) -->
                  <div class="dice-face face-back">
                    <div class="pip pip-tl"></div>
                    <div class="pip pip-ml"></div>
                    <div class="pip pip-bl"></div>
                    <div class="pip pip-tr"></div>
                    <div class="pip pip-mr"></div>
                    <div class="pip pip-br"></div>
                  </div>
                  <!-- 3 (Right) -->
                  <div class="dice-face face-right">
                    <div class="pip pip-tr"></div>
                    <div class="pip pip-c"></div>
                    <div class="pip pip-bl"></div>
                  </div>
                  <!-- 4 (Left) -->
                  <div class="dice-face face-left">
                    <div class="pip pip-tl"></div>
                    <div class="pip pip-tr"></div>
                    <div class="pip pip-bl"></div>
                    <div class="pip pip-br"></div>
                  </div>
                  <!-- 5 (Top) -->
                  <div class="dice-face face-top">
                    <div class="pip pip-tl"></div>
                    <div class="pip pip-tr"></div>
                    <div class="pip pip-c"></div>
                    <div class="pip pip-bl"></div>
                    <div class="pip pip-br"></div>
                  </div>
                  <!-- 2 (Bottom) -->
                  <div class="dice-face face-bottom">
                    <div class="pip pip-tr"></div>
                    <div class="pip pip-bl"></div>
                  </div>
                </div>
              </button>
            </div>

            <!-- Glowing Move Spaces Button -->
            <button id="moveSpacesBtn" class="btn-move-spaces">Move 1 space</button>

            <!-- Player List & Trophies (Out of 15) -->
            <div id="playerListContainer" class="player-list-container"></div>
          </div>

          <!-- AUTHOR FOOTER SIGNATURE -->
          <footer class="author-signature-block">
            <div class="signature-author-name">Dr.Abir Wafa</div>
            <div class="signature-author-role">Head of EdTech at Edulixa</div>
          </footer>
        </aside>
      </div>
    </section>

  </main>

  <!-- QUESTION MODAL DIALOG - CHOOSE THE CORRECT ANSWER -->
  <div id="questionModal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <div class="modal-window">
      <h2 id="modalTitle">Square 1 question</h2>
      <div id="modalQuestionText" class="modal-question-text"></div>
      
      <div class="modal-instruction">✨ Choose the correct answer:</div>
      <div id="modalChoicesContainer" class="modal-choices-grid" role="radiogroup" aria-label="Answer choices">
        <!-- Multiple Choice Buttons Rendered Dynamically -->
      </div>

      <div id="modalFeedback" class="modal-feedback" aria-live="polite"></div>
      <div class="modal-actions-row">
        <button id="closeModalBtn" class="btn-secondary" style="border-color: #64748b;">Close</button>
        <button id="checkAnswerBtn" class="btn-secondary" style="background: #10b981; border-color: #34d399;">Check my answer</button>
      </div>
    </div>
  </div>

  <!-- VICTORY OVERLAY -->
  <div id="victoryOverlay" class="victory-overlay" role="dialog" aria-modal="true" aria-label="Game Victory">
    <div id="confettiContainer" class="confetti-container" aria-hidden="true"></div>
    <div class="victory-content-card">
      <div class="victory-trophy-icon">🏆</div>
      <h2 class="victory-title">Victory!</h2>
      <div id="victoryPlayerName" class="victory-player-name">Player 1</div>
      <div id="victoryReason" class="victory-reason">wins the game!</div>
      <button id="playAgainBtn" class="btn-start-game" style="margin-top: 10px;">Play again ↻</button>
    </div>
  </div>

  <!-- TOAST NOTICE -->
  <div id="toastNotice" class="toast-notice" role="alert"></div>

  <!-- SCRIPT LOGIC -->
  <script>
  (function () {
    'use strict';

    // Player Colors
    const PLAYER_COLORS = [
      '#ff5d66', // coral
      '#1878ee', // blue
      '#18a75b', // green
      '#8a4de1', // purple
      '#ef8b20'  // orange
    ];

    // Snakes & Ladders Map
    const LADDERS = { 2: 9, 7: 14, 12: 19 };
    const SNAKES = { 11: 10, 13: 8, 15: 6 };

    // Serpentine Grid Layout: 5 columns x 4 rows = 20 squares
    const GRID_SQUARES = [
      [20, 19, 18, 17, 16],
      [11, 12, 13, 14, 15],
      [10, 9, 8, 7, 6],
      [1, 2, 3, 4, 5]
    ];

    const DICE_FACE_ROTATIONS = {
      1: { x: 0, y: 0 },
      2: { x: 90, y: 0 },
      3: { x: 0, y: -90 },
      4: { x: 0, y: 90 },
      5: { x: -90, y: 0 },
      6: { x: 0, y: 180 }
    };

    // State Object
    const state = {
      mode: 'cpu', // 'cpu' or 'various'
      playerCount: 2,
      savedNames: [],
      players: [],
      activeIndex: 0,
      rolledValue: 0,
      busy: false,
      soundEnabled: true,
      questions: [],
      openSquare: null,
      selectedChoice: null,
      gameOver: false,
      cpuTimeoutId: null
    };

    // Audio Context (Synthesized Web Audio API)
    let audioCtx = null;

    function getAudioContext() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    // Sound Synthesizers
    function playTone(freq, duration, type, gainVal, delay) {
      if (!state.soundEnabled) return;
      const ctx = getAudioContext();
      if (!ctx) return;
      setTimeout(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = type || 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(gainVal || 0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + duration);
        } catch (e) {}
      }, delay || 0);
    }

    const sounds = {
      save: () => {
        playTone(523.25, 0.15, 'triangle', 0.2, 0);
        playTone(659.25, 0.2, 'triangle', 0.2, 120);
      },
      roll: () => {
        for (let i = 0; i < 8; i++) {
          playTone(200 + Math.random() * 300, 0.05, 'sawtooth', 0.1, i * 70);
        }
      },
      step: () => {
        playTone(440, 0.12, 'sine', 0.25, 0);
        playTone(660, 0.1, 'sine', 0.2, 60);
      },
      blocked: () => {
        playTone(180, 0.2, 'sawtooth', 0.2, 0);
        playTone(140, 0.25, 'sawtooth', 0.25, 120);
      },
      ladder: () => {
        [440, 554, 659, 880].forEach((f, idx) => {
          playTone(f, 0.18, 'triangle', 0.22, idx * 90);
        });
      },
      snake: () => {
        [600, 500, 400, 300, 200].forEach((f, idx) => {
          playTone(f, 0.15, 'sawtooth', 0.2, idx * 80);
        });
      },
      wrong: () => {
        playTone(220, 0.2, 'square', 0.2, 0);
        playTone(200, 0.3, 'square', 0.25, 140);
      },
      correct: () => {
        playTone(587, 0.15, 'sine', 0.25, 0);
        playTone(880, 0.3, 'sine', 0.3, 100);
      },
      trophy: () => {
        [523, 659, 783, 1046].forEach((f, idx) => {
          playTone(f, 0.25, 'triangle', 0.25, idx * 90);
        });
      },
      victory: () => {
        [523, 659, 783, 1046, 1318].forEach((f, idx) => {
          playTone(f, 0.35, 'triangle', 0.3, idx * 120);
        });
      }
    };

    // DOM Elements
    const elements = {
      soundToggleBtn: document.getElementById('soundToggleBtn'),
      srLiveAnnouncer: document.getElementById('srLiveAnnouncer'),
      settingsScreen: document.getElementById('settingsScreen'),
      gameScreen: document.getElementById('gameScreen'),
      modeCpuBtn: document.getElementById('modeCpuBtn'),
      modeVariousBtn: document.getElementById('modeVariousBtn'),
      playerCountGroup: document.getElementById('playerCountGroup'),
      playerInputsGrid: document.getElementById('playerInputsGrid'),
      saveNamesBtn: document.getElementById('saveNamesBtn'),
      namesSaveStatus: document.getElementById('namesSaveStatus'),
      questionDetails: document.getElementById('questionDetails'),
      bulkQTextarea: document.getElementById('bulkQTextarea'),
      bulkATextarea: document.getElementById('bulkATextarea'),
      importBulkBtn: document.getElementById('importBulkBtn'),
      bulkStatusMsg: document.getElementById('bulkStatusMsg'),
      singleSquareSelect: document.getElementById('singleSquareSelect'),
      singleQInput: document.getElementById('singleQInput'),
      singleAInput: document.getElementById('singleAInput'),
      singleDistractorsInput: document.getElementById('singleDistractorsInput'),
      saveSingleSquareBtn: document.getElementById('saveSingleSquareBtn'),
      clearSingleSquareBtn: document.getElementById('clearSingleSquareBtn'),
      singleStatusMsg: document.getElementById('singleStatusMsg'),
      startGameBtn: document.getElementById('startGameBtn'),
      backToSettingsBtn: document.getElementById('backToSettingsBtn'),
      restartGameBtn: document.getElementById('restartGameBtn'),
      boardAspectBox: document.getElementById('boardAspectBox'),
      boardSquaresGrid: document.getElementById('boardSquaresGrid'),
      tokensLayer: document.getElementById('tokensLayer'),
      dockSlot: document.getElementById('dockSlot'),
      snakeCryOverlay: document.getElementById('snakeCryOverlay'),
      activePlayerName: document.getElementById('activePlayerName'),
      turnStatus: document.getElementById('turnStatus'),
      diceBtn: document.getElementById('diceBtn'),
      diceCube: document.getElementById('diceCube'),
      moveSpacesBtn: document.getElementById('moveSpacesBtn'),
      playerListContainer: document.getElementById('playerListContainer'),
      questionModal: document.getElementById('questionModal'),
      modalTitle: document.getElementById('modalTitle'),
      modalQuestionText: document.getElementById('modalQuestionText'),
      modalChoicesContainer: document.getElementById('modalChoicesContainer'),
      modalFeedback: document.getElementById('modalFeedback'),
      checkAnswerBtn: document.getElementById('checkAnswerBtn'),
      closeModalBtn: document.getElementById('closeModalBtn'),
      victoryOverlay: document.getElementById('victoryOverlay'),
      victoryPlayerName: document.getElementById('victoryPlayerName'),
      victoryReason: document.getElementById('victoryReason'),
      playAgainBtn: document.getElementById('playAgainBtn'),
      confettiContainer: document.getElementById('confettiContainer'),
      toastNotice: document.getElementById('toastNotice')
    };

    function escapeText(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function announce(text) {
      if (elements.srLiveAnnouncer) {
        elements.srLiveAnnouncer.textContent = text;
      }
    }

    let toastTimeout = null;
    function showToast(msg) {
      elements.toastNotice.textContent = msg;
      elements.toastNotice.classList.add('show');
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        elements.toastNotice.classList.remove('show');
      }, 3000);
    }

    // Default Starters
    const defaultStarters = ${JSON.stringify(starterQuestions)};

    // Initialize Questions
    function loadQuestions() {
      state.questions = [];
      for (let i = 0; i < 20; i++) {
        state.questions.push({ q: '', a: '', options: [] });
      }

      try {
        const saved = localStorage.getItem('snakeTrailQuestions');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsed.forEach((item, idx) => {
              if (idx < 20 && item && typeof item === 'object') {
                const qText = String(item.q || '').trim();
                const aText = String(item.a || '').trim();
                let opts = [];
                if (Array.isArray(item.options) && item.options.length >= 2) {
                  opts = item.options.map(o => String(o || '').trim()).filter(Boolean);
                }
                state.questions[idx] = { q: qText, a: aText, options: opts };
              }
            });
            // If at least one question has content, return
            if (state.questions.some(q => q.q)) return;
          }
        }
      } catch (e) {}

      // Fallback to starter curriculum
      defaultStarters.forEach((item, idx) => {
        if (idx < 20) {
          state.questions[idx] = { q: item.q, a: item.a, options: [...item.options] };
        }
      });
      saveQuestions();
    }

    function saveQuestions() {
      try {
        localStorage.setItem('snakeTrailQuestions', JSON.stringify(state.questions));
      } catch (e) {}
    }

    // Build Multiple-Choice Options for a Question
    function getQuestionChoices(rec, allQuestions) {
      const correct = (rec.a || '').trim();
      let choices = [];

      if (Array.isArray(rec.options) && rec.options.length >= 2) {
        choices = rec.options.map(o => String(o).trim()).filter(Boolean);
      }

      // If less than 4 choices, fill with distractors
      if (choices.length < 4) {
        if (!choices.some(c => c.toLowerCase() === correct.toLowerCase())) {
          choices.unshift(correct);
        }

        // Try numeric distractors if numeric
        const numVal = parseFloat(correct);
        if (!isNaN(numVal) && String(numVal) === correct) {
          const offsets = [-2, -1, 1, 2, 3, 4, -3];
          for (const off of offsets) {
            const candidate = String(numVal + off);
            if (!choices.includes(candidate)) {
              choices.push(candidate);
            }
            if (choices.length >= 4) break;
          }
        }

        // Add answers from other questions
        for (const otherQ of allQuestions) {
          if (choices.length >= 4) break;
          const otherAns = (otherQ.a || '').trim();
          if (otherAns && !choices.some(c => c.toLowerCase() === otherAns.toLowerCase())) {
            choices.push(otherAns);
          }
        }

        // Fallbacks
        const fallbacks = ["None of these", "All of these", "True", "False"];
        for (const fb of fallbacks) {
          if (choices.length >= 4) break;
          if (!choices.some(c => c.toLowerCase() === fb.toLowerCase())) {
            choices.push(fb);
          }
        }
      }

      // Ensure correct answer is always present
      if (!choices.some(c => c.toLowerCase() === correct.toLowerCase())) {
        choices[0] = correct;
      }

      // Deduplicate
      const uniqueChoices = [];
      for (const ch of choices) {
        if (!uniqueChoices.some(u => u.toLowerCase() === ch.toLowerCase())) {
          uniqueChoices.push(ch);
        }
      }

      // Shuffle so correct answer position varies
      const shuffled = [...uniqueChoices];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
      }

      return shuffled.slice(0, 4);
    }

    // Initialize Saved Names
    function loadSavedNames() {
      try {
        const saved = localStorage.getItem('snakeTrailNames');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            state.savedNames = parsed.map(n => String(n || '').slice(0, 22));
            return;
          }
        }
      } catch (e) {}
      state.savedNames = [];
    }

    // Render Name Inputs in Settings Screen
    function renderPlayerInputs() {
      const isCpu = state.mode === 'cpu';
      const count = isCpu ? 2 : state.playerCount;
      elements.playerInputsGrid.innerHTML = '';

      for (let i = 0; i < count; i++) {
        const pNum = i + 1;
        const color = PLAYER_COLORS[i % PLAYER_COLORS.length];
        const isCpuSlot = isCpu && i === 1;
        const defaultName = isCpuSlot ? 'CPU' : 'P' + pNum;
        const savedVal = state.savedNames[i] !== undefined ? state.savedNames[i] : '';

        const row = document.createElement('div');
        row.className = 'player-input-row';

        const dot = document.createElement('div');
        dot.className = 'player-badge-dot';
        dot.style.background = color;
        dot.textContent = isCpuSlot ? 'C' : pNum;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'text-input';
        input.maxLength = 22;
        input.id = 'playerInput_' + i;
        input.setAttribute('data-idx', i);

        if (isCpuSlot) {
          input.value = 'CPU';
          input.disabled = true;
          input.style.opacity = '0.7';
          input.setAttribute('aria-label', 'Player 2 (CPU)');
        } else {
          input.value = savedVal;
          input.placeholder = defaultName + ' (optional)';
          input.setAttribute('aria-label', 'Player ' + pNum + ' Name');
          input.addEventListener('input', () => {
            elements.namesSaveStatus.textContent = 'Unsaved changes';
            elements.namesSaveStatus.className = 'names-save-status unsaved';
          });
        }

        row.appendChild(dot);
        row.appendChild(input);
        elements.playerInputsGrid.appendChild(row);
      }
    }

    // Single Square Editor Selector Population
    function populateSquareSelect() {
      elements.singleSquareSelect.innerHTML = '';
      for (let i = 1; i <= 20; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = 'Square ' + i;
        elements.singleSquareSelect.appendChild(opt);
      }
      updateSingleSquareInputs();
    }

    function updateSingleSquareInputs() {
      const sqNum = parseInt(elements.singleSquareSelect.value, 10);
      const rec = state.questions[sqNum - 1] || { q: '', a: '', options: [] };
      elements.singleQInput.value = rec.q;
      elements.singleAInput.value = rec.a;

      // Extract other choices (distractors)
      const distractors = (rec.options || []).filter(o => o.toLowerCase() !== (rec.a || '').toLowerCase());
      elements.singleDistractorsInput.value = distractors.join(', ');
      elements.singleStatusMsg.textContent = '';
    }

    // Build Board Hit Areas Grid
    function buildBoardGrid() {
      elements.boardSquaresGrid.innerHTML = '';
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 5; c++) {
          const sqNum = GRID_SQUARES[r][c];
          const colClass = 'col-' + (c + 1);

          const squareDiv = document.createElement('div');
          squareDiv.className = 'square-hit-area';
          squareDiv.setAttribute('data-square', sqNum);

          const qBtn = document.createElement('button');
          qBtn.className = 'q-btn ' + colClass;
          qBtn.setAttribute('data-square', sqNum);
          qBtn.setAttribute('aria-label', 'Open question for square ' + sqNum);

          const hasQ = state.questions[sqNum - 1] && state.questions[sqNum - 1].q.trim().length > 0;
          if (hasQ) {
            qBtn.classList.add('has-saved-question');
          }

          qBtn.innerHTML = '<span aria-hidden="true">?</span>';
          qBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            onQuestionBtnClick(sqNum);
          });

          squareDiv.appendChild(qBtn);
          elements.boardSquaresGrid.appendChild(squareDiv);
        }
      }
    }

    // Refresh Question Icons after updates
    function refreshQuestionIcons() {
      const btns = elements.boardSquaresGrid.querySelectorAll('.q-btn');
      btns.forEach(btn => {
        const sqNum = parseInt(btn.getAttribute('data-square'), 10);
        const hasQ = state.questions[sqNum - 1] && state.questions[sqNum - 1].q.trim().length > 0;
        if (hasQ) {
          btn.classList.add('has-saved-question');
        } else {
          btn.classList.remove('has-saved-question');
        }
      });
    }

    // Initialize Game Players
    function initPlayers() {
      const isCpu = state.mode === 'cpu';
      const count = isCpu ? 2 : state.playerCount;
      state.players = [];

      for (let i = 0; i < count; i++) {
        const pNum = i + 1;
        const color = PLAYER_COLORS[i % PLAYER_COLORS.length];
        let name = '';

        const input = document.getElementById('playerInput_' + i);
        if (input) {
          name = input.value.trim().slice(0, 22);
        }

        if (isCpu && i === 1) {
          name = 'CPU';
        } else if (!name) {
          name = 'P' + pNum;
        }

        state.players.push({
          id: i,
          num: pNum,
          name: name,
          isCpu: isCpu && i === 1,
          color: color,
          position: 0,
          trophies: 0,
          earnedSquares: new Set()
        });
      }

      state.activeIndex = 0;
      state.rolledValue = 0;
      state.busy = false;
      state.gameOver = false;
      clearTimeout(state.cpuTimeoutId);
    }

    // Render Player List in Control Column
    function renderPlayerList() {
      elements.playerListContainer.innerHTML = '';
      state.players.forEach((p, idx) => {
        const card = document.createElement('div');
        card.className = 'player-item-card' + (idx === state.activeIndex ? ' active-turn' : '');
        if (idx === state.activeIndex) {
          card.style.borderColor = p.color;
        }

        const left = document.createElement('div');
        left.className = 'player-info-left';

        const dot = document.createElement('div');
        dot.className = 'player-badge-dot';
        dot.style.background = p.color;
        dot.textContent = p.isCpu ? 'C' : p.num;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'player-item-name';
        nameSpan.textContent = p.name;

        left.appendChild(dot);
        left.appendChild(nameSpan);

        const trophyBadge = document.createElement('span');
        trophyBadge.className = 'trophy-badge';
        trophyBadge.textContent = '🏆 ' + p.trophies + '/15';

        card.appendChild(left);
        card.appendChild(trophyBadge);
        elements.playerListContainer.appendChild(card);
      });

      const activePlayer = state.players[state.activeIndex];
      if (activePlayer) {
        elements.activePlayerName.textContent = activePlayer.name;
        elements.activePlayerName.style.color = activePlayer.color;
      }
    }

    // Token Elements Management
    function setupTokens() {
      elements.tokensLayer.innerHTML = '';
      state.players.forEach(p => {
        const token = document.createElement('div');
        token.className = 'player-token';
        token.id = 'token_p' + p.id;
        token.style.background = p.color;
        token.textContent = p.isCpu ? 'C' : p.num;
        token.setAttribute('aria-label', p.name + ' Token');
        elements.tokensLayer.appendChild(token);
      });
      positionAllTokens();
    }

    // Precise Token Positioning & Multi-player Clustering
    function positionAllTokens() {
      const boardRect = elements.boardAspectBox.getBoundingClientRect();
      const dockSlotRect = elements.dockSlot.getBoundingClientRect();
      if (!boardRect.width) return;

      const posMap = {};
      state.players.forEach(p => {
        if (!posMap[p.position]) posMap[p.position] = [];
        posMap[p.position].push(p);
      });

      const tokenEl = document.querySelector('.player-token');
      const tokenSize = tokenEl ? tokenEl.getBoundingClientRect().width : 32;

      Object.keys(posMap).forEach(posKey => {
        const pos = parseInt(posKey, 10);
        const group = posMap[pos];
        const groupCount = group.length;

        let baseCenterX = 0;
        let baseCenterY = 0;

        if (pos === 0) {
          baseCenterX = dockSlotRect.left + dockSlotRect.width / 2 - boardRect.left;
          baseCenterY = dockSlotRect.top + dockSlotRect.height / 2 - boardRect.top;
        } else {
          const sqDiv = elements.boardSquaresGrid.querySelector('[data-square="' + pos + '"]');
          if (sqDiv) {
            const sqRect = sqDiv.getBoundingClientRect();
            baseCenterX = sqRect.left + sqRect.width / 2 - boardRect.left;
            baseCenterY = sqRect.top + sqRect.height / 2 - boardRect.top;
          }
        }

        group.forEach((p, index) => {
          let offsetX = 0;
          let offsetY = 0;

          if (groupCount === 1) {
            offsetX = 0;
            offsetY = 0;
          } else if (groupCount === 2) {
            const dist = tokenSize * 0.45;
            offsetX = index === 0 ? -dist : dist;
            offsetY = 0;
          } else if (groupCount === 3) {
            const dist = tokenSize * 0.42;
            if (index === 0) { offsetX = -dist; offsetY = -dist * 0.7; }
            else if (index === 1) { offsetX = dist; offsetY = -dist * 0.7; }
            else { offsetX = 0; offsetY = dist * 0.7; }
          } else if (groupCount === 4) {
            const dist = tokenSize * 0.42;
            if (index === 0) { offsetX = -dist; offsetY = -dist; }
            else if (index === 1) { offsetX = dist; offsetY = -dist; }
            else if (index === 2) { offsetX = -dist; offsetY = dist; }
            else { offsetX = dist; offsetY = dist; }
          } else if (groupCount === 5) {
            const dist = tokenSize * 0.46;
            if (index === 0) { offsetX = -dist; offsetY = -dist; }
            else if (index === 1) { offsetX = dist; offsetY = -dist; }
            else if (index === 2) { offsetX = -dist; offsetY = dist; }
            else if (index === 3) { offsetX = dist; offsetY = dist; }
            else { offsetX = 0; offsetY = 0; }
          }

          const tokenNode = document.getElementById('token_p' + p.id);
          if (tokenNode) {
            tokenNode.style.left = (baseCenterX + offsetX) + 'px';
            tokenNode.style.top = (baseCenterY + offsetY) + 'px';
          }
        });
      });
    }

    // Realistic 3D Dice Roll
    function rollDiceAction() {
      if (state.busy || state.gameOver) return;
      const player = state.players[state.activeIndex];
      if (!player) return;

      state.busy = true;
      elements.diceBtn.disabled = true;
      elements.moveSpacesBtn.style.display = 'none';

      sounds.roll();
      elements.turnStatus.textContent = player.name + ' is rolling...';
      announce(player.name + ' is rolling the dice');

      const rollVal = Math.floor(Math.random() * 6) + 1;
      state.rolledValue = rollVal;

      const targetRot = DICE_FACE_ROTATIONS[rollVal];
      const extraSpinX = 720 + (Math.floor(Math.random() * 2) * 360);
      const extraSpinY = 720 + (Math.floor(Math.random() * 2) * 360);
      const finalX = targetRot.x + extraSpinX - 12;
      const finalY = targetRot.y + extraSpinY + 16;

      elements.diceCube.style.transform = 'rotateX(' + finalX + 'deg) rotateY(' + finalY + 'deg)';

      setTimeout(() => {
        state.busy = false;
        elements.diceBtn.disabled = false;
        announce(player.name + ' rolled a ' + rollVal);

        if (player.isCpu) {
          elements.turnStatus.textContent = 'CPU rolled ' + rollVal + '! Moving...';
          state.busy = true;
          setTimeout(() => {
            executeMove(player, rollVal);
          }, 800);
        } else {
          elements.turnStatus.textContent = player.name + ' rolled ' + rollVal + '! Click to move.';
          elements.moveSpacesBtn.textContent = 'Move ' + rollVal + (rollVal === 1 ? ' space' : ' spaces');
          elements.moveSpacesBtn.style.display = 'block';
          elements.moveSpacesBtn.focus();
        }
      }, 1000);
    }

    // Step-by-Step Movement Logic
    async function executeMove(player, spaces) {
      state.busy = true;
      elements.moveSpacesBtn.style.display = 'none';
      elements.diceBtn.disabled = true;

      const currentPos = player.position;
      const targetPos = currentPos + spaces;

      if (targetPos > 20) {
        sounds.blocked();
        elements.turnStatus.textContent = player.name + ' needs an exact roll. The token stays put.';
        announce(player.name + ' needs an exact roll. The token stays put.');
        await delay(1600);
        endTurn();
        return;
      }

      const tokenNode = document.getElementById('token_p' + player.id);
      for (let s = 1; s <= spaces; s++) {
        player.position = currentPos + s;
        if (tokenNode) {
          tokenNode.classList.add('hop');
          setTimeout(() => tokenNode.classList.remove('hop'), 200);
        }
        sounds.step();
        positionAllTokens();
        await delay(280);
      }

      await delay(200);

      if (player.position === 20) {
        declareVictory(player, 'reached square 20 exactly!');
        return;
      }

      if (LADDERS[player.position]) {
        const ladderDest = LADDERS[player.position];
        elements.turnStatus.textContent = 'Ladder! ' + player.name + ' climbs to square ' + ladderDest + '.';
        announce('Ladder! ' + player.name + ' climbs to square ' + ladderDest);
        sounds.ladder();
        await delay(500);
        player.position = ladderDest;
        positionAllTokens();
        await delay(1200);
      } else if (SNAKES[player.position]) {
        const snakeDest = SNAKES[player.position];
        elements.turnStatus.textContent = 'Oh no! A snake bites ' + player.name + ' and slides the token down to square ' + snakeDest + '.';
        announce('Oh no! A snake bites ' + player.name + ' and slides down to square ' + snakeDest);
        sounds.snake();

        elements.snakeCryOverlay.classList.add('show');
        await delay(900);
        elements.snakeCryOverlay.classList.remove('show');

        player.position = snakeDest;
        positionAllTokens();
        await delay(1000);
      }

      endTurn();
    }

    function endTurn() {
      state.busy = false;
      elements.diceBtn.disabled = false;
      state.activeIndex = (state.activeIndex + 1) % state.players.length;
      renderPlayerList();

      const nextPlayer = state.players[state.activeIndex];
      elements.turnStatus.textContent = nextPlayer.name + "'s turn. Click the dice to roll.";
      announce(nextPlayer.name + "'s turn");

      if (nextPlayer.isCpu && !state.gameOver) {
        elements.turnStatus.textContent = 'CPU is thinking...';
        state.busy = true;
        clearTimeout(state.cpuTimeoutId);
        state.cpuTimeoutId = setTimeout(() => {
          state.busy = false;
          rollDiceAction();
        }, 1200);
      }
    }

    // Question Button Click - Multiple Choice ("Choose the Correct Answer")
    function onQuestionBtnClick(sqNum) {
      if (state.busy || state.gameOver) return;
      const player = state.players[state.activeIndex];
      if (player && player.isCpu) return;

      const rec = state.questions[sqNum - 1];
      if (!rec || !rec.q.trim()) {
        showToast('No question is saved for square ' + sqNum + ' yet. Add it in settings.');
        announce('No question is saved for square ' + sqNum + ' yet. Add it in settings.');
        return;
      }

      state.openSquare = sqNum;
      state.selectedChoice = null;

      elements.modalTitle.textContent = 'Square ' + sqNum + ' question';
      elements.modalQuestionText.textContent = rec.q;
      elements.modalFeedback.textContent = '';
      elements.modalFeedback.className = 'modal-feedback';

      // Render the 4 Choices
      const choices = getQuestionChoices(rec, state.questions);
      const letters = ['A', 'B', 'C', 'D'];
      elements.modalChoicesContainer.innerHTML = '';

      choices.forEach((choice, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'choice-btn';
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');
        btn.setAttribute('data-choice', choice);
        btn.setAttribute('aria-label', 'Option ' + letters[idx] + ': ' + choice);

        const badge = document.createElement('span');
        badge.className = 'choice-letter';
        badge.textContent = letters[idx];

        const textSpan = document.createElement('span');
        textSpan.className = 'choice-text';
        textSpan.textContent = choice;

        btn.appendChild(badge);
        btn.appendChild(textSpan);

        btn.addEventListener('click', () => {
          selectChoice(btn, choice);
        });

        elements.modalChoicesContainer.appendChild(btn);
      });

      elements.questionModal.style.display = 'flex';
      const firstBtn = elements.modalChoicesContainer.querySelector('.choice-btn');
      if (firstBtn) firstBtn.focus();
    }

    // Select a choice
    function selectChoice(btn, choice) {
      state.selectedChoice = choice;
      const allBtns = elements.modalChoicesContainer.querySelectorAll('.choice-btn');
      allBtns.forEach(b => {
        b.classList.remove('selected', 'is-wrong');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-checked', 'true');
      elements.modalFeedback.textContent = '';
      elements.modalFeedback.className = 'modal-feedback';
    }

    // Check Multiple-Choice Answer
    function checkAnswer() {
      if (state.openSquare === null) return;
      const player = state.players[state.activeIndex];
      if (!player) return;

      const sqNum = state.openSquare;
      const rec = state.questions[sqNum - 1];
      if (!rec) return;

      if (!state.selectedChoice) {
        elements.modalFeedback.textContent = 'Please choose an answer first!';
        elements.modalFeedback.className = 'modal-feedback warn';
        return;
      }

      const selected = state.selectedChoice.trim().toLowerCase();
      const correct = (rec.a || '').trim().toLowerCase();
      const selectedBtn = elements.modalChoicesContainer.querySelector('.choice-btn.selected');

      if (selected === correct) {
        // Correct Answer!
        if (selectedBtn) {
          selectedBtn.classList.remove('selected');
          selectedBtn.classList.add('is-correct');
        }

        if (player.earnedSquares.has(sqNum)) {
          elements.modalFeedback.textContent = 'Correct! You already earned the trophy for this square.';
          elements.modalFeedback.className = 'modal-feedback correct';
          sounds.correct();
        } else {
          player.earnedSquares.add(sqNum);
          player.trophies++;
          renderPlayerList();
          sounds.trophy();
          elements.modalFeedback.textContent = 'Correct! Trophy earned! ✨🏆';
          elements.modalFeedback.className = 'modal-feedback correct';

          // Check 15 trophies win condition
          if (player.trophies >= 15) {
            setTimeout(() => {
              elements.questionModal.style.display = 'none';
              player.position = 20;
              positionAllTokens();
              declareVictory(player, 'collected 15 trophies!');
            }, 900);
          }
        }
      } else {
        // Wrong Answer
        sounds.wrong();
        if (selectedBtn) {
          selectedBtn.classList.remove('selected');
          selectedBtn.classList.add('is-wrong');
        }
        elements.modalFeedback.textContent = 'Not quite—try again! Choose another option.';
        elements.modalFeedback.className = 'modal-feedback incorrect';
      }
    }

    // Declare Victory
    function declareVictory(player, reason) {
      state.gameOver = true;
      state.busy = true;
      clearTimeout(state.cpuTimeoutId);
      sounds.victory();

      elements.victoryPlayerName.textContent = player.name;
      elements.victoryPlayerName.style.color = player.color;
      elements.victoryReason.textContent = 'wins by ' + reason;
      elements.victoryOverlay.style.display = 'flex';
      announce('Victory! ' + player.name + ' wins by ' + reason);

      elements.confettiContainer.innerHTML = '';
      const colors = ['#ffd85b', '#40e8ff', '#ff5d66', '#10b981', '#a855f7', '#f97316'];
      for (let i = 0; i < 90; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = (Math.random() * 100) + '%';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (2.2 + Math.random() * 2.8) + 's';
        piece.style.animationDelay = (Math.random() * 2) + 's';
        piece.style.width = (7 + Math.random() * 8) + 'px';
        piece.style.height = (12 + Math.random() * 12) + 'px';
        elements.confettiContainer.appendChild(piece);
      }
    }

    function restartGame() {
      clearTimeout(state.cpuTimeoutId);
      elements.victoryOverlay.style.display = 'none';
      elements.questionModal.style.display = 'none';
      initPlayers();
      renderPlayerList();
      setupTokens();
      elements.turnStatus.textContent = state.players[0].name + "'s turn. Click the dice to roll.";
      announce('Game restarted');
    }

    function returnToSettings() {
      clearTimeout(state.cpuTimeoutId);
      elements.victoryOverlay.style.display = 'none';
      elements.questionModal.style.display = 'none';
      elements.gameScreen.style.display = 'none';
      elements.settingsScreen.style.display = 'block';
      announce('Returned to settings');
    }

    function delay(ms) {
      return new Promise(res => setTimeout(res, ms));
    }

    // EVENT LISTENERS

    elements.soundToggleBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      elements.soundToggleBtn.setAttribute('aria-pressed', state.soundEnabled ? 'true' : 'false');
      elements.soundToggleBtn.textContent = state.soundEnabled ? '🔊 Sound on' : '🔇 Sound off';
      if (state.soundEnabled) {
        getAudioContext();
        sounds.save();
      }
    });

    elements.modeCpuBtn.addEventListener('click', () => {
      state.mode = 'cpu';
      elements.modeCpuBtn.classList.add('active');
      elements.modeCpuBtn.setAttribute('aria-pressed', 'true');
      elements.modeCpuBtn.setAttribute('aria-checked', 'true');
      elements.modeVariousBtn.classList.remove('active');
      elements.modeVariousBtn.setAttribute('aria-pressed', 'false');
      elements.modeVariousBtn.setAttribute('aria-checked', 'false');
      elements.playerCountGroup.style.display = 'none';
      renderPlayerInputs();
    });

    elements.modeVariousBtn.addEventListener('click', () => {
      state.mode = 'various';
      elements.modeVariousBtn.classList.add('active');
      elements.modeVariousBtn.setAttribute('aria-pressed', 'true');
      elements.modeVariousBtn.setAttribute('aria-checked', 'true');
      elements.modeCpuBtn.classList.remove('active');
      elements.modeCpuBtn.setAttribute('aria-pressed', 'false');
      elements.modeCpuBtn.setAttribute('aria-checked', 'false');
      elements.playerCountGroup.style.display = 'flex';
      renderPlayerInputs();
    });

    elements.playerCountGroup.querySelectorAll('.count-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        elements.playerCountGroup.querySelectorAll('.count-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        state.playerCount = parseInt(btn.getAttribute('data-count'), 10);
        renderPlayerInputs();
      });
    });

    elements.saveNamesBtn.addEventListener('click', () => {
      const isCpu = state.mode === 'cpu';
      const count = isCpu ? 2 : state.playerCount;
      const names = [];

      for (let i = 0; i < count; i++) {
        const input = document.getElementById('playerInput_' + i);
        if (input) {
          names.push(input.value.trim().slice(0, 22));
        }
      }

      state.savedNames = names;
      try {
        localStorage.setItem('snakeTrailNames', JSON.stringify(names));
      } catch (e) {}

      sounds.save();
      elements.namesSaveStatus.textContent = '✓ ' + count + ' names saved';
      elements.namesSaveStatus.className = 'names-save-status';
      showToast('Player names saved successfully!');
    });

    // Bulk Import Questions
    elements.importBulkBtn.addEventListener('click', () => {
      const qLines = elements.bulkQTextarea.value.split('\\n').map(l => l.trim()).filter(l => l.length > 0);
      const aLines = elements.bulkATextarea.value.split('\\n').map(l => l.trim()).filter(l => l.length > 0);

      if (qLines.length === 0 || aLines.length === 0) {
        elements.bulkStatusMsg.textContent = 'Please enter questions and answers before importing.';
        elements.bulkStatusMsg.className = 'editor-status-msg error';
        return;
      }

      if (qLines.length !== aLines.length) {
        elements.bulkStatusMsg.textContent = 'Question count (' + qLines.length + ') and answer count (' + aLines.length + ') must be equal.';
        elements.bulkStatusMsg.className = 'editor-status-msg error';
        return;
      }

      if (qLines.length > 20) {
        elements.bulkStatusMsg.textContent = 'Maximum 20 questions can be imported (found ' + qLines.length + ').';
        elements.bulkStatusMsg.className = 'editor-status-msg error';
        return;
      }

      for (let i = 0; i < qLines.length; i++) {
        const aRaw = aLines[i];
        let correctAns = aRaw;
        let opts = [];

        // Support piped options: "Correct | Wrong1 | Wrong2 | Wrong3"
        if (aRaw.includes('|')) {
          const parts = aRaw.split('|').map(p => p.trim()).filter(Boolean);
          correctAns = parts[0] || '';
          opts = parts;
        }

        state.questions[i] = { q: qLines[i], a: correctAns, options: opts };
      }

      saveQuestions();
      refreshQuestionIcons();
      updateSingleSquareInputs();
      sounds.save();

      elements.bulkStatusMsg.textContent = '✓ ' + qLines.length + ' questions successfully imported!';
      elements.bulkStatusMsg.className = 'editor-status-msg success';
    });

    elements.singleSquareSelect.addEventListener('change', updateSingleSquareInputs);

    // Save Single Square with Distractors
    elements.saveSingleSquareBtn.addEventListener('click', () => {
      const sqNum = parseInt(elements.singleSquareSelect.value, 10);
      const q = elements.singleQInput.value.trim();
      const a = elements.singleAInput.value.trim();
      const distractorsRaw = elements.singleDistractorsInput.value.trim();

      let opts = [];
      if (a) {
        opts.push(a);
      }
      if (distractorsRaw) {
        const parts = distractorsRaw.split(',').map(p => p.trim()).filter(Boolean);
        parts.forEach(p => {
          if (!opts.some(o => o.toLowerCase() === p.toLowerCase())) {
            opts.push(p);
          }
        });
      }

      state.questions[sqNum - 1] = { q: q, a: a, options: opts };
      saveQuestions();
      refreshQuestionIcons();
      sounds.save();

      elements.singleStatusMsg.textContent = '✓ Square ' + sqNum + ' saved successfully!';
      elements.singleStatusMsg.className = 'editor-status-msg success';
    });

    elements.clearSingleSquareBtn.addEventListener('click', () => {
      const sqNum = parseInt(elements.singleSquareSelect.value, 10);
      state.questions[sqNum - 1] = { q: '', a: '', options: [] };
      elements.singleQInput.value = '';
      elements.singleAInput.value = '';
      elements.singleDistractorsInput.value = '';
      saveQuestions();
      refreshQuestionIcons();
      sounds.save();

      elements.singleStatusMsg.textContent = 'Square ' + sqNum + ' cleared.';
      elements.singleStatusMsg.className = 'editor-status-msg success';
    });

    elements.startGameBtn.addEventListener('click', () => {
      getAudioContext();
      initPlayers();
      buildBoardGrid();
      renderPlayerList();
      setupTokens();

      elements.settingsScreen.style.display = 'none';
      elements.gameScreen.style.display = 'flex';
      elements.turnStatus.textContent = state.players[0].name + "'s turn. Click the dice to roll.";
      announce('Game started. ' + state.players[0].name + "'s turn.");

      requestAnimationFrame(positionAllTokens);
    });

    elements.backToSettingsBtn.addEventListener('click', returnToSettings);
    elements.restartGameBtn.addEventListener('click', restartGame);

    elements.diceBtn.addEventListener('click', rollDiceAction);

    elements.moveSpacesBtn.addEventListener('click', () => {
      const player = state.players[state.activeIndex];
      if (player && state.rolledValue > 0) {
        executeMove(player, state.rolledValue);
      }
    });

    elements.checkAnswerBtn.addEventListener('click', checkAnswer);
    elements.closeModalBtn.addEventListener('click', () => {
      elements.questionModal.style.display = 'none';
      state.openSquare = null;
      state.selectedChoice = null;
    });

    // Keyboard Navigation for Multiple Choice
    window.addEventListener('keydown', (e) => {
      if (elements.questionModal.style.display === 'flex') {
        if (e.key === 'Escape') {
          elements.questionModal.style.display = 'none';
          state.openSquare = null;
          state.selectedChoice = null;
          return;
        }

        if (e.key === 'Enter') {
          e.preventDefault();
          checkAnswer();
          return;
        }

        // Keys 1, 2, 3, 4 or A, B, C, D to quickly select choices
        const choices = elements.modalChoicesContainer.querySelectorAll('.choice-btn');
        let selectIdx = -1;
        if (e.key === '1' || e.key.toLowerCase() === 'a') selectIdx = 0;
        else if (e.key === '2' || e.key.toLowerCase() === 'b') selectIdx = 1;
        else if (e.key === '3' || e.key.toLowerCase() === 'c') selectIdx = 2;
        else if (e.key === '4' || e.key.toLowerCase() === 'd') selectIdx = 3;

        if (selectIdx >= 0 && choices[selectIdx]) {
          choices[selectIdx].click();
        }
      }
    });

    elements.playAgainBtn.addEventListener('click', restartGame);

    window.addEventListener('resize', () => {
      requestAnimationFrame(positionAllTokens);
    });

    // Initialize
    loadSavedNames();
    loadQuestions();
    renderPlayerInputs();
    populateSquareSelect();
    buildBoardGrid();

  })();
  </script>
</body>
</html>`;

fs.writeFileSync('snake-learning-game-latest-edition.html', htmlContent);
console.log('Saved snake-learning-game-latest-edition.html, size:', htmlContent.length);

fs.writeFileSync('index.html', htmlContent);
console.log('Saved index.html, size:', htmlContent.length);

// Also update build_full_game.cjs so future runs retain multiple-choice
fs.writeFileSync('build_full_game.cjs', fs.readFileSync('build_full_game_mc.cjs', 'utf8'));
console.log('Updated build_full_game.cjs');
