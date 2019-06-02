import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducers from './reducers';

const initialState = {};

const middleware = [thunk];

const store = createStore( 
    rootReducers, 
    initialState,
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);
// 1st parameter is reducer, 2nd is initialstate, 3rd should be applymiddleware
// to show it on chrome redux devtool, use compose and dump it for displaying

export default store;