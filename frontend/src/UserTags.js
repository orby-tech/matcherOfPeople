import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

import del from "./img/delete.png"

class UserTags extends Component{
  constructor(props) {
      super(props);
      this.state  = {
          tags: []
      };
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
    fetch('http://localhost:8000/usertag', requestOptions)
      .then(response => response.json())
      .then(result => {
      	this.setState({
      		tags: result[0].tag
      	})
      	console.log(result[0].tag)
      })
	}


	render(){
		return(
			<>
				{this.state.tags.map( (c)  =>
	      	<div className="usertag"> {c}  
	      	<img 
	      		className="delButton"
	      		src={del}/>
	      	</div> 
	      )} 
			</>
		)
	}
}
export default UserTags;
