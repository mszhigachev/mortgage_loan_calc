import { createSignal } from 'solid-js'
import './App.css'

const Slider = (props) => {
  return(
    <>
      <imput type="range" min="0"></imput>
    </>
  )
}

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <>
    <div>test1</div>
    <div><Test/></div>
    <Slider></Slider>
    </>
  )
}

export default App
