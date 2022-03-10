// import './style.css';
// import Icon from './icon.jpg'
// import printMe from "./print.js";

class Book {
    title = "a";
    static cover;

    test() {
        let a = 1;
        let b = 2;
        const c = a + b;
        console.log(c);
    }
}

// const a = new Book();
// a.title = "The Song of ice and fire";

async function foo() {
    await new Book();
}
foo();

const array = [1, 2, 3];

Array.from(array, (x) => x + x);

// const myIcon = new Image();
// myIcon.src = Icon;

// function component() {
// let element = document.createElement('div');
// element.innerHTML = 'hello world';
// element.classList.add('hello');
// element.appendChild(myIcon);

// const btn = document.createElement('button');
// btn.innerHTML = 'Click me and check the console!';
// btn.onclick = printMe;
// element.appendChild(btn);

//   return element;
// }

// document.body.appendChild(component());
