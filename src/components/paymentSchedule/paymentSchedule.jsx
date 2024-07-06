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

const currencyFormatedValue = (v) => {
    if (isNaN(v)) {
        return v;
    }

    return v.toLocaleString("ru-RU", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })
}

const TEPayment = (props) => {
    return (
        <span className={styles.earlyTotalPaymentText}>{currencyFormatedValue(props.v)}</span>
    )
}

const EPayment = (props) => {
    return (
        <span className={styles.earlyPaymentText}>+{currencyFormatedValue(props.v)}</span>
    )
}

const EPaymentReducePayment = (props) => {
    return (
        <div className={styles.earplyPaymentWrapper}>
            <span className={styles.earlyReducedPayement}>{currencyFormatedValue(props.reducedPayment)}</span>
            <span className={styles.earlyPaymentText}>+{currencyFormatedValue(props.earlyPaymentValue)}</span>
        </div>
    )
}

const PaymentSchedule = (props) => {


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

    const calculateNewEarlyMonthPayment = (rate, term, creditLeft) => {
        const monthRate = rate / 12 / 100
        const totalRate = (1 + monthRate) ** term
        var mp = Math.round(creditLeft * monthRate * totalRate / (totalRate - 1) * 100) / 100
        return mp
    }

    const rows = () => {
        const table = []

        var prevPeriod = new CustomDate()
        const paymentDay = prevPeriod.getDate()
        prevPeriod.setDate(1)

        var left = props.totalCredit
        var toSub = 0

        var totalPercent = 0

        // Early payment block
        var earlyTotalPercent = 0
        var earlyToSub = 0
        var earlyLeft = props.totalCredit
        var earlyPaymentValue = props.earlyPaymentValue
        var earlyMonthPayment = props.monthPayment + earlyPaymentValue
        var complete = false
        var earlyTotalMonth = 0
        var tmp_month_payment = props.monthPayment
        var showLastRow = false
        for (let i = 1; i < props.creditTerm * 12 + 1; i++) {
            const _currentPeriod = new CustomDate(prevPeriod)
            _currentPeriod.setMonth(_currentPeriod.getMonth() + 1)
            const prevPaymentDate = prevPeriod.createPaymentDate(paymentDay)
            const currentPaymentDate = _currentPeriod.createPaymentDate(paymentDay)
            const days = calculateDaysBetween(prevPaymentDate, currentPaymentDate)

            const percentAfterPrevPayment = left * calculateRateAfterPayment(prevPaymentDate, props.rate)
            const percentBeforePayment = left * calculateRateBeforePayment(currentPaymentDate, props.rate)

            const totalMonthPercent = percentBeforePayment + percentAfterPrevPayment
            totalPercent += totalMonthPercent
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


            // Early payment block


            const earlyPercentAfterPrevPayment = earlyLeft * calculateRateAfterPayment(prevPaymentDate, props.rate)
            const earlyPercentBeforePayment = earlyLeft * calculateRateBeforePayment(currentPaymentDate, props.rate)
            
            var t_earlyPaymentValue = earlyPaymentValue
            if (props.isOveralReducePayment && !props.isReduceTerm){
                t_earlyPaymentValue = earlyPaymentValue + props.monthPayment - calculateNewEarlyMonthPayment(props.rate, props.creditTerm * 12 - earlyTotalMonth, earlyLeft)
            }

            var earlyTotalMonthPercent = earlyPercentBeforePayment + earlyPercentAfterPrevPayment
            earlyMonthPayment = props.isReduceTerm ? earlyMonthPayment : calculateNewEarlyMonthPayment(props.rate, props.creditTerm * 12 - earlyTotalMonth, earlyLeft)
            
            var earlyCreditBodyPayment = earlyMonthPayment + t_earlyPaymentValue - earlyTotalMonthPercent
            if (creditBodyPayment < 0) {
                earlyToSub += earlyCreditBodyPayment
                earlyCreditBodyPayment = 0
            }
            else if (earlyCreditBodyPayment + earlyToSub < 0) {
                earlyToSub += earlyCreditBodyPayment
                earlyCreditBodyPayment = 0
            }
            else {
                earlyCreditBodyPayment += earlyToSub
                earlyToSub = 0
            }

            earlyLeft -= earlyCreditBodyPayment
            //earlyMonthPayment - earlyPaymentValue

            var ePaymentValuePrint = props.isReduceTerm ? <EPayment v={t_earlyPaymentValue} /> : <EPaymentReducePayment reducedPayment={earlyMonthPayment} earlyPaymentValue={t_earlyPaymentValue} />
            var earlyMonthPaymentPrint = props.isReduceTerm ? <TEPayment v={earlyMonthPayment} /> : <TEPayment v={earlyMonthPayment + t_earlyPaymentValue} />
            var earlyCreditBodyPaymentPrint = props.isReduceTerm ? <TEPayment v={earlyCreditBodyPayment - t_earlyPaymentValue} /> : <TEPayment v={earlyCreditBodyPayment} />
            var earlyTotalMonthPercentPrint = <TEPayment v={earlyTotalMonthPercent} />
            var earlyLeftPrint = <TEPayment v={earlyLeft} />

            if (complete || !props.isEarlyPaymentEnabled) {
                ePaymentValuePrint = null
                earlyMonthPaymentPrint = null
                earlyCreditBodyPaymentPrint = null
                earlyTotalMonthPercentPrint = null
                earlyLeftPrint = null
                showLastRow = false
            }
            else if (earlyLeft < 0) {
                complete = true
                showLastRow = true
                ePaymentValuePrint = props.isReduceTerm ? <EPayment v={t_earlyPaymentValue} /> : <EPaymentReducePayment reducedPayment={earlyMonthPayment} earlyPaymentValue={earlyLeft + t_earlyPaymentValue} />
                earlyCreditBodyPaymentPrint = <TEPayment v={earlyCreditBodyPayment + earlyLeft} />
                earlyMonthPaymentPrint = <TEPayment v={earlyMonthPayment + t_earlyPaymentValue + earlyLeft} />
                earlyLeftPrint = <TEPayment v={0} />
                earlyTotalPercent += earlyTotalMonthPercent
                earlyTotalMonth += 1
            }
            else {
                earlyTotalPercent += earlyTotalMonthPercent
                earlyTotalMonth += 1
            }




            if (left < 0) {
                table.push(
                    <tr id={i}>
                        <td style={showLastRow ? { "background": "#d0fff0" } : ""}>{currentPaymentDate.toCustomString()}</td>
                        <td style={showLastRow ? { "background": "#d0fff0" } : ""}><div className={styles.scheduleMonthPayment}>{currencyFormatedValue(props.monthPayment + left)}<div className={styles.earplyPaymentWrapper}>{ePaymentValuePrint}{earlyMonthPaymentPrint}</div></div></td>
                        <td style={showLastRow ? { "background": "#d0fff0" } : ""}>{currencyFormatedValue(creditBodyPayment + left)}<br />{earlyCreditBodyPaymentPrint}</td>
                        <td style={showLastRow ? { "background": "#d0fff0" } : ""}>{currencyFormatedValue(totalMonthPercent)}<br />{earlyTotalMonthPercentPrint}</td>
                        <td style={showLastRow ? { "background": "#d0fff0" } : ""}>{currencyFormatedValue(0)}<br />{earlyLeftPrint}</td>
                    </tr>
                )

                break
            }


            table.push(
                <tr id={i}>
                    <td style={showLastRow ? { "background": "#d0fff0" } : ""}>{currentPaymentDate.toCustomString()}</td>
                    <td style={showLastRow ? { "background": "#d0fff0" } : ""}><div className={styles.scheduleMonthPayment}>{currencyFormatedValue(props.monthPayment)}<div className={styles.earplyPaymentWrapper}>{ePaymentValuePrint}{earlyMonthPaymentPrint}</div></div></td>
                    <td style={showLastRow ? { "background": "#d0fff0" } : ""}>{currencyFormatedValue(creditBodyPayment)}<br />{earlyCreditBodyPaymentPrint}</td>
                    <td style={showLastRow ? { "background": "#d0fff0" } : ""}>{currencyFormatedValue(totalMonthPercent)}<br />{earlyTotalMonthPercentPrint}</td>
                    <td style={showLastRow ? { "background": "#d0fff0" } : ""}>{currencyFormatedValue((left < 0) ? 0 : left)}<br />{earlyLeftPrint}</td>
                </tr>
            )

            prevPeriod = _currentPeriod
        }
        props.handleTotalPercent(totalPercent)
        props.handleEarlyPaymentPercent(earlyTotalPercent)
        props.handleEarlyTotalTerm(earlyTotalMonth)
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