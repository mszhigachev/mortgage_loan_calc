import styles from './earlyPayment.module.css'

const currencyFormatedValue = (v) => {
    return v.toLocaleString("ru-RU", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })
}

const Range = (props) => {
    return (
        <>
            <div>
                <input className={styles.range} type="range" step={props.step} min={props.minVal} max={props.maxVal} value={props.value} onInput={(e) => props.handleChange(e.target.value)} disabled={props.isDisabled} ></input>
            </div>
        </>
    )
}

const Radio = (props) => {
    return (
        <>
            <div onClick={() => props.handleChange()} disabled={props.isDisabled}>
                <input name = 'earlyPayment' type="radio" onChange={() => props.handleChange()} checked={props.isChecked} disabled={props.isDisabled}></input>
                <label>{props.label}</label>
            </div>
        </>
    )
}

const Text = (props) => {
    return (
        <>
            <div>
                <input className={styles.inputText}  type="text" value={currencyFormatedValue(props.value)} onInput={(e) => { props.handleChange(e.target.value) }} disabled={props.isDisabled}></input>
            </div>
        </>
    )
}

const EarlyPayment = (props) => {
    return (
        <>
            <div className={styles.formName}>{props.name}</div>
            <Text
                value={props.value}
                handleChange={props.handleChange}
                isDisabled={!props.isEnabled}
            />
            <Range
                value={props.value}
                handleChange={props.handleChange}
                minVal={props.minVal}
                maxVal={props.maxVal}
                isDisabled={!props.isEnabled}
            />
            <label>
                <input type='checkbox' checked={props.isEnabled} onChange={props.handleEarlyPaymentEnabled}>
                </input>
                <span>Early payment</span>
            </label>
            <label>
                <Radio
                    label={'reduce payment'}
                    // isDisabled={true}
                    isDisabled={!props.isEnabled}
                    handleChange = {props.handleReducePayment}
                    // isChecked = {false}
                    isChecked = {props.isReducePayment}
                />

                <Radio
                    label={'reduce term'}
                    isDisabled={!props.isEnabled}
                    handleChange = {props.handleReduceTerm}
                    isChecked = {props.isReduceTerm}
                />
            </label>


        </>
    )
}


export default EarlyPayment