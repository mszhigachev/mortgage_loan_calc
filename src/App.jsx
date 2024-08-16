import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import styles from "./app.module.css";
import Form from "./components/form/Form";
import Info from "./components/info/Info";
import PaymentSchedule from "./components/paymentSchedule/paymentSchedule";
import EarlyPayment from "./components/earlyPayment/earlyPayment";
import Charts from "./components/charts/Charts";
import { debounce } from "lodash";

function App() {

  const [store, setStore] = createStore({
    totalPercent: 0,
    selectedCalc: "Month payment",
    isEarlyPaymentEnabled: false,
    earlyPaymentTotalPercent: 0,
    isReducePayment: false,
    isReduceTerm: true,
    earlyTotalTerm: 0,
    isOveralReducePayment: false,
    chartLabels: [],
    chartData: [],
    forms: {
      initialPayment: {
        value: 200000,
        name: "Initial payment",
        minVal: 0,
        maxVal: 100000000,
      },
      houseCost: {
        value: 1000000,
        name: "House cost",
        minVal: 1,
        maxVal: 100000000,
      },
      creditTerm: {
        value: 20,
        name: "Credit term",
        minVal: 1,
        maxVal: 35,
      },
      rate: {
        value: 5.5,
        name: "Credit rate",
        minVal: 0.1,
        maxVal: 99,
      },
      monthPayment: {
        value: 5503.1,
        name: "Month payment",
        minVal: 0,
        maxVal: 10000000,
      },
      earlyPayment: {
        value: 20000,
        name: "Early payment",
        minVal: 0,
        maxVal: 10000000,
      },
    },
    get monthRate() {
      return this.forms.rate.value / 12 / 100;
    },
    get totalRate() {
      return (1 + this.monthRate) ** (this.forms.creditTerm.value * 12);
    },
    get totalCredit() {
      return this.forms.houseCost.value - this.forms.initialPayment.value;
    },
    get dayRate() {
      const oneDay = 24 * 60 * 60 * 1000;
      const startDate = new Date();
      const endDate = new Date(
        startDate.getFullYear() + this.creditTerm,
        startDate.getMonth(),
        startDate.getDate()
      );
      return Math.round(Math.abs((startDate - endDate) / oneDay));
    },
  });

  const saveStore = () => {
    const storeToSave = { forms: store.forms };
    storeToSave.selectedCalc = store.selectedCalc;
    storeToSave.isEarlyPaymentEnabled = store.isEarlyPaymentEnabled;
    storeToSave.isReducePayment = store.isReducePayment;
    storeToSave.isReduceTerm = store.isReduceTerm;
    storeToSave.isOveralReducePayment = store.isOveralReducePayment;
    localStorage.setItem(
      "mortgageCalculatorStore",
      JSON.stringify(storeToSave)
    );
  };

  const loadStore = () => {
    const storedData = localStorage.getItem("mortgageCalculatorStore");

    if (storedData) {
      const storeCopy = store;
      try {
        const data = JSON.parse(storedData);
        setStore("forms", data.forms);
        setStore("selectedCalc", data.selectedCalc);
        setStore("isEarlyPaymentEnabled", data.isEarlyPaymentEnabled);
        setStore("isReducePayment", data.isReducePayment);
        setStore("isReduceTerm", data.isReduceTerm);
        setStore("isOveralReducePayment", data.isOveralReducePayment);
      } catch (error) {
        setStore(storeCopy);
        console.error(error);
      }
    }
  };

  loadStore();

  const calcMothPayment = () => {
    return (
      Math.round(
        ((store.totalCredit * store.monthRate * store.totalRate) /
          (store.totalRate - 1)) *
        100
      ) / 100
    );
  };

  const calcHouseCost = () => {
    return Math.round(
      store.forms.initialPayment.value +
      (store.forms.monthPayment.value * (store.totalRate - 1)) /
      (store.monthRate * store.totalRate)
    );
  };

  const calcInitialPayment = () => {
    const initialPayment =
      store.forms.houseCost.value -
      (store.forms.monthPayment.value * (store.totalRate - 1)) /
      (store.monthRate * store.totalRate);
    return initialPayment < 0 ? 0 : initialPayment;
  };

  function calc() {
    switch (store.selectedCalc) {
      case store.forms.monthPayment.name:
        setStore("forms", "monthPayment", "value", calcMothPayment());
        break;
      case store.forms.initialPayment.name:
        setStore("forms", "initialPayment", "value", calcInitialPayment());
        break;
      case store.forms.houseCost.name:
        setStore("forms", "houseCost", "value", calcHouseCost());
    }
    saveStore();
  }

  const toFloat = (v) => {
    const sanitizedValue = v.replace(/[^\d.,]/g, "").replace(",", ".");
    const floatValue = parseFloat(sanitizedValue);
    return isNaN(floatValue) ? 0 : floatValue;
  };

  const makeBetween = (value, form) => {
    if (value < form.minVal) {
      return form.minVal;
    }

    if (value > form.maxVal) {
      return form.maxVal;
    }

    return value;
  };

  const handleInitialPayment = (v) => {
    setStore(
      "forms",
      "initialPayment",
      "value",
      makeBetween(toFloat(v), store.forms.initialPayment)
    );
    calc();
  };

  const handleHouseCost = (v) => {
    setStore(
      "forms",
      "houseCost",
      "value",
      makeBetween(toFloat(v), store.forms.houseCost)
    );
    // setStore('forms', 'initialPayment', 'maxVal', store.forms.houseCost.value)
    calc();
  };

  const handleMonthPayment = (v) => {
    setStore(
      "forms",
      "monthPayment",
      "value",
      makeBetween(toFloat(v), store.forms.monthPayment)
    );
    calc();
  };

  const handleCreditRate = (v) => {
    setStore(
      "forms",
      "rate",
      "value",
      makeBetween(toFloat(v), store.forms.rate)
    );
    calc();
  };

  const handleCreditTerm = (v) => {
    setStore(
      "forms",
      "creditTerm",
      "value",
      makeBetween(toFloat(v), store.forms.creditTerm)
    );
    calc();
  };

  const handleSelectedCalc = (v) => {
    setStore("selectedCalc", v);
  };

  const handleTotalPercent = (v) => {
    setStore("totalPercent", v);
  };

  const handleEarlyPayment = (v) => {
    var payment = toFloat(v);
    if (payment >= store.totalCredit) {
      payment = store.totalCredit;
    }
    setStore(
      "forms",
      "earlyPayment",
      "value",
      makeBetween(payment, store.forms.earlyPayment)
    );
  };

  const handleEarlyPaymentEnabled = () => {
    setStore("isEarlyPaymentEnabled", !store.isEarlyPaymentEnabled);
    calc();
  };

  const handleReducePayment = () => {
    setStore("isReducePayment", true);
    setStore("isReduceTerm", false);
    saveStore();
  };
  const handleReduceTerm = () => {
    setStore("isReducePayment", false);
    setStore("isReduceTerm", true);
    saveStore();
  };

  const handleEarlyPaymentPercent = (v) => {
    setStore("earlyPaymentTotalPercent", v);
    saveStore();
  };

  const handleEarlyTotalTerm = (v) => {
    setStore("earlyTotalTerm", v);
    saveStore();
  };

  const handleOveralReducePayment = () => {
    setStore("isOveralReducePayment", !store.isOveralReducePayment);
    saveStore();
  };
  const handleChartData = (dt) => {
    setStore("chartLabels", dt["months"]);
    setStore("chartData", dt["payments"]);
  };
  // const labels = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  // ];
  // const data = [[10,66], [20,22], [12,16], [39,40], [10,11], [40,45], [39,31]];
  return (
    <>
      <div style={{ "text-align": "center" }}>
        An experiment! Not for commercial use! Not recommended for use as the
        only source of calculations for credit decisions
      </div>
      <div className={styles.formAndCharts}>
        <div>
          <div className={styles.formsBlock}>
            <Form
              name={store.forms.initialPayment.name}
              isSelectedCalc={
                store.selectedCalc === store.forms.initialPayment.name
              }
              calculatable={true}
              handleChange={handleInitialPayment}
              value={store.forms.initialPayment.value}
              step={10000}
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
              step={10000}
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
              isSelectedCalc={
                store.selectedCalc === store.forms.creditTerm.name
              }
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
              isSelectedCalc={
                store.selectedCalc === store.forms.monthPayment.name
              }
              calculatable={true}
              handleChange={handleMonthPayment}
              value={store.forms.monthPayment.value}
              step={1000}
              minVal={store.forms.monthPayment.minVal}
              maxVal={store.forms.monthPayment.maxVal}
              handleSelectedCalc={handleSelectedCalc}
            />
          </div>

          <div className={styles.formsBlock}>
            <EarlyPayment
              value={store.forms.earlyPayment.value}
              handleChange={handleEarlyPayment}
              minVal={store.forms.earlyPayment.minVal}
              maxVal={store.forms.earlyPayment.maxVal}
              name={store.forms.earlyPayment.name}
              handleEarlyPaymentEnabled={handleEarlyPaymentEnabled}
              isEnabled={store.isEarlyPaymentEnabled}
              handleReducePayment={handleReducePayment}
              isReducePayment={store.isReducePayment}
              handleReduceTerm={handleReduceTerm}
              isReduceTerm={store.isReduceTerm}
              handleOveralReducePayment={handleOveralReducePayment}
              isOveralReducePayment={store.isOveralReducePayment}
            />
          </div>
        </div>
        <div>
          <Charts
            labels={store.chartLabels}
            data={store.chartData}
            isEarlyPaymentEnabled={store.isEarlyPaymentEnabled}
          />
        </div>
      </div>
      <Info
        totalCredit={store.totalCredit}
        totalPercent={store.totalPercent}
        term={store.forms.creditTerm.value}
        earlyPaymentTotalPercent={store.earlyPaymentTotalPercent}
        isEarlyPaymentEnabled={store.isEarlyPaymentEnabled}
        earlyTotalTerm={store.earlyTotalTerm}
      />

      <div>
        <PaymentSchedule
          monthPayment={store.forms.monthPayment.value}
          totalCredit={store.totalCredit}
          monthRate={store.monthRate}
          creditTerm={store.forms.creditTerm.value}
          rate={store.forms.rate.value}
          dayRate={store.dayRate}
          handleTotalPercent={handleTotalPercent}
          isEarlyPaymentEnabled={store.isEarlyPaymentEnabled}
          earlyPaymentValue={store.forms.earlyPayment.value}
          isReduceTerm={store.isReduceTerm}
          handleEarlyPaymentPercent={handleEarlyPaymentPercent}
          handleEarlyTotalTerm={handleEarlyTotalTerm}
          isOveralReducePayment={store.isOveralReducePayment}
          handleChartData={handleChartData}
        />
      </div>
    </>
  );
}

export default App;
