const iconv = require('iconv-lite');
const moment = require('moment');

const commonUtil = {
  hexFillZero: (b) => {
    if (b.length !== 1) return b
    return `0${b}`
  },
  buf2hex: (buffer) => Array.prototype.map.call(
    new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join(''),
  buf2hexByArray: (buffer) => Array.prototype.map.call(
    new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)),
  patchPosition: (v, p) => {
    const length = v.length
    if (length < p) {
      for (let inx = 0; inx < (p - length); inx = inx + 1)
        v = '0' + v
      return v
    } else {
      return v
    }
  },
  strToHex: (str, size) => {
    let hex = Buffer.from(iconv.encode(str, 'GB2312')).toString('hex').toUpperCase()
    let space = ''
    if (hex.length > size) {
      hex = hex.substring(0, size)
    } else {
      for (let inx = 0; inx < (size - hex.length) / 2; inx++) {
        space += '20'
      }
    }
    return hex + space
  },
  strToHex2: (str, size) => {
    if (str === '') {
      str = ' 待定义 '
    }
    let hex = Buffer.from(iconv.encode(str, 'GB18030')).toString('hex').toUpperCase()
    let space = ''
    if (hex.length > size) {
      hex = hex.substring(0, size)
    } else {
      for (let inx = 0; inx < (size - hex.length) / 2; inx++) {
        space += '20'
      }
    }
    return hex + space
  },
  numberToHex: (str) => {
    if (str === '') {
      return '00'
    } else {
      const number = parseInt(str)
      if (isNaN(number)) {
        return '00'
      } else {
        return commonUtil.hexFillZero(number.toString(16))
      }
    }
  },
  juyuandata: (hex) => {
    hex = hex.split(' ')
    const deviceId = parseInt(hex.slice(69, 73).join(''), 16)
    if (deviceId === 4294967295 || isNaN(deviceId)) {
      console.info(deviceId)
      return {
        attribute: -1,
        original: -1,
        datime: -1
      }
    } else {
      const date = ((h) =>
        `20${h[0]}-${h[1]}-${h[2]} ${h[3]}:${h[4]}`
      )(hex.slice(9, 15))
      const testConfig = hex.slice(15, 47)
      const getAttribute = v => {
        const attribute = { deviceId: deviceId }
        if (v[0] === '0') {
          attribute['dataType'] = '绝缘电阻测试'
          switch (v.substring(1, 3)) {
            case '00':
              attribute['testType'] = 'DC600V'
              break
            case '01':
              attribute['testType'] = 'AC380V四线'
              break
            case '10':
              attribute['testType'] = 'AC380V五线'
              break
            default:
              console.info(':(')
          }
          switch (v.substring(3, 5)) {
            case '00':
              attribute['trainType'] = '运用列车'
              break
            case '01':
              attribute['trainType'] = '新造/厂修'
              break
            case '10':
              attribute['trainType'] = '段修/运用单车'
              break
            default:
              console.info(':(')
          }
          if (v[5] === '0') {
            attribute['line'] = 'I'
          } else {
            attribute['line'] = 'II'
          }
        } else {
          attribute['dataType'] = '在线电压测试'
          if (v[1] === '0') {
            attribute['testType'] = 'DC110V'
          } else {
            attribute['testType'] = 'DC48V'
          }
        }
        return attribute
      }
      let attribute = getAttribute(
        commonUtil.patchPosition(parseInt(testConfig[0][0], 16).toString(2), 4) +
        commonUtil.patchPosition(parseInt(testConfig[0][1], 16).toString(2), 4)
      )
      let trainNumber = ''
      testConfig.slice(1, 13).forEach(item => trainNumber = trainNumber + String.fromCharCode(parseInt(item, 16)))
      attribute['trainNumber'] = trainNumber.trim()
      attribute['trainGroup'] = String.fromCharCode(parseInt(testConfig[13], 16)).trim()
      attribute['team'] = iconv.decode(Buffer.from(testConfig.slice(16, 24).join(''), 'hex'), 'GB18030').trim()
      attribute['personnel'] = iconv.decode(Buffer.from(testConfig.slice(24, 32).join(''), 'hex'), 'GB18030').trim()
      attribute['testTemperature'] = parseFloat(parseInt(hex.slice(47, 49).join(''), 16) / 10)
      attribute['relativeTemperature'] = parseInt(hex[49], 16)
      attribute['date'] = date

      if (attribute.dataType === '绝缘电阻测试') {
        attribute['lineRoomThreshold'] = (parseInt(hex.slice(50, 52).join(''), 16) / 100).toFixed(2)
        attribute['lineThreshold'] = (parseInt(hex.slice(52, 54).join(''), 16) / 100).toFixed(2)
        switch (attribute['testType']) {
          case 'DC600V':
            attribute['uv'] = (parseInt(hex.slice(73, 76).join(''), 16) / 100).toFixed(2)
            attribute['un'] = (parseInt(hex.slice(79, 82).join(''), 16) / 100).toFixed(2)
            attribute['vn'] = (parseInt(hex.slice(88, 91).join(''), 16) / 100).toFixed(2)
            attribute['uw'] = '--'
            attribute['vw'] = '--'
            attribute['wn'] = '--'
            attribute['ug'] = '--'
            attribute['vg'] = '--'
            attribute['wg'] = '--'
            attribute['ng'] = '--'
            break
          case 'AC380V四线':
            attribute['uv'] = (parseInt(hex.slice(73, 76).join(''), 16) / 100).toFixed(2)
            attribute['uw'] = (parseInt(hex.slice(76, 79).join(''), 16) / 100).toFixed(2)
            attribute['vw'] = (parseInt(hex.slice(85, 88).join(''), 16) / 100).toFixed(2)
            attribute['un'] = (parseInt(hex.slice(79, 82).join(''), 16) / 100).toFixed(2)
            attribute['vn'] = (parseInt(hex.slice(88, 91).join(''), 16) / 100).toFixed(2)
            attribute['wn'] = (parseInt(hex.slice(94, 97).join(''), 16) / 100).toFixed(2)
            attribute['ug'] = '--'
            attribute['vg'] = '--'
            attribute['wg'] = '--'
            attribute['ng'] = '--'
            break
          case 'AC380V五线':
            attribute['uv'] = (parseInt(hex.slice(73, 76).join(''), 16) / 100).toFixed(2)
            attribute['uw'] = (parseInt(hex.slice(76, 79).join(''), 16) / 100).toFixed(2)
            attribute['un'] = (parseInt(hex.slice(79, 82).join(''), 16) / 100).toFixed(2)
            attribute['ug'] = (parseInt(hex.slice(82, 85).join(''), 16) / 100).toFixed(2)
            attribute['vw'] = (parseInt(hex.slice(85, 88).join(''), 16) / 100).toFixed(2)
            attribute['vn'] = (parseInt(hex.slice(88, 91).join(''), 16) / 100).toFixed(2)
            attribute['vg'] = (parseInt(hex.slice(91, 94).join(''), 16) / 100).toFixed(2)
            attribute['wn'] = (parseInt(hex.slice(94, 97).join(''), 16) / 100).toFixed(2)
            attribute['wg'] = (parseInt(hex.slice(97, 100).join(''), 16) / 100).toFixed(2)
            attribute['ng'] = (parseInt(hex.slice(100, 103).join(''), 16) / 100).toFixed(2)
            break
          default:
            console.info('testType is null')
        }
        let conclusion_bit = parseInt(`0x${hex.slice(103, 106).join('')}`).toString(2)
        const inx = 24 - conclusion_bit.length
        for (let i = 0; i < inx; i++) {
          conclusion_bit = '0' + conclusion_bit
        }
        const getConclusion = (str) => {
          switch (str) {
            case '00':
              return '待测试'
            case '10':
              return '不合格'
            case '01':
              return '合格'
            default:
              return ''
          }
        }
        if (conclusion_bit && conclusion_bit.length !== 0) {
          attribute['uv_conclusion'] = getConclusion(`${conclusion_bit[0]}${conclusion_bit[1]}`)
          attribute['uw_conclusion'] = getConclusion(`${conclusion_bit[2]}${conclusion_bit[3]}`)
          attribute['un_conclusion'] = getConclusion(`${conclusion_bit[4]}${conclusion_bit[5]}`)
          attribute['ug_conclusion'] = getConclusion(`${conclusion_bit[6]}${conclusion_bit[7]}`)
          attribute['vw_conclusion'] = getConclusion(`${conclusion_bit[8]}${conclusion_bit[9]}`)
          attribute['vn_conclusion'] = getConclusion(`${conclusion_bit[10]}${conclusion_bit[11]}`)
          attribute['vg_conclusion'] = getConclusion(`${conclusion_bit[12]}${conclusion_bit[13]}`)
          attribute['wn_conclusion'] = getConclusion(`${conclusion_bit[14]}${conclusion_bit[15]}`)
          attribute['wg_conclusion'] = getConclusion(`${conclusion_bit[16]}${conclusion_bit[17]}`)
          attribute['ng_conclusion'] = getConclusion(`${conclusion_bit[18]}${conclusion_bit[19]}`)
        }
      } else {
        attribute['positiveVoltage'] = (parseInt(hex.slice(50, 52).join(''), 16) / 10).toFixed(1)
        attribute['negativeRoomVoltage'] = (parseInt(hex.slice(52, 54).join(''), 16) / 10).toFixed(1)
        attribute['positiveResistance'] = (parseInt(hex.slice(54, 56).join(''), 16) / 10).toFixed(1)
        attribute['negativeRoomResistance'] = (parseInt(hex.slice(56, 58).join(''), 16) / 10).toFixed(1)
        switch (parseInt(hex[58], 16)) {
          case 0: attribute['voltageConclusion'] = '待测试'
            break
          case 1: attribute['voltageConclusion'] = '电压正常'
            break
          case 2: attribute['voltageConclusion'] = '电压超高'
            break
          case 3: attribute['voltageConclusion'] = '电池欠压'
            break
          case 4: attribute['voltageConclusion'] = '测试无效'
            break
          default: attribute['voltageConclusion'] = '未知'
        }
        const getConclusion = (i) => {
          switch (i) {
            case 1:
              return '电阻合格'
            case 2:
              return '预警'
            case 3:
              return '报警'
            case 0:
              return '待测试'
            default:
              return ''
          }
        }
        attribute['positiveConclusion'] = getConclusion(parseInt(hex[59], 16))
        attribute['negativeConclusion'] = getConclusion(parseInt(hex[60], 16))
        let indicator_bit = parseInt(`0x${hex[61]}`).toString(2)
        const getIndicator = (str) => {
          switch (parseInt(str, 2)) {
            case 0: return '绿'
            case 1: return '黄'
            case 2: return '红'
            default: return '熄灭'
          }
        }
        const inx = 8 - indicator_bit.length
        for (let i = 0; i < inx; i++) {
          indicator_bit = '0' + indicator_bit
        }
        attribute['positiveIndicator'] = getIndicator(`${indicator_bit[0]}${indicator_bit[1]}${indicator_bit[2]}${indicator_bit[3]}`)
        attribute['negativeIndicator'] = getIndicator(`${indicator_bit[4]}${indicator_bit[5]}${indicator_bit[6]}`)
      }
      return {
        attribute: attribute,
        original: hex.join(' '),
        datime: moment().format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  fgsdata: (hex) => {
    const data = {}
    data['inx'] = parseInt(`${hex[7]}${hex[8]}`, 16)
    data['test_date'] = moment(
      `${hex[9]}${hex[10]}${hex[11]}`, 'YYMMDD'
    ).format('YYYY-MM-DD')
    data['test_time'] = `${hex[12]}:${hex[13]}:${hex[14]}`
    data['train_num'] = hex.slice(15, 22).map(item => String.fromCharCode(parseInt(item, 16))).join('')
    data['staff'] = iconv.decode(Buffer.from(hex.slice(23, 30).join(''), 'hex'), 'GB18030').trim()
    data['team'] = iconv.decode(Buffer.from(hex.slice(31, 38).join(''), 'hex'), 'GB18030').trim()
    data['teapot_type'] = iconv.decode(Buffer.from(hex.slice(39, 48).join(''), 'hex'), 'GB18030').trim()
    data['max_temp'] = parseInt(hex[49], 16)
    data['move_temp'] = parseInt(hex[50], 16)
    data['action_status'] = (() => {
      if (hex[51] === '01') {
        return '有动作'
      } else if (hex[51] === '02') {
        return '无动作'
      } else {
        return '未知'
      }
    })()

    data['equipment_id'] = parseInt(hex.slice(69, 73).join(''), 16) + ''
    if (isNaN(data['equipment_id']) || data['equipment_id'] === 'NaN') {
      return {
        hex: -1,
        data: -1,
        inx: data.inx
      }
    } else {
      return {
        hex: hex.join(''),
        data: data,
        inx: data.inx
      }
    }
  }
}

export default commonUtil