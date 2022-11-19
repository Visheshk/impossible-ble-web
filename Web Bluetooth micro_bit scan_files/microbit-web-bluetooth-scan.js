/**
 * Connects to a Bluetooth device.
 * The background color shows if a Bluetooth device is connected (green) or
 * disconnected (red).
 * Logs every step, and all the services and characteristics of the
 * Bluetooth device.
 */

var bluetoothDevice;
var tableFormat = true;



/**
 * Object containing the Bluetooth UUIDs of all the services and
 * characteristics of the micro:bit.
 */
gameballUuid = {
    /**
     * Services
     */
    genericAccess:                              ["00001800-0000-1000-8000-00805f9b34fb", "Generic Access"],
    genericAttribute:                           ["00001801-0000-1000-8000-00805f9b34fb", "Generic Attribute"],
    deviceInformation:                          ["0000180a-0000-1000-8000-00805f9b34fb", "Device Information"],
    accelerometerService:                       ["c75ea010-ede4-4ab4-8f96-17699ebaf1b8", "Accelerometer 1 Service"],
    accelerometer2Service:                        ["d75ea010-ede4-4ab4-8f96-17699ebaf1b8", "Accelerometer 2 Service"],
    gameballService:                            ["00766963-6172-6173-6f6c-7574696f6e73", "Gameball Service"],
    sensorStreamService:                        ["a54d785d-d674-4cda-b794-ca049d4e044b", "Sensor Stream Service"],

    /**
     * Characteristics
     */
     a1Config:  ["1006bd26-daad-11e5-b5d2-0a1d41d68578", "accelerometer_1_config"],
     a1Thresh:  ["1006bd28-daad-11e5-b5d2-0a1d41d68578", "accelerometer_1_threshold"],
     a1Data:    ["1006bfd8-daad-11e5-b5d2-0a1d41d68578", "accelerometer_1_data"],
     a1id:      ["bb64a6c3-3484-4479-abd2-46dff5bfc574", "accelerometer_1_id"],
     a2Config:  ["8f20fa52-dab9-11e5-b5d2-0a1d41d68578", "accelerometer_2_config"],
     a2Thresh:  ["8f20fa54-dab9-11e5-b5d2-0a1d41d68578", "accelerometer_2_threshold"],
     a2Data:    ["8f20fcaa-dab9-11e5-b5d2-0a1d41d68578", "accelerometer_2_data"],
     a2id:      ["a93d70c9-ed5d-4af1-b0ad-518176309dfb", "accelerometer_2_id"],
     magCom:    ["31696178-3630-4892-adf1-19a7437d052a", "magnetometer_command"],
     magData:   ["042eb337-d510-4ee7-943a-baeaa50b0d9e", "magnetometer_data"],
     magRate:   ["08588aac-e32e-4395-ab71-6508d9d00329", "magnetometer_rate"],
     magid:     ["ea1c2a4b-543c-4275-9cbe-890024d777eb", "magnetometer_id"],
     devTest:   ["8e894cbc-f3f8-4e6b-9a0b-7247598552ac", "device_test"],
     devReset:  ["01766963-6172-6173-6f6c-7574696f6e73", "device_reset"],
     devRef:    ["0d42d5d8-6727-4547-9a82-2fa4d4f331bd", "device_refresh_gatt"],
     devName:   ["7c019ff3-e008-4268-b6f7-8043adbb8c22", "device_name"],
     devCol:    ["822ec8e4-4d57-4e93-9fa7-d47ae7e941c0", "device_color"],
     sstream:   ["a54d785d-d675-4cda-b794-ca049d4e044b", "sensor_stream_config"],
     ssdata:    ["a54d785d-d676-4cda-b794-ca049d4e044b", "sensor_stream_data"],
     capV:      ["f4ad0001-d675-4cda-b794-ca049d4e044b", "capacitor_voltage"],
     capCharge: ["a59c6ade-5427-4afb-bfe4-74b21b7893a0", "capacitor_charging"],

    /**
     * Method that searches an UUID among the UUIDs of all the services and
     * characteristics and returns:
     * - in HTML blue color the name of the service/characteristic found.
     * - in HTML red color a message if the UUID has not been found.
     * @param uuid The service or characteristic UUID.
     * @param serviceOrCharacteristic True (or 1) if it is a service, and false
     * (or 0) if it is a characteristic.
     */
    searchUuid(uuid, serviceOrCharacteristic) {
        for (const key in gameballUuid) {
            if (uuid === gameballUuid[key][0]) {
                return "<font color='blue'>" + gameballUuid[key][1] + "</font>";
            }
        }
        if (serviceOrCharacteristic) {
            return "<font color='red'>Unknown Service</font>";
        } else {
            return "<font color='red'>Unknown Characteristic</font>";
        }
    },
}



/**
 * Function that adds string to the log. If newLine is true, it adds a new line
 * at the end of the string.
 * @param string String to print to the log.
 * @param newLine Boolean that specifies whether to start a new line or not.
 */
