import {BaseElement, html} from "../../lib/base_element.js"

const INITIAL_STATE = {
    data: [
        ["Company", "Contact", "Country"],
        ["Name 1", "Chang", "Mexico"],
        ["Name 2", "Anders", "Germany"],
    ],
    showActions: false,
    selectedCell: {
        row: null,
        col: null
    },
    headerCol: false,
    headerRow: false,
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
function applyDataAction(data, selectedCell, actionType){
    switch (actionType) {
        case "add-row-before":
            return insertAt(data, newEmptyRow(data), selectedCell.row)
        case "add-row-after":
            return insertAt(data, newEmptyRow(data), selectedCell.row+1)
        case "remove-row":
            return (data.length > 1)
                ? removeAt(data, selectedCell.row)
                : data
        case "add-col-before":
            return insertColAt(data, "", selectedCell.col)
        case "add-col-after":
            return insertColAt(data, "", selectedCell.col+1)
        case "remove-col":
            return (data[0].length > 1)
                ? removeColAt(data, selectedCell.col)
                : data
    }
}

class DynaTable extends BaseElement {
    constructor() {
        super()
        this.state = {...INITIAL_STATE}
        document.addEventListener('click', this.onDocClick)
    }
    render(){
        const {data, showActions, headerRow, headerCol} = this.state
        return html`
          <div onclick="${this.onTableConfigClick}">
              <button value="header-row">Header Row?</button>
              <button value="header-col">Header Col?</button>
            </div>
          <br />
          ${(showActions)? html`
              <div onclick="${this.onDataActionClick}">
                <button value="remove-row" 
                        disabled="${!this.canDeleteRow()||null}">remove selected row</button>
                <button value="add-row-before">add row before</button>
                <button value="add-row-after">add row after</button>
                <br />
                <button value="remove-col"
                        disabled="${!this.canDeleteCol()||null}">remove selected col</button>
                <button value="add-col-before">add col before</button>
                <button value="add-col-after">add col after</button>
              </div>
            `:null}
          <br />
          <div>
            <table style="display: inline-table"
                   onclick="${this.onTableClick}">
              ${data.map((rows, ri)=>html`
                <tr class="${(ri===0 && headerRow)?'header':null}">
                    ${rows.map((col, ci)=>html`
                      <td contenteditable="true"
                          class="${(ci===0 && headerCol)?'header':null}">
                        ${col}
                      </td>
                    `)}
                </tr>
              `)}
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
    onTableConfigClick = (e) =>{
        const {target} = e
        const configName = target.value
        if(configName){
            switch (configName) {
                case "header-row":
                    this.setState({ headerRow: !this.state.headerRow })
                    break;
                case "header-col":
                    this.setState({ headerCol: !this.state.headerCol })
                    break;
            }
        }
    }
    onDataActionClick = (e) =>{
        const actionName = e.target.value
        if(actionName){
            const {data, selectedCell} = this.state
            const _data = applyDataAction(data, selectedCell, actionName)
            this.setState({ data: _data })
        }
    }

    get table(){
        return this.querySelector('table')
    }

    canDeleteRow(){
        return this.state.data.length > 1
    }
    canDeleteCol(){
        return this.state.data[0].length > 1
    }
}

customElements.define('dyna-table', DynaTable)