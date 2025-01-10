const API_URL = "https://opentdb.com/api.php?amount=10";
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// DOM Elements
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const questionCounterEl = document.getElementById("question-counter");
const scoreEl = document.getElementById("score");


