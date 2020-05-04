import React, { Component }  from 'react';

import { Link } from 'react-router-dom';





class NavBar extends Component{

  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);

    this.state = {
      collapsed: true
    };
  }
  componentDidMount(){
    const { match: { params } } = this.props;
    this.setState({opend: params.id});
  }


  componentDidUpdate(prevProps) {
    const { match: { params } } = this.props;
    if (params.id !== this.state.opend) {
      this.setState({opend: params.id});
    }
  }
  toggleNavbar(){
    this.setState({collapsed: !this.state.collapsed})
  }


  render() {
    const pic = this.state.collapsed 
                ? "nav_row nav_row_in" 
                : "nav_row nav_row_in active";
    const classCollapse = this.state.collapsed
                ? 'collapse navbar-collapse' 
                : 'collapse navbar-collapse show';
    

    return(
      <>

        <div className="container">          
          <nav className="navbar navbar-light transparent-nav" id="navBar">
            <p className="" id="navBar">GetTeam</p>

            <svg className={pic} viewBox="0 0 100 100" width="80" onClick={this.toggleNavbar}>
              <path
                    className="line top"
                    d="m 30,33 h 40 c 13.100415,0 14.380204,31.80258 6.899646,33.421777 -24.612039,5.327373 9.016154,-52.337577 -12.75751,-30.563913 l -28.284272,28.284272" />
              <path
                    className="line middle"
                    d="m 70,50 c 0,0 -32.213436,0 -40,0 -7.786564,0 -6.428571,-4.640244 -6.428571,-8.571429 0,-5.895471 6.073743,-11.783399 12.286435,-5.570707 6.212692,6.212692 28.284272,28.284272 28.284272,28.284272" />
              <path
                    className="line bottom"
                    d="m 69.575405,67.073826 h -40 c -13.100415,0 -14.380204,-31.80258 -6.899646,-33.421777 24.612039,-5.327373 -9.016154,52.337577 12.75751,30.563913 l 28.284272,-28.284272" />
            </svg>

            <div className={classCollapse}>
              <ul className="navbar-nav ml-auto">
                <li className="nav-item" id="navBar">
                  <Link onClick={this.toggleNavbar} 
                        className="nav-link"
                        to="/toptags"> Tag's top
                  </Link>
                </li>
                <li className="nav-item">
                  <Link onClick={this.toggleNavbar} 
                        className="nav-link"
                        to="/messages"> Messages
                  </Link>
                </li>
                <li className="nav-item">
                  <Link onClick={this.toggleNavbar} 
                        className="nav-link"
                        to="/profile"> Profile
                  </Link>
                </li>              
              </ul>
            </div>

            

        </nav>
      </div>
    </>
    );
  }
}

export default NavBar;



