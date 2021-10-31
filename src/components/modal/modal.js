// Constants
const OPEN_ID = 'data-open'
const MODAL_WRAPPER_ID = 'data-modal-wrapper'
const MODAL_CONTENT_ID = 'data-modal-content'
const OPENER_ID = 'data-opener'
const CLOSER_ID = 'data-closer'
const DISABLE_WRAPPER_CLICK_ID = 'data-disable-wrapper-click'

// Methods
function createModal(content){
    const wrapper = document.createElement('div')
    const modal = document.createElement('div')
    wrapper.setAttribute(MODAL_WRAPPER_ID, "")
    modal.setAttribute(MODAL_CONTENT_ID, "")
    modal.appendChild(content)
    wrapper.appendChild(modal)
    return [wrapper, modal]
}

class moModal extends HTMLElement {
    // initials
    _isOpen = false
    _disableWrapperClick = false
    _openerElm = null
    _closerElm = null
    _contentElm = null
    _wrapperElm = null
    _modalElm = null

    // HTMLElement methods
    constructor() {
        super()
        this._openerElm = this.querySelector(`[${OPENER_ID}]`)
        this._contentElm = this.querySelector(`[${MODAL_CONTENT_ID}]`)
    }
    connectedCallback() {
        this.openerElm?.removeAttribute('disabled')
        this.openerElm?.addEventListener('click', this.onOpenerClick)
        if(this.isOpen && this._contentElm) { this.open() }
    }

    // public Methods
    open(){
        [this.wrapperElm, this.modalElm] = createModal(this.contentElm)
        this.appendChild(this.wrapperElm)
        this.isOpen = true
        if (!this.disableWrapperClick){
            this.wrapperElm?.addEventListener('click', this.onWrapperClick)
        }
        this.closerElm = this.modalElm.querySelector(`[${CLOSER_ID}]`)
        this.closerElm?.addEventListener('click', this.onCloserClick)
        this.dispatchEvent(new CustomEvent('open'))
    }
    close(){
        if (!this.disableWrapperClick) {
            this.wrapperElm?.removeEventListener('click', this.onWrapperClick)
        }
        this.closerElm?.removeEventListener('click', this.onCloserClick)
        this.wrapperElm?.remove()
        this.isOpen = false
        this.modalElm.innerHTML = null
        this.wrapperElm.innerHTML = null
        this.dispatchEvent(new CustomEvent('close'))
    }

    // getters
    get openerElm() {
        return this._openerElm
    }
    get closerElm() {
        return this._closerElm
    }
    get contentElm() {
        if(!this._contentElm){
            throw new Error('No modal content defined')
        }

        if (this._contentElm instanceof HTMLTemplateElement){
            return this._contentElm?.content.cloneNode(true)
        }

        return this._contentElm.cloneNode(true)
    }
    get wrapperElm(){
        return this._wrapperElm
    }
    get modalElm(){
        return this._modalElm
    }
    get isOpen(){
        return Boolean(this.hasAttribute(OPEN_ID) || this._isOpen)
    }
    get disableWrapperClick(){
        return Boolean(this.hasAttribute(DISABLE_WRAPPER_CLICK_ID) || this._disableWrapperClick)
    }

    // setters
    set closerElm(elm){
        this._closerElm = elm
    }
    set contentElm(elm){
        this._contentElm = elm
    }
    set wrapperElm(elm){
        this._wrapperElm = elm
    }
    set modalElm(elm){
        this._modalElm = elm
    }
    set isOpen(boolean){
        if (boolean !== true){
            this.removeAttribute(OPEN_ID)
            return;
        }
        this.setAttribute(OPEN_ID, "")
    }
    set disableWrapperClick(boolean){
        if (boolean !== true){
            this.removeAttribute(DISABLE_WRAPPER_CLICK_ID)
            return;
        }
        this.setAttribute(DISABLE_WRAPPER_CLICK_ID, "")
    }

    // event listener callbacks
    onOpenerClick = () => { this.open() }
    onCloserClick = () =>{this.close()}
    onWrapperClick = (e) => {
        if(e.target === this.wrapperElm){
            this.close()
        }
    }

}

customElements.define('mo-modal', moModal)