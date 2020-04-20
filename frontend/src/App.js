import  React from 'react';
import  './App.css';

import  Start  from './Start'
import  Profile from './Profile'
import  Messages from './Messages'
import  TopTags from './TopTags'
import  { Route } from 'react-router-dom';
import  { BrowserRouter } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route path="/" exact component={Start} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/messages" exact component={Messages} />
        <Route path="/tags" exact component={TopTags} />

      </BrowserRouter>
    </div>
  );
}

export default App;
