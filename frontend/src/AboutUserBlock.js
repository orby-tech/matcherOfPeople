import  React, { Component } from 'react';

import  { connect } from 'react-redux'

import  { Redirect } from 'react-router-dom';

import star from "./img/star.png"
import clickedStar from "./img/clickedStar.png"


class AboutUserBlock extends Component{
  constructor(props) {
      super(props);
      this.state  = {
          rate: 0,
          update: false,
          rateStars: [1,2,3,4,5,6,7,8,9,10],
          tags: []
      };
  }
  handleRate(e, c) {
    this.setState({rate: c})
  }
  rating(c) {
    if (this.state.rate >= c){
      return clickedStar
    } else {
      return star
    }
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

      if(this.props.dialog && this.props.dialog.split("_").length === 3) {
        if (this.props.dialog.split("_")[0] === localStorage.getItem('username')) {
          raw = JSON.stringify({"user": this.props.dialog.split("_")[2]});
        } 
        else {
          raw = JSON.stringify({"user": this.props.dialog.split("_")[0]});
        }
        requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        fetch('http://api.getteam.space/usertag', requestOptions)
          .then(response => response.json())
          .then(result => {
            if (result.statusCode){
              if (result.statusCode === 401){
                alert("Relogin please")
                localStorage.removeItem("token")
                window.location.reload();
              }
            } else if (result && result[0] && result[0].tag){
              this.setState({
                tags: result[0].tag
              })
            }else {
              this.setState({
                tags: ["No public tag's "]
              })
            }  
          })
      } else {
            this.setState({
              tags: ["No public tag's "]
            })        
      };

	}


	render(){
    if (this.state.update === true) {
      this.setState({update: false})
      return <Redirect to='/messages' />}
		return(
			<>
        <div> 
          <p> Rate the interlocutor </p>
          <div className="blockRateStar">
            { this.state.rateStars.map( c  =>
              <img 
                key={c}
                className="rateStar" 
                onClick={(e) => this.handleRate(e, c)} 
                alt="star"
                src={this.rating(c)}/>
            )}
          </div>
        </div>
        <div className="blockPublicTags">
          <p> Public tags </p>
        </div>
        <div>
          {this.state.tags.map( (c)  =>
            <div key={c} className="usertag"> {c}  
            </div> 
          )} 
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
const WrappedAboutUserBlock = connect(mapStateToProps)(AboutUserBlock);

export default WrappedAboutUserBlock;