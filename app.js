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
   const parentDiv = button.parentElement.parentElement;  //this should be the same as listElement?

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
       lists.splice(parentDiv.id, 1);

       parentDiv.remove();
       deleteListAlert.remove();
       document.body.removeEventListener('click', clickOutsideHandler);
       console.log(lists);
       localStorage.setItem("lists", JSON.stringify(lists));

   });
   currentDeleteListAlert = deleteListAlert;
}






//let lists = ["To Do", "Doing", "In Review", "Done"];

let lists =[{name: 'To Do', data:[]}, {name: 'Doing', data:[]}, {name: 'In Review', data:[]}, {name: 'Done', data:[]}];

const createLists = () => {
    //const main = document.querySelector('main');
    main.innerHTML = '';

    lists.forEach((element, index) => {
        const listElement = document.createElement('div');
        listElement.classList.add('list');
        listElement.id = index;
        const newEl = element;

        listElement.innerHTML = `
            <div class="list-header">
                <span class="list-name">${newEl.name}</span>
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
        let area = null;
        const listName = listElement.querySelector('.list-name');
        
        listName.onclick = () =>{
            editStart();
        };

        const editStart = () => {
            area = document.createElement('textarea');
            area.className = 'edit';
            area.value = listName.innerHTML;
    
            area.onkeydown = (event) => {
                if (event.key == 'Enter') {
                    area.blur();
                }
            };
            area.onblur = () => {
                editEnd();
            };
            listName.replaceWith(area);
            area.focus();
        };

        function editEnd() {
            listName.innerHTML = area.value;
            area.replaceWith(listName);


            // Find the index of the list in the lists array
            const listIndex = lists.findIndex(item => item === newEl);

            // Update the name property of the corresponding list object
            if (listIndex !== -1) {
                lists[listIndex].name = listName.textContent;
                lists[listIndex].data = [...newEl.data]; // Update data with the latest information
                localStorage.setItem("lists", JSON.stringify(lists));
            }
          
          };
        

        //delete list button function 
        const deleteListBtn = listElement.querySelector('.fa-xmark[data-xmark]');
        deleteListBtn.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent the click event from propagating to the document
            deleteList(deleteListBtn);
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
        
        //let data = newEl.data;
       
        let acceptData = () =>{
          //data.push(textArea.value);
          newEl.data.push(textArea.value);
          localStorage.setItem("lists", JSON.stringify(lists));
          createCard();
        };

        let createCard = () =>{
            listMain.innerHTML = "";

            newEl.data.forEach((element, index)=>{
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');
                cardElement.id = index + "C";

                cardElement.innerHTML =`
                <div class="card-name">${element}</div>
                <div class="card-btns">
                <i class="fa-solid fa-trash" data-delete-card-btn></i>
                </div>
                `;

                const cardName = cardElement.querySelector('.card-name');

                let editCard = () => {
                    const cardArea = document.createElement('textarea');
                    cardArea.className = 'edit';
                    cardArea.value = cardName.innerHTML;
        
                    cardArea.onkeydown = (event) => {
                        if (event.key === 'Enter') {
                            cardArea.blur();
                        }
                    };
        
                    cardArea.onblur = () => {
                        editEnd();
                    };
        
                    cardName.replaceWith(cardArea);
                    cardArea.focus();
        
                    function editEnd() {
                        cardName.innerHTML = cardArea.value;
                        cardArea.replaceWith(cardName);
        
                        // Update the card name in your data array
                        newEl.data[index] = cardName.innerHTML;
                        localStorage.setItem("lists", JSON.stringify(lists));
                    }
                };

                cardName.addEventListener('click', editCard);


                const deleteCardBtn = cardElement.querySelector('[data-delete-card-btn]');

                let deleteCard = (e) =>{
                    const cardIndex = newEl.data.indexOf(element);
                    newEl.data.splice(cardIndex, 1);
                    cardElement.remove();
                    localStorage.setItem("lists", JSON.stringify(lists));
                    console.log(newEl.data);
                  };

                 deleteCardBtn.addEventListener('click', deleteCard); 

                
                listMain.appendChild(cardElement);
                
            });///end for each card/data

        };///end create card

        createCard();
        localStorage.setItem("lists", JSON.stringify(lists));
        main.appendChild(listElement);
    });////end for each list loop
}; ///end create list 


// function initializeLocalStorage() {
//     const listsKey = 'lists';

//     // Check if 'lists' key is present in local storage
//     if (!localStorage.getItem(listsKey)) {
//         const defaultLists = [{name: 'To Do', data:[]}, {name: 'Doing', data:[]}, {name: 'In Review', data:[]}, {name: 'Done', data:[]}];
//         localStorage.setItem(listsKey, JSON.stringify(defaultLists));
//     } else {
//         // If 'lists' key exists but is empty, initialize with default values
//         const existingLists = JSON.parse(localStorage.getItem(listsKey));
//         if (!existingLists.length) {
//             const defaultLists = [{name: 'To Do', data:[]}, {name: 'Doing', data:[]}, {name: 'In Review', data:[]}, {name: 'Done', data:[]}];
//             localStorage.setItem(listsKey, JSON.stringify(defaultLists));
//         }
//     }
// }

// // Call the function to initialize local storage if needed
// initializeLocalStorage();




 //screateLists();
//ths function checks if there is local storage, if there isn't it adds 4 defaults to the lists array
// function initializeLocalStorage() {
//     if (!localStorage.getItem('lists')) {
//         const defaultLists = [{name: 'To Do', data:[]}, {name: 'Doing', data:[]}, {name: 'In Review', data:[]}, {name: 'Done', data:[]}];
//         localStorage.setItem('lists', JSON.stringify(defaultLists));
//     }else {
//         // If 'lists' key exists but is empty, initialize with default values
//         const existingLists = JSON.parse(localStorage.getItem('lists'));
//         if (!existingLists.length) {
//             const defaultLists = [{name: 'To Do', data:[]}, {name: 'Doing', data:[]}, {name: 'In Review', data:[]}, {name: 'Done', data:[]}];
//             localStorage.setItem('lists', JSON.stringify(defaultLists));
//         }
//     }   
// }

// // // Call the function to initialize local storage if needed
// initializeLocalStorage();

// (() => {
//     data = JSON.parse(localStorage.getItem("data")) || []
//     console.log(data);
//     //createCard();
//   })();
  
(() => {
    lists = JSON.parse(localStorage.getItem("lists")) || []
    console.log(lists);
    createLists();
  })();



