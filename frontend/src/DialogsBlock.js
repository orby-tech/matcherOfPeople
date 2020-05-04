import  React, { Component } from 'react';

import  { connect } from 'react-redux'
import  { changeDialog } from './redux/actions'

import append from "./img/plus.png"
import  { Redirect } from 'react-router-dom';


class DialogsBlock extends Component{
  constructor(props) {
      super(props);
      this.state  = {
          messages: [],
          update: false,
          dialogListStatus: false,
      };
      this.hideDialogs = this.hideDialogs.bind(this);

  }
  handleOpen(e, c) {
    this.props.dispatch(changeDialog(c))
    window.location.reload()
  }
  handleNewDialog(e){
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
    fetch('http://api.getteam.space/newdialog', requestOptions)
      .then(response => response.text())
      .then(result => {
        if (result === "sorry"){
          alert("Sorry, not peoples with your tags uppdate your lists")
          window.location.reload()

        } else if(result ==="re-login"){
          alert("Relogin please")
          localStorage.removeItem("token")
          window.location.reload();
        } else if (result.statusCode){
          if (result.statusCode === 401){
            alert("Relogin please")
            localStorage.removeItem("token")
            window.location.reload();
          }
        }
      })
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
    fetch('http://api.getteam.space/userdialogs', requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result[0].dialog){
        	this.setState({
        		messages: result[0].dialog
        	})
        } else {
          this.setState({
            messages: []
          })
        }
      })
	}
  hideDialogs () {
    console.log(this.state.dialogListStatus)
    this.setState({dialogListStatus: !this.state.dialogListStatus})
  }


	render(){
    if (this.state.update === true) {
      this.setState({update: false})
      return <Redirect to='/messages' />}

    let hideShowDialogs = this.state.dialogListStatus
                        ? "Hide"
                        : "Show dialogs"
    let dialogListButtons = this.state.dialogListStatus
                        ? "dialogs_block"
                        : "dialogs_block hide"                        
		return(
			<>
        <h3>Dialogs</h3>
        <div className="new_dialog_button">
          <img 
            className="appendDialogButton"            
            onClick={(e) => this.handleNewDialog(e)}
            alt="plus"
            src={append}/>
        </div>

        <div className="dialog_button" onClick={this.hideDialogs}>
          {hideShowDialogs}
        </div>

				<div className={dialogListButtons}>
          { this.state.messages.map( c  =>
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