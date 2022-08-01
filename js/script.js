const NUMBER_OF_PAIRS = 6


import { Deck } from './Deck.js'




const deck = new Deck(NUMBER_OF_PAIRS)

const table = document.getElementById('table')
deck.dealCards(table)
