import React from 'react'
import moment from 'moment'
import Title from '../components/Title'
import Sidebar from './commponents/Sidebar'
import socket from '../Socket'
import config from '../config'
import commonUtil from '../commonUtil'

const Edit = props => {

  const [load, setLoad] = React.useState(false)

  const [loadText, setLoadText] = React.useState('')

  const [equipmentId, setEquipmentId] = React.useState(0)

  const [orderhead, setOrderhead] = React.useState(0)

  const [dept, setDept] = React.useState([])

  const [serverFlg, setServerFlg] = React.useState(0)

  socket
    .off('fangganshaoId4')
    .on('fangganshaoId4', data => {
      if (data === 'err') {
        alert('无法连接设备!')
        setLoad(false)
      } else {
        const hex = data.split(' ')
        const id = parseInt(`0x${hex[1]}${hex[2]}${hex[3]}${hex[4]}`)
        setOrderhead(`${hex[1]}${hex[2]}${hex[3]}${hex[4]}`)
        setEquipmentId(id)
        document.getElementById('equipmentId').value = id
        setLoadText('正在获取服务器数据(请勿操作页面)...')
        fetch(`${config.service_url}/api/common/dept/`)
          .then(res => res.json())
          .then(res => {
            if (res.content) {
              setDept(res.content)
              setServerFlg(true)
              fetch(`${config.service_url}/api/fangganshao/equipment/sn/${id}`)
                .then(res => res.json())
                .then(res => {
                  setLoad(false)
                  if (res.content) {
                    document.getElementById('dept').value = res.content.dept_id
                  }
                })
                .catch(err => setLoad(false))
            } else {
              setServerFlg(false)
              window.alert('无法连接服务器!\n您的设置将无法同步到服务器\n请在设置后联系管理员手动录入设备信息')
              setLoad(false)
            }
          })
          .catch(err => {
            setServerFlg(false)
            setLoad(false)
            window.alert('无法连接服务器!\n您的设置将无法同步到服务器\n请在设置后联系管理员手动录入设备信息')
          })
      }
    })
    .off('fangganshaoWriteId')
    .on('fangganshaoWriteId', data => {
      if (data === 'err') {
        alert('无法连接设备!')
        setLoad(false)
      } else {
        alert('操作成功!')
        setLoad(false)
      }
    })
    .off('fangganshaoWifi')
    .on('fangganshaoWifi', data => {
      if (data === 'err') {
        alert('无法连接设备!')
        setLoad(false)
      } else {
        alert('操作成功!')
        setLoad(false)
      }
    })

  React.useEffect(() => {
    setLoad(true)
    setLoadText('正在读取设备...')
    socket.emit('fangganshaoId4', {
      comName: decodeURIComponent(props.match.params.comName),
      hex: `7E05F5E0FF0AB1${moment().format('YYMMDDHHmm')}01000000`,
      len: 32,
    })
  }, [props.match.params.comName])


  const writeId = () => {
    setLoad(true)
    setLoadText('正在写入设备编号...')
    const socketFetch = id => {
      let hexId = Math.abs(id).toString(16)
      const inx = 8 - hexId.length
      for (let i = 0; i < inx; i++) {
        hexId = '0' + hexId
      }
      socket.emit('fangganshaoWriteId', {
        comName: decodeURIComponent(props.match.params.comName),
        hex: `7E${orderhead}0AB2${hexId}0000000000`,
        len: 32
      })
    }
    const new_sn = document.getElementById('equipmentId').value 
    if (serverFlg) {
      fetch(`${config.service_url}/api/fangganshao/equipment/sn/${equipmentId}`, {
        method: 'put',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          new_sn: new_sn,
          dept_id: document.getElementById('dept').value
        })
      })
        .then(res => res.json())
        .then(res => {
          if (res.message) {
            window.alert(res.message)
            setLoad(false)
          } else {
            socketFetch(new_sn)
          }
        })
        .catch(err => {
          setLoad(false)
          window.alert('服务器繁忙,请稍后再试')
        })
    } else {
      socketFetch(new_sn)
    }
  }

  const writeWifi = () => {
    setLoad(true)
    setLoadText('正在写入网路设置...')
    const data = {
      wifi_name: document.getElementById('wifi_name').value,
      wifi_password: document.getElementById('wifi_password').value,
      service_port: document.getElementById('service_port').value,
      service_path: document.getElementById('service_path').value
    }
    const toAscii = (str, len) => {
      let data = str.split('')
        .map(item => commonUtil.hexFillZero(item.charCodeAt().toString(16)))
      while (data.length < len) {
        data.push('00')
      }
      if (data.length > len) {
        data = data.slice(0, len)
      }
      return data.join('')
    }
    const wifiName = toAscii(data.wifi_name, 32)
    const wifiPassword = toAscii(data.wifi_password, 16)
    const ip = data.service_path.split('.')
      .map(item => commonUtil.hexFillZero(parseInt(item).toString(16)))
      .join('')
    const port = parseInt(data.service_port)
      .toString(16)
    socket.emit('fangganshaoWifi', {
      comName: decodeURIComponent(props.match.params.comName),
      hex: `7E${orderhead}4AB4${wifiName}${wifiPassword}${ip}${port}00000000000000000000000000000000000000`,
      len: 32
    })
  }


  return (
    <div className="row">
      <Sidebar category="edit" comName={props.match.params.comName} id={props.match.params.id} />
      <div className="col-md-10 col-lg-9  offset-md-2  card-body mt-3">
        <Title title="设备设置" load={load} loadText={loadText} />
        <br />
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>设备编号:</label>
              <input
                id="equipmentId"
                type="text"
                className="form-control" />
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
                  defaultValue={config.teapot_tcp.ip} />
                <div className="input-group-prepend">
                  <span className="input-group-text">端口:</span>
                </div>
                <input
                  id="service_port"
                  type="text"
                  className="form-control"
                  disabled="disabled"
                  defaultValue={'8899'} />
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="pull-right btn-group" >
          <button
            className='btn btn-primary'
            onClick={writeWifi}
            disabled={load}>
            保存网wifi设置
          </button>
          <button
            className='btn btn-info'
            onClick={writeId}
            disabled={load}>
            保存设备信息
          </button>
        </div>
      </div>
    </div>
  )
}

export default Edit