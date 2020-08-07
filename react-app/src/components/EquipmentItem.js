import React from 'react'

const EquipmentItem = props =>{

  return (
    <a href={`${props.href}/${encodeURIComponent(props.comName)}`}>
      <div className="row bg-dark text-white shadow-sm mt-2 p-3 shadow ">
        <div className="col align-self-center">
          <div className="pull-left ">
            <h5>串口地址:{props.description}</h5>
          </div>
        </div>
      </div>
    </a>
  ) 
} 


export default EquipmentItem