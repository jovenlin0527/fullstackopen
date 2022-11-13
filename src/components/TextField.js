import { forwardRef, useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const TextField = forwardRef(({ id, name, prompt, type }, refs) => {
  const [text, setText] = useState('')
  type = type != null ? type : 'text'
  id = id != null ? id : name + '_id'
  const update = (event) => {
    setText(event.target.value)
  }

  useImperativeHandle(refs, () => {
    return { clear: () => setText('') }
  })
  return (
    <div>
      <label htmlFor={id}>{prompt}</label>
      <input id={id} name={name} value={text} onChange={update} type={type} />
    </div>
  )
})

TextField.propType = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  type: PropTypes.string,
  prompt: PropTypes.string.isRequired,
}

TextField.displayName = 'TextField'

export default TextField
