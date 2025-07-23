//

// New Code to test

const questions = [
  {
    text: "I feel anxious or nervous.",
    type: "negative",
    category: "emotional",
    severity: "high",
  },
  {
    text: "I feel overwhelmed by responsibilities.",
    type: "negative",
    category: "emotional",
    severity: "moderate",
  },
  {
    text: "I get irritated easily.",
    type: "negative",
    category: "emotional",
    severity: "low",
  },
  {
    text: "I find it difficult to relax.",
    type: "negative",
    category: "physical",
    severity: "moderate",
  },
  {
    text: "I feel physically drained or fatigued even after resting.",
    type: "negative",
    category: "physical",
    severity: "high",
  },
  {
    text: "I sleep well at night.",
    type: "positive",
    category: "physical",
    severity: "moderate",
  },
  {
    text: "I feel emotionally balanced.",
    type: "positive",
    category: "emotional",
    severity: "moderate",
  },
  {
    text: "I feel hopeless or down.",
    type: "negative",
    category: "emotional",
    severity: "high",
  },
  {
    text: "I experience panic attacks.",
    type: "negative",
    category: "emotional",
    severity: "high",
  },
  {
    text: "I feel energized and motivated to tackle my daily tasks.",
    type: "positive",
    category: "cognitive",
    severity: "moderate",
  },
  {
    text: "I struggle to find joy in hobbies.",
    type: "negative",
    category: "emotional",
    severity: "moderate",
  },
  {
    text: "I find it hard to concentrate or focus.",
    type: "negative",
    category: "cognitive",
    severity: "moderate",
  },
  {
    text: "I feel comfortable setting boundaries with others when needed.",
    type: "positive",
    category: "social",
    severity: "moderate",
  },
  {
    text: "I feel physical tension in my body (e.g., headaches, tightness).",
    type: "negative",
    category: "physical",
    severity: "moderate",
  },
  {
    text: "I take time to engage in activities that help me recharge.",
    type: "positive",
    category: "emotional",
    severity: "moderate",
  },
];

const options = [
  { label: "Never", value: 0 },
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Always", value: 4 },
];

const maxScore = questions.reduce(
  (sum, q) => sum + (q.severity === "high" ? 8 : 4),
  0
);
const resultConfig = [
  {
    max: maxScore * 0.167,
    class: "very-low",
    icon: "star",
    title: "Very Low Stress",
    message:
      "Fantastic! Your mental wellness is in top shape. Continue nurturing positive habits like mindfulness and self-care.",
    ariaLabel: "Very low stress icon",
  },
  {
    max: maxScore * 0.333,
    class: "excellent",
    icon: "check-circle",
    title: "Excellent Mental Wellness",
    message:
      "You're doing great! Your mental health is in excellent condition. Keep up your healthy habits and consider sharing your strategies.",
    ariaLabel: "Excellent wellness icon",
  },
  {
    max: maxScore * 0.5,
    class: "mild",
    icon: "info-circle",
    title: "Mild Stress",
    message:
      "You may be experiencing mild stress. Try small stress-relief practices like short walks, journaling, or breathing exercises.",
    ariaLabel: "Mild stress icon",
  },
  {
    max: maxScore * 0.667,
    class: "moderate",
    icon: "exclamation-triangle",
    title: "Moderate Stress Levels",
    message:
      "Your stress levels are noticeable but manageable. Consider relaxation techniques like meditation, yoga, or exercise, and ensure adequate rest.",
    ariaLabel: "Moderate stress icon",
  },
  {
    max: maxScore * 0.833,
    class: "severe",
    icon: "exclamation-circle",
    title: "Severe Stress - Action Needed",
    message:
      "Your stress levels are significant. Reach out to a trusted friend or mental health professional. Therapy or counseling could be highly beneficial.",
    ariaLabel: "Severe stress icon",
  },
  {
    max: Infinity,
    class: "critical",
    icon: "heartbeat",
    title: "Critical Stress - Urgent Support Recommended",
    message:
      "Your responses suggest critical stress levels. Please prioritize seeking help from a mental health professional immediately. You're not alone, and support is available.",
    ariaLabel: "Critical stress icon",
  },
];

let currentQuestion = 0;
let answers = {};

