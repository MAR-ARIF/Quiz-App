// Select the elements from the HTML
const questionEl = document.querySelector(".questions");      // Div where the question text will appear
const optionEl = document.querySelector(".radioes");          // Div where the options (radio buttons) will appear
const quizEl = document.querySelector(".quiz-container");     // The entire quiz container (question + options)
const startButtton = document.querySelector("#start-btn");    // Start Quiz button
const nextButton = document.querySelector("#btn");            // Next button to go to next question
const qRadio = document.querySelector(".questions-radio");    // Div that wraps question + options

// Initialize variables
let questions = [];      // Array to store fetched questions from API
let currentIndex = 0;    // Track the current question index
let score = 0;           // Track the user's score

// Function to fetch questions from Open Trivia Database API
const fetchQuestions = async (amount = 5) => {
    const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&type=multiple`);
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
    quizEl.style.display = 'flex';        // Show the quiz container
    startButtton.style.display = "none";  // Hide the Start Quiz button
    await fetchQuestions();                // Fetch questions from API
    displayQuestions();                    // Display the first question
})

// Event listener for Next button
nextButton.addEventListener("click", () => {
    const selected = document.querySelector('input[name="answer"]:checked');  // Get the selected radio option
    
    if(!selected){
        alert("Please select one option.");  // Show alert if no option is selected
        return;
    }

    // Check if selected answer is correct
    if (selected.value === questions[currentIndex].correct_answer){
        score++;  // Increment score
    }

    currentIndex++;  // Move to next question

    if (currentIndex < questions.length){
        displayQuestions();  // Display next question if available
    } else {
        // If all questions are done, show final score
        qRadio.innerHTML = `<h2>Thanks for Playing! Your score is ${score}</h2>`;
        document.querySelector("h1").style.display = "none";   // Hide heading
        document.querySelector("p").style.display = "none";    // Hide instructions
        nextButton.style.display = "none";                     // Hide Next button
    }
})

