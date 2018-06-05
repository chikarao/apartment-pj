import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../actions';
import GoogleMap from './maps/google_map';
import Upload from './images/upload';
import MainCards from './cards/main_cards';

// const publicId = ['RPP9419_mp7xjn', 'redbrick_bklymp', 'dewhirst_electric_co_lofts-01_oxgife', 'flat_image-1523948892-1', 'flat_image-1523948892-0'];

const initialPosition = {
  lat: 37.7952,
  lng: -122.4029
};

let lastPage = 1;

class Feature extends Component {
  constructor() {
  super();
  this.state = {
    currentPage: 1,
    //******* Adjust how many to show per page here*****************
    cardsPerPage: 3
    //*************************************************************
  };
  // this.handleClick = this.handleClick.bind(this);
}
// Pagination reference: https://stackoverflow.com/questions/40232847/how-to-implement-pagination-in-reactjs

  componentDidMount() {
    // let index = 1;
    // console.log('in feature componentDidMount, index: ', index);

    // Set up initial mapBounds to make Mapbounds not undefined in action fetchFlats
    // When able to obtain user location or search location, enter initial position here
    // SF Transamerica touwer

    // initial position offsets; based on zoom twelve of
    //SF area showing tip of marin counth, tip of the sf peninsula, and tip of oakland
    // const latOffsetNorth = 0.06629999999999825;
    // const latOffsetSouth = -0.036700000000003286;
    // const lngOffsetWest = -0.13469999999999516;
    // const lngOffsetEast = 0.11589000000000738;
    // wider offsets; reaches Oakland
    const latOffsetNorth = 0.06629999999999825;
    const latOffsetSouth = -0.036700000000003286;
    const lngOffsetWest = -0.14;
    const lngOffsetEast = 0.2;
    // const latOffsetNorth = 37.8615 - initialPosition.lat; //about .07
    // const latOffsetSouth = 37.7585 - initialPosition.lat; // about -.04
    // const lngOffsetWest = -122.28701 - initialPosition.lng; //about .12
    // const lngOffsetEast = -122.5376 - initialPosition.lng; // about -.13

    console.log('in feature componentDidMount, Offsets, north, south, east, west: ', latOffsetNorth, latOffsetSouth, lngOffsetEast, lngOffsetWest);

    const mapBounds = {
      east: (initialPosition.lng + lngOffsetEast),
      west: (initialPosition.lng + lngOffsetWest),
      north: (initialPosition.lat + latOffsetNorth),
      south: (initialPosition.lat + latOffsetSouth)
    };

    this.props.startUpIndex();
    //initial call of fetchFlats to get initial set of flats, RIGHT NOW NOT BASED ON MAP mapBounds
    // fetchflats based on above bounds
    this.props.fetchFlats(mapBounds);
    this.props.fetchLikesByUser();
  }

  // componentWillReceiveProps() {
  // }
  calculateLatLngAve(flats) {
    let totalLat = 0;
    let totalLng = 0;
    let totalNumFlats = 0;
    _.map(flats, (flat) => {
      if (flat.lat && flat.lng) {
        totalLat += flat.lat;
        totalLng += flat.lng;
        totalNumFlats++;
      }
    });
    const aveLat = totalLat / totalNumFlats;
    const aveLng = totalLng / totalNumFlats;
    return (
      {
        lat: aveLat,
        lng: aveLng
      }
    );
  }

  renderMap() {
    const flatsEmpty = _.isEmpty(this.props.flats);
    const mapDimensionsEmpty = _.isEmpty(this.props.mapDimensions);
    console.log('in feature renderMap, flats empty: ', flatsEmpty);
    console.log('in feature renderMap, mapDimensions empty: ', mapDimensionsEmpty);

    if (!flatsEmpty) {
      if (!mapDimensionsEmpty) {
        console.log('in feature, renderMap this.props.mapDimensions, mapBounds: ', this.props.mapDimensions.mapDimensions.mapBounds);
        console.log('in feature, this.props.mapDimensions, mapCenter.lat: ', this.props.mapDimensions.mapDimensions.mapCenter.lat());
        console.log('in feature, this.props.mapDimensions, mapCenter.lng: ', this.props.mapDimensions.mapDimensions.mapCenter.lng());
        console.log('in feature, this.props.mapDimensions, mapZoom: ', this.props.mapDimensions.mapDimensions.mapZoom);
      }
      // const { id } = this.props.flats[0];
      // console.log('in feature renderFlats, id: ', id);
      console.log('here is the average lat lng, feature from calculateLatLngAve: ', this.calculateLatLngAve(this.props.flats));
      const latLngAve = this.calculateLatLngAve(this.props.flats);
      console.log('here is latLngAve: ', latLngAve);

      return (
        <div>
          <GoogleMap
            // key={'1'}
            flatsEmpty={flatsEmpty}
            flats={this.props.flats}
            initialPosition={latLngAve || initialPosition}
            currency='$'
          />
        </div>
      );
      // <div>{console.log('in div: ', flats)}</div>
    } else if (!mapDimensionsEmpty) {
      // return <div>Map Goes Here</div>;
      const emptyMapLatLngCenter = {
        lat: this.props.mapDimensions.mapDimensions.mapCenter.lat(),
        lng: this.props.mapDimensions.mapDimensions.mapCenter.lng()
      };
      return (
        <div>
          <GoogleMap
           flatsEmpty={flatsEmpty}
           flats={flatsEmpty ? this.props.flats : emptyMapLatLngCenter}
           // initialPosition={emptyMapLatLngCenter}
           initialZoom={this.props.mapDimensions.mapDimensions.mapZoom}
          />
        </div>
      );
    } else {
      return (
        <div>
          <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
          <div className="spinner">Loading...</div>
        </div>
      );
    }
  }

