// TODO needs refactoring: separate game states & actual playing phases (noCard, oneCard...)

import { Deck } from "./Deck.js"

export class StateManager {
  activeCards = []
  foundPairs = 0

  constructor(maxPairs) {
    this.maxPairs = maxPairs
    this.currentState = new Ready(this)
  }

  setUpDeck() {
    this.table = document.getElementById('table')
    this.cleanUpTable(this.table)
    this.deck = new Deck(this.maxPairs, this.table, this)
  }

  cleanUpTable(table) {
    table.innerHTML = ''
  }

  changeState(state) {
    this.currentState = state
    console.log('state', this.currentState)
  }

  handleClick(card) {
    this.currentState.handle(card)
  }

  activeCardsMatch() {
    return this.activeCards[0].symbol === this.activeCards[1].symbol
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
    const btn = document.querySelector('.new-game-button')
    btn.addEventListener('click', () => {
      this.hideAllScreens()

      // start new game
      this.manager.setUpDeck()
      this.showScreen('game')
      this.manager.changeState(new NoActiveCards(this.manager))

      // this.manager.changeState(new StartGame(this.manager))
    })
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
      // wait 2 seconds the cover active cards
      // TODO slouzioni migliori?
      await new Promise(r => setTimeout(r, 2000));
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

  // listenForNewGame() {
  //   const btn = document.querySelector('.new-game-button')
  //   btn.addEventListener('click', () => {
  //     this.hideAllScreens()

  //     // start new game
  //     this.manager.setUpDeck()
  //     this.showScreen('game')
  //     this.manager.changeState(new NoActiveCards(this.manager))

  //     // this.manager.changeState(new StartGame(this.manager))
  //   })
  // }
}

// class StartGame extends State {
//   screenName = 'game'

//   constructor(manager) {
//     super(manager)

//     this.manager.setUpDeck()
//     this.showScreen(this.screenName)
//     this.manager.changeState(new NoActiveCards(this.manager))
//   }
// }

class Win extends State {
  screenName = 'win'

  constructor(manager) {
    super(manager)
    
    this.showScreen(this.screenName)
    this.listenForNewGame()
  }

  // listenForNewGame() {
  //   // TODO directly start new game
  //   const btn = document.querySelector('.new-game-button')
  //   btn.addEventListener('click', () => {
  //     this.hideAllScreens()
  //     this.manager.changeState(new Ready(this.manager))
  //   })
  // }
}
