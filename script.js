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
        const data = await response.json();
        questions = data.results;
        loadQuestion();
    } catch (error) {
        questionEl.textContent = "Error loading questions!";
    }
}

// Load current question
function loadQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionEl.textContent = decodeHTML(currentQuestion.question);

    if (currentQuestion.type === "multiple") {
        // Multiple choice questions
        currentQuestion.incorrect_answers.push(currentQuestion.correct_answer);
        const shuffledOptions = shuffleArray(currentQuestion.incorrect_answers); 

        shuffledOptions.forEach((option) => {
            const button = document.createElement("button");
            button.textContent = decodeHTML(option);
            button.classList.add("option");
            button.addEventListener("click", () => handleAnswer(button,option === currentQuestion.correct_answer));
            optionsEl.appendChild(button);
        });
    } else if (currentQuestion.type === "boolean") {
        // True/False questions
        ["True", "False"].forEach((option) => {
            const button = document.createElement("button");
            button.textContent = option;
            button.classList.add("option");
            button.addEventListener("click", () => handleAnswer(button, option === currentQuestion.correct_answer));
            optionsEl.appendChild(button);
        });
    }

    updateProgress();
}

// Handle user answer
function handleAnswer(button, isCorrect) {
    disableOptions();
    if (isCorrect) {
        score++;
        button.classList.add("correct");
    } else {
        button.classList.add("incorrect");
        const correctButton = Array.from(optionsEl.children).find(
            (btn) => btn.textContent === decodeHTML(questions[currentQuestionIndex].correct_answer)
        );
        correctButton.classList.add("correct");
    }
    nextBtn.disabled = false;
}

// Disable all answer options
function disableOptions() {
    Array.from(optionsEl.children).forEach((btn) => {
        btn.disabled = true;
    }); 
}

// Reset state for next question
function resetState() {
    nextBtn.disabled = true;
    optionsEl.innerHTML = "";
}

// Update progress bar and score
function updateProgress() {
    questionCounterEl.textContent = `Question: ${currentQuestionIndex + 1}/${questions.length}`;
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
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// Restart quiz
restartBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    restartBtn.style.display = "none";
    nextBtn.style.display = "inline-block";
    fetchQuestions();
})

// Show results
function showResults() {
    questionEl.textContent = `Quiz Over! You scored ${score} out of ${questions.length}`;
    optionsEl.innerHTML = "";
    nextBtn.style.display = "none";
    restartBtn.style.display = "inline-block";
}

// Initialize quiz
fetchQuestions();
