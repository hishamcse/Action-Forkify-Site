// API DOCUMENTATION LINK: https://forkify-api.herokuapp.com/v2

import * as model from './model.js';
import {MODAL_CLOSE_TIME_SEC} from "./config.js";
import recipeView from './Views/recipeView.js';
import searchView from "./Views/searchView.js";
import resultsView from "./Views/resultsView.js";
import paginationView from "./Views/paginationView.js";
import bookmarksView from "./Views/bookmarksView.js";
import addRecipeView from "./Views/addRecipeView.js";

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// parcel enabling auto update the UI without reloading page
// if(module.hot){
//     module.hot.accept();
// }

const controlRecipe = async () => {
    try {
        const id = window.location.hash.slice(1);
        if (!id) return;

        recipeView.renderSpinner();

        // updating the dom for newly active element of the result
        resultsView.update(model.getResultsPerPage());

        // updating bookmark and active element
        bookmarksView.update(model.state.bookmarks);

        // loading recipe
        await model.loadRecipe(id);

        // rendering recipe
        recipeView.render(model.state.recipe);
    } catch (err) {
        recipeView.renderError();
    }
};

const controlSearchResults = async () => {
    try {
        resultsView.renderSpinner();

        // get query
        const query = searchView.getQuery();
        if (!query || query.length === 0) throw new Error();

        // load search results
        await model.loadSearchResults(query);

        // render preview of search results
        resultsView.render(model.getResultsPerPage());

        // render pagination
        paginationView.render(model.state.search);
    } catch (err) {
        resultsView.renderError();
    }
}

const controlPagination = (pageNo) => {
    resultsView.render(model.getResultsPerPage(pageNo));
    paginationView.render(model.state.search);
}

const controlServings = (newServings) => {
    model.updateServings(newServings);
    // updating the dom of recipe not re rendering
    recipeView.update(model.state.recipe);
}

const controlBookmarks = () => {
    model.getBookmarksFromLocalStorage();
    // rendering bookmark
    bookmarksView.render(model.state.bookmarks);            // inserting new element. not updating
}

const controlUpdateBookmarks = () => {
    !model.state.recipe.bookmarked ? model.addBookmark(model.state.recipe) : model.deleteBookmark(model.state.recipe.id);
    // updating dom of recipe
    recipeView.update(model.state.recipe);
    // rendering dom of bookmark
    bookmarksView.render(model.state.bookmarks);            // inserting new element. not updating
}

const controlNewRecipe = async (newRecipe) => {
    try {
        addRecipeView.renderSpinner();

        // upload new recipe
        await model.uploadNewRecipe(newRecipe);

        // render recipe
        recipeView.render(model.state.recipe);

        // success message
        addRecipeView.renderMessage();

        // render bookmark
        bookmarksView.render(model.state.bookmarks);         // inserting new element. not updating

        // changing url in the address bar
        window.history.pushState(null, '', `#${model.state.recipe.id}`);

        // hiding modal window
        setTimeout(() => {
            addRecipeView.toggleVisibility()
        }, MODAL_CLOSE_TIME_SEC * 1000);
    } catch (err) {
        addRecipeView.renderError(err.message);
    }
}

const initialize = () => {
    bookmarksView.addHandlerRender(controlBookmarks);      // as we need to render bookmark first then update further.
    recipeView.addHandlerRender(controlRecipe);
    recipeView.addHandlerServings(controlServings);
    recipeView.addHandlerBookmark(controlUpdateBookmarks);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerPagination(controlPagination);
    addRecipeView.addHandlerUpload(controlNewRecipe);
}

initialize();