import styles from './info.module.css'

const Info = (props) => {

  const currencyFormatedValue = (v) => {
    return v.toLocaleString("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }

  const totalPayed = () => props.totalCredit + props.totalPercent
  const overpayment = () => props.totalPercent

  const overpaymentPercent = () => Math.round(100 * overpayment() / props.totalCredit * 100) / 100
  return (
    <div className={styles.info}>
      <label>Loan amount <strong>{currencyFormatedValue(props.totalCredit)}</strong></label>
      <label>total paid loan + interest <strong>{currencyFormatedValue(totalPayed())}</strong></label>
      <label>overpayment <strong>{currencyFormatedValue(overpayment())}</strong></label>
      <label><strong>{isNaN(overpaymentPercent) ? overpaymentPercent : 0} %</strong> overpayment over {props.term} years.</label>
    </div>
  )
}


export default Info