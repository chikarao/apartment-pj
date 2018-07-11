import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';

import citiesList from '../constants/cities_list'


class CitySearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // windowWidth: window.innerWidth,
      searchInput: '',
      searchInputHasValue: false,
      displayCitiesList: false,
      citiesSubsetArray: [],
      selectedCity: ''
    };
  }

  componentDidMount() {
  }

  getCityObject(callback) {
    let cityToSearch = {};
    console.log('in landing, getCityObject, this.state.selectedCity: ', this.state.selectedCity);
    _.each(citiesList, city => {
      if (city.name == this.state.selectedCity) {
        cityToSearch = city
      }
    });
    console.log('in landing, getCityObject, cityToSearch: ', cityToSearch);
    callback(cityToSearch);
  }

  handleBannerSearchClick() {
  // console.log('in landing, handleBannerSearchClick, event.target: ', event.target);
  // const clickedElement = event.target;
  // const elementVal = clickedElement.getAttribute('value')
  // console.log('in landing, handleBannerSearchClick, elementVal: ', elementVal);
  // console.log('in landing, handleBannerSearchClick, cityToSearch: ', cityToSearch);

  this.props.history.push('/results');
  }

  // renderDataListOptions() {
  //   return (
  //     <div>
  //       <option value="San Francisco" />
  //       <option value="Seattle" />
  //       <option value="New York" />
  //       <option value="Los Angeles" />
  //       <option value="Chicago" />
  //       <option value="Austin" />
  //       <option value="Portland" />
  //       <option value="Pittsburgh" />
  //     </div>
  //   );
  // }

  handleCityClick(event) {
    const clickedElement = event.target;
    const mainInput = document.getElementById('banner-input');
    const liArray = document.getElementsByTagName('LI');
    const body = document.getElementsByTagName('BODY');
    // body[0].classList.add('stop-scrolling');
    console.log('in landing, handleCityClick, body: ', body);
    _.each(liArray, li => {
      console.log('in landing, handleCityClick, li: ', li);
      const liToBeChanged = li;
      liToBeChanged.style.backgroundColor = 'white'
      });

    clickedElement.style.backgroundColor = 'lightgray';

    this.setState({ displayCitiesList: false, citiesSubsetArray: [], searchInput: '', selectedCity: event.target.getAttribute('value') }, () => {
      mainInput.value = this.state.selectedCity;
      // console.log('in landing, handleCityClick, activeLi: ', activeLi);
      this.getCityObject((city) => this.props.searchFlatParameters(city));
    });
    // this.scrollList();
  }
  // render the li list of cities when user enters in input
  renderCitiesList() {
    const cities = this.state.citiesSubsetArray;
    return _.map(cities, city => {
      return (
        <li key={city.name} value={city.name} onClick={this.handleCityClick.bind(this)}>{city.name}</li>
      );
    });
  }

  // reference for includes: https://stackoverflow.com/questions/1789945/how-to-check-whether-a-string-contains-a-substring-in-javascript
  getCitiesSubsetArray(searchInput) {
    const cities = citiesList;
    const citiesArray = [];
    const searchInputLower = searchInput.toLowerCase();
    _.each(cities, city => {
      const cityName = city.name.toLowerCase();
      if (cityName.includes(searchInputLower)) {
        citiesArray.push(city)
      }
    });
    return citiesArray;
  }

  handleSearchInputChange(searchInput) {
    //take input and get a subset of cities that contain the search input
    const citiesSubsetArray = this.getCitiesSubsetArray(searchInput);
    console.log('in landing, handleSearchInputChange, citiesSubsetArray: ', citiesSubsetArray);
    // if search input is NOT empty set state so that dropdown shows and array is populated in state
    if (searchInput !== '') {
      this.setState({ searchInputHasValue: true, searchInput, citiesSubsetArray, displayCitiesList: true }, () => {
        // console.log('in landing, handleSearchInputChange, this.state.searchInputHasValue: ', this.state.searchInputHasValue);
        // console.log('in landing, handleSearchInputChange, this.state.searchInput: ', this.state.searchInput);
      });
      // call to activeate the scrolllist and respond to user down up and enter input
      this.scrollList();
    } else {
      // if input is empty set state so that drop down does not show and the subArray is empty
      const body = document.getElementsByTagName('BODY');
      body[0].classList.remove('stop-scrolling');
      this.setState({ searchInputHasValue: false, citiesSubsetArray, displayCitiesList: false }, () => {
        // console.log('in landing, handleSearchInputChange, this.state.searchInputHasValue: ', this.state.searchInputHasValue);
      });
    }
  }

  scrollList() {
    // this function takes user input of DOWN, UP and ENTER
    // is is the UL that will contain the city list
    const list = document.getElementById('banner-search-cities-list');
    // first is the first li in the drop down; It is NOT part of the array and is '--' to give it room
    const first = list.firstChild;
    // the first 'active' or hightlighted li is the first one when the user clicks on DOWN
    let active = first;
    // console.log('in landing, scrollList, first, list: ', first, list);
    // mainInput is the input tag, the one in the center of the bannner
    const mainInput = document.getElementById('banner-input');
    // console.log('in landing, scrollList, mainInput: ', mainInput);
    // Stop scrolling the entire page when user presses UP or DOWN key
    const body = document.getElementsByTagName('BODY');
    body[0].classList.add('stop-scrolling');
     // onkyedown reference: https://stackoverflow.com/questions/33790668/arrow-keys-navigation-through-li-no-jquery
    document.onkeydown = (event) => { // listen to keyboard events
       switch (event.keyCode) {
         case 38: // if the UP key is pressed
         // console.log('in landing, scrollList, UP clicked, document.activeElement: ', document.activeElement);
         // console.log('in landing, scrollList, UP clicked, document.activeElement.nextSibling: ', document.activeElement.nextSibling);
         console.log('in landing, scrollList, UP clicked, active.getAttribute, first.getAttribute: ', active.getAttribute('value'), first.getAttribute('value'));
          // if cursor is in main input or the active variable is assign the first li
           if (document.activeElement == mainInput || (active.getAttribute('value') == first.getAttribute('value'))) {
             // make active with white background
             active.style.backgroundColor = 'white ';
             // move cursor to the banner input
             mainInput.focus();
             // if (!this.state.searchInputHasValue) {
             this.setState({ displayCitiesList: false, searchInput: '', citiesSubsetArray: [] });
             // }
             break;
           } else {
             // if cursor not in main and not on first li either, make active li (one with gray background) with white background
             active.style.backgroundColor = 'white ';
             // assign the previous li sibling to active variable
             active = active.previousSibling;
             // make background color on active
             active.style.backgroundColor = 'lightgray';
             // get attrible value to assign to selected City to set state so that city object with name and lat isolated
             const selectedCity = active.getAttribute('value');
             this.setState({ selectedCity }, () => {
              mainInput.value = this.state.selectedCity;
              this.getCityObject((city) => this.props.searchFlatParameters(city));
             })
           } // select the element before the current, and focus it
           break;

         case 40: // if the DOWN key is pressed
         // console.log('in landing, scrollList, DOWN clicked, document.activeElement, first.firstChild: ', document.activeElement, list.firstChild);
         // console.log('in landing, scrollList, DOWN clicked, document.activeElement.nextSibling: ', document.activeElement.nextSibling);
           if (document.activeElement == mainInput) {
             active.style.backgroundColor = 'white ';
             active = list.firstChild;
             list.firstChild.style.backgroundColor = 'lightgray';
             document.activeElement.blur();
             // if (!this.state.searchInputHasValue) {
             this.setState({ searchInput: '' });
             // }
           } else {
             // document.activeElement.nextSibling.firstChild.setActive();
             if(active.nextSibling) {
               active.style.backgroundColor = 'white ';
               active = active.nextSibling;
               active.style.backgroundColor = 'lightgray';
               const selectedCity = active.getAttribute('value');
               this.setState({ selectedCity }, () => {
                 mainInput.value = this.state.selectedCity;
                this.getCityObject((city) => this.props.searchFlatParameters(city));
                 console.log('in landing, scrollList, DOWN clicked, this.state.selectedCity: ', this.state.selectedCity);
               })
             } else {
               break;
             }
           } // target the currently focused element -> <a>, go up a node -> <li>, select the next node, go down a node and focus it
         break;
         // 13: enter key
         case 13:
          // if press enter key, and active element is not first li or the banner input
           if (document.activeElement == mainInput || (active.getAttribute('value') == first.getAttribute('value'))) {
             console.log('in landing, scrollList, ENTER clicked, mainInput or first: ');
             // stop scrolling taken off
             body[0].classList.remove('stop-scrolling');
             // do not show city dropdown list and empty out the cities array so that user cannot continue to presss up and down keys to select
              this.setState({ displayCitiesList: false, citiesSubsetArray: [] });
           } else {
             this.setState({ displayCitiesList: false, citiesSubsetArray: [] }, () => {
               // reference: https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
               body[0].classList.remove('stop-scrolling');
           });
         }
         break;
         // focus (bring cursur to input) if press RIGHT 39 or LEFT 37 arrows
         case 39:
          mainInput.focus();
          break;
         case 37:
          mainInput.focus();
          break;
       }// end of switch
     }; // end of document on keydown
  } // end of scrollList function


  renderCitySearch() {
    console.log('in CitySearch, render this.props:', this.props);
    return (
      <div>
        <div className="banner-search-input-and-button">
          <label><input list="areas" value={this.state.selctedCity} className="banner-search-input" id="banner-input" type="string" onChange={event => this.handleSearchInputChange(event.target.value)} placeholder="Find flats in a city!" /></label>
          <button className="banner-search-button" onClick={this.handleBannerSearchClick.bind(this)}>Search</button>
        </div>
        <ul className="cities-list-ul" id="banner-search-cities-list"style={this.state.displayCitiesList ? { display: 'block' } : { display: 'none' }} >
          <li key={1} value="">--</li>
          {this.renderCitiesList()}
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderCitySearch()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in CitySearch, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
  };
}


export default withRouter(connect(mapStateToProps, actions)(CitySearch));
