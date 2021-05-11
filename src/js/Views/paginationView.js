import View from './view.js';
import icons from 'url:../../img/icons.svg';   // parcel 2

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');
    _data;
    _errorMessage = 'No recipes found for your query. Please try again with another query!';
    _message;

    addHandlerPagination(handler) {
        this._parentElement.addEventListener('click', e => {
            e.preventDefault();
            const btn = e.target.closest('.btn--inline');
            if (!btn || !btn.dataset.goto) return;
            handler(+btn.dataset.goto);
        });
    }

    _generateMarkup() {
        const total_pages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        const {currentPage} = this._data;

        // case 1. page 1 and other pages
        if (currentPage === 1 && currentPage < total_pages) {
            return this._generateMarkupTotalPg(total_pages).concat(this._generateMarkupForward(currentPage + 1));
        }

        // case 2. page 1 and no other pages
        if (currentPage === 1 && currentPage === total_pages) {
            return '';
        }

        // case 3. last page
        if (currentPage === total_pages) {
            return this._generateMarkupBack(total_pages - 1).concat(this._generateMarkupTotalPg(total_pages));
        }

        // case 4. other page
        return this._generateMarkupBack(currentPage - 1).concat(this._generateMarkupTotalPg(total_pages))
            .concat(this._generateMarkupForward(currentPage + 1));
    }

    _generateMarkupBack(pageNo) {
        return `
        <button class="btn--inline pagination__btn--prev" data-goto="${pageNo}">
          <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${pageNo}</span>
        </button>`;
    }

    _generateMarkupForward(pageNo) {
        return `
         <button class="btn--inline pagination__btn--next" data-goto="${pageNo}">
           <span>Page ${pageNo}</span>
           <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
           </svg>
         </button>`;
    }

    _generateMarkupTotalPg(total_pages) {
        return `
         <button class="btn--inline pagination__btn--mid">
           <span>Total Pg: ${total_pages}</span>
         </button>`;
    }
}

export default new PaginationView();