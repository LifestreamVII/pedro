from fileio import wFile

def send():
    print("Prepare to send data, creating new file...")
    wFile('data.txt', "", mode='overwrite')
    return 'SEND_OK'