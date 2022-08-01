const NUMBER_OF_PAIRS = 6


import { Deck } from './Deck.js'


const main = document.querySelector('main')


const deck = new Deck(NUMBER_OF_PAIRS, main)

const table = document.getElementById('table')
deck.dealCards(table)
