import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';

import SearchTypeList from '../constants/search_type_list';

import * as actions from '../../actions';

// import * as images from '../../images';

const NEARBY_SEARCH_RADIUS = 3000;
// this compoenent is for creating and managing places on show and editflat
// on show, takes showFlat prop and shows only the places selected for flat
// on edit flat page, user can select and add places with flat id associated
class MapInteraction extends Component {
  constructor(props) {
   super(props);
   this.state = {
     placesResults: [],
     map: {},
     autoCompletePlace: {},
     clickedPlaceArray: [],
     placeSearched: false,
     placeCategory: ''
   };
 }

  componentDidMount() {
    // console.log('in show flat, componentDidMount, params', this.props.match.params);
    // gets flat id from params set in click of main_cards or infowindow detail click
    // this.props.match.params returns like this: { id: '43' })
    // this.props.selectedFlatFromParams(this.props.match.params.id);
    // this.props.fetchPlaces(this.props.match.params.id);
    //fetchConversationByFlatAndUser is match.params, NOT match.params.id
    // if (this.props.auth.authenticated) {
    //   this.props.getCurrentUser();
    //   this.props.fetchConversationByFlat({ flat_id: this.props.match.params.id });
    // }
    // if (this.props.flat) {
    //   console.log('in show flat, componentDidMount, this.props.flat', this.props.flat);
    // }
    //
    // this.props.fetchReviewsForFlat(this.props.match.params.id);
  }

  componentDidUpdate() {
    // this.scrollLastMessageIntoView();
    // to handle error InvalidValueError: not an instance of HTMLInputElement
    // handleSearchInput was running before HTML was rendered
    //so input ID map-interaction-input was not getting picked up
    if (this.props.flat && !this.props.showFlat) {
      this.handleSearchInput();
    }
  }

  createMap(location, zoom) {
    // console.log('in map_interaction, createMap, location: ', location);
    const map = new google.maps.Map(document.getElementById('map'), {
      center: location,
      zoom
    });
    this.setState({ map })
    return map;
  }

  createInfoWindowContent(place, main) {
    const iwDivParent = document.createElement('div');
    const iwDivPlaceName = document.createElement('div');
    const iwDivAddButton = document.createElement('div');

    iwDivPlaceName.innerHTML = `<div>${place.name}</div>`;

    iwDivPlaceName.setAttribute('class', 'map-interaction-iw-place');
    iwDivAddButton.setAttribute('class', 'btn btn-primary btn-small btn-iw-add-place');
    iwDivParent.appendChild(iwDivPlaceName);
    if (main) {
      // if on main search box marker click
      iwDivParent.setAttribute('class', 'map-interaction-iw-div-parent-main');
      iwDivAddButton.innerHTML = `<div>Add to Nearby Places</div>`;
      const placeValueString = this.createPlaceValueString(place);
      iwDivAddButton.setAttribute('value', placeValueString);
      iwDivParent.appendChild(iwDivAddButton);
    } else {
      // if on selectedMarker search box marker click style differently
      iwDivParent.setAttribute('class', 'map-interaction-iw-div-parent');
    }

    iwDivAddButton.setAttribute('name', place.name);
    // iwDivAddButton.setAttribute('onClick', () => this.handleResultAddClick);

    return { iwDivParent, iwDivAddButton };
  }

