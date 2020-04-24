import  React from 'react';
import  './App.css';

import  Start  from './Start'
import  Profile from './Profile'
import  WrappedMessages from './Messages'
import  TopTags from './TopTags'
import  { Route } from 'react-router-dom';
import  { BrowserRouter } from 'react-router-dom';

import  { Provider } from 'react-redux'
import  { applyMiddleware, createStore } from 'redux'
import  { composeWithDevTools } from 'redux-devtools-extension'
import  { rootReducer } from './redux/rootReducer'
import  { connect } from 'react-redux'
import  thunk from 'redux-thunk'
import  logger from 'redux-logger'

const persistedState = localStorage.getItem('reduxState') 
                       ? JSON.parse(localStorage.getItem('reduxState'))
                       : {}

const store = createStore(rootReducer,
    persistedState,   
    composeWithDevTools(
    applyMiddleware(thunk, logger)))


store.subscribe(()=>{
  localStorage.setItem('reduxState', JSON.stringify(store.getState()))
});

function App() {
  
  return (
    <div className="App">
      <Provider store={store}>

        <BrowserRouter>
          <Route path="/" exact component={Start} />
          <Route path="/profile" exact component={Profile} />
          <Route path="/messages" exact component={WrappedMessages} />
          <Route path="/tags" exact component={TopTags} />

        </BrowserRouter>
    </Provider>

    </div>
  );
}

const mapStateToProps = (state) => {
  return state;
}

const WrappedApp = connect(mapStateToProps)(App);

export default WrappedApp;

