// منطق بازی. برای عوض کردن سؤال‌ها فقط static/content.js را تغییر بده.
const config = window.LOVE_GAME;
const welcomeScreen = document.getElementById("welcomeScreen");
const questionScreen = document.getElementById("questionScreen");
const finalScreen = document.getElementById("finalScreen");
const progressTrack = document.getElementById("progressTrack");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const questionText = document.getElementById("questionText");
const stepLabel = document.getElementById("stepLabel");
const choices = document.getElementById("choices");
const feedback = document.getElementById("feedback");

let questionNumber = 0;
let answerLocked = false;
let advanceTimer = null;

// متن‌ها را از content.js می‌گیریم.
document.getElementById("welcomeTitle").textContent = config.welcomeTitle;
document.getElementById("welcomeText").textContent = config.welcomeText;
document.getElementById("finalTitle").textContent = config.endingTitle;
document.getElementById("finalMessage").textContent = config.endingMessage;

function showScreen(screen) {
  welcomeScreen.hidden = screen !== welcomeScreen;
  questionScreen.hidden = screen !== questionScreen;
  finalScreen.hidden = screen !== finalScreen;
  const playing = screen === questionScreen;
  progressTrack.hidden = !playing;
  progressText.hidden = !playing;
}

function startGame() {
  clearTimeout(advanceTimer);
  questionNumber = 0;
  answerLocked = false;
  showQuestion();
}

function showQuestion() {
  if (questionNumber >= config.questions.length) {
    showEnding();
    return;
  }

  answerLocked = false;
  showScreen(questionScreen);
  const question = config.questions[questionNumber];
  stepLabel.textContent = `مرحله ${questionNumber + 1}`;
  progressText.textContent = `${questionNumber + 1} / ${config.questions.length}`;
  progressBar.style.width = `${(questionNumber / config.questions.length) * 100}%`;
  questionText.textContent = question.text;
  feedback.textContent = "";
  feedback.className = "feedback";
  choices.replaceChildren();

  question.options.forEach((option, optionIndex) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => checkAnswer(optionIndex + 1, button));
    choices.appendChild(button);
  });
}

function checkAnswer(selectedNumber, button) {
  if (answerLocked) return;

  const question = config.questions[questionNumber];
  if (selectedNumber !== question.correct) {
    // جواب غلط: در همان سؤال می‌مانیم.
    choices.querySelectorAll(".choice").forEach(item => item.classList.remove("incorrect"));
    button.classList.add("incorrect");
    feedback.textContent = config.wrongMessage;
    feedback.className = "feedback error";
    return;
  }

  // فقط بعد از جواب درست به سؤال بعدی می‌رویم.
  answerLocked = true;
  button.classList.add("correct");
  choices.querySelectorAll(".choice").forEach(item => item.disabled = true);
  feedback.textContent = "آفرین! ❤️ جواب درست بود.";
  feedback.className = "feedback success";
  progressBar.style.width = `${((questionNumber + 1) / config.questions.length) * 100}%`;

  advanceTimer = setTimeout(() => {
    questionNumber += 1;
    showQuestion();
  }, 850);
}

function showEnding() {
  showScreen(finalScreen);
  createHearts();
}

function createHearts() {
  const confetti = document.getElementById("confetti");
  confetti.replaceChildren();
  for (let i = 0; i < 25; i++) {
    const heart = document.createElement("span");
    heart.textContent = ["♥", "♡", "💕"][i % 3];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${Math.random() * 2.4}s`;
    heart.style.animationDuration = `${2.8 + Math.random() * 2}s`;
    confetti.appendChild(heart);
  }
}

document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("restartButton").addEventListener("click", startGame);
