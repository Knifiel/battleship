export default class Ship {
  constructor(length) {
    this.hull = []
    for (let i = 0; i < length; i++) {
      this.hull[i] = false
    }
  }
  hit(number) {
    this.hull[number] = true
  }
  get isSunk() {
    if (this.hull.filter((x) => x === false).length > 0) {
      return false
    }
    return true
  }
}
