import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// import DayPicker from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
// import $ from 'jquery';
// import { Button, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

import * as actions from '../../actions';

class Header extends Component {
// **********THIS PART IS EXPERIMENTAL CODE ***********
  constructor() {
       super();
       this.state = {
            windowWidth: window.innerWidth,
            mobileNavVisible: false
       };
   }


  componentDidMount() {
       window.addEventListener('resize', this.handleResize.bind(this));
       this.props.getCurrentUser();
   }

   componentWillUnmount() {
       window.removeEventListener('resize', this.handleResize.bind(this));
   }

   handleResize() {
     this.setState({ windowWidth: window.innerWidth });
   }

navigationLinks() {
  console.log('in header, navigationLinks, this.props.location: ', this.props.location);
  // reference: https://stackoverflow.com/questions/42253277/react-router-v4-how-to-get-current-route
  // added withRouter before connect
  const onMyPage = this.props.location.pathname === '/mypage';
  console.log('in header, navigationLinks, onMyPage: ', onMyPage);

  if (this.props.authenticated) {
     // show link to signout and signed in as...
     if (onMyPage) {
       return [
         <ul key={'1'} className="header-list">
           <li className="nav-item">
            <Link className="nav-link" to="/signout">Sign Out</Link>
           </li>
           <li className="nav-item">
            <p className="nav-link">Signed in as {this.props.email}</p>
           </li>
         </ul>
       ];
     } else {
       return [
         <ul key={'1'} className="header-list">
           <li className="nav-item">
            <Link className="nav-link" to="/signout">Sign Out</Link>
           </li>
           <li className="nav-item">
            <Link className="nav-link" to={'/mypage'}>My Page</Link>
           </li>
           <li className="nav-item">
            <p className="nav-link">Signed in as {this.props.email}</p>
           </li>
         </ul>
       ];
     }
     //end of second if
  } else {
    // show link to sign in or sign out
    return [
      <ul key={'2'} className="header-list">
        <li className="nav-item">
          <Link className="nav-link" to="/signin">Sign In</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/signup">Sign Up</Link>
        </li>
      </ul>

    ];
  }
  // return [
  //   <ul>
  //     <li className="nav-item"key={1}><Link to="about">ABOUT</Link></li>
  //     <li className="nav-item"key={2}><Link to="blog">BLOG</Link></li>
  //     <li className="nav-item"key={3}><Link to="portfolio">PORTFOLIO</Link></li>
  //   </ul>
  // ];
}

handleNavClick() {
  if (!this.state.mobileNavVisible) {
    this.setState({ mobileNavVisible: true });
  } else {
    this.setState({ mobileNavVisible: false });
  }
}
renderMobileNav() {
  if (this.state.mobileNavVisible) {
    return this.navigationLinks();
  }
}

renderNavigation() {
  if (this.state.windowWidth <= 800) {
    return [
      <div key={'3'} className="mobile_nav">
        <p className="header-hamburger" onClick={this.handleNavClick.bind(this)}><i className="fa fa-bars"></i></p>
        {this.renderMobileNav()}
      </div>
    ];
  } else {
    return [
      <div key={'4'} className="nav_menu">
        {this.navigationLinks()}
      </div>
    ];
  }
}

render() {
  return (
    <div className="nav_container">
      <div>
        <Link to="/" className="navbar-brand"> FLATS flats <br />
        <small>and more flats</small></Link>
      </div>
      {this.renderNavigation()}
    </div>
  );
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
//   render() {
//     return (
//       // <Navbar inverse collapseOnSelect>
//       <Navbar>
//         <Navbar.Header>
//             <Navbar.Brand>
//               <Link to="/" className="navbar-brand"> FLATS flats <br />
//                <small>and more flats</small></Link>
//             </Navbar.Brand>
//             <Navbar.Toggle />
//         </Navbar.Header>
//         <Navbar.Collapse>
//           <Nav pullRight>
//             {this.renderLinks()}
//           </Nav>
//         </Navbar.Collapse>
//
//     </Navbar>
// );
// }
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
  console.log('in header, mapStateToProps, state: ', state)
  return {
    authenticated: state.auth.authenticated,
    email: state.auth.email,
    id: state.auth.id
  };
}

export default withRouter(connect(mapStateToProps, actions)(Header));
