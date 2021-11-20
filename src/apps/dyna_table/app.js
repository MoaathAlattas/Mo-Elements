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

function createTable(data){
    return html`
        <table>
          ${data.map((rows)=>html`
            <tr>
                ${rows.map(col=>html`
                  <td>${col}</td>
                `)}
            </tr>
          `)}
        </table>
    `
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
            <button onclick=${this.onAddRow}>Add Row</button>
            <button onclick=${this.onRemoveRow}>Remove Row</button>
            ${' '}
            <button onclick=${this.onAddCol}>Add Col</button>
            <button onclick=${this.onRemoveCol}>Remove Col</button>
          </div>
          <div>
            ${createTable(this.state.data)}
          </div>
          
        `
    }

    onAddCol = (e) =>{
        const withNewCols = this.state.data
            .map((row,_,arr)=> {
                row.push("col")
                return row
        })

        this.setState({
            data: withNewCols
        })
    }
    onAddRow = (e) =>{
        const withNewRows = Array.from(
            {length: this.colCount},
            _ => "row"
        )

        this.setState({
            data: [...this.state.data, withNewRows]
        })
    }
    onRemoveCol = (e) =>{
        const withRemovedCols = this.state.data
            .map((row,_,arr)=> {
                row.pop()
                return row
            })

        this.setState({
            data: withRemovedCols
        })
    }
    onRemoveRow = (e) =>{
        const withRemovedRows = this.state.data.slice(0,-1)

        this.setState({
            data: withRemovedRows
        })
    }

    get colCount(){
        return this.state.data[0].length
    }
    get rowCount(){
        return this.state.data.length
    }
}

customElements.define('dyna-table', DynaTable)