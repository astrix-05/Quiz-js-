const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".timer-value"); 
const resultContainer = document.querySelector(".result-container");



// Quiz state variables
const QUIZ_TIME_LIMIT = 10;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let quizCategory = "programming";
let numberofQuestions = 5;
let currentQuestion = null;
const questionIndexHistory = [];
let correctAnswerCount = 0;

// Display the quiz result and hide the quiz container
const showQuizResult = () => {
    quizContainer.style.display = "none"; 
    resultContainer.style.display = "block";

    const resultText = `You answered <b>${correctAnswerCount}</b> out of <b>${numberofQuestions}</b> questions correctly! Great effort!`;
    document.querySelector(".result-message").innerHTML = resultText;
}

// ✅ Start and manage the countdown timer
const startTimer = () => {
    clearInterval(timer);  // Reset any previous timer
    currentTime = QUIZ_TIME_LIMIT;
    timerDisplay.textContent = `${currentTime}s`;

    timer = setInterval(() => {
        currentTime--;
        timerDisplay.textContent = `${currentTime}s`;

        if (currentTime <= 0) {
            clearInterval(timer);
            highlightCorrectAnswer();  // Show correct answer when time runs out
            nextQuestionBtn.style.visibility = "visible";  // Enable next question button
            quizContainer.querySelector(".quiz-timer").style.background = "#c31402";  // Change timer color to red
        }
    }, 1000);
};

// ✅ Fetch a random question from the selected category
const getRandomQuestion = () => {
    const categoryQuestions = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions || [];

    // Show the results if all the questions have been answered already
    if (questionIndexHistory.length >= Math.min(categoryQuestions.length, numberofQuestions)) {
        return showQuizResult();  // This should navigate to result page later
    }

    const availableQuestions = categoryQuestions.filter((_, index) => !questionIndexHistory.includes(index));
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

    questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    return randomQuestion;
};

// ✅ Highlight the correct answer option
const highlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");
    correctOption.insertAdjacentHTML("beforeend", `<span class="material-symbols-rounded">check_circle</span>`);
};

// ✅ Handle the user's answer selection
const handleAnswer = (option, answerIndex) => {
    clearInterval(timer);

    const isCorrect = currentQuestion.correctAnswer === answerIndex;
    option.classList.add(isCorrect ? "correct" : "incorrect");

    const iconHTML = `<span class="material-symbols-rounded">${isCorrect ? 'check_circle' : 'cancel'}</span>`;
    option.insertAdjacentHTML("beforeend", iconHTML);

    if (!isCorrect) {
        highlightCorrectAnswer();
    } else {
        correctAnswerCount++;
    }

    // Disable all options after selection
    answerOptions.querySelectorAll(".answer-option").forEach(opt => {
        opt.style.pointerEvents = "none";
    });

    nextQuestionBtn.style.visibility = "visible";
};

// ✅ Render the question and answer options
const renderQuestion = () => {
    currentQuestion = getRandomQuestion();
    if (!currentQuestion) return;
    
    startTimer();  // Start timer on new question

    // Update UI
    answerOptions.innerHTML = "";
    nextQuestionBtn.style.visibility = "hidden";
    quizContainer.querySelector(".quiz-timer").style.background = "#32313c";
    document.querySelector(".question-text").textContent = currentQuestion.question;
    questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberofQuestions}</b> Questions`;

    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        answerOptions.appendChild(li);
        li.addEventListener("click", () => handleAnswer(li, index));
    });
};

// Start the quiz and render the random question
const startQuiz = () => {
    configContainer.style.display = "none";
    quizContainer.style.display = "block";

    // Update the quiz category and number of questions 
    const selectedCategory = configContainer.querySelector(".category-option.active");
const selectedQuestionCount = configContainer.querySelector(".question-option.active");

if (!selectedCategory || !selectedQuestionCount) {
    alert("Please select a category and number of questions!");
    return;
}
  quizCategory = selectedCategory.textContent;
numberofQuestions = parseInt(selectedQuestionCount.textContent);

    renderQuestion();
}

// Highlight the selected option on click - category or no. of question 
document.querySelectorAll(".category-option, .question-option").forEach(option => {
    option.addEventListener("click", () => {
        option.parentNode.querySelectorAll(".active").forEach(activeOption => {
            activeOption.classList.remove("active");
        });
        option.classList.add("active");
    });
});

// Reset the quiz and return to the configuration container
const resetQuiz = () => {
    clearInterval(timer);
    correctAnswerCount = 0;
    questionIndexHistory.length = 0;
    configContainer.style.display = "block";
    resultContainer.style.display = "none";
    quizContainer.style.display = "none";
}

renderQuestion();
nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-again-btn").addEventListener("click", resetQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click", startQuiz);
