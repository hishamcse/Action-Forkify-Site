import {API_URL, START_PAGE, RESULTS_PER_PAGE, API_KEY} from "./config.js";
import {AJAX} from "./helpers.js";

export const state = {
    recipe: {},
    search: {
        query: {},
        results: [],
        currentPage: START_PAGE,
        resultsPerPage: RESULTS_PER_PAGE
    },
    bookmarks: []
}

const formattedRecipeForState = (recipeData) => {          // for recipe of state object
    const {recipe} = recipeData.data;       // or const recipe = recipeData.data.recipe;   as both side have same name so, destructuring
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && {key: recipe.key})
    };
}

const deFormattedRecipeForAPI = (newRecipe, ingredients) => {          // for recipe to send API call
    return {
        title: newRecipe.title,
        publisher: newRecipe.publisher,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        servings: +newRecipe.servings,
        cooking_time: +newRecipe.cookingTime,
        ingredients
    };
}

export const loadRecipe = async (id) => {
    try {
        const recipeData = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
        state.recipe = formattedRecipeForState(recipeData);

        state.recipe.bookmarked = (state.bookmarks.some(bookmark => bookmark.id === id));
    } catch (err) {
        throw err;
    }
}

export const loadSearchResults = async (query) => {
    try {
        state.search.query = query;
        const dataset = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
        if (dataset.data.recipes.length === 0) throw new Error();

        state.search.results = dataset.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && {key: recipe.key})
            };
        });

        state.search.currentPage = START_PAGE;
    } catch (err) {
        throw err;
    }
}

export const getResultsPerPage = (page = state.search.currentPage) => {
    state.search.currentPage = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
}

export const updateServings = (newServings) => {
    state.recipe.ingredients.forEach(ingredient => {
        ingredient.quantity = (ingredient.quantity * newServings) / state.recipe.servings;
    });

    state.recipe.servings = newServings;
}

const persistBookmark = () => {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = (recipe) => {
    state.bookmarks.push(recipe);               // add to bookmarks array
    if (recipe.id === state.recipe.id) {        // currently loaded recipe as bookmarked
        state.recipe.bookmarked = true;
    }
    persistBookmark();
}

export const deleteBookmark = (id) => {
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);
    if (id === state.recipe.id) {        // currently loaded recipe as bookmarked
        state.recipe.bookmarked = false;
    }
    persistBookmark();
}

export const getBookmarksFromLocalStorage = () => {
    const storage = localStorage.getItem('bookmarks');
    if (!storage) return;
    state.bookmarks = JSON.parse(storage);
}

export const uploadNewRecipe = async (newRecipe) => {
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(data => {
                const arr = data[1].split(',').map(el => el.trim());
                if (arr.length !== 3) throw new Error('Wrong input format!! Please use the correct format for ingredient');

                return {
                    quantity: +arr[0] ? +arr[0] : null,
                    unit: arr[1],
                    description: arr[2]
                }
            });

        const recipe = deFormattedRecipeForAPI(newRecipe, ingredients);

        const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
        console.log(data);
        state.recipe = formattedRecipeForState(data);
        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }
}