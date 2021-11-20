import {BaseElement, html} from "../../lib/base_element.js"

const INITIAL_STATE = {
    data: [
        ["Company", "Contact", "Country"],
        ["Centro comercial", "Chang", "Mexico"],
        ["Alfreds Futterkiste", "Anders", "Germany"],
    ],
    options: {
        headerCol: false,
        headerRow: false,
    },
    actions: {
        show: false,
        rowIndex:0,
        colIndex:0
    }
}

function actionButtons(){
    return html`
        <button data-action="rd">row delete</button>
        <button data-action="rb">row before</button>
        <button data-action="ra">row after</button>
        <br />
        <button data-action="cd">col delete</button>
        <button data-action="cb">col before</button>
        <button data-action="ca">col after</button>
    `
}
function createRows(arr){
    return html`
          ${arr.map((rows)=>html`
            <tr>
                ${rows.map(col=>html`
                  <td>
                    ${col}
                  </td>
                `)}
            </tr>
          `)}
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
            <table onclick="${this.onTableClick}">
              ${createRows(this.state.data)}
            </table>
          </div>
          <br />
          <div onclick="${this.onTdActionClick}">
            ${(this.state.actions.show)? actionButtons():null}
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
        const data = insertColAt(this.state.data, this.newCol(), 0)
        this.setState({ data: data })
    }
    onAddColEnd = (e) =>{
        const data = insertColAt(this.state.data, this.newCol(), this.colCount)
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

    onTableClick = (e) => {
        const {target} = e
        const isTd = target instanceof HTMLTableCellElement

        if(isTd){ this.onTdClick(e) }
    }
    onTdClick = (e) => {
        const {target} = e
        const tr = target.closest('tr')
        this.setState({actions: {
            ...this.state.actions,
            show: !this.state.actions.show,
            rowIndex: tr.rowIndex,
            colIndex: target.cellIndex,
        }})
    }
    onTdActionClick = (e) =>{
        const {target} = e

        const isActionButton = target.hasAttribute('data-action')

        if(isActionButton){
            const {rowIndex, colIndex} = this.state.actions
            let data = []
            switch (target.dataset.action) {
                case 'rd':
                    data = removeAt(this.state.data, rowIndex)
                    break
                case 'rb':
                    data = insertAt(this.state.data, this.newRow(), rowIndex)
                    break
                case 'ra':
                    data = insertAt(this.state.data, this.newRow(), rowIndex+1)
                    break

                case 'cd':
                    data = removeColAt(this.state.data, colIndex)
                    break
                case 'cb':
                    data = insertColAt(this.state.data, this.newCol(), colIndex)
                    break
                case 'ca':
                    data = insertColAt(this.state.data, this.newCol(), colIndex+1)
                    break
            }
            this.setState({
                data: data,
                actions: {
                    ...this.state.actions,
                    show: false
                }
            })
        }
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
            _ => ""
        )
    }
    newCol(){
        return ""
    }
}

customElements.define('dyna-table', DynaTable)