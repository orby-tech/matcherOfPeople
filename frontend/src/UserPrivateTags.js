import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom';

import del from "./img/delete.png"
import append from "./img/plus.png"


class UserPrivateTags extends Component{
  constructor(props) {
      super(props);
      this.state  = {
          tags: []
      };
  }
  componentDidUpdate(prevState) {
	  if (this.state.tags !== prevState.tags) {
  		this.serverTagUppdate()
	  }
	}
  serverTagUppdate(){
  	var myHeaders = new Headers();
		myHeaders.append("auth", localStorage.getItem('token'));
    myHeaders.append("Content-Type", "application/json");
		var raw = JSON.stringify({user: localStorage.getItem('username'), tag: this.state.tags});
		var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch('http://api.getteam.space/userprivatetaguppdate', requestOptions)
      .then(response => response.json())
      .then(result => {
      })
  }

  handleDelete(e,c){
  	let arr = this.state.tags
  	arr.splice(arr.indexOf(c), 1)
  	this.setState({tags: arr})
  }
  handleAppend(e){
  	if(document.getElementById("pablicPrivateTagAppend").value) {
	  	let arr = this.state.tags
	  	let arr_uppend = document.getElementById("pablicPrivateTagAppend").value.toLowerCase().split(" ")
	  	arr = arr.concat(arr_uppend)
	  	this.setState({tags: arr})
	  	document.getElementById("pablicPrivateTagAppend").value = ""
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
    fetch('http://api.getteam.space/userprivatetag', requestOptions)
      .then(response => response.json())
      .then(result => {
      	if (result.statusCode){
      		if (result.statusCode === 401){
        		localStorage.removeItem("token")
      		}
      	} else if (result[0].tag){
	      	this.setState({
	      		tags: result[0].tag
	      	})
	      } else{
	      	this.setState({
	      		tags: ["Append your Private Contacts"]
	      	})
	      }
      })
	}


	render(){
    if (!localStorage.getItem('token')){return <Redirect to='/' />}

		return(
			<>
				{this.state.tags.map( (c)  =>
	      	<div className="usertag" key={c}> {c}  
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
		      	placeholder="append tags"
		      	id="pablicPrivateTagAppend"
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
export default UserPrivateTags;
