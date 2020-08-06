import React from 'react'

const Sidebar = props => (
  <div className="sidebar col-md-2 d-none d-md-block bg-light border-right">
    <div className="sidebar-sticky">
      <ul className="nav flex-column mt-4">
        <li className="nav-menu">
          <a
            href={`#防干烧/设备设置/${encodeURIComponent(props.comName)}/${props.id}/`}
            className={`nav-link ${props.category==='edit'?'nav-menu-active':'nav-menu-link'}`}
          >
            <i className="fa fa-fw fa-cogs" aria-hidden="true"></i>
            设备设置
          </a>
        </li >
        <li className="nav-menu">
          <a
            href={`#防干烧/茶炉设置/${encodeURIComponent(props.comName)}/${props.id}/`}
            className={`nav-link ${props.category==='testEdit'?'nav-menu-active':'nav-menu-link'}`}
          >
            <i className="fa fa-fw fa-thermometer-full" aria-hidden="true"></i>
            茶炉设置
          </a>
        </li >
        <li className="nav-menu border-bottom">
          <a
            href={`#防干烧/数据上传/${encodeURIComponent(props.comName)}/${props.id}/`}
            className={`nav-link ${props.category==='upload'?'nav-menu-active':'nav-menu-link'}`}
          >
            <i className="fa fa-fw fa-cloud-upload" aria-hidden="true"></i>
            数据上传
          </a>
        </li>
        <li>
          <a
            href={`#防干烧/设备列表/`}
            className={`nav-link text-danger `}
          >
            <i className="fa fa-fw fa-angle-left"></i>
            返回
          </a>
        </li>
      </ul>
    </div>
  </div>
)

export default Sidebar