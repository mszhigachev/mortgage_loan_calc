import styles from './paymentShcedule.module.css'

class CustomDate extends Date {
    getLastDateInMonth() {
        return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate()
    }
    toCustomString() {
        const mothString = (this.getMonth() + 1 < 10) ? `0${this.getMonth() + 1}` : `${this.getMonth() + 1}`
        const dateString = (this.getDate() < 10) ? `0${this.getDate()}` : `${this.getDate()}`
        return `${dateString}.${mothString}.${this.getFullYear()}`
    }
    createPaymentDate(date) {
        if (this.getLastDateInMonth() > date) {
            return new CustomDate(this.getFullYear(), this.getMonth(), date)
        }

        return new CustomDate(this.getFullYear(), this.getMonth(), this.getLastDateInMonth())
    }

    getDaysInYear() {
        return ((this.getFullYear() % 4 === 0 && this.getFullYear() % 100 > 0) || this.getFullYear() % 400 == 0) ? 366 : 365;
    }

}

const PaymentSchedule = (props) => {

    const currencyFormatedValue = (v) => {
        return v.toLocaleString("ru-RU", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        })
    }
    const calculateDaysBetween = (startDate, endDate) => {
        const oneDay = 24 * 60 * 60 * 1000
        return Math.round(Math.abs((startDate - endDate) / oneDay))
    }

    const calculateRateBeforePayment = (paymentDate, rate) => {
        // 01.01.2023 - 15.01.2023 = 15
        // 01.02.2023 - 15.02.2023 = 15
        return rate / paymentDate.getDaysInYear() / 100 * paymentDate.getDate()
    }

    const calculateRateAfterPayment = (paymentDate, rate) => {
        // 15.01.2023 - 30.01.2023 = 15
        // 01.01.2023 - 10.01.2023 = 30
        const days = paymentDate.getLastDateInMonth() - paymentDate.getDate()
        return rate / paymentDate.getDaysInYear() / 100 * days
    }

    const rows = () => {
        const table = []
        
        var prevPeriod = new CustomDate()
        const paymentDay = prevPeriod.getDate()
        prevPeriod.setDate(1)

        var left = props.totalCredit
        var toSub = 0
        
        var totalPercent = 0
        for (let i = 1; i < props.creditTerm * 12 + 1; i++) {
            const _currentPeriod = new CustomDate(prevPeriod)
            _currentPeriod.setMonth(_currentPeriod.getMonth() + 1)
            const prevPaymentDate = prevPeriod.createPaymentDate(paymentDay)
            const currentPaymentDate = _currentPeriod.createPaymentDate(paymentDay)
            const days = calculateDaysBetween(prevPaymentDate, currentPaymentDate)

            const percentAfterPrevPayment = left * calculateRateAfterPayment(prevPaymentDate, props.rate)
            const percentBeforePayment = left * calculateRateBeforePayment(currentPaymentDate, props.rate)

            const totalMonthPercent = percentBeforePayment + percentAfterPrevPayment
            totalPercent+=totalMonthPercent
            var creditBodyPayment = props.monthPayment - totalMonthPercent
            if (creditBodyPayment < 0) {
                toSub += creditBodyPayment
                creditBodyPayment = 0
            }
            else if (creditBodyPayment + toSub < 0) {
                toSub += creditBodyPayment
                creditBodyPayment = 0
            }
            else {
                creditBodyPayment += toSub
                toSub = 0
            }

            left -= creditBodyPayment
            const monthPayment = props.monthPayment

            if (left < 0) {
                table.push(
                    <tr id={i}>
                        <td>{currentPaymentDate.toCustomString()}</td>
                        <td>{currencyFormatedValue(monthPayment + left)}</td>
                        <td>{currencyFormatedValue(creditBodyPayment + left)}</td>
                        <td>{currencyFormatedValue(totalMonthPercent)}</td>
                        <td>{currencyFormatedValue(0)}</td>
                    </tr>
                )

                break
            }

            table.push(
                <tr id={i}>
                    <td>{currentPaymentDate.toCustomString()}</td>
                    <td>{currencyFormatedValue(monthPayment)}</td>
                    <td>{currencyFormatedValue(creditBodyPayment)}</td>
                    <td>{currencyFormatedValue(totalMonthPercent)}</td>
                    <td>{currencyFormatedValue((left < 0) ? 0 : left)}</td>
                </tr>
            )

            prevPeriod = _currentPeriod
        }
        props.handleTotalPercent(totalPercent)
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