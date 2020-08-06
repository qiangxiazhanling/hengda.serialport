import React from 'react'

const Setting = props => {

  const [config, setConfig] = React.useState(0)

  React.useEffect(() => {
    setConfig(window.config)
  }, [])

  React.useEffect(() => {
    window.writeConfig(config)
  }, [config])


  const teapotTcp = event => {
    const data = config.teapot_tcp
    data[event.target.name] = event.target.value
    setConfig({
      ...config,
      ...data
    })
  }

  const insulationTcp = event => {
    const data = config.insulation_tcp
    data[event.target.name] = event.target.value
    setConfig({
      ...config,
      ...data
    })
  }

  const _onChange = event => {
    setConfig({
      ...config,
      [event.target.id]: event.target.value
    })
  }

  return (
    <div className="card-body">
      <h3>设置</h3>
      <hr />
      {
        config && (
          <div className="row">
            <div className="col">
              <div className="row">
                <div className="col-sm-12">
                  <h4 className="text-primary">网络设置</h4>
                  <div className="row">
                    <div className="col form-group ">
                      <label>有线上传地址</label>
                      <input
                        id="service_url"
                        type="text"
                        value={config.service_url}
                        onChange={_onChange}
                        className="form-control form-control-sm" />
                      <small className="form-text text-success">
                        #在进行有线上传时所使用的远程服务器
                      </small>
                    </div>
                    <div className="col form-group ">
                      <label>默认wifi</label>
                      <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                          <span className="input-group-text">名称</span>
                        </div>
                        <input
                          id="wifi_name"
                          type="text"
                          value={config.wifi_name}
                          onChange={_onChange}
                          className="form-control" />
                        <div className="input-group-prepend">
                          <span className="input-group-text">密码</span>
                        </div>
                        <input
                          id="wifi_pwd"
                          type="text"
                          value={config.wifi_pwd}
                          onChange={_onChange}
                          className="form-control" />
                      </div>
                      <small className="form-text text-success">
                        #进行网络设置时使用的默认值
                      </small>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col form-group ">
                      <label >绝缘表网络设置默认地址</label>
                      <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                          <span className="input-group-text">服务器地址</span>
                        </div>
                        <input
                          name="ip"
                          type="text"
                          value={config.insulation_tcp.ip}
                          onChange={insulationTcp}
                          className="form-control" />
                        <div className="input-group-prepend">
                          <span className="input-group-text">服务器端口</span>
                        </div>
                        <input
                          name="port"
                          type="text"
                          value={config.insulation_tcp.port}
                          onChange={insulationTcp}
                          className="form-control" />
                      </div>
                      <small className="form-text text-success">
                        #绝缘表在进行网络设置时使用的默认值
                      </small>
                    </div>
                    <div className="col form-group ">
                      <label >防干烧网络设置默认地址</label>
                      <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                          <span className="input-group-text">服务器地址</span>
                        </div>
                        <input
                          name="ip"
                          type="text"
                          onChange={teapotTcp}
                          value={config.teapot_tcp.ip}
                          className="form-control" />
                        <div className="input-group-prepend">
                          <span className="input-group-text">服务器端口</span>
                        </div>
                        <input
                          id="port"
                          type="text"
                          onChange={teapotTcp}
                          disabled={true}
                          value={config.teapot_tcp.port}
                          className="form-control" />
                      </div>
                      <small className="form-text text-success">
                        #防干烧在进行网络设置时使用的默认值
                    </small>
                    </div>

                  </div>
                  <hr />
                  <div className="row">
                    <div className="col">
                      <a
                        href={`#/`}
                        className={`nav-link text-danger `}
                      >
                        <i className="fa fa-fw fa-angle-left"></i>
                        返回
                    </a>
                    </div>
                    <div className="col-md-3 pull-right" >
                      <small className="text-muted">编译日期:2020年7月2日</small>
                      <br />
                      <small className="text-muted">软件版本:v0.5.0</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

    </div>
  )
}

export default Setting