import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../actions';
import GoogleMap from './google_map';
import Upload from './images/upload';
import MainCards from './cards/main_cards';

const publicId = ['RPP9419_mp7xjn', 'redbrick_bklymp', 'dewhirst_electric_co_lofts-01_oxgife', 'flat_image-1523948892-1', 'flat_image-1523948892-0'];


class Feature extends Component {
  constructor(props) {
      super(props);
      // this.state = {
      //     isFetching: false
      // };
  }


  componentDidMount() {
    let index = 1;
    console.log('in feature componentDidMount, index: ', index);
    // this.setState({ isFetching: true });
    // this.props.fetchMessage();
    this.props.fetchFlats();
    // if (this.props.flats) {
    //   this.setState({ isFetching: false });
    // }
    index = index + 1;
    console.log('in feature componentDidMount, index after running: ', index);
  }

  // componentWillReceiveProps() {
  // }

  renderFlats() {
    let index = 1;
    console.log('in feature renderFlats, index: ', index);
    console.log('in feature renderFlats, flats data length: ', this.props.flats);
    const flatsEmpty = _.isEmpty(this.props.flats);
    console.log('in feature renderFlats, flats empty: ', flatsEmpty);

      if (!flatsEmpty) {
        // const { id } = this.props.flats[0];
        // console.log('in feature renderFlats, id: ', id);
        const flats = this.props.flats;
        return _.map(flats, (flat) => {
            return (
              // <span>{flat.id}</span>
              // <span> {flat.lng}</span>
              // <span> {flat.images}</span>
              <div>
                <MainCards
                  id={flat.id}
                  area={flat.area}
                  bath={flat.bath}
                  beds={flat.beds}
                  rooms={flat.rooms}
                  flat_type={flat.flat_type}
                  description={flat.description}
                  guests={flat.guests}
                  lat={flat.lat}
                  lng={flat.lng}
                  price_per_day={flat.price_per_day}
                  price_per_month={flat.price_per_month}
                  currency='$'
                  sales_point={flat.sales_point}
                  images={flat.images}
                />
              </div>
            );
          });
          // <div>{console.log('in div: ', flats)}</div>
      } else {
        return (
          <div>
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
            <div className="spinner">Loading...</div>
          </div>
        );
      }
    index = index + 1;
    console.log('in feature renderFlats, index after running: ', index);
  }

  render() {
    // const { isFetching } = this.state;
    // console.log('in feature, flats data, images: ', this.props.flats[0].images);
    // return <div>{this.props.message}</div>;
    return (
      // {
      //   isFetching ? <div>Loading</div> : (
      //
      //   )
      // }
      <div>
        <div className="container" id="map">
          <GoogleMap />
        </div>

        <div className="container main-card-container">
          <div className="row card-row">
            {this.renderFlats()}
          </div>
        </div>
        <Upload />

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    message: state.auth.message,
    flats: state.flats
   };
}

export default connect(mapStateToProps, actions)(Feature);
