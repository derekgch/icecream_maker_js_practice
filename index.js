
    const inUrl = "http://localhost:3000/ingredients";
    const iceUrl = "http://localhost:3000/ice_creams";
    const ingredients = [];
    const iceCreams = [];


document.addEventListener("DOMContentLoaded", function(event) {



    const iceForm = document.getElementById("ice cream creator");
    const mainPan = document.getElementsByTagName("MAIN")[0];

//   console.log(inUrl);
//   iceCreamForm();

getIcecreams().then(addAll(appToMain))
.then( () => {
    getIngredients().then(addAll(populateIng))
    .then(iceCreamForm)
    .then(submitForm);
});

mainPan.addEventListener('click', event =>{
    if(event.target && event.target.tagName === "BUTTON"){
        switch (event.target.innerText) {
            case "Delete Ice Cream":
             delIceCream(event);
                
                break;
            case "Remove":
            delIng(event);
                break;
        }
    }//if



})//mainPan eventlistener


function submitForm() {
    const submitBtn = document.getElementById('create icecream btn');
    let inputs = iceForm.firstElementChild.getElementsByTagName('input')
    let newIce = {name:"", ingredients:[]};
    let newIng = null;
    submitBtn.addEventListener('click', event => {
        [...inputs].forEach(e => {
            if (e.type === 'text') {
                if(e.id === 'new icecream name'){newIce.name = e.value};
                if(e.id === 'new Ingredient'){newIng = e.value};
            } else if(e.type === 'checkbox') {
                if(e.checked){ newIce.ingredients.push(e.id)}
            }
        })
        if(newIng){
            postIngredient(newIng).then(d => {
                newIng = d; 
                debugger;
                ingredients.push(newIng);
                newIce.ingredients.push(newIng.id);
            }).then(()=>{
                postIcecream(newIce);
            })
        }else{
            postIcecream(newIce);
        }



    })//submitBtn.addEventListener



    
}
    function delIceCream(event) {
        let iceId = event.target.dataset.trainerId;
        let iceCream = document.getElementById(`ice ${iceId}`);
        iceCream.remove();
        deleteIceCream(iceId);
        // debugger; remove from database
    }

    function delIng(event) {
        let ingID = event.target.dataset.id;
        let liToDel = event.target.parentElement;
        let iceId = event.target.parentElement.parentElement.dataset.iceId;
        let changedIce = iceCreams.find(e => {return e.id == iceId;})
        changedIce.ingredients.splice(changedIce.ingredients.indexOf(ingID),1);
        liToDel.remove();
        patchIcecream(changedIce)
        // debugger; remove from database
        
    }

    function populateIng(ing) {
        pushIngredient(ing);
        const ings = document.getElementsByTagName("LI");
        let ingArry = Array.from(ings);
        ingArry.forEach(e => {
            if(e.dataset.inId == ing.id){
                e.innerHTML =`${ing.name}<button class="release" data-id="${ing.id}">Remove</button>` 
            }

        })
    }

    function addAll(fn){
        return function(data) {
            data.forEach(e => fn(e));
        }
    }

  function iceCreamForm(){
    let newForm = document.createElement('form');
    
    let formHtml = `Ice Cream Name:<input type="text" id="new icecream name"></input><br>
    <div id="IngredientList">
    ${genCheckbox()}
    </div><br>
    New Ingredient:<input type="text" id="new Ingredient"><br>
    <button id="create icecream btn">Create Ice Cream</button>`
    newForm.innerHTML = formHtml;
    iceForm.appendChild(newForm); 

  }

  function genCheckbox(){
      return ingredients.map(e => {
        return `<input type="checkbox" id="${e.id}" name="${e.name}" value="${e.name}">
        <label for="${e.name}">${e.name}</label>`
      }).join();
  }

  function appToMain(iceCream){
    pushIceCreams(iceCream);
    let newDiv = document.createElement('div');
    newDiv.className = "card";
    newDiv.dataset.id = iceCream.id;
    newDiv.id = `ice ${iceCream.id}`;
    newDiv.innerHTML = `<p>${iceCream.name}</p>
    <ul data-ice-id="${iceCream.id}">

    </ul>
    <button data-trainer-id="${iceCream.id}">Delete Ice Cream</button>`  
    
    mainPan.appendChild(newDiv);
    let thisUl = newDiv.children[1];

    iceCream.ingredients.forEach(e =>{
        let newLi = document.createElement('li');
        newLi.dataset.inId = e;
        newLi.innerText = "ingredient" + e;
        thisUl.appendChild(newLi);
    })

  }



function postIcecream(newIce, action = "POST") {
    let config ={
        method: action, 
        headers: {
            'Content-Type': 'application/JSON',
            'Data-Type': 'application/JSON'
        },
        body: JSON.stringify({name: newIce.name, ingredients: newIce.ingredients})
      }
      return fetch(iceUrl, config).then(r => r.json())
      
}

function patchIcecream(newIce) {
    let config ={
        method: "PATCH", 
        headers: {
            'Content-Type': 'application/JSON',
            'Data-Type': 'application/JSON'
        },
        body: JSON.stringify({ingredients: newIce.ingredients})
    }
    return fetch(`${iceUrl}/${newIce.id}`, config).then(r => r.json())
      
}



function postIngredient(newIng) {
      let config ={
        method: 'POST', 
        headers: {
            'Content-Type': 'application/JSON',
            'Data-Type': 'application/JSON'
        },
        body: JSON.stringify({name: newIng})
      }
      return fetch(inUrl, config).then(r => r.json())
}

  function getIngredients(){
    return fetch(inUrl).then(r => r.json());
  }

  function deleteIceCream(id){
    return fetch(`${iceUrl}/${id}`, {method: "DELETE"}).then(r => r.json());
  }


  function pushIngredient(e){
    // while(ingredients.length > 0){ingredients.pop()};
    ingredients.push(e)
  }
  function getIcecreams(){
    return fetch(iceUrl).then(r => r.json());
  }

  function pushIceCreams(e){
    iceCreams.push(e)
  }
  
});
