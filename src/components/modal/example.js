import './modal.js'

// example 2:
const modal2 = document.querySelector('#example2')
// -- listen to events
modal2.addEventListener('open', ()=>console.log("modal 2 opened"))
modal2.addEventListener('close', ()=>console.log("modal 2 closed"))
// -- set content element
const contentElm = document.createElement('div')
contentElm.innerHTML = `
  <h3>Example 2</h3>
`
modal2.contentElm = contentElm
