import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../actions';
import GoogleMap from './maps/google_map';
// import Upload from './images/upload';
import MainCards from './cards/main_cards';
import CitySearch from './search/city_search';
import DatePicker from './date_picker/date_picker';

import latLngOffset from './constants/lat_lng_offset';

import searchCriteria from './constants/search_criteria';
import amenities from './constants/amenities';
import AppLanguages from './constants/app_languages';

// const initialPosition = {
//   lat: 37.7952,
//   lng: -122.4029
// };

// Can not avoid these global variables
// lastPage set as global since setState cannot be run in renderfunctions
// ******Pagination
let lastPage = 1;
let displayedPagesArray = [];
// SET NUMBER OF PAGE BUTTONS
// WORKS WITH 4 OR 5 BUT NOT 6!!!!!!!!!!!!!
const MAX_NUM_PAGE_NUMBERS = 5;
// ******Pagination

// const valueNameObject = {
//   1: { name: 'size', title: '' }, 2: { name: 'bedrooms', title: 'Bedrooms' }, 3: { name: 'station', title: 'Distance from Station' }, 4: { name: 'price', title: 'Price' }
// };

class Results extends Component {
  constructor() {
  super();
  // console.log('in results constructor, searchCriteria.startMin : ', searchCriteria[1]);
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
    pageBeforeDots: 0,
    showRefineSearch: false,
    criterionName: '',
    criterionValue: 0,
    searchDisplayValueMin: '',
    searchDisplayValueMax: '',
    searchDisplayValueExact: null,
    showCriterionBox: false,
    floorSpaceMin: searchCriteria[0].startMin,
    floorSpaceMax: searchCriteria[0].startBigMax,
    bedroomsMin: searchCriteria[1].startMin,
    bedroomsMax: searchCriteria[1].startBigMax,
    bedroomsExact: null,
    stationMin: searchCriteria[2].startMin,
    stationMax: searchCriteria[2].startBigMax,
    priceMin: searchCriteria[3].startMin,
    priceMax: searchCriteria[3].startBigMax,
    startDate: searchCriteria[4].startBigMax,
    endDate: searchCriteria[5].startBigMax,
    amenitySearchArray: [],
    incrementMin: false,
    incrementMax: true,
    tabSelected: false,
    searchCriteriaInpuStarted: false,
    selectedTabArray: [],
    amenitySearchStarted: false
  };
  this.handlePageClick = this.handlePageClick.bind(this);
  this.handleDoubleLeftPageClick = this.handleDoubleLeftPageClick.bind(this);
  this.handleLeftPageClick = this.handleLeftPageClick.bind(this);
  this.handleRightPageClick = this.handleRightPageClick.bind(this);
  this.handleAmenityCheck = this.handleAmenityCheck.bind(this);
  this.handleSearchApplyClick = this.handleSearchApplyClick.bind(this);
  this.popUpCalendar = this.popUpCalendar.bind(this);
  this.hideCalendar = this.hideCalendar.bind(this);
  this.handleRefineSearchLinkClick = this.handleRefineSearchLinkClick.bind(this);
  this.handleSearchTabClick = this.handleSearchTabClick.bind(this);
  this.handleSearchClearClick = this.handleSearchClearClick.bind(this);
  this.handleMinMaxClick = this.handleMinMaxClick.bind(this);
  this.incrementSearchSpaceInput = this.incrementSearchSpaceInput.bind(this);
}
// Pagination reference: https://stackoverflow.com/questions/40232847/how-to-implement-pagination-in-reactjs

  componentDidMount() {
    const latOffsetNorth = latLngOffset.latOffsetNorth;
    const latOffsetSouth = latLngOffset.latOffsetSouth;
    const lngOffsetWest = latLngOffset.lngOffsetWest;
    const lngOffsetEast = latLngOffset.lngOffsetEast;

    let mapBounds = {};
    const object = this.props.searchFlatParams;
    const searchFlatParamsEmpty = _.isEmpty(this.props.searchFlatParams);
    // if user searches city and searchFlatParams has latlng (set when user selects city) in it
    // stores latlng and zoom for refresh and sets mapbounds based on searchFlatParams and constant offsets
      if (!searchFlatParamsEmpty && ('lat' in object)) {
        // console.log('in results componentDidMount, if !searchFlatParamsEmpty and lat in object: ', object);
        const { lat, lng, zoom } = this.props.searchFlatParams;

        // store lat lng for when page is reloaded
        localStorage.setItem('lat', lat);
        localStorage.setItem('lng', lng);
        localStorage.setItem('zoom', zoom);
        // console.log('in results componentDidMount, lat, lng: ', lat, lng);
        // console.log('in results componentDidMount, if this.props.searchFlatParams: ', this.props.searchFlatParams);
        // console.log('in results componentDidMount, if this.props.mapDimensions: ', this.props.mapDimensions);
        // console.log('in results componentDidMount, storedLat, in if storedLng: ', storedLat, storedLng);
        // set map bounds on offsets defined above
        mapBounds = {
          east: (lng + lngOffsetEast),
          west: (lng + lngOffsetWest),
          north: (lat + latOffsetNorth),
          south: (lat + latOffsetSouth),
        };
      } else {
        // retrieve lat lng when reloaded
        const storedLat = parseFloat(localStorage.getItem('lat'));
        const storedLng = parseFloat(localStorage.getItem('lng'));
        const storedZoom = parseFloat(localStorage.getItem('zoom'));
        // const mapZoom = parseFloat(localStorage.getItem('mapZoom'));
        // const searchParams = parseFloat(localStorage.getItem('searchParams'));
        // console.log('in results componentDidMount, else this.props.searchFlatParams: ', this.props.searchFlatParams);
        // console.log('in results componentDidMount, storedLat, storedLng, mapZoom: ', storedLat, storedLng);
        mapBounds = {
          east: (storedLng + lngOffsetEast),
          west: (storedLng + lngOffsetWest),
          north: (storedLat + latOffsetNorth),
          south: (storedLat + latOffsetSouth)
        };
      } // end of if else !searchFlatParamsEmpty && ('lat' in object)
      // initial call of fetchFlats to get initial set of flats, RIGHT NOW NOT BASED ON MAP mapBounds
      // fetchflats based on above bounds
      // search Attributes set in state and selected by user
      const searchAttributes = {
        price_max: this.state.priceMax,
        price_min: this.state.priceMin,
        size_min: this.state.floorSpaceMin,
        size_max: this.state.floorSpaceMax,
        bedrooms_min: this.state.bedroomsMin,
        bedrooms_max: this.state.bedroomsMax,
        bedrooms_exact: this.state.bedroomsExact,
        // bedrooms_exact: 1,
        station_min: this.state.stationMin,
        station_max: this.state.stationMax,
        date_start: this.state.startDate,
        date_end: this.state.endDate
      };
      // set app state for search parameter with serch attributes with initial values from constructor
      // You can send object to searchFlatParameters and reducer will add or update key value pairs
      this.props.searchFlatParameters(searchAttributes);
      // fetch flats
      if (this.props.searchFlatParams) {
        // if (!searchFlatParamsEmpty) {
        this.props.fetchFlats(mapBounds, this.props.searchFlatParams, () => {
        // console.log('in results componentDidMount, fetchFlats: ');
      });
      }

      if (this.props.auth.authenticated) {
        this.props.fetchLikesByUser();
      }
  }

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
    // Renders map based on 3 scenarios (if, if else, and else):
    // 1. There are already flats and flatBuildings
    // 2. There are no flats and flatBuildings but user searches city and
    // there is latlng in this.props.searchFlatParams (state.flat.searchFlatParameters)
    // 3. There are no flat and flatBuildings and user did not search; Most likely page was refreshed
    // this.props.flats is all the flats regardless of building relationship
    // this.props.flatBuildings is divided in to flats with same buildings
    // and those without buildings shared; Send both to GoogleMap
    const flatsEmpty = _.isEmpty(this.props.flats);
    const flatBuildingsEmpty = _.isEmpty(this.props.flatBuildings);

    if (!flatsEmpty && !flatBuildingsEmpty) {
      // gets average of latlng of returned flats
      const latLngAve = this.calculateLatLngAve(this.props.justFlats);
      // const latLngAve = this.calculateLatLngAve(this.props.flats);
      // gets latlng and zoom of map stored after user searches on landing or results page
      const storedLat = localStorage.getItem('lat');
      const storedLng = localStorage.getItem('lng');
      const storedZoom = localStorage.getItem('zoom');
      // sets initial position of map based on latlng and zoom
      // in searchFlatParams or stored latlng and zoom
      const initialPosition = ('lat' in this.props.searchFlatParams) ? { lat: this.props.searchFlatParams.lat, lng: this.props.searchFlatParams.lng, zoom: 12 } : { lat: storedLat, lng: storedLng, zoom: storedZoom }
      // console.log('results, renderMap, initialPosition: ', initialPosition);
      return (
        <div>
        <GoogleMap
          // key={'1'}
          flatsEmpty={flatsEmpty}
          flats={this.props.flats}
          flatsId={this.props.flatsId}
          flatBuildings={this.props.flatBuildings}
          flatBuildingsId={this.props.flatBuildingsId}
          buildingsJustId={this.props.buildingsJustId}
          initialPosition={latLngAve || initialPosition}
          // initialZoom={11}
          currency='$'
        />
        </div>
      );
    } else if (('lat' in this.props.searchFlatParams)) {
      // if latlng in searchFlatParams; use searchFlatParams to get map position
      // latlng added to in searchFlatParams in city_search when user selects in search dropdown
      // when first search city, searchFlatParams has latlng, but not when page refreshed
      const emptyMapLatLngCenter = {
        lat: this.props.searchFlatParams.lat,
        lng: this.props.searchFlatParams.lng,
        zoom: this.props.searchFlatParams.zoom
      };
      // console.log('results, renderMap, else if emptyMapLatLngCenter.lat lng: ', emptyMapLatLngCenter.lat, emptyMapLatLngCenter.lng);
      // console.log('results, renderMap, else if this.props.searchFlatParams: ', this.props.searchFlatParams);
      return (
        <div>
        <GoogleMap
          flatsEmpty={flatsEmpty}
          flats={this.props.flats}
          flatsId={this.props.flatsId}
          flatBuildingsId={this.props.flatBuildingsId}
          flatBuildings={this.props.flatBuildings}
          buildingsJustId={this.props.buildingsJustId}
          initialPosition={emptyMapLatLngCenter}
          currency='$'
          // initialZoom={this.props.mapDimensions.mapZoom}
        />
        </div>
      );
    } else {
      // if no flat and building or latlng in searchFlatParams; called when page refreshed
        const storedLat = parseFloat(localStorage.getItem('lat'));
        const storedLng = parseFloat(localStorage.getItem('lng'));
        const storedZoom = parseFloat(localStorage.getItem('zoom'));
        const initialPosition = ('lat' in this.props.searchFlatParams) ? { lat: this.props.searchFlatParams.lat, lng: this.props.searchFlatParams.lng, zoom: 12 } : { lat: storedLat, lng: storedLng, zoom: storedZoom }
        // console.log('results, renderMap, else if emptyFlat, initialPosition: ', initialPosition);
        return (
          <div>
          <GoogleMap
            flatsEmpty={flatsEmpty}
            flats={this.props.flats}
            flatsId={this.props.flatsId}
            flatBuildingsId={this.props.flatBuildingsId}
            flatBuildings={this.props.flatBuildings}
            buildingsJustId={this.props.buildingsJustId}
            initialPosition={initialPosition}
            currency='$'
            // initialZoom={12}
          />
          </div>
        );
      // if flatsEmpty
      // return (
      //   <div>
      //     <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
      //     <div className="spinner">Loading...</div>
      //   </div>
      // );
    } // end if not empty flat
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
          // console.log('in results handlePageClick, before if lastPage, displayedPagesArray: ', displayedPagesArray)
        })
        }
      }); // end of first setState
  }
  // decrement index and change the current paging array
  decrementPagingIndex() {
    // purpose of function is to shift displayedPagesArray under certain conditions
    // lastPage is num, MAX_NUM_PAGE_NUMBERS is num, -1 to convert to index
    // first check if current page (already decremented by one) fits on last set of buttons with no ...
    // console.log('in results decrementPagingIndex, displayedPagesArray: ', displayedPagesArray);
    if (this.state.currentPage < (lastPage - (MAX_NUM_PAGE_NUMBERS - 1))) {
      // and current page is the first before ..., specify that position
      // console.log('in results decrementPagingIndex, first if cp fpi lpi <, : ', this.state.currentPage, this.state.firstPagingIndex, this.state.lastPagingIndex);
      if (this.state.currentPage === lastPage - MAX_NUM_PAGE_NUMBERS) {
        // console.log('in results decrementPagingIndex, second if this.state.currentPage ===, lastPagingIndex: ', this.state.currentPage, this.state.firstPagingIndex, this.state.lastPagingIndex);
        // console.log('in results decrementPagingIndex, second if lastPage, MAX_NUM_PAGE_NUMBERS: ', lastPage, MAX_NUM_PAGE_NUMBERS);
        this.setState({
          firstPagingIndex: (this.state.firstPagingIndex - (MAX_NUM_PAGE_NUMBERS - 2)),
          lastPagingIndex: (this.state.lastPagingIndex - (MAX_NUM_PAGE_NUMBERS - 2)),
        }, () => {
          // console.log('in results decrementPagingIndex, this.state.currentPage, lastPagingIndex: ', this.state.firstPagingIndex, this.state.lastPagingIndex);
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
         // console.log('in results decrementPagingIndex, this.state.currentPage: ', this.state.firstPagingIndex, this.state.lastPagingIndex );
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
      // console.log('in results decrementPagingIndex, first else, cp: ', this.state.currentPage);
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
        // console.log('in results incrementPagingIndex, if this.state.currentPage: ', this.state.currentPage);
        // const currentLi = document.getElementById(this.state.currentPage);
        // currentLi.classList.add('current');
        this.addCurrent();
      });
    } else {
      // if at before the ..., get a new array in the last set of paging buttons
      // Needs to shift by MAX_NUM_PAGE_NUMBERS - 2 to present full last set
      // console.log('in results incrementPagingIndex, else displayedPagesArray[0]: ', displayedPagesArray[0]);
      this.setState({
        firstPagingIndex: (this.state.firstPagingIndex + (MAX_NUM_PAGE_NUMBERS - 2)),
        lastPagingIndex: (this.state.lastPagingIndex + (MAX_NUM_PAGE_NUMBERS - 2))
      }, () => {
        // then set current page to first page in new array
        this.setState({
          currentPage: displayedPagesArray[0]
        }, () => {
          // console.log('in results incrementPagingIndex, else this.state.currentPage: ', this.state.currentPage);
          // console.log('in results incrementPagingIndex, displayedPagesArray: ', displayedPagesArray);
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
            // console.log('in results handleLeftPageClick, if cp >= mnpn -1, cp: ', this.state.currentPage);
            this.decrementPagingIndex();
          }
        } else if (firstPageInArray === 2) {
          // else if for second if
          // console.log('in results handleLeftPageClick, else if this.state.currentPage: ', this.state.currentPage);
          this.setState({
            firstPagingIndex: (this.state.firstPagingIndex - 1),
            lastPagingIndex: (this.state.lastPagingIndex - 1),
          }, () => {
            // console.log('in results handleLeftPageClick, else if displayedPagesArray: ', displayedPagesArray);
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
    // console.log('in results handleRightPageClick, currentPageIndex: ', lastPageIndex);
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
        // console.log('in results handleRightPageClick, this.state: ', this.state);
        // console.log('in results handleRightPageClick, after setState, displayedPagesArray: ', displayedPagesArray);
        // const currentLi = document.getElementById(this.state.currentPage);
        // function to do currentLi.classList.add('current');
        // ***************key logic for advancing pages one by one or moving array
        // if pagebefore dots in this pages array is before last set of pages
        if (this.state.pageBeforeDots < (lastPage - (MAX_NUM_PAGE_NUMBERS))) {
          // console.log('in results handleRightPageClick, < if this.state.pageBeforeDots: ', this.state.pageBeforeDots);
          // console.log('in results handleRightPageClick, < if this.state: ', this.state);
          // console.log('in results handleRightPageClick, if (lastPage - (MAX_NUM_PAGE_NUMBERS - 1)): ', (lastPage - (MAX_NUM_PAGE_NUMBERS - 1)));
          // as long as not in the last set and last page index was is 2 or increment array
          if ((this.state.lastPageIndex) === (MAX_NUM_PAGE_NUMBERS - 3)) {
            // console.log('in results handleRightPageClick, if pageBeforeDots <, if lastpagei === pbd: ', this.state.pageBeforeDots);
            // console.log('in results handleRightPageClick, if pageBeforeDots <, if lastpagei === lpi: ', this.state.lastPageIndex);
            const atPageBeforeDots = false;
            this.incrementPagingIndex(atPageBeforeDots);
          } else {
            // otherwise, add current
            // console.log('in results handleRightPageClick, else pageBeforeDots <, if lastpage === lpi: ', this.state.lastPageIndex);
            // console.log('in results handleRightPageClick, else pageBeforeDots <, if lastpage === pbd: ', this.state.pageBeforeDots);
            this.addCurrent();
          }
          // else if pagebefore dots in this array of pages
          // equals the first in the last set of pages
        } else if ((this.state.pageBeforeDots === (lastPage - MAX_NUM_PAGE_NUMBERS)) && (this.state.pageBeforeDots === this.state.currentPage - 1)) {
          // if pageBeforeDots is last one before last set AND
          // before clicked, currentPage was at pageBeforeDots
          // console.log('in results handleRightPageClick, else pageBeforeDots <, first else if lastpage === pbd: ', this.state.pageBeforeDots);
          // console.log('in results handleRightPageClick, else if === this.state: ', this.state);
          const atPageBeforeDots = true;
          this.incrementPagingIndex(atPageBeforeDots);
        } else {
          // console.log('in results handleRightPageClick, in else this.state: ', this.state);
          this.addCurrent();
        }
        // **********************
      }); // end of setState
    }
  }

  renderPageNumbers(pageNumbersArray) {
    // pageNumbersArray ? pageNumbersArray : [];
    // console.log('in results renderPageNumbers, pageNumbersArray: ', pageNumbersArray);
    // cannot set state here...
      // renders ... button if last page is longer than MAX_NUM_PAGE_NUMBERS
      // otherwise, just static without ...
      displayedPagesArray = pageNumbersArray.slice(this.state.firstPagingIndex, this.state.lastPagingIndex);

      if (lastPage > MAX_NUM_PAGE_NUMBERS) {
        // firstPagingIndex is the first page to be showing
        // lastPagingIndex is how many paging boxes to show, so
        // console.log('in results renderPageNumbers, displayedPagesArray: ', displayedPagesArray);

        return displayedPagesArray.map((pageNumber, index) => {
          // console.log('in results renderPageNumbers, pageNumber, index: ', pageNumber, index);
          if (index === 0) {
            //if right arrow has been clicked, don't automatically assign current to class
            if (this.state.rightArrowClicked) {
              return (
                <li key={index} id={pageNumber} onClick={this.handlePageClick}>{pageNumber}</li>
              );
            }
            // if fresh page and right arrow has not been clicked, assign current to class
            return (
              <li key={index} id={pageNumber} className="current" onClick={this.handlePageClick}>{pageNumber}</li>
            );
          } else if (index <= (MAX_NUM_PAGE_NUMBERS - 3)) {
            // if index less than or equal to render the actual page numbers
            return (
              <li key={index} id={pageNumber} onClick={this.handlePageClick}>{pageNumber}</li>
            );
          } else if (index === MAX_NUM_PAGE_NUMBERS - 2) {
            //if last two pages buttons, either render ... or the page number
            if (pageNumber === lastPage - 1) {
              return (
                <li key={index} id={pageNumber} onClick={this.handlePageClick}>{pageNumber}</li>
              );
            }
            return (
              <li key={index}>...</li>
            );
          } else {
            //if all else, render the last page number
            return (
              <li key={index} id={lastPage} onClick={this.handlePageClick}>{lastPage }</li>
            );
          }
        });
      } else {
        // if there are only pages less than MAX_NUM_PAGE_NUMBERS, then no flexible pagination
        return pageNumbersArray.map((pageNumber, index) => {
          // console.log('in results renderPageNumbers, pageNumber, index: ', pageNumber, index);
          if (index === 0) {
            return (
              <li key={index} id={pageNumber} className="current" onClick={this.handlePageClick}>{pageNumber}</li>
            );
          } else {
            return (
              <li key={index} id={pageNumber} onClick={this.handlePageClick}>{pageNumber}</li>
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
        <li onClick={this.handleDoubleLeftPageClick}><i className="fa fa-angle-double-left"></i></li>
      );
    }
  }

  renderPagination() {
      // check if flats is empty of objects
      // const flatsEmpty = _.isEmpty(this.props.flats);
      const flatsEmpty = _.isEmpty(this.props.justFlats);
      // console.log('in results renderPagination, outside of if, flatsEmpty: ', flatsEmpty);
    if (!flatsEmpty) {
      // destructure initialized state variables
      const { cardsPerPage } = this.state;
      // console.log('in results renderPagination, flatsEmpty: ', flatsEmpty);
      // console.log('in results renderPagination, currentPage: ', currentPage);
      // console.log('in results renderPagination, cardsPerPage: ', cardsPerPage);
      // cards are for flats
      const cards = this.props.justFlats;
      // const cards = this.props.flats;
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
          // console.log('in results renderPagination, if i === ... i lastPage: ', i, lastPage);
        }
      }
      // console.log('in results renderPagination, lastPage: ', lastPage);
      // console.log('in results renderPagination, pageNumbers: ', pageNumbersArray);      // this.renderPageNumbers(pageNumbers)
      if (pageNumbersArray.length > 1) {
        return (
          <div>
            <ul className="pagination">
              {this.renderDoubleLeftArrow()}
              <li onClick={this.handleLeftPageClick}><i className="fa fa-angle-left"></i></li>
                {this.renderPageNumbers(pageNumbersArray)}
              <li onClick={this.handleRightPageClick}><i className="fa fa-angle-right"></i></li>
            </ul>
          </div>
        );
      }
    }
  }
  //*******************************************************************************
  //*********************PAGINATION****************************************
  getReviewsForFlat(flat) {
    const reviewsArray = [];
    _.each(this.props.reviews, review => {
      if (flat.id == review.flat_id) {
        reviewsArray.push(review);
      }
    });
    return reviewsArray;
  }

  renderFlats() {
    let index = 1;
    // const flatsEmpty = _.isEmpty(this.props.flats);
    const flatsEmpty = _.isEmpty(this.props.justFlats);
    const mapDimensionsEmpty = _.isEmpty(this.props.mapDimensions);
    // console.log('in results renderFlats, flats empty: ', flatsEmpty);
    // console.log('in results renderFlats, this.props.startUpCount.startUpCount: ', this.props.startUpCount.startUpCount);
    // const randomNum = _.random(0, 1);
    // console.log('in results renderFlats, randomNum: ', randomNum);

      // if (!flatsEmpty && randomNum === 1) {
      if (!flatsEmpty) {
        // console.log('in results renderFlats, this.props.justFlats : ', this.props.justFlats);
        // console.log('in results renderFlats, this.props.flats.rooms: ', this.props.flats.rooms);
        // const { id } = this.props.flats[0];
        // console.log('in results renderFlats, id: ', id);
        const { currentPage, cardsPerPage } = this.state;
        // console.log('in results renderPagination, flatsEmpty: ', flatsEmpty);
        // console.log('in results renderPagination, currentPage: ', currentPage);
        // console.log('in results renderPagination, cardsPerPage: ', cardsPerPage);
        // const cards = this.props.flats;
        const cards = this.props.justFlats;
        // console.log('in results renderPagination, cards: ', cards);
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
        // console.log('in results renderFlats, slicedCards, slicedCards: ', slicedCards);
        // console.log('in results renderFlats, slicedCards, mappedSlicedCards: ', mappedSlicedCards);
        // console.log('in results renderFlats, slicedCards, this.props.flats: ', this.props.flats);

        return _.map(flats, (flat) => {
            const reviewsArray = this.getReviewsForFlat(flat);
            const reviews = _.mapKeys(reviewsArray, 'id');
            return (
              <div key={flat.id.toString()}>
                <MainCards
                  // key={flat.id.toString()}
                  flat={flat}
                  reviews={reviews}
                  likes={this.props.likes}
                  currency='$'
                  showFlat={false}
                  authenticated={this.props.auth.authenticated}
                  appLanguageCode={this.props.appLanguageCode}
                />
              </div>
            );
          });
          // <div>{console.log('in results renderFlats, flats: ', flats)}</div>
          // this.props.startUpIndex();
      } else if (this.props.startUpCount.startUpCount !== 0) {
        return <div className="no-results-message">No flats in that area or with that criteria. <br/>Please search again!</div>;
      } else {
        // <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        // <div className="spinner">Loading flats...</div>
        return (
          <div className="results-no-flat-message">
           {AppLanguages.noFlats[this.props.appLanguageCode]} <br/><br/>{AppLanguages.searchAnother[this.props.appLanguageCode]}
          </div>
        );
      }
  }

  // Each increment function for each tab, size, bedroom, station, price;
  // could not refactor to one function since cannot use a variable to specify key of state object!!!!!
  incrementFirstCriterion({ increment, elementName, elementVal, moreThanLimit, lessThanLimit, criterionValue, incrementMax }) {
    // const { searchFlatParameters } = this.props.
    const { floorSpaceMin, floorSpaceMax, bedroomsMin, bedroomsMax, stationMin, stationMax, priceMin, priceMax } = this.state;
    if (!incrementMax) {
      if (elementName === 'up') {
        if (floorSpaceMin < floorSpaceMax - searchCriteria[criterionValue].increment) {
          this.setState({ floorSpaceMin: floorSpaceMin + increment }, () => {
            // only need if display window is used, but now onhold
            // this.setState({ searchDisplayValueMin: this.state.floorSpaceMin });
            this.props.searchFlatParameters({ size_min: this.state.floorSpaceMin });
          });
        }
      } else {
        if (floorSpaceMin > moreThanLimit) {
          this.setState({ floorSpaceMin: floorSpaceMin - increment }, () => {
            // this.setState({ searchDisplayValueMin: this.state.floorSpaceMin });
            this.props.searchFlatParameters({ size_min: this.state.floorSpaceMin });
          });
        }
      }
    } else {
      if (elementName === 'up') {
        if (floorSpaceMax < lessThanLimit) {
          this.setState({ floorSpaceMax: floorSpaceMax + increment }, () => {
              // this.setState({ searchDisplayValueMax: this.state.floorSpaceMax });
              this.props.searchFlatParameters({ size_max: this.state.floorSpaceMax });
          });
        }
      } else {
        if (floorSpaceMax - increment > floorSpaceMin) {
          this.setState({ floorSpaceMax: floorSpaceMax - increment }, () => {
            // this.setState({ searchDisplayValueMax: this.state.floorSpaceMax });
            this.props.searchFlatParameters({ size_max: this.state.floorSpaceMax });
          });
        }
      }
    }
  }

  incrementSecondCriterion({ increment, elementName, elementVal, moreThanLimit, lessThanLimit, criterionValue, incrementMax }) {

    const { floorSpaceMin, floorSpaceMax, bedroomsMin, bedroomsMax, bedroomsExact, stationMin, stationMax, priceMin, priceMax } = this.state;
    if (!incrementMax) { // if incrementMin selected
      // and user clicks up
      if (elementName === 'up') {
        // if (bedroomsMin < bedroomsMax - searchCriteria[criterionValue].increment) {
        // if min is less than max before click, Allow max and min to be equal;
        if (bedroomsMin < bedroomsMax) {
          // increment min by increment unit (specified in constants/search_criteria.js)
          this.setState({ bedroomsMin: bedroomsMin + increment }, () => {
            // if after setState bedroom min + increment, min equal max
            if (this.state.bedroomsMin == bedroomsMax) {
              // set state exact: min
              this.setState({ bedroomsExact: this.state.bedroomsMin }, () => {
                // then update redux state
                this.props.searchFlatParameters({ bedrooms_exact: this.state.bedroomsExact });
              });
            } else {
              this.props.searchFlatParameters({ bedrooms_min: this.state.bedroomsMin });
            }
            // else {
            //   // this.setState({ searchDisplayValueMin: this.state.bedroomsMin });
            // }
          });
        } // end of bedroommMin < bedroom max
      } else { // if user clicks down;
        if (bedroomsMin > moreThanLimit) {
          this.setState({ bedroomsMin: bedroomsMin - increment }, () => {
            // this.setState({ searchDisplayValueMin: this.state.bedroomsMin });
            this.props.searchFlatParameters({ bedrooms_min: this.state.bedroomsMin, bedrooms_exact: null });
          });
        }
        if (bedroomsMin == bedroomsMax) {
          this.setState({ bedroomsMin: bedroomsMin - increment, bedroomsExact: null }, () => {
            // this.setState({ searchDisplayValueMin: this.state.bedroomsMin });
            this.props.searchFlatParameters({ bedrooms_min: this.state.bedroomsMin, bedrooms_exact: null });
          });
        }
      }// end of second if
    } else { // increment max
      // console.log('in results incrementSecondCriterion if bedroomsMin, bedroomsMax, bedroomsExact, elementName: ', bedroomsMin, bedroomsMax, bedroomsExact, elementName);
      if (elementName === 'up') {
        if (bedroomsMax < lessThanLimit) {
          this.setState({ bedroomsMax: bedroomsMax + increment }, () => {
              // this.setState({ searchDisplayValueMax: this.state.bedroomsMax });
              this.props.searchFlatParameters({ bedrooms_max: this.state.bedroomsMax, bedroomsExact: null });
          });
        }
        if (bedroomsMin == bedroomsMax) {
          this.setState({ bedroomsMax: bedroomsMax + increment, bedroomsExact: null }, () => {
            // this.setState({ searchDisplayValueMin: this.state.bedroomsMin });
            this.props.searchFlatParameters({ bedrooms_max: this.state.bedroomsMax, bedrooms_exact: null });
          });
        }
      } else { // down while increment min
        // if (bedroomsMax - increment > bedroomsMin) {
        // Allow max and min to be equal
        if (bedroomsMax > bedroomsMin) {
        // if (bedroomsMax - increment > bedroomsMin) {
          this.setState({ bedroomsMax: bedroomsMax - increment }, () => {
            if (this.state.bedroomsMin == this.state.bedroomsMax) {
              this.setState({ bedroomsExact: this.state.bedroomsMax }, () => {
                this.props.searchFlatParameters({ bedrooms_exact: this.state.bedroomsMax });
              });
            } else {
              // this.setState({ bedroomsExact: null }, () => {
                this.props.searchFlatParameters({ bedrooms_max: this.state.bedroomsMax });
              // });
            }
            // this.setState({ searchDisplayValueMax: this.state.bedroomsMax });
          });
        }
      }// end of innner if else
    } // end of first if incrementMax else
  }

  incrementThirdCriterion({ increment, elementName, elementVal, moreThanLimit, lessThanLimit, criterionValue, incrementMax }) {

    const { floorSpaceMin, floorSpaceMax, bedroomsMin, bedroomsMax, stationMin, stationMax, priceMin, priceMax } = this.state;
    if (!incrementMax) {
      if (elementName === 'up') {
        if (stationMin < stationMax - searchCriteria[criterionValue].increment) {
          this.setState({ stationMin: stationMin + increment }, () => {
            // this.setState({ searchDisplayValueMin: this.state.stationMin });
            this.props.searchFlatParameters({ station_min: this.state.stationMin });
          });
        }
      } else {
        if (stationMin > moreThanLimit) {
          this.setState({ stationMin: stationMin - increment }, () => {
            // this.setState({ searchDisplayValueMin: this.state.stationMin });
            this.props.searchFlatParameters({ station_min: this.state.stationMin });
          });
        }
      }
    } else {
      if (elementName === 'up') {
        if (stationMax < lessThanLimit) {
          this.setState({ stationMax: stationMax + increment }, () => {
              // this.setState({ searchDisplayValueMax: this.state.stationMax });
              this.props.searchFlatParameters({ station_max: this.state.stationMax });
          });
        }
      } else {
        if (stationMax - increment > stationMin) {
          this.setState({ stationMax: stationMax - increment }, () => {
            // this.setState({ searchDisplayValueMax: this.state.stationMax });
            this.props.searchFlatParameters({ station_max: this.state.stationMax });
          });
        }
      }
    }
  }

  incrementFourthCriterion({ increment, elementName, elementVal, moreThanLimit, lessThanLimit, criterionValue, incrementMax }) {

    const { floorSpaceMin, floorSpaceMax, bedroomsMin, bedroomsMax, stationMin, stationMax, priceMin, priceMax } = this.state;
    if (!incrementMax) {
      if (elementName === 'up') {
        if (priceMin < priceMax - searchCriteria[criterionValue].increment) {
          this.setState({ priceMin: priceMin + increment }, () => {
            // this.setState({ searchDisplayValueMin: this.state.priceMin });
            this.props.searchFlatParameters({ price_min: this.state.priceMin });
          });
        }
      } else {
        if (priceMin > moreThanLimit) {
          this.setState({ priceMin: priceMin - increment }, () => {
            // this.setState({ searchDisplayValueMin: this.state.priceMin });
            this.props.searchFlatParameters({ price_min: this.state.priceMin });
          });
        }
      }
    } else {
      if (elementName === 'up') {
        if (priceMax < lessThanLimit) {
          this.setState({ priceMax: priceMax + increment }, () => {
              // this.setState({ searchDisplayValueMax: this.state.priceMax });
              this.props.searchFlatParameters({ price_max: this.state.priceMax });
          });
        }
      } else {
        if (priceMax - increment > priceMin) {
          this.setState({ priceMax: priceMax - increment }, () => {
            // this.setState({ searchDisplayValueMax: this.state.priceMax });
            this.props.searchFlatParameters({ price_max: this.state.priceMax });
          });
        }
      }
    }
  }

  incrementSearchSpaceInput(event) {
    // increments the ranges for each tab;
    // const { space, bedrooms, station, price } = searchCriteria;
    // show max values and set state searchCriteriaInpuStarted
    // this.userInputStarted();
    const { floorSpaceMin, floorSpaceMax, bedroomsMin, bedroomsMax, stationMin, stationMax, priceMin, priceMax } = this.state;
    // criterionValue is the 0, 1, 2, 3 that is set from element value on click of tabs, size, bedrooms...
    const { criterionValue } = this.state;
    // gets the search_criteria object increment
    // to inrement by 10, 500 or whatever is specified when + or - clicked
    const increment = searchCriteria[criterionValue].increment;
    // console.log('in results incrementSearchSpaceInput increment: ', increment);
    // gets value from searchCriteria object to stop incrementing when hit limit
    const moreThanLimit = searchCriteria[criterionValue].moreThanLimit;
    const lessThanLimit = searchCriteria[criterionValue].lessThanLimit;
    // console.log('in results incrementSearchSpaceInput moreThanLimit: ', moreThanLimit);
    // console.log('in results incrementSearchSpaceInput lessThanLimit: ', lessThanLimit);
    const clickedElement = event.target;
    // console.log('in results incrementSearchSpaceInput clickedElement: ', clickedElement);

    // take off gray from plus minus button and put back
    clickedElement.style.color = 'lightgray';
    setTimeout(() => {
      clickedElement.style.color = 'gray';
      // console.log('in results incrementSearchSpaceInput in setTimeout clickedElement: ', clickedElement);
    }, 50);

    const elementName = clickedElement.getAttribute('name');
    const elementVal = clickedElement.getAttribute('value');
    // incrementMax is a boolean to tell if to increment the
    // mininum or the maximum of size, bedroom, price; set when click the max and min buttons
    const incrementMax = this.state.incrementMax;
    // const stateCriteria = this.getStateCriteria(min);
    // const results-search-box-sub-tab
    // console.log('in results incrementSearchSpaceInput incrementMax: ', incrementMax);
    // console.log('in results incrementSearchSpaceInput clickedElement: ', clickedElement);
    // console.log('in results incrementSearchSpaceInput elementVal: ', elementVal);
    // console.log('in results incrementSearchSpaceInput elementName: ', elementName);
    // console.log('in results incrementSearchSpaceInput searchCriteria[0]: ', searchCriteria[0].lowerState);
    if (!this.state.searchCriteriaInpuStarted) {
      this.setState({ searchCriteriaInpuStarted: true })
    }
    // calls each increment function and sends parameters
    if (this.state.criterionValue == 0) {
      this.incrementFirstCriterion({ increment, elementName, elementVal, moreThanLimit, lessThanLimit, criterionValue, incrementMax });
    } else if (this.state.criterionValue == 1) {
      this.incrementSecondCriterion({ increment, elementName, elementVal, moreThanLimit, lessThanLimit, criterionValue, incrementMax });
    } else if (this.state.criterionValue == 2) {
      this.incrementThirdCriterion({ increment, elementName, elementVal, moreThanLimit, lessThanLimit, criterionValue, incrementMax });
    }  else if (this.state.criterionValue == 3) {
      this.incrementFourthCriterion({ increment, elementName, elementVal, moreThanLimit, lessThanLimit, criterionValue, incrementMax });
    }
  }

  // const searchCriteriaObject = {
  //   space: {lowerLabel: 'More than', upperLabel: 'Less than', units: '(sq m)', increment: 10, lessThanLimit: 0, moreThanLimit: 1000, maxMinAdjustment: 10, startMin: 20, startMax: 70 },
  //   bedrooms: {lowerLabel: 'More than', upperLabel: 'Fewer than', units: 'rooms', increment: 1, lessThanLimit: 0, moreThanLimit: 10, maxMinAdjustment: 0, startMin: 0, startMax: 1 },
  //   station: {lowerLabel: 'More than', upperLabel: 'Less than', units: 'mins', increment: 1, lessThanLimit: 0, moreThanLimit: 20, maxMinAdjustment: 10, startMin: 5, startMax: 7 },
  //   price: {lowerLabel: 'More than', upperLabel: 'Less than', units: '$', increment: 500, lessThanLimit: 0, moreThanLimit: 10000, maxMinAdjustment: 100, startMin: 1000, startMax: 2000 }
  // }

// *********KEEP *************************
  // renderCriterionDetails() {
  //   // const { space, bedrooms, station, price } = searchCriteria;
  //   const { criterionValue } = this.state;
  //   // searchCriteria imported above from search_criteria.js
  //   return (
  //     <div className="criterion-box-details-box">
  //       <div className="search-criteria-details-each-box">
  //         <div className="search-criteria-details-each-label">{searchCriteria[criterionValue].lowerLabel} <small>{searchCriteria[criterionValue].units}</small></div>
  //         <div className="search-criteria-details-each-input-box">
  //             <div className="search-criteria-details-input-increment"><i value="down" name="moreThan" className="fa fa-angle-down" onClick={this.incrementSearchSpaceInput}></i></div>
  //             <div className="search-criteria-details-input-display">{this.state.searchDisplayValueMin}</div>
  //             <div className="search-criteria-details-input-increment"><i value="up" name="moreThan" className="fa fa-angle-up" onClick={this.incrementSearchSpaceInput}></i></div>
  //         </div>
  //       </div>
  //       <div className="search-criteria-details-each-box">
  //         <div className="search-criteria-details-each-label">{searchCriteria[criterionValue].upperLabel}</div>
  //         <div className="search-criteria-details-each-input-box">
  //           <div className="search-criteria-details-input-increment"><i value="down" className="fa fa-angle-down" onClick={this.incrementSearchSpaceInput}></i></div>
  //           <div className="search-criteria-details-input-display">{this.state.searchDisplayValueMax}</div>
  //           <div className="search-criteria-details-input-increment"><i value="up" className="fa fa-angle-up" onClick={this.incrementSearchSpaceInput}></i></div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  // *********KEEP *************************

// *********KEEP *************************
  // renderCriterionBoxDetails() {
  //
  //   console.log('in results renderCriterionBoxDetails, this.state.criterionValue, this.state.criterionName: ', this.state.criterionValue, this.state.criterionName);
  //   switch (parseInt(this.state.criterionValue)) {
  //     case 0: {
  //       return <div className="criterion-box-details-box">{this.renderSizeCriterionDetails()}</div>;
  //     }
  //     case 1: {
  //       return <div className="criterion-box-details-box">{this.renderBedroomCriterionDetails()}</div>;
  //     }
  //     case 2: {
  //       return <div className="criterion-box-details-box">{this.renderStationCriterionDetails()}</div>;
  //     }
  //     case 3: {
  //       return <div className="criterion-box-details-box">{this.renderPriceCriterionDetails()}</div>;
  //     }
  //     default: return <div className="criterion-box-details-box">No selection</div>;
  //   }
  // }

  // renderCriterionBoxDetails() {
  //   console.log('in results renderCriterionBoxDetails: ');
  //   return (
  //     <div className="criterion-box-details-box">
  //       {this.renderCriterionDetails()}
  //     </div>
  //   );
  // }
  // *********KEEP *************************

  unHighlightTab(name) {
    const searchTabs = document.getElementsByClassName(name);
    // console.log('in results unHighlightTab elementVal: ', searchTabs);
    _.each(searchTabs, tab => {
      tab.setAttribute('style', 'background-color: white; color: black')
    })
  }

  // *********KEEP *************************
  // this is required if use the display boxes which are on hold at the moment
  // setStartingDisplayValues(min) {
  //   console.log('in results setStartingDisplayValues, this.state.criterionValue : ', this.state.criterionValue);
  //   console.log('in results setStartingDisplayValues, this.state.floorSpaceMin : ', this.state.floorSpaceMin);
  //   switch (parseInt(this.state.criterionValue)) {
  //     case 0: {
  //       if (min) {
  //         return this.state.floorSpaceMin;
  //       } else {
  //         return this.state.floorSpaceMax;
  //       }
  //     }
  //     case 1: {
  //       if (min) {
  //         return this.state.bedroomsMin;
  //       } else {
  //         return this.state.bedroomsMax;
  //       }
  //     }
  //     case 2: {
  //       if (min) {
  //         return this.state.stationMin;
  //       } else {
  //         return this.state.stationMax;
  //       }
  //     }
  //     case 3: {
  //       if (min) {
  //         return this.state.priceMin;
  //       } else {
  //         return this.state.priceMax;
  //       }
  //     }
  //     default: return;
  //   }
  // }
  // *********KEEP *************************

  handleSearchTabClick(event) {
    // handles click of tabs size, bedrooms, station, price
    // gets the value of the tabs which are 0, 1, 2, 3 that are assigned in search-criteria object
    // value drives the switches;
    // unHighlightTab and setAttribute hightlights the clicked tabs and unHighlights other
    const clickedElement = event.target;
    const elementName = clickedElement.getAttribute('name')
    const elementVal = clickedElement.getAttribute('value')
    // const results-search-box-sub-tab
    // console.log('in results handleSearchTabClick elementVal: ', elementVal);
    // console.log('in results handleSearchTabClickm elementName: ', elementName);
    // set state searchCriteriaInpuStarted to show max values and set max values to realistic
    const elementValInt = parseInt(elementVal);

    if (elementVal !== this.state.criterionValue) {
      this.unHighlightTab('results-search-box-sub-tab');
      this.setState({ criterionValue: elementValInt }, () => {
        // console.log('in results handleSearchTabClick this.state.criterionValue: ', this.state.criterionValue);
        clickedElement.setAttribute('style', 'background-color: gray; color: white;');
        this.userInputStarted();
      });// end of first setState

      // push in to selectedTabArray
      this.setState(prevState => ({
        selectedTabArray: [...prevState.selectedTabArray, elementValInt]
      }), () => {
        this.setStateMaxToNormal(this.state.selectedTabArray);
      }); // end of setState
    }
    // if (!this.state.showCriterionBox) {
    //   clickedElement.setAttribute('style', 'background-color: lightGray; color: white;');
    //   this.setState({ criterionName: elementName, criterionValue: elementVal, showCriterionBox: true }, () => {
    //     // this.unHighlightTab();
    //     let min = true;
    //     const searchDisplayValueMin = this.setStartingDisplayValues(min);
    //     min = false;
    //     const searchDisplayValueMax = this.setStartingDisplayValues(min);
    //     this.setState({ searchDisplayValueMin, searchDisplayValueMax })
    //   })
    // } else if (this.state.showCriterionBox && (elementName !== this.state.criterionName)) {
    //     this.unHighlightTab('results-search-box-sub-tab');
    //     clickedElement.setAttribute('style', 'background-color: lightGray; color: white;');
    //     this.setState({ criterionName: elementName, criterionValue: elementVal }, () => {
    //       let min = true;
    //       const searchDisplayValueMin = this.setStartingDisplayValues(min);
    //       min = false;
    //       const searchDisplayValueMax = this.setStartingDisplayValues(min);
    //       this.setState({ searchDisplayValueMin, searchDisplayValueMax });
    //     })
    // } else {
    //   this.unHighlightTab('results-search-box-sub-tab');
    //   this.setState({ criterionName: '', criterionValue: 0, showCriterionBox: false, searchDisplayValueMin: 0, searchDisplayValueMax: 0 });
    // }
  }
  // *********KEEP *************************

  // handleSearchCriterionBoxClose() {
  //   this.setState({ showCriterionBox: false });
  //   this.unHighlightTab();
  // }
// *********KEEP *************************
  // showCriterionBox() {
  //   // two criterion-close class divs for centering the title
  //   console.log('in results showCriterionBox: ');
  //   // if (this.state.showCriterionBox) {
  //     return (
  //       <div className="search-criterion-box">
  //         <div className="search-criterion-box-title">
  //           <span className="search-criterion-close"></span>
  //           {this.state.criterionName}
  //           <span className="search-criterion-close" onClick={this.handleSearchCriterionBoxClose.bind(this)}><i className="fa fa-window-close" aria-hidden="true"></i></span>
  //         </div>
  //         {this.renderCriterionDetails()}
  //       </div>
  //     );
  //   // }
  // }
  // *********KEEP *************************

  setStateMaxToNormal(selectedTabArray) {
    const tabCount = {};
    _.each(selectedTabArray, (tabIndex) => {
      tabCount[tabIndex] = (tabCount[tabIndex] || 0) + 1;
    })
    // selectedTabArray.forEach((i) => { tabCount[i] = (tabCount[i] || 0) + 1;})
      // console.log('in results setStateMaxToNormal tabCount: ', tabCount);
      // console.log('in results setStateMaxToNormal this.state.criterionValue: ', this.state.criterionValue);

    switch (this.state.criterionValue) {
      case 0:
      // console.log('in results userInputStarted 0: ', this.state.criterionValue);
        if (tabCount[0] < 2) {
          this.setState({ floorSpaceMax: searchCriteria[0].startMax }, () => {
            this.props.searchFlatParameters({ size_max: this.state.floorSpaceMax });
          });
        }

        break;
      case 1:
      // console.log('in results userInputStarted 1: ', this.state.criterionValue);
        if (tabCount[1] < 2) {
          this.setState({ bedroomsMax: searchCriteria[1].startMax }, () => {
            this.props.searchFlatParameters({ bedrooms_max: this.state.bedroomsMax });
          });
        }
        break;

      case 2:
      // console.log('in results userInputStarted 2: ', this.state.criterionValue);
        if (tabCount[2] < 2) {
          this.setState({ stationMax: searchCriteria[2].startMax }, () => {
            this.props.searchFlatParameters({ station_max: this.state.stationMax });
          });
        }
        break;

      case 3:
      // console.log('in results setStateMaxToNormal 3: ', this.state.criterionValue);
      // console.log('in results setStateMaxToNormal 3, selectedTabArray: ', selectedTabArray);
      // console.log('in results setStateMaxToNormal 3, tabCount: ', tabCount);
        if (tabCount[3] < 2) {
          this.setState({ priceMax: searchCriteria[3].startMax }, () => {
            this.props.searchFlatParameters({ price_max: this.state.priceMax });
          });
        }
        break;
    }
  }

  userInputStarted() {
    // floorSpaceMax: searchCriteria[0].startMax,
    // bedroomsMax: searchCriteria[0].startMax,
    // Max: searchCriteria[0].startMax,
    // floorSpaceMax: searchCriteria[0].startMax,
    if (!this.state.searchCriteriaInpuStarted) {
      this.setState({
        searchCriteriaInpuStarted: true,
      }, () => {

        // console.log('in results userInputStarted, this.state: ', this.state);
        // console.log('in results userInputStarted outside of switch: ', this.state.criterionValue);
      });
    }
  }

  handleMinMaxClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    // console.log('in results handleMinMaxClick: ', elementVal);
    // record that user has started to input search to render initial max
    // set max levels to realistic levels (startMax in searchCriteria object, not startBigMax)
    // this.userInputStarted();
    // incrementMax is a boolean to show which min max button has been clicked
    if (elementVal == 'min') {
      if (this.state.incrementMax) {
        this.unHighlightTab('search-criteria-increment-min-max')
        this.setState({ incrementMax: !this.state.incrementMax }, () => {
          clickedElement.setAttribute('style', 'background-color: gray; color: white;');
        });
      }
    } else {
      if (!this.state.incrementMax) {
        this.unHighlightTab('search-criteria-increment-min-max')
        this.setState({ incrementMax: !this.state.incrementMax }, () => {

          clickedElement.setAttribute('style', 'background-color: gray; color: white;');
        })
      }
    }
  }

  handleSearchClearClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    console.log('in results handleSearchClearClick: ', elementVal);
    this.unHighlightTab('results-search-box-sub-tab');

    // take off gray from plus minus button and put back
    clickedElement.style.color = 'lightgray';
    // setTimeout(`${this.setColorBack(clickedElement)}`, 1000);
    // setTimeout(this.setColorBack(clickedElement), 10000);
    setTimeout(() => {
      clickedElement.style.color = 'black';
      // console.log('in results incrementSearchSpaceInput in setTimeout clickedElement: ', clickedElement);
    }, 50);

    this.setState({
      searchCriteriaInpuStarted: false,
      criterionValue: 0,
      selectedTabArray: [],
      floorSpaceMin: 0,
      floorSpaceMax: searchCriteria[0].startBigMax,
      bedroomsMin: 0,
      bedroomsMax: searchCriteria[1].startBigMax,
      bedroomsExact: null,
      stationMin: 0,
      stationMax: searchCriteria[2].startBigMax,
      priceMin: 0,
      priceMax: searchCriteria[3].startBigMax,
      amenitySearchArray: []
    }, () => {
      const { floorSpaceMin, floorSpaceMax, bedroomsMin, bedroomsMax, bedroomsExact, stationMin, stationMax, priceMin, priceMax  } = this.state;
      const searchParamsObject = { size_min: floorSpaceMin, size_max: floorSpaceMax, bedrooms_min: bedroomsMin, bedrooms_max: bedroomsMax, bedrooms_exact: bedroomsExact, station_min: stationMin, station_max: stationMax, price_min: priceMin, price_max: priceMax }
      // go through each amenity and if there is a key value pair in saerchFlatParams,
      // turn it false in searchParamsObject and send to searchFlatParameters action to update in reducer
      _.each(Object.keys(amenities), key => {
        if (this.props.searchFlatParams[key]) {
          searchParamsObject[key] = false;
        }
      });

      this.props.searchFlatParameters(searchParamsObject);
      // console.log('in results handleSearchClearClick, this.state: ', this.state);
    });
  }

  handleSearchApplyClick() {
    this.props.showLoading();
    // console.log('in results handleSearchApplyClick: ');
    // const { floorSpaceMin, floorSpaceMax, floorSpaceBigMax, bedroomsMin, bedroomsMax, bedroomsExact, stationMin, stationMax, priceMin, priceMax, searchCriteriaInpuStarted, criterionValue, selectedTabArray } = this.state;
    // console.log('in results handleSearchApplyClick, floorSpaceMin, floorSpaceMax, bedroomsMin, bedroomsMax, stationMin, stationMax, priceMin, priceMax: ', floorSpaceMin, floorSpaceMax, bedroomsMin, bedroomsMax, stationMin, stationMax, priceMin, priceMax);
    // const searchAttributes = bedroomsExact ?
    // { price_min: priceMin, price_max: priceMax, size_min: floorSpaceMin, size_max: floorSpaceMax, bedrooms_exact: bedroomsExact, station_min: stationMin, station_max: stationMax } :
    // { price_min: priceMin, price_max: priceMax, size_min: floorSpaceMin, size_max: floorSpaceMax, bedrooms_min: bedroomsMin, bedrooms_max: bedroomsMax, station_min: stationMin, station_max: stationMax };

    // console.log('in results handleSearchApplyClick, searchAttributes: ', searchAttributes);
    // console.log('in results handleSearchApplyClick, this.props.searchFlatParams: ', this.props.searchFlatParams);
    this.props.fetchFlats(this.props.mapDimensions.mapBounds, this.props.searchFlatParams, () => { this.searchApplyCallback(); });
  }

  searchApplyCallback() {
    this.props.showLoading();
  }

  handleRefineSearchLinkClick() {
    this.setState({ showRefineSearch: !this.state.showRefineSearch }, () => {
      // console.log('in results handleRefineSearchLinkClick, this.state.showRefineSearch: ', this.state.showRefineSearch);
    })
  }

  handleAmenityCheck(event) {
    const checkedElement = event.target;
    const elementVal = checkedElement.getAttribute('value');
    // console.log('in results handleAmenityCheck, elementVal: ', elementVal);
    // add value of checked amenity (name of amenity same as api amenity table column name)
    const { amenitySearchArray, amenitySearchStarted } = this.state;

    this.setState({ amenitySearchStarted: true });

    // if checked element (amenity) is included in the state amenitySearchArray, take it out
    // and create a new state array with out the unchecked array
    if (amenitySearchArray.includes(elementVal)) {
        const newArray = [...amenitySearchArray]; // make a separate copy of the array
        // _.each(amenitySearchArray, amenity => { // iterate throught he existing array
          // if (amenity == elementVal) { // if amenity in existing array is equal to the checked amenity
        const index = newArray.indexOf(elementVal); // get the index of the element
        newArray.splice(index, 1); // remove one element at index
          // }
        // });
        this.setState({ amenitySearchArray: newArray }, () => {
        // const key = elementVal
        // const obj = {};
        this.props.searchFlatParameters({ [elementVal]: false });
          // console.log('in results handleAmenityCheck, amnenitySearchArray if includes: ', this.state.amenitySearchArray);
        });

    } else {
      // if not included, add the amenity (elementVal) to the array
      this.setState(prevState => ({
        amenitySearchArray: [...prevState.amenitySearchArray, elementVal]
      }), () => {
        // console.log('in results handleAmenityCheck, amnenitySearchArray if else: ', this.state.amenitySearchArray);
      this.props.searchFlatParameters({ [elementVal]: true });
      }); // end of setState
    }
  }

  renderEachAmenityCriteria() {
    // const whichAmenityToList = ['parking', 'wifi', 'kitchen', 'ac', 'wheelchair_accessible'];
    const whichAmenityToList = Object.keys(amenities);
    // return _.map(Object.keys(amenities), (amenity) => {
      // console.log('in results renderEachAmenityCriteria, amenity: ', amenity);
      return _.map(whichAmenityToList, (a, i) => {
        // console.log('in results renderEachAmenityCriteria, a: ', a);
        // if (amenity == a) {
          // console.log('in results renderEachAmenityCriteria, match, amenity, a: ', amenity == a, amenity, a, amenities[amenity]);
          return (
            <div key={i} className="amenity-input-each col-xs-11 col-sm-3 col-md-3">
              <label className="amenity-radio">{amenities[a][this.props.appLanguageCode]}</label>
              <input value={a} type="checkbox" className="createFlatAmenityCheckBox" checked={this.state.amenitySearchArray.includes(a) ? true : false} onChange={this.handleAmenityCheck} />
            </div>
          );
        // }
      });
    // });
  }

  renderRefineSearchCriteria() {
    return (
      <div>
      <div className={this.state.amenitySearchStarted ? 'refine-search-apply-link-highlight' : 'refine-search-apply-link'} onClick={this.handleSearchApplyClick}>{this.state.amenitySearchStarted ? AppLanguages.apply[this.props.appLanguageCode] : ''}</div>
        <div className="row refine-search-row">
        {this.renderEachAmenityCriteria()}
        </div>
      </div>
    );
  }

  popUpCalendar() {
    const calendar = document.getElementsByClassName('results-search-date-search-popup')
    calendar[0].classList.remove('hide');
    const calendarInput = document.getElementById('results-date-search-input')
    calendarInput.disabled = true;
  }

  hideCalendar() {
    // if (this.props.datesSelected.from && this.props.datesSelected.to ) {
    this.props.searchFlatParameters({ date_start: this.props.datesSelected.from, date_end: this.props.datesSelected.to })
    // }
    const calendar = document.getElementsByClassName('results-search-date-search-popup')
    calendar[0].classList.add('hide');
    const calendarInput = document.getElementById('results-date-search-input')
    calendarInput.disabled = false;
  }

  formatDate(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes}  ${ampm}`;
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
  }

  getCalendarInputValue() {
    console.log('in results getCalendarInputValue, this.props.datesSelected: ', this.props.datesSelected);
    let dates = '';
    if (this.props.datesSelected.to) {
      dates = this.formatDate(this.props.datesSelected.from) + ' to ' + this.formatDate(this.props.datesSelected.to);
    }
    return dates;
  }

  renderDateSearch() {
    // <div className="results-search-date-search-input">
    // <input type="text" placeholder="Date to" />
    // </div>
    return (
      <div className="results-search-date-search-box">
        <div className="results-search-date-search-input">
          {this.renderCalendarPopup()}
          <input value={this.props.datesSelected.to ? this.getCalendarInputValue() : ''} id="results-date-search-input" type="text" placeholder={AppLanguages.searchByDates[this.props.appLanguageCode]} onFocus={this.popUpCalendar} />
        </div>
      </div>
    );
  }

  disabledDays() {
    // Note that new disabledDays does not include the after and before daysr!!!!!!!!!!!!!!!!!!!!!!!
    // So need to adjust dates with setDate and getDate

    const daysList = [];

    const today = new Date();
    // just gate date so that first of month and today can be compared;
    // otherwise there will be time involved
    const todayJustDate = today.toDateString();
    // const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), today.getDay() - 2);
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstOfMonthJustDate = firstOfMonth.toDateString();
    // console.log('in show_flat, disabledDays, outside _.each, firstOfMonth, today just dates: ', firstOfMonthJustDate, todayJustDate);
    if (todayJustDate !== firstOfMonthJustDate) {
      // console.log('in show_flat, disabledDays, outside _.each, firstOfMonth, today: ', new Date(firstOfMonth - 1), today);
      const firstOfMonthRange = { after: new Date(firstOfMonth - 1), before: today }
      daysList.push(firstOfMonthRange);
      // console.log('in show_flat, disabledDays, outside _.each, firstOfMonthRange: ', firstOfMonthRange);
    }
    // const firstofMonth = new Date.now()
    // daylist array gets fed inot react-date-picker as props
    return daysList;
  }

  renderCalendarPopup() {
    return (
      <div className="results-search-date-search-popup hide">
        <div className="results-search-date-search-close" onClick={this.hideCalendar}>  {AppLanguages.finished[this.props.appLanguageCode]}</div>
        <DatePicker
          numberOfMonths={6}
          daysToDisable={this.disabledDays()}
        />
      </div>
    );
  }

  renderSearchArea() {
    // displays the search area tabs, sixe, bedrooms, station, price; Also the buttons and gets input
    // <div className="search-criteria-clear" onClick={this.handleSearchClearClick}>Clear</div>
    // props of
    // <div value='apply' className={this.state.searchCriteriaInpuStarted ? 'search-criteria-apply-highlight' : 'search-criteria-apply'} onClick={this.handleSearchApplyClick}>{AppLanguages.apply[this.props.appLanguageCode]}</div>
    const { floorSpaceMin, floorSpaceMax, bedroomsMin, bedroomsMax, bedroomsExact, stationMin, stationMax, priceMin, priceMax, searchCriteriaInpuStarted, criterionValue, selectedTabArray } = this.state;
    const bedrooms = bedroomsExact ? `${bedroomsExact}` : `${bedroomsMin} ~ ${bedroomsMax}`
    return (
      <div className="results-search-box container">
      <div className="results-search-box-row row">
          <div className="results-search-box-sub-main col-xs-12 col-sm-6 col-md-6">
            <CitySearch
              resultsPage
            />
            <div className={this.state.showRefineSearch ? 'hide' : 'results-refine-search-link'} onClick={this.handleRefineSearchLinkClick}>
                {AppLanguages.refineSearch[this.props.appLanguageCode]}
            </div>
          </div>
          <div className="results-search-box-sub-box col-xs-12 col-sm-6 col-md-6">
          <div className="results-search-box-sub-box-box">
            <div className="results-search-box-sub">
              <div value={0} name={searchCriteria[0].title} className="results-search-box-sub-tab" onClick={this.handleSearchTabClick}>
                {AppLanguages.size[this.props.appLanguageCode]}
              </div>
              <div className="results-search-box-sub-display">
                {selectedTabArray.includes(0) ? `${floorSpaceMin} m² ~ ${floorSpaceMax} m²` : `${floorSpaceMin} m² ~` }
              </div>
            </div>
            <div className="results-search-box-sub" >
              <div value={1} name={searchCriteria[1].title} className="results-search-box-sub-tab" onClick={this.handleSearchTabClick}>
                {AppLanguages.bedrooms[this.props.appLanguageCode]}
              </div>
              <div className="results-search-box-sub-display">
                {selectedTabArray.includes(1) ? `${bedrooms}` : `${bedroomsMin} ~` }
              </div>

            </div>
            <div className="results-search-box-sub">
              <div value={2} name={searchCriteria[2].title} className="results-search-box-sub-tab" onClick={this.handleSearchTabClick}>
                {AppLanguages.station[this.props.appLanguageCode]}
              </div>
              <div className="results-search-box-sub-display">
                {selectedTabArray.includes(2) ? `${stationMin}   ${AppLanguages.mins[this.props.appLanguageCode]} ~ ${stationMax}   ${AppLanguages.mins[this.props.appLanguageCode]}` : `${stationMin}   ${AppLanguages.mins[this.props.appLanguageCode]} ~` }
              </div>

            </div>
            <div className="results-search-box-sub">
              <div value={3} name={searchCriteria[3].title} className="results-search-box-sub-tab" onClick={this.handleSearchTabClick}>
                {AppLanguages.price[this.props.appLanguageCode]}
              </div>
              <div className="results-search-box-sub-display">
                {selectedTabArray.includes(3) ? `$${priceMin} ~ ${priceMax}` : `$${priceMin} ~` }
              </div>
            </div>
          </div>
            <div className="search-criteria-increment-box">
            <div value='all' className={this.state.searchCriteriaInpuStarted || this.state.amenitySearchArray.length > 0 ? 'search-criteria-clear-all-highlight' : 'search-criteria-clear-all'} onClick={this.handleSearchClearClick}>{AppLanguages.clearAll[this.props.appLanguageCode]}</div>
              <div value='min' className="search-criteria-increment-min-max" onClick={this.handleMinMaxClick}>Min</div>
              <div className="search-criteria-increment"><i name="down" className="fa fa-minus-circle" onClick={this.incrementSearchSpaceInput}></i></div>
              <div className="search-criteria-increment"><i name="up" className="fa fa-plus-circle" onClick={this.incrementSearchSpaceInput}></i></div>
              <div value='max' className="search-criteria-increment-min-max" style={this.state.incrementMax ? { backgroundColor: 'gray', color: 'white' } : { backgroundColor: 'white' }} onClick={this.handleMinMaxClick}>Max</div>
              <div value='apply' className='search-criteria-apply-highlight' onClick={this.handleSearchApplyClick}>{AppLanguages.apply[this.props.appLanguageCode]}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    // <div className={'refine-search-box container'}>
    return (
      <div>
        <div className="container" id="map">
        {this.renderMap()}
        </div>
        <div>
          {this.renderDateSearch()}
          {this.renderSearchArea()}
          <div className={this.state.showRefineSearch ? 'refine-search-box' : 'hide'}>
            <div className="refine-search-close-link" onClick={this.handleRefineSearchLinkClick}>{AppLanguages.close[this.props.appLanguageCode]}</div>
            {this.state.showRefineSearch ? this.renderRefineSearchCriteria() : ''}
          </div>
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
    justFlats: state.flats.justFlats,
    flatsId: state.flats.flatsResultsId,
    flatBuildings: state.flats.flatBuildingsResults,
    flatBuildingsId: state.flats.flatBuildingsResultsId,
    buildingsJustId: state.flats.buildingsJustId,
    startUpCount: state.startUpCount,
    mapDimensions: state.mapDimensions.mapDimensions,
    // likes: state.likes.userLikes,
    likes: state.flats.userLikes,
    auth: state.auth,
    reviews: state.flats.reviewsForFlatResults,
    searchFlatParams: state.flats.searchFlatParameters,
    appLanguageCode: state.languages.appLanguageCode,
    datesSelected: state.bookingData.selectedBookingDates
   };
}

export default connect(mapStateToProps, actions)(Results);
