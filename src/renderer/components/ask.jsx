import React, {PropTypes, Component} from 'react'

export default class Ask extends Component {
  constructor (props) {
    super(props)
    this.state = {question: ''}
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.onSubmit(this.state.question)
  }

  linkState = (event) => {
    this.setState({question: event.target.value})
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          question={this.state.question}
          onChange={this.linkState}
          placeholder="Consult Advisor"
        />
      </form>
    )
  }
}

Ask.propTypes = {
  onSubmit: PropTypes.func
}
