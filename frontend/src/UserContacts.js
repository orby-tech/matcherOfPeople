import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom';

import del from "./img/delete.png"
import append from "./img/plus.png"


class UserContacts extends Component{
  constructor(props) {
      super(props);
      this.state  = {
          tags: []
      };
  }

  serverTagUppdate(){
  	var myHeaders = new Headers();
		myHeaders.append("auth", localStorage.getItem('token'));
    myHeaders.append("Content-Type", "application/json");
		var raw = JSON.stringify({user: localStorage.getItem('username'), tag: this.state.tags});
		console.log(this.state.tags)
		var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch('http://api.getteam.space/usercontactsuppdate', requestOptions)
      .then(response => response.json())
      .then(result => {
      })
  }

  handleDelete(e,c){
  	let arr = this.state.tags
  	arr.splice(arr.indexOf(c), 1)
  	this.setState({tags: arr})
  	this.serverTagUppdate()
  }
  handleAppend(e){
  	if(document.getElementById("pablicContactAppend").value) {
	  	let arr = this.state.tags
	  	arr.push(document.getElementById("pablicContactAppend").value)
	  	this.setState({tags: arr})
	  	this.serverTagUppdate()
	  	document.getElementById("pablicContactAppend").value = ""
	  }
  }
	componentDidMount(){
		var myHeaders = new Headers();
		myHeaders.append("auth", localStorage.getItem('token'));
    myHeaders.append("Content-Type", "application/json");
		var raw = JSON.stringify({"user": localStorage.getItem('username')});
		var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch('http://api.getteam.space/usercontacts', requestOptions)
      .then(response => response.json())
      .then(result => {
      	if (result.statusCode){
      		if (result.statusCode === 401){
        		localStorage.removeItem("token")
      		}
      	} else if (result[0].tag.length !==0){
	      	this.setState({
	      		tags: result[0].tag
	      	})
	      } else{
	      	this.setState({
	      		tags: ["Append your contacts"]
	      	})
	      }
      })
	}


	render(){
	  if (!localStorage.getItem('token')){return <Redirect to='/' />}

		return(
			<>
				{this.state.tags.map( (c)  =>
	      	<div className="usertag"> {c}  
	      	<img 
	      		className="delButton"	      		
	      		onClick={(e) => this.handleDelete(e, c)}
	      		alt="plus"
	      		src={del}/>
	      	</div> 
	      )} 
	      <div className="block_input">
		      <input 
		      	className="input_append"
		      	placeholder="append your contacts"
		      	id="pablicContactAppend"
		      	type="text" />	      	
		      <img 
	      		className="appendButton"	      		
	      		onClick={(e) => this.handleAppend(e)}
	      		alt="plus"
	      		src={append}/>
	      </div>
			</>
		)
	}
}
export default UserContacts;
