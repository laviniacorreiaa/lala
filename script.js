
const questions = [
    // CIÊNCIA
    {
        category: "ciencia",
        question: "Qual é o planeta mais próximo do Sol?",
        answers: ["Vênus", "Mercúrio", "Marte", "Terra"],
        correct: 1,
        explanation: "Mercúrio é o planeta mais próximo do Sol."
    },
    {
        category: "ciencia",
        question: "Qual é o símbolo químico da água?",
        answers: ["CO2", "O2", "H2O", "NaCl"],
        correct: 2,
        explanation: "A água é formada por dois átomos de hidrogênio e um de oxigênio."
    },
    {
        category: "ciencia",
        question: "Quantos ossos tem aproximadamente um adulto?",
        answers: ["106", "206", "306", "406"],
        correct: 1,
        explanation: "Um adulto normalmente tem cerca de 206 ossos."
    },
    {
        category: "ciencia",
        question: "Qual órgão bombeia o sangue pelo corpo?",
        answers: ["Pulmão", "Cérebro", "Estômago", "Coração"],
        correct: 3,
        explanation: "O coração bombeia o sangue para todo o organismo."
    },

    // TECNOLOGIA
    {
        category: "tecnologia",
        question: "O que significa a sigla HTML?",
        answers: [
            "HyperText Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Link",
            "Hyper Transfer Main Logic"
        ],
        correct: 0,
        explanation: "HTML é a linguagem de marcação usada para estruturar páginas web."
    },
    {
        category: "tecnologia",
        question: "Qual linguagem é muito usada para tornar sites interativos?",
        answers: ["Photoshop", "JavaScript", "Excel", "Windows"],
        correct: 1,
        explanation: "JavaScript permite criar interações, jogos e funcionalidades em sites."
    },
    {
        category: "tecnologia",
        question: "Qual destas opções é um sistema operacional?",
        answers: ["Google", "Instagram", "Linux", "YouTube"],
        correct: 2,
        explanation: "Linux é um sistema operacional."
    },
    {
        category: "tecnologia",
        question: "Qual é a função principal de um navegador web?",
        answers: [
            "Editar vídeos",
            "Criar processadores",
            "Consertar computadores",
            "Acessar páginas da internet"
        ],
        correct: 3,
        explanation: "Navegadores como Chrome e Firefox permitem acessar sites."
    },

    // GAMES
    {
        category: "games",
        question: "Qual empresa criou o Mario?",
        answers: ["Sony", "Nintendo", "Microsoft", "Sega"],
        correct: 1,
        explanation: "Mario é um personagem da Nintendo."
    },
    {
        category: "games",
        question: "Qual jogo é famoso por seus blocos e construções?",
        answers: ["Minecraft", "FIFA", "Pac-Man", "The Sims"],
        correct: 0,
        explanation: "Minecraft permite explorar, construir e sobreviver em um mundo de blocos."
    },
    {
        category: "games",
        question: "Qual destes jogos é um battle royale?",
        answers: ["Tetris", "Portal", "Fortnite", "Solitaire"],
        correct: 2,
        explanation: "Fortnite é conhecido por seu modo battle royale."
    },
    {
        category: "games",
        question: "Qual personagem é o principal herói de The Legend of Zelda?",
        answers: ["Mario", "Kratos", "Sonic", "Link"],
        correct: 3,
        explanation: "Link é o herói protagonista da série The Legend of Zelda."
    },

    // GEOGRAFIA
    {
        category: "geografia",
        question: "Qual é a capital do Brasil?",
        answers: ["São Paulo", "Brasília", "Rio de Janeiro", "Salvador"],
        correct: 1,
        explanation: "Brasília é a capital federal do Brasil desde 1960."
    },
    {
        category: "geografia",
        question: "Qual é o maior oceano do planeta?",
        answers: ["Atlântico", "Índico", "Pacífico", "Ártico"],
        correct: 2,
        explanation: "O oceano Pacífico é o maior e mais profundo do planeta."
    },
    {
        category: "geografia",
        question: "Em qual continente fica o Egito?",
        answers: ["África", "Europa", "América", "Oceania"],
        correct: 0,
        explanation: "O Egito fica principalmente no nordeste da África."
    },
    {
        category: "geografia",
        question: "Qual é o maior país do mundo em área territorial?",
        answers: ["Canadá", "China", "Brasil", "Rússia"],
        correct: 3,
        explanation: "A Rússia é o maior país do mundo em área territorial."
    }
];

const categoryNames = {
    ciencia: "Ciência",
    tecnologia: "Tecnologia",
    games: "Games",
    geografia: "Geografia"
};

