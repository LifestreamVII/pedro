#!/usr/bin/python3

import dbus
import re
from advertisement import Advertisement
from service import Application, Service, Characteristic, Descriptor
from hashlib import sha256
from command import Command
from fileio import wFile

GATT_CHRC_IFACE = "org.bluez.GattCharacteristic1"
NOTIFY_TIMEOUT = 5000

class SimpleBLEAdvertisement(Advertisement):
    def __init__(self, index):
        Advertisement.__init__(self, index, "peripheral")
        self.add_local_name("SimpleBLEDevice")
        self.include_tx_power = True

class SimpleBLEService(Service):
    SIMPLE_SVC_UUID = "00000001-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, index):
        Service.__init__(self, index, self.SIMPLE_SVC_UUID, True)
        self.add_characteristic(DataCharacteristic(self))

class DataCharacteristic(Characteristic):
    DATA_CHARACTERISTIC_UUID = "00000002-710e-4a5b-8d75-3e5b444bc3cf"

    def __init__(self, service):
        Characteristic.__init__(self, self.DATA_CHARACTERISTIC_UUID, ["notify", "read", "write"], service)
        self.add_descriptor(DataDescriptor(self))
        self.data_value = []
        self.full_body = []
        self.write_mode = False
        self.notifying = False

    def ReadValue(self, options):
        print("ReadValue called")
        return self.data_value

    def WriteValue(self, value, options):
        try:
            input_data = ''.join([chr(b) for b in value])
            in_type = input_data[:3]
            param = input_data[4:]
            print(in_type)
            print(param)
            if in_type == 'CMD': # Command
                    self.write_mode = False
                    cmd = param[:4]
                    pattern_then = re.findall(r'(?<=\()[A-Z,\s]+(?=\))', param)
                    pattern_cmdData = re.findall(r'(?<=\()[A-Za-z,\s\d]+(?=\))', param)
                    then = []
                    if pattern_then:
                        args = pattern_then[0].split(',')
                        then = args[0] # future improvement : add multiple following CMDs
                    cmdData = None
                    if pattern_cmdData and pattern_cmdData[0]:
                        cmdData = pattern_cmdData[0]
                    if cmd == "SEND":
                        self.write_mode = True
                    cmd = Command(cmd, then, data=cmdData)
                    exec = cmd.run()
                    if exec:
                        print('OK')
                        value = exec.encode()
                    else:
                        raise ValueError(f'Unknown Err')
            elif in_type == 'INF': # Info
                    print(f"Info: {param}")
            elif in_type == 'ERR': # Error
                    print(f"Error: {param}")
            elif in_type == 'DAT': # Data
                    if self.write_mode:
                        if '|EOF' in param:
                            param = param.replace('|EOF', '')
                            self.write_mode = False
                        wFile('data.txt', param, mode='append')
            self.data_value = value
            self.PropertiesChanged(GATT_CHRC_IFACE, {"Value": self.data_value}, [])
            return self.data_value
        except Exception as e:
            print("Error handling WriteValue:", e)
            raise dbus.exceptions.DBusException("org.freedesktop.DBus.Error.InvalidArgs", str(e))
        return self.data_value

    def StartNotify(self):
        if self.notifying:
            return

        self.notifying = True

        value = 6969
        self.PropertiesChanged(GATT_CHRC_IFACE, {"Value": value}, [])
        self.add_timeout(NOTIFY_TIMEOUT, self.WriteValue(value))

    def StopNotify(self):
        self.notifying = False


class DataDescriptor(Descriptor):
    DATA_DESCRIPTOR_UUID = "2901"
    DATA_DESCRIPTOR_VALUE = "Data Characteristic"

    def __init__(self, characteristic):
        Descriptor.__init__(self, self.DATA_DESCRIPTOR_UUID, ["read"], characteristic)

    def ReadValue(self, options):
        value = []
        desc = self.DATA_DESCRIPTOR_VALUE
        for c in desc:
            value.append(dbus.Byte(c.encode()))
        return value

app = Application()
app.add_service(SimpleBLEService(0))
app.register()

adv = SimpleBLEAdvertisement(0)
adv.register()

try:
    app.run()
except KeyboardInterrupt:
    app.quit()

