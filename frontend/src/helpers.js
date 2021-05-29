import { main } from './main.js';

// helper: empties an element by removing all children 
export function resetPage(el) {
    let child = el.lastChild;
    while (child) {
        el.removeChild(child);
        child = el.lastChild;
    }
}

// helper: creates an error popup
export function errorPopup(message, div) {
    // change the text of an error if it's already present
    let errorMessage = document.getElementById('error-message');
    if (errorMessage != undefined && errorMessage.innerText != message) {
        errorMessage.innerText = message;
    // create a new error popup 
    } else if (errorMessage == undefined){
        const errorDiv = document.createElement("div");
        errorDiv.setAttribute("class","error-message");
        errorMessage = document.createElement("p");
        errorMessage.setAttribute("id","error-message");
        errorMessage.innerText = message;
        div.prepend(errorDiv);

        errorDiv.appendChild(errorMessage);
        const close = document.createElement('p');
        close.setAttribute('class', 'close-message');
        close.innerText = '✕';
        errorDiv.appendChild(close);
        // ability to close the popup
        close.addEventListener('click', () => {
            div.removeChild(errorDiv);
        })
    }
}

// helper: adjust styling for authenticated users
export function stylingForAuthUser() {
    main.style.removeProperty('align-items');
    main.style.removeProperty('justify-content');
    
    const footer = document.getElementsByTagName('footer')[0];
    footer.style.width = '100%';
    
    const container = document.getElementById('container');
    container.classList.add('align-items');
}

// helper: format local storage variable to a proper list
export function formatList(list) {
    list = list.split(',');
    let temp = [];
    list.forEach(id => {
        temp.push(parseInt(id));
    })
    return temp;
}

// helper: makes comment, like and search result titles
export function convertTitle(num, title) {
    // make the title plural if more than 1 exist
    if (num == 0 || num > 1) {
        return num + ' ' + title + 's';
    } else {
        return num + ' ' + title;
    }
} 

// helper: convert the decimal date to a proper one and format time
export function convertDate(decDate) {
    let temp = new Date(parseInt(decDate) * 1000);
    temp = temp.toString();
    temp = temp.split(' GMT')[0];
    temp = temp.split(' ');
    const date = temp.slice(0,4).join(' ');
    const time = temp.slice(-1);
    return date + ' at ' + time;
}

// helper: create a modal using the variables given 
export function getModal(title, textInputs, numImageInputs, button) {
    const overlay = document.createElement('overlay');
    overlay.setAttribute('class', 'overlay');
    main.appendChild(overlay);

    const modal = document.createElement('div');
    modal.setAttribute('class', 'modal');
    main.appendChild(modal);

    const closeDiv = document.createElement('div');
    modal.appendChild(closeDiv);

    const close = document.createElement('button');
    close.setAttribute('class', 'close-modal');
    close.innerText = '✕';
    closeDiv.appendChild(close);
    // ability to close the div
    closeDiv.addEventListener('click', () => {
        if (overlay.parentNode == main) {
            main.removeChild(overlay);
        }
        main.removeChild(modal);
    })

    const modalForm = document.createElement('form');
    modalForm.setAttribute('class', 'modal-form');
    modal.appendChild(modalForm);

    const formtitle = document.createElement('h3');
    formtitle.innerText = title;
    modalForm.appendChild(formtitle);
    // create a number of inputs according to the list given
    let inputs = []
    textInputs.forEach(input => {
        const formInput = document.createElement('input');
        formInput.setAttribute('name', input.toLowerCase());
        formInput.setAttribute('type', 'text');
        formInput.setAttribute('placeholder', input);
        modalForm.appendChild(formInput);
        inputs.push(formInput);
    })
    // create a number of image inputs 
    for (let i = 0; i < numImageInputs; i++) {
        const image = document.createElement('input');
        image.setAttribute('name', 'image');
        image.setAttribute('type', 'file');
        image.setAttribute('accept', 'image/png');
        modalForm.appendChild(image);
        inputs.push(image);
    }
    // create a button if required
    if (button != null) {
        const formButton = document.createElement('button');
        formButton.innerText = button.text;
        formButton.setAttribute('class', button.class);
        formButton.setAttribute('name', 'submit');
        modalForm.appendChild(formButton);
    }
    // close modal if user clicks on something else
    overlay.addEventListener('click', () => {
        main.removeChild(overlay)
        main.removeChild(modal)
    })

    // put modal components into an object so they can be accessed easily
    const modalObject = {
        'overlay': overlay,
        'modal': modal,
        'form': modalForm
    }

    return modalObject;
}

