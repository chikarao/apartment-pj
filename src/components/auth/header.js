import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import $ from 'jquery';
import { Button, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

class Header extends Component {
// **********THIS PART IS EXPERIMENTAL CODE ***********
  constructor() {
       super();
       this.state = {
           screenIsbig: true
       };
   }


  componentDidMount() {
       window.addEventListener('resize', this.handleResize.bind(this));
   }

   componentWillUnmount() {
       window.removeEventListener('resize', this.handleResize.bind(this));
   }

   handleResize() {
     if (window.innerWidth < 700) {
       this.setState({ screenIsbig: false })
     } else {
       this.setState({ screenIsbig: true });
     }
   }
   // **********THIS PART IS EXPERIMENTAL CODE ***********

  renderLinks() {
    if (this.props.authenticated) {
      // show link to signout
      // console.log('here is the email: ', this.props.email);
      return (
        [
          <NavItem key={1} eventKey={1} href="#">

            <Link className="nav-link" to="/signout">Sign Out</Link>
          </NavItem>,
          <NavItem key={2} eventKey={2} href="#">
            <p className="nav-link">Signed in as {this.props.email}</p>
          </NavItem>
          // <li className="nav-item" key={3}>
          //   <Link className="nav-link" to="/signout">Sign Out</Link>
          // </li>,
          // <li className="nav-item" key={4}>
          //     <p className="nav-link">Signed in as {this.props.email}</p>
          // </li>
        ]
      );
    } else {
      // show link to sign in or sign out
    return ([
      <NavItem key={3} eventKey={3} href="#">
        <Link className="nav-link" to="/signin">Sign in</Link>
      </NavItem>,
      <NavItem className="sign-up-nav-item" key={4} eventKey={4} href="#">
        <Link className="nav-link" to="/signup">Sign Up</Link>
      </NavItem>
          //
          // <li className="nav-item" key={1}>
          //   <Link className="nav-link" to="/signin">Sign In</Link>
          // </li>,
          // <li className="nav-item" key={2}>
          //   <Link className="nav-link" to="/signup">Sign Up</Link>
          // </li>
        ]
      );
    }
  }
  // render() {
  //   return (
  //     <nav className="navbar navbar-light">
  //       <Link to="/" className="navbar-brand"> Redux Auth <br/><small>w/ react-router-dom</small></Link>
  //       <ul className="nav navbar-nav">
  //         {this.renderLinks()}
  //       </ul>
  //     </nav>
  //   );
  // }
  // render() {
  //   return (
  //     <nav className="navbar navbar-expand-lg navbar-light bg-light">
  //       <Link to="/" className="navbar-brand"> Redux Auth <br />
  //       <small>w/ react-router-dom</small></Link>
  //       <button
  //         className="navbar-toggler"
  //         type="button"
  //         data-toggle="collapse"
  //         data-target="#navbarNav"
  //         aria-controls="navbarNav"
  //         aria-expanded="false"
  //         aria-label="Toggle navigation"
  //       >
  //          <span className="navbar-toggler-icon"></span>
  //       </button>
  //       <div className="navbar-collapse collapse" id="navbarNav">
  //         <ul className="navbar-nav">
  //           {this.renderLinks()}
  //         </ul>
  //       </div>
  //     </nav>
  //   );
  // }
  render() {
    return (
      // <Navbar inverse collapseOnSelect>
      <Navbar>
        <Navbar.Header>
            <Navbar.Brand>
              <Link to="/" className="navbar-brand"> Redux Auth <br />
               <small>w/ react-router-dom</small></Link>
            </Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {this.renderLinks()}
          </Nav>
        </Navbar.Collapse>

    </Navbar>
);
}
//
// render() {
//   // let renderThis;
//   if (this.state.screenIsbig) {
//       console.log('this is the screensize: ', window.innerWidth);
//         // renderThis = <h1>This is for big screens</h1>
//   } else {
//     // console.log('this is the screensize: ', window.innerWidth);
//
//       // renderThis = <h3>This is for small screens</h3>
//   }
//   // return (
//   //     <div>
//   //         {renderThis}
//   //     </div>
//   // )
// }
//end of render
}
// end of class
function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    email: state.auth.email
  };
}

export default connect(mapStateToProps)(Header);
