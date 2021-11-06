import {BaseElement, html} from "../../lib/base_element.js"

// Constants
const OPEN_ID = 'data-state-isOpen'
const MODAL_WRAPPER_ID = 'data-modal-wrapper'
const MODAL_CONTENT_ID = 'data-modal-content'
const OPENER_ID = 'data-opener'
const CLOSER_ID = 'data-closer'
const DISABLE_WRAPPER_CLICK_ID = 'data-disable-wrapper-click'

class moModal extends BaseElement {
    // HTMLElement methods
    constructor() {
        super()
        this.state = {
            isOpen: (this.attr(OPEN_ID) === "true") || false
        }
    }
    connectedCallback() {
        this.openerElm?.removeAttribute('disabled')
        this.openerElm?.addEventListener('click', this.onOpenerClick)
        if(this.state.isOpen && this.modalElm) { this.open() }
    }

    // template
    render(){
        const modalElm = (this.state.isOpen) ? html`
          <div onclick=${this.onWrapperClick} data-modal-wrapper>
            <div data-modal-content>
              ${this.modalElm}
            </div>
          </div>
        ` : null

        return html`
          ${this.openerElm}
          ${modalElm}
        `
    }

    // public Methods
    open(){
        this.setState({isOpen: true})
        this.closerElm?.addEventListener('click', this.onCloserClick)
        this.dispatchEvent(new CustomEvent('open'))
    }
    close(){
        this.setState({isOpen: false})
        this.wrapperElm?.removeEventListener('click', this.onWrapperClick)
        this.closerElm?.removeEventListener('click', this.onCloserClick)
        this.dispatchEvent(new CustomEvent('close'))
    }

    // getters
    get openerElm() {
        return this.qs(`[${OPENER_ID}]`)
    }
    get closerElm() {
        return this.qs(`[${CLOSER_ID}]`)
    }
    get wrapperElm(){
        return this.qs(`[${MODAL_WRAPPER_ID}]`)
    }
    get modalElm() {
        if(!this._modalElm){
            try{
                this._modalElm = this.qs(`[${MODAL_CONTENT_ID}]`)
            } catch{
                throw new Error('No modal content defined')
            }
        }

        if (this._modalElm instanceof HTMLTemplateElement){
            return this._modalElm.content.cloneNode(true)
        }

        return this._modalElm.cloneNode(true)
    }
    get disableWrapperClick(){
        return Boolean(this.hasAttribute(DISABLE_WRAPPER_CLICK_ID) || false)
    }

    // setters
    set closerElm(elm){
        this._closerElm = elm
    }
    set wrapperElm(elm){
        this._wrapperElm = elm
    }
    set modalElm(elm){
        this._modalElm = elm
    }
    set disableWrapperClick(boolean){
        if (boolean === true){
            this.setAttribute(DISABLE_WRAPPER_CLICK_ID, "")
            return;
        }
        this.removeAttribute(DISABLE_WRAPPER_CLICK_ID)
    }

    // event listener callbacks
    onOpenerClick = () => this.open()
    onCloserClick = () => this.close()
    onWrapperClick = (e) => {
        if(e.target === this.wrapperElm && !this.disableWrapperClick){
            this.close()
        }
    }

}

customElements.define('mo-modal', moModal)