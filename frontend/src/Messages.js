import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

import  DialogsBlock from './DialogsBlock';
import MessegesBlock from './DialogsBlock';


class Messages extends Component{


	render(){
		return(
			<>
				<h1>
				Messages
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
					<div className="grid_of_dialogs">

						<div className="dialogs mes">
							<h3>Dialogs</h3>
							<DialogsBlock />
						</div>					

						<div className="messeges mes">
							<h3>Messeges</h3>
							<MessegesBlock />

						</div>					

						<div className="profile mes">
							<h3>Profile</h3>
						</div>

					</div>
				</div>
				<div/>

			</>
		)
	}
}
export default Messages;
