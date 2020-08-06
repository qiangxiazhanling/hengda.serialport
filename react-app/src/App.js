import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import JueyuanIndex from './jueyuan/Index' 
import ChegouIndex from './chegou/Index'
import FangganshaoIndex from './fangganshao/Index'
import SettingIndex from './setting/Index'

const App = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={JueyuanIndex} />
        <Route path="/绝缘" component={JueyuanIndex} />
        <Route path="/车钩" component={ChegouIndex} />
        <Route path="/防干烧" component={FangganshaoIndex} />
        <Route path="/设置" component={SettingIndex} />
      </Switch>
    </HashRouter>
  )
}

export default App
