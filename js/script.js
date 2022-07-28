const NUMBER_OF_PAIRS = 6


import {Deck, Card} from './classes.js'


const gameStatusTracker = [
  'ready',
  'playing',
  'retry',
]
let gameStatus = 0

const d = new Deck(NUMBER_OF_PAIRS)

const table = document.getElementById('table')
d.dealCards(table)
// d.forEach(card => {
//   card.domElement.addEventListener('click', e => {
//     card.show()
//   })
// })