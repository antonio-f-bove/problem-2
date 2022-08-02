const NUMBER_OF_PAIRS = 6

import { StateManager } from './StateManager.js'
// import { Deck } from './Deck.js'
// import utils from './utils.js'


// const deck = new Deck(NUMBER_OF_PAIRS)

// const table = document.getElementById('table')
// deck.dealCards(table)

const game = startNewGameAndReturnManager()


function startNewGameAndReturnManager() {
  return new StateManager(NUMBER_OF_PAIRS)
}