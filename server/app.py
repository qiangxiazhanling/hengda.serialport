import sys
import json
import serial
import logging
import serial.tools.list_ports
import webbrowser
from flask import Flask, redirect
from flask_socketio import SocketIO, emit

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['REVERSE_PROXY_PATH'] = '/api'
socketio = SocketIO(app)
juyuan_bps=57600
fgs_bps=115200

if __name__ == '__main__':
  socketio.run(app)

@app.route('/')
def get():
  return app.send_static_file('index.html')

@app.route('/static/static/<file>')
def static_file(file):
  return redirect('/static/'+file)


@app.route('/exit')
def exit_app():
  socketio.stop()


@socketio.on('connect', namespace='/')
def connect():
  print('connect')

@socketio.on('comList', namespace='/')
def juyuanList(message):
  port_list = list(serial.tools.list_ports.comports())
  comName = []
  for i in range(0, len(port_list)):
    comName.append({
      'comName': ''+port_list[i].device,
      'description': ''+port_list[i].description
    })
  print(comName)
  emit('comList', comName)

@socketio.on('jueyuanId4', namespace='/')
def jueyuanId4(message):
  res = ''
  ser = None
  try:
    res = ''
    ser = serial.Serial(message['comName'], juyuan_bps, timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, message['len']):
      res += ser.read().hex() + ' '
    ser.close()
    emit('jueyuanId4', res)
  except Exception as e:
    if ser!=None:
      ser.close()
    print(e)
    emit('jueyuanId4', 'err')


@socketio.on('writeJueyuanId', namespace='/')
def writeJueyuanId(message):
  ser = None
  try:
    res = ''
    ser = serial.Serial(message['comName'], juyuan_bps, timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, message['len']):
      res += ser.read().hex() + ' '
    ser.close()
    emit('writeJueyuanId', res)
  except Exception as e:
    if ser!=None:
      ser.close()
    print(e)
    emit('writeJueyuanId', 'err')

@socketio.on('writeJueyuanWifi', namespace='/')
def writeJueyuanWifi(message):
  ser = None
  res = ''
  try:
    ser = serial.Serial(message['comName'], juyuan_bps, timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, message['len']):
      res += ser.read().hex() + ' '
    ser.close()
    emit('writeJueyuanWifi', res)
  except Exception as e:
    if ser!=None:
      ser.close()
    print(e)
    emit('writeJueyuanWifi', 'err')

@socketio.on('initConfig1', namespace='/')
def initConfig1(message):
  ser = None
  res = ''
  try:
    ser = serial.Serial(message['comName'], juyuan_bps, timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, message['len']):
      res += ser.read().hex() + ' '
    ser.close()
    emit('initConfig1', res)
  except Exception as e:
    if ser!=None:
      ser.close()
    print(e)
    emit('initConfig1', 'err')

@socketio.on('initConfig2', namespace='/')
def initConfig2(message):
  ser = None
  res = ''
  try:
    ser = serial.Serial(message['comName'], juyuan_bps, timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, message['len']):
      res += ser.read().hex() + ' '
    ser.close()
    emit('initConfig2', res)
  except Exception as e:
    if ser!=None:
      ser.close()
    print(e)
    emit('initConfig2', 'err')

@socketio.on('saveJueyuanConfig', namespace='/')
def saveJueyuanConfig(message):
  ser = None
  res = ''
  try:
    ser = serial.Serial(message['comName'], juyuan_bps, timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, message['len']):
      res += ser.read().hex() + ' '
    ser.close()
    emit('saveJueyuanConfig', res)
  except Exception as e:
    if ser!=None:
      ser.close()
    print(e)
    emit('saveJueyuanConfig', 'err')

@socketio.on('jueyuanReadData', namespace='/')
def jueyuanReadData(message):
  ser = None
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
    if ser!=None:
      ser.close()
    print(e)
    emit('jueyuanReadData', 'err')

@socketio.on('clearDevice', namespace='/')
def clearDevice(message):
  ser = None
  res = ''
  try:
    ser = serial.Serial(message['comName'], juyuan_bps, timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, message['len']):
      res += ser.read().hex() + ' '
    ser.close()
    emit('clearDevice', res)
  except Exception as e:
    if ser!=None:
      ser.close()
    print(e)
    emit('clearDevice', 'err')