function addLog(string, newLine) {
    document.getElementById("log").innerHTML += string;
    if (newLine) {
        document.getElementById("log").innerHTML += "<br>";
    };
}

/**
 * Function that adds string (and newline) to the log in bold and red color.
 * @param string String to print to the log.
 */
function addLogError(string) {
    addLog("<b><font color='red'>" + string + "</font></b>", true);
}

/**
 * Function that empties the log.
 */
function clearLog() {
    document.getElementById("log").innerHTML = "";
}



/**
 * Function that gets the supported properties of a characteristic in upper
 * case separated by commas.
 * @param  characteristic Characteristic.
 */
function getSupportedProperties(characteristic) {
    let supportedProperties = [];
    for (const p in characteristic.properties) {
        if (characteristic.properties[p] === true) {
            supportedProperties.push(p.toUpperCase());
        }
    }
    return '[' + supportedProperties.join(', ') + ']';
}



/**
 * Function that turns the background color red.
 */

async function exponentialBackoff(max, delay, toTry, success, fail) {
  try {
    const result = await toTry();
    success(result);
  } catch(error) {
    if (max === 0) {
      return fail();
    }
    time('Retrying in ' + delay + 's... (' + max + ' tries left)');
    setTimeout(function() {
      exponentialBackoff(--max, delay * 2, toTry, success, fail);
    }, delay * 1000);
  }
}


async function connect() {
  exponentialBackoff(3 /* max retries */, 2 /* seconds delay */,
    async function toTry() {
      time('Connecting to Bluetooth Device... ');
      await bluetoothDevice.gatt.connect();
    },
    function success() {
      log('> Bluetooth Device connected. Try disconnect it now.');
    },
    function fail() {
      time('Failed to reconnect.');
    });
  connect();
}

async function onDisconnected() {
    document.getElementById("body").style = "background-color:#FFD0D0";
    connect();
}



/**
 * Function that prints a micro:bit service as a table row.
 * @param service Bluetooth service.
 */
function printService(service) {
    if (tableFormat) {
        stringTable += '<tr style="background-color:#D0D0D0"><td>Service</td><td>' + gameballUuid.searchUuid(service.uuid, 1) + '</td><td>' + service.uuid + '</td><td>-</td></tr>';
    } else {
        addLog('&nbsp;&nbsp;&nbsp;&nbsp;<b>Service: </b>' + gameballUuid.searchUuid(service.uuid, 1) + ' - ' + service.uuid, true);
    };
}

/**
 * Function that prints a micro:bit characteristic.
 * @param characteristic Bluetooth characteristic.
 */
function printCharacteristic(characteristic) {
    if (tableFormat) {
        stringTable += '<tr style="background-color:white"><td>Characteristic</td><td>' + gameballUuid.searchUuid(characteristic.uuid, 0) + '</td><td>' + characteristic.uuid + '</td><td>' + getSupportedProperties(characteristic) + '</td></tr>';
    } else {
        addLog('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Characteristic: </b>' + gameballUuid.searchUuid(characteristic.uuid, 0) + ' - ' + characteristic.uuid + ' ' + getSupportedProperties(characteristic), true);
    };
}



var nSer = Infinity;
var nChar = Infinity;
var stringTable = "";
var myDescriptor;
var a1DataChar;
var a1ThreshChar;
/**
 * Function that connects to a Bluetooth device, prints all its services and
 * all its characteristics.
 */


accelServices = {
    "accel1": {
        "service": "accelerometerService", 
        "settingsChar": "a1Config",
        "threshChar": "a1Thresh"
    }, 
    "accel2": {
        "service": "accelerometer2Service",
        "settingsChar": "a2Config",
        "threshChar": "a2Thresh"
    }
};


// await writeCharVal(gameballUuid["accelerometerService"][0], gameballUuid["a1Config"][0], Uint8Array.of(0x197));
// await writeCharVal(gameballUuid["accelerometerService"][0], gameballUuid["a1Thresh"][0], Uint16Array.of(135));
// async function writeCharVal()

