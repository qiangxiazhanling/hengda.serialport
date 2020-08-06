import sys
import json
import serial
import serial.tools.list_ports
from flask import Flask
from flask_socketio import SocketIO, emit
from src import jyb



app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
juyuan_bps=57600
if __name__ == '__main__':
  socketio.run(app)

@app.route('/')
def get():
  return app.send_static_file('index.html')

@socketio.on('connect', namespace='/')
def connect():
  print('connect')

@socketio.on('juyuanList', namespace='/')
def juyuanList(message):
  port_list = list(serial.tools.list_ports.comports())
  comName = []
  for i in range(0, len(port_list)):
    comName.append(''+port_list[i].device)
  emit('juyuanList', comName)

@socketio.on('jueyuanId4', namespace='/')
def jueyuanId4(message):
  res = ''
  print(message)
  try:
    res = ''
    ser = serial.Serial(message['comName'], juyuan_bps, timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, message['len']):
      res += ser.read().hex() + ' '
    ser.close()
    emit('jueyuanId4', res)
  except Exception as e:
    print(e)
    emit('jueyuanId4', 'err')


@socketio.on('writeJueyuanId', namespace='/')
def writeJueyuanId(message):
  try:
    res = ''
    ser = serial.Serial(message['comName'], juyuan_bps, timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, message['len']):
      res += ser.read().hex() + ' '
    ser.close()
    emit('writeJueyuanId', res)
  except Exception as e:
    print(e)
    emit('writeJueyuanId', 'err')

@socketio.on('writeJueyuanWifi', namespace='/')
def writeJueyuanWifi(message):
  res = ''
  try:
    ser = serial.Serial(message['comName'], juyuan_bps, timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, message['len']):
      res += ser.read().hex() + ' '
    ser.close()
    emit('writeJueyuanWifi', res)
  except Exception as e:
    print(e)
    emit('writeJueyuanWifi', 'err')

@socketio.on('initConfig1', namespace='/')
def initConfig1(message):
  res = ''
  try:
    ser = serial.Serial(message['comName'], juyuan_bps, timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, message['len']):
      res += ser.read().hex() + ' '
    ser.close()
    emit('initConfig1', res)
  except Exception as e:
    print(e)
    emit('initConfig1', 'err')

@socketio.on('initConfig2', namespace='/')
def initConfig2(message):
  res = ''
  try:
    ser = serial.Serial(message['comName'], juyuan_bps, timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, message['len']):
      res += ser.read().hex() + ' '
    ser.close()
    emit('initConfig2', res)
  except Exception as e:
    print(e)
    emit('initConfig2', 'err')

@socketio.on('saveJueyuanConfig', namespace='/')
def saveJueyuanConfig(message):
  res = ''
  try:
    ser = serial.Serial(message['comName'], juyuan_bps, timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, message['len']):
      res += ser.read().hex() + ' '
    ser.close()
    emit('saveJueyuanConfig', res)
  except Exception as e:
    print(e)
    emit('saveJueyuanConfig', 'err')

@socketio.on('jueyuanReadData', namespace='/')
def jueyuanReadData(message):
  res = ''
  try:
    print(message)
    ser = serial.Serial(message['comName'], juyuan_bps, timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    nowlen = -1
    hex_list = []
    while True: 
      hex_list.append(ser.read().hex())   
      if (nowlen == -1 and len(hex_list) > 5):
        nowlen = int(hex_list[5], 16) + 6
      if(len(hex_list) == nowlen):
        break;
    ser.close()
    emit('jueyuanReadData', ' '.join(hex_list))
  except Exception as e:
    print(e)
    emit('jueyuanReadData', 'err')

@socketio.on('clearDevice', namespace='/')
def clearDevice(message):
  res = ''
  try:
    ser = serial.Serial(message['comName'], juyuan_bps, timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, message['len']):
      res += ser.read().hex() + ' '
    ser.close()
    emit('saveJueyuanConfig', res)
  except Exception as e:
    print(e)
    emit('saveJueyuanConfig', 'err')

@socketio.on('disconnect', namespace='/')
def disconnect():
  print('disconnect')

