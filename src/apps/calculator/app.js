import {BaseElement, html} from "../../lib/base_element.js"

function calculate(str) {
    let expressionIndex = Math.max(str.lastIndexOf("-"), str.lastIndexOf("+"));
    if (expressionIndex === -1) {
        expressionIndex = Math.max(str.lastIndexOf("*"), str.lastIndexOf("/"));
    }
    if (expressionIndex === -1) {
        const num = Number.parseInt(str.trim());
        if (isNaN(num)) {
            throw Error("not a valid number");
        } else {
            return num;
        }
    } else {
        let leftVal = calculate(str.substring(0, expressionIndex).trim());
        let rightVal = calculate(str.substring(expressionIndex + 1).trim());
        switch (str[expressionIndex]) {
            case "+":
                return leftVal + rightVal;
            case "-":
                return leftVal - rightVal;
            case "*":
                return leftVal * rightVal;
            case "/":
                return leftVal / rightVal;
        }
    }
}

const INITIAL_STATE = {
    result: 0,
    equation: '',
}

class Calculator extends BaseElement {
    constructor() {
        super()
        this.state = {...INITIAL_STATE}
    }
    connectedCallback() {
        this._rerender()
    }
    render(){
        const  numButtons = [0, 1,2,3,4,5,6,7,8,9, '.'].map(num=>{
            return html`<button value=${num} onclick=${this.onButtonClick}>${num}</button> `
         })
        const opButtons = ['+','-','*','/'].map(op=>{
            return html`<button value=${op} onclick=${this.onButtonClick}>${op}</button>`
        })
        const calButton = html`<button value="=" onClick=${this.onCalculate}>Calculate</button>`
        const resetButton = html`<button onClick=${this.onReset}>Reset</button>`

        return html`
          <div class="border">
            <div>${numButtons}</div>
            <div>${opButtons}</div>
            <div>${calButton}${resetButton}</div>
          </div>
          <div class="border">
            <div>${this.state.equation}</div>
            <div>=${this.state.result}</div>
          </div>
        `
    }
    onButtonClick = (e) => {
        this.setState({
            equation: this.state.equation+String(e.target.value),
            result: INITIAL_STATE.result
        })
    }
    onCalculate = (e) => {
        try{
            this.setState({
                result: calculate(this.state.equation),
                equation: ''
            })
        } catch (e) {
            this.setState({
                result: `${this.state.equation} is not a valid equation`,
                equation: ''
            })
        }

    }
    onReset = (e) => {
        this.setState({...INITIAL_STATE})
    }
}

customElements.define('mo-calculator', Calculator)