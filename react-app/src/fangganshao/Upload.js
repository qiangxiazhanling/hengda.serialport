import React from 'react'

import Sidebar from './commponents/Sidebar'
import Title from '../components/Title'
import socket from '../Socket'

const Upload = props => {

  const [load, setLoad] = React.useState(true)

  const [loadText, setLoadText] = React.useState('')

  const [orderhead, setOrderhead] = React.useState('')

  const [hexList, setHexList] = React.useState([])

  const [list, setList] = React.useState([])

  const [dataTotal, setDataTotal] = React.useState(-1)

  const [inx, setInx] = React.useState(-1)

  socket
    .off('command')
    .on('command', data => {
      const res = JSON.parse(data)
      if (load && res.status === 'end') {
        if (res.fun === 'fangganshaoDataTotal') {
          // setLoad(false)
          setOrderhead(res.content.orderhead)
          setDataTotal(res.content.dataTotal)
          setLoad(false)
        }
        if (res.fun === 'fangganshaoClear') {
          setLoad(false)
        }
      }

      if (load && res.status === 'run') {
        if (res.fun === 'fangganshaoReadData') {
          if (res.content.data !== -1) {
            setList(p => [...p, res.content.data])
            setHexList(p => [...p, res.content.hex])
          }
          setLoadText(d => `读取中(${res.content.inx + 1}/${dataTotal})...`)
          setInx(res.content.inx + 1)
        }
      }

      if (load && res.status === 'err') {
        window.alert('无法连接设备，请重新连接')
        window.location = '#/防干烧/设备列表'
      }
    })

  React.useEffect(() => {
    if (props.match.params.comName) {
      setLoad(p => true)
      setLoadText(p => '读取设备中...')
      socket.emit('command', JSON.stringify({
        fun: 'fangganshaoDataTotal',
        param: {
          type: 'teapot',
          comName: decodeURIComponent(props.match.params.comName)
        }
      }))
    }
  }, [props.match.params.comName])


  React.useEffect(() => {
    if (inx !== -1 && inx < dataTotal) {
      socket.emit('command', JSON.stringify({
        fun: 'fangganshaoReadData',
        param: {
          type: 'teapot',
          comName: decodeURIComponent(props.match.params.comName),
          orderhead: orderhead,
          inx: inx
        }
      }))
    } else {
      if (dataTotal !== -1) {
        setInx(-1)
        setLoad(p => false)
      }
    }
  }, [inx, props.match.params.comName, dataTotal, orderhead])


  const getData = () => {
    setLoad(d => true)
    setInx(0)
    setHexList([])
    setList([])
  }

  const upload = () => {
    const loop = (inx) => {
      fetch(`${window.config.service_url}/api/fangganshao/`, {
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
    socket.emit('command', JSON.stringify({
      fun: 'fangganshaoClear',
      param: {
        type: 'teapot',
        comName: props.match.params.comName
      }
    }))
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
                      <td>{item.inx}</td>
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