function initializeQuestions() {
  const container = document.getElementById("questions-container");
  container.innerHTML = questions
    .map(
      (question, index) => `
        <div class="question-card ${
          index === 0 ? "active" : ""
        }" id="question-${index}" role="group" aria-labelledby="question-text-${index}">
          <div class="question-header">
            <div class="question-number">${index + 1}</div>
            <div class="question-text" id="question-text-${index}">${
        question.text
      }</div>
          </div>
          <div class="options-grid">
            ${options
              .map(
                (option, optIndex) => `
              <button class="option-button" data-question="${index}" data-value="${option.value}" aria-label="${option.label} (${option.value})">
                <div class="option-label">${option.label}</div>
                <div class="option-score">(${option.value})</div>
              </button>
            `
              )
              .join("")}
          </div>
        </div>
      `
    )
    .join("");

  container.addEventListener("click", handleOptionClick);
}

function handleOptionClick(event) {
  const button = event.target.closest(".option-button");
  if (!button) return;

  const questionIndex = parseInt(button.dataset.question);
  const value = parseInt(button.dataset.value);

  answers[questionIndex] = value;
  updateOptionSelection(questionIndex, value);
  updateProgress();
  updateNavigation();
}

function updateOptionSelection(questionIndex, value) {
  const questionCard = document.getElementById(`question-${questionIndex}`);
  questionCard.querySelectorAll(".option-button").forEach((btn, index) => {
    btn.classList.toggle("selected", index === value);
    btn.setAttribute("aria-pressed", index === value ? "true" : "false");
  });
}

function updateProgress() {
  const answeredCount = Object.keys(answers).length;
  const percentage = (answeredCount / questions.length) * 100;
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");

  progressFill.style.width = `${percentage}%`;
  progressFill.setAttribute("aria-valuenow", percentage);
  progressText.textContent = `${answeredCount} of ${questions.length}`;
}

function updateNavigation() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const submitBtn = document.getElementById("submit-btn");
  const counter = document.getElementById("question-counter");

  prevBtn.disabled = currentQuestion === 0;
  prevBtn.setAttribute(
    "aria-disabled",
    currentQuestion === 0 ? "true" : "false"
  );

  const isCurrentAnswered = answers.hasOwnProperty(currentQuestion);
  const answeredCount = Object.keys(answers).length;

  if (currentQuestion === questions.length - 1) {
    nextBtn.style.display = "none";
    submitBtn.style.display = "flex";
    submitBtn.disabled = answeredCount === 0;
    submitBtn.setAttribute(
      "aria-disabled",
      answeredCount === 0 ? "true" : "false"
    );
  } else {
    nextBtn.style.display = "flex";
    submitBtn.style.display = "none";
    nextBtn.disabled = !isCurrentAnswered;
    nextBtn.setAttribute(
      "aria-disabled",
      !isCurrentAnswered ? "true" : "false"
    );
  }

  counter.textContent = `Question ${currentQuestion + 1} of ${
    questions.length
  }`;
}

function nextQuestion() {
  if (currentQuestion >= questions.length - 1) return;
  document
    .getElementById(`question-${currentQuestion}`)
    .classList.remove("active");
  currentQuestion++;
  document
    .getElementById(`question-${currentQuestion}`)
    .classList.add("active");
  updateNavigation();
}

function previousQuestion() {
  if (currentQuestion <= 0) return;
  document
    .getElementById(`question-${currentQuestion}`)
    .classList.remove("active");
  currentQuestion--;
  document
    .getElementById(`question-${currentQuestion}`)
    .classList.add("active");
  updateNavigation();
}

function calculateScore() {
  return Object.entries(answers).reduce((sum, [index, value]) => {
    const question = questions[index];
    const weight = question.severity === "high" ? 2 : 1;
    return (
      sum +
      (question.type === "positive" ? (4 - value) * weight : value * weight)
    );
  }, 0);
}

function calculateSubScores() {
  const categories = ["emotional", "physical", "cognitive", "social"];
  return categories.reduce((subScores, category) => {
    const maxCategoryScore = questions
      .filter((q) => q.category === category)
      .reduce((sum, q) => sum + (q.severity === "high" ? 8 : 4), 0);
    subScores[category] = {
      score: Object.entries(answers)
        .filter(([index]) => questions[index].category === category)
        .reduce((sum, [index, value]) => {
          const question = questions[index];
          const weight = question.severity === "high" ? 2 : 1;
          return (
            sum +
            (question.type === "positive"
              ? (4 - value) * weight
              : value * weight)
          );
        }, 0),
      max: maxCategoryScore,
    };
    return subScores;
  }, {});
}

