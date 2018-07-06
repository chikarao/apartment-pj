import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';


// import Upload from './images/upload_test';
// import SigninModal from './auth/signin_modal';
// import SignupModal from './auth/signup_modal';
import * as actions from '../actions';
import citiesList from './constants/cities_list'

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      // searchInput: ''
      searchInputHasValue: false,
      displayCitiesList: false,
      citiesSubsetArray: [],
      selectedCity: ''
    };
  }

  componentDidMount() {
    console.log('in landing, componentDidMount');
      window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
    // console.log('in landing, createBackghandleResizeroundImage: ', this.state.windowWidth);
    this.setState({ windowWidth: window.innerWidth }, () => {
      console.log('in landing, handleResize, this.state.windowWidth: ', this.state.windowWidth);
    });
  }

  createBackgroundImage(image) {
    console.log('in landing, createBackgroundImage, image: ', image);
    console.log('in landing, createBackgroundImage, this.state.windowWidth: ', this.state.windowWidth);
    const width = 1000;
    const t = new cloudinary.Transformation();
    t.angle(0).crop('scale').width(width).aspectRatio('1.5');
    return cloudinaryCore.url(image, t);
  }

  handleBannerSearchClick() {
    // console.log('in landing, handleBannerSearchClick, event.target: ', event.target);
    // const clickedElement = event.target;
    // const elementVal = clickedElement.getAttribute('value')
    // console.log('in landing, handleBannerSearchClick, elementVal: ', elementVal);
    console.log('in landing, handleSearchInputChange, this.state.selectedCity: ', this.state.selectedCity);
    // this.props.history.push('/results');
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
  renderCitiesList() {
    const cities = this.state.citiesSubsetArray;
    return _.map(cities, city => {
      return (
        <li key={city.name} value={city.name}>{city.name}</li>
      );
    });
  }

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
    const citiesSubsetArray = this.getCitiesSubsetArray(searchInput);
    console.log('in landing, handleSearchInputChange, citiesSubsetArray: ', citiesSubsetArray);
    if (searchInput !== '') {
      this.setState({ searchInputHasValue: true, searchInput, citiesSubsetArray, displayCitiesList: true }, () => {
        // console.log('in landing, handleSearchInputChange, this.state.searchInputHasValue: ', this.state.searchInputHasValue);
        // console.log('in landing, handleSearchInputChange, this.state.searchInput: ', this.state.searchInput);

      });
      this.scrollList();
    } else {
      this.setState({ searchInputHasValue: false, citiesSubsetArray, displayCitiesList: false }, () => {
        // console.log('in landing, handleSearchInputChange, this.state.searchInputHasValue: ', this.state.searchInputHasValue);
      });
    }
  }

  scrollList() {
    const list = document.getElementById('banner-search-cities-list');
    const first = list.firstChild;
    let active = first;
    console.log('in landing, scrollList, first, list: ', first, list);
    const mainInput = document.getElementById('banner-input');
    console.log('in landing, scrollList, mainInput: ', mainInput);

    document.onkeydown = (e) => { // listen to keyboard events
       switch (e.keyCode) {
         case 38: // if the UP key is pressed
         // console.log('in landing, scrollList, UP clicked, document.activeElement: ', document.activeElement);
         // console.log('in landing, scrollList, UP clicked, document.activeElement.nextSibling: ', document.activeElement.nextSibling);
         console.log('in landing, scrollList, UP clicked, active.getAttribute, first.getAttribute: ', active.getAttribute('value'), first.getAttribute('value'));
           if (document.activeElement == mainInput || (active.getAttribute('value') == first.getAttribute('value'))) {
             active.style.backgroundColor = 'white ';
             mainInput.focus();
             break;
           } else {
             active.style.backgroundColor = 'white ';
             active = active.previousSibling;
             active.style.backgroundColor = 'lightgray';
             const selectedCity = active.getAttribute('value');
             this.setState({ selectedCity }, () => {
              mainInput.value = this.state.selectedCity;
             })
           } // select the element before the current, and focus it
           break;
         case 40: // if the DOWN key is pressed
         // console.log('in landing, scrollList, DOWN clicked, document.activeElement, first.firstChild: ', document.activeElement, list.firstChild);
         // console.log('in landing, scrollList, DOWN clicked, document.activeElement.nextSibling: ', document.activeElement.nextSibling);
           if (document.activeElement == mainInput) {
             active = list.firstChild;
             list.firstChild.style.backgroundColor = 'lightgray';
             document.activeElement.blur();
           } else {
             // document.activeElement.nextSibling.firstChild.setActive();
             if(active.nextSibling) {
               active.style.backgroundColor = 'white ';
               active = active.nextSibling;
               active.style.backgroundColor = 'lightgray';
               const selectedCity = active.getAttribute('value');
               this.setState({ selectedCity }, () => {
                 mainInput.value = this.state.selectedCity;
                 console.log('in landing, scrollList, DOWN clicked, this.state.selectedCity: ', this.state.selectedCity);
               })
             } else {
               break;
             }
           } // target the currently focused element -> <a>, go up a node -> <li>, select the next node, go down a node and focus it
         break;

         case 13:
         if (document.activeElement == mainInput || (active.getAttribute('value') == first.getAttribute('value'))) {
           console.log('in landing, scrollList, ENTER clicked, mainInput or first: ');
         } else {
           this.setState({ displayCitiesList: false })
         }
         break;
       }
     }
  }

  renderBanner() {
    // <h1>Flats, flats & more flats</h1>
    console.log('in landing, renderBanner, this.state.windowWidth: ', this.state.windowWidth);
    // <div className="banner-search-datalist-div">
    // </div>
    // <datalist className="banner-datalist" id="areas">
    // {this.state.searchInputHasValue ? this.renderDataListOptions() : ''}
    // </ datalist>
    return (
      <div className="banner" style={{ background: `url(${this.createBackgroundImage('banner_image_1')}` }}>
        <div className="banner-content">
          <div className="banner-search-box">
            <div className="banner-search-input-and-button">
              <label><input list="areas" value={this.state.selctedCity} className="banner-search-input" id="banner-input" type="string" onChange={event => this.handleSearchInputChange(event.target.value)} placeholder="Find flats in a city!" /></label>
              <button className="banner-search-button" onClick={this.handleBannerSearchClick.bind(this)}>Search</button>
            </div>
            <ul className="cities-list-ul" id="banner-search-cities-list"style={this.state.displayCitiesList ? { display: 'block' } : { display: 'none' }} >
              <li key={1} value="">--</li>
              {this.renderCitiesList()}
            </ul>
          </div>
          <p>Freedom and simplicity in where you live</p>
        </div>
      </div>
    );
  }

  render() {
    console.log('in landing, render: ');
    // console.log('in Welcome, render, this.state: ', this.state)
    // console.log('in Welcome, render, this.state.show: ', this.state.show)
    return (
      <div>
       {this.renderBanner()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in mypage, mapStateToProps, state: ', state);
  return {
    // flat: state.selectedFlatFromParams.selectedFlat,
    auth: state.auth,
  };
}

export default connect(mapStateToProps, actions)(Landing);
