import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../actions';
import GoogleMap from './maps/google_map';
import Upload from './images/upload';
import MainCards from './cards/main_cards';

const initialPosition = {
  lat: 37.7952,
  lng: -122.4029
};

// Can not avoid these global variables
// lastPage set as global since setState cannot be run in renderfunctions
// ******Pagination
let lastPage = 1;
let displayedPagesArray = [];
// SET NUMBER OF PAGE BUTTONS
// WORKS WITH 4 OR 5 BUT NOT 6!!!!!!!!!!!!!
const MAX_NUM_PAGE_NUMBERS = 5;
// ******Pagination

class Results extends Component {
  constructor() {
  super();
  this.state = {
    // initialized at page 1
    // *********Pagination
    currentPage: 1,
    //******* Adjust how many to show per page here*****************
    cardsPerPage: 3,
    //*************************************************************
    // for flexible paging with ... skipping middle pages
    //firstPagingIndex is the first button
    firstPagingIndex: 0,
    // lastPagingIndex is how many paging buttons appear
    lastPagingIndex: MAX_NUM_PAGE_NUMBERS,
    // check if right arrow has been clicked then 'current class is not applied on index 0'
    rightArrowClicked: false,
    // where the current page was before click of arrows
    lastPageIndex: 0,
    lastPageInArray: 0,
    firstPageInArray: 0,
    pageBeforeDots: 0
    // *********Pagination
  };
  // this.handleClick = this.handleClick.bind(this);
}
// Pagination reference: https://stackoverflow.com/questions/40232847/how-to-implement-pagination-in-reactjs

  componentDidMount() {
    // let index = 1;
    // console.log('in results componentDidMount, index: ', index);

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

    console.log('in results componentDidMount, Offsets, north, south, east, west: ', latOffsetNorth, latOffsetSouth, lngOffsetEast, lngOffsetWest);

    const mapBounds = {
      east: (initialPosition.lng + lngOffsetEast),
      west: (initialPosition.lng + lngOffsetWest),
      north: (initialPosition.lat + latOffsetNorth),
      south: (initialPosition.lat + latOffsetSouth)
    };

    // this.props.startUpIndex();
    //initial call of fetchFlats to get initial set of flats, RIGHT NOW NOT BASED ON MAP mapBounds
    // fetchflats based on above bounds
    this.props.fetchFlats(mapBounds);
    if (this.props.auth.authenticated) {
      this.props.fetchLikesByUser();
    }
  }

  // componentDidUpdate() {
  //   // this.setState({ componentUpdated: true });
  // }

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
    console.log('in results renderMap, flats empty: ', flatsEmpty);
    console.log('in results renderMap, mapDimensions empty: ', mapDimensionsEmpty);

