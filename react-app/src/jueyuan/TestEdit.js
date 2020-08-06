import React from 'react'
import Title from '../components/Title'
import Sidebar from './components/Sidebar'
import socket from '../Socket'

const TestEdit = props => {

  const [category, setCategory] = React.useState("A9")

  const [load, setLoad] = React.useState(false)

  const [loadText, setLoadText] = React.useState('')

  const [id4, setId4] = React.useState([])


  socket
  .off('command')
  .on('command', data => {
    const res = JSON.parse(data)
    if(load && res.status === 'end') {
      if (res.fun === 'jueyuanId4') {
        setLoad(false)
        setId4(res.content)
      }
      if (res.fun === 'initConfig1') {
        setTimeout(()=>{
          socket.emit('command', JSON.stringify({
            fun: 'initConfig2',
            param: {
              type: 'insulation',
              comName:  decodeURIComponent(props.match.params.comName)
            }
          }))
        },500)
      }
      if (res.fun === 'initConfig2') {
        setLoad(false)
      }

      if (res.fun === 'saveJueyuanConfig') {
        setLoad(false)
      }
    }
    if (load && res.status === 'err') {
      window.alert('无法连接设备，请重新连接')
      window.location = '#'
    }
  })



  
  React.useEffect(() => {
    setLoad(true)
    setLoadText('正在初始化(请勿操作页面)...')
    socket.emit('command', JSON.stringify({
      fun: 'jueyuanId4',
      param: {
        type: 'insulation',
        comName:  decodeURIComponent(props.match.params.comName)
      }
    }))
  }, [props.match.params.comName])

  const initConfig = () => {
    setLoad(true)
    setLoadText('正在初始化测试配置(请勿操作页面)...')
    socket.emit('command', JSON.stringify({
      fun: 'initConfig1',
      param: {
        type: 'insulation',
        comName:  decodeURIComponent(props.match.params.comName)
      }
    }))
  }

  const save = () => {
    setLoad(true)
    setLoadText('正在写入测试配置(请勿操作页面)...')
    const data = {
      category:category,
      id4:id4,
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

    if (flg) {
      socket.emit('command', JSON.stringify({
        fun: 'saveJueyuanConfig',
        param: {
          type: 'insulation',
          comName:  decodeURIComponent(props.match.params.comName),
          ...data
        }
      }))
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