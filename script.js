if (location.pathname.endsWith("index.html") || location.pathname.endsWith("/")) {
  fetch("https://opentdb.com/api_category.php")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("category-list");
      data.trivia_categories.forEach(cat => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `quiz.html?category=${cat.id}`;
        a.textContent = cat.name;
        li.appendChild(a);
        list.appendChild(li);
      });
    });
}

if (location.pathname.endsWith("quiz.html")) {
  const params = new URLSearchParams(window.location.search);
  const catId = params.get("category");

  fetch(`https://opentdb.com/api.php?amount=10&category=${catId}&type=multiple`)
    .then(res => res.json())
    .then(data => {
      const form = document.getElementById("quiz-form");
      data.results.forEach((q, i) => {
        const div = document.createElement("div");
        div.innerHTML = `<p>${i + 1}. ${q.question}</p>`;
        const options = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
        options.forEach(opt => {
          const label = document.createElement("label");
          label.innerHTML = `<input type="radio" name="q${i}" value="${opt}"> ${opt}`;
          div.appendChild(label);
        });
        form.appendChild(div);
      });

      localStorage.setItem("correctAnswers", JSON.stringify(data.results.map(q => q.correct_answer)));
    });
}

function submitQuiz() {
  const form = document.getElementById("quiz-form");
  const correctAnswers = JSON.parse(localStorage.getItem("correctAnswers"));
  let score = 0;
  correctAnswers.forEach((answer, i) => {
    const userAns = form[`q${i}`].value;
    if (userAns === answer) score++;
  });
  localStorage.setItem("score", score);
  location.href = "result.html";
}
