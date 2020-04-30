import React, { Component } from 'react';
import Nav from './Nav';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { Link } from 'react-router-dom';
import  { Redirect } from 'react-router-dom';

import './App.css';



class signLogApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: ''
    };
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      console.log("log")
    }
  }

  handle_login = (e, data) => {
    e.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(data);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch('http://api.getteam.space/auth-multiple', requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result.token)
        localStorage.setItem('username', data.user);
        localStorage.setItem('token', result.token);
        window.location.reload();

      })
      .catch(error => {
        alert("Ups, may be uncorrect form?")
      });
      
  };

  handle_signup = (e, data) => {
    e.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(data);
    var requestOptions = { method: 'POST',  headers: myHeaders,   body: raw,  redirect: 'follow'};
    fetch('http://api.getteam.space/register', requestOptions)
      .then(response => response.json())
      .then(result => {        
        console.log(result)

        localStorage.setItem('username', data.user);
        localStorage.setItem('token', result.token);
        window.location.reload();

      })
      .catch(error => console.log('error', error));

  };

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '' });
  };

  display_form = form => {
    this.setState({
      displayed_form: form
    });
  };

  render() {
    if (localStorage.getItem('token')){return <Redirect to='/Profile' />}


    let form;
    switch (this.state.displayed_form) {
      case 'login':
        form = <LoginForm handle_login={this.handle_login} />;
        break;
      case 'signup':
        form = <SignupForm handle_signup={this.handle_signup} />;
        break;
      default:
        form = null;
    }

    return (
      <>
        <div className="App">
          <Nav
            logged_in={this.state.logged_in}
            display_form={this.display_form}
            handle_logout={this.handle_logout}
          />
          {form}
          <h3>
            {this.state.logged_in
              ? `Hello, ${localStorage.getItem('username')}`
              : 'Please Log In'}
          </h3>
        </div>
        <Link 
              to="/profile">
              Temp href to profile
        </Link>
      </>
    );
  }
}
export default signLogApp;
