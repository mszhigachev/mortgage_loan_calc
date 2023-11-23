import styles from './info.module.css'
const Info = (props) => {

  const currencyFormatedValue = (v) => {
    return v.toLocaleString("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }
  const totalPayed = () => props.monthPayment * props.term * 12
  const overpayment = () => props.monthPayment * props.term * 12 - props.totalCredit
  const overpaymentPercent = () => Math.round(100 * overpayment() / props.totalCredit * 100) / 100
  return (
    <div className={styles.info}>
      <label>Loan amount <strong>{currencyFormatedValue(props.totalCredit)}</strong></label>
      <label>total paid loan + interest <strong>{currencyFormatedValue(totalPayed())}</strong></label>
      <label>overpayment <strong>{currencyFormatedValue(overpayment())}</strong></label>
      <label><strong>{overpaymentPercent} %</strong> overpayment over {props.term} years.</label>
    </div>
  )
}


export default Info