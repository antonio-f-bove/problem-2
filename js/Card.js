export class Card {
  backSidePictureUrl = '../assets/hokusai2.jpeg'
  isFaceUp = false

  constructor(deck, symbol, color) {
    this.deck = deck

    if (symbol == undefined) symbol = this.getAvailableSymbol()
    this.symbol = symbol

    if (color == undefined) color = this.getUniqueRandomColor()
    this.color = color

    this.domElement = this.createDomElement()
    this.addClickListener()
  }

  addClickListener() {
    this.domElement.addEventListener('click', () => {
      if (!this.isFaceUp) this.deck.manager.handleClick(this)
    })
  }

  flip() {
    this.domElement.children[0].classList.add('flipped')
    this.isFaceUp = true
  }

  cover() {
    this.domElement.children[0].classList.remove('flipped')
    this.isFaceUp = false
  }

  dealOn(table) {
    table.append(this.domElement)
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
    return el
  }

  static availableSymbols = ['∑', 'ß', 'µ', '∆', 'ø', '¥', '†', '∂', 'å', '∫', 'π', '«']
  static unavailableSymbols = []

  getAvailableSymbol() {
    const randomIndex = Math.floor(Math.random() * (Card.availableSymbols.length))
    const symbol = Card.availableSymbols[randomIndex]

    if (Card.unavailableSymbols.includes(symbol)) symbol = this.getAvailableSymbol()

    Card.unavailableSymbols.push(symbol)

    return symbol
  }

  static unavailableColors = []
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
}