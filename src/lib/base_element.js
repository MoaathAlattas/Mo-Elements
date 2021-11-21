import {render, html} from './renderer.js'

class BaseElement extends HTMLElement {

    attr = (attribute) => this.getAttribute(attribute);
    qs = (selector) => this.querySelector(selector);
    qsAll = (selector) => this.querySelectorAll(selector);

    constructor() {
        super()
        this.state = {}
    }

    connectedCallback(){
        if (this.render){
            this._rerender()
        }
    }

    setState(state){
        Object.assign(this.state, state)
        this._rerender()
    }

    _rerender(){
        render(this, this.render())
    }
}

export {BaseElement, html}