import Button from 'react-bootstrap/Button';
import React from 'react';
import PropTypes from 'prop-types';

function Nav(props) {
  const logged_out_nav = (
    <>
      <Button className="sign_log_button" variant='outline-primary' onClick={() => props.display_form('login')}>
        Log in
      </Button>
      <Button className="sign_log_button" variant='outline-primary' onClick={() => props.display_form('signup')}>
        Sign up
      </Button>
    </>
  );

  const logged_in_nav = (
    <Button className="sign_log_button" variant='outline-primary' onClick={props.handle_logout}>
        Log out
    </Button>
  );
  return <div>{props.logged_in ? logged_in_nav : logged_out_nav}</div>;
}

export default Nav;

Nav.propTypes = {
  logged_in: PropTypes.bool.isRequired,
  display_form: PropTypes.func.isRequired,
  handle_logout: PropTypes.func.isRequired
};
