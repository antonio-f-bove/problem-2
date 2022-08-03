import { Card } from "./Card.js"
import utils from "./utils.js"

export class Deck extends Array {

  constructor(numberOfPairs, table, manager) {
    super() // override the super constructor

    this.manager = manager
    console.log(this.manager)

    this.fillWithCardPairs(numberOfPairs)
    this.recursivelyShuffle(2)

    this.dealCards(table)
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

  recursivelyShuffle(howManyMoreTimes) {
    // Fisher-Yates shuffle
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = this[j]
      this[j] = this[i]
      this[i] = temp
    }

    if (--howManyMoreTimes <= 0) return
    this.recursivelyShuffle(howManyMoreTimes)
  }

  dealCards(table) {
    this.forEach(card => {
      card.dealOn(table)
    })
  }

  async doInitialShowOfCards() {
    this.showAllCards()
    await utils.sleep(5000) // TODO serve un modo piu bello
    // await new Promise(r => setTimeout(r, 5000));
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
