import  React, { Component } from 'react';
import  { Redirect } from 'react-router-dom';


import  UserTags from './UserTags';
import  UserPrivateTags from './UserPrivateTags';
import  UserContacts from './UserContacts';


class Profile extends Component{


	render(){
		if (!localStorage.getItem('token')){return <Redirect to='/' />}
		return(
			<>
					

				<h1>
				Your profile
				</h1>

				
					<div className="grid-profile">
						<div className="input-group">
							<h3> Your private tags </h3>
							<UserPrivateTags />
						</div>
						
						<div className="input-group">
							<h3> Your public tags </h3>
							<UserTags />
						</div>

						<div className="input-group">
							<h3> Your contacts </h3>
						  <UserContacts />
						</div>
					</div>
		</>
		)
	}
}
export default Profile;