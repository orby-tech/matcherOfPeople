import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

class LoginForm extends React.Component {
  state = {
    email: '',
    password: ''
  };

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  render() {
    return (
      <>
        <h4>Log In</h4>
        <label htmlFor="username">email</label>
        <input
          type="text"
          name="email"
          value={this.state.email}
          onChange={this.handle_change}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.handle_change}
        />
        <Button className="sign_log_button" variant='primary' onClick={e => this.props.handle_login(e, this.state)}>
          Log in
        </Button>
      </>
    );
  }
}

export default LoginForm;

LoginForm.propTypes = {
  handle_login: PropTypes.func.isRequired
};
