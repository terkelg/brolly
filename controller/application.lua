-- Set Pins
gpio.mode(7,gpio.INPUT)
gpio.mode(8,gpio.INPUT)
gpio.write(7, gpio.LOW)
gpio.write(8, gpio.LOW)

-- Settings
reconnectWait = 1000
publishWait = 50
brokerIP = "192.168.4.2"
brokerPort = 1883

print("application.lua: Starting MQTT client..")

-- initiate the mqtt client and set keepalive timer to 0 (0 = keep alive)
-- Add auth on broker later (user: test, pass: test)
mqtt = mqtt.Client("nodemcu", 0, "test", "test")
connected = false

function connectMQTT()

	mqtt:connect(brokerIP, brokerPort, 0, function(conn) print("mqtt:connected!") end, function(conn, reason) print("mqtt:error") end)

	-- setup Last Will and Testament (optional)
	-- Broker will publish a message with qos = 0, retain = 0, data = "offline"
	-- to topic "/lwt" if client don't send keepalive packet
	mqtt:lwt("/lwt", "offline", 0, 0)


	---- Publish/Subscribe ----

	mqtt:on("connect", function(con)
		print ("Connected..")

		-- Start alarm-loop when connected
		connected = true
		tmr.start(0)
	end)

	mqtt:on("offline", function(con)
		print ("Offline..")
		connected = false;
		tmr.stop(0)
		reconnect()
	end)

	mqtt:on("message", function(conn, topic, data)
		print(topic .. ":" )
		if data ~= nil then
			print(data)
		end
	end)

	main()
end


-- Connect Loop
function reconnect()
	tmr.alarm(1, reconnectWait, 1, function()
		if connected then
			tmr.stop(1)
		else
			print("Reconnecting..")
			connectMQTT()
		end
	end)
end


-- Main
function main()

	-- One time publish here --

	-- Publish Loop
	tmr.register(0, publishWait, tmr.ALARM_AUTO, function()

		-- publish a message with QoS = 0, retain = 0
		mqtt:publish("/controller/flex", adc.read(0), 0, 0, function(conn)
			print("Sent Flex - ADC:0")
		end)

		-- publish a message with QoS = 0, retain = 1
		mqtt:publish("/controller/tilt/left", gpio.read(8), 0, 1, function(conn)
			print("Sent Tilt Left - GPIO:8")
		end)

		-- publish a message with QoS = 0, retain = 1
		mqtt:publish("/controller/tilt/right", gpio.read(7), 0, 1, function(conn)
			print("Sent Tilt Right - GPIO:7")
		end)

	end)
end


-- Kick off!
connectMQTT()
