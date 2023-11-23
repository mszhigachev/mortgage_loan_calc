import styles from './form.module.css'

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
                <input className={styles.range} type="range" step={props.step} min={props.minVal} max={props.maxVal} value={props.value} onInput={(e) => props.handleChange(e.target.value)} disabled={props.isSelectedCalc} ></input>
            </div>
        </>
    )
}

const Text = (props) => {
    return (
        <>
            <div>
                <input className={styles.inputText} type="text" value={currencyFormatedValue(props.value)} onInput={(e) => { props.handleChange(e.target.value) }} disabled={props.isSelectedCalc}></input>
            </div>
        </>
    )
}

const Radio = (props) => {
    return (
        <>
            <div onClick={() => props.handleSelectedCalc(props.name)}>
                <input name="calc" type="radio" onChange={() => props.handleSelectedCalc(props.name)} checked={props.isSelectedCalc}></input>
                <label>Calc</label>
            </div>
        </>
    )
}

const Form = (props) => {

    return (
        <>
            <div className={styles.form}>
                <div className={styles.formName}>{props.name}</div>
                <Text
                    isSelectedCalc={props.isSelectedCalc}
                    handleChange={props.handleChange}
                    value={props.value}
                />
                <Range
                    step={props.step}
                    minVal={props.minVal}
                    maxVal={props.maxVal}
                    value={props.value}
                    handleChange={props.handleChange}
                    isSelectedCalc={props.isSelectedCalc}
                />
                {
                    props.calculatable ? <Radio
                        name={props.name}
                        handleSelectedCalc={props.handleSelectedCalc}
                        isSelectedCalc={props.isSelectedCalc}

                    /> : null
                }
            </div>
        </>
    )
}


export default Form