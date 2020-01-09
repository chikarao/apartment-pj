// ************* COPIED FROM HOC SG *****************
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import PropTypes from 'prop-types';

// argument is compoent we want to wrap
export default function (props) {
  class ActioncableManager extends Component {
    constructor() {
         super();
         this.state = {
           webSocketConnected: false
         };
         this.handleReconnectButtonClick = this.handleReconnectButtonClick.bind(this);
     }
    // UPDATED to componentDidMount from componentWillMount
    componentDidMount() {
      console.log('in ActioncableManager componentDidMount, props', props);
      // console.log('require_auth, componentDidMount, PropTypes: ', PropTypes);
      // if (!this.props.authenticated) {
      //   // this.context.router.push('/');
      //
      //   // console.log('require_auth, componentDidMount, this.co ntext: ', this.context);
      //   this.context.router.history.push('/');
      // }
    }

    // UPDATED to componentDidUpdate from componentWillUpdate
    // componentDidUpdate(nextProps) {
    //   // if (!nextProps.authenticated) {
    //   //   // do not use this.nextProps
    //   //   // this.context.router.push('/');
    //   //   // console.log('require_auth, componentDidUpdate, nextProps: ', nextProps);
    //   //   // this.context.router.history.push('/');
    //   // }
    // }

    handleReconnectButtonClick() {
      console.log('in ActioncableManager handleReconnectButtonClick clicked');
      this.setState({ webSocketConnected: true }, () => {
        console.log('in ActioncableManager handleReconnectButtonClick clicked and in callback to setState webSocketConnected', this.state.webSocketConnected);
      });
    }

    render() {
      return (
        <div>
          <div
            style={{ color: 'black', borderColor: 'black', height: '30px', width: '50px' }}
            onClick={this.handleReconnectButtonClick}
          >
            Action Cable Button
          </div>
        </div>);
    }
  }


  function mapStateToProps(state) {
    console.log('in ActioncableManager mapStateToProps state', state);
    return {
      authenticated: state.auth.authenticated,
      email: state.auth.email
    };
  // find out if currently logged in
  //*************state.auth.authenticated change from HOC lesson
  }
  return connect(mapStateToProps)(ActioncableManager);
}

// ActioncableManager.propTypes = {
//   router: PropTypes.object
// };

// in some other location.. not in this file
// we want to use this authentication
//import ActioncableManager
//import Resources //component we want to wrap

// const ComposedComponent = ActioncableManager(Resources);

// <ComposedComponent resources={resourcesList}/> // wrapped version of resources