async function connect() {
    addLog("Requesting micro:bit Bluetooth devices... ", false);
    if (!navigator.bluetooth) {
        addLogError("Bluetooth not available in this browser or computer.");
    } else {
        const device = await navigator.bluetooth.requestDevice({
            // To accept all devices, use acceptAllDevices: true and remove filters.
            filters: [{namePrefix: "Gameball"}],
            // acceptAllDevices: true,
            optionalServices: [
                gameballUuid.genericAccess[0], 
                gameballUuid.genericAttribute[0], 
                gameballUuid.deviceInformation[0], 
                gameballUuid.accelerometerService[0], 
                gameballUuid.accelerometer2Service[0], 
                gameballUuid.gameballService[0], 
                gameballUuid.sensorStreamService[0], 
                // gameballUuid.magnetometerService[0], 
                // gameballUuid.buttonService[0], 
                // gameballUuid.ioPinService[0], 
                // gameballUuid.ledService[0], 
                // gameballUuid.eventService[0], 
                // gameballUuid.dfuControlService[0], 
                // gameballUuid.temperatureService[0], 
                // gameballUuid.uartService[0]
            ],
        })
        // log('Connecting to GATT Server...');
        var cc;
        async function getChar(serviceUuid, charUuid, server) {
            thisService = await service.getPrimaryService(serviceUuid);
            thisChar = await thisService.getCharacteristic(charUuid);
            return thisChar;
        }

        function getCharId(charName) {
            return gameballUuid[charName][0]
        }

        async function startAccel(accelName, settingsVal, thresholdVal, server) {
            asa = accelServices[accelName]
            accelService = await server.getPrimaryService(getCharId(asa["service"]));
            acSetting = await accelService.getCharacteristic(getCharId(asa["settingsChar"]));
            acThresh = await accelService.getCharacteristic(getCharId(asa["threshChar"]));
            await acSetting.writeValue(settingsVal);
            await acThresh.writeValue(thresholdVal);
        }
        const server = await device.gatt.connect();
        const services = await server.getPrimaryServices();
            addLog("<font color='green'>OK</font>", true);
            bluetoothDevice = device;
            addLog("Connecting to GATT server (name: <font color='blue'>" + device.name + "</font>, ID: <font color='blue'>" + device.id + "</font>)... ", false);
            device.addEventListener('gattserverdisconnected', onDisconnected);
            document.getElementById("body").style = "background-color:#D0FFD0";
        
            addLog("<font color='green'>OK</font>", true);
            addLog("Getting primary services... ", false);
        
            addLog("<font color='green'>OK</font>", true);
            addLog("Getting characteristics... ", false);
            nSer = services.length;
            
            /**
             * Go to https://replit.com/languages/csharp
               byte[] data = new byte[]{0, 0};
               data[0] = (byte) (128 | (byte) (((1f) / 16.0) * 127));
               data[1] = 0; 
               Console.WriteLine(BitConverter.ToUInt16(data));
             * 
             **/
            
            await startAccel("accel1", Uint8Array.of(0x197), Uint16Array.of(135), server);
            await startAccel("accel2", Uint8Array.of(0x647), Uint16Array.of(135), server);
            // await startSensorStream(Uint8Array.of(3))

            // aService = await server.getPrimaryService("c75ea010-ede4-4ab4-8f96-17699ebaf1b8");
            // settings = await aService.getCharacteristic("1006bd26-daad-11e5-b5d2-0a1d41d68578")
            // await settings.writeValue(Uint8Array.of(0x197));

         
            // threshold = await aService.getCharacteristic("1006bd28-daad-11e5-b5d2-0a1d41d68578")
            // await threshold.writeValue(Uint16Array.of(135));

            // a1DataChar = await aService.getCharacteristic("1006bfd8-daad-11e5-b5d2-0a1d41d68578");
            // startReadingData(a1DataChar);
            // streamMove = await service.getCharacteristic("1006bd28-daad-11e5-b5d2-0a1d41d68578")
            // await characteristic.writeValue(Uint8Array.of(1));
            sService = await server.getPrimaryService("a54d785d-d674-4cda-b794-ca049d4e044b");
            streamChar = await sService.getCharacteristic("a54d785d-d675-4cda-b794-ca049d4e044b");

            await streamChar.writeValue(Uint8Array.of(3));
            streamRead = await sService.getCharacteristic("a54d785d-d676-4cda-b794-ca049d4e044b");
            startReadingData(streamRead);
        
        services.forEach(async (service) =>  {
            var characteristics = await service.getCharacteristics();
            nChar = characteristics.length;
            printService(service);
            nSer--;
            // console.log(characteristics);
            characteristics.forEach(async (characteristic) => {
                printCharacteristic(characteristic);
                nChar--;
                if ((nSer === 0) && (nChar === 0) && tableFormat) {
                    addLog('<table><tr><th>Service/Characteristic</th><th>Name</th><th>UUID</th><th>Available properties</th></tr>' + stringTable + '</table>', false);
                    stringTable = "";
                };
            });
        });
        async function startReadingData(ch) {
            await ch.startNotifications();
            await ch.addEventListener('characteristicvaluechanged', handleDataChange);
            console.log(ch);
        }
        

    };
}

function handleDataChange(event) {
  tb = event.target.value.buffer;
  console.log(tb);
  tba = new Uint16Array(tb);
  console.log(tba);
  // console.log(event.target.value);
  // console.log(event.target.service.uuid.slice(8,17));
  // let batteryLevel = event.target.value.getUint8(0);
  // log('> Battery Level is ' + batteryLevel + '%');
  // console.log(batteryLevel);
}



/**
 * Function that disconnects from the Bluetooth device (if connected).
 */
function disconnect() {
    addLog("Disconnecting... ", false);
    if (!bluetoothDevice) {
        addLogError("There is no device connected.");
    } else if (bluetoothDevice.gatt.connected) {
        bluetoothDevice.gatt.disconnect();
        if (!bluetoothDevice.gatt.connected) {
            addLog("<font color='green'>OK</font>", true);
        };
    } else {
        addLogError("There is no device connected.");
    }
}