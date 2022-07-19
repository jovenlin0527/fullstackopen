import {forwardRef, useState, useImperativeHandle} from 'react'

const TextField = forwardRef(({id, name, prompt, type}, refs) => {
  const [text, setText] = useState('')
  type = type ?? 'text'
  id = id ?? name + '_id'
  const update = (event) => {
    setText(event.target.value)
  }

  useImperativeHandle(refs, () => {
    return {clear: () => setText('')}
  })
  return (
    <div>
      <label htmlFor={id}>{prompt}</label>
      <input id={id} name={name} value={text} onChange={update} type={type} />
    </div>
  )
})

export default TextField
