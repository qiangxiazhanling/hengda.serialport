import React from 'react'
import Sidebar from './commponents/Sidebar'
import Title from '../components/Title'
import socket from '../Socket'

const TestEdit = props => {

  const [load, setLoad] = React.useState(false)

  const [loadText, setLoadText] = React.useState('')

  const [orderhead, setOrderhead] = React.useState(0)

  const [item, setItem] = React.useState({})


  
  socket
    .off('command')
    .on('command', data => {
      const res = JSON.parse(data)
      console.info(data)
      if (load && res.fun === 'fangganshaoId4' && res.status === 'end') {
        setOrderhead(res.content.orderhead)
        socket.emit('command', JSON.stringify({
          fun: 'fangganshaoReadTestEdit',
          param: {
            type: 'teapot',
            comName: decodeURIComponent(props.match.params.comName),
            orderhead: res.content.orderhead
          }
        }))
      } 
      if (load && res.fun === 'fangganshaoReadTestEdit' && res.status === 'end' ) {
        setLoad(false)
        setItem(res.content)
      }
      if (load && res.fun === 'fangganshaoWriteTestEdit' && res.status === 'end' ) {
        setLoad(false)
      }
      if (load && res.status === 'err') {
        window.alert('无法连接设备，请重新连接')
        window.location='#/防干烧'
      } 
    })

  React.useEffect(() => {
    if (props.match.params.comName) {
      setLoad(d => true)
      setLoadText(d => '读取设备中...')
      socket.emit('command', JSON.stringify({
        fun: 'fangganshaoId4',
        param: {
          type: 'teapot',
          comName: decodeURIComponent(props.match.params.comName)
        }
      }))
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
    socket.emit('command', JSON.stringify({
      fun: 'fangganshaoWriteTestEdit',
      param: {
        type: 'teapot',
        comName: decodeURIComponent(props.match.params.comName),
        orderhead: orderhead,
        param: item
      }
    }))
  }

  return (
    <div className="row">
      <Sidebar category="testEdit" comName={props.match.params.comName}  id={props.match.params.id}/>
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