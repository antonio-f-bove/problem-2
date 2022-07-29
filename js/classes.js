export class Deck extends Array {

  constructor(numberOfPairs) {
    super() // override the super constructor

    this.fillWithPairs(numberOfPairs)
    this.shuffle()
  }

  fillWithPairs(numberOfPairs) {
    for (let i = 0; i < numberOfPairs; i++) {
      const card = new Card()
      this.push(card)
      // double-up last pushed card
      this.push(new Card(card.symbol, card.color))
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
}

export class Card {
  backSidePictureUrl = '../assets/hokusai2.jpeg'

  constructor(symbol, color) {
    if (symbol == undefined) symbol = this.getAvailableSymbol()
    this.symbol = symbol

    if (color == undefined) color = this.getUniqueRandomColor()
    this.color = color

    this.domElement = this.createDomElement()
    this.addClickListener()

  }

  addClickListener() {
    this.domElement.addEventListener('click', () => {
      const inner = this.domElement.children[0]
      console.log(inner)
      inner.classList.toggle('flipped')
    })
  }

  dealOn(table) {
    table.append(this.domElement)
  }

  getUniqueRandomColor() {
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += this.getRandomHexCharacter()
    }

    // Se il colore è già in uso ne genera un'altro
    // TODO nulla impedisce di avere 2 colori molto simili, sarebbe meglio usare colori hard-coded
    if (Card.unavailableColors.includes(color)) color = this.getUniqueRandomColor()

    this.makeUnavailable(color)
    return color
  }

  getRandomHexCharacter() {
    // TODO potrebbe stare fuori dalla classe? tipo utility function?
    const charPool = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
    return charPool[Math.floor(Math.random() * 16)]
  }

  makeUnavailable(color) {
    Card.unavailableColors.push(color)
  }

  createDomElement() {
    const el = document.createElement('div')
    el.className = 'card'
    el.innerHTML = `
      <div class="inner">
        <div class="front">
          <img src="${this.backSidePictureUrl}">
        </div>
        <div class="back" style="background-color: ${this.color};">
          <div class="symbol">${this.symbol}</div>
        </div>
      </div>
    `
    // el.style.backgroundColor = this.color

    return el
  }

  show() {
    console.log(this)
    this.domElement.classList.remove('covered')
  }

  cover() {

  }

  static availableSymbols = ['∑', 'ß', 'µ', '∆', 'ø', '¥', '†', '∂', 'å', '∫']
  getAvailableSymbol() {
    const randomIndex = Math.floor(Math.random() * (Card.availableSymbols.length))
    const symbol = Card.availableSymbols[randomIndex]

    // remove symbol form array of availables
    Card.availableSymbols.splice(randomIndex, 1)

    return symbol
  }

  static unavailableColors = []
}
