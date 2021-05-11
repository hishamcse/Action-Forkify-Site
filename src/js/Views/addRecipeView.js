import View from './view.js';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Adding recipe successfully done!! Congratulations';

    _addWindow = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        this._addHandlerOpenWindow();
        this._addHandlerCloseWindow();
    }

    _addHandlerOpenWindow() {
        this._btnOpen.addEventListener('click', this.toggleVisibility.bind(this));          // binding because inside listener, this keyword points to btnOpen
    }

    _addHandlerCloseWindow() {
        this._btnClose.addEventListener('click', this.toggleVisibility.bind(this));         // binding because inside listener, this keyword points to btnClose
        this._overlay.addEventListener('click', this.toggleVisibility.bind(this));
    }

    toggleVisibility() {
        this._addWindow.classList.toggle('hidden');
        this._overlay.classList.toggle('hidden');
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();

            // const newRecipe = Object.values(this).reduce((obj, field) => {
            //     obj[field.name] = field.value;
            //     return obj;
            // }, {});

            // or,
            const formDataArr = [...new FormData(this)];     // here this actually points to parentElement. as we are inside listener,so...
            const newRecipe = Object.fromEntries(formDataArr);      // opposite of Object.entries().
            handler(newRecipe);
        });
    }

    addHandlerServings(handler) {
        this._parentElement.addEventListener('click',e => {
            e.preventDefault();
            const btn = e.target.closest('.btn--update-servings');
            if(!btn) return;
            const newServings = +btn.dataset.update;
            if(newServings === 0) return;
            handler(newServings);
        })
    }
}

export default new AddRecipeView();