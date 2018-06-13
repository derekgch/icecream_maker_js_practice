
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
    getIngredients().then(addAll(populateIng)).then(iceCreamForm);
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

    function delIceCream(event) {
        let iceId = event.target.dataset.trainerId;
        let iceCream = document.getElementById(`ice ${iceId}`);
        iceCream.remove();
        // debugger; remove from database
    }

    function delIng(event) {
        let ingID = event.target.dataset.id;
        let liToDel = event.target.parentElement;
        let iceId = event.target.parentElement.parentElement.dataset.iceId;
        liToDel.remove();
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
    debugger;
    let formHtml
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






  function postIcecream() {
      
  }
  function postIngredient() {
      
}

  function getIngredients(){
    return fetch(inUrl).then(r => r.json());
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
