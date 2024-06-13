from cmds.send import send
from cmds.chck import chck
from cmds.recv import recv
from cmds.rdec import rdec
from cmds.game import GameCard
from cmds.progress import detect_percentage
from threading import Thread
import time
from fileio import rFile, wFile

class Command:
    def __init__(self, command_string, then, data=None, char=None, *args):
        self.command_string = command_string
        self.then = then
        self.args = args
        self.data = data
        self.task = None
        self.char = char

    def run(self):
        if self.command_string == 'SEND':  # Connected Bluetooth device wants to send data
            return send("data.txt")
        elif self.command_string == 'RECV':  # Connected Bluetooth device wants to receive data
            return recv(self.data, 'data.txt', trim=False)
        elif self.command_string == 'DONE':  # Transfer done
            pass
        elif self.command_string == 'REST':  # Reset the process
            pass
        elif self.command_string == 'CHCK':  # Check sent hash with calculated hash of data
            return chck(self.data)
        elif self.command_string == 'VOID':  # Do nothing
            pass
        elif self.command_string == 'IGME':  # Info from game card
            gc = GameCard()
            gamename = gc.read()
            time.sleep(2)
            string = gamename
#            length = len(string)
#            a = []
#            b = []
#            for i in range(0, length):
#              a.append(dbus.Byte(ord(string[i])))
#              b.append(string[i])
#            string = dbus.Array(a, signature=dbus.Signature('y'))
#            return self.char.WriteValue(string)
            return string
        elif self.command_string == 'WNFC':  # Write new contents to NFC tag
            pass
        elif self.command_string == 'RNFC':  # Read contents from NFC tag
            pass
        elif self.command_string == 'RSAV':  # Read save file from game card
            gc = GameCard()
            task = gc.download()
            self.task = task
            t = Thread(target=detect_percentage, args=(self.char, 'progress.txt'))
            t.start()
            return "RSAV_OK"
        elif self.command_string == 'DSAV':  # Decrypt save data from game card
            gc = GameCard()
            task = gc.decrypt()
            self.task = task
            t = Thread(target=detect_percentage, args=(self.char, 'output.txt'))
            t.start()
            return "DSAV_OK"
        elif self.command_string == 'DPKM':  # Decrypt save data from game card
            gc = GameCard()
            d = rFile('data.txt').split(",")
            wFile('pkm', d[0], 'overwrite')
            task = gc.decode(d[1])
            self.task = task
            t = Thread(target=detect_percentage, args=(self.char, 'decrypted.txt'))
            t.start()
            return "DPKM_OK"
        elif self.command_string == 'RDEC':  # Read the decrypted data text output
            return rdec(self.data)
        elif self.command_string == 'WSAV':  # Write save file to game card
            gc = GameCard()
            d = rFile('data.txt').split(",")
            wFile('pkm', d[0], 'overwrite')
            task = gc.write(d[1], d[2])
            self.task = task
            t = Thread(target=detect_percentage, args=(self.char, 'progress.txt'))
            t.start()
            return 'WSAV_OK'
        elif self.command_string == 'DOWN':  # Restart BT daemon + BT server
            pass
        else:
            raise ValueError(f'Invalid command: {self.command_string}')

    def do_then(self):
        self.command_string = self.then
        return self.run()
