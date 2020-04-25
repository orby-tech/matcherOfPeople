import  React, { Component } from 'react';
import  { Redirect } from 'react-router-dom';
import  { Link } from 'react-router-dom';

import  DialogsBlock from './DialogsBlock';
import WrappedMessagesBlock from './MessegesBlock';

import  { connect } from 'react-redux'


class Messages extends Component{


	render(){
		if (!localStorage.getItem('token')){return <Redirect to='/' />}

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
							<h3>{
								this.props.dialog 
									? "Dialog №" + this.props.dialog
									: "Messages"
							}
							</h3>
							<WrappedMessagesBlock />

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

const mapStateToProps = (state) => {
  return {
  	dialog: state.dialog
  };
}
const WrappedMessages = connect(mapStateToProps)(Messages);

export default WrappedMessages;