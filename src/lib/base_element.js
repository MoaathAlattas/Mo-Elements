import {render, html} from './renderer.js'

class BaseElement extends HTMLElement {

    attr = (attribute) => this.getAttribute(attribute);
    qs = (selector) => this.querySelector(selector);
    qsAll = (selector) => this.querySelectorAll(selector);

    constructor() {
        super()
        this.state = {}
    }

    setState(state){
        Object.assign(this.state, state)
        this._rerender()
    }

    _rerender(){
        render(this, this.render())
    }

    render(){
        return this.innerHTML
    }
}

export {BaseElement, html}