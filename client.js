/*
- add true or false container and questions
- add shuffle algorithm
- create questionCardContainer function
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
let playerPoints = 0


let api_url;
if (window.location.hostname === 'localhost') {
    api_url = 'http://localhost:8888/.netlify/functions/trivia';
} else {
    api_url = 'https://boricuatriviatest.netlify.app/.netlify/functions/trivia';
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

addPlayerBtn.addEventListener('click', ()=>{
    createPlayerContainer.style.display = 'block'
    addPlayerBtn.style.display = 'none'
})

function getPlayerName(){
    let playerName = playerNameInput.value
    return playerName
}

startGameBtn.addEventListener('click', async ()=>{
    // esconder create player container
    createPlayerContainer.style.display = 'none'
    // recojo el nombre
    let playerName = getPlayerName()
    // hago el api call
    let questions = await getQuestion()
    // muestro la pregunta con los datos
    questionCard.style.display = 'block'
    console.log(questions[0])
})