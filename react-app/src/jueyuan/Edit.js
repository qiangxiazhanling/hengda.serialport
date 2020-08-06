import React, { useEffect } from 'react'
import moment from 'moment'
import Sidebar from './components/Sidebar'
import Title from '../components/Title'
import socket from '../Socket'
import config from '../config'
import commonUtil from '../commonUtil'

const Edit = props => {

  const [load, setLoad] = React.useState(false)

  const [loadText, setLoadText] = React.useState('')

  const [id4, setId4] = React.useState([])

  const [dept, setDept] = React.useState([])

  const [serverFlg, setServerFlg] = React.useState(false)

  const [deviceId, setDeviceId] = React.useState(0)

  socket
    .off('jueyuanId4')
    .on('jueyuanId4', data => {
      if (data === 'err') {
        alert('连接失败!')
      } else {
        const hex = data.split(' ')
        const id = parseInt(`0x${hex[1]}${hex[2]}${hex[3]}${hex[4]}`)
        setDeviceId(id)
        document.getElementById('deviceId').value = id
        setId4([hex[1], hex[2], hex[3], hex[4]])
        setLoad(false)
        fetch(`${config.service_url}/api/jueyuan/equipment/sn/${id}`)
          .then(res => res.json())
          .then(res => {
            if (res.content) {
              document.getElementById('dept').value = res.content.dept_id
            }
          })
      }
    })

  socket
    .off('writeJueyuanId')
    .on('writeJueyuanId', data => {
      if (data === 'err') {
        alert('连接失败!')
      } else {
        alert('操作成功')
      }
      setLoad(false)
    })

  socket
    .off('writeJueyuanWifi')
    .on('writeJueyuanWifi', data => {
      if (data === 'err') {
        alert('连接失败!')
      } else {
        alert('操作成功')
      }
      setLoad(false)
    })

  useEffect(() => {
    const errFun = () => {
      setServerFlg(false)
      window.alert(`无法连接服务器!\n您的设置将无法同步到服务器\n请在设置后联系管理员手动录入设备信息`)
    }
    fetch(`${config.service_url}/api/common/dept/`)
      .then(res => res.json())
      .then(res => {
        if (res.content) {
          setServerFlg(true)
          setDept(res.content)
        } else {
          errFun()
        }
      })
      .catch(errFun)
    setLoad(true)
    setLoadText('正在初始化(请勿操作页面)...')
    socket.emit('jueyuanId4', {
      hex: config.order['insulation'].setup_time.replace(/{date}/, moment().format('YYMMDDHHmm')),
      comName: decodeURIComponent(props.match.params.comName),
      len: 64
    })
  }, [props.match.params.comName])


  const writeId = () => {
    const socketFetch = id => {
      let hexId = Math.abs(id).toString(16)
      const inx = 8 - hexId.length
      for (let i = 0; i < inx; i++) {
        hexId = '0' + hexId
      }
      socket.emit('writeJueyuanId', {
        hex: config.order['insulation'].set_id.replace(/{NID4}/, hexId),
        comName: decodeURIComponent(props.match.params.comName),
        len: 64
      })
    }
    setLoad(true)
    setLoadText('正在写入设备编号(请勿操作页面)...')
    if (serverFlg) {
      fetch(`${config.service_url}/api/jueyuan/equipment/sn/${deviceId}`, {
        method: 'put',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          new_sn: document.getElementById('deviceId').value,
          dept_id: document.getElementById('dept').value
        })
      })
        .then(res => res.json())
        .then(res => {
          if (res.message) {
            window.alert(res.message)
            setLoad(false)
          } else {
            socketFetch(document.getElementById('deviceId').value)
          }
        })
    } else {
      socketFetch(document.getElementById('deviceId').value)
    }

  }

  const writeWifi = () => {
    setLoad(true)
    setLoadText('正在写入网络设置(请勿操作页面)...')
    const data = {
      name: document.getElementById('wifi_name').value,
      password: document.getElementById('wifi_password').value,
      ip_addr: document.getElementById('service_path').value,
      port: document.getElementById('service_port').value
    } 
    let t = []
    t.push(config.order['insulation'].header)
    id4.forEach(it => t.push(it))
    let t1 = []
    t1.push('A2')
    let szWifi = `${data.name},${data.password}`
    let szIP = `${data.ip_addr},${data.port}`
    t1.push(commonUtil.hexFillZero(szWifi.length.toString(16)))
    t1.push(commonUtil.hexFillZero(szIP.length.toString(16)))
    szWifi.split('').forEach(it => {
      t1.push(commonUtil.hexFillZero(it.charCodeAt().toString(16)))
    })
    szIP.split('').forEach(it => {
      t1.push(commonUtil.hexFillZero(it.charCodeAt().toString(16)))
    })
    t.push(commonUtil.hexFillZero(t1.length.toString(16)))
    console.info(t.concat(t1).join(''))
    socket.emit('writeJueyuanWifi', {
      hex:  t.concat(t1).join(''),
      comName: decodeURIComponent(props.match.params.comName),
      len: 64
    })
  }

  return (
    <div className="row">
      <Sidebar
        category="edit"
        id={props.match.params.id}
        comName={props.match.params.comName} />

      <div className="col-md-10 col-lg-9  offset-md-2  card-body mt-3">
        <Title title="设备设置" load={load} loadText={loadText} />
        <br />
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>设备ID:</label>
              <input id="deviceId" type="text" className="form-control" />
            </div>
          </div>
        </div>
        {
          dept.length > 0 && (
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>所属车间</label>

                  <select id="dept" className="form-control">
                    <option value=""></option>
                    {
                      dept.length > 0 &&
                      dept.map(it => <option key={it.id} value={it.id}>{it.v}</option>)
                    }
                  </select>

                </div>
              </div>
            </div>
          )
        }
        <div className="row">
          <div className="col">
            <div className="form-group" >
              <label>WiFi设置:</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">名称:</span>
                </div>
                <input
                  id="wifi_name"
                  type="text"
                  className="form-control"
                  defaultValue={config.wifi_name} />
                <div className="input-group-prepend">
                  <span className="input-group-text">密码:</span>
                </div>
                <input
                  id="wifi_password"
                  type="password"
                  className="form-control"
                  defaultValue={config.wifi_pwd} />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>服务器地址:</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">地址:</span>
                </div>
                <input
                  id="service_path"
                  type="text"
                  style={{ width: '50%' }}
                  className="form-control col-md-10"
                  defaultValue={config.insulation_tcp.ip} />
                <div className="input-group-prepend">
                  <span className="input-group-text">端口:</span>
                </div>
                <input
                  id="service_port"
                  type="text"
                  className="form-control"
                  defaultValue={config.insulation_tcp.port} />
              </div>
            </div>
          </div>
        </div>
        <hr />
        {/* <button className='btn btn-danger pull-left' disabled={load} onClick={clearDevice}>清空测试数据</button> */}
        <div className="pull-right btn-group">
          <button className='btn btn-primary' disabled={load} onClick={writeWifi}>保存wifi设置</button>
          <button className='btn btn-info' disabled={load} onClick={writeId}>保存设备信息</button>
        </div>

      </div>
    </div>
  )


}

export default Edit