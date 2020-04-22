import  React, { Component } from 'react';
import  { Route } from 'react-router-dom';
import  { BrowserRouter } from 'react-router-dom';
import  { Link } from 'react-router-dom';


import  UserTags from './UserTags';


class Profile extends Component{


	render(){
		return(
			<>
				<h1>
				Your profile
				</h1>

				<div className="grid-profile">
					<div>
            <Link className="nav-bar"
                  to="/tags"> 
                  tag's top
            </Link>
            <Link className="nav-bar"
                  to="/messages"> 
                  messages
            </Link>
            <Link className="nav-bar"
                  to="/profile"> 
                  profile 
            </Link>
					</div>
					<div className="tags">

						<div className="input-group">
							<h3> Your private tags </h3>
						  <textarea className="form-control" aria-label="With textarea"></textarea>
						</div>
						
						<div className="input-group">
							<h3> Your pablic tags </h3>
							<UserTags />
							</div>

						<div>
							<h2> Your contacts </h2>
						  <textarea className="form-control" aria-label="With textarea"></textarea>

						</div>
					</div>
				</div>
				<div/>

			</>
		)
	}
}
export default Profile;