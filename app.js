//const closeListBtns = document.querySelectorAll('[data-xmark]');
//const addCardFooter = document.querySelectorAll('.list-footer');
////const newCardInput = document.querySelectorAll('new-card-input');
//const addCardBtn = document.querySelectorAll('[data-add-card]');
//const closeAddCardBtn = document.querySelectorAll('[data-close-add-card]');
const main = document.querySelector('main');

let currentDeleteListAlert;


function deleteList(button){
    //Close the currently open deleteListAlert if it exists
   if (currentDeleteListAlert) {
        currentDeleteListAlert.remove();
        document.removeEventListener('click', clickOutsideHandler);
    }
   const deleteListAlert = document.createElement("div");
   const deleteListBtn = document.createElement("button");
   const parentDiv = button.parentElement.parentElement;  //closest('.list');  ///want to check to see if .parentElement would work
   deleteListAlert.classList.add("delete-list-alert");
   deleteListAlert.textContent = "Are you sure you want to delete this list?";
   deleteListBtn.classList.add("delete-list-btn");
   deleteListBtn.textContent = "Delete";
   deleteListAlert.appendChild(deleteListBtn);
   parentDiv.appendChild(deleteListAlert);

   function isClickInside(event, element) {
       return event.target === element || element.contains(event.target);
   }
   function clickOutsideHandler(event) {
       if (!isClickInside(event, deleteListAlert)) {
           deleteListAlert.remove();
           document.body.removeEventListener('click', clickOutsideHandler);
       }
   }

   document.body.addEventListener('click', clickOutsideHandler);
   deleteListBtn.addEventListener("click", function(){
       parentDiv.remove();
    //button.parentElement.parentElement.remove();
       deleteListAlert.remove();
       document.body.removeEventListener('click', clickOutsideHandler);
   });
   currentDeleteListAlert = deleteListAlert;
}

///////working delete button but weird//////////

// main.addEventListener("click", (event) => {
//     const target = event.target;

//     if (target.matches('.fa-xmark[data-xmark]')) {
//         event.stopPropagation(); // Prevent the click event from propagating to the document
//         deleteList(target);
//     }
// });

/////////not currently working
// closeListBtns.forEach((button) =>
//    button.addEventListener("click", (event) => {
//        event.stopPropagation(); // Prevent the click event from propagating to the document
//        deleteList(button);
//    })
// );







let lists = ["To Do", "Doing", "In Review", "Done"];

const createLists = () => {
    //const main = document.querySelector('main');
    main.innerHTML = '';

    lists.forEach((element, index) => {
        const listElement = document.createElement('div');
        listElement.classList.add('list');
        listElement.id = index;

        listElement.innerHTML = `
            <div class="list-header">
                <span class="list-name">${element}</span>
                <i class="fa-solid fa-xmark" data-xmark></i>
            </div>
            <div class="list-main"></div>
            <div class="new-card-input hide">
                <form>
                    <textarea name="" id="" rows="5" placeholder="Enter a title for this card..."></textarea>
                    <div class="flexbox">
                        <button type="submit" data-add-card>Add a Card</button> 
                        <i class="fa-solid fa-xmark" data-close-add-card></i>
                    </div>
                </form>
            </div>
            <div class="list-footer">
                <i class="fa-solid fa-plus"></i>
                <div class="add-card">Add a Card</div>
            </div>
        `;

        //make the list name editable on click
        const listName = listElement.querySelector('.list-name');
        listName.addEventListener('click',(e)=>{
            let field = e.target;
            field.contentEditable = field.contentEditable === true ? false : true;
        });


        //delete list button function 
        const closeListBtn = listElement.querySelector('.fa-xmark[data-xmark]');
        closeListBtn.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent the click event from propagating to the document
            deleteList(closeListBtn);
        });

        //footer and add card close toggle
        const listFooter = listElement.querySelector('.list-footer');
        const newCardInput = listElement.querySelector('.new-card-input');
        const closeAddCardBtn = listElement.querySelector('[data-close-add-card]');

        const toggleVisibility = () => {
            listElement.classList.toggle('collapsed');
            listFooter.classList.toggle('hide');
            newCardInput.classList.toggle('hide');
        };

        listFooter.addEventListener("click", toggleVisibility);
        closeAddCardBtn.addEventListener("click", toggleVisibility);

        //form and add card button
        const listMain = listElement.querySelector('.list-main');
        const form = listElement.querySelector('form');
        const textArea = listElement.querySelector('textarea');


        form.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              formValidation();
            }
          });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            formValidation();
          });
        
        let formValidation = () => {
            if (textArea.value === "") {
              toggleVisibility(); 
            } else {
              acceptData();
              textArea.value = '';
            }
          };
        
        let data = [];
        
        let acceptData = () =>{
          data.push(textArea.value);
          localStorage.setItem("data", JSON.stringify(data));
          console.log(data);
          createCard();
        };

        let createCard = () =>{
            listMain.innerHTML = "";

            data.forEach((element, index)=>{
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');
                cardElement.id = index + "C";

                cardElement.innerHTML =`
                <div class="card-name">${element}</div>
                <div class="card-btns">
                <i class="fa-solid fa-pen"></i>
                <i class="fa-solid fa-trash" data-delete-card-btn></i>
                </div>
                `;

                const deleteCardBtn = cardElement.querySelector('[data-delete-card-btn]');

                let deleteCard = (e) =>{
                    cardElement.remove();
                    data.splice(e.id, 1);
                    localStorage.setItem("data", JSON.stringify(data));
                    console.log(data);
                  };

                 deleteCardBtn.addEventListener('click', deleteCard); 

                let editCard = (e) =>{

                };


                listMain.appendChild(cardElement);
            });///end for each card/data


            
        };///end create card

        

        main.appendChild(listElement);
    });////end for each list loop
}; ///end create list 

// const createLists = () =>{
//     main.innerHTML = '';
//     lists.map((element,index)=>{
//         return(main.innerHTML +=`
//             <div class="list" id ="${index}">
//                 <div class="list-header">
//                     <span>${element}</span>
//                     <i class="fa-solid fa-xmark" data-xmark></i>
//                 </div>
//                 <div class="list-main"></div>
//                 <div class="new-card-input hide">
//                 <form>
//                     <textarea name="" id="" rows="5" placeholder="Enter a title for this card..."></textarea>
//                     <div class="flexbox">
//                         <button type="submit" data-add-card>Add a Card</button> 
//                         <i class="fa-solid fa-xmark"></i>
//                     </div>
//                 </form>
//                 </div>
//                 <div class="list-footer">
//                     <i class="fa-solid fa-plus" data-close-add-card></i>
//                     <div class="add-card">Add a Card</div>
//                 </div>
//             </div>
//         `
//         );
//     });///end of map function
// };





createLists();