import React from 'react';
import './App.css';

import  Start  from './Start'
import { Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route path="/" exact component={Start} />
      </BrowserRouter>
    </div>
  );
}

export default App;
