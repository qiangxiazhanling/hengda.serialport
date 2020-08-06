import sys
import serial
import serial.tools.list_ports
from flask import Flask
from flask_socketio import SocketIO, emit
from src import jyb



app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
if __name__ == '__main__':
  socketio.run(app)

@app.route('/')
def get():
  return app.send_static_file('index.html')

@socketio.on('connect', namespace='/')
def connect():
  print('connect')

@socketio.on('juyuanList', namespace='/')
def handle_command(message):
  port_list = list(serial.tools.list_ports.comports())
  comName = []
  for i in range(0, len(port_list)):
    comName.append(''+port_list[i].device)
  emit('juyuanList', comName)

@socketio.on('jueyuanId4', namespace='/')
def handle_command(message):
  res = ''
  try:
    bps=57600
    ser = serial.Serial(message['comName'], bps,timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, message['len']):
      res += ser.read().hex() + ' '
    ser.close()
    emit('jueyuanId4', res)
  except Exception as e:
    print(e)
    emit('jueyuanId4', 'err')


@socketio.on('writeJueyuanId', namespace='/')
def handle_command(message):
  res = ''
  print(message)
  try:
    bps=57600
    ser = serial.Serial(message['comName'], bps,timeout=5)
    result = ser.write(bytes.fromhex(message['hex']))
    for i in range(0, message['len']):
      res += ser.read().hex() + ' '
    ser.close()
    emit('jueyuanId', res)
  except Exception as e:
    print(e)
    emit('jueyuanId', 'err')

@socketio.on('disconnect', namespace='/')
def disconnect():
  print('disconnect')

