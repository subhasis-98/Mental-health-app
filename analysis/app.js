const questions = [
  "I feel energetic during the day.",
  "I am able to concentrate on tasks.",
  "I enjoy spending time with others.",
  "I sleep well at night.",
  "I feel anxious or nervous.",
  "I feel hopeless or down.",
  "I get irritated easily.",
  "I feel confident in myself.",
  "I avoid social situations.",
  "I feel overwhelmed by responsibilities.",
  "I experience sudden mood changes.",
  "I find it difficult to relax.",
  "I feel motivated to do things.",
  "I experience panic attacks.",
  "I feel emotionally balanced.",
  "I feel lonely even in a crowd.",
  "I feel satisfied with my personal life.",
  "I struggle to find joy in hobbies.",
  "I get enough rest and recovery.",
  "I feel like talking to someone about my feelings.",
];

const options = [
  "Never (0)",
  "Rarely (1)",
  "Sometimes (2)",
  "Often (3)",
  "Always (4)",
];
const questionContainer = document.getElementById("questions");

// Dynamically generate questions
questions.forEach((q, i) => {
  const div = document.createElement("div");
  div.className = "question";
  div.innerHTML = `<p><strong>Q${i + 1}:</strong> ${q}</p>`;
  options.forEach((opt, score) => {
    div.innerHTML += `
      <label>
        <input type="radio" name="q${i}" value="${score}" required> ${opt}
      </label>`;
  });
  questionContainer.appendChild(div);
});

document.getElementById("quiz-form").addEventListener("submit", function (e) {
  e.preventDefault();

  let totalScore = 0;
  for (let i = 0; i < questions.length; i++) {
    const val = document.querySelector(`input[name="q${i}"]:checked`).value;
    totalScore += parseInt(val);
  }

  // Show result container
  document.getElementById("result-container").style.display = "block";

  // Show chart
  const ctx = document.getElementById("resultChart").getContext("2d");
  const percent = (totalScore / (questions.length * 4)) * 100;
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Stress Indicator (%)", "Remaining"],
      datasets: [
        {
          label: "Mental Health",
          data: [percent, 100 - percent],
          backgroundColor: ["#ef5350", "#b2dfdb"],
          borderWidth: 1,
        },
      ],
    },
  });

  // Show suggestion
  const suggestion = document.getElementById("suggestion");
  if (totalScore <= 20) {
    suggestion.textContent =
      "✅ You're doing great! Keep up your healthy habits.";
    suggestion.style.backgroundColor = "#c8e6c9";
  } else if (totalScore <= 40) {
    suggestion.textContent =
      "⚠️ You're facing some stress. Try meditation, breathing exercises, or going for a walk.";
    suggestion.style.backgroundColor = "#fff9c4";
  } else {
    suggestion.textContent =
      "🚨 You may need support. Please consider talking to a counselor or therapist. Remember, you're not alone.";
    suggestion.style.backgroundColor = "#ffcdd2";
  }

  // Scroll to result
  document
    .getElementById("result-container")
    .scrollIntoView({ behavior: "smooth" });
});
