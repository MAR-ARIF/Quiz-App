const questionEl = document.querySelector(".questions");
const optionEl = document.querySelector(".radioes");
const quizEl = document.querySelector(".quiz-container");
const startButtton = document.querySelector("#start-btn");
const nextButton = document.querySelector("#btn");
const qRadio = document.querySelector(".questions-radio");
let questions = [];
let currentIndex = 0;
let score = 0;

const fetchQuestions = async (amount = 5) => {
    const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&type=multiple`);
    const data = await response.json();
    questions = data.results;
}
const displayQuestions =() => {
    const currentQ = questions[currentIndex];
    
    questionEl.innerHTML = currentQ.question;

    const allOpt = [
        currentQ.correct_answer, ...currentQ.incorrect_answers
    ];

    allOpt.sort(() => Math.random() - 0.5);
    optionEl.innerHTML="";

    allOpt.forEach((opt, index) => {
        optionEl.innerHTML += `
        <div>
            <input type="radio" name="answer" id="opt-${index}" value="${opt}">
            <label for="opt-${index}">${opt}</label>
        </div>
        `;
    });

    
}
startButtton.addEventListener("click",async()=>{
    quizEl.style.display = 'flex';
    startButtton.style.display="none";
    await fetchQuestions();
    displayQuestions();
})

nextButton.addEventListener("click",()=> {
    const selected = document.querySelector('input[name="answer"]:checked');
    
    if(!selected){
        alert("please select one option.");
        return;
    }

    if (selected.value === questions[currentIndex].correct_answer){
        score++;
    }

    currentIndex++;

    if (currentIndex < questions.length){
        displayQuestions();
    } else {
        qRadio.innerHTML = `<h2>Thanks for Playing!\nYour score is ${score}</h2>`;
        document.querySelector("h1").style.display = "none";
        document.querySelector("p").style.display = "none";
        nextButton.style.display = "none";
    }
})
