-- load credentials and options
dofile("credentials.lua")

wifiReady = false
accessReady = false

-- Open Application file
function startup()
    if file.open("init.lua") == nil then
        print("init.lua deleted or renamed")
    else
        print("Running")
        file.close("init.lua")
        -- the actual application is stored in 'application.lua'
        dofile("application.lua")
    end
end

-- Delay load for time to abort
function ready()
        tmr.stop(1) -- stop timer loop
	print("All good, and ready to go!")
        print("You have 3 seconds to abort")
        print("Waiting...")
        tmr.alarm(0, 3000, 0, startup)
end

-- wifi.sta.connect() not necessary because config() uses auto-connect=true by default
function setup_wifi()
	if WIFI_MODE == 1 then
		print("Connecting to WiFi access point...")
		wifi.setmode(wifi.STATIONAP)
		wifi.sta.config(SSID, PASSWORD)
	elseif WIFI_MODE == 2 then
		print("Create WiFi access point...")
		wifi.setmode(wifi.SOFTAP)
		wifi.ap.config({ssid=ACCESS_SSID, pwd=ACCESS_PASSWORD})
	elseif WIFI_MODE == 3 then
		print("Connect to access point and create access point...")
		wifi.setmode(wifi.STATIONAP)
		wifi.ap.config({ssid=ACCESS_SSID, pwd=ACCESS_PASSWORD})
		wifi.sta.config(SSID, PASSWORD)
	else
		print("WiFi off, loading without WiFi...")
		wifi.setmode(wifi.NULLMODE)
		ready()
	end
end

function wifi_check()
	if wifi.sta.getip() == nil then
		print("Waiting for IP address...")
	else
		if wifiReady == false then print("WiFi connection established, IP address: " .. wifi.sta.getip()) end
		wifiReady = true
	end
end

function access_check()
	if wifi.ap.getip() == nil then
		print("Waiting for access point address...")
	else
		if accessReady == false then print("WiFi access point created, IP address: " .. wifi.ap.getip()) end
		accessReady = true
	end
end

------- KICK OFF -------

setup_wifi()

tmr.alarm(1, 1000, 1, function()
    if WIFI_MODE == 1 then wifi_check() end
    if WIFI_MODE == 2 then access_check() end
    if WIFI_MODE == 3 then
	    wifi_check()
	    access_check()
    end

    -- Load application when ready --
    if WIFI_MODE == 1 and wifiReady then ready() end
    if WIFI_MODE == 2 and accessReady then ready() end
    if WIFI_MODE == 3 and wifiReady and accessReady then ready() end
end)
