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

        },
        houseCost: {
          value: 1000000,
          name: "House cost",

        },
        creditTerm: {
          value: 20,
          name: "Credit term",

        },
        rate: {
          value: 5.5,
          name: "Credit rate",

        },
        monthPayment: {
          value: 5503.1,
          name: "Month payment",

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

  const calcMothPayment = () => {
    return Math.round(store.totalCredit * store.monthRate * store.totalRate / (store.totalRate - 1) * 100) / 100
  }

  const calcHouseCost = () => {
    return Math.round(store.forms.initialPayment.value + store.forms.monthPayment.value * (store.totalRate) / (store.monthRate * store.totalRate))
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


  const handleInitialPayment = (v) => {
    setStore('forms', 'initialPayment', 'value', toFloat(v))
    calc()
  }

  const handleHouseCost = (v) => {
    setStore('forms', 'houseCost', 'value', toFloat(v))
    calc()
  }

  const handleMonthPayment = (v) => {
    setStore('forms', 'monthPayment', 'value', toFloat(v))
    calc()
  }

  const handleCreditRate = (v) => {
    setStore('forms', 'rate', 'value', toFloat(v))
    calc()
  }

  const handleCreditTerm = (v) => {
    setStore('forms', 'creditTerm', 'value', toFloat(v))
    calc()
  }

  const handleSelectedCalc = (v) => {
    setStore('selectedCalc', v)
  }

  return (
    <>
      <div>test</div>
      <div className={styles.formsBlock}>
        <Form
          name={store.forms.initialPayment.name}
          isSelectedCalc={store.selectedCalc === store.forms.initialPayment.name}
          calculatable={true}
          handleChange={handleInitialPayment}
          value={store.forms.initialPayment.value}
          step={1}
          minVal={0}
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
          maxVal={100000000}
          handleSelectedCalc={handleSelectedCalc}
        />
        <Form
          name={store.forms.rate.name}
          isSelectedCalc={store.selectedCalc === store.forms.rate.name}
          calculatable={false}
          handleChange={handleCreditRate}
          value={store.forms.rate.value}
          step={0.1}
          minVal={0.1}
          maxVal={30}
          handleSelectedCalc={handleSelectedCalc}
        />
        <Form
          name={store.forms.creditTerm.name}
          isSelectedCalc={store.selectedCalc === store.forms.creditTerm.name}
          calculatable={false}
          handleChange={handleCreditTerm}
          value={store.forms.creditTerm.value}
          step={1}
          minVal={1}
          maxVal={35}
          handleSelectedCalc={handleSelectedCalc}
        />
        <Form
          name={store.forms.monthPayment.name}
          isSelectedCalc={store.selectedCalc === store.forms.monthPayment.name}
          calculatable={true}
          handleChange={handleMonthPayment}
          value={store.forms.monthPayment.value}
          step={10}
          minVal={1}
          maxVal={1000000}
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
