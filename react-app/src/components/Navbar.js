import React from 'react'


const Navbar = props => {

  return (
    <header className="mb-auto">
      <nav className="navbar navbar-expand-sm navbar-dark fixed-top bg-dark shadow">
        <h3 className="navbar-brand px-2">HD TOOLS</h3>
        <div className="collapse navbar-collapse" >
          <nav className="nav nav-masthead justify-content-center">
            <a className={`nav-link ${props.category === 'jueyuan' ? 'active' : ''}`} href="#绝缘/设备列表" >
              绝缘表
            </a>
            {/* <a className={`nav-link ${props.category === 'chegou' ? 'active' : ''}`} href="#车钩/上传" >
              车钩仪
            </a> */}
            <a className={`nav-link ${props.category === 'fangganshao' ? 'active' : ''}`} href="#防干烧/设备列表" >
              防干烧
            </a>
          </nav>

        </div>
        {/*<a href="#设置/软件设置" className="pull-right">
          <i className="fa fa-cog fa-lg" aria-hidden="true"></i>
        </a>*/}
      </nav>
    </header>
  )

}

export default Navbar