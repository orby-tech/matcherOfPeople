import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import signLogApp from './LoginService';


class Start extends Component{
	render(){
		return(
			<>
				<h1> Is project is </h1>
				<p>bla bla </p>
				<Route exact component={signLogApp} />

			</>
			)
	}
}
export default Start;