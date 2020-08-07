import React from 'react'
import moment from 'moment'
const fs = window.fs
const dialog = window.dialog
const Upload = () => {

  const [upInx, setUpInx] = React.useState(0)

  const [list, setList] = React.useState([])

  React.useEffect(() => {
    console.info(list)
  }, [list])

  const _upload = () => {
    const fun = inx => {
      if (list.length === inx) {
        alert('上传完成')
        return
      }
      setUpInx(inx)
      fetch(`${config.service_url}/api/chegou/equpment/check/${list[inx].device_id.replace(/:/g, '|')}/`)
        .then(response => response.json())
        .then(res => {
          if (res.content) {
            fetch(`${config.service_url}/api/chegou/`, {
              method: 'post',
              headers: {
                'content-type': 'application/json'
              },
              body: JSON.stringify([list[inx]])
            })
              .then(response => response.json())
              .then(resp => {
                inx = inx + 1
                fun(inx)
              })
              .catch(err => console.info(err))
          } else {
            inx = inx +
              fun(inx)
          }
        })
        .catch(err => console.info(err))
    }
    fun(0)
  }

  const openDialog = async () => {
    const file = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'json', extensions: ['json'] },
      ]
    })
    if (file.filePaths[0]) {
      setList(JSON.parse(fs.readFileSync(file.filePaths[0])).coupler)
    }
  }


  return (
    <div className="row">
      <div className="card-body mt-2">
        <h3>数据上传</h3>
        <hr />
        <table className="table table-sm table-bordered table-hover ">
          <thead className="thead-light">
            <tr>
              <th colSpan="11">
                <div className="row">
                  <div className="col">
                    {(
                      <div className="progress " style={{ height: '100%' }}>
                        <div className="progress-bar " role="progressbar" aria-valuenow="60"
                          aria-valuemin="0" aria-valuemax="100" style={{ width: list.length === 0 ? 0 : `${(upInx / list.length) * 100}%` }}>
                          {upInx}/{list.length}%
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-md-3">
                    <div className="pull-right btn-group btn-group-sm" >
                      <button className='btn btn-info' onClick={openDialog} >文件选择</button>
                      <button className='btn btn-primary' onClick={_upload} >数据上传</button>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th>#</th>
              <th>设备编号</th>
              <th>车次</th>
              <th>车号</th>
              <th>车钩类型</th>
              <th>测试类型</th>
              <th>测试人员</th>
              <th>测试班组</th>
              <th>测试时间</th>
              <th>测试结果</th>
              <th>测试结论</th>
            </tr>
          </thead>
          <tbody>
            {list && list.map((item, inx) =>
              <tr key={inx}>
                <td>{inx + 1}</td>
                <td>{item.device_id}</td>
                <td>{item.train_number}</td>
                <td>{item.license_number}</td>
                <td>{item.coupler_type}</td>
                <td>{item.test_type}</td>
                <td>{item.test_name}</td>
                <td>{item.test_group}</td>
                <td>{moment(item.date_degin).format('YYYY-MM-DD HH:mm')}</td>
                <td>{item.test_conclusion}</td>
                <td>{item.test_result}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

}

export default Upload 