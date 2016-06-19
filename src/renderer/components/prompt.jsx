// React and Components
import React, {PropTypes, Component} from 'react'

import _ from 'lodash'

export default class Prompt extends Component {
  constructor (props) {
    super(props)
    this.state = {sentence: props.sentence}
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.onSubmit(this.state.sentence)
  }

  linkState = (event) => {
    const {onChange} = this.props

    if (_.isFunction(onChange)) {
      onChange(event)
    } else {
      this.setState({sentence: event.target.value})
    }
  }

  componentWillReceiveProps ({sentence}) {
    this.setState({sentence})
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          className='form-control'
          type='text'
          value={this.state.sentence}
          onChange={this.linkState}
          placeholder='Consult Advisor'
        />
      </form>
    )
  }
}

Prompt.propTypes = {
  sentence: PropTypes.string,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func
}

Prompt.defaultProps = {
  sentence: ''
}
