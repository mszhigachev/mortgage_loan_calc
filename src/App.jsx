import { createSignal } from 'solid-js'
import './App.css'

const Slider = (props) => {
  return(
    <>
      <input type="range" min="0"></input>
    </>
  )
}

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <>
    <div>test</div>
    <div><Slider></Slider></div>
    </>
  )
}

export default App
