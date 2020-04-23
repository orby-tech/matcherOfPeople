import  React, { Component } from 'react';
import  { Route } from 'react-router-dom';
import  { BrowserRouter } from 'react-router-dom';
import  { Link } from 'react-router-dom';

class DialogsBlock extends Component{
  constructor(props) {
      super(props);
      this.state  = {
          tags: []
      };
  }
	CcomponentDidMount(){
		var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({});
		var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch('http://localhost:8000/toptags', requestOptions)
      .then(response => response.json())
      .then(result => {
      	this.setState({
      		tags: result
      	})
      })
	}


	render(){
		return(
			<>
					<div >
						<div className="tag-top-table">
							<tbody>
              {this.state.tags.map( c  =>
                <tr>

                  <td>{c.tag}</td>
                </tr>)} 

              </tbody>

						</div>
					</div>
				<div/>

			</>
		)
	}
}
export default DialogsBlock;
