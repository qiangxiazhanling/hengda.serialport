import React from 'react'
import EquipmentItem from '../components/EquipmentItem'
import socket from '../Socket'

const List = () => {

  const [list, setList] = React.useState([])

  const [flg, setFlg] = React.useState(false)

  socket
    .off('juyuanList')
    .on('juyuanList', data => {
      setFlg(false)
      console.info(data)
      setList(data)
    })

  React.useEffect(() => {
    if (flg) {
      socket.emit('juyuanList','')
    }
  }, [flg])

  const refreshList = () => {
    setList([])
    setFlg(true)
  }

  return (
    <>
      <div className="card-body">
        {list && list
        .map((item, inx) => (<EquipmentItem key={inx} href={'#绝缘/设备设置'}  comName={item} />))}
      </div>
      <footer className="fixed-bottom">
        <div className="row bg-dark text-white px-2">
          <div className="col item-middle">
            {
              flg && (
                <>
                  <i className={`fa fa-spin fa-refresh  fa-fw`} aria-hidden="true"></i>
                  正在扫描设备,请勿操作页面...
                </>
              )
            }
          </div>
          <div className="btn-group btn-group-sm pull-right">
            <button className="btn btn-success rounded-0" disabled={flg} onClick={refreshList}>点击此处开始扫描设备</button>
          </div>
        </div>
      </footer>
    </>
  )
}

export default List