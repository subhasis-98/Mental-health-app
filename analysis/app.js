//  <script>
const questions = [
  //   "I feel energetic during the day.",
  //   "I am able to concentrate on tasks.",
  //   "I enjoy spending time with others.",
  //   "I sleep well at night.",
  //   "I feel anxious or nervous.",
  //   "I feel hopeless or down.",
  //   "I get irritated easily.",
  //   "I feel confident in myself.",
  //   "I avoid social situations.",
  //   "I feel overwhelmed by responsibilities.",
  //   "I experience sudden mood changes.",
  //   "I find it difficult to relax.",
  //   "I feel motivated to do things.",
  //   "I experience panic attacks.",
  //   "I feel emotionally balanced.",
  //   "I feel lonely even in a crowd.",
  //   "I feel satisfied with my personal life.",
  //   "I struggle to find joy in hobbies.",
  //   "I get enough rest and recovery.",
  //   "I feel like talking to someone about my feelings.",

  "I feel anxious or nervous.",
  "I feel overwhelmed by responsibilities.",
  "I get irritated easily.",
  "I find it difficult to relax.",
  "I experience sudden mood changes.",
  "I sleep well at night.",
  "I feel emotionally balanced.",
  "I feel hopeless or down.",
  "I experience panic attacks.",
  "I feel like talking to someone about my feelings.",
  "I struggle to find joy in hobbies.",
  "I find it hard to concentrate or focus.",
  "I avoid social interactions even when I want connection.",
  "I feel physical tension in my body (e.g., headaches, tightness).",
  "I worry excessively about small things.",
];

const options = [
  { label: "Never", value: 0 },
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Always", value: 4 },
];

let currentQuestion = 0;
let answers = {};

