import { createSignal } from 'solid-js'
// import { createStore } from 'solid-js/store'
// import './App.css'
import styles from './app.module.css'

function App() {

  const calcMothPayment = () => {
    const credit = houseCost() - initialPayment()
    const r = rate() / 12 / 100
    const g_r = (1 + r) ** (creditTerm() * 12)
    return Math.round(credit * r * g_r / (g_r - 1) * 100) / 100
  }

  const calcHouseCost = () => {
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
    const i = houseCost() - (monthPayment() * (g_r - 1)) / (r * g_r)
    return (i < 0) ? 0 : i
  }

  const calcPaymentTable = () => {
    const credit = houseCost() - initialPayment()
    const r = rate() / 12 / 100
    const g_r = (1 + r) ** (creditTerm() * 12)
    var left = credit
    var totalCredit = 0
    var totalPercent = 0
    var table = []
    for (let i = 1; i < creditTerm() * 12 + 1; i++) {
      const percent = left * r
      totalPercent += percent
      const g_c = monthPayment() - percent
      totalCredit += g_c
      left -= g_c
      table.push(
        {
          month: i,
          percent: percent,
          g_c: g_c,
          left: left
        }
      )
    }

    setTotalPaid(credit + totalPercent)
    setTotalPercent(totalPercent)
    return table
  }

  const [initialPayment, setInitialPayment] = createSignal(200000)
  const [houseCost, setHouseCost] = createSignal(1000000)
  const [creditTerm, setCreditTerm] = createSignal(20)
  const [rate, setRate] = createSignal(5.5)
  const [monthPayment, setMonthPayment] = createSignal(calcMothPayment())
  const [totalPaid, setTotalPaid] = createSignal(0)
  const [totalPercent, setTotalPercent] = createSignal(0)
  const [selectedCalc, setSelectedCalc] = createSignal('month_payment')
  const [paymentTable, setPaymentTable] = createSignal(calcPaymentTable())


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
      case 'house_cost':
        setHouseCost(calcHouseCost())
    }

    setPaymentTable(calcPaymentTable())

  }

  const currencyFormatedValue = (v) => {
    return v.toLocaleString("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }
  const handleInitialPayment = (v) => {
    setInitialPayment(formValueToFloat(v))
    calc()
  }

  const handleHouseCost = (v) => {
    setHouseCost(formValueToFloat(v))
    calc()
  }

  const handleMonthPayment = (v) => {
    setMonthPayment(formValueToFloat(v))
    calc()
  }

  const handleCreditRate = (v) => {
    setRate(formValueToFloat(v))
    calc()
  }

  const handleCreditTerm = (v) => {
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
            <input className={styles.inputText} type="text" value={currencyFormatedValue(initialPayment())} onInput={(e) => { handleInitialPayment(e.target.value) }} disabled={selectedCalc() === 'initial_payment'}></input>
          </div>
          <div>
            <input className={styles.range} type="range" step="1" min={0} max={houseCost()} value={initialPayment()} onInput={(e) => handleInitialPayment(e.target.value)} disabled={selectedCalc() === 'initial_payment'} ></input>
          </div>
          <div onClick={() => setSelectedCalc('initial_payment')}>
            <input name="calc" type="radio" onChange={() => setSelectedCalc('initial_payment')}></input>
            <label>Calc</label>
          </div>
        </div>
        <div className={styles.form}>
          <div className={styles.formName}>House cost</div>
          <div>
            <input className={styles.inputText} type="text" value={currencyFormatedValue(houseCost())} onInput={(e) => { handleHouseCost(e.target.value) }} disabled={selectedCalc() === 'house_cost'}></input>
          </div>
          <div>
            <input className={styles.range} type="range" step="1" min={initialPayment()} max={100000000} value={houseCost()} onInput={(e) => handleHouseCost(e.target.value)} disabled={selectedCalc() === 'house_cost'}></input>
          </div>
          <div onClick={() => setSelectedCalc('house_cost')}>
            <input name="calc" type="radio" onChange={() => setSelectedCalc('house_cost')}></input>
            <label>Calc</label>
          </div>
        </div>
        <div className={styles.form}>
          <div className={styles.formName}>Credit rate</div>
          <div>
            <input className={styles.inputText} type="text" value={rate()} onInput={(e) => { handleCreditRate(e.target.value) }} disabled={selectedCalc() === 'rate'}></input>
          </div>
          <div>
            <div>
              <input className={styles.range} type="range" step={0.1} min={1} max={30} value={rate()} onInput={(e) => handleCreditRate(e.target.value)} disabled={selectedCalc() === 'rate'}></input>
            </div>
          </div>
          {/* <input name="calc" type="radio" onChange={() => setSelectedCalc('rate')}></input>
          <label>Calc</label> */}
        </div>
        <div className={styles.form}>
          <div className={styles.formName}>Credit term</div>
          <div>
            <input className={styles.inputText} type="text" value={creditTerm()} onInput={(e) => { handleCreditTerm(e.target.value) }} disabled={selectedCalc() === 'credit_term'}></input>
          </div>
          <div>
            <input className={styles.range} type="range" step={1} min={1} max={35} value={creditTerm()} onInput={(e) => handleCreditTerm(e.target.value)} disabled={selectedCalc() === 'credit_term'}></input>
          </div>
          {/* <input name="calc" type="radio" onChange={(e) => setSelectedCalc('credit_term')}></input>
          <label>Calc</label> */}
        </div>
        <div className={styles.form}>
          <div className={styles.formName}>Month payment</div>
          <div>
            <input className={styles.inputText} type="text" value={currencyFormatedValue(monthPayment())} onInput={(e) => { handleMonthPayment(e.target.value) }} disabled={selectedCalc() === 'month_payment'}></input>
          </div>
          <div>
            <input className={styles.range} type="range" step={10} min={1} max={1000000} value={monthPayment()} onInput={(e) => handleMonthPayment(e.target.value)} disabled={selectedCalc() === 'month_payment'}></input>
          </div>
          <div onClick={() => setSelectedCalc('month_payment')}>
            <input name="calc" type="radio" onChange={() => setSelectedCalc('month_payment')} checked={selectedCalc() === 'month_payment'}></input>
            <label>Calc</label>
          </div>
        </div>
      </div>
      <div className={styles.info}>
        <label>Loan amount <strong>{currencyFormatedValue(houseCost() - initialPayment())}</strong></label>
        <label>total paid loan + interest <strong>{currencyFormatedValue(totalPaid())}</strong></label>
        <label>overpayment <strong>{currencyFormatedValue(totalPercent())}</strong></label>
      </div>
      <div className={styles.paymentSchedule}>
        <div style={{ "text-align": "center" }}>
          Payment schedule
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <tbody>
              <tr>
                <th>
                  Moth
                </th>
                <th>
                  Payment
                </th>
                <th>
                  Credit body
                </th>
                <th>
                  Percent
                </th>
                <th>
                  Left
                </th>
              </tr>
              {
                paymentTable().map(
                  (r, i) =>
                    <tr>
                      <td>{r.month} <br/> (year {(Math.round(i / 12) < 1) ? 1 : Math.round(i / 12)})</td>
                      <td>{currencyFormatedValue(monthPayment())}</td>
                      <td>{currencyFormatedValue(r.g_c)}</td>
                      <td>{currencyFormatedValue(r.percent)}</td>
                      <td>{currencyFormatedValue(r.left)}</td>
                    </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default App
