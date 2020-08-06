import React from 'react'

const Sidebar = props => (
  <div className="sidebar col-md-2 d-none d-md-block bg-light border-right">
    <div className="sidebar-sticky">
      <ul className="nav flex-column mt-4">
        <li className="nav-menu">
          <a
            href={`#绝缘/设备设置/${encodeURIComponent(props.comName)}/`}
            onClick={props.close}
            className={`nav-link ${props.category==='edit'?'nav-menu-active':'nav-menu-link'}`}
          >
            <i className="fa fa-w fa-cogs" aria-hidden="true"></i>
            设备设置
          </a>
        </li >
        <li className="nav-menu">
          <a
            href={`#绝缘/测试配置/${encodeURIComponent(props.comName)}/`}
            onClick={props.close}
            className={`nav-link ${props.category==='test_edit'?'nav-menu-active':'nav-menu-link'} `}
          >
            <i className="fa fa-w fa-subway" aria-hidden="true"></i>
            测试配置
          </a>
        </li>
        <li className="nav-menu border-bottom">
          <a
            href={`#绝缘/数据上传/${encodeURIComponent(props.comName)}/`}
            onClick={props.close}
            className={`nav-link ${props.category==='upload'?'nav-menu-active':'nav-menu-link'}`}
          >
            <i className="fa fa-w fa-cloud-upload" aria-hidden="true"></i>
            数据上传
          </a>
        </li>
        <li>
          <a
            href={`#绝缘/设备列表/`}
            onClick={props.close}
            className={`nav-link text-danger `}
          >
            <i className="fa fa-w fa-fw fa-angle-left"></i>
            返回
          </a>
        </li>
      </ul>
    </div>
  </div>
)

export default Sidebar