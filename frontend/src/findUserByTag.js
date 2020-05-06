import  React, { Component } from 'react';
import  { Redirect } from 'react-router-dom';

import  { connect } from 'react-redux'


class FindUserByTag extends Component{
	constructor(props) {
      super(props);
	    this.findUserByTag = this.findUserByTag.bind(this);

      this.state  = {
          people: []
      };
  }
  findUserByTag() {
  	var myHeaders = new Headers();
		myHeaders.append("auth", localStorage.getItem('token'));
    myHeaders.append("Content-Type", "application/json");
		var raw = JSON.stringify({user: localStorage.getItem('username'), tag: document.getElementById("find-user__input").value.split(" ")[0]});
		var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch('http://127.0.0.1:8000/findByTag', requestOptions)
      .then(response => response.json())
      .then(result => {
      	let arr = []
      	for (let i= 0; i< result.counts.length; i++){
      		if(result.counts !== 0) {
      			arr.push([result.names[i], Math.ceil(result.counts[i])])
      		}
      	}
      	console.log(arr)
      	this.setState({ people: arr })
      })
  }
  
	render(){
		if (!localStorage.getItem('token')){return <Redirect to='/' />}

		return(
			<>
				<div className="find-user__input-group">
					<div className="find-user__little-title"> Write tag(s) for find users: </div>

					<input className="find-user__input" id="find-user__input" /> 
					<div className="find-user__input-button" onClick={this.findUserByTag}>Find</div>
				</div>
				<div className="find-user__output-group">
				{this.state.people.map( (c)  =>
	      	<div className="find-user__display"  key={c}> 
	      		<div className="find-user__name">{c[0]}</div>
	      		<div className="find-user__procent">{c[1]}</div>
	      	</div>
	      )} 
	      </div>
			</>
		)
	}
}

const mapStateToProps = (state) => {
  return {
  };
}
const WrappedFindUserByTag = connect(mapStateToProps)(FindUserByTag);

export default WrappedFindUserByTag;