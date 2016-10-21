import mqtt from 'mqtt'

var client = mqtt.connect('ws://localhost:3000')

const topicFlex = '/controller/flex/mapped'
const topicRight = '/controller/tilt/right'
const topicLeft = '/controller/tilt/left'

let sensors = {
  flex: 0,
  left: 0,
  right: 0
}

client.on('connect', function () {
  console.log('connected')

  client.subscribe(topicFlex)
  client.subscribe(topicRight)
  client.subscribe(topicLeft)
})

client.on('message', function (topic, message) {
  if (topic === topicFlex) {
    sensors.flex = Number(message)
  }

  if (topic === topicLeft) {
    sensors.left = Number(message)
  }

  if (topic === topicRight) {
    sensors.right = Number(message)
  }
})

// Other events
client.on('reconnect', () => console.log('reconnect'))
client.on('close', () => console.log('close'))
client.on('offline', () => console.log('offlien'))
client.on('error', () => console.log('error'))

export { sensors }
