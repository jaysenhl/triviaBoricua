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

const api_url = new URL('https://opentdb.com/api.php?amount=1&type=multiple')

async function getQuestion(){
    const response = await fetch(api_url)
    const data = await response.json()
    console.log(data.results[0])
    return data.results[0]
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