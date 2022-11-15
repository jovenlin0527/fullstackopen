import { useState } from 'react'
import PropTypes from 'prop-types'

export const useField = ({ oldProps } = {}) => {
  const [value, setValue] = useState('')
  const onChange = (event) => {
    setValue(event.target.value)
  }
  const props = {
    ...oldProps,
    onChange,
    value,
  }
  return [props, setValue]
}

const TextField = ({ id, name, prompt, type, value, onChange }) => {
  type = type != null ? type : 'text'
  id = id != null ? id : name + '_id'
  return (
    <div>
      <label htmlFor={id}>{prompt}</label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
      />
    </div>
  )
}

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  type: PropTypes.string,
  prompt: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

TextField.displayName = 'TextField'

export default TextField