@socketio.on('fangganshaoId4', namespace='/')
def fangganshaoId4(message):
  ser = None
  try:
    res = ''
    timex=5
    ser = serial.Serial(message['comName'],fgs_bps,timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, int(message['len'])):
        res += ser.read().hex() + ' '
    ser.close()
    emit('fangganshaoId4', res)
  except Exception as e:
    if ser!=None:
      ser.close()
    print(e)
    emit('fangganshaoId4', 'err')


@socketio.on('fangganshaoWriteId', namespace='/')
def fangganshaoWriteId(message):
  ser = None
  try:
    res = ''
    timex=5
    ser = serial.Serial(message['comName'],fgs_bps,timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, int(message['len'])):
        res += ser.read().hex() + ' '
    ser.close()
    emit('fangganshaoWriteId', res)
  except Exception as e:
    if ser!=None:
      ser.close()
    print(e)
    emit('fangganshaoWriteId', 'err')

@socketio.on('fangganshaoWifi', namespace='/')
def fangganshaoWifi(message):
  ser = None
  try:
    res = ''
    timex=5
    ser = serial.Serial(message['comName'],fgs_bps,timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, int(message['len'])):
        res += ser.read().hex() + ' '
    ser.close()
    emit('fangganshaoWifi', res)
  except Exception as e:
    if ser!=None:
      ser.close()
    print(e)
    emit('fangganshaoWifi', 'err')

@socketio.on('fangganshaoReadTestEdit', namespace='/')
def fangganshaoReadTestEdit(message):
  ser = None
  try:
    res = ''
    timex=5
    ser = serial.Serial(message['comName'],fgs_bps,timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, int(message['len'])):
        res += ser.read().hex() + ' '
    ser.close()
    emit('fangganshaoReadTestEdit', res)
  except Exception as e:
    if ser!=None:
      ser.close()
    print(e)
    emit('fangganshaoReadTestEdit', 'err')


@socketio.on('fangganshaoWriteTestEdit', namespace='/')
def fangganshaoWriteTestEdit(message):
  ser = None
  try:
    res = ''
    timex=5
    ser = serial.Serial(message['comName'],fgs_bps,timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, int(message['len'])):
        res += ser.read().hex() + ' '
    ser.close()
    emit('fangganshaoWriteTestEdit', res)
  except Exception as e:
    if ser!=None:
      ser.close()
    print(e)
    emit('fangganshaoWriteTestEdit', 'err')

@socketio.on('fangganshaoDataTotal', namespace='/')
def fangganshaoDataTotal(message):
  ser = None
  try:
    res = ''
    timex=5
    ser = serial.Serial(message['comName'],fgs_bps,timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, int(message['len'])):
        res += ser.read().hex() + ' '
    ser.close()
    emit('fangganshaoDataTotal', res)
  except Exception as e:
    if ser!=None:
      ser.close()
    print(e)
    emit('fangganshaoDataTotal', 'err')

@socketio.on('fangganshaoReadData', namespace='/')
def fangganshaoReadData(message):
  ser = None
  try:
    hex_list = []
    ser = serial.Serial(message['comName'], fgs_bps, timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    nowlen = -1
    while True: 
      hex = ser.read().hex()
      hex_list.append(hex)
      if (nowlen == -1 and len(hex_list) > 5):
          nowlen = int(hex_list[5], 16) + 6
      if(len(hex_list) == nowlen):
          break
    ser.close()
    emit('fangganshaoReadData', ' '.join(hex_list))
  except Exception as e:
    if ser!=None:
      ser.close()
    emit('fangganshaoReadData', 'err')

@socketio.on('fangganshaoClear', namespace='/')
def fangganshaoClear(message):
  ser = None
  try:
    res = ''
    timex=5
    ser = serial.Serial(message['comName'],fgs_bps,timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, int(message['len'])):
        res += ser.read().hex() + ' '
    ser.close()
    emit('fangganshaoClear', res)
  except Exception as e:
    print(e)
    ser.close()
    emit('fangganshaoClear', 'err')

@socketio.on('disconnect', namespace='/')
def disconnect():
  print('disconnect')

path = sys.path[0].replace('\\','/')+'/browser/portable.exe --incognito --disable-web-security --app=%s --app-auto-launched'
webbrowser.get(path).open("http://localhost:47815/")
print('恒达设备助手服务已启动')