  removeCurrent() {
    const currentPageLi = document.getElementsByClassName('current');
    if (currentPageLi[0]) {
      console.log('in feature, removeCurrent, currentPageLi[0]: ', currentPageLi[0]);
      currentPageLi[0].classList.remove('current');
    }
  }

  addCurrent() {
    // refator from hnadle right and left click
    const currentLi = document.getElementById(this.state.currentPage);
    currentLi.classList.add('current');
  }

  handlePageClick(event) {
    // const currentPageLi = document.getElementsByClassName('current');
    // if (currentPageLi[0]) {
    //   console.log('in feature handlePageClick, currentPageLi[0]: ', currentPageLi[0]);
    //   currentPageLi[0].classList.remove('current');
    // }
    this.removeCurrent();

    // let clickedPagesArray = [];
    // console.log('in feature renderPageNumbers, handlePageClick, event: ', event);
    const clickedPages = event.target.classList.add('current');
    // clickedPagesArray.push(clickedPages);
    console.log('in feature, handlePageClick, event: ', event.target.classList);
    // console.log('in feature, handlePageClick, currentPageLi: ', currentPageLi);
    this.setState({
      currentPage: Number(event.target.id)
      }, () => console.log('in feature handleLeftPageClick, this.state.currentPage: ', this.state.currentPage)
    );
  }

  handleLeftPageClick() {
    if (this.state.currentPage >= 2) {
      this.removeCurrent();
      this.setState({
        currentPage: (this.state.currentPage - 1)
      }, () => {
        console.log('in feature handleLeftPageClick, this.state.currentPage: ', this.state.currentPage);
        // const currentLi = document.getElementById(this.state.currentPage);
        // currentLi.classList.add('current');
        this.addCurrent();
      });
    }
  }

  handleRightPageClick() {
     // console.log('in feature handleRightPageClick, this.state.currentPage: ', this.state.currentPage);
     console.log('in feature handleRightPageClick, lastpage: ', lastPage);
    if (this.state.currentPage < lastPage) {
      this.removeCurrent();
      this.setState({
        currentPage: (this.state.currentPage + 1)
      }, () => {
        console.log('in feature handleLeftPageClick, this.state.currentPage: ', this.state.currentPage);
        // const currentLi = document.getElementById(this.state.currentPage);
        // currentLi.classList.add('current');
        this.addCurrent();
      });
    }
  }

  renderPageNumbers(pageNumbersArray) {
    // pageNumbersArray ? pageNumbersArray : [];
    console.log('in feature renderPageNumbers, pageNumbersArray: ', pageNumbersArray);
      console.log('in feature renderPageNumbers, pageNumbersArray: ', pageNumbersArray);
      return pageNumbersArray.map((pageNumber, index) => {
        console.log('in feature renderPageNumbers, pageNumber, index: ', pageNumber, index);
        if (index === 0) {
          return (
            <li key={index} id={pageNumber} className="current" onClick={this.handlePageClick.bind(this)}>{pageNumber}</li>
          );
        } else {
          return (
            <li key={index} id={pageNumber} onClick={this.handlePageClick.bind(this)}>{pageNumber}</li>
          );
        }
    });
  }

