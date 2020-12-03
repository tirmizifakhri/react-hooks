// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const valueOnLocalStorage = window.localStorage.getItem(key)
    if (valueOnLocalStorage) {
      return deserialize(valueOnLocalStorage)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}

function CalculateThis({initialValue = 0}) {
  const [num, setNum] = useLocalStorageState('num', initialValue)
  function handleChange(event) {
    setNum(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="num">Insert any value here:</label>
        <input value={num} onChange={handleChange} id="num" />
      </form>
      {num ? (
        <strong>The multiply by 2 is: {num * 2}</strong>
      ) : (
        'Please type any number'
      )}
    </div>
  )
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)
  //save our input into name variable
  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return (
    <>
      <CalculateThis />
      <Greeting />
    </>
  )
}

export default App
