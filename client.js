/*
- sweet alertjs
- 
*/


const addPlayerBtn = document.getElementById('addPlayerBtn')
const createPlayerContainer = document.getElementById('createPlayerContainer')
createPlayerContainer.style.display = 'none'
const startGameBtn = document.getElementById('startGameBtn')
const questionCard = document.getElementById('questionCard')
questionCard.style.display = 'none'
const playerNameInput = document.getElementById('playerNameInput')
const multiQuestionAnswerContainer = document.getElementById('multiQuestionAnswerContainer')
const booleanAnswerContainer = document.getElementById('booleanAnswerContainer')

let playerPoints = 0
let questions = [];
let currentIndex = 0;

let api_url;
if (window.location.hostname === 'localhost') {
    api_url = 'http://localhost:8888/.netlify/functions/trivia';
    } else {
        api_url = 'https://boricuatriviatest.netlify.app/.netlify/functions/trivia';
    }

addPlayerBtn.addEventListener('click', ()=>{
    createPlayerContainer.style.display = 'block'
    addPlayerBtn.style.display = 'none'
})

function getPlayerName(){
    let playerName = playerNameInput.value
    return playerName
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function getQuestion() {
    try {
        const response = await fetch(api_url);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.questions; // Asegúrate de que esto refleje la estructura de tu respuesta de la API
    } catch (error) {
        console.error('Error fetching questions:', error);
        return []; // Devuelve un array vacío en caso de error para manejo seguro posterior
    }
}

function displayQuestion() {
    if (currentIndex < questions.length) {
        const currentQuestion = questions[currentIndex];
        questionCard.innerHTML = ''; 
        createPlayerInfoComponent(); 
        createQuestionComponent(currentQuestion.question);

        if (currentQuestion.type === 'multiple') {
            const allAnswers = [currentQuestion.correct_answer, ...currentQuestion.wrong_answers];
            shuffleArray(allAnswers); 
            createMultipleAnswerComponent(...allAnswers);
        } else if (currentQuestion.type === 'boolean') {
            createBooleanAnswerComponent(currentQuestion.correct_answer);
        }
    } else {
        console.log("Fin del juego");
    }
}



startGameBtn.addEventListener('click', startGame);

async function startGame() {
    createPlayerContainer.style.display = 'none'; // Oculta el contenedor de añadir jugador
    questionCard.style.display = 'block'; // Muestra el contenedor de la pregunta

    let data = await getQuestion();
    if (data && data.length > 0) {
        questions = shuffleArray(data); // Mezclar las preguntas
        currentIndex = 0;
        displayQuestion();
    } else {
        console.log("No se pudieron cargar las preguntas");
    }
}


function createPlayerInfoComponent(){
    let playerName = getPlayerName()
    const playerInfoContainer = document.createElement('div')
    playerInfoContainer.id = "playerInfoContainer"
    const nameElement = document.createElement('span')
    nameElement.textContent = `Jugador: ${playerName}`
    const pointsElement = document.createElement('span')
    pointsElement.textContent = `Puntuación: ${playerPoints}`
    playerInfoContainer.append(nameElement,pointsElement)
    questionCard.append(playerInfoContainer)
}

function createQuestionComponent(questionjson){
    const questionContainer = document.createElement('div')
    questionContainer.classList.add('text-center', 'mt-4')
    questionContainer.id = 'questionTextContainer'
    const questionText = document.createElement('h3')
    questionText.classList.add('text-light','pt-3')
    questionText.id = questionText
    questionText.textContent = questionjson
    questionContainer.append(questionText)
    questionCard.append(questionContainer)

}

function createBooleanAnswerComponent(correctAnswer) {
    const booleanAnswerComponent = document.createElement('div');
    booleanAnswerComponent.id = 'booleanAnswerComponent';
    booleanAnswerComponent.classList.add('row', 'text-center', 'mt-4');

    const answers = ['Sí', 'No']; // Puedes ajustar estos valores según sea necesario
    answers.forEach(answer => {
        const answerElement = document.createElement('button');
        answerElement.classList.add('booleanAnswerBtn');
        answerElement.textContent = answer;
        answerElement.addEventListener('click', () => checkAnswer(answer === 'Sí' ? 'Sí' : 'No'));
        booleanAnswerComponent.appendChild(answerElement);
    });

    questionCard.appendChild(booleanAnswerComponent);
}

function createMultipleAnswerComponent(answer1,answer2,answer3,answer4){
    const multipleAnswerComponent = document.createElement('div')
    multipleAnswerComponent.id = 'multipleAnswerComponent'
    multipleAnswerComponent.classList.add('row', 'text-center', 'mt-4')

    const answersComponent = document.createElement('div')
    answersComponent.classList.add('col-12','col-sm-10','offset-sm-1','col-md-8','offset-md-2')

    const answers = [answer1, answer2, answer3, answer4];
    answers.forEach(answer => {
        const answerElement = document.createElement('button');
        answerElement.classList.add('multiAnswerBtn');
        answerElement.textContent = answer;
        answerElement.addEventListener('click', () => checkAnswer(answer));
        answersComponent.appendChild(answerElement);
    });

    multipleAnswerComponent.appendChild(answersComponent)
    questionCard.appendChild(multipleAnswerComponent)

}

function checkAnswer(selectedAnswer) {
    const currentQuestion = questions[currentIndex]; // Ajuste para el índice actual
    if (selectedAnswer === currentQuestion.correct_answer) {
        playerPoints++;
        console.log("Correcto! Puntos:", playerPoints);
    } else {
        console.log("Incorrecto! La respuesta correcta era:", currentQuestion.correct_answer);
        playerPoints--;
    }

    currentIndex++; // Incrementar aquí después de validar la respuesta
    if (currentIndex < questions.length) {
        displayQuestion(); // Continuar con la siguiente pregunta
    } else {
        console.log("Fin del juego");
        // Aquí puedes reiniciar el juego o mostrar los resultados
    }
}

