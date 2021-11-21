import {BaseElement, html} from "../../lib/base_element.js"

const INITIAL_STATE = {
    data: [
        ["Company", "Contact", "Country"],
        ["Centro comercial", "Chang", "Mexico"],
        ["Alfreds Futterkiste", "Anders", "Germany"],
    ],
    showActions: false,
    selectedCell: {
        row: null,
        col: null
    },
    headerCol: false,
    headerRow: false,
}

function createRows(arr){
    return html`
          ${arr.map((rows)=>html`
            <tr>
                ${rows.map(col=>html`
                  <td contenteditable="true">
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
function newEmptyRow(data){
    return Array.from(
        {length: data[0].length},
        _ => ""
    )
}
function colCount(data){
    return data[0].length
}
function rowCount(data){
    return data.length
}
function applyDataAction(data, selectedCell, actionType){
    switch (actionType) {
        case "add-row-before":
            return insertAt(data, newEmptyRow(data), selectedCell.row)
        case "add-row-after":
            return insertAt(data, newEmptyRow(data), selectedCell.row+1)
        case "remove-row":
            return rowCount(data) > 1? removeAt(data, selectedCell.row): data
        case "add-col-before":
            return insertColAt(data, "", selectedCell.col)
        case "add-col-after":
            return insertColAt(data, "", selectedCell.col+1)
        case "remove-col":
            return colCount(data) > 1? removeColAt(data, selectedCell.col): data
    }
}

class DynaTable extends BaseElement {
    constructor() {
        super()
        this.state = {...INITIAL_STATE}
        document.addEventListener('click', this.onDocClick)
    }
    render(){
        const {data, showActions} = this.state
        console.log()
        return html`
            ${(showActions)? html`
              <div onclick="${this.onDataActionClick}">
                <button data-action="remove-row">row remove</button>
                <button data-action="add-row-before">row before</button>
                <button data-action="add-row-after">row after</button>
                <br />
                <button data-action="remove-col">col remove</button>
                <button data-action="add-col-before">col before</button>
                <button data-action="add-col-after">col after</button>
              </div>
            `:null}
            <br />
          <div>
            <table  style="display: inline-table"
                    onclick="${this.onTableClick}">
              ${createRows(data)}
            </table>
          </div>
        `
    }

    onDocClick = (e) =>{
        const eventPath = e.composedPath()
        const outsideTableBoundary = !(eventPath.includes(this.table))
        if (outsideTableBoundary) { this.onOutsideTableClick(e)}
    }
    onOutsideTableClick = () =>{
        this.setState({
            showActions: false,
            selectedCell: {
                row: null,
                col: null
            }
        })
    }
    onTableClick = (e) => {
        const withinTdBoundary = e.target instanceof HTMLTableCellElement
        if(withinTdBoundary){ this.onTdClick(e) }
    }
    onTdClick = (e) => {
        const {target} = e
        const {selectedCell} = this.state
        const tr = target.closest('tr')
        this.setState({
            showActions: true,
            selectedCell: {
                ...selectedCell,
                row: tr.rowIndex,
                col: target.cellIndex,
            }
        })
    }
    onDataActionClick = (e) =>{
        e.stopPropagation()
        const {target} = e
        const actionType = target.getAttribute('data-action')
        if(actionType){
            const {data, selectedCell} = this.state
            const _data = applyDataAction(data, selectedCell, actionType)
            this.setState({ data: _data })
        }
    }

    get table(){
        return this.qs('table')
    }
}

customElements.define('dyna-table', DynaTable)