import icons from 'url:../../img/icons.svg';   // parcel 2

export default class View {
    _parentElement;
    _data;
    _errorMessage;
    _message;

    render(data) {
        if (!data || (Array.isArray(data) && data.length === 0))
            return this.renderError();
        this._data = data;
        const htmlMarkup = this._generateMarkup();
        this._clear();
        this._parentElement.insertAdjacentHTML('beforeend', htmlMarkup);
    }

    update(data) {
        this._data = data;
        const newHtmlMarkup = this._generateMarkup();

        const newDOM = document.createRange().createContextualFragment(newHtmlMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));            // returns nodelist
        const currentElements = Array.from(this._parentElement.querySelectorAll('*'));  // returns nodelist

        newElements.forEach((newElement, i) => {
            const currentElement = currentElements[i];

            // Update changed text. nodeValue returns textContent which we want to change actually
            if (!newElement.isEqualNode(currentElement) && newElement.firstChild?.nodeValue.trim() !== '') {
                currentElement.textContent = newElement.textContent;
            }

            // Update changed attributes
            if (!newElement.isEqualNode(currentElement)) {
                Array.from(newElement.attributes).forEach(attr => currentElement.setAttribute(attr.name, attr.value));
            }
        });
    }

    renderSpinner() {
        const htmlMarkup = `
           <div class="spinner">
             <svg>
               <use href="${icons}#icon-loader"></use>
             </svg>
           </div>`;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', htmlMarkup);
    }

    renderError(message = this._errorMessage) {
        const htmlMarkup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', htmlMarkup);
    }

    renderMessage(message = this._message) {
        const htmlMarkup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', htmlMarkup);
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }
}