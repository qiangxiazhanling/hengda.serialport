import Socket from 'socket.io-client'
const socket = Socket(`http://localhost:${window.WS_PORT}/`)

export default socket