    if (!flatsEmpty) {
      if (!mapDimensionsEmpty) {
        console.log('in results, renderMap this.props.mapDimensions, mapBounds: ', this.props.mapDimensions.mapDimensions.mapBounds);
        console.log('in results, this.props.mapDimensions, mapCenter.lat: ', this.props.mapDimensions.mapDimensions.mapCenter.lat());
        console.log('in results, this.props.mapDimensions, mapCenter.lng: ', this.props.mapDimensions.mapDimensions.mapCenter.lng());
        console.log('in results, this.props.mapDimensions, mapZoom: ', this.props.mapDimensions.mapDimensions.mapZoom);
      }
      // const { id } = this.props.flats[0];
      // console.log('in results renderFlats, id: ', id);
      console.log('here is the average lat lng, results from calculateLatLngAve: ', this.calculateLatLngAve(this.props.flats));
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
    } // if not empty
  }

  //*********************PAGINATION****************************************
  //*******************************************************************************
  // THIS IS THE SAME CODE AS SRC/COMPONENTS/PAGINATION/PAGINATION AS OF 6/22/2018
  // PAGINATION.JS CAN BE USED IF CURRENT PAGE IS SET IN APP STATE
  // removes class 'current' from previously hightlighted button
  removeCurrent() {
    // find element with class current
    const currentPageLi = document.getElementsByClassName('current');
    //if exists, remove current from class
    if (currentPageLi[0]) {
      // console.log('in results, removeCurrent, currentPageLi[0]: ', currentPageLi[0]);
      currentPageLi[0].classList.remove('current');
    }
  }

  // finds element with id of current page and adds 'current' to class
  addCurrent() {
    const currentLi = document.getElementById(this.state.currentPage);
    // console.log('in results addCurrent, currentLi: ', currentLi);
    currentLi.classList.add('current');
  }

  handlePageClick(event) {
    // Basic concept: when page clicked, add current to class of button;
    // then setState currentPage to id of clicked button
    // Set other state for smooth incrementing of current buttons
    // remove current class from last selected page
    this.removeCurrent();

    // console.log('in results renderPageNumbers, handlePageClick, event.target: ', event.target);
    // add current class to clicked button
    const clickedPages = event.target.classList.add('current');
    // clickedPagesArray.push(clickedPages);
    // console.log('in results, handlePageClick, event: ', event.target.classList);
    // console.log('in results, handlePageClick, currentPageLi: ', currentPageLi);
    // set clicked page as currentPage in component state
    this.setState({
      currentPage: Number(event.target.id),
    }, () => {
      // set state if click is not on 1 or lastPage (no real meaning but keep)
      if (this.state.currentPage !== 1 || this.state.currentPage !== lastPage) {
        const lastPageIndex = displayedPagesArray.indexOf(this.state.currentPage);
        const pageBeforeDots = displayedPagesArray[(MAX_NUM_PAGE_NUMBERS - 3)];
        this.setState({
          // -2 to adjust to index and to set back index by one
          lastPageIndex,
          pageBeforeDots
          // lastPageIndex: ((this.state.currentPage - 2) < 0) ? 0 : this.state.currentPage - 2
        }, () => {
          // console.log('in results handlePageClick, after setState, lpi, this.state.lastPageIndex: ', this.state.lastPageIndex)
          // console.log('in results handlePageClick, after setState, this.state: ', this.state)
          // console.log('in results handlePageClick, after setState, displayedPagesArray: ', displayedPagesArray)
        });
      }
      // if the clicked button is the last page, set first and last of array
      // as index last page minus number of buttons and last as last
      // console.log('in results handlePageClick, before if lastPage, this.state.currentPage: ', this.state.currentPage)
      // if lastPage is clicked, skip displayedPagesArray to MAX_NUM_PAGE_NUMBERS and lastPage
      // last page is taken from i in for loop in renderPaginatino
      if (this.state.currentPage === lastPage) {
        this.setState({
          firstPagingIndex: (lastPage - (MAX_NUM_PAGE_NUMBERS)),
          lastPagingIndex: lastPage,
        }, () => {
          console.log('in results handlePageClick, before if lastPage, displayedPagesArray: ', displayedPagesArray)
        })
        }
      }); // end of first setState
  }
  // decrement index and change the current paging array
  decrementPagingIndex() {
    // purpose of function is to shift displayedPagesArray under certain conditions
    // lastPage is num, MAX_NUM_PAGE_NUMBERS is num, -1 to convert to index
    // first check if current page (already decremented by one) fits on last set of buttons with no ...
    console.log('in results decrementPagingIndex, displayedPagesArray: ', displayedPagesArray);
    if (this.state.currentPage < (lastPage - (MAX_NUM_PAGE_NUMBERS - 1))) {
      // and current page is the first before ..., specify that position
      console.log('in results decrementPagingIndex, first if cp fpi lpi <, : ', this.state.currentPage, this.state.firstPagingIndex, this.state.lastPagingIndex);
      if (this.state.currentPage === lastPage - MAX_NUM_PAGE_NUMBERS) {
        console.log('in results decrementPagingIndex, second if this.state.currentPage ===, lastPagingIndex: ', this.state.currentPage, this.state.firstPagingIndex, this.state.lastPagingIndex);
        console.log('in results decrementPagingIndex, second if lastPage, MAX_NUM_PAGE_NUMBERS: ', lastPage, MAX_NUM_PAGE_NUMBERS);
        this.setState({
          firstPagingIndex: (this.state.firstPagingIndex - (MAX_NUM_PAGE_NUMBERS - 2)),
          lastPagingIndex: (this.state.lastPagingIndex - (MAX_NUM_PAGE_NUMBERS - 2)),
        }, () => {
          console.log('in results decrementPagingIndex, this.state.currentPage, lastPagingIndex: ', this.state.firstPagingIndex, this.state.lastPagingIndex);
          // const currentLi = document.getElementById(this.state.currentPage);
          // currentLi.classList.add('current');
          this.addCurrent();
        });
       // end of second if
     } else {
       // if not the first before ..., then simply decrement by one
       this.setState({
         firstPagingIndex: (this.state.firstPagingIndex - 1),
         lastPagingIndex: (this.state.lastPagingIndex - 1),
       }, () => {
         console.log('in results decrementPagingIndex, this.state.currentPage: ', this.state.firstPagingIndex, this.state.lastPagingIndex );
         // const currentLi = document.getElementById(this.state.currentPage);
         // currentLi.classList.add('current');
         this.addCurrent();
       });
     }
      // this.removeCurrent();
    } else {
      // end of first if
      // if currentPage fits in last set of pages and not the last in set then just addCurrent
      // to the already decremented paging button
      console.log('in results decrementPagingIndex, first else, cp: ', this.state.currentPage);
      this.addCurrent();
    }
  }

  // increment index and change the current paging array
  // purpose of function is to shift displayedPagesArray under certain conditions
  // atPageBeforeDots is a misnomer, it means it is right before the last set of buttons
  incrementPagingIndex(atPageBeforeDots) {
    if (!atPageBeforeDots) {
      //if at page button right before the dots..., increment paging index to get new array
      this.setState({
        firstPagingIndex: (this.state.firstPagingIndex + 1),
        lastPagingIndex: (this.state.lastPagingIndex + 1),
      }, () => {
        console.log('in results incrementPagingIndex, if this.state.currentPage: ', this.state.currentPage);
        // const currentLi = document.getElementById(this.state.currentPage);
        // currentLi.classList.add('current');
        this.addCurrent();
      });
    } else {
      // if at before the ..., get a new array in the last set of paging buttons
      // Needs to shift by MAX_NUM_PAGE_NUMBERS - 2 to present full last set
      console.log('in results incrementPagingIndex, else displayedPagesArray[0]: ', displayedPagesArray[0]);
      this.setState({
        firstPagingIndex: (this.state.firstPagingIndex + (MAX_NUM_PAGE_NUMBERS - 2)),
        lastPagingIndex: (this.state.lastPagingIndex + (MAX_NUM_PAGE_NUMBERS - 2))
      }, () => {
        // then set current page to first page in new array
        this.setState({
          currentPage: displayedPagesArray[0]
        }, () => {
          console.log('in results incrementPagingIndex, else this.state.currentPage: ', this.state.currentPage);
          console.log('in results incrementPagingIndex, displayedPagesArray: ', displayedPagesArray);
          // const currentLi = document.getElementById(this.state.currentPage);
          // currentLi.classList.add('current');
          this.addCurrent();
        })
      });
    }
  }
  // executes when single left arrow clicked
  handleLeftPageClick() {
    //if page at two or greater then reduce currentPage by 1
    // console.log('in results handleLeftPageClick, displayedPagesArray: ', displayedPagesArray);
    const firstPageInArray = displayedPagesArray[0];
    // console.log('in results handleLeftPageClick, firstPageInArray: ', firstPageInArray);
    // does nothing if currentPage is 1
    if (this.state.currentPage >= 2) {
      this.removeCurrent();
      // decrements currentPageIndex
      this.setState({
        currentPage: (this.state.currentPage - 1)
      }, () => {
        // console.log('in results handleLeftPageClick, this.state.firstPagingIndex, lastPagingIndex: ', this.state.firstPagingIndex, this.state.lastPagingIndex);
        // console.log('in results handleLeftPageClick, lastPage: ', lastPage);
        // console.log('in results handleLeftPageClick, setState callback this.state.currentPage: ', this.state.currentPage);

        // if first element in array (number not index) greater than equal to 2,
        // if MAX_NUM_PAGE_NUMBERS is 5
        // possible double checking, but MAX_NUM_PAGE_NUMBERS make it flexible
        // addCurrent needs to be called after setState as is async; set in decrementPagingIndex
        if (firstPageInArray >= (MAX_NUM_PAGE_NUMBERS - 3)) {
          // if currentPage is not yet at firstPageInArray,
          // just add current to already incremented currentPage
          if (this.state.currentPage >= firstPageInArray) {
            this.addCurrent();
          } else {
            // else shift array
            console.log('in results handleLeftPageClick, if cp >= mnpn -1, cp: ', this.state.currentPage);
            this.decrementPagingIndex();
          }
        } else if (firstPageInArray === 2) {
          // else if for second if
          console.log('in results handleLeftPageClick, else if this.state.currentPage: ', this.state.currentPage);
          this.setState({
            firstPagingIndex: (this.state.firstPagingIndex - 1),
            lastPagingIndex: (this.state.lastPagingIndex - 1),
          }, () => {
            console.log('in results handleLeftPageClick, else if displayedPagesArray: ', displayedPagesArray);
            this.addCurrent();
          });
        } else {
          this.addCurrent();
        }
      });// end of first setState
    } // end of first if
  }

  handleRightPageClick() {
     // if currentPage is less than last page, right click does nothing
     // displayedPagesArray is a global variable
    const lastPageIndex = displayedPagesArray.indexOf(this.state.currentPage);
    const firstPageInArray = displayedPagesArray[0];
    const lastPageInArray = displayedPagesArray[(MAX_NUM_PAGE_NUMBERS - 1)];
    const pageBeforeDots = displayedPagesArray[(MAX_NUM_PAGE_NUMBERS - 3)];
    console.log('in results handleRightPageClick, currentPageIndex: ', lastPageIndex);
    // console.log('in results handleRightPageClick, before set state displayedPagesArray: ', displayedPagesArray);

    if (this.state.currentPage < lastPage) {
      // removes class 'current'
      this.removeCurrent();
      // key moves current page by one (not index), lastpage index is
      this.setState({
        currentPage: (this.state.currentPage + 1),
        lastPageIndex,
        firstPageInArray,
        lastPageInArray,
        pageBeforeDots,
        // firstPagingIndex: (this.state.firstPagingIndex + 1),
        // lastPagingIndex: (this.state.lastPagingIndex + 1),
        // set to true so that index === does not become current
        rightArrowClicked: true
      }, () => {
        // in callback of setState
        // const firstInLastSet = lastPage - (MAX_NUM_PAGE_NUMBERS - 1);
        console.log('in results handleRightPageClick, this.state: ', this.state);
        console.log('in results handleRightPageClick, after setState, displayedPagesArray: ', displayedPagesArray);
        // const currentLi = document.getElementById(this.state.currentPage);
        // function to do currentLi.classList.add('current');
        // ***************key logic for advancing pages one by one or moving array
        // if pagebefore dots in this pages array is before last set of pages
        if (this.state.pageBeforeDots < (lastPage - (MAX_NUM_PAGE_NUMBERS))) {
          console.log('in results handleRightPageClick, < if this.state.pageBeforeDots: ', this.state.pageBeforeDots);
          console.log('in results handleRightPageClick, < if this.state: ', this.state);
          // console.log('in results handleRightPageClick, if (lastPage - (MAX_NUM_PAGE_NUMBERS - 1)): ', (lastPage - (MAX_NUM_PAGE_NUMBERS - 1)));
          // as long as not in the last set and last page index was is 2 or increment array
          if ((this.state.lastPageIndex) === (MAX_NUM_PAGE_NUMBERS - 3)) {
            console.log('in results handleRightPageClick, if pageBeforeDots <, if lastpagei === pbd: ', this.state.pageBeforeDots);
            console.log('in results handleRightPageClick, if pageBeforeDots <, if lastpagei === lpi: ', this.state.lastPageIndex);
            const atPageBeforeDots = false;
            this.incrementPagingIndex(atPageBeforeDots);
          } else {
            // otherwise, add current
            console.log('in results handleRightPageClick, else pageBeforeDots <, if lastpage === lpi: ', this.state.lastPageIndex);
            console.log('in results handleRightPageClick, else pageBeforeDots <, if lastpage === pbd: ', this.state.pageBeforeDots);
            this.addCurrent();
          }
          // else if pagebefore dots in this array of pages
          // equals the first in the last set of pages
        } else if ((this.state.pageBeforeDots === (lastPage - MAX_NUM_PAGE_NUMBERS)) && (this.state.pageBeforeDots === this.state.currentPage - 1)) {
          // if pageBeforeDots is last one before last set AND
          // before clicked, currentPage was at pageBeforeDots
          console.log('in results handleRightPageClick, else pageBeforeDots <, first else if lastpage === pbd: ', this.state.pageBeforeDots);
          console.log('in results handleRightPageClick, else if === this.state: ', this.state);
          const atPageBeforeDots = true;
          this.incrementPagingIndex(atPageBeforeDots);
        } else {
          console.log('in results handleRightPageClick, in else this.state: ', this.state);
          this.addCurrent();
        }
        // **********************
      }); // end of setState
    }
  }

  renderPageNumbers(pageNumbersArray) {
    // pageNumbersArray ? pageNumbersArray : [];
    console.log('in results renderPageNumbers, pageNumbersArray: ', pageNumbersArray);
    // cannot set state here...
      // renders ... button if last page is longer than MAX_NUM_PAGE_NUMBERS
      // otherwise, just static without ...
      displayedPagesArray = pageNumbersArray.slice(this.state.firstPagingIndex, this.state.lastPagingIndex);

      if (lastPage > MAX_NUM_PAGE_NUMBERS) {
        // firstPagingIndex is the first page to be showing
        // lastPagingIndex is how many paging boxes to show, so
        console.log('in results renderPageNumbers, displayedPagesArray: ', displayedPagesArray);

        return displayedPagesArray.map((pageNumber, index) => {
          console.log('in results renderPageNumbers, pageNumber, index: ', pageNumber, index);
          if (index === 0) {
            //if right arrow has been clicked, don't automatically assign current to class
            if (this.state.rightArrowClicked) {
              return (
                <li key={index} id={pageNumber} onClick={this.handlePageClick.bind(this)}>{pageNumber}</li>
              );
            }
            // if fresh page and right arrow has not been clicked, assign current to class
            return (
              <li key={index} id={pageNumber} className="current" onClick={this.handlePageClick.bind(this)}>{pageNumber}</li>
            );
          } else if (index <= (MAX_NUM_PAGE_NUMBERS - 3)) {
            // if index less than or equal to render the actual page numbers
            return (
              <li key={index} id={pageNumber} onClick={this.handlePageClick.bind(this)}>{pageNumber}</li>
            );
          } else if (index === MAX_NUM_PAGE_NUMBERS - 2) {
            //if last two pages buttons, either render ... or the page number
            if (pageNumber === lastPage - 1) {
              return (
                <li key={index} id={pageNumber} onClick={this.handlePageClick.bind(this)}>{pageNumber}</li>
              );
            }
            return (
              <li key={index}>...</li>
            );
          } else {
            //if all else, render the last page number
            return (
              <li key={index} id={lastPage} onClick={this.handlePageClick.bind(this)}>{lastPage }</li>
            );
          }
        });
      } else {
        // if there are only pages less than MAX_NUM_PAGE_NUMBERS, then no flexible pagination
        return pageNumbersArray.map((pageNumber, index) => {
          console.log('in results renderPageNumbers, pageNumber, index: ', pageNumber, index);
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
  }
  // When double left arrow is clicked, move current page to 1 and the displayed array
  // to the first of the original array and the last index to MAX_NUM_PAGE_NUMBERS
  handleDoubleLeftPageClick() {
    this.removeCurrent();
    this.setState({
      currentPage: 1,
      firstPagingIndex: 0,
      lastPagingIndex: MAX_NUM_PAGE_NUMBERS
    }, () => {
      this.addCurrent();
    });
  }

  renderDoubleLeftArrow() {
    // if (this.state.currentPage >= (lastPage - (MAX_NUM_PAGE_NUMBERS - 1)) && (lastPage > MAX_NUM_PAGE_NUMBERS)) {
    // Double left appears only in flexible pagination with ... and when current page is 3 or more
    if (this.state.currentPage >= 3 && (lastPage > MAX_NUM_PAGE_NUMBERS)) {
      return (
        <li onClick={this.handleDoubleLeftPageClick.bind(this)}><i className="fa fa-angle-double-left"></i></li>
      );
    }
  }

  renderPagination() {
      // check if flats is empty of objects
      const flatsEmpty = _.isEmpty(this.props.flats);
      // console.log('in results renderPagination, outside of if, flatsEmpty: ', flatsEmpty);
    if (!flatsEmpty) {
      // destructure initialized state variables
      const { cardsPerPage } = this.state;
      // console.log('in results renderPagination, flatsEmpty: ', flatsEmpty);
      // console.log('in results renderPagination, currentPage: ', currentPage);
      // console.log('in results renderPagination, cardsPerPage: ', cardsPerPage);
      // cards are for flats
      const cards = this.props.flats;
      // console.log('in results renderPagination, cards: ', cards);
      // reference: https://stackoverflow.com/questions/39336556/how-can-i-slice-an-object-in-javascript/45195659
      // slicing the first two values
      // const slicedCards = Object.entries(cards).slice(0, 2);
      // console.log('in results renderPagination, slicedCards: ', slicedCards);
      // get the index of the last card to be display on the page
      // eg. if page one, and three cards on page, index is two
      // const indexOfLastCard = currentPage * cardsPerPage;
      // const indexOfFirstCard = indexOfLastCard - cardsPerPage;
      // const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);
      // get page numbers to be displayed based on number of total cards and cards per page
      const pageNumbersArray = [];
      for (let i = 1; i <= Math.ceil(Object.keys(cards).length / cardsPerPage); i++) {
        pageNumbersArray.push(i);
        // console.log('in results renderPagination, pageNumbers: ', i);
        // if i equal number of cards/cards per page, then assign i to last page
        if (i === Math.ceil(Object.keys(cards).length / cardsPerPage)) {
          // lastpage is  a global variable
          lastPage = i;
          console.log('in results renderPagination, if i === ... i lastPage: ', i, lastPage);
        }
      }
      // console.log('in results renderPagination, lastPage: ', lastPage);
      // console.log('in results renderPagination, pageNumbers: ', pageNumbersArray);      // this.renderPageNumbers(pageNumbers)
      if (pageNumbersArray.length > 1) {
        return (
          <div>
            <ul className="pagination">
              {this.renderDoubleLeftArrow()}
              <li onClick={this.handleLeftPageClick.bind(this)}><i className="fa fa-angle-left"></i></li>
                {this.renderPageNumbers(pageNumbersArray)}
              <li onClick={this.handleRightPageClick.bind(this)}><i className="fa fa-angle-right"></i></li>
            </ul>
          </div>
        );
      }
    }
  }
  //*******************************************************************************
  //*********************PAGINATION****************************************

  renderFlats() {
    let index = 1;
    console.log('in results renderFlats, flats data length: ', this.props.flats);
    const flatsEmpty = _.isEmpty(this.props.flats);
    const mapDimensionsEmpty = _.isEmpty(this.props.mapDimensions);
    console.log('in results renderFlats, flats empty: ', flatsEmpty);
    console.log('in results renderFlats, this.props.startUpCount.startUpCount: ', this.props.startUpCount.startUpCount);
    // const randomNum = _.random(0, 1);
    // console.log('in results renderFlats, randomNum: ', randomNum);

      // if (!flatsEmpty && randomNum === 1) {
      if (!flatsEmpty) {
        // console.log('in results renderFlats, this.props.flats.rooms: ', this.props.flats.rooms);
        // const { id } = this.props.flats[0];
        // console.log('in results renderFlats, id: ', id);
        const { currentPage, cardsPerPage } = this.state;
        // console.log('in results renderPagination, flatsEmpty: ', flatsEmpty);
        // console.log('in results renderPagination, currentPage: ', currentPage);
        // console.log('in results renderPagination, cardsPerPage: ', cardsPerPage);
        const cards = this.props.flats;
        console.log('in results renderPagination, cards: ', cards);
        // Logic for displaying todos
        const indexOfLastCard = currentPage * cardsPerPage;
        const indexOfFirstCard = indexOfLastCard - cardsPerPage;
        //slice reference: https://stackoverflow.com/questions/39336556/how-can-i-slice-an-object-in-javascript
        const slicedCards = Object.entries(cards).slice(indexOfFirstCard, indexOfLastCard).map(entry => entry[1]);
        // console.log('in results renderFlats, slicedCards, currentPage: ', currentPage);
        // console.log('in results renderFlats, slicedCards, indexOfFirstCard: ', indexOfFirstCard);
        // console.log('in results renderFlats, slicedCards, indexOfLastCard: ', indexOfLastCard);
        // console.log('in results renderFlats, slicedCards: ', slicedCards);
        const mappedSlicedCards = _.mapKeys(slicedCards, 'id');

        const flats = mappedSlicedCards;
        // const flats = this.props.flats;
        console.log('in results renderFlats, slicedCards, slicedCards: ', slicedCards);
        console.log('in results renderFlats, slicedCards, mappedSlicedCards: ', mappedSlicedCards);
        console.log('in results renderFlats, slicedCards, this.props.flats: ', this.props.flats);

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
          // <div>{console.log('in results renderFlats, flats: ', flats)}</div>
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
  console.log('in results mapStateToProps: ', state);
  return {
    message: state.auth.message,
    flats: state.flats.flatsResults,
    startUpCount: state.startUpCount,
    mapDimensions: state.mapDimensions,
    // likes: state.likes.userLikes,
    likes: state.flats.userLikes,
    auth: state.auth
   };
}

export default connect(mapStateToProps, actions)(Results);