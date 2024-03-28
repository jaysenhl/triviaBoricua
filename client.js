/*
- add true or false container and questions
- 
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
    api_url = 'https://tudominio.netlify.app/.netlify/functions/trivia';
}

async function getQuestion() {
    try {
        const response = await fetch(api_url);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data.questions); // Suponiendo que la función devuelve un objeto con una propiedad 'questions'
        return data.questions;
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

addPlayerBtn.addEventListener('click',()=>{
    createPlayerContainer.style.display = 'block'
    addPlayerBtn.style.display = 'none'
})

startGameBtn.addEventListener('click',()=>{
    // esconder create player container
    createPlayerContainer.style.display = 'none'
    // recojo el nombre
    let playerName = playerNameInput.value
    // hago el api call
    getQuestion()
    // muestro la pregunta con los datos
    questionCard.style.display = 'block'

})