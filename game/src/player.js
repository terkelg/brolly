import { Sprite } from 'pixi.js'

class Player extends PIXI.Sprite {
  constructor (loader, renderer, state) {
    super()

    this.loader = loader
    this.renderer = renderer
    this.state = state

    // set texture
    this.texture = loader.resources['player.png'].texture

    // velocity
    this.vx = 0
    this.vy = 0

    // angle
    this.angle = 0

    // center the sprite's anchor point
    this.anchor.x = 0.5
    this.anchor.y = 0.5

    // move the sprite to the center of the screen
    this.position.x = renderer.width / 2
    this.position.y = renderer.height / 2 + 100
  }

  render () {
    this.rotation = this.angle
    this.position.x += this.vx
  }

  restart () {
    this.visible = true
    this.position.x = this.renderer.width / 2
  }

  dead () {
    this.position.x = this.renderer.width / 2
    this.visible = false
  }

  move () {
    //console.log(this.state.sensors)

    if (this.state.sensors.left || this.state.keyLeft) {
      this.vx = 2
      this.angle = 0.5
    } else if (this.state.sensors.right || this.state.keyRight) {
      this.vx = -2
      this.angle = -0.5
    } else {
      this.state.keyRight = 0
      this.state.keyLeft = 0
      this.vx = 0
      this.angle = 0
    }
  }
}

export default Player
