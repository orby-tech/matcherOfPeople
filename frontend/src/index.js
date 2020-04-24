import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import WrappedApp from './App';
import * as serviceWorker from './serviceWorker';
import  { Provider } from 'react-redux'

import  { applyMiddleware, createStore } from 'redux'
import  { rootReducer} from './redux/rootReducer'
import  thunk from 'redux-thunk'
import  { composeWithDevTools } from 'redux-devtools-extension'
import  logger from 'redux-logger'


const store = createStore(rootReducer,   
    composeWithDevTools(
    applyMiddleware(thunk, logger)))

ReactDOM.render(
	<Provider store={store}>
	  <React.StrictMode>
	    <WrappedApp />
	  </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
