import * as PIXI from 'pixi.js'
import * as MT from 'math-toolbox'
import loop from 'raf-loop'
import Obstacle from './obstacle'
import Player from './player'
import { sensors } from './controller'
import './styles/main.scss'

class App {
  constructor () {

    // create canvas
    this.renderer = PIXI.autoDetectRenderer(600, 900, {backgroundColor: 0x30622f})
    document.body.appendChild(this.renderer.view)

    // create the root of the scene graph
    this.stage = new PIXI.Container()

    // init loader
    this.loader = new PIXI.loaders.Loader('static')

    // current game state
    this.state = this.play

    // hold all obstacels
    this.obstacles = []
    this.obstaclesContainer = new PIXI.Container()

    // speed
    this.appState = {
      speed: 1,
      obstacleMinDis: 300,
      keyLeft: 0,
      keyRight: 0,
      sensors: sensors
    }

    // add event listeners
    document.addEventListener('keydown', this.onKeyDown.bind(this))
    document.addEventListener('keyup', this.onKeyUp.bind(this))
    window.addEventListener('resize', this.onResize.bind(this))
  }

  start () {
    // add contents
    this.loader.add('player.png')
    this.loader.add('obstacle.png')
    this.loader.add('bg.png')
    this.loader.add('game-over.png')
    this.loader.add('start.png')
    this.loader.add('wall.png')

    // events
    this.loader.once('complete', this.setup.bind(this))
    this.loader.once('progress', (e) => {
      console.log('progress: ', e)
    })

    // LOAD THAT BUS!
    this.loader.load()
  }

  bgSetup () {
    // BG
    let bgTexture = this.loader.resources['bg.png'].texture
    this.bg = new PIXI.Sprite(bgTexture)
    this.bg.position.y = this.renderer.height - this.bg.height
    this.stage.addChild(this.bg)
  }

  midSetup () {
    // create scene
    this.gameScene = new PIXI.Container()
    this.stage.addChild(this.gameScene)

    // player Sprite
    this.player = new Player(this.loader, this.renderer, this.appState)
    this.gameScene.addChild(this.player)

    // create obsticals
    this.initObstacles()

    let wallTexture = this.loader.resources['wall.png'].texture

    // wall left
    this.wallLeft = new PIXI.extras.TilingSprite(wallTexture, 46, this.renderer.height)
    this.stage.addChild(this.wallLeft)

    // wall right
    this.wallRight = new PIXI.extras.TilingSprite(wallTexture, 46, this.renderer.height)
    this.wallRight.position.x = this.renderer.width - 46
    this.wallRight.tileScale = new PIXI.Point(-1, 1)
    this.stage.addChild(this.wallRight)
  }

  topSetup () {
    this.gameOverScene = new PIXI.Container()
    this.stage.addChild(this.gameOverScene)

    // Hide this when starting the game
    this.gameOverScene.visible = false

    // Load game over text
    let gameOverTexture = this.loader.resources['game-over.png'].texture
    this.gameOverText = new PIXI.Sprite(gameOverTexture)
    this.gameOverText.anchor.x = 0.5
    this.gameOverText.anchor.y = 0.5
    this.gameOverText.scale = new PIXI.Point(0.9, 0.9)
    this.gameOverText.position.x = this.renderer.width / 2
    this.gameOverText.position.y = this.renderer.height / 2 - 100
    this.gameOverScene.addChild(this.gameOverText)
  }

  initObstacles () {
    this.obstacles = []
    this.obstaclesContainer.removeChildren()

    for (let i = 0; i < 4; i++) {
      let obstacle = new Obstacle(this.loader, this.renderer, this.appState)

      // place in left or right side of screen
      let side = Math.round(Math.random())
      obstacle.position.x = side ? MT.randomInt(-obstacle.width, 46) : MT.randomInt(this.renderer.width, obstacle.width)

      let dis = 0 - i * this.appState.obstacleMinDis + MT.randomInt(0, 150)
      obstacle.position.y = dis

      this.obstacles.push(obstacle)
      this.obstaclesContainer.addChild(obstacle)
    }

    this.gameScene.addChild(this.obstaclesContainer)
  }

  /**
   * Kick off game
   * Setup initial logic and start game loop
   */
  setup () {
    this.bgSetup()
    this.midSetup()
    this.topSetup()

    loop(this.gameLoop.bind(this)).start()
  }

  /**
   * Main Game Loop
   * Update current state and render
   */
  gameLoop (tick) {
    this.state()
    this.renderer.render(this.stage)
  }

  /* ---- EVENTS ---- */

  onKeyDown (e) {
    if (e.keyCode === 39) {
      this.appState.keyLeft = 1
    } else if (e.keyCode === 37) {
      this.appState.keyRight = 1
    }
  }

  onKeyUp (e) {
    this.appState.keyRight = 0
    this.appState.keyLeft = 0
    this.player.vx = 0
    this.player.angle = 0
  }

  onResize (e) { }

  onMouseMove (e) { }

  /* ---- STATES ---- */

  play () {
    this.player.render()

    // Update speed
    this.appState.speed = sensors.flex || 1

    // update obstacle
    this.obstacles.forEach((obstacle) => {
      obstacle.render()
      if (obstacle.isColliding(this.player)) {
        this.gameOver()
      }
    })

    this.player.move()

    // move walls
    this.wallLeft.tilePosition.y += this.appState.speed
    this.wallRight.tilePosition.y += this.appState.speed

    // hit walls?
    if (this.player.position.x > this.renderer.width || this.player.position.x < 0) {
      this.gameOver()
    }
  }

  over () {}

  /* ---- UTILS ---- */

  gameOver () {
    this.player.dead()
    this.obstaclesContainer.visible = false
    this.gameOverScene.visible = true
    this.state = this.over

    setTimeout(this.gameRestart.bind(this), 1000)
  }

  gameRestart () {
    this.player.restart()
    this.obstaclesContainer.visible = true
    this.gameOverScene.visible = false

    this.initObstacles()

    this.state = this.play
  }
}

// let's go!
let app = new App()
app.start()
