import React from 'react'

const Title = props => (
  <div className="row border-bottom">
    <div className="col">
      <h3>{props.title}</h3>
    </div>
    {props.load && (
      <div className="col">
        <div className="mt-2 pull-right text-primary">
          <i className="fa fa-circle-o-notch fa-spin fa-fw"></i>
          {props.loadText}
        </div>
      </div>
    )}

  </div>
)

export default Title