function submitAssessment() {
  if (Object.keys(answers).length === 0) return;
  document.querySelector(".content").style.display = "none";
  document.getElementById("loading").classList.add("show");
  setTimeout(showResults, 2000);
}

function showResults() {
  document.getElementById("loading").classList.remove("show");
  document.getElementById("result-container").classList.add("show");

  const answeredQuestions = Object.keys(answers).length;
  const maxAnsweredScore = Object.entries(answers).reduce((sum, [index]) => {
    const question = questions[index];
    return sum + (question.severity === "high" ? 8 : 4);
  }, 0);
  const totalScore = calculateScore();
  const percentage =
    maxAnsweredScore > 0 ? (totalScore / maxAnsweredScore) * 100 : 0;

  document.getElementById("total-score").textContent = totalScore;
  document.getElementById("percentage-score").textContent = `${Math.round(
    percentage
  )}%`;
  document.getElementById("chart-percentage").textContent = `${Math.round(
    percentage
  )}%`;

  const ctx = document.getElementById("resultChart").getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Stress Level", "Well-being"],
      datasets: [
        {
          data: [percentage, 100 - percentage],
          backgroundColor: [
            percentage > 66
              ? "#f44336"
              : percentage > 33
              ? "#ff9800"
              : "#4caf50",
            "#e0e0e0",
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
    },
  });

  const subScores = calculateSubScores();
  const subCtx = document.getElementById("subScoreChart").getContext("2d");
  new Chart(subCtx, {
    type: "bar",
    data: {
      labels: ["Emotional", "Physical", "Cognitive", "Social"],
      datasets: [
        {
          label: "Stress Score",
          data: Object.values(subScores).map((s) => (s.score / s.max) * 100),
          backgroundColor: "#4caf50",
          borderColor: "#4caf50",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: "Stress Percentage" },
        },
        x: { title: { display: true, text: "Category" } },
      },
      plugins: { legend: { display: false } },
    },
  });

  const resultCard = document.getElementById("result-card");
  const resultIcon = document.getElementById("result-icon");
  const resultTitle = document.getElementById("result-title");
  const resultMessage = document.getElementById("result-message");

  if (typeof totalScore !== "number" || isNaN(totalScore) || totalScore < 0) {
    resultCard.className = "result-card error";
    resultIcon.innerHTML =
      '<i class="fas fa-times-circle" aria-label="Error icon"></i>';
    resultTitle.textContent = "Invalid Score";
    resultMessage.textContent =
      "Unable to process your score. Please try again.";
    return;
  }

  const result = resultConfig.find((range) => totalScore <= range.max);
  resultCard.className = `result-card ${result.class}`;
  resultIcon.innerHTML = `<i class="fas fa-${result.icon}" aria-label="${result.ariaLabel}"></i>`;
  resultTitle.textContent = result.title;
  resultMessage.textContent = result.message;

  const highScores = Object.entries(answers)
    .filter(
      ([index, value]) => value >= 3 && questions[index].type === "negative"
    )
    .map(([index]) => questions[index].text);
  if (highScores.length > 0) {
    resultMessage.textContent += ` Specific concerns: ${highScores.join(
      ", "
    )}.`;
  }

  resultMessage.textContent += ` Sub-scores: Emotional: ${subScores.emotional.score}/${subScores.emotional.max}, Physical: ${subScores.physical.score}/${subScores.physical.max}, Cognitive: ${subScores.cognitive.score}/${subScores.cognitive.max}, Social: ${subScores.social.score}/${subScores.social.max}.`;
}

function restartAssessment() {
  currentQuestion = 0;
  answers = {};
  document.querySelector(".content").style.display = "block";
  document.getElementById("result-container").classList.remove("show");

  document.querySelectorAll(".question-card").forEach((card, index) => {
    card.classList.toggle("active", index === 0);
    card.querySelectorAll(".option-button").forEach((btn) => {
      btn.classList.remove("selected");
      btn.setAttribute("aria-pressed", "false");
    });
  });

  updateProgress();
  updateNavigation();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeQuestions();
  updateNavigation();
  document
    .getElementById("prev-btn")
    .addEventListener("click", previousQuestion);
  document.getElementById("next-btn").addEventListener("click", nextQuestion);
  document
    .getElementById("submit-btn")
    .addEventListener("click", submitAssessment);
  document
    .getElementById("restart-btn")
    .addEventListener("click", restartAssessment);
});
