import  React, { Component } from 'react';
import  { Redirect } from 'react-router-dom';
import  { Link } from 'react-router-dom';

class TopTags extends Component{
  constructor(props) {
      super(props);
      this.state  = {
          tags: []
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
    fetch('http://localhost:8000/toptags', requestOptions)
      .then(response => response.json())
      .then(result => {
      	this.setState({
      		tags: result
      	})
      })
	}


	render(){
    if (!localStorage.getItem('token')){return <Redirect to='/' />}

		return(
			<>
				<h1>
				Top of tags
				</h1>

				<div className="grid-profile">
					<div>
            <Link className="nav-bar"
                  to="/tags"> 
                  tag's top
            </Link>
            <Link className="nav-bar"
                  to="/messages"> 
                  messages
            </Link>
            <Link className="nav-bar"
                  to="/profile"> 
                  profile 
            </Link>
					</div>

					<div >
						<div className="tag-top-table">
	            <thead  key="thead">
					      <tr>
		                <th>tag</th>
		                <th>count</th>
		            </tr>
	            </thead>

							<tbody>
              {this.state.tags.map( c  =>
                <tr>

                  <td>{c.tag}</td>
                  <td>{c.count}</td>
                </tr>)} 

              </tbody>

						</div>
						</div>
					</div>
				<div/>

			</>
		)
	}
}
export default TopTags;
