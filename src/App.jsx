import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import './App.css'
import styles from './app.module.css'

function App() {

  const calcMothPayment = () => {
    const credit = houseCoast() - initialPayment()
    const r = rate() / 12 / 100
    const g_r = (1 + r) ** (creditTerm() * 12)
    return Math.round(credit * r * g_r / (g_r - 1) * 100) / 100
  }

  const calcHouseCoast = () => {
    const r = rate() / 12 / 100
    const g_r = (1 + r) ** (creditTerm() * 12)
    const c = Math.round(
      initialPayment() + monthPayment() * (g_r - 1) / (r * g_r)
    )
    return c
  }

  const calcInitialPayment = () => {
    const r = rate() / 12 / 100
    const g_r = (1 + r) ** (creditTerm() * 12)
    const i = houseCoast() - (monthPayment() * (g_r - 1)) / (r * g_r)
    return (i < 0) ? 0 : i
  }

  const [initialPayment, setInitialPayment] = createSignal(200000)
  const [houseCoast, setHouseCoast] = createSignal(1000000)
  const [creditTerm, setCreditTerm] = createSignal(20)
  const [rate, setRate] = createSignal(5.5)
  const [monthPayment, setMonthPayment] = createSignal(calcMothPayment())

  const [selectedCalc, setSelectedCalc] = createSignal('month_payment')

  function formValueToFloat(v) {
    const sanitizedValue = v.replace(/[^\d.]/g, "")
    const floatValue = parseFloat(sanitizedValue)
    return isNaN(floatValue) ? 0 : floatValue
  }

  function calc() {
    switch (selectedCalc()) {
      case 'month_payment':
        setMonthPayment(calcMothPayment())
        break;
      case 'initial_payment':
        setInitialPayment(calcInitialPayment())
        break;
      case 'house_coast':
        setHouseCoast(calcHouseCoast())
    }
  }

  const currencyFormatedValue = (v) => {
    return v.toLocaleString("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }
  const handleInitialPayment = (v) => {
    console.log('handle initial payment', v, typeof v)


    setInitialPayment(formValueToFloat(v))
    calc()
  }

  const handleHouseCoast = (v) => {
    console.log('handle house coast', v)
    setHouseCoast(formValueToFloat(v))
    calc()

  }

  const handleMonthPayment = (v) => {
    console.log('handle month payment', v)
    setMonthPayment(formValueToFloat(v))
    calc()

  }

  const handleCreditRate = (v) => {
    console.log('handle credit rate', v)
    setRate(formValueToFloat(v))
    calc()


  }

  const handleCreditTerm = (v) => {
    console.log('handle credit term', v)
    setCreditTerm(formValueToFloat(v))
    calc()

  }

  return (
    <>
      <div>test</div>
      <div className={styles.formsBlock}>
        <div className={styles.form}>
          <div className={styles.formName}>Initial payment</div>
          <div>
            <input type="text" value={currencyFormatedValue(initialPayment())} onInput={(e) => { handleInitialPayment(e.target.value) }} disabled={selectedCalc() === 'initial_payment'}></input>
          </div>
          <div>
            <input type="range" step="1" min={0} max={houseCoast()} value={initialPayment()} onInput={(e) => handleInitialPayment(e.target.value)} disabled={selectedCalc() === 'initial_payment'} ></input>
          </div>
          <input name="calc" type="radio" onChange={() => setSelectedCalc('initial_payment')}></input>
          <label>Calc</label>

        </div>
        <div className={styles.form}>
          <div className={styles.formName}>House coast</div>
          <div>
            <input type="text" value={currencyFormatedValue(houseCoast())} onInput={(e) => { handleHouseCoast(e.target.value) }} disabled={selectedCalc() === 'house_coast'}></input>
          </div>
          <div>
            <input type="range" step="1" min={initialPayment()} max={100000000} value={houseCoast()} onInput={(e) => handleHouseCoast(e.target.value)} disabled={selectedCalc() === 'house_coast'}></input>
          </div>
          <input name="calc" type="radio" onChange={() => setSelectedCalc('house_coast')}></input>
          <label>Calc</label>
        </div>
        <div className={styles.form}>
          <div className={styles.formName}>Credit rate</div>
          <div>
            <input type="text" value={rate()} onInput={(e) => { handleCreditRate(e.target.value) }} disabled={selectedCalc() === 'rate'}></input>
          </div>
          <div>
            <input type="range" step={0.1} min={1} max={30} value={rate()} onInput={(e) => handleCreditRate(e.target.value)} disabled={selectedCalc() === 'rate'}></input>
          </div>
          {/* <input name="calc" type="radio" onChange={() => setSelectedCalc('rate')}></input>
          <label>Calc</label> */}
        </div>
        <div className={styles.form}>
          <div className={styles.formName}>Credit term</div>
          <div>
            <input type="text" value={creditTerm()} onInput={(e) => { handleCreditTerm(e.target.value) }} disabled={selectedCalc() === 'credit_term'}></input>
          </div>
          <div>
            <input type="range" step={1} min={1} max={35} value={creditTerm()} onInput={(e) => handleCreditTerm(e.target.value)} disabled={selectedCalc() === 'credit_term'}></input>
          </div>
          {/* <input name="calc" type="radio" onChange={(e) => setSelectedCalc('credit_term')}></input>
          <label>Calc</label> */}
        </div>
        <div className={styles.form}>
          <div className={styles.formName}>Month payment</div>
          <div>
            <input type="text" value={currencyFormatedValue(monthPayment())} onInput={(e) => { handleMonthPayment(e.target.value) }} disabled={selectedCalc() === 'month_payment'}></input>
          </div>
          <div>
            <input type="range" step={10} min={1} max={1000000} value={monthPayment()} onInput={(e) => handleMonthPayment(e.target.value)} disabled={selectedCalc() === 'month_payment'}></input>
          </div>
          <input name="calc" type="radio" onChange={() => setSelectedCalc('month_payment')} checked={selectedCalc() === 'month_payment'}></input>
          <label>Calc</label>
        </div>
      </div>
    </>
  )
}

export default App