const homeScreen = document.getElementById("home-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const categorySelect = document.getElementById("category");
const startBtn = document.getElementById("start-btn");
const quitBtn = document.getElementById("quit-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const homeBtn = document.getElementById("home-btn");
const logo = document.getElementById("logo");

const questionText = document.getElementById("question-text");
const questionCategory = document.getElementById("question-category");
const questionCounter = document.getElementById("question-counter");
const answersContainer = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const scoreDisplay = document.getElementById("score");

const letters = ["A", "B", "C", "D"];
const TIME_LIMIT = 15;
const POINTS_PER_QUESTION = 100;

let quizQuestions = [];
let currentIndex = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let answered = false;

document.getElementById("year").textContent =
    new Date().getFullYear();

// Embaralha uma cópia do array sem alterar o original.
function shuffle(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

function showScreen(screen) {
    [homeScreen, quizScreen, resultScreen].forEach(element => {
        element.classList.add("hidden");
    });

    screen.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function startGame() {
    stopTimer();

    const selectedCategory = categorySelect.value;

    const filteredQuestions = selectedCategory === "todas"
        ? questions
        : questions.filter(q => q.category === selectedCategory);

    if (filteredQuestions.length === 0) {
        alert("Não existem perguntas nesta categoria.");
        return;
    }

    // Sorteia a ordem das perguntas.
    quizQuestions = shuffle(filteredQuestions);

    currentIndex = 0;
    score = 0;
    correctCount = 0;
    wrongCount = 0;

    scoreDisplay.textContent = score;

    showScreen(quizScreen);
    renderQuestion();
}

function renderQuestion() {
    stopTimer();

    answered = false;

    const question = quizQuestions[currentIndex];
    const total = quizQuestions.length;

    questionCounter.textContent =
        `PERGUNTA ${currentIndex + 1} DE ${total}`;

    progressBar.style.width =
        `${(currentIndex / total) * 100}%`;

    questionText.textContent = question.question;
    questionCategory.textContent =
        categoryNames[question.category].toUpperCase();

    answersContainer.innerHTML = "";
    feedback.className = "feedback hidden";
    feedback.textContent = "";

    nextBtn.classList.add("hidden");
    nextBtn.innerHTML = currentIndex === total - 1
        ? 'Ver resultado <span>🏆</span>'
        : 'Próxima pergunta <span>→</span>';

    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer-btn";

        const letter = document.createElement("span");
        letter.className = "answer-letter";
        letter.textContent = letters[index];

        const text = document.createElement("span");
        text.className = "answer-text";
        text.textContent = answer;

        button.append(letter, text);

        button.addEventListener("click", () => {
            selectAnswer(index);
        });

        answersContainer.appendChild(button);
    });

    startTimer();
}

function startTimer() {
    timeLeft = TIME_LIMIT;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            stopTimer();
            handleTimeout();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    timerDisplay.textContent = `⏱ ${timeLeft}s`;
    timerDisplay.classList.toggle("urgent", timeLeft <= 5);
}

function selectAnswer(selectedIndex) {
    if (answered) return;

    answered = true;
    stopTimer();

    const question = quizQuestions[currentIndex];
    const buttons = answersContainer.querySelectorAll(".answer-btn");
    const isCorrect = selectedIndex === question.correct;

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === question.correct) {
            button.classList.add("correct");
        } else if (index === selectedIndex) {
            button.classList.add("wrong");
        }
    });

    if (isCorrect) {
        correctCount++;
        score += POINTS_PER_QUESTION;
        scoreDisplay.textContent = score;

        feedback.className = "feedback good";
        feedback.textContent = `✓ Resposta correta! +${POINTS_PER_QUESTION} pontos. ${question.explanation}`;
    } else {
        wrongCount++;

        feedback.className = "feedback bad";
        feedback.textContent = `✗ Resposta incorreta. ${question.explanation}`;
    }

    nextBtn.classList.remove("hidden");
}

function handleTimeout() {
    if (answered) return;

    answered = true;
    wrongCount++;

    const question = quizQuestions[currentIndex];
    const buttons = answersContainer.querySelectorAll(".answer-btn");

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === question.correct) {
            button.classList.add("correct");
        }
    });

    feedback.className = "feedback bad";
    feedback.textContent =
        `⏰ O tempo acabou! ${question.explanation}`;

    nextBtn.classList.remove("hidden");
}

function nextQuestion() {
    if (!answered) return;

    currentIndex++;

    if (currentIndex < quizQuestions.length) {
        renderQuestion();
    } else {
        finishGame();
    }
}

function finishGame() {
    stopTimer();

    progressBar.style.width = "100%";

    const total = quizQuestions.length;
    const percentage = Math.round((correctCount / total) * 100);

    document.getElementById("final-score").textContent = score;
    document.getElementById("correct-count").textContent = correctCount;
    document.getElementById("wrong-count").textContent = wrongCount;
    document.getElementById("percentage").textContent = `${percentage}%`;

    const resultIcon = document.getElementById("result-icon");
    const resultTitle = document.getElementById("result-title");
    const resultMessage = document.getElementById("result-message");

    if (percentage === 100) {
        resultIcon.textContent = "🏆";
        resultTitle.textContent = "Perfeito!";
        resultMessage.textContent =
            "Incrível! Você acertou todas as perguntas!";
    } else if (percentage >= 70) {
        resultIcon.textContent = "🔥";
        resultTitle.textContent = "Mandou muito bem!";
        resultMessage.textContent =
            "Você demonstrou que entende bastante do assunto.";
    } else if (percentage >= 40) {
        resultIcon.textContent = "💪";
        resultTitle.textContent = "Bom trabalho!";
        resultMessage.textContent =
            "Você está no caminho certo. Continue praticando!";
    } else {
        resultIcon.textContent = "🚀";
        resultTitle.textContent = "Vamos de novo!";
        resultMessage.textContent =
            "Cada tentativa é uma oportunidade de aprender.";
    }

    showScreen(resultScreen);
}

function goHome() {
    stopTimer();
    showScreen(homeScreen);
}

startBtn.addEventListener("click", startGame);

nextBtn.addEventListener("click", nextQuestion);

restartBtn.addEventListener("click", startGame);

homeBtn.addEventListener("click", goHome);

logo.addEventListener("click", event => {
    event.preventDefault();
    goHome();
});

quitBtn.addEventListener("click", () => {
    const shouldQuit = window.confirm(
        "Deseja sair do desafio? Seu progresso atual será perdido."
    );

    if (shouldQuit) {
        goHome();
    }
});
