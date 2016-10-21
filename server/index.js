/*
 * https://github.com/mcollina/mosca/wiki/Mosca-basic-usage
 */
var mosca = require('mosca')
var MT = require('math-toolbox')


// Storage is not needed
// but nice to have
var ascoltatore = {
  // using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
}

// Mosca settings
var moscaSettings = {
  port: 1883,
  backend: ascoltatore,
  persistence: {
    factory: mosca.persistence.Mongo,
    url: 'mongodb://localhost:27017/mqtt'
  },
  http: {
    port: 3000,
    bundle: true,
    static: './'
  }
}

var server = new mosca.Server(moscaSettings)
server.on('ready', setup)

// fired when a client connects
server.on('clientConnected', function (client) {
  console.log('client connected', client.id)
})

// fired when a message is received
server.on('published', function (packet, client) {
  if (packet.topic === '/controller/flex') {
	   // console.log('Flex: ', packet.payload.toString())
	  var sensorRead = Number(packet.payload.toString())
	  var mapped = MT.clamp(1, 9, MT.map(sensorRead, 823, 860, 1, 9))

	  // Publish new value
	  var message = {
		  topic: '/controller/flex/mapped',
		  payload: mapped.toString(),
		  qos: 0, // 0, 1, or 2
		  retain: false // or true
	  };

	  server.publish(message, function() {
		  console.log('Sent flex value');
	  });
  }

  if (packet.topic === '/controller/tilt/left') {
	  // console.log('Retain: ', packet.retain)
	  console.log('Tilt left', packet.payload.toString())
  }

  if (packet.topic === '/controller/tilt/right') {
	  // console.log('Retain: ', packet.retain)
	  console.log('Tilt right', packet.payload.toString())
  }
})


/*
// Other events
server.on('clientDisconnecting', function (packet, client) {})
server.on('clientDisconnected', function (packet, client) {})
server.on('subscribed', function (packet, client) {})
server.on('unsubscribed', function (packet, client) {})
*/

// fired when the mqtt server is ready
function setup () {
  console.log('Mosca server is up and running')

	var message = {
		topic: '/data',
		payload: '[Data here]', // or a Buffer
		qos: 0, // 0, 1, or 2
		retain: false // or true
	};


	setInterval(function(){
		server.publish(message, function() {
			console.log('Sent /hello/world done!');
		});
	}, 2500);

}

