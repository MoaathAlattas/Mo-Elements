import {BaseElement, html} from "../../lib/base_element.js"

const INITIAL_STATE = {
    data: [
        ["Company", "Contact", "Country"],
        ["Centro comercial Moctezuma", "Francisco Chang", "Mexico"],
        ["Alfreds Futterkiste", "Maria Anders", "Germany"],
    ],
    options: {
        headerCol: false,
        headerRow: false,
    }
}

function createTable(arr){
    return html`
        <table>
          ${arr.map((rows)=>html`
            <tr>
                ${rows.map(col=>html`
                  <td>${col}</td>
                `)}
            </tr>
          `)}
        </table>
    `
}

function insertAt(arr, elm, i){
    const _arr = [...arr]
    _arr.splice( i, 0, elm)
    return _arr
}
function removeAt(arr, i){
    const _arr = [...arr]
    _arr.splice(i, 1)
    return _arr
}

function insertColAt(arr, elm, i){
    return arr.map(row=> insertAt(row, elm, i))
}

function removeColAt(arr, i){
    return arr.map(row=> removeAt(row, i))
}

class DynaTable extends BaseElement {
    constructor() {
        super()
        this.state = {...INITIAL_STATE}
    }
    connectedCallback() {
        this._rerender()
    }
    render(){
        return html`
          <div>
            <button onclick=${this.onAddRowStart}>Add Row (Start)</button>
            <button onclick=${this.onRemoveRowStart}>Remove Row (Start)</button>
            <button onclick=${this.onAddColStart}>Add Col (Start)</button>
            <button onclick=${this.onRemoveColStart}>Remove Col (Start)</button>
          </div>
          <div>
            <button onclick=${this.onAddRowEnd}>Add Row (End)</button>
            <button onclick=${this.onRemoveRowEnd}>Remove Row (End)</button>
            <button onclick=${this.onAddColEnd}>Add Col (End)</button>
            <button onclick=${this.onRemoveColEnd}>Remove Col (End)</button>
          </div>
          <br />
          <div>
            ${createTable(this.state.data)}
          </div>
        `
    }

    onAddRowStart = (e) =>{
        const data = insertAt(this.state.data, this.newRow(), 0)
        this.setState({data: data})
    }
    onAddRowEnd =  (e) =>{
        const data = insertAt(this.state.data, this.newRow(), this.rowCount)
        this.setState({data: data})
    }
    onRemoveRowStart = (e) =>{
        const data = removeAt(this.state.data, 0)
        this.setState({data: data})
    }
    onRemoveRowEnd = (e) =>{
        const data = removeAt(this.state.data, this.rowCount-1)
        this.setState({data: data})
    }

    onAddColStart = (e) =>{
        const data = insertColAt(this.state.data, "col", 0)
        this.setState({ data: data })
    }
    onAddColEnd = (e) =>{
        const data = insertColAt(this.state.data, "col", this.colCount)
        this.setState({ data: data })
    }
    onRemoveColStart = (e) =>{
        const data = removeColAt(this.state.data, 0)
        this.setState({ data: data })
    }
    onRemoveColEnd = (e) =>{
        const data = removeColAt(this.state.data, this.colCount-1)
        this.setState({ data: data })
    }

    get colCount(){
        return this.state.data[0].length
    }
    get rowCount(){
        return this.state.data.length
    }

    newRow(){
        return Array.from(
            {length: this.colCount},
            _ => "row"
        )
    }
}

customElements.define('dyna-table', DynaTable)