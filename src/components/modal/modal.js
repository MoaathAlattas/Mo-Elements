import {BaseElement, html} from "../../lib/base_element.js"

// Constants
const STATE_IS_OPEN = 'data-state-isOpen'
const MODAL_WRAPPER = 'data-wrapper'
const MODAL_CONTENT = 'data-modal'
const OPENER = 'data-opener'
const CLOSER = 'data-closer'
const WRAPPER_CLICK = 'data-wrapper-click'
const MODAL_URL = `data-url`
const MODAL_LOADING = `data-loading`

async function getHtmlFromURL(url){
    const res = await fetch(url)
    const contentHtml = await res.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(contentHtml, 'text/html')
    return doc.documentElement.innerHTML
}

class moModal extends BaseElement {
    // HTMLElement methods
    constructor() {
        super()
        this.state = {
            isOpen: (this.attr(STATE_IS_OPEN) === "true") || false,
            loading: false,
        }
    }
    connectedCallback() {
        this.openerElm?.removeAttribute('disabled')
        this.openerElm?.addEventListener('click', this.onOpenerClick)
        this.modalTemplate = this.qs(`[${MODAL_CONTENT}]`)
        if(this.state.isOpen && this.modalElm) { this.open() }
    }

    // template
    render(){
        const modalElm = (this.state.isOpen) ? html`
          <div onclick=${this.onWrapperClick} data-wrapper>
            <div data-modal>
              ${(this.state.loading)? this.loadingElm : this._modalElm()}
            </div>
          </div>
        ` : null

        return html`
          ${this.openerElm}
          ${modalElm}
        `
    }

    //private Methods
    _modalElm() {
        if (!this.modalTemplate){
            throw new Error('No modal content defined')
        }

        return this.modalTemplate.content.cloneNode(true)
    }

    // public Methods
    async open(){
        if (this.templateUrl) {
            this.modalTemplate = document.createElement('template')
            this.setState({isOpen: true, loading: true})
            this.modalTemplate.innerHTML = await getHtmlFromURL(this.templateUrl)
            this.setState({loading: false})
        } else {
            this.setState({isOpen: true})
        }
        this.closerElm?.addEventListener('click', this.onCloserClick)
        this.dispatchEvent(new CustomEvent('open'))
    }
    close(){
        this.setState({isOpen: false})
        this.dispatchEvent(new CustomEvent('close'))
    }

    // getters
    get openerElm() {
        return this.qs(`[${OPENER}]`)
    }
    get closerElm() {
        return this.qs(`[${CLOSER}]`)
    }
    get wrapperElm(){
        return this.qs(`[${MODAL_WRAPPER}]`)
    }
    get templateUrl(){
        return this._templateUrl || this.attr(MODAL_URL)
    }
    get modalTemplate(){
       return this._modalTemplate
    }
    get disableWrapperClick(){
        return Boolean(this.hasAttribute(WRAPPER_CLICK) || false)
    }
    get loadingElm(){
        if(!this._loadingElm){
            this._loadingElm = this.qs(`[${MODAL_LOADING}]`)
            // throw an error if no content defined
            if (!this._loadingElm){
                return "Loading..."
            }
        }
        
        return this._loadingElm.content.cloneNode(true)
    }

    // setters
    set closerElm(elm){
        this._closerElm = elm
    }
    set wrapperElm(elm){
        this._wrapperElm = elm
    }
    set modalTemplate(elm){
        this._modalTemplate = elm
    }
    set disableWrapperClick(boolean){
        if (boolean === true){
            this.setAttribute(DISABLE_WRAPPER_CLICK_ID, "")
            return;
        }
        this.removeAttribute(DISABLE_WRAPPER_CLICK_ID)
    }
    set templateUrl(url){
        this._templateUrl = url
    }
    set loadingElm(elm){
        return this._loadingElm = elm
    }

    // event listener callbacks
    onOpenerClick = async () => await this.open()
    onCloserClick = () => this.close()
    onWrapperClick = (e) => {
        if(e.target === this.wrapperElm && !this.disableWrapperClick){
            this.close()
        }
    }

}

customElements.define('mo-modal', moModal)