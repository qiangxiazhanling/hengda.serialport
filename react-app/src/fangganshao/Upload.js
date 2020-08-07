import React from 'react'
import moment from 'moment'
import Sidebar from './commponents/Sidebar'
import Title from '../components/Title'
import socket from '../Socket'
import config from '../config'
import commonUtil from '../commonUtil'

const Upload = props => {

  const [load, setLoad] = React.useState(true)

  const [loadText, setLoadText] = React.useState('')

  const [orderhead, setOrderhead] = React.useState('')

  const [hexList, setHexList] = React.useState([])

  const [list, setList] = React.useState([])

  const [dataTotal, setDataTotal] = React.useState(-1)

  const [inx, setInx] = React.useState(-1)

  socket
    .off('fangganshaoDataTotal')
    .on('fangganshaoDataTotal', data => {
      if (data === 'err') {
        alert('无法连接设备!')
        setLoad(false)
      } else {
        const hex = data.split(' ')
        setOrderhead(`${hex[1]}${hex[2]}${hex[3]}${hex[4]}`)
        setDataTotal(parseInt(`${hex[13]}${hex[14]}`, 16))
        setLoad(false)
      }
    })
    .off('fangganshaoReadData')
    .on('fangganshaoReadData', data => {
      if (data === 'err') {
        alert('无法连接设备!')
        setLoad(false)
      } else {
        if (inx !== -1 ) {
          const content = commonUtil.fgsdata(data.split(' '))
          setList(p => [...p, content.data])
          setHexList(p => [...p, content.hex])
          setLoadText(d => `读取中(${content.inx+1}/${dataTotal})...`)
          setInx(content.inx+1)
        }
      }
    })
    .off('fangganshaoClear')
    .on('fangganshaoClear', data => {
      if (data === 'err') {
        alert('清除待发数据失败!')
        setLoad(false)
      } else {
        setLoad(false)
      }
    })

  React.useEffect(() => {
    if (props.match.params.comName) {
      setLoad(true)
      setLoadText('读取设备中...')
      socket.emit('fangganshaoDataTotal', {
        comName: decodeURIComponent(props.match.params.comName),
        hex: `7E05F5E0FF0AB1${moment().format('YYMMDDHHmm')}01000000`,
        len: 32
      })
    }
  }, [props.match.params.comName])


  React.useEffect(() => {
    if (inx !== -1 && inx < dataTotal) {
      let hexInx = inx.toString(16)
      const end = 4 - hexInx.length
      for (let i = 0; i < end; i++) {
        hexInx = '0' + hexInx
      }
      socket.emit('fangganshaoReadData', {
        comName: decodeURIComponent(props.match.params.comName),
        hex: `7E${orderhead}0A52${hexInx}${moment().format('YYMMDDHHmmss')}00`
      })
    } else {
      if (dataTotal !== -1) {
        setInx(-1)
        setLoad(p => false)
      }
    }
  }, [inx, props.match.params.comName, dataTotal, orderhead])


  const getData = () => {
    setLoad(true)
    setInx(0)
    setHexList([])
    setList([])
  }

  const upload = () => {
    const loop = (inx) => {
      fetch(`${config.service_url}/api/fangganshao/`, {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          data: list[inx],
          original: hexList[inx]
        })
      })
        .then(response => response.json())
        .then(res => {
          if (res.content) {
            inx = inx + 1
            if (inx < list.length) {
              setLoadText(`正在上传数据(${inx + 1}/${list.length})...`)
              loop(inx)
            } else {
              clearEquipment()
              setLoad(false)
            }
          } else {
            setLoad(false)
            alert(res.massage)
          }
        })
        .catch(err => {
          setLoad(false)
          alert('无法连接服务器')
        })
    }
    setLoad(true)
    setLoadText(`正在上传数据(${1}/${list.length})...`)
    loop(0)
  }


  const clearEquipment = () => {
    socket.emit('fangganshaoClear', {
      comName: props.match.params.comName,
      hex: '7E05F5E0FF0A54000000000000000000',
      len: 32
    })
  }


  return (
    <div className="row">
      <Sidebar category="upload" comName={props.match.params.comName} id={props.match.params.id} />
      <div className="col-md-10 col-lg-9  offset-md-2  card-body mt-3">
        <Title title="数据上传" loadText={loadText} load={load} />
        <br></br>
        <div className="row">
          <div className="col">
            <table className="table table-bordered table-hover table-sm font-small" >
              <thead className="thead-light">
                <tr>
                  <th colSpan="10">
                    <div className="row">
                      <div className="col" >
                      </div>

                      <div className="pull-right btn-group btn-group-sm" style={{ right: '12px' }}>
                        <button
                          disabled={load}
                          className='btn btn-info'
                          onClick={getData} >
                          读取设备
                          </button>
                        <button
                          disabled={load}
                          onClick={upload}
                          className='btn btn-primary' >
                          数据上传
                          </button>
                      </div>

                    </div>
                  </th>
                </tr>
                <tr>
                  <th>#</th>
                  <th>设备编码</th>
                  <th>测试时间</th>
                  <th>是否动作</th>
                  <th>车号</th>
                  <th>茶炉类型</th>
                  <th>最高温度</th>
                  <th>动过温度</th>
                  <th>班组</th>
                  <th>测试人</th>
                </tr>
              </thead>
              <tbody>
                {
                  list && list.map((item, inx) => (
                    <tr key={inx}>
                      <td>{item.inx+1}</td>
                      <td>{item.equipment_id}</td>
                      <td>{item.test_date} {item.test_time}</td>
                      <td>{item.action_status}</td>
                      <td>{item.train_num}</td>
                      <td>{item.teapot_type}</td>
                      <td>{item.max_temp}</td>
                      <td>{item.move_temp}</td>
                      <td>{item.team}</td>
                      <td>{item.staff}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )

}


export default Upload