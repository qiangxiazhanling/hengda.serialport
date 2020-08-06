import React from 'react'

const Detail = (props) => {
  return (
    <div>
      {
        props.item.dataType === '绝缘电阻测试'?
          (<Jueyuan item={props.item}></Jueyuan>):
          (<Zaixian item={props.item}></Zaixian>)
      }
      <button 
        className="btn btn-primary"
        onClick={props.back}>
        返回
      </button>
    </div>
  )
}


const Jueyuan = (props) => {
  
  const tbColor = (conclusion) =>{
    switch(conclusion) {
      case '待测试':
        return 'table-active'
      case '合格':
        return 'table-success'
      case '不合格':
        return 'table-danger'
      default: 
        return 'table-active'
    }
  }
  
  return (
    <div>
      <table className="table table-bordered table-sm font-small">
        <tbody>
          <tr>
            <th scope="col">设备ID:</th>
            <td colSpan="4">{props.item.deviceId}</td>
            <th scope="col">测试时间:</th>
            <td colSpan="4">{props.item.date}</td>
          </tr>  
          <tr>
            <th scope="col">车次:</th>
            <td>{props.item.trainNumber}</td>
            <th scope="col">车次编组:</th>
            <td>{props.item.trainGroup}</td>
            <th scope="col">测试人员:</th>
            <td>{props.item.personnel}</td>
            <th scope="col">测试班组:</th>
            <td>{props.item.team}</td>
            <th scope="col">测试类别:</th>
            <td>{props.item.dataType}</td>
          </tr>
          <tr>
            <th scope="col">测试类型:</th>
            <td>{props.item.testType}</td>
            <th scope="col">测试温度:</th>
            <td>{props.item.testTemperature}</td>
            <th scope="col">测试相对湿度:</th>
            <td>{props.item.relativeTemperature}</td>
            <th scope="col">线间阈值:</th>
            <td>{props.item.lineRoomThreshold}M</td>
            <th scope="col">线地阈值:</th>
            <td>{props.item.lineThreshold}M</td>
          </tr>
        </tbody>
      </table>
      <table className="table table-bordered table-sm font-small">
        <thead>
          <tr>
            <th scope="col">UV</th>
            <th scope="col">UW</th>
            <th scope="col">UN</th>
            <th scope="col">UG</th>
            <th scope="col">VW</th>
            <th scope="col">VN</th>
            <th scope="col">VG</th>
            <th scope="col">WN</th>
            <th scope="col">WG</th>
            <th scope="col">NG</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td 
              className={tbColor(props.item.uv_conclusion)}
            >{props.item.uv}</td>
            <td 
              className={tbColor(props.item.uw_conclusion)}
            >{props.item.uw}</td>
            <td 
              className={tbColor(props.item.un_conclusion)}
            >{props.item.un}</td>
            <td 
              className={tbColor(props.item.ug_conclusion)}
            >{props.item.ug}</td>
            <td 
              className={tbColor(props.item.vw_conclusion)}
            >{props.item.vw}</td>
            <td 
              className={tbColor(props.item.vn_conclusion)}
            >{props.item.vn}</td>
            <td 
              className={tbColor(props.item.vg_conclusion)}
            >{props.item.vg}</td>
            <td 
              className={tbColor(props.item.wn_conclusion)}
            >{props.item.wn}</td>
            <td 
              className={tbColor(props.item.wg_conclusion)}
            >{props.item.wg}</td>
            <td 
              className={tbColor(props.item.ng_conclusion)}
            >{props.item.ng}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const Zaixian = (props) => {
  return (
    <div>
      <table className="table table-bordered table-sm font-small">
        <tbody>
          <tr>
            <th scope="col">设备ID:</th>
            <td >{props.item.deviceId}</td>
            <th scope="col">测试时间:</th>
            <td >{props.item.date}</td>
            <th scope="col">车次:</th>
            <td>{props.item.trainNumber}</td>
            <th scope="col">车次编组:</th>
            <td>{props.item.trainGroup}</td>
          </tr>  
          <tr>
            <th scope="col">测试人员:</th>
            <td>{props.item.personnel}</td>
            <th scope="col">测试班组:</th>
            <td>{props.item.team}</td>
            <th scope="col">测试类别:</th>
            <td>{props.item.dataType}</td>
            <th scope="col">测试类型:</th>
            <td>{props.item.testType}</td>
          </tr>
          <tr>
            
            <th scope="col">测试温度:</th>
            <td>{props.item.testTemperature}</td>
            <th scope="col">测试相对湿度:</th>
            <td>{props.item.relativeTemperature}</td>
            <th scope="col">正地电压:</th>
            <td>{props.item.positiveVoltage}</td>
            <th scope="col">负地电压:</th>
            <td>{props.item.negativeRoomVoltage}</td>
          </tr>
          <tr>
            <th scope="col">正地电阻:</th>
            <td>{props.item.positiveResistance}</td>
            <th scope="col">负地电阻:</th>
            <td>{props.item.negativeRoomResistance}</td>
            <th scope="col">正线指示灯:</th>
            <td>{props.item.positiveIndicator}</td>
            <th scope="col">负线线指示灯:</th>
            <td>{props.item.negativeIndicator}</td>
          </tr>
          <tr>
            <th scope="col">正线电阻值结论:</th>
            <td>{props.item.positiveConclusion}</td>
            <th scope="col">负线电阻值结论:</th>
            <td>{props.item.negativeConclusion}</td> 
            <th scope="col">电压结论:</th>
            <td>{props.item.voltageConclusion}</td> 
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Detail