import React from 'react'
import Title from '../components/Title'
import Sidebar from './commponents/Sidebar'
import socket from '../Socket'

const Edit = props => {

  const [load, setLoad] = React.useState(false)

  const [loadText, setLoadText] = React.useState('')

  const [equipmentId, setEquipmentId] = React.useState(0)

  const [orderhead, setOrderhead] = React.useState(0)

  const [dept, setDept] = React.useState([])

  const [serverFlg, setServerFlg] = React.useState(0)

  socket
    .off('command')
    .on('command', data => {
      const res = JSON.parse(data)
      if (load && res.fun === 'fangganshaoId' && res.status === 'end') {
        document.getElementById('equipmentId').value = res.content.equipmentId
        setEquipmentId(res.content.equipmentId)
        setOrderhead(res.content.orderhead)
        setLoadText('正在获取服务器数据(请勿操作页面)...')
        fetch(`${window.config.service_url}/api/common/dept/`)
          .then(res => res.json())
          .then(res => {
            if (res.content) {
              setDept(res.content)
              setServerFlg(true)
              fetch(`${window.config.service_url}/api/fangganshao/equipment/sn/${props.match.params.id}`)
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
      if (load && res.fun === 'fangganshaoWifi' && res.status === 'end') {
        setLoad(false)
        window.alert(`操作成功`)
      }

      if (load && res.fun === 'fangganshaoWriteId' && res.status === 'end') {
        setEquipmentId(document.getElementById('equipmentId'))
        socket.emit('command', JSON.stringify({
          fun: 'fangganshaoId4',
          param: {
            comName: decodeURIComponent(props.match.params.comName)
          }
        }))
        window.alert(`操作成功`)
      }

      if (load && res.fun === 'fangganshaoId4' && res.status === 'end') {
        setOrderhead(res.content.orderhead)
        setLoad(false)
      }
      if (load && res.status === 'err') {
        window.alert('无法连接设备，请重新连接')
        window.location = '#/防干烧/设备列表'
      }
    })

  React.useEffect(() => {
    setLoad(true)
    setLoadText('正在读取设备...')
    socket.emit('command', JSON.stringify({
      fun: 'fangganshaoId',
      param: {
        comName: decodeURIComponent(props.match.params.comName)
      }
    }))
  }, [props.match.params.comName])


  const writeId = () => {
    setLoad(true)
    setLoadText('正在写入设备编号...')
    if (serverFlg) {
      fetch(`${window.config.service_url}/api/fangganshao/equipment/sn/${equipmentId}`, {
        method: 'put',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          new_sn: document.getElementById('equipmentId').value,
          dept_id: document.getElementById('dept').value
        })
      })
        .then(res => res.json())
        .then(res => {
          if (res.message) {
            window.alert(res.message)
            setLoad(false)
          } else {
            socket.emit('command', JSON.stringify({
              fun: 'fangganshaoWriteId',
              param: {
                comName: decodeURIComponent(props.match.params.comName),
                equipmentId: document.getElementById('equipmentId').value,
                orderhead: orderhead
              }
            }))
          }
        })
        .catch(err =>  {
          setLoad(false)
          window.alert('服务器繁忙,请稍后再试')
        })
    } else {
      socket.emit('command', JSON.stringify({
        fun: 'fangganshaoWriteId',
        param: {
          comName: decodeURIComponent(props.match.params.comName),
          equipmentId: document.getElementById('equipmentId').value,
          orderhead: orderhead
        }
      }))
    }
  }

  const writeWifi = () => {
    setLoad(true)
    setLoadText('正在写入网路设置...')
    socket.emit('command', JSON.stringify({
      fun: 'fangganshaoWifi',
      param: {
        comName: decodeURIComponent(props.match.params.comName),
        wifi_name: document.getElementById('wifi_name').value,
        wifi_password: document.getElementById('wifi_password').value,
        service_port: document.getElementById('service_port').value,
        service_path: document.getElementById('service_path').value,
        orderhead: orderhead
      },
      orderhead: orderhead
    }))
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
                  defaultValue={window.config.wifi_name} />
                <div className="input-group-prepend">
                  <span className="input-group-text">密码:</span>
                </div>
                <input
                  id="wifi_password"
                  type="password"
                  className="form-control"
                  defaultValue={window.config.wifi_pwd} />
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
                  defaultValue={window.config.teapot_tcp.ip} />
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