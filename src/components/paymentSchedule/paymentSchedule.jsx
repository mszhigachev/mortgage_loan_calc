import styles from './paymentShcedule.module.css'

const PaymentSchedule = (props) => {

    const currencyFormatedValue = (v) => {
        return v.toLocaleString("ru-RU", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        })
    }


    const rows = () => {
        var left = props.totalCredit
        const table = []
        const currentPeriod = new Date()
        currentPeriod.setMonth(currentPeriod.getMonth() - 1)
        for (let i = 1; i < props.creditTerm * 12 + 1; i++) {
            const percent = left * props.monthRate
            const creditBodyPayment = props.monthPayment - percent
            left -= creditBodyPayment

            const featurePeriod = new Date(currentPeriod.setMonth(currentPeriod.getMonth() + 1))
            const year = featurePeriod.getFullYear()
            const month = (featurePeriod.getMonth() + 1) < 10 ? `0${featurePeriod.getMonth() + 1}` : featurePeriod.getMonth() + 1

            table.push(
                <tr id={i}>
                    {/* <td>{i} <br /> (year {(Math.round(i / 12) < 1) ? 1 : Math.round(i / 12)})</td> */}
                    <td>{`${year}-${month}`}</td>
                    <td>{currencyFormatedValue((left > 0) ? props.monthPayment : props.monthPayment + left)}</td>
                    <td>{currencyFormatedValue(creditBodyPayment)}</td>
                    <td>{currencyFormatedValue(percent)}</td>
                    <td>{currencyFormatedValue((left > 0) ? left : 0)}</td>
                </tr>
            )
        }

        return table
    }


    return (
        <>
            <div className={styles.paymentSchedule}>
                <div style={{ "text-align": "center" }}>
                    Payment schedule
                </div>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <tbody>
                            <tr>
                                <th>
                                    Period
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
                            {rows}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default PaymentSchedule