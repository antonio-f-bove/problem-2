import { StateManager } from "./StateManager.js"
import { Card } from "./Card.js"

export class Deck extends Array {

  constructor(numberOfPairs) {
    super() // override the super constructor

    this.stateManager = new StateManager()

    this.fillWithCardPairs(numberOfPairs)
    this.shuffle()

    this.doInitialShowOfCards()
  }

  fillWithCardPairs(numberOfPairs) {
    for (let i = 0; i < numberOfPairs; i++) {
      const card = new Card(this)
      this.push(card)
      // double-up last pushed card
      this.push(new Card(this, card.symbol, card.color))
    }
  }

  shuffle(last = false) {
    // Fisher-Yates shuffle
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = this[j]
      this[j] = this[i]
      this[i] = temp
    }

    // actually a double shuffle
    if (last) return
    this.shuffle(true)
  }

  dealCards(table) {
    this.forEach(card => {
      card.dealOn(table)
    })
  }

  async doInitialShowOfCards() {
    this.showAllCards()
    await new Promise(r => setTimeout(r, 5000));
    this.coverAllCards()
  }

  showAllCards() {
    this.forEach(card => {
      card.flip()
    })
  }

  coverAllCards() {
    this.forEach(card => {
      card.cover()
    })
  }
}
