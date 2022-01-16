// import _ from 'lodash';

function component() {
    let element = document.createElement('div');
  
   
    element.innerHTML = 'hello world';
  
    return element;
  }
  
  document.body.appendChild(component());