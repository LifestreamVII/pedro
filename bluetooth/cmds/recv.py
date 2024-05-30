from fileio import rFile

def recv(offset):
    if int(offset) or int(offset) == 0:
        data = rFile('data.txt')
        if data:
            if int(offset) > len(data):
                offset = len(data)
            return data[int(offset):]
        else:
            raise ValueError(f'Error: No data')

    return False