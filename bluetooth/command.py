from cmds.send import send
from cmds.chck import chck
from cmds.recv import recv

class Command:
    def __init__(self, command_string, then, data=None, *args):
        self.command_string = command_string
        self.then = then
        self.args = args
        self.data = data

    def run(self):
        if self.command_string == 'SEND':  # Connected Bluetooth device wants to send data
            return send()
        elif self.command_string == 'RECV':  # Connectecardd Bluetooth device wants to receive data
            return recv(self.data)
        elif self.command_string == 'DONE':  # Transfer done
            pass
        elif self.command_string == 'REST':  # Reset the process
            pass
        elif self.command_string == 'CHCK':  # Check sent hash with calculated hash of data
            return chck(self.data)
        elif self.command_string == 'VOID':  # Do nothing
            pass
        elif self.command_string == 'WNFC':  # Write new contents to NFC tag
            pass
        elif self.command_string == 'RNFC':  # Read contents from NFC tag
            pass
        elif self.command_string == 'RSAV':  # Read save file from game card
            pass
        elif self.command_string == 'WSAV':  # Write save file to game 
            pass
        elif self.command_string == 'DOWN':  # Restart BT daemon + BT server
            pass
        else:
            raise ValueError(f'Invalid command: {self.command_string}')

    def do_then(self):
        self.command_string = self.then
        return self.run()