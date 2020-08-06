import React from 'react'

import Title from '../components/Title'
import Detail from './components/Detail'
import Sidebar from './components/Sidebar'
import socket from '../Socket'


const insertOriginal = body => new Promise((resolve, reject) => {
  fetch(`${window.config.service_url}/api/jueyuan/original/`, {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(response => resolve(response))
    .catch(err => reject(err))
})

const insulationUpload = body => new Promise((resolve, reject) => {
  fetch(`${window.config.service_url}/api/jueyuan/mod5/`, {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(response => resolve(response))
    .catch(err => reject(err))
})

const Upload = props => {

  const [list, setList] = React.useState([])

  const [load, setLoad] = React.useState(false)

  const [loadText, setLoadText] = React.useState('')

  const [detailFlg, setDetailFlg] = React.useState(false)

  const [item, setItem] = React.useState(0)

  const [percentage, setPercentage] = React.useState(0)

  const [inx, setInx] = React.useState(-1)

  // const [id4, setId4] = React.useState([])

  const [original, setOriginal] = React.useState([])


  socket
    .off('command')
    .on('command', data => {
      const res = JSON.parse(data)
      if (load && res.status === 'end') {
        if (res.fun === 'jueyuanId4') {
          setLoad(false)
          // setId4(res.content)
        }
        if (res.fun === 'clearDevice') {
          setLoad(false)
        }
      }

      if (load && res.status === 'run') {
        if (res.fun === 'readJueyuanData') {
          setList(p => {
            if (res.content.attribute !== -1) {
              p.push(res.content.attribute)
            }
            return p
          })
          setOriginal(p => {
            if (res.content.original !== -1) {
              p.push({
                data: res.content.original,
                datime: res.content.datime
              })
            }
            return p
          })
          setPercentage(res.content.inx / 511 * 100)
          if (res.content.inx === 511) {
            setLoad(false)
          } else {
            console.info('run')
            setInx(res.content.inx + 1)
          }
        }
      }

      if (load && res.status === 'err') {
        window.alert('无法连接设备，请重新连接')
        window.location = '#'
      }
    })


  React.useEffect(() => {
    if (inx !== -1) {
      setTimeout(() => {
        socket.emit('command', JSON.stringify({
          fun: 'readJueyuanData',
          param: {
            comName: decodeURIComponent(props.match.params.comName),
            inx: inx
          }
        }))
      },1000)
    }
  }, [inx, props.match.params.comName])

  const toDetail = item => {
    setItem(item)
    setDetailFlg(true)
  }

  const readData = () => {
    setLoad(true)
    setOriginal([])
    setList([])
    setLoadText('正在读取设备(请勿操作页面)...')
    setInx(0)
  }

  const stop = () => {
    setLoad(false)
    setInx(-1)
  }

  const upload = () => {
    setLoad(true)
    setLoadText('正在上传数据请(请勿操作页面)...')
    insulationUpload(list)
      .then(res => {
        clearDevice()
        insertOriginal(original)
          .then(res => { })
      })
      .catch(err => {
        setLoad(false)
        alert('上传失败,请检测网络连接!')
        console.info(err)
      })
  }

  const clearDevice = () => {
    setLoad(true)
    setLoadText('正在清除待发数据(请勿操作页面)...')
    socket.emit('command', JSON.stringify({
      fun: 'clearDevice',
      param: {
        type: 'insulation',
        comName: decodeURIComponent(props.match.params.comName)
      }
    }))
  }


  return (
    <div className="row">
      <Sidebar
        category="upload"
        id={props.match.params.id}
        comName={props.match.params.comName} />
      <div className="col-md-10 col-lg-9  offset-md-2">
        <div className=" card-body mt-3">
          <Title title="数据上传" load={load} loadText={loadText} />
          <br />
          <div className="row">
            <div className="col">
              {detailFlg ?
                <Detail item={item} back={() => setDetailFlg(false)} /> : (
                  <table className="table table-sm table-bordered table-hover font-small" >
                    <thead className="thead-light">
                      <tr>
                        <th colSpan="10">
                          <div className="row">
                            <div className="col">
                              {(
                                <div className="progress p-2" style={{ height: '100%' }}>
                                  <div className="progress-bar " role="progressbar" aria-valuenow="60"
                                    aria-valuemin="0" aria-valuemax="100" style={{ width: `${percentage}%` }}>
                                    {parseInt(percentage)}%
                                    </div>
                                </div>
                              )}
                            </div>
                            <div className="pull-right btn-group btn-group-sm" style={{ right: '12px' }}>
                              {
                                load ? (<button
                                  className='btn btn-danger'
                                  onClick={stop} >
                                  停止
                                </button>) : (
                                    <button
                                      disabled={load}
                                      className='btn btn-info'
                                      onClick={readData} >
                                      读取设备
                                    </button>
                                  )
                              }
                              <button
                                disabled={load}
                                className='btn btn-primary'
                                onClick={upload} >
                                数据上传
                              </button>
                            </div>
                          </div>
                        </th>
                      </tr>
                      <tr>
                        <th>#</th>
                        <th>设备编号</th>
                        <th>车次</th>
                        <th>车次编组</th>
                        <th>测试类别</th>
                        <th>测试类型</th>
                        <th>测试人员</th>
                        <th>测试班组</th>
                        <th>测试时间</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list && list.map((item, inx) =>
                        <tr key={inx}>
                          <td>{inx + 1}</td>
                          <td>{item.deviceId}</td>
                          <td>{item.trainNumber}</td>
                          <td>{item.trainGroup}</td>
                          <td>{item.dataType}</td>
                          <td>{item.testType}</td>
                          <td>{item.personnel}</td>
                          <td>{item.team}</td>
                          <td>{item.date}</td>
                          <td>
                            <button className="btn btn-primary btn-sm"
                              onClick={() => toDetail(item)}>
                              查看详情
                              </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
export default Upload