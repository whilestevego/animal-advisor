// React and Components
import React, {PropTypes} from 'react'

export default function Prompt ({onSubmit, onChange, sentence}) {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(event)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        className='form-control'
        type='text'
        value={sentence}
        onChange={onChange}
        placeholder='Consult Advisor'
      />
    </form>
  )
}

Prompt.propTypes = {
  sentence: PropTypes.string,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func
}

Prompt.defaultProps = {
  sentence: ''
}
