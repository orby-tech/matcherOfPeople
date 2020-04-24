import  React, { Component } from 'react';
import  { Route } from 'react-router-dom';
import  { BrowserRouter } from 'react-router-dom';
import  { Link } from 'react-router-dom';

import  { connect } from 'react-redux'
import append from "./img/plus.png"

class MessagesBlock extends Component{
  constructor(props) {
      super(props);
      this.state  = {
          messages: []
      };
  }
  serverMessagesUppdate(){
    var myHeaders = new Headers();
    myHeaders.append("auth", localStorage.getItem('token'));
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({dialog: this.props.dialog, messages: this.state.messages});
    console.log(raw)
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch('http://localhost:8000/dialogupdate', requestOptions)
      .then(response => response.json())
      .then(result => {
      })
  }
  handleWriteMessage(){
    if(document.getElementById("WriteNewMessage").value) {
      let arr = this.state.messages
      arr.push([document.getElementById("WriteNewMessage").value, localStorage.getItem('username')])
      this.setState({messages: arr})
      this.serverMessagesUppdate()
      document.getElementById("WriteNewMessage").value = ""
    }
  }
  loadMessages(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("auth", localStorage.getItem('token'));

    var raw = JSON.stringify({"dialog": this.props.dialog});
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch('http://localhost:8000/dialog', requestOptions)
      .then(response => response.json())
      .then(result => {
        this.setState({
          messages: result[0].messages
        })
      })
  }
  componentDidMount(){
    if(this.props.dialog){
      this.loadMessages()
    }
  }


  render(){
    return(
      <>
        <div className="messages_block">
          {this.state.messages.map( c  =>

            <div className="message_string">
              <p 
                className={
                  c[1] === localStorage.getItem('username')
                    ? 'message_rigth'
                    : 'message'
                }
              >
                {c[0]}
              </p>
        </div>)} 
        <div className="block_new_message">
          <input 
            className="input_append"
            placeholder="Write your message"
            id="WriteNewMessage"
            type="text" />          
          <img 
            className="appendButton"            
            onClick={(e) => this.handleWriteMessage(e)}
            src={append}/>
        </div>
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
const WrappedMessagesBlock = connect(mapStateToProps)(MessagesBlock);

export default WrappedMessagesBlock;