import React, { Component } from 'react';

import del from "./img/delete.png"
import append from "./img/plus.png"


class UserPrivateTags extends Component{
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
    fetch('http://localhost:8000/userprivatetaguppdate', requestOptions)
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
  	if(document.getElementById("pablicPrivateTagAppend").value) {
	  	let arr = this.state.tags
	  	arr.push(document.getElementById("pablicPrivateTagAppend").value)
	  	this.setState({tags: arr})
	  	this.serverTagUppdate()
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
    fetch('http://localhost:8000/userprivatetag', requestOptions)
      .then(response => response.json())
      .then(result => {
	      if (result[0].tag){
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
