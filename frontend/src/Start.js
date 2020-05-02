import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import signLogApp from './LoginService';


class Start extends Component{
	render(){
		return(
			<div className="start_info">
				<h1> GetTeam </h1>
				<h2> Start a dialogue with people who suit you.</h2>
				<p> Fill in the tags of your interests, and the algorithm will select the person you are talking to.</p>
				<p> We value the quality of communication, therefore, under the hood, there are a huge number of metrics so that you have the perfect conversation partner.</p>
				<Route exact component={signLogApp} />

			</div>
			)
	}
}
export default Start;