# Brolly
> A little umbrella game, you control with an actual umbrella - wireless of course.

![](media/brolly.gif)

You're a little guy flying with his umbrella through a dangerous world full of obstacles.
As the player, you control the speed by opening and closing the umbrella, and you move the player left/right by tilting.
The speed depends on how collapsed the umbrella is, where an fully opened umbrella is max speed and a closed umbrella is minimum speed.

The umbrella uses one flex sensor to detect how open/closed the umbrella are, two tilt sensors, a battery pack and a ESP8266 WiFi module to create a WiFI access point for MQTT communication.


## How it works

The entire setup consists of three parts:

1. **Controller:** Umbrella with NodeMCU and sensors.
2. **Server:** MQTT broker to pass communication back and forth between umbrella and game.
3. **Game:** Front-end canvas game

### 1. Controller/Umbrella
First, it creates a WiFi access point using the ESP8266 board, afterwards it connects to the server and start publishing sensor data to the server through the MQTT protocol. The controller is written in Lua.

#### Microcontroller
- **Name:** ESP8266 NodeMCU
- **Producer:** LoLin/WeMos
- **Generation:** 2nd
- **Version:** 1.0
- **“Common” name**: v3

#### Sensors
- 1x Flex
- 1x Battery Pack
- 2x Tilt Sensors

### 2. Server
MQTT Broker using [Mosca](https://github.com/mcollina/mosca).
Forwards events form the controller to the front-end and at the same time process the sensor inputs.


### 3. Game/Front-end
Canvas game made using [PIXI.JS](https://github.com/pixijs/pixi.js), and [MQTT.js](https://github.com/mqttjs/MQTT.js) for client-side MQTT.

*Built in a few hours the night before delivery, prepare for spaghetti code, brain-farts and bugs.*


## Setup Controller/NodeMCU
[Controller README.md](controller/README.md)


## Setup Server
[Server README.md](server/README.md)


## Setup Game
[Game README.md](game/README.md)


## Links
- https://nodemcu.readthedocs.io/
- https://github.com/nodemcu/nodemcu-firmware

## Copyright
*@ Terkel Gjervig*
