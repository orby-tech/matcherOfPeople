import  React, { Component } from 'react';

import  { connect } from 'react-redux'
import  { changeDialog } from './redux/actions'

import  { Redirect } from 'react-router-dom';

import star from "./img/star.png"
import clickedStar from "./img/clickedStar.png"


class AboutUserBlock extends Component{
  constructor(props) {
      super(props);
      this.state  = {
          rate: 0,
          update: false,
          rateStars: [1,2,3,4,5,6,7,8,9,10]
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