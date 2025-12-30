// Select the elements from the HTML
let questionEl = document.querySelector(".questions");      // Div where the question text will appear
let optionEl = document.querySelector(".radioes");          // Div where the options (radio buttons) will appear
let quizEl = document.querySelector(".quiz-container");     // The entire quiz container (question + options)
let startButtton = document.querySelector("#start-btn");    // Start Quiz button
let nextButton = document.querySelector("#btn");            // Next button to go to next question
let qRadio = document.querySelector(".questions-radio");    // Div that wraps question + options
let restartBtn = document.querySelector("#restart-btn");  //restart button
let para = document.querySelector("#first-para");
let timer = document.querySelector(".timer p");
let category = "";
let difficulty = "";
let amount = 5;
let setting = document.querySelector(".settings"); //settings
para.style.display = "none";   // to hide instruction initially

// Save the original quiz structure so we can restore it later

let originalQuizHTML = qRadio.innerHTML ;
let timeLeft = 20;
let timerId = null;


// Initialize variables
let questions = [];      // Array to store fetched questions from API
let currentIndex = 0;    // Track the current question index
let score = 0;           // Track the user's score

// Function to fetch questions from Open Trivia Database API
const fetchQuestions = async () => {

    const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`);

    const data = await response.json();
    questions = data.results;  // Save the questions array for later use
}

// Function to display the current question and its options
const displayQuestions =() => {
    const currentQ = questions[currentIndex];  // Get the current question
    
    // Show the question text
    questionEl.innerHTML = currentQ.question;

    // Combine correct answer and incorrect answers
    const allOpt = [
        currentQ.correct_answer, ...currentQ.incorrect_answers
    ];

    // Shuffle the options randomly
    allOpt.sort(() => Math.random() - 0.5);

    // Clear previous options
    optionEl.innerHTML = "";

    // Add each option as a radio button with label
    allOpt.forEach((opt, index) => {
        optionEl.innerHTML += `
        <div>
            <input type="radio" name="answer" id="opt-${index}" value="${opt}">
            <label for="opt-${index}">${opt}</label>
        </div>
        `;
    });
}

// Event listener for Start Quiz button
startButtton.addEventListener("click", async () => {
    
    category = document.querySelector("#category").value;
    difficulty = document.querySelector("#difficulty").value;
    amount = document.querySelector("#qNum").value;
    startTimer();
    nextButton.style.display = "inline-block";
    
    
    setting.style.display = "none"; // hides settings after clicking start
    para.style.display = "inline-block"; //shows instruction
    quizEl.style.display = 'flex';        // Show the quiz container
    startButtton.style.display = "none";  // Hide the Start Quiz button
    await fetchQuestions();                // Fetch questions from API
    displayQuestions();                    // Display the first question
})

// Event listener for Next button
nextButton.addEventListener("click", () => {
    clearInterval(timerId);
    timerId = null;
    startTimer();
    const selected = document.querySelector('input[name="answer"]:checked');  // Get the selected radio option
    

    // Check if selected answer is correct
    if (selected.value === questions[currentIndex].correct_answer){
        score++;  // Increment score
    }

    currentIndex++;  // Move to next question

    if (currentIndex < questions.length){
        displayQuestions();  // Display next question if available
    } else {
        endQuiz();
        

    }
})

restartBtn.addEventListener("click", async () => {
    clearInterval(timerId);
    timerId=null;
    currentIndex = 0;
    score = 0;
    // Restore original quiz structure
    setting.style.display = "flex";
    startButtton.style.display = "inline-block";
    category = document.querySelector("#category").value;
    difficulty = document.querySelector("#difficulty").value;
    amount = document.querySelector("#qNum").value;
    qRadio.style.display = "flex";
    qRadio.innerHTML = originalQuizHTML;
    quizEl.style.display = "none";
    // Re-select elements because DOM was replaced
    questionEl = document.querySelector(".questions");
    optionEl = document.querySelector(".radioes");

    restartBtn.style.display = "none";
    timer.style.display = "inline-block";


    document.querySelector("h1").style.display = "block";
    //document.querySelector("p").style.display = "block";

});
function startTimer(){
    timeLeft = difficulty === "easy"? 20 : difficulty === "medium"? 25 :30 ;
    timer.innerText = `Time Remaining: ${timeLeft}s`;

    timerId = setInterval(()=>{
        timeLeft--;
        timer.innerText = `Time Remaining: ${timeLeft}s`;
        if (timeLeft <= 5){
            timer.classList.add("timer-warning");
        } else {
            timer.classList.remove("timer-warning");
        }
        if (timeLeft === 0){
            goToNextQ();
        }
    },1000);

}
function goToNextQ(){
    clearInterval(timerId);
    timerId = null;

    currentIndex++;
    if (currentIndex < questions.length){
        displayQuestions();
        startTimer();
    } else {
        endQuiz();
        
    }
}
function endQuiz(){
    // If all questions are done, show final score
    qRadio.innerHTML = `<h2>Thanks for Playing! Your score is ${score}</h2>`;
    document.querySelector("h1").style.display = "none";   // Hide heading
    document.querySelector("p").style.display = "none";    // Hide instructions
    timer.style.display = "none";
    nextButton.style.display = "none";  // Hide Next button

    restartBtn.style.display = "inline-block";
}

