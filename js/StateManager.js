// TODO needs refactoring: separate game states & actual playing phases (noCard, oneCard...)

import { Card } from "./Card.js"
import { Deck } from "./Deck.js"
import utils from "./utils.js"

export class StateManager {
  activeCards = []
  foundPairs = 0

  constructor(maxPairs) {
    this.maxPairs = maxPairs
    this.table = document.getElementById('table')
    this.currentState = new Ready(this)
  }

  setUpDeck() {
    this.cleanUp()
    this.deck = new Deck(this.maxPairs, this.table, this)
  }

  cleanUp() {
    this.table.innerHTML = ''
    Card.unavailableColors.length = 0
    Card.unavailableSymbols.length = 0
  }

  changeState(state) {
    this.currentState = state
    console.log('state', this.currentState)
  }

  handleClick(card) {
    this.currentState.handle(card)
  }

  activeCardsMatch() {
    return this.activeCards[0].color === this.activeCards[1].color
  }

  coverActiveCards() {
    this.activeCards.forEach(card => {
      card.cover()
    })
  }

  emptyActiveCards() {
    this.activeCards.length = 0
  }

  gameIsWon() {
    return this.foundPairs === this.maxPairs
  }
}




class State {
  constructor(manager) {
    this.manager = manager
  }

  showScreen(screenType) {
    document.getElementById(`${screenType}-screen`).style.display = 'block'
  }

  hideAllScreens() {
    const allScreens = document.querySelectorAll('[id*="-screen"]')
    allScreens.forEach(screen => {
      console.log(screen)
      screen.style.display = 'none'
    })
  }

  listenForNewGame() {
    const btns = document.querySelectorAll('.new-game-button')
    /* 
    TODO qui bisogna proprio trovare una soluzione migliore
    sono due bottoni che non compaiono mai insieme, ma hanno lo stesso nome di classe
    li si potrebbe cercare con più specificità, ma bisognerebbbe passare parametri
    alla funzione (id del parent)
    */
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        console.log('NEW GAME PLEASE!')
        this.hideAllScreens()
  
        this.startNewGame()
      })
    })
  }

  startNewGame() {
    this.manager.setUpDeck()
    this.showScreen('game')
    this.manager.changeState(new NoActiveCards(this.manager))
  }
}

class NoActiveCards extends State {
  constructor(manager) {
    super(manager)
  }

  handle(card) {  
    card.flip()
    this.manager.activeCards.push(card)
    this.manager.changeState(new OneActiveCard(this.manager))
  }
}

class OneActiveCard extends State {
  constructor(manager) {
    super(manager)
  }

  async handle(card) {
    // check if it is not the same card clicked twice or if more than 2 cards are clicked
    if (!card === this.manager.activeCards[0] || this.manager.activeCards.length >= 2) return

    card.flip()
    this.manager.activeCards.push(card)

    if (this.manager.activeCardsMatch()) {
      this.manager.foundPairs++
    } else {
      // wait 1.5 seconds then cover active cards
      // TODO slouzioni migliori?
      // await new Promise(r => setTimeout(r, 1500));
      await utils.sleep(1500)
      this.manager.coverActiveCards()  
    }

    this.manager.emptyActiveCards()
    
    if (this.manager.gameIsWon()) {
      this.manager.changeState(new Win(this.manager))
    } else {
      this.manager.changeState(new NoActiveCards(this.manager))
    }
  }
}

class Ready extends State {
  screenName = 'ready'

  constructor(manager) {
    super(manager)

    this.screen = 

    this.showScreen(this.screenName)
    this.listenForNewGame()
  }
}

class Win extends State {
  screenName = 'win'

  constructor(manager) {
    super(manager)
    
    this.showScreen(this.screenName)
    this.listenForNewGame()
  }
}
