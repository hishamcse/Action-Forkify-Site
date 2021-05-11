import PreviewView from "./previewView.js";

class BookmarksView extends PreviewView {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmark yet. Find a nice recipe and bookmark it';
    _message;

    addHandlerRender(handler){
        window.addEventListener('load',handler);
    }

    _generateMarkup() {
        return this._data.map(this._generateMarkupPreview).join('');
    }
}

export default new BookmarksView();