import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';


class Profile extends Component{


	render(){
		return(
			<>
				<h1>
				Your profile
				</h1>

				<div className="grid-profile">
					<div className="nav-bar">
						<a> find tags </a>
						<a> messeges </a>
						<a> profile </a>
					</div>
					<div className="tags">

						<div className="input-group">
							<h3> Your private tags </h3>
						  <textarea className="form-control" aria-label="With textarea"></textarea>
						</div>
						
						<div className="input-group">
							<h3> Your pablic tags </h3>
						  <textarea className="form-control" aria-label="With textarea"></textarea>
						</div>

						<div>
							<h2> Your contacts </h2>
							<p> Mobile </p>
							<p> e-mail</p>
							<p> end other</p>
						</div>
					</div>
				</div>
				<div/>

			</>
		)
	}
}
export default Profile;