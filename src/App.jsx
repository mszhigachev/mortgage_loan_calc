import { createSignal } from 'solid-js'
import './App.css'

const Test = () => {
  return <div>x</div>
}

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <>
    <div>test</div>
    <div><Test/></div>
    </>
  )
}

export default App