  getPlaces(criterion) {
    // console.log('in map_interaction, getPlaces, at top thisthis: ', this);
    // console.log('in map_interaction, getPlaces, criterion: ', criterion);
    // console.log('in map_interaction, getPlaces, this.props.flat.lat: ', this.props.flat.lat);
    // console.log('in map_interaction, getPlaces, this.props.flat.lng: ', this.props.flat.lng);
    // const radius = 5000;
    // https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=YOUR_API_KEY
    const location = { lat: this.props.flat.lat, lng: this.props.flat.lng };
    const flat = this.props.flat;

    // setState placeCategory to use when creatingplace
    this.setState({ placeCategory: criterion }, () => {
      // console.log('in map_interaction, getPlaces, setState, this.state.placeCategory: ', this.state.placeCategory);
    })

    const mapShow = this.createMap(location, 14);

    const service = new google.maps.places.PlacesService(mapShow);
    // console.log('in map_interaction, getPlaces, service: ', service);
    service.nearbySearch({
      location,
      radius: NEARBY_SEARCH_RADIUS,
      // if rank by distance, DO NOT use radius
      type: criterion
      // rankBy: google.maps.places.RankBy.DISTANCE
      // the propblem with rank by distance is in case of lots of results, give irrelevant results
    }, (results, status) => {
      // use () => to bind to this; gives access to this object
      // if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (status === 'OK') {
          // console.log('in map_interaction, getPlaces, Placeservice, results: ', results);
          // console.log('in map_interaction, getPlaces, Placeservice, placesResults: ', placesResults);
          // placesResults = results;
          // console.log('in map_interaction, getPlaces, Placeservice, this.props: ', this.props);
          // this.setState({ placesResults: results });
          // console.log('in map_interaction, getPlaces, after if thisthis?: ', this);

          for (let i = 0; i < results.length; i++) {
            const showLabel = false;
            const marker = this.createMarker(results[i], mapShow, showLabel);
            marker.setMap(mapShow)
            // console.log('in map_interaction, getPlaces, Placeservice: ', results[i]);
            // resultsArray.push(results[i]);
            // console.log('in map_interaction, getPlaces, Placeservice: ', results[i]);
          }
          // create marker for flat each time
          const flatMarker = this.createFlatMarker(flat, mapShow);
          flatMarker.setMap(mapShow);

          this.getPlacesCallback(results);

          //
          const bounds = new google.maps.LatLngBounds();
          // console.log('in map_interaction, getPlaces, bounds: ', bounds);
          // console.log('in map_interaction, getPlaces, results: ', results);

          for (let i = 0; i < results.length; i++) {
              // console.log('in map_interaction, getPlaces, results[i]: ', results[i]);
              const lat = results[i].geometry.location.lat();
              const lng = results[i].geometry.location.lng();
              const position = { lat, lng }
              bounds.extend(position);
            }
          mapShow.fitBounds(bounds);

        } else {
          // else there are no results from get places; place flat marker on map anyways
          // console.log('in map_interaction, getPlaces, Placeservice, else, results: ', results);
          const flatMarker = this.createFlatMarker(flat, mapShow);
          flatMarker.setMap(mapShow);
          this.getPlacesCallback(results);
        }
      }); // end of callback {} and nearbySearch
  } //end of getPlaces

  createMarker(place, mapShow, showLabel) {
    const infowindowArray = [];
    if (typeof place.geometry !== 'undefined') {
      const infowindow = new google.maps.InfoWindow();
      // push infowidow into array to enable close by clicking on map see addListener below
      infowindowArray.push(infowindow);
      const placeType = place.types[0];
      console.log('in map_interaction, createMarker, place: ', place);
      const markerIcon = {
        // url: 'http://image.flaticon.com/icons/svg/252/252025.svg',
        // url: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
        // url: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
        url: (SearchTypeList[placeType] == undefined) ? 'http://maps.google.com/mapfiles/ms/icons/blue.png' : SearchTypeList[placeType].icon,
        // url: 'https://image.flaticon.com/icons/svg/138/138978.svg',
        // url: 'https://image.flaticon.com/icons/svg/143/143964.svg',        // scaledsize originally 80, 80 taken from medium https://medium.com/@barvysta/google-marker-api-lets-play-level-1-dynamic-label-on-marker-f9b94f2e3585
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        //anchor starts at 0,0 at left corner of marker
        anchor: new google.maps.Point(20, 40),
        //label origin starts at 0, 0 somewhere above the marker
        labelOrigin: new google.maps.Point(20, 33)
      };
      // console.log('in map_interaction, createMarker, place.geometry: ', place.geometry);
      const placeLoc = place.geometry.location;
      // Don't need map; setMap is run in function where createMarker is called
      const marker = new google.maps.Marker({
        // map: mapShow,
        position: place.geometry.location,
        icon: markerIcon,
        marker: true,
        label: showLabel ? { text: '', fontWeight: 'bold' } : ''
      });

      // INFOWINDOW CODE !!!!!!!!!!!!!!1
      // create divs inside info window; one for name and one for button
      // console.log('in map_interaction, createMarker, place: ', place);
      // const placeValueString = this.createPlaceValueString(place);
      //
      // const iwDivParent = document.createElement('div');
      // const iwDivPlaceName = document.createElement('div');
      // const iwDivAddButton = document.createElement('div');
      //
      // iwDivPlaceName.innerHTML = `<div>${place.name}</div>`;
      // iwDivAddButton.innerHTML = `<div>Add to Nearby Places</div>`;
      //
      // iwDivParent.setAttribute('class', 'map-interaction-iw-div-parent');
      // iwDivPlaceName.setAttribute('class', 'map-interaction-iw-place');
      // iwDivAddButton.setAttribute('class', 'btn btn-primary btn-small btn-iw-add-place');
      // iwDivAddButton.setAttribute('value', placeValueString);
      // iwDivAddButton.setAttribute('name', place.name);
      // // iwDivAddButton.setAttribute('onClick', () => this.handleResultAddClick);
      //
      // iwDivParent.appendChild(iwDivPlaceName);
      // iwDivParent.appendChild(iwDivAddButton);
      const main = true;
      const iwContent = this.createInfoWindowContent(place, main);
      infowindow.setContent(iwContent.iwDivParent);
      // take out the background info window
      // repeated in createSelectedMarker; Could not avoid duplication
      google.maps.event.addListener(infowindow, 'domready', () => {
        // this addDomListener takes display nones some divs in google maps
        // so that gm-style-iw can be styled enable image to be panned across IW
        // gets infowindow element, returns array of HTML so get the first element in array
        const gmStyleIw = document.getElementsByClassName('gm-style-iw');
        const iwBackground = gmStyleIw[0].previousSibling;
        const nextSibling = gmStyleIw[0].nextSibling;
        // const iwBackgroundBackground = iwBackground.parentElement;
        // const iwDivParentParent = iwDivParent.parentElement;
        // iwDivParentParent.setAttribute('class', 'map-interaction-iw-div-parent-parent');
        // console.log('in map_interaction, createMarker, iwBackgroundBackground: ', iwBackgroundBackground);
        //gets the element with the white background and assign style of display none
        const iwBackgroundWhite = iwBackground.lastChild;
        iwBackgroundWhite.style.display = 'none';
        // get element with shadow behind the IW and assign style of display none;
        //item number is index
        const iwBackgroundShadow = iwBackground.getElementsByTagName('div').item(1);
        iwBackgroundShadow.style.display = 'none';
        // rename gmStyleIw so that it doesn't clash with the main google maps styling
        gmStyleIw[0].setAttribute('class', 'map-interaction-gmStyleIw');
        nextSibling.setAttribute('class', 'map-interaction-gmStyleIw-next');
      }); // end of addlistener

      google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(mapShow, this);
      });

      google.maps.event.addDomListener(iwContent.iwDivAddButton, 'click', () => {
        // console.log('in map-interaction, map iwDivAddButton clicked, button .value', iwDivAddButton.getAttribute('value'));
        // console.log('in map-interaction, map iwDivAddButton clicked, button', marker.flatId);
        // infowindowClickHandler(flat);
        const customEvent = { target: iwContent.iwDivAddButton };
        // send a handleResultAddClick a custom event so event.target can be handled
        this.handleResultAddClick(customEvent);
      });

      // close infowindow by clicking on map outside of infowindow
      google.maps.event.addListener(mapShow, 'click', function (event) {
        // const latitude = event.latLng.lat();
        // const longitude = event.latLng.lng();
        // console.log('in googlemaps clicked latitude: ', latitude);
        // console.log('in googlemaps clicked longitude: ', longitude);
        //close open infowindows
        for (let i = 0; i < infowindowArray.length; i++) {
          infowindowArray[i].close();
        }
      }); //end addListener

      return marker;
    }
  } // end of createMarker

  createFlatMarker(flat, map) {
    // console.log('in map_interaction, createFlatMarker, flatLocation: ', flatLocation);
    // console.log('in map_interaction, createFlatMarker, flat: ', flat);
    const markerLabel = 'Here is the Flat';
    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.
    const markerIcon = {
      url: 'http://image.flaticon.com/icons/svg/252/252025.svg',
      // scaledsize originally 80, 80 taken from medium https://medium.com/@barvysta/google-marker-api-lets-play-level-1-dynamic-label-on-marker-f9b94f2e3585
      scaledSize: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0),
      //anchor starts at 0,0 at left corner of marker
      anchor: new google.maps.Point(20, 40),
      //label origin starts at 0, 0 somewhere above the marker
      labelOrigin: new google.maps.Point(20, 33)
    };
    // Don't need map; setMap is run in function where createFlatMarker is called
    // Use marker to make it easier to shift between marker and circle
    // using position does not work need center in pontA latlng
      const marker = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        // position: {
        //   lat: flat.lat,
        //   lng: flat.lng
        // },
        marker: false,
        center: {
          lat: flat.lat,
          lng: flat.lng
        },
        radius: 300
      });
      // console.log('in map_interaction, createFlatMarker, marker (circle): ', marker);
    // ****marker
    // const marker = new google.maps.Marker({
    //   key: flat.id,
    //   position: {
    //     lat: flat.lat,
    //     lng: flat.lng
    //   },
    //   // map,
    //   flatId: flat.id,
    //   icon: markerIcon,
    //   label: {
    //     text: markerLabel,
    //     fontWeight: 'bold'
    //     // color: 'gray'
    //   }
    // });
    // *****Marker
    return marker;
  } //end of createFlatMarker

  // Do not need button any more
  // handlePlaceSearchClick(event) {
  //   console.log('in map_interaction, handlePlaceSearchClick, clicked: ', event);
  //   const input = document.getElementById('map-interaction-input');
  //   console.log('in map_interaction, handlePlaceSearchClick, input: ', input.value);
  //   console.log('in map_interaction, handlePlaceSearchClick, thisthis: ', this);
  //   this.getPlaces(input.value);
  //   input.value = '';
  // }



  getPlacesCallback(results) {
    console.log('in map_interaction, getPlacesCallback, results ??: ', results);
    // first, clear out place results then set state with results
    this.setState({ placesResults: results });
  }

  handleSearchCriterionClick(event) {
    // unhightlight previously highlighted places in list
    this.unhighlightClickedPlace();
    // set placeSearched to true so that the search list box renders different message
    this.setState({ placeSearched: true });
    console.log('in map_interaction, handleSearchCriterionClick, clicked, event: ', event.target);
    const clickedElement = event.target;
    let elementVal = clickedElement.getAttribute('value');
    console.log('in map_interaction, handleSearchCriterionClick, elementVal: ', elementVal);

    this.getPlaces(elementVal);
  }

  renderSearchSelection() {
    // consider moving this somewhere else
    const searchTypeList = SearchTypeList;
    return _.map(searchTypeList, (v, k) => {
      console.log('in map_interaction, renderSearchSelection, v, k: ', v, k);
        return <option key={k} value={k}>{v.name}</option>;
      // })
    });
}

  handleSearchTypeSelect() {
    this.setState({ placeSearched: true });
    const selection = document.getElementById('typeSelection');
    const type = selection.options[selection.selectedIndex].value;
    console.log('in map_interaction, handleSearchTypeSelect, type: ', type);
    this.getPlaces(type, () => this.getPlacesCallback())
  }

  createSelectedMarker(placeId) {
    // IMPORTANT creates marker based on placeID, not place as createMarker does
    // handlePlaceSearchClick gets value of the li which is a place id not the object place
    // so need to get a marker with the place id
    // console.log('in map_interaction, createSelectedMarker, placeId: ', placeId);
    const location = { lat: this.props.flat.lat, lng: this.props.flat.lng };
    const flat = this.props.flat;
    const infowindow = new google.maps.InfoWindow();
    // need to pass zoom to craeteMap
    const map = this.createMap(location, 14);
    const service = new google.maps.places.PlacesService(map);
    service.getDetails({
      placeId
    }, (result, status) => {
      if (status === 'OK') {
        const markersArray = []
        console.log('in map_interaction, createSelectedMarker, after if status, result: ', status, result);
        const pointA = this.createFlatMarker(flat, map);
        markersArray.push(pointA);
        // console.log('in map_interaction, createSelectedMarker, after if status, pointA: ', pointA);
        // const pointB = this.createMarker(flat, map);
        const placeType = result.types[0];
        const markerIcon = {
          // url: 'http://image.flaticon.com/icons/svg/252/252025.svg',
          // url: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
          url: (SearchTypeList[placeType] == undefined) ? 'http://maps.google.com/mapfiles/ms/icons/blue.png' : SearchTypeList[placeType].icon,

          // url: 'https://image.flaticon.com/icons/svg/138/138978.svg',
          // url: 'https://image.flaticon.com/icons/svg/143/143964.svg',
          // scaledsize originally 80, 80 taken from medium https://medium.com/@barvysta/google-marker-api-lets-play-level-1-dynamic-label-on-marker-f9b94f2e3585
          scaledSize: new google.maps.Size(40, 40),
          origin: new google.maps.Point(0, 0),
          //anchor starts at 0,0 at left corner of marker
          anchor: new google.maps.Point(20, 40),
          //label origin starts at 0, 0 somewhere above the marker
          labelOrigin: new google.maps.Point(20, 33)
        };

        const pointB = new google.maps.Marker({
          // map,
          place: {
            placeId,
            location: result.geometry.location
          },
          icon: markerIcon,
          label: {
            text: 'Here is the search result',
            fontWeight: 'bold'
          }
        });
        markersArray.push(pointB);
        // use position if use marker not circle (use center)
        // const pointALatLng = { lat: pointA.position.lat(), lng: pointA.position.lng() }
        const pointALatLng = { lat: pointA.center.lat(), lng: pointA.center.lng() }
        const pointBLatLng = { lat: pointB.place.location.lat(), lng: pointB.place.location.lng() }
        const distance = this.getDistance(pointALatLng, pointBLatLng, pointB, map);
        // console.log('in map_interaction, createSelectedMarker, after if status, distance: ', distance);
        pointA.setMap(map)

        // console.log('in map_interaction, createSelectedMarker, after if status, pointB: ', pointB);
        // console.log('in map_interaction, createSelectedMarker, after if status, markersArray: ', markersArray);
        // INFOWINDOW CODE
        const main = false;
        const iwContent = this.createInfoWindowContent(result, main);
        infowindow.setContent(iwContent.iwDivParent);
        // !!!!!!!!!!!!! duplicate addDomListener with createmarker
        // repeated in createSelectedMarker; Could not avoid duplication
        google.maps.event.addListener(infowindow, 'domready', () => {
          // this addDomListener takes display nones some divs in google maps
          // so that gm-style-iw can be styled enable image to be panned across IW
          // gets infowindow element, returns array of HTML so get the first element in array
          const gmStyleIw = document.getElementsByClassName('gm-style-iw');
          const iwBackground = gmStyleIw[0].previousSibling;
          const nextSibling = gmStyleIw[0].nextSibling;
          // const iwBackgroundBackground = iwBackground.parentElement;
          // const iwDivParentParent = iwDivParent.parentElement;
          // iwDivParentParent.setAttribute('class', 'map-interaction-iw-div-parent-parent');
          // console.log('in map_interaction, createMarker, iwBackgroundBackground: ', iwBackgroundBackground);
          //gets the element with the white background and assign style of display none
          const iwBackgroundWhite = iwBackground.lastChild;
          iwBackgroundWhite.style.display = 'none';
          // get element with shadow behind the IW and assign style of display none;
          //item number is index
          const iwBackgroundShadow = iwBackground.getElementsByTagName('div').item(1);
          iwBackgroundShadow.style.display = 'none';
          // rename gmStyleIw so that it doesn't clash with the main google maps styling
          gmStyleIw[0].setAttribute('class', 'map-interaction-gmStyleIw');
          nextSibling.setAttribute('class', 'map-interaction-gmStyleIw-next');
        }); // end of addlistener

        google.maps.event.addListener(pointB, 'click', function () {
          infowindow.open(map, this);
        });
        const searchClick = true;
        this.calculateAndDisplayRoute(pointA, pointB, markersArray, map, searchClick);
      } else {
        console.log('in map_interaction, createSelectedMarker, else status: ', status);
      } // end of if status if else
    }); // end of callback
  } // end of createSelectedMarker

  // FOR getting route from point A to B

  // sets up search input by instantiating auto complete in renderMap as soon as this.props.flat
  // is loaded in props
  handleSearchInput() {
    // setting map center and bounds for autocomplete
    // bounds focuses search results within the area
    const mapCenter = { lat: this.props.flat.lat, lng: this.props.flat.lng };
    const latOffsetNorth = 0.06629999999999825;
    const latOffsetSouth = -0.036700000000003286;
    const lngOffsetWest = -0.14;
    const lngOffsetEast = 0.2;

    // offset the same as the big map, so pans SF area and some of Oakland
    const defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(mapCenter.lat + latOffsetSouth, mapCenter.lng + lngOffsetWest), //more negative, less positive
      new google.maps.LatLng(mapCenter.lat + latOffsetNorth, mapCenter.lng + lngOffsetEast)
    ); //less negative, more positive

      //
      // console.log('in map_interaction, handleSearchInput, defaultBounds: ', defaultBounds);
      // gets input for autocomplete focused on bounds from above
      const input = document.getElementById('map-interaction-input');

      // this.setState({ placeCategory: 'Other' });

      const options = {
        bounds: defaultBounds
        // types: ['establishment']
      };

        // instantiate autocomplete and addlistener for when selection made
        const autocomplete = new google.maps.places.Autocomplete(input, options);
        autocomplete.addListener('place_changed', onPlaceChanged.bind(this));
        // console.log('in map_interaction, handleSearchInput, autocomplete: ', autocomplete);

        // console.log('in map_interaction, handleSearchInput, this.state.autoCompletePlace: ', this.state.autoCompletePlace);

        // called when place selected in autocomplete
        function onPlaceChanged() {
          // markers array needed to fit map to marker bounds
          // placeSearched state to indicate search has been done so can show appropriate message
          // at load and after no search results in search results show box

          const markersArray = [];
          // getPlace is an google maps autocomplete function
          const place = autocomplete.getPlace();

          //https://developers.google.com/places/supported_types
          this.setState({ placeSearched: true, placeCategory: place.types[0] });
          // console.log('in map_interaction, handleSearchInput, onPlaceChanged, place: ', place.types[0]);
          // List in 'Top Search Resutls'; put place in array first for getPlacesCallback to handle
          const placeForResultsList = [place];
          // sets results in this.state
          this.getPlacesCallback(placeForResultsList);
          // check if place returned; in case return pushed without selection in search input
          if (typeof place.geometry !== 'undefined') {
            // console.log('in map_interaction, handleSearchInput, place: ', place);
            // this is accessible as this function is bound to this(the class, not the function)
            // console.log('in map_interaction, handleSearchInput, thisthis: ', this);

            // latlng for the flat
            const location = { lat: this.props.flat.lat, lng: this.props.flat.lng }
            // create map with flat lat lng and initial zoom, zoom will be overriden by bounds of markers below
            const map = this.createMap(location, 14);

            // boolean passed to create marker to decide whether to show label on marker
            const showLabel = true;
            // marker of place from autocomplete
            const marker = this.createMarker(place, map, showLabel);
            const locationB = { lat: marker.position.lat(), lng: marker.position.lng() };
            const flatMarker = this.createFlatMarker(this.props.flat, map);

            // pushes markers into array for map zooming to bounds of markers
            markersArray.push(marker);
            // flatMarker is actually a circle for simplicity
            markersArray.push(flatMarker);

            //  location and location B are not places
            const searchClick = false;
            this.calculateAndDisplayRoute(flatMarker, marker, markersArray, map, searchClick)

            // marker.setMap(map);
            // marker for location B is set on map in getDistance
            flatMarker.setMap(map);

            // zoom map to fit markers drawn
            const bounds = new google.maps.LatLngBounds();
            // console.log('in map_interaction, handleSearchInput, bounds: ', bounds);
            // console.log('in map_interaction, handleSearchInput, markersArray: ', markersArray);

            // handle cases when marker is a circle or a real marker
            // used variable name marker for circle for simplicity
            for (let i = 0; i < markersArray.length; i++) {
              if (!markersArray[i].marker) {
                // console.log('in map_interaction, handleSearchInput, markersArray[i]: ', markersArray[i]);
                bounds.extend(markersArray[i].getCenter());
              } else {
                // console.log('in map_interaction, handleSearchInput, markersArray[i]: ', markersArray[i]);
                bounds.extend(markersArray[i].getPosition());
              }
            }
            map.fitBounds(bounds);
            // gets distance from flat to searched autocomplete place,
            // and draws marker with distance label and sets on map
            this.getDistance(location, locationB, marker, map);
          } // end of if place !== 'undefined'
        }
        // end of function function onPlaceChanged
        // else {
        //   document.getElementById('autocomplete').placeholder = 'Enter a city';
        // }
      // }
  }

    calculateAndDisplayRoute(pointA, pointB, markersArray, map, searchClick) {
      const directionsService = new google.maps.DirectionsService;
      const directionsDisplay = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true
      });
      // console.log('in map_interaction, calculateAndDisplayRoute, after if status, pointA, pointB: ', pointA, pointB);
      directionsDisplay.setMap(map);
      // console.log('in map_interaction, createSelectedMarker, after if status, pointA, pointB: ', pointA, pointB.place);
      // for some reason, better to send markers than lat lng when calling calculateAndDisplayRoute
      // !!!!! Use position if use marker not circle (use center)
      // const pointALatLng = searchClick ? { lat: pointA.position.lat(), lng: pointA.position.lng() } : { lat: pointA.position.lat(), lng: pointA.position.lng() }
      const pointALatLng = searchClick ? { lat: pointA.center.lat(), lng: pointA.center.lng() } : { lat: pointA.center.lat(), lng: pointA.center.lng() }
      const pointBLatLng = searchClick ? { lat: pointB.place.location.lat(), lng: pointB.place.location.lng() } : { lat: pointB.position.lat(), lng: pointB.position.lng() }

      // console.log('in map_interaction, createSelectedMarker, after if status, pointALatLng: ', pointALatLng);
    directionsService.route({
      origin: pointALatLng,
      destination: pointBLatLng,
      travelMode: google.maps.TravelMode.WALKING,
      // preserveViewport: true
    }, (response, status) => {
      if (status === 'OK') {
        // console.log('in map_interaction, calculateAndDisplayRoute, after if status, response: ', response);
        // console.log('in map_interaction, calculateAndDisplayRoute, after if status, markersArray: ', markersArray);
        // _.each(markersArray, marker => {
        //   marker.setMap(map)
        // });
        // !!!!! Directionlines; Don't call directionsDisplay if don't want lines
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
    // this.getDistance();
  }

  getDistance(pointALatLng, pointBLatLng, pointB, map) {
    // console.log('in map_interaction, getDistance, ointALatLng, pointBLatLng, pointB, map: ', pointALatLng, pointBLatLng, pointB, map);

    const distanceService = new google.maps.DistanceMatrixService();
    let distance = '';
    distanceService.getDistanceMatrix(
      {
        origins: [pointALatLng],
        destinations: [pointBLatLng],
        travelMode: 'WALKING',
      }, (response, status) => {
        if (status === 'OK') {
          // console.log('in map_interaction, getDistance, after if status, distanceService response distance response.rows[0].elements[0].distance: ', response.rows[0].elements[0].distance);

          distance = { distance: response.rows[0].elements[0].distance.text };
          const distanceText = response.rows[0].elements[0].distance.text;
          const marker = pointB;
          // console.log('in map_interaction, getDistance, after if status, distanceService after if, marker: ', marker);
          // console.log('in map_interaction, getDistance, after if status, distanceService after if, distanceText: ', distanceText);
          // marker.label.text = distance.text;
          const markerLabel = marker.getLabel();
          // console.log('in map_interaction, getDistance, after if status, distanceService after if, markerLabel: ', markerLabel);
          markerLabel.text = distanceText;
          marker.setLabel(markerLabel);
          // console.log('in map_interaction, getDistance, after if status, distanceService after if, markerLabel.text: ', markerLabel.tet);
          marker.setMap(map)
        }
      }
    );
    return distance;
  }

  unhighlightClickedPlace() {
    _.each(this.state.clickedPlaceArray, place => {
      const placeDiv = place;
      placeDiv.style.color = 'black';
    });
  }

  handlePlaceClick(event) {
    this.unhighlightClickedPlace();

    // console.log('in map_interaction, handlePlaceClick, event.target: ', event.target);
    const clickedElement = event.target;
    clickedElement.style.color = 'lightGray';
    const elementVal = clickedElement.getAttribute('value');
    // console.log('in map_interaction, handlePlaceClick, elementVal: ', elementVal);

    // this.setState({ clickedclickedPlaceArray: this.state.clickedPlaceArray.push(clickedElement) });
    // Don't know why but this works
    // this.state.clickedPlaceArray.push(clickedElement);
    // Here is the recommented code for pushing into state array
    this.setState(prevState => ({
      clickedPlaceArray: [...prevState.clickedPlaceArray, clickedElement]
    }));

    this.createSelectedMarker(elementVal);
  }

  handleResultAddClick(event) {
    this.props.showLoading();
    this.unhighlightClickedPlace();
    const clickedElement = event.target;
    // console.log('in map_interaction, handleResultAddClick, event.target, clickedElement: ', clickedElement);
    const elementVal = clickedElement.getAttribute('value');
    const elementName = clickedElement.getAttribute('name');
    // console.log('in map_interaction, handleResultAddClick, elementVal: ', elementVal);
    const elementValArray = elementVal.split(',');
    const placeId = elementValArray[0];
    const lat = elementValArray[1];
    const lng = elementValArray[2];
    const flatId = this.props.flat.id
    // console.log('in map_interaction, handleResultAddClick, elementVal: ', elementName);
    // console.log('in map_interaction, handleResultAddClick, this.props.flat.id: ', this.props.flat.id);
    this.props.createPlace(flatId, placeId, lat, lng, elementName, this.state.placeCategory, () => this.resultAddDeleteClickCallback());
    //ChIJIenHT9eAhYARiop0hvjNTzU
    //"9060163472ab6d69548873f75aba48278980c0ea"
  }

  resultAddDeleteClickCallback() {
    this.props.showLoading();
    // this.props.history.push(`/show/${this.props.flat.id}`);
  }

  createPlaceValueString(place) {
    // console.log('in map_interaction, createPlaceValueString, places: ', place);
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const id = place.place_id;
    // console.log('in map_interaction, createPlaceValueString, id lat lng: ', id + ',' + lat + ',' + lng);
    return id + ',' + lat + ',' + lng;
  }

  renderSearchResultsList() {
    // <div className="search-result-list-radio-label">Add to map <input value={place.place_id} name={place.name} type="checkbox" onChange={this.handleResultAddClick.bind(this)} /></div>
    // console.log('in map_interaction, renderSearchResultsList, this.state, placesResults: ', this.state);
    const { placesResults } = this.state;
    const resultsArray = [];
    const nearbySearchRadiusKM = NEARBY_SEARCH_RADIUS / 1000
    //using placeResults, a state object directly in map gives a error,
    //cannont use object as react child
    _.each(placesResults, result => {
      resultsArray.push(result);
      // console.log('in map_interaction, renderSearchResultsList, each result.name: ', result);
    });
    // console.log('in map_interaction, renderSearchResultsList, resultsArray: ', resultsArray);
    if (resultsArray.length < 1) {
      if (this.state.placeSearched) {
        return <div style={{ padding: '20px' }}><i style={{ fontSize: '19px' }}className="fa fa-exclamation-triangle"></i>&nbsp;No results within {nearbySearchRadiusKM}km of flat, try searching by inputting name.</div>;
      } else {
        return <div style={{ padding: '20px' }}><i style={{ fontSize: '19px' }}className="fa fa-info-circle"></i>&nbsp;&nbsp;To get nearby places, click on criterion under "Search for Nearest," then click the "add" button to add it to your list so that users can see it on the show page.</div>;
      };
    } else {
      return _.map(resultsArray, (place) => {
        const placeValueString = this.createPlaceValueString(place);
        // const array = placeValueString.split(',');
        // console.log('in map_interaction, renderSearchResultsList, .map placeValueString: ', placeValueString);
        // console.log('in map_interaction, renderSearchResultsList, .map array: ', array);
        // console.log('in map_interaction, renderSearchResultsList, .map, place: ', place);
        return (
          <div key={place.place_id.toString()}>
            <li value={place.place_id} className="map-interaction-search-result" onClick={this.handlePlaceClick.bind(this)}><i className="fa fa-chevron-right"></i>
            &nbsp;{place.name}
            </li>
            <div className="search-result-list-radio-label"><button className="btn btn-primary btn-sm add-place-btn" value={placeValueString} name={place.name} type="checkbox" onClick={this.handleResultAddClick.bind(this)}>Add</ button></div>
          </div>
        )
      });
    }
  }

  handleResultDeleteClick(event) {
    this.props.showLoading();
    const clickedElement = event.target;
    // console.log('in map_interaction, handleResultDeleteClick, event.target, clickedElement: ', clickedElement);
    const placeId = clickedElement.getAttribute('value');
    // console.log('in map_interaction, handleResultDeleteClick, placeId: ', placeId);
    this.props.deletePlace(this.props.flat.id, placeId, () => this.resultAddDeleteClickCallback())
  }

  handleSelectedPlaceClick(event) {
    this.unhighlightClickedPlace();

    // console.log('in map_interaction, handleSelectedPlaceClick, event.target: ', event.target);
    const clickedElement = event.target;
    clickedElement.style.color = 'lightGray';
    const elementVal = clickedElement.getAttribute('value');
    // console.log('in map_interaction, handleSelectedPlaceClick, elementVal: ', elementVal);

    // this.setState({ clickedclickedPlaceArray: this.state.clickedPlaceArray.push(clickedElement) });
    // Don't know why but this works
    // this.state.clickedPlacseArray.push(clickedElement);
    this.setState(prevState => ({
      clickedPlaceArray: [...prevState.clickedPlaceArray, clickedElement]
    }));

    this.createSelectedMarker(elementVal);
  }

  getCategoriesArray(places) {
    const categoriesArray = [];
    console.log('in map_interaction, getCategoriesArray, places: ', places);
    _.each(places, place => {
      if (!categoriesArray.includes(place.category)) {
        categoriesArray.push(place.category);
      }
    });
    return categoriesArray;
  }

  renderEachResult(places, category) {
    return _.map(places, (place, i) => {
      if (place.category == category) {
        // console.log('in map_interaction, renderEachResult, .map, place: ', place);
        // console.log('in map_interaction, renderEachResult, .map, category: ', category);
        // add hide in first div to toggle
        return (
          <div value={category} key={place.id.toString()} className="map-interaction-nearby-result-div">
            <li value={place.placeid} className="map-interaction-search-result" onClick={this.handleSelectedPlaceClick.bind(this)}><i key={i.toString()} className="fa fa-chevron-right"></i>
            &nbsp;{place.place_name}
            </li>
          {this.props.showFlat ? '' : <div className="search-result-list-radio-label"><button className="btn btn-primary btn-sm remove-place-btn" value={place.id} type="checkbox" onClick={this.handleResultDeleteClick.bind(this)}>Remove</ button></div>}
          </div>
        );
      }
    });
  }
// !!!!!!!!!!!!!! Code to toggle headings in nearby places
  // handleCategoryHeadingClick(event) {
  //   // toggles open and closed the categories in nearby places
  //   const clickedElement = event.target;
  //   const elementVal = clickedElement.getAttribute('value');
  //   // console.log('in map_interaction, handleCategoryHeadingClick elementVal: ', elementVal);
  //   const categoryHeadings = document.getElementsByClassName('map-interaction-nearby-result-div')
  //   // console.log('in map_interaction, handleCategoryHeadingClick elementVal: ', elementToOpen);
  //   // gets category value from div and checks each div with above class if it matches
  //   // the clicked div value and if so takes off hide if it has hide as a class and
  //   // adds hide if it does not
  //   _.each(categoryHeadings, element => {
  //     // console.log('in map_interaction, handleCategoryHeadingClick element value: ', element.getAttribute('value'));
  //     const clickedElementVal = element.getAttribute('value')
  //     if (elementVal == clickedElementVal) {
  //       if (element.classList.contains('hide')) {
  //         element.classList.remove('hide');
  //       } else {
  //         element.classList.add('hide');
  //       }
  //     }
  //   });
  // }

  renderSelectedResultsList() {
    // renders the places in the database with flat_id of show flat
    // 'remove' buttons do not show in showflat page
    const { places } = this.props;
    // const searchTypeObject = SearchTypeList;
      const placesEmpty = _.isEmpty(places);
    if (!placesEmpty) {
      const categories = this.getCategoriesArray(places);
      // categories.sort();
      // console.log('in map_interaction, renderSelectedResultsList, places: ', places);
      // console.log('in map_interaction, renderSelectedResultsList, categories: ', categories);
      // console.log('in map_interaction, renderSelectedResultsList, searchTypeObject[category]: ', searchTypeObject[category]);
      // {this.renderEachResult(places, category)}
      // code for toggling category heading
      // <div value={category} className="search-result-category-heading" onClick={this.handleCategoryHeadingClick.bind(this)}>
      return _.map(categories, category => {
        // const cat = category;
        // console.log('in map_interaction, renderSelectedResultsList,  SearchTypeList[category]: ', SearchTypeList[category]);
        return (
          <div key={category}>
            <div value={category} className="search-result-category-heading">
              {SearchTypeList[category].name}
            </div>
            {this.renderEachResult(places, category)}
          </div>
        );
      });
    } else {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>No nearby places registered</div>
      );
    }
  }
  // Need to work o this... Cannot set language preference in app.js script after componentWillMount
  handleSearchLanguageSelect() {
    const selection = document.getElementById('mapInteractionLanguageSelect');
    const language = selection.value;
    // console.log('in map_interaction, handleSearchLanguageSelect, language: ', language);
    // this.getPlaces(type, () => this.getPlacesCallback())
    this.props.placeSearchLanguage(language, () => this.searchLanguageCallback());
  }

  searchLanguageCallback() {
    // console.log('in map_interaction, searchLanguageCallback, this.props.language: ', this.props.language);
  }

  renderSearchBox() {
    // this.renderSearchSelection();
    // keep for when there is solution for language selection;
    // <select id="mapInteractionLanguageSelect" className="map-interaction-input-area" onChange={this.handleSearchLanguageSelect.bind(this)}>
    // <option>Select Search Output Language</option>
    // <option value="en">English</option>
    // <option value="jp">Japanese</option>
    // </ select>
    return (
      <div className="map-interaction-box">
        <div className="map-interaction-title"><i className="fa fa-search"></i>  Search for Nearest</div>
        <div value="school"className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Schools</div>
        <div value="convenience_store" className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Convenience Stores</div>
        <div value="supermarket" className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Supermarkets</div>
        <div value="train_station" className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Train Stations</div>
        <div value="subway_station" className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Subway Stations</div>
        <select id="typeSelection" onChange={this.handleSearchTypeSelect.bind(this)}>
          <option value="acquarium">Select type of place nearby</option>
          {this.renderSearchSelection()}
        </select>
        <input id="map-interaction-input" className="map-interaction-input-area" type="text" placeholder="Search for place name or address..." />
      </div>
    );
  }

  renderSearchResultsBox() {
    return (
      <div className="map-interaction-box">
        <div className="map-interaction-title"><i className="fa fa-chevron-circle-right"></i>  Top Search Results</div>
        <ul>
          {this.renderSearchResultsList()}
        </ul>
      </div>
    );
  }

  renderPlacesBox() {
    return (
      <div className="map-interaction-box">
        <div className="map-interaction-title"><i className="fa fa-chevron-circle-right"></i>  Nearby Places</div>
        <ul>
          {this.renderSelectedResultsList()}
        </ul>
      </div>
    );
  }

  renderMapInteractiion() {
    // reference https://developers.google.com/places/web-service/supported_types
    // a tag reference: https://stackoverflow.com/questions/1801732/how-do-i-link-to-google-maps-with-a-particular-longitude-and-latitude
    // <div className="btn btn-small search-gm-button"><a href={'http://www.google.com/maps/place/ ' + this.props.flat.lat + ',' + this.props.flat.lng + '/@' + this.props.flat.lat + ',' + this.props.flat.lng + ',14z'} target="_blank" rel="https://wwww.google.com" >Open Google Maps and Search</a></div>
    // !!!!!!Language selection for search results
    // {this.props.showFlat? '' : this.renderSearchSelection()}
    // <img src={images['apartment.jpg']} />
    if (this.props.flat) {
      return (
        <div className="map-interaction-container">
          {this.props.showFlat ? '' : this.renderSearchBox()}
          {this.props.showFlat ? '' : this.renderSearchResultsBox()}
          {this.renderPlacesBox()}
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderMapInteractiion()}
      </div>
    );
  }
}

// function importAll(r) {
//   let images = {};
//   r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
//   return images;
// }
//
// const images = importAll(require.context('../../images', false, /\.(png|jpe?g|svg)$/));

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in MapInteraction, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
  };
}


export default connect(mapStateToProps, actions)(MapInteraction);
