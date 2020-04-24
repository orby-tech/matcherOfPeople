import  React, { Component } from 'react';
import  { Route } from 'react-router-dom';
import  { BrowserRouter } from 'react-router-dom';
import  { Link } from 'react-router-dom';

import  { connect } from 'react-redux'
import  { changeDialog } from './redux/actions'

import append from "./img/plus.png"


class DialogsBlock extends Component{
  constructor(props) {
      super(props);
      this.state  = {
          messages: []
      };
  }
  handleOpen(e, c) {
    this.props.dispatch(changeDialog(c))
  }
	componentDidMount(){
		var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("auth", localStorage.getItem('token'));

    var raw = JSON.stringify({"user": localStorage.getItem('username')});
		var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch('http://localhost:8000/userdialogs', requestOptions)
      .then(response => response.json())
      .then(result => {
      	this.setState({
      		messages: result[0].dialog
      	})
      })
	}


	render(){
		return(
			<>
        <div className="new_dialog_button">
          <img 
            className="appendDialogButton"            
            onClick={(e) => this.handleWriteMessage(e)}
            src={append}/>
        </div>
				<div className="dialogs_block">
        {this.state.messages.map( c  =>
          <div className="dialog_button">
            <td onClick={(e) => this.handleOpen(e, c)} >{c}</td>
          </div>)} 
			  </div>

			</>
		)
	}
}

const mapStateToProps = (state) => {
  return {
    dialog: state.dialog
  };
}
const WrappedDialogsBlock = connect(mapStateToProps)(DialogsBlock);

export default WrappedDialogsBlock;