import { randomInt } from 'math-toolbox'

class Obstacle extends PIXI.Sprite {
  constructor (loader, renderer, state) {
    super()
    this.texture = loader.resources['obstacle.png'].texture
    this.renderer = renderer
    this.state = state
  }

  isColliding (object) {
    let p = object.getBounds()
    let o = this.getBounds()

    if (p.x < o.x + o.width &&
      p.x + p.width > o.x &&
        p.y < o.y + o.height &&
        p.height + p.y > o.y) {
      return true
    }
  }

  outOfView () {
    if (this.position.y > this.renderer.height + this.height) {
      this.respawn()
    }
  }

  respawn () {
    this.position.y = -this.height + randomInt(0, -150)

    let side = Math.round(Math.random())
    this.position.x = side ? randomInt(-this.width, 46) : randomInt(this.renderer.width, this.width)
  }

  render () {
    this.outOfView()
    this.position.y += this.state.speed
  }
}

export default Obstacle
