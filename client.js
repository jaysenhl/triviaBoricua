/*
- añadir cuantas preguntas quiero
- anadir significado de puntuacion
- algun algoritmo para validar que las preguntas no se repitan
*/

const questionAmount = document.getElementById('questionAmountInput')
const restartBtn = document.getElementById('restartBtn')
const addPlayerBtn = document.getElementById('addPlayerBtn')
const startGameBtn = document.getElementById('startGameBtn')
const questionCard = document.getElementById('questionCard')
const createPlayerContainer = document.getElementById('createPlayerContainer')
const playerNameInput = document.getElementById('playerNameInput')
const multiQuestionAnswerContainer = document.getElementById('multiQuestionAnswerContainer')
const booleanAnswerContainer = document.getElementById('booleanAnswerContainer')
restartBtn.style.display = 'none'
createPlayerContainer.style.display = 'none'
questionCard.style.display = 'none'

let playerPoints = 0
let questions = [];
let currentIndex = 0;
let correctAnswersCount = 0;
let incorrectAnswersCount = 0;

let api_url;
if (window.location.hostname === 'localhost') {
    api_url = 'http://localhost:8888/.netlify/functions/trivia';
    } else {
        api_url = 'https://boricuatriviatest.netlify.app/.netlify/functions/trivia';
    }

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

addPlayerBtn.addEventListener('click', ()=>{
    createPlayerContainer.style.display = 'block'
    addPlayerBtn.style.display = 'none'
    restartBtn.style.display = 'block'
})

restartBtn.addEventListener('click',()=>location.reload())

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

async function startGame() {
    const totalQuestions = parseInt(questionAmount.value, 10); // Obtiene el valor como un número
    const maxQuestions = 46; // Límite máximo de preguntas

    // Verifica si el usuario ingresó más preguntas de las permitidas
    if (totalQuestions > maxQuestions) {
        // Muestra una alerta indicando el límite
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `El límite máximo de preguntas es de ${maxQuestions}. Por favor, ingresa un número menor.`,
            confirmButtonText: 'Intentar de nuevo'
        }).then((result) => {
            if (result.isConfirmed) {
                // Reinicia el estado del juego o la entrada para que el usuario pueda intentar nuevamente
                createPlayerContainer.style.display = 'block';
                questionCard.style.display = 'none';
                questionAmount.value = ''; // Limpia el input
            }
        });
        return; // Detiene la ejecución de la función para que el usuario pueda corregir la entrada
    }

    createPlayerContainer.style.display = 'none'; // Oculta el contenedor de añadir jugador
    questionCard.style.display = 'block'; // Muestra el contenedor de la pregunta

    let data = await getQuestion();
    if (data && data.length > 0) {
        questions = shuffleArray(data); // Mezclar las preguntas

        if (totalQuestions > 0) {
            questions = questions.slice(0, totalQuestions);
        }

        currentIndex = 0;
        displayQuestion();
    } else {
        console.log("No se pudieron cargar las preguntas");
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
        // Calcula el porcentaje de respuestas correctas
        const totalQuestions = questions.length;
        const correctAnswers = playerPoints / 10; // Asumiendo que cada pregunta correcta da 10 puntos
        const incorrectAnswers = totalQuestions - correctAnswers;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);

        // Muestra el resultado final
        Swal.fire({
            title: '¡Las preguntas se acabaron!',
            html: `
                <p>Total de preguntas: ${totalQuestions}</p>
                <p>Correctas: ${correctAnswers}</p>
                <p>Incorrectas: ${incorrectAnswers}</p>
                <p>Eres un ${percentage}% Boricua</p>
            `,
            icon: 'info',
            confirmButtonText: 'Ver Resultados'
        }).then((result) => {
            if (result.isConfirmed) {
                // Aquí puedes reiniciar el juego o hacer otra acción
            }
        });
    }
}

function checkAnswer(selectedAnswer) {
    const currentQuestion = questions[currentIndex];
    if (selectedAnswer === currentQuestion.correct_answer) {
        playerPoints += 10;
        correctAnswersCount++; // Incrementa el contador de respuestas correctas
        Swal.fire({
            icon: "success",
            title: "Correcto!",
            text: `${currentQuestion.correct_answer}`,
            footer: `<h3>+10 puntos!</h3>`
          });
    } else {
        playerPoints -= 10;
        incorrectAnswersCount++; // Incrementa el contador de respuestas incorrectas
        Swal.fire({
            icon: "error",
            title: "Incorrecto!",
            text: `La respuesta correcta es: ${currentQuestion.correct_answer}`,
            footer: `<h3>-10 puntos!</h3>`
          });
    }

    currentIndex++;
    if (currentIndex < questions.length) {
        displayQuestion();
    } else {
        showFinalResults();
    }
}

function showFinalResults() {
    const totalQuestions = correctAnswersCount + incorrectAnswersCount;
    const percentage = Math.round((correctAnswersCount / totalQuestions) * 100);

    Swal.fire({
        title: '¡Las preguntas se acabaron!',
        html: `
            <p>Total de preguntas: ${totalQuestions}</p>
            <p>Correctas: ${correctAnswersCount}</p>
            <p>Incorrectas: ${incorrectAnswersCount}</p>
            <p>Eres un ${percentage}% Boricua</p>
        `,
        icon: 'info',
        confirmButtonText: 'Reiniciar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload(); // Recarga la página y reinicia el juego

            // TODO: En un futuro, puedes implementar la lógica para guardar los resultados en una base de datos aquí.
            // Esto podría implicar enviar los resultados a un servidor mediante una solicitud HTTP
            // y luego manejar esa solicitud en el servidor para almacenar los resultados en la base de datos.
        }
    });
}

function getPlayerName(){
    let playerName = playerNameInput.value
    return playerName
}

startGameBtn.addEventListener('click', startGame);

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