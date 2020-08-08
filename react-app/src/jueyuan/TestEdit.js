import React from 'react'
import moment from 'moment'
import Title from '../components/Title'
import Sidebar from './components/Sidebar'
import socket from '../Socket'
import config from '../config'
import commonUtil from '../commonUtil'

const iconv = require('iconv-lite')

const TestEdit = props => {

  const [category, setCategory] = React.useState("A9")

  const [load, setLoad] = React.useState(false)

  const [loadText, setLoadText] = React.useState('')

  const [id4, setId4] = React.useState([])


  socket
    .off('jueyuanId4')
    .on('jueyuanId4', data => {
      setLoad(false)
      if (data === 'err') {
        alert('设备拒绝访问,请检查设备连接!')
      } else {
        const hex = data.split(' ')
        setId4([hex[1], hex[2], hex[3], hex[4]])
        setLoad(false)
      }
    })
    .off('initConfig1')
    .on('initConfig1', data => {
      if (data === 'err') {
        setLoad(false)
        alert('设备拒绝访问,请检查设备连接!')
      } else {
        socket.emit('initConfig2', {
          hex: '7E05F5E0FF06AC007E7E0000',
          comName: decodeURIComponent(props.match.params.comName),
          len: 64
        })
      }
    })
    .off('initConfig2')
    .on('initConfig2', data => {
      setLoad(false)
      if (data === 'err') {
        alert('设备拒绝访问,请检查设备连接!')
      } else {
        alert('操作成功')
      }
    })
    .off('saveJueyuanConfig')
    .on('saveJueyuanConfig', data => {
      setLoad(false)
      if (data === 'err') {
        alert('设备拒绝访问,请检查设备连接!')
      } else {
        alert('操作成功')
      }
    })

  React.useEffect(() => {
    setLoad(true)
    setLoadText('正在初始化(请勿操作页面)...')
    socket.emit('jueyuanId4', {
      hex: config.order['insulation'].setup_time.replace(/{date}/, moment().format('YYMMDDHHmm')),
      comName: decodeURIComponent(props.match.params.comName),
      len: 64
    })
  }, [props.match.params.comName])

  const initConfig = () => {
    setLoad(true)
    setLoadText('正在初始化测试配置(请勿操作页面)...')
    socket.emit('initConfig1', {
      hex: '7E05F5E0FF06AB007E7E7E00',
      comName: decodeURIComponent(props.match.params.comName),
      len: 64
    })
  }

  const save = () => {
    setLoad(true)
    setLoadText('正在写入测试配置(请勿操作页面)...')
    const data = {
      category: category,
      id4: id4,
      inx: document.getElementById("inx").value,
      trainNumber: document.getElementById("trainNumber").value,
      status: document.getElementById("status").value,
      type: document.getElementById("type").value,
      group: document.getElementById("group").value,
      staff: document.getElementById("staff").value,
      team: document.getElementById("team").value
    }

    let flg = true
    Object.getOwnPropertyNames(data)
      .every(key => {
        flg = data[key] !== ''
        return flg
      })
    const hex = config.order['insulation'].put_config
      .replace(/{CATEGORY}/, data.category)
      .replace(/{TYPE}/, data.type)
      .replace(/{STATUS}/, data.status)
      .replace(/{INX}/, commonUtil.hexFillZero(parseInt(data.inx).toString(16)))
      .replace(/{GROUP}/, Buffer.from(iconv.encode(data.group, 'GB2312')).toString('hex').toUpperCase())
      .replace(/{TEAM}/, commonUtil.strToHex(data.team, 16))
      .replace(/{STAFF}/, commonUtil.strToHex(data.staff, 16))
      .replace(/{TRAIN_NUMBBER}/, (() => {
        let space = ''
        if (data.trainNumber.length > 12) {
          data.trainNumber = data.trainNumber.substring(0, 12)
        } else {
          for (let inx = 0; inx < (12 - data.trainNumber.length); inx++) {
            space += ' '
          }
        }
        return (data.trainNumber + space).split('')
          .map(item => commonUtil.hexFillZero(item.charCodeAt().toString(16))).join('')
      })())
    if (flg) {
      socket.emit('saveJueyuanConfig', {
        hex: hex,
        comName: decodeURIComponent(props.match.params.comName),
        len: 64
      })
    }
  }


  return (
    <div className="row">
      <Sidebar
        category="test_edit"
        id={props.match.params.id}
        comName={props.match.params.comName} />
      <div className="col-md-10 col-lg-9  offset-md-2  card-body mt-3">
        <Title title="测试配置" load={load} loadText={loadText} />
        <br />
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>配置序号:</label>
              <input id="inx" type="text" className="form-control form-control-sm" />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>测试配置类别:</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control form-control-sm" >
                <option value="A9">绝缘电阻</option>
                <option value="AA">在线电压</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>测试分类:</label>
              <div className="input-group input-group-sm">
                <div className="input-group-prepend">
                  <span className="input-group-text">车辆状态</span>
                </div>
                <select id="status" className="form-control form-control-sm col-md-10">
                  {
                    category === 'A9' ? (
                      <>
                        <option value="06">运用列车</option>
                        <option value="10">段修/运用单车</option>
                        <option value="08">新造/厂修</option>
                      </>
                    ) : (
                        <>
                          <option value="8F">供电测试</option>
                        </>
                      )}


                </select>
                <div className="input-group-prepend">
                  <span className="input-group-text">测试类型</span>
                </div>
                {
                  category === 'A9' ? (
                    <select id="type" className="form-control ">
                      <option value="00">直流测试</option>
                      <option value="01">交流4线测试</option>
                      <option value="02">交流5线测试</option>
                    </select>
                  ) : (
                      <select id="type" className="form-control" >
                        <option value="00">DC110V</option>
                        <option value="01">DV48V</option>
                      </select>
                    )
                }
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>车次信息:</label>
              <div className="input-group input-group-sm">
                <div className="input-group-prepend">
                  <span className="input-group-text">测试车次</span>
                </div>
                <input id="trainNumber" type="text" className="form-control col-md-10" />
                <div className="input-group-prepend">
                  <span className="input-group-text">车次编组</span>
                </div>
                <input id="group" type="text" className="form-control" />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>人员信息</label>
              <div className="input-group input-group-sm">
                <div className="input-group-prepend">
                  <span className="input-group-text">测试人员</span>
                </div>
                <input id="staff" type="text" className="form-control col-md-10" />
                <div className="input-group-prepend">
                  <span className="input-group-text">测试班组</span>
                </div>
                <input id="team" type="text" className="form-control" />
              </div>
            </div>
          </div>
        </div>
        <hr />
        <button
          className='btn btn-warning pull-left'
          disabled={load}
          onClick={initConfig} >
          初始化测试配置
        </button>
        <button
          className='btn btn-primary pull-right'
          disabled={load}
          onClick={save} >
          保存
        </button>
      </div>
    </div >
  )

}

export default TestEdit 