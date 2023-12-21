import styles from './info.module.css'

const Info = (props) => {

  const currencyFormatedValue = (v) => {
    return v.toLocaleString("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }

  const monthToYarsMonthFormatedString = (totalMonths) => {
    const years = Math.floor(totalMonths / 12)
    const yearsString = years > 0 ? `${years} years ` : ''
    const months = totalMonths - years * 12
    const monthsString = months > 0 ? `${totalMonths - years * 12} months` : ''
    return yearsString + monthsString
  }

  const totalPayed = () => props.totalCredit + props.totalPercent
  const overpayment = () => props.totalPercent

  const overpaymentPercent = () => Math.round(100 * overpayment() / props.totalCredit * 100) / 100
  const earlyOverpaymentPercent = () => Math.round(100 * props.earlyPaymentTotalPercent / props.totalCredit * 100) / 100


  return (
    <div className={styles.info}>
      <label>Loan amount <strong>{currencyFormatedValue(props.totalCredit)}</strong></label>
      <label>total paid loan + interest <strong>{currencyFormatedValue(totalPayed())}</strong></label>
      <label>overpayment <strong>{currencyFormatedValue(overpayment())}</strong></label>
      <label><strong>{isNaN(overpaymentPercent) ? overpaymentPercent : 0} %</strong> overpayment over {props.term} years.</label>
      <br />
      {props.isEarlyPaymentEnabled ? <>
        <label>Early payments:</label>
        <label>
          Due to early repayments, the total cost of the loan decreased by <strong>{currencyFormatedValue(props.totalPercent - props.earlyPaymentTotalPercent)}</strong>. The term of the loan will be <strong>{monthToYarsMonthFormatedString(props.earlyTotalTerm)}</strong>, which is {monthToYarsMonthFormatedString(props.term * 12 - props.earlyTotalTerm)} less. The overpayment will be <strong>{currencyFormatedValue(props.earlyPaymentTotalPercent)}</strong>, which is only <strong>{earlyOverpaymentPercent()} %</strong></label>
      </> : null
      }
    </div>
  )
}


export default Info