/*
- add true or false container
- add multiquestion Container function
- add shuffle algorithm
- jugar
- 
*/

/* CODE FOR 

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

async function getQuestion() {
    try {
        const response = await fetch(api_url);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.questions;
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
    return data
}

startGameBtn.addEventListener('click', async ()=>{
    // esconder create player container
    createPlayerContainer.style.display = 'none'
    // recojo el nombre
    let playerName = getPlayerName()
    // hago el api call
    let data = await getQuestion()
    console.log(data)
    
    questionCard.style.display = 'block'
    createPlayerInfoComponent()
    createQuestionComponent(data[1].question)
    createMultipleAnswerComponent(data[1].correct_answer, data[1].wrong_answers[0], data[1].wrong_answers[1],data[1].wrong_answers[2])
})

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

function createMultipleAnswerComponent(answer1,answer2,answer3,answer4){
    const multipleAnswerComponent = document.createElement('div')
    multipleAnswerComponent.id = 'multipleAnswerComponent'
    multipleAnswerComponent.classList.add('row', 'text-center')

    const answersComponent = document.createElement('div')
    answersComponent.classList.add('col-12','col-sm-10','offset-sm-1','col-md-8','offset-md-2')

    // add event listener for the same id's and compare textcontent for answer validation
    let answer_1_element = document.createElement('button')
    answer_1_element.id = 'multiAnswerBtn'
    answer_1_element.classList.add('multianswerbtn')
    answer_1_element.textContent = answer1
    let answer_2_element = document.createElement('button')
    answer_2_element.id = 'multiAnswerBtn'
    answer_2_element.classList.add('multianswerbtn')
    answer_2_element.textContent = answer2
    let answer_3_element = document.createElement('button')
    answer_3_element.id = 'multiAnswerBtn'
    answer_3_element.classList.add('multianswerbtn')
    answer_3_element.textContent = answer3
    let answer_4_element = document.createElement('button')
    answer_4_element.id = 'multiAnswerBtn'
    answer_4_element.classList.add('multianswerbtn')
    answer_4_element.textContent = answer4

    answersComponent.append(answer_1_element,answer_2_element,answer_3_element,answer_4_element)
    multipleAnswerComponent.append(answersComponent)
    questionCard.append(multipleAnswerComponent)

}