function initializeQuestions() {
  const container = document.getElementById("questions-container");

  questions.forEach((question, index) => {
    const questionCard = document.createElement("div");
    questionCard.className = "question-card";
    questionCard.id = `question-${index}`;

    if (index === 0) {
      questionCard.classList.add("active");
    }

    questionCard.innerHTML = `
                    <div class="question-header">
                        <div class="question-number">${index + 1}</div>
                        <div class="question-text">${question}</div>
                    </div>
                    <div class="options-grid">
                        ${options
                          .map(
                            (option) => `
                            <div class="option-button" onclick="selectOption(${index}, ${option.value})">
                                <div class="option-label">${option.label}</div>
                                <div class="option-score">(${option.value})</div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                `;

    container.appendChild(questionCard);
  });
}

function selectOption(questionIndex, value) {
  answers[questionIndex] = value;

  // Update visual selection
  const questionCard = document.getElementById(`question-${questionIndex}`);
  const options = questionCard.querySelectorAll(".option-button");

  options.forEach((option, index) => {
    option.classList.remove("selected");
    if (index === value) {
      option.classList.add("selected");
    }
  });

  updateProgress();
  updateNavigation();
}

function updateProgress() {
  const answeredCount = Object.keys(answers).length;
  const percentage = (answeredCount / questions.length) * 100;

  document.getElementById("progress-fill").style.width = `${percentage}%`;
  document.getElementById(
    "progress-text"
  ).textContent = `${answeredCount} of ${questions.length}`;
}

function updateNavigation() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const submitBtn = document.getElementById("submit-btn");
  const counter = document.getElementById("question-counter");

  prevBtn.disabled = currentQuestion === 0;

  const isCurrentAnswered = answers.hasOwnProperty(currentQuestion);
  const allAnswered = Object.keys(answers).length === questions.length;

  if (currentQuestion === questions.length - 1) {
    nextBtn.style.display = "none";
    submitBtn.style.display = "flex";
    submitBtn.disabled = !allAnswered;
  } else {
    nextBtn.style.display = "flex";
    submitBtn.style.display = "none";
    nextBtn.disabled = !isCurrentAnswered;
  }

  counter.textContent = `Question ${currentQuestion + 1} of ${
    questions.length
  }`;
}

function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    document
      .getElementById(`question-${currentQuestion}`)
      .classList.remove("active");
    currentQuestion++;
    document
      .getElementById(`question-${currentQuestion}`)
      .classList.add("active");
    updateNavigation();
  }
}

function previousQuestion() {
  if (currentQuestion > 0) {
    document
      .getElementById(`question-${currentQuestion}`)
      .classList.remove("active");
    currentQuestion--;
    document
      .getElementById(`question-${currentQuestion}`)
      .classList.add("active");
    updateNavigation();
  }
}

function submitAssessment() {
  document.querySelector(".content").style.display = "none";
  document.getElementById("loading").classList.add("show");

  setTimeout(() => {
    showResults();
  }, 2000);
}

function showResults() {
  document.getElementById("loading").classList.remove("show");
  document.getElementById("result-container").classList.add("show");

  const totalScore = Object.values(answers).reduce(
    (sum, value) => sum + value,
    0
  );
  const maxScore = questions.length * 4;
  const percentage = (totalScore / maxScore) * 100;

  // Update score displays
  document.getElementById("total-score").textContent = totalScore;
  document.getElementById("percentage-score").textContent = `${Math.round(
    percentage
  )}%`;
  document.getElementById("chart-percentage").textContent = `${Math.round(
    percentage
  )}%`;

  // Create chart
  const ctx = document.getElementById("resultChart").getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Stress Level", "Well-being"],
      datasets: [
        {
          data: [percentage, 100 - percentage],
          backgroundColor: [
            percentage > 50
              ? "#f44336"
              : percentage > 25
              ? "#ff9800"
              : "#4caf50",
            "#e0e0e0",
          ],
          borderWidth: 0,
          cutout: "70%",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  // Update result card
  const resultCard = document.getElementById("result-card");
  const resultIcon = document.getElementById("result-icon");
  const resultTitle = document.getElementById("result-title");
  const resultMessage = document.getElementById("result-message");

  // if (totalScore <= 20) {
  //     resultCard.className = 'result-card excellent';
  //     resultIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
  //     resultTitle.textContent = 'Excellent Mental Wellness';
  //     resultMessage.textContent = "You're doing great! Your mental health appears to be in excellent condition. Keep up your healthy habits and continue prioritizing your well-being.";
  // } else if (totalScore <= 40) {
  //     resultCard.className = 'result-card moderate';
  //     resultIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
  //     resultTitle.textContent = 'Moderate Stress Levels';
  //     resultMessage.textContent = "You're experiencing some stress, which is normal. Consider incorporating relaxation techniques like meditation, deep breathing exercises, or regular physical activity into your routine.";
  // } else {
  //     resultCard.className = 'result-card high';
  //     resultIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
  //     resultTitle.textContent = 'High Stress - Support Recommended';
  //     resultMessage.textContent = "Your responses indicate significant stress levels. Please consider reaching out to a mental health professional, counselor, or therapist. Remember, seeking help is a sign of strength, and you're not alone in this journey.";
  // }

  // Validate totalScore
  if (typeof totalScore !== "number" || isNaN(totalScore) || totalScore < 0) {
    resultCard.className = "result-card error";
    resultIcon.innerHTML =
      '<i class="fas fa-times-circle" aria-label="Error icon"></i>';
    resultTitle.textContent = "Invalid Score";
    resultMessage.textContent =
      "Unable to process your score. Please ensure all questions are answered correctly.";
  } else if (totalScore <= 10) {
    resultCard.className = "result-card very-low";
    resultIcon.innerHTML =
      '<i class="fas fa-star" aria-label="Very low stress icon"></i>';
    resultTitle.textContent = "Very Low Stress";
    resultMessage.textContent =
      "Fantastic! Your mental wellness is in top shape. Continue nurturing your positive habits, such as mindfulness and self-care, to maintain this state.";
  } else if (totalScore <= 20) {
    resultCard.className = "result-card excellent";
    resultIcon.innerHTML =
      '<i class="fas fa-check-circle" aria-label="Excellent wellness icon"></i>';
    resultTitle.textContent = "Excellent Mental Wellness";
    resultMessage.textContent =
      "You're doing great! Your mental health appears to be in excellent condition. Keep up your healthy habits and consider sharing your strategies with others.";
  } else if (totalScore <= 30) {
    resultCard.className = "result-card mild";
    resultIcon.innerHTML =
      '<i class="fas fa-info-circle" aria-label="Mild stress icon"></i>';
    resultTitle.textContent = "Mild Stress";
    resultMessage.textContent =
      "You may be experiencing mild stress. Try incorporating small stress-relief practices, like short walks, journaling, or breathing exercises, into your daily routine.";
  } else if (totalScore <= 40) {
    resultCard.className = "result-card moderate";
    resultIcon.innerHTML =
      '<i class="fas fa-exclamation-triangle" aria-label="Moderate stress icon"></i>';
    resultTitle.textContent = "Moderate Stress Levels";
    resultMessage.textContent =
      "Your stress levels are noticeable but manageable. Consider relaxation techniques like meditation, yoga, or regular exercise, and ensure you’re getting enough rest.";
  } else if (totalScore <= 50) {
    resultCard.className = "result-card severe";
    resultIcon.innerHTML =
      '<i class="fas fa-exclamation-circle" aria-label="Severe stress icon"></i>';
    resultTitle.textContent = "Severe Stress - Action Needed";
    resultMessage.textContent =
      "Your stress levels are significant. Reach out to a trusted friend, family member, or mental health professional. Exploring therapy or counseling could be highly beneficial.";
  } else {
    resultCard.className = "result-card critical";
    resultIcon.innerHTML =
      '<i class="fas fa-heartbeat" aria-label="Critical stress icon"></i>';
    resultTitle.textContent = "Critical Stress - Urgent Support Recommended";
    resultMessage.textContent =
      "Your responses suggest critical stress levels. Please prioritize seeking help from a mental health professional or counselor immediately. You’re not alone, and support is available.";
  }
}

function restartAssessment() {
  currentQuestion = 0;
  answers = {};

  // Reset UI
  document.querySelector(".content").style.display = "block";
  document.getElementById("result-container").classList.remove("show");

  // Reset questions
  document.querySelectorAll(".question-card").forEach((card, index) => {
    card.classList.remove("active");
    if (index === 0) {
      card.classList.add("active");
    }

    // Reset selections
    card.querySelectorAll(".option-button").forEach((option) => {
      option.classList.remove("selected");
    });
  });

  updateProgress();
  updateNavigation();
}

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeQuestions();
  updateNavigation();
});
// </script>
