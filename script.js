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

// Fetch questions from API
async function fetchQuestions() {
  try {
    const response = await fetch(API_URL);
    // handle response error
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    const data = await response.json();
    questions = data.results;
    loadQuestion();
  } catch (error) {
    questionEl.textContent = "Error loading questions!";
    // console.error for debugging
    console.error(`There was an error fetching the questions: ${error}`);
  }
}

// Load current question
function loadQuestion() {
  resetState();
  // deconstruct current question object
  const { question, type, incorrect_answers, correct_answer } =
    questions[currentQuestionIndex];
  questionEl.textContent = decodeHTML(question);

  // check if question is multiple choice or true/false
  const options =
    type === "multiple"
      ? shuffleArray([...incorrect_answers, correct_answer])
      : ["True", "False"];

  // create button for each option
  options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = decodeHTML(option);
    button.classList.add("option");
    button.addEventListener("click", () =>
      handleAnswer(button, option === correct_answer)
    );
    optionsEl.appendChild(button);
  });

  updateProgress();
}

// Handle user answer
function handleAnswer(button, isCorrect) {
  disableOptions();
  // ternary operator is more concise
  button.classList.add(isCorrect ? "correct" : "incorrect");
  if (isCorrect) {
    score++;
  } else {
    const correctButton = Array.from(optionsEl.children).find(
      (btn) =>
        btn.textContent ===
        decodeHTML(questions[currentQuestionIndex].correct_answer)
    );
    correctButton.classList.add("correct");
  }
  nextBtn.disabled = false;
}

// Disable all answer options
function disableOptions() {
  // refactor for readability
  optionsEl.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
}

// Reset state for next question
function resetState() {
  nextBtn.disabled = true;
  // textContent is better than innerHTML for security reasons
  optionsEl.textContent = "";
}

// Update progress bar and score
function updateProgress() {
  questionCounterEl.textContent = `Question: ${currentQuestionIndex + 1}/${
    questions.length
  }`;
  scoreEl.textContent = `Score: ${score}`;
}

// Shuffle array
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Decode HTML entities
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// Next question
nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  // ternary operator is more concise
  currentQuestionIndex < questions.length ? loadQuestion() : showResults();
});

// Restart quiz
restartBtn.addEventListener("click", () => {
  currentQuestionIndex = 0;
  score = 0;
  restartBtn.style.display = "none";
  nextBtn.style.display = "inline-block";
  fetchQuestions();
});

// Show results
function showResults() {
  questionEl.textContent = `Quiz Over! You scored ${score} out of ${questions.length}`;
  // textContent is better than innerHTML for security reasons
  optionsEl.textContent = "";
  nextBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
}

// Initialize quiz
fetchQuestions();
