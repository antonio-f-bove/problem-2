// TODO needs refactoring: separate game phases & actual playing states (noCard, oneCard...)


export class StateManager {
  activeCards = []
  foundPairs = 0

  constructor(maxPairs) {
    this.maxPairs = maxPairs
    this.currentState = new NoActiveCards(this)
  }

  changeState(state) {
    this.currentState = state
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

class Win extends State {
  constructor(manager) {
    super(manager)
    
    this.showWinModal()
  }

  showWinModal() {
    document.getElementById('win-modal').style.display = 'flex'
  }
}
