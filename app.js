const closeListBtns = document.querySelectorAll('[data-xmark');
const addCardFooter = document.querySelectorAll('.list-footer');
const newCardInput = document.querySelectorAll('new-card-input');
const addCardBtn = document.querySelectorAll('[data-add-card]');
const closeAddCardBtn = document.querySelectorAll('[data-close-add-card]');
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
    const parentDiv = button.closest('.list');
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
        button.parentElement.parentElement.remove();
        deleteListAlert.remove();
        document.body.removeEventListener('click', clickOutsideHandler);

    });
    currentDeleteListAlert = deleteListAlert;
}

function showAddCardBtn(){

}

closeListBtns.forEach((button) =>
    button.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent the click event from propagating to the document
        deleteList(button);
    })
);

addCardFooter.forEach((footer)=>
    footer.addEventListener("click", showAddCardBtn)
)


