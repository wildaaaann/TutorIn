// Game data
const questions = [
  {
    question: "What is the capital of Indonesia?",
    answers: [
      { text: "Jakarta", correct: true },
      { text: "Bangkok", correct: false },
      { text: "Kuala Lumpur", correct: false },
      { text: "Singapore", correct: false }
    ]
  },
  {
    question: "Which of these is a prime number?",
    answers: [
      { text: "15", correct: false },
      { text: "23", correct: true },
      { text: "28", correct: false },
      { text: "33", correct: false }
    ]
  },
  {
    question: "The chemical symbol for gold is:",
    answers: [
      { text: "Go", correct: false },
      { text: "Ag", correct: false },
      { text: "Au", correct: true },
      { text: "Gd", correct: false }
    ]
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false }
    ]
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Arctic Ocean", correct: false },
      { text: "Pacific Ocean", correct: true }
    ]
  }
];

// Game variables
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timer;
let gameActive = true;
let selectedAnswer = null;

// DOM elements
const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const nextButton = document.getElementById('next-button');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const progressElement = document.getElementById('progress');
const timeBonusElement = document.getElementById('time-bonus');
const resultModal = document.getElementById('result-modal');
const finalScoreElement = document.getElementById('final-score');
const performanceCommentElement = document.getElementById('performance-comment');
const restartButton = document.getElementById('restart-button');

// Initialize the game
function startGame() {
  totalQuestionsElement.textContent = questions.length;
  showQuestion();
  startTimer();
}

// Display the current question
function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  currentQuestionElement.textContent = currentQuestionIndex + 1;
  
  const progress = ((currentQuestionIndex) / questions.length) * 100;
  progressElement.style.width = `${progress}%`;
  
  questionElement.textContent = currentQuestion.question;
  
  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.textContent = answer.text;
    button.classList.add('answer-btn', 'p-4', 'rounded-lg', 'text-xl', 'font-bold');
    button.addEventListener('click', () => selectAnswer(answer, index));
    answersElement.appendChild(button);
  });
}

function resetState() {
  nextButton.classList.add('hidden');
  selectedAnswer = null;
  while (answersElement.firstChild) {
    answersElement.removeChild(answersElement.firstChild);
  }
}

function selectAnswer(answer, index) {
  if (!gameActive || selectedAnswer !== null) return;

  clearInterval(timer);
  gameActive = false;
  selectedAnswer = index;

  const answerButtons = document.querySelectorAll('.answer-btn');
  answerButtons[index].classList.add('selected');

  answerButtons.forEach((button, btnIndex) => {
    if (questions[currentQuestionIndex].answers[btnIndex].correct) {
      button.classList.add('correct');
    } else {
      button.classList.add('wrong');
    }
    button.disabled = true;
  });

  if (answer.correct) {
    const timeBonus = Math.floor(timeLeft * 2);
    score += timeBonus + 100;
    scoreElement.textContent = score;
    timeBonusElement.textContent = `+${timeBonus} time bonus!`;
    timeBonusElement.classList.remove('hidden');
  }

  nextButton.classList.remove('hidden');
}

function nextQuestion() {
  timeBonusElement.classList.add('hidden');
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    resetTimer();
    gameActive = true;
    showQuestion();
    startTimer();
  } else {
    showResults();
  }
}

function startTimer() {
  timeLeft = 30;
  timerElement.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      timeUp();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 30;
  timerElement.textContent = timeLeft;
}

function timeUp() {
  gameActive = false;
  const answerButtons = document.querySelectorAll('.answer-btn');
  answerButtons.forEach((button, index) => {
    if (questions[currentQuestionIndex].answers[index].correct) {
      button.classList.add('correct');
    }
    button.disabled = true;
  });
  nextButton.classList.remove('hidden');
}

function showResults() {
  resultModal.classList.remove('hidden');
  finalScoreElement.textContent = score;
  const maxPossibleScore = (30 * 2 + 100) * questions.length;
  const percentage = (score / maxPossibleScore) * 100;

  if (percentage >= 80) {
    performanceCommentElement.textContent = "Outstanding performance! You're a quiz master!";
  } else if (percentage >= 50) {
    performanceCommentElement.textContent = "Great job! You've got solid knowledge!";
  } else {
    performanceCommentElement.textContent = "Good effort! Keep practicing to improve!";
  }
}

function restartGame() {
  resultModal.classList.add('hidden');
  currentQuestionIndex = 0;
  score = 0;
  scoreElement.textContent = score;
  gameActive = true;
  showQuestion();
  startTimer();
}

// Dark mode toggle
const modeToggle = document.getElementById('mode-toggle');
modeToggle.addEventListener('change', () => {
  document.documentElement.classList.toggle('dark');
});

// Event listeners
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', restartGame);

// Start game
startGame();
