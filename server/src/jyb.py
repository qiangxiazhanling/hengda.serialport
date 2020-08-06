import sys
import serial
import serial.tools.list_ports

def list(self): 
  try:
    port_list = list(serial.tools.list_ports.comports())
    comName = []
    print(port_list)
    #for i in range(0, len(port_list)):
    #  print(port_list[i])
      #comName.append(port_list[i].device)  
    return comName
  except Exception as e:
    print(e)
    return 'err'

def read_data(comName, hex):
  try:
    hex_list = []
    bps=57600
    timex=5
    ser = serial.Serial(comName,bps)
    result = ser.write(bytes.fromhex(hex))
    nowlen = -1
    while True: 
      hex_list.append(ser.read().hex()) 
      if (nowlen == -1 and len(hex_list) > 5):
        nowlen = int(hex_list[5], 16) + 6
      if(len(hex_list) == nowlen):
        break;
    ser.close()
    return print(' '.join(hex_list))
  except Exception as e:
    return err
    
def read(comName,hex,len):
  try: 
    bps=57600
    timex=0
    ser = serial.Serial(comName,bps,timeout=5)
    result = ser.write(bytes.fromhex(hex))
    for i in range(0, len):
        res += ser.read().hex() + ' '
    ser.close()
    return res
  except Exception as e:
    return 'err'