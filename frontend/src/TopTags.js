import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';


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
    var raw = JSON.stringify({"text":"hello1"});
		var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch('http://localhost:8000/toptags', requestOptions)
      .then(response => response.text())
      .then(result => {
      	let temp_arr = result.split(" ")

        for (let i = 0; i < temp_arr.length / 2; i++){
        	let arr = this.state.tags
        	arr.push({tag:temp_arr[i], count:temp_arr[i + temp_arr.length / 2 ]})
        	this.setState({
        		tags: arr
        	})
 	        console.log(arr)

        }
        console.log(this.state.tags)
      })

	}


	render(){
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
                  messeges
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
