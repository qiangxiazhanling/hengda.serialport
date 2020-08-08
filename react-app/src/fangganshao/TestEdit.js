import React from 'react'
import moment from 'moment'
import Sidebar from './commponents/Sidebar'
import Title from '../components/Title'
import socket from '../Socket'
import commonUtil from '../commonUtil'

const iconv = require('iconv-lite')

const TestEdit = props => {

  const [load, setLoad] = React.useState(false)

  const [loadText, setLoadText] = React.useState('')

  const [orderhead, setOrderhead] = React.useState(0)

  const [item, setItem] = React.useState({})

  socket
    .off('fangganshaoId4')
    .on('fangganshaoId4', data => {
      if (data === 'err') {
        alert('设备拒绝访问,请检查设备连接!')
        setLoad(false)
      } else {
        const hex = data.split(' ')
        setLoad(false)
        setOrderhead(`${hex[1]}${hex[2]}${hex[3]}${hex[4]}`)
        socket.emit('fangganshaoReadTestEdit', {
          comName: decodeURIComponent(props.match.params.comName),
          hex: `7E${hex[1]}${hex[2]}${hex[3]}${hex[4]}055300000000`,
          len: 72
        })
      }
    })
    .off('fangganshaoReadTestEdit')
    .on('fangganshaoReadTestEdit', data => {
      if (data === 'err') {
        alert('设备拒绝访问,请检查设备连接!')
        setLoad(false)
      } else {
        const hex = data.split(' ')
        setLoad(false)
        setItem({
          group1_name: iconv.decode(Buffer.from(hex.slice(7, 16).join(''), 'hex'), 'GB18030'),
          group1_temp: parseInt(hex[17], 16),
          group2_name: iconv.decode(Buffer.from(hex.slice(18, 27).join(''), 'hex'), 'GB18030'),
          group2_temp: parseInt(hex[28], 16),
          group3_name: iconv.decode(Buffer.from(hex.slice(29, 38).join(''), 'hex'), 'GB18030'),
          group3_temp: parseInt(hex[39], 16),
          group4_name: iconv.decode(Buffer.from(hex.slice(40, 49).join(''), 'hex'), 'GB18030'),
          group4_temp: parseInt(hex[50], 16),
          group5_name: iconv.decode(Buffer.from(hex.slice(51, 60).join(''), 'hex'), 'GB18030'),
          group5_temp: parseInt(hex[61], 16),
          group6_name: iconv.decode(Buffer.from(hex.slice(62, 71).join(''), 'hex'), 'GB18030'),
          group6_temp: parseInt(hex[72], 16)
        })
      }
    })
    .off('fangganshaoWriteTestEdit')
    .on('fangganshaoWriteTestEdit', data => {
      if (data === 'err') {
        alert('设备拒绝访问,请检查设备连接!')
        setLoad(false)
      } else {
        setLoad(false)
        alert('操作成功')
      }
    })

  React.useEffect(() => {
    if (props.match.params.comName) {
      setLoad(true)
      setLoadText('读取设备中...')
      socket.emit('fangganshaoId4', {
        comName: decodeURIComponent(props.match.params.comName),
        hex: `7E05F5E0FF0AB1${moment().format('YYMMDDHHmm')}01000000`,
        len: 32,
      })
    }
  }, [props.match.params.comName])

  const valueChange = event => {
    setItem({
      ...item,
      [event.target.id]: event.target.value
    })

  }

  const save = () => {
    setLoad(true)
    setLoadText('保存设置中...')
    const param = {
      group1_name: commonUtil.strToHex2(item.group1_name, 20),
      group1_temp: commonUtil.numberToHex(item.group1_temp),
      group2_name: commonUtil.strToHex2(item.group2_name, 20),
      group2_temp: commonUtil.numberToHex(item.group2_temp),
      group3_name: commonUtil.strToHex2(item.group3_name, 20),
      group3_temp: commonUtil.numberToHex(item.group3_temp),
      group4_name: commonUtil.strToHex2(item.group4_name, 20),
      group4_temp: commonUtil.numberToHex(item.group4_temp),
      group5_name: commonUtil.strToHex2(item.group5_name, 20),
      group5_temp: commonUtil.numberToHex(item.group5_temp),
      group6_name: commonUtil.strToHex2(item.group6_name, 20),
      group6_temp: commonUtil.numberToHex(item.group6_temp),
    }
    socket.emit('fangganshaoWriteTestEdit', {
      comName: decodeURIComponent(props.match.params.comName),
      hex: `7E${orderhead}44B3${
        Object.getOwnPropertyNames(param).map(key => param[key]).join('')
        }00`,
      len: 32,
    })
  }

  return (
    <div className="row">
      <Sidebar category="testEdit" comName={props.match.params.comName} id={props.match.params.id} />
      <div className="col-md-10 col-lg-9  offset-md-2  card-body mt-3">
        <Title title="茶炉设置" loadText={loadText} load={load} />
        <br></br>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>第一组:</label>
              <div className="input-group input-group-sm">
                <div className="input-group-prepend">
                  <span className="input-group-text">茶炉厂家</span>
                </div>
                <input
                  id="group1_name"
                  type="text"
                  className="form-control"
                  onChange={valueChange}
                  value={item.group1_name || ''} />
                <div className="input-group-prepend">
                  <span className="input-group-text">最高温度</span>
                </div>
                <input
                  id="group1_temp"
                  type="text"
                  className="form-control"
                  onChange={valueChange}
                  value={item.group1_temp || ''} />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>第二组:</label>
              <div className="input-group input-group-sm">
                <div className="input-group-prepend">
                  <span className="input-group-text">茶炉厂家</span>
                </div>
                <input
                  id="group2_name"
                  type="text"
                  className="form-control"
                  onChange={valueChange}
                  value={item.group2_name || ''} />
                <div className="input-group-prepend">
                  <span className="input-group-text">最高温度</span>
                </div>
                <input
                  id="group2_temp"
                  type="text"
                  className="form-control"
                  onChange={valueChange}
                  value={item.group2_temp || ''} />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>第三组:</label>
              <div className="input-group input-group-sm">
                <div className="input-group-prepend">
                  <span className="input-group-text">茶炉厂家</span>
                </div>
                <input
                  id="group3_name"
                  type="text"
                  className="form-control"
                  onChange={valueChange}
                  value={item.group3_name || ''} />
                <div className="input-group-prepend">
                  <span className="input-group-text">最高温度</span>
                </div>
                <input
                  id="group3_temp"
                  type="text"
                  className="form-control"
                  onChange={valueChange}
                  value={item.group3_temp || ''} />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>第四组:</label>
              <div className="input-group input-group-sm">
                <div className="input-group-prepend">
                  <span className="input-group-text">茶炉厂家</span>
                </div>
                <input
                  id="group4_name"
                  type="text"
                  className="form-control"
                  onChange={valueChange}
                  value={item.group4_name || ''} />
                <div className="input-group-prepend">
                  <span className="input-group-text">最高温度</span>
                </div>
                <input
                  id="group4_temp"
                  type="text"
                  className="form-control"
                  onChange={valueChange}
                  value={item.group4_temp || ''} />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>第五组:</label>
              <div className="input-group input-group-sm">
                <div className="input-group-prepend">
                  <span className="input-group-text">茶炉厂家</span>
                </div>
                <input
                  id="group5_name"
                  type="text"
                  className="form-control"
                  onChange={valueChange}
                  value={item.group5_name || ''} />
                <div className="input-group-prepend">
                  <span className="input-group-text">最高温度</span>
                </div>
                <input
                  id="group5_temp"
                  type="text"
                  className="form-control"
                  onChange={valueChange}
                  value={item.group5_temp || ''} />
              </div>
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>第六组:</label>
              <div className="input-group input-group-sm">
                <div className="input-group-prepend">
                  <span className="input-group-text">茶炉厂家</span>
                </div>
                <input
                  id="group6_name"
                  type="text"
                  className="form-control"
                  onChange={valueChange}
                  value={item.group6_name || ''} />
                <div className="input-group-prepend">
                  <span className="input-group-text">最高温度</span>
                </div>
                <input
                  id="group6_temp"
                  type="text"
                  className="form-control"
                  onChange={valueChange}
                  value={item.group6_temp || ''} />
              </div>
            </div>
          </div>
        </div>
        <hr />
        <button
          className='btn btn-primary pull-right'
          onClick={save}
          disabled={load}>
          保存
        </button>
      </div>
    </div>
  )
}

export default TestEdit