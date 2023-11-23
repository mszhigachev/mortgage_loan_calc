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
        for (let i = 1; i < props.creditTerm * 12 + 1; i++) {
            const percent = left * props.monthRate
            const creditBodyPayment = props.monthPayment - percent
            left -= creditBodyPayment
            table.push(
                <tr>
                    <td>{i} <br /> (year {(Math.round(i / 12) < 1) ? 1 : Math.round(i / 12)})</td>
                    <td>{currencyFormatedValue(props.monthPayment)}</td>
                    <td>{currencyFormatedValue(creditBodyPayment)}</td>
                    <td>{currencyFormatedValue(percent)}</td>
                    <td>{currencyFormatedValue(left)}</td>
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
                                    Month
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