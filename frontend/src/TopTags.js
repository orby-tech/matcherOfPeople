import  React, { Component } from 'react';
import  { Redirect } from 'react-router-dom';
import  WrappedFindUserByTag from './findUserByTag'


class TopTags extends Component{
  constructor(props) {
      super(props);
      this.state  = {
          tags: [],
          allcount: 0
      };
  }
	componentDidMount(){
		var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({});
		var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch('http://api.getteam.space/toptags', requestOptions)
      .then(response => response.json())
      .then(result => {
      	this.setState({
      		tags: result,
          maxCount: result[0].count
      	})
      })
	}
  calculateWidth (count) {
    count = count / this.state.maxCount * 100
    return Math.ceil(count).toString() + "px"
  }
  calculateColor (count) {
    let green = count / this.state.maxCount * 255
    let red = (1 - count / this.state.maxCount) * 255
    return "rgb("+red+", " + green + ", 0)"
  }

	render(){
    if (!localStorage.getItem('token')){return <Redirect to='/' />}
		return(
			<>
				<h1>
				Top of tags
				</h1>
        <table class="top-tag__table">
					<tbody className="tag-top-table">
            {this.state.tags.map( c  =>
              <tr className="top_tags" key={c.tag}>
                <td>{c.tag}</td>
                <td>{c.count}</td>
                <td> <div className="top-tag__counting" style={{width: this.calculateWidth(c.count), "backgroundColor": this.calculateColor(c.count), }}/> </td>
              </tr>)} 

					</tbody>
        </table>
        <WrappedFindUserByTag />
			</>
		)
	}
}
export default TopTags;
