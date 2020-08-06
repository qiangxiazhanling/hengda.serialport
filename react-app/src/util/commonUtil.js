module.exports = {
  getSerialPortOptions:(deviceType)=>window.config.serial_port_options[deviceType],
  getOrder:(deviceType) => {
      const order = window.config.order[deviceType]
      order['setTime'] = moment => order['setup_time'].replace(/{date}/,moment)
      order['setId'] = id => order['set_id'].replace(/{NID4}/,id)
      order['getData'] = (num) => {
        const num_16 = num.toString(16)
        let str = ''
        for (let i = 0; i<4-num_16.length; i++) str += '0'
        return order['get_data'].replace(/{NUM}/,str+num_16)
      }
      return order
  },
  hexFillZero: (b) => {
      if (b.length !== 1) return b
          return `0${b}`
  },
  buf2hex: (buffer) => Array.prototype.map.call(
      new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join(''),
  buf2hexByArray: (buffer) => Array.prototype.map.call(
      new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)),
  patchPosition:(v,p) => {
    const length = v.length
    if (length<p) {
      for (let inx=0; inx < (p - length); inx= inx +1 ) 
        v= '0'+ v
      return v
    } else {
      return v
    }
  },
      
}