  renderPagination() {
      const flatsEmpty = _.isEmpty(this.props.flats);
      // console.log('in feature renderPagination, outside of if, flatsEmpty: ', flatsEmpty);
    if (!flatsEmpty) {
      const { currentPage, cardsPerPage } = this.state;
      // console.log('in feature renderPagination, flatsEmpty: ', flatsEmpty);
      // console.log('in feature renderPagination, currentPage: ', currentPage);
      // console.log('in feature renderPagination, cardsPerPage: ', cardsPerPage);
      const cards = this.props.flats;
      console.log('in feature renderPagination, cards: ', cards);
      const slicedCards = Object.entries(cards).slice(0, 2);
      // console.log('in feature renderPagination, slicedCards: ', slicedCards);
      // Logic for displaying todos
      const indexOfLastCard = currentPage * cardsPerPage;
      const indexOfFirstCard = indexOfLastCard - cardsPerPage;
      // const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);

      const pageNumbersArray = [];
      for (let i = 1; i <= Math.ceil(Object.keys(cards).length / cardsPerPage); i++) {
        pageNumbersArray.push(i);
        console.log('in feature renderPagination, pageNumbers: ', i);
        if (i === Math.ceil(Object.keys(cards).length / cardsPerPage)) {
          console.log('in feature renderPagination, if i === ... lastPage: ', i);
            lastPage = i;
        }
      }
      console.log('in feature renderPagination, lastPage: ', lastPage);
      console.log('in feature renderPagination, pageNumbers: ', pageNumbersArray);      // this.renderPageNumbers(pageNumbers)
      if (pageNumbersArray.length > 1) {
        return (
          <div>
            <ul className="pagination">
              <li onClick={this.handleLeftPageClick.bind(this)}><i className="fa fa-angle-double-left"></i></li>
                {this.renderPageNumbers(pageNumbersArray)}
              <li onClick={this.handleRightPageClick.bind(this)}><i className="fa fa-angle-double-right"></i></li>
            </ul>
          </div>
        );
      }
    }
  }

  renderFlats() {
    let index = 1;
    console.log('in feature renderFlats, flats data length: ', this.props.flats);
    const flatsEmpty = _.isEmpty(this.props.flats);
    const mapDimensionsEmpty = _.isEmpty(this.props.mapDimensions);
    console.log('in feature renderFlats, flats empty: ', flatsEmpty);
    console.log('in feature renderFlats, this.props.startUpCount.startUpCount: ', this.props.startUpCount.startUpCount);
    // const randomNum = _.random(0, 1);
    // console.log('in feature renderFlats, randomNum: ', randomNum);

      // if (!flatsEmpty && randomNum === 1) {
      if (!flatsEmpty) {
        // console.log('in feature renderFlats, this.props.flats.rooms: ', this.props.flats.rooms);
        // const { id } = this.props.flats[0];
        // console.log('in feature renderFlats, id: ', id);
        const { currentPage, cardsPerPage } = this.state;
        // console.log('in feature renderPagination, flatsEmpty: ', flatsEmpty);
        // console.log('in feature renderPagination, currentPage: ', currentPage);
        // console.log('in feature renderPagination, cardsPerPage: ', cardsPerPage);
        const cards = this.props.flats;
        console.log('in feature renderPagination, cards: ', cards);
        // Logic for displaying todos
        const indexOfLastCard = currentPage * cardsPerPage;
        const indexOfFirstCard = indexOfLastCard - cardsPerPage;
        //slice reference: https://stackoverflow.com/questions/39336556/how-can-i-slice-an-object-in-javascript
        const slicedCards = Object.entries(cards).slice(indexOfFirstCard, indexOfLastCard).map(entry => entry[1]);
        // console.log('in feature renderFlats, slicedCards, currentPage: ', currentPage);
        // console.log('in feature renderFlats, slicedCards, indexOfFirstCard: ', indexOfFirstCard);
        // console.log('in feature renderFlats, slicedCards, indexOfLastCard: ', indexOfLastCard);
        // console.log('in feature renderFlats, slicedCards: ', slicedCards);
        const mappedSlicedCards = _.mapKeys(slicedCards, 'id');

        const flats = mappedSlicedCards;
        // const flats = this.props.flats;
        console.log('in feature renderFlats, slicedCards, slicedCards: ', slicedCards);
        console.log('in feature renderFlats, slicedCards, mappedSlicedCards: ', mappedSlicedCards);
        console.log('in feature renderFlats, slicedCards, this.props.flats: ', this.props.flats);

        return _.map(flats, (flat) => {
            return (

              <div key={flat.id.toString()}>
                <MainCards
                  // key={flat.id.toString()}
                  flat={flat}
                  likes={this.props.likes}
                  currency='$'
                  showFlat={false}
                  authenticated={this.props.auth.authenticated}
                />
              </div>
            );
          });
          // <div>{console.log('in feature renderFlats, flats: ', flats)}</div>
          // this.props.startUpIndex();
      } else if (this.props.startUpCount.startUpCount !== 0) {
        return <div className="no-results-message">No flats in that area or with that criteria. <br/>Please search again!</div>;
      } else {
        return (
          <div>
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
            <div className="spinner">Loading flats...</div>
          </div>
        );
      }
  }


  render() {
    return (
      <div>
        <div className="container" id="map">
          {this.renderMap()}
        </div>

        <div className="container main-card-container">
          <div className="row card-row">
            {this.renderFlats()}
          </div>
        </div>
        <div className="pagination-container">
          {this.renderPagination()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in feature mapStateToProps: ', state);
  return {
    message: state.auth.message,
    flats: state.flats,
    startUpCount: state.startUpCount,
    mapDimensions: state.mapDimensions,
    likes: state.likes.userLikes,
    auth: state.auth
   };
}

export default connect(mapStateToProps, actions)(Feature);
