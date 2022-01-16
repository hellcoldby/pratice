var inputEl = document.getElementById('input');
var outputEl = document.getElementById('output');

function transform() {
    
  try {
    outputEl.innerHTML = Babel.transform(inputEl.value, {
         presets: ["es2017"] ,
       
    }).code;
  } catch (e) {
    outputEl.innerHTML = 'ERROR: ' + e.message;
  }
}

inputEl.addEventListener('keyup', transform, false);
transform();