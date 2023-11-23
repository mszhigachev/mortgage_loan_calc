import { createMemo, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import styles from './app.module.css'
import Form from './components/form/Form'
import Info from './components/info/Info'
import PaymentSchedule from './components/paymentSchedule/paymentSchedule'

function App() {

  const [store, setStore] = createStore(
    {
      selectedCalc:
        "Month payment",
      forms: {
        initialPayment: {
          value: 200000,
          name: "Initial payment",
          minVal: 0,
          maxVal: Infinity

        },
        houseCost: {
          value: 1000000,
          name: "House cost",
          minVal: 100,
          maxVal: 100000000

        },
        creditTerm: {
          value: 20,
          name: "Credit term",
          minVal: 1,
          maxVal: 35

        },
        rate: {
          value: 5.5,
          name: "Credit rate",
          minVal: 0.1,
          maxVal: 99

        },
        monthPayment: {
          value: 5503.1,
          name: "Month payment",
          minVal: 0,
          maxVal: Infinity

        }
      },
      get monthRate() {
        return this.forms.rate.value / 12 / 100
      },
      get totalRate() {
        return (1 + this.monthRate) ** (this.forms.creditTerm.value * 12)
      },
      get totalCredit() {
        return this.forms.houseCost.value - this.forms.initialPayment.value
      }
    }
  )



  setStore('forms', 'initialPayment', 'maxVal', store.forms.houseCost.value)



  const calcMothPayment = () => {
    return Math.round(store.totalCredit * store.monthRate * store.totalRate / (store.totalRate - 1) * 100) / 100
  }

  const calcHouseCost = () => {
    return Math.round(store.forms.initialPayment.value + store.forms.monthPayment.value * (store.totalRate - 1) / (store.monthRate * store.totalRate))
  }

  const calcInitialPayment = () => {
    const initialPayment = store.forms.houseCost.value - (store.forms.monthPayment.value * (store.totalRate - 1) / (store.monthRate * store.totalRate))
    return (initialPayment < 0) ? 0 : initialPayment
  }

  function calc() {
    switch (store.selectedCalc) {
      case store.forms.monthPayment.name:
        setStore('forms', 'monthPayment', 'value', calcMothPayment())
        break;
      case store.forms.initialPayment.name:
        setStore('forms', 'initialPayment', 'value', calcInitialPayment())
        break;
      case store.forms.houseCost.name:
        setStore('forms', 'houseCost', 'value', calcHouseCost())
    }
  }

  const toFloat = (v) => {
    const sanitizedValue = v.replace(/[^\d.,]/g, "")
    const floatValue = parseFloat(sanitizedValue)
    return isNaN(floatValue) ? 0 : floatValue
  }

  const makeBetween = (value, form) => {
    console.log(value, form)
    if (value < form.minVal) {
      return form.minVal
    }

    if (value > form.maxVal) {
      return form.maxVal
    }

    return value
  }

  const handleInitialPayment = (v) => {
    setStore('forms', 'initialPayment', 'value', makeBetween(toFloat(v), store.forms.initialPayment))
    calc()
  }

  const handleHouseCost = (v) => {
    setStore('forms', 'houseCost', 'value', makeBetween(toFloat(v), store.forms.houseCost))
    setStore('forms', 'initialPayment', 'maxVal', store.forms.houseCost.value)
    calc()
  }

  const handleMonthPayment = (v) => {
    setStore('forms', 'monthPayment', 'value', makeBetween(toFloat(v), store.forms.monthPayment))
    calc()
  }

  const handleCreditRate = (v) => {
    setStore('forms', 'rate', 'value', makeBetween(toFloat(v), store.forms.rate))
    calc()
  }

  const handleCreditTerm = (v) => {
    setStore('forms', 'creditTerm', 'value', makeBetween(toFloat(v), store.forms.creditTerm))
    calc()
  }

  const handleSelectedCalc = (v) => {
    setStore('selectedCalc', v)
  }

  return (
    <>
      <div style={{ "text-align": "center" }}>An experiment! Not for commercial use! Not recommended for use as the only source of calculations for credit decisions</div>
      <div className={styles.formsBlock}>
        <Form
          name={store.forms.initialPayment.name}
          isSelectedCalc={store.selectedCalc === store.forms.initialPayment.name}
          calculatable={true}
          handleChange={handleInitialPayment}
          value={store.forms.initialPayment.value}
          step={1}
          minVal={store.forms.initialPayment.minVal}
          maxVal={store.forms.houseCost.value}
          handleSelectedCalc={handleSelectedCalc}
        />
        <Form
          name={store.forms.houseCost.name}
          isSelectedCalc={store.selectedCalc === store.forms.houseCost.name}
          calculatable={true}
          handleChange={handleHouseCost}
          value={store.forms.houseCost.value}
          step={1}
          minVal={store.forms.initialPayment.value}
          maxVal={store.forms.houseCost.maxVal}
          handleSelectedCalc={handleSelectedCalc}
        />
        <Form
          name={store.forms.rate.name}
          isSelectedCalc={store.selectedCalc === store.forms.rate.name}
          calculatable={false}
          handleChange={handleCreditRate}
          value={store.forms.rate.value}
          step={0.1}
          minVal={store.forms.rate.minVal}
          maxVal={store.forms.rate.maxVal}
          handleSelectedCalc={handleSelectedCalc}
        />
        <Form
          name={store.forms.creditTerm.name}
          isSelectedCalc={store.selectedCalc === store.forms.creditTerm.name}
          calculatable={false}
          handleChange={handleCreditTerm}
          value={store.forms.creditTerm.value}
          step={1}
          minVal={store.forms.creditTerm.minVal}
          maxVal={store.forms.creditTerm.maxVal}
          handleSelectedCalc={handleSelectedCalc}
        />
        <Form
          name={store.forms.monthPayment.name}
          isSelectedCalc={store.selectedCalc === store.forms.monthPayment.name}
          calculatable={true}
          handleChange={handleMonthPayment}
          value={store.forms.monthPayment.value}
          step={10}
          minVal={store.forms.monthPayment.minVal}
          maxVal={store.forms.monthPayment.maxVal}
          handleSelectedCalc={handleSelectedCalc}
        />
      </div>
      <Info
        totalCredit={store.totalCredit}
        monthPayment={store.forms.monthPayment.value}
        term={store.forms.creditTerm.value}
      />
      <PaymentSchedule
        monthPayment={store.forms.monthPayment.value}
        totalCredit={store.totalCredit}
        monthRate={store.monthRate}
        creditTerm={store.forms.creditTerm.value}
      />
    </>
  )
}

export default App
