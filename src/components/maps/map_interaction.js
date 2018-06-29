import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';

import SearchTypeList from '../constants/search_type_list'

import * as actions from '../../actions';

// this compoenent is for creating and managing places on show and editflat
// on show, takes showFlat prop and shows only the places selected for flat
// on edit flat page, user can select and add places with flat id associated
class MapInteraction extends Component {
  constructor(props) {
   super(props);
   this.state = { placesResults: [], map: {}, autoCompletePlace: {}, clickedPlaceArray: [] };
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
    if (this.props.flat) {
      this.handleSearchInput();
    }
  }

  createMap(location, zoom) {
    console.log('in show_flat, createMap, location: ', location);
    const map = new google.maps.Map(document.getElementById('map'), {
      center: location,
      zoom
    });
    this.setState({ map })
    return map;
  }

  getPlaces(criterion) {
    console.log('in show_flat, getPlaces, at top thisthis: ', this);
    console.log('in show_flat, getPlaces, criterion: ', criterion);
    console.log('in show_flat, getPlaces, this.props.flat.lat: ', this.props.flat.lat);
    console.log('in show_flat, getPlaces, this.props.flat.lng: ', this.props.flat.lng);
    const radius = 5000;
    // https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=YOUR_API_KEY
    const location = { lat: this.props.flat.lat, lng: this.props.flat.lng };
    const flat = this.props.flat;

    // axios.get(`https://maps.googleapis.com/maps/api/place/radarsearch/json?location=${this.props.flat.lat},${this.props.flat.lat}&radius=${radius}&type=${criterion}&key=${GOOGLEMAP_API_KEY}`)
    //   .then(response => {
    //     console.log('in show_flat, getPlaces, gmap request, response: ', response);
    //   });
    // const mapShow = new google.maps.Map(document.getElementById('map'), {
    //      center: location,
    //      zoom: 14
    //    });
    const mapShow = this.createMap(location, 14);

    const service = new google.maps.places.PlacesService(mapShow);
    console.log('in show_flat, getPlaces, service: ', service);
    service.nearbySearch({
      location,
      radius: 2000,
      // if rank by distance, DO NOT use radius
      type: criterion
      // rankBy: google.maps.places.RankBy.DISTANCE
      // the propblem with rank by distance is in case of lots of results, give irrelevant results
    }, (results, status) => {
      // use () => to bind to this; gives access to this object
      // if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (status === 'OK') {
          console.log('in show_flat, getPlaces, Placeservice, results: ', results);
          // console.log('in show_flat, getPlaces, Placeservice, placesResults: ', placesResults);
          // placesResults = results;
          // console.log('in show_flat, getPlaces, Placeservice, this.props: ', this.props);
          // this.setState({ placesResults: results });
          console.log('in show_flat, getPlaces, after if thisthis?: ', this);

          for (let i = 0; i < results.length; i++) {
            const showLabel = false;
            const marker = this.createMarker(results[i], mapShow, showLabel);
            marker.setMap(mapShow)
            console.log('in show_flat, getPlaces, Placeservice: ', results[i]);
            // resultsArray.push(results[i]);
            // console.log('in show_flat, getPlaces, Placeservice: ', results[i]);
          }
          // create marker for flat each time
          const flatMarker = this.createFlatMarker(flat, mapShow);
          flatMarker.setMap(mapShow);
          // if (resultsArray.length > 0) {
          this.getPlacesCallback(results);
          // this.setState({ map: mapShow })

            // console.log('in show_flat, getPlaces, Placeservice, resultsArray.length: ', resultsArray.length);
            // console.log('in show_flat, getPlaces, Placeservice, resultsArray: ', resultsArray);
          // }
          // getResultsOfPlacesSearch(results);
          // setStateWithResults(results);
        }
      }); // end of callback {} and nearbySearch
  } //end of getPlaces

  createMarker(place, mapShow, showLabel) {
    if (typeof place.geometry !== 'undefined') {
      const infowindow = new google.maps.InfoWindow();
      const markerIcon = {
        // url: 'http://image.flaticon.com/icons/svg/252/252025.svg',
        url: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
        // url: 'https://image.flaticon.com/icons/svg/138/138978.svg',
        // url: 'https://image.flaticon.com/icons/svg/143/143964.svg',        // scaledsize originally 80, 80 taken from medium https://medium.com/@barvysta/google-marker-api-lets-play-level-1-dynamic-label-on-marker-f9b94f2e3585
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        //anchor starts at 0,0 at left corner of marker
        anchor: new google.maps.Point(20, 40),
        //label origin starts at 0, 0 somewhere above the marker
        labelOrigin: new google.maps.Point(20, 33)
      };
      console.log('in show_flat, createMarker, place.geometry: ', place.geometry);
      const placeLoc = place.geometry.location;
      // Don't need map; setMap is run in function where createMarker is called
      const marker = new google.maps.Marker({
        // map: mapShow,
        position: place.geometry.location,
        icon: markerIcon,
        marker: true,
        label: showLabel ? { text: '', fontWeight: 'bold' } : ''
      });

      google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(mapShow, this);
      });
      return marker;
    }
  } // end of createMarker

  createFlatMarker(flat, map) {
    // console.log('in show_flat, createFlatMarker, flatLocation: ', flatLocation);
    console.log('in show_flat, createFlatMarker, flat: ', flat);
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
      console.log('in show_flat, createFlatMarker, marker (circle): ', marker);
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
  //   console.log('in show_flat, handlePlaceSearchClick, clicked: ', event);
  //   const input = document.getElementById('map-interaction-input');
  //   console.log('in show_flat, handlePlaceSearchClick, input: ', input.value);
  //   console.log('in show_flat, handlePlaceSearchClick, thisthis: ', this);
  //   this.getPlaces(input.value);
  //   input.value = '';
  // }



  getPlacesCallback(results) {
    console.log('in show_flat, getPlacesCallback, results ??: ', results);

    this.setState({ placesResults: results }, () => console.log('show flat, getPlacesCallback, setState callback, this.state: ', this.state))
  }

  handleSearchCriterionClick(event) {
    this.unhighlightClickedPlace();
    console.log('in show_flat, handleSearchCriterionClick, clicked, event: ', event.target);
    const clickedElement = event.target;
    let elementVal = clickedElement.getAttribute('value');
    console.log('in show_flat, handleSearchCriterionClick, elementVal: ', elementVal);

    this.getPlaces(elementVal);
  }

  renderSearchSelection() {
    // consider moving this somewhere else
    const searchTypeList = SearchTypeList;
    return _.map(searchTypeList, (v, k) => {
        return <option key={k} value={k}>{v}</option>;
      // })
    });
}

  handleSearchTypeSelect() {
    const selection = document.getElementById('typeSelection');
    const type = selection.options[selection.selectedIndex].value;
    console.log('in show_flat, handleSearchTypeSelect, type: ', type);
    this.getPlaces(type, () => this.getPlacesCallback())
  }

  createSelectedMarker(placeId) {
    // IMPORTANT creates marker based on placeID, not place as createMarker does
    // handlePlaceSearchClick gets value of the li which is a place id not the object place
    // so need to get a marker with the place id
    console.log('in show_flat, createSelectedMarker, placeId: ', placeId);
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
        console.log('in show_flat, createSelectedMarker, after if status, result: ', status, result);
        const pointA = this.createFlatMarker(flat, map);
        markersArray.push(pointA);
        console.log('in show_flat, createSelectedMarker, after if status, pointA: ', pointA);
        // const pointB = this.createMarker(flat, map);

        const markerIcon = {
          // url: 'http://image.flaticon.com/icons/svg/252/252025.svg',
          url: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
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
        console.log('in show_flat, createSelectedMarker, after if status, distance: ', distance);
        pointA.setMap(map)

        console.log('in show_flat, createSelectedMarker, after if status, pointB: ', pointB);
        console.log('in show_flat, createSelectedMarker, after if status, markersArray: ', markersArray);

        google.maps.event.addListener(pointB, 'click', function () {
          infowindow.setContent(result.name);
          infowindow.open(map, this);
        });
        const searchClick = true;
        this.calculateAndDisplayRoute(pointA, pointB, markersArray, map, searchClick);
      } else {
        console.log('in show_flat, createSelectedMarker, else status: ', status);
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
      // console.log('in show_flat, handleSearchInput, defaultBounds: ', defaultBounds);
      // gets input for autocomplete focused on bounds from above
      const input = document.getElementById('map-interaction-input');
      const options = {
        bounds: defaultBounds
        // types: ['establishment']
      };

        // instantiate autocomplete and addlistener for when selection made
        const autocomplete = new google.maps.places.Autocomplete(input, options);
        autocomplete.addListener('place_changed', onPlaceChanged.bind(this));
        console.log('in show_flat, handleSearchInput, autocomplete: ', autocomplete);

        // console.log('in show_flat, handleSearchInput, this.state.autoCompletePlace: ', this.state.autoCompletePlace);

        // called when place selected in autocomplete
        function onPlaceChanged() {
          // markers array needed to fit map to marker bounds
          const markersArray = [];
          const place = autocomplete.getPlace();
          // List in 'Top Search Resutls'; put place in array first for getPlacesCallback to handle
          const placeForResultsList = [place];
          this.getPlacesCallback(placeForResultsList);
          // check if place returned; in case return pushed without selection in search input
          if (typeof place.geometry !== 'undefined') {
            console.log('in show_flat, handleSearchInput, place: ', place);
            // this is accessible as this function is bound to this(the class, not the function)
            // console.log('in show_flat, handleSearchInput, thisthis: ', this);

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
            markersArray.push(flatMarker);

            //  location and location B are not places
            const searchClick = false;
            this.calculateAndDisplayRoute(flatMarker, marker, markersArray, map, searchClick)

            // marker.setMap(map);
            // marker for location B is set on map in getDistance
            flatMarker.setMap(map);

            // zoom map to fit markers drawn
            const bounds = new google.maps.LatLngBounds();
            console.log('in show_flat, handleSearchInput, bounds: ', bounds);
            console.log('in show_flat, handleSearchInput, markersArray: ', markersArray);

            for (let i = 0; i < markersArray.length; i++) {
              if (!markersArray[i].marker) {
                console.log('in show_flat, handleSearchInput, markersArray[i]: ', markersArray[i]);
                bounds.extend(markersArray[i].getCenter());
              } else {
                console.log('in show_flat, handleSearchInput, markersArray[i]: ', markersArray[i]);
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
      console.log('in show_flat, calculateAndDisplayRoute, after if status, pointA, pointB: ', pointA, pointB);
      directionsDisplay.setMap(map);
      console.log('in show_flat, createSelectedMarker, after if status, pointA, pointB: ', pointA, pointB.place);
      // for some reason, better to send markers than lat lng when calling calculateAndDisplayRoute
      // !!!!! Use position if use marker not circle (use center)
      // const pointALatLng = searchClick ? { lat: pointA.position.lat(), lng: pointA.position.lng() } : { lat: pointA.position.lat(), lng: pointA.position.lng() }
      const pointALatLng = searchClick ? { lat: pointA.center.lat(), lng: pointA.center.lng() } : { lat: pointA.center.lat(), lng: pointA.center.lng() }
      const pointBLatLng = searchClick ? { lat: pointB.place.location.lat(), lng: pointB.place.location.lng() } : { lat: pointB.position.lat(), lng: pointB.position.lng() }

      console.log('in show_flat, createSelectedMarker, after if status, pointALatLng: ', pointALatLng);
    directionsService.route({
      origin: pointALatLng,
      destination: pointBLatLng,
      travelMode: google.maps.TravelMode.WALKING,
      // preserveViewport: true
    }, (response, status) => {
      if (status === 'OK') {
        console.log('in show_flat, calculateAndDisplayRoute, after if status, response: ', response);
        console.log('in show_flat, calculateAndDisplayRoute, after if status, markersArray: ', markersArray);
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
    console.log('in show_flat, getDistance, ointALatLng, pointBLatLng, pointB, map: ', pointALatLng, pointBLatLng, pointB, map);

    const distanceService = new google.maps.DistanceMatrixService();
    let distance = '';
    distanceService.getDistanceMatrix(
      {
        origins: [pointALatLng],
        destinations: [pointBLatLng],
        travelMode: 'WALKING',
      }, (response, status) => {
        if (status === 'OK') {
          console.log('in show_flat, getDistance, after if status, distanceService response distance response.rows[0].elements[0].distance: ', response.rows[0].elements[0].distance);

          distance = { distance: response.rows[0].elements[0].distance.text };
          const distanceText = response.rows[0].elements[0].distance.text;
          const marker = pointB;
          console.log('in show_flat, getDistance, after if status, distanceService after if, marker: ', marker);
          console.log('in show_flat, getDistance, after if status, distanceService after if, distanceText: ', distanceText);
          // marker.label.text = distance.text;
          const markerLabel = marker.getLabel();
          console.log('in show_flat, getDistance, after if status, distanceService after if, markerLabel: ', markerLabel);
          markerLabel.text = distanceText;
          marker.setLabel(markerLabel);
          console.log('in show_flat, getDistance, after if status, distanceService after if, markerLabel.text: ', markerLabel.tet);
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

    console.log('in show_flat, handlePlaceClick, event.target: ', event.target);
    const clickedElement = event.target;
    clickedElement.style.color = 'lightGray';
    const elementVal = clickedElement.getAttribute('value');
    console.log('in show_flat, handlePlaceClick, elementVal: ', elementVal);

    // this.setState({ clickedclickedPlaceArray: this.state.clickedPlaceArray.push(clickedElement) });
    // Don't know why but this works
    this.state.clickedPlaceArray.push(clickedElement);
    this.createSelectedMarker(elementVal);
  }

  handleResultAddClick(event) {
    this.props.showLoading();
    this.unhighlightClickedPlace();
    const clickedElement = event.target;
    console.log('in show_flat, handleResultAddClick, event.target, clickedElement: ', clickedElement);
    const elementVal = clickedElement.getAttribute('value');
    const elementName = clickedElement.getAttribute('name');
    console.log('in show_flat, handleResultAddClick, elementVal: ', elementVal);
    console.log('in show_flat, handleResultAddClick, elementVal: ', elementName);
    console.log('in show_flat, handleResultAddClick, this.props.flat.id: ', this.props.flat.id);
    this.props.createPlace(this.props.flat.id, elementVal, elementName, () => this.resultAddDeleteClickCallback());
  }

  resultAddDeleteClickCallback() {
    this.props.showLoading();
    // this.props.history.push(`/show/${this.props.flat.id}`);
  }

  renderSearchResultsList() {
    // <div className="search-result-list-radio-label">Add to map <input value={place.place_id} name={place.name} type="checkbox" onChange={this.handleResultAddClick.bind(this)} /></div>
    console.log('in show_flat, renderSearchResultsList, this.state, placesResults: ', this.state);
    const { placesResults } = this.state;
    const resultsArray = [];
    //using placeResults, a state object directly in map gives a error,
    //cannont use object as react child
    _.each(placesResults, result => {
      resultsArray.push(result);
      console.log('in show_flat, renderSearchResultsList, each result.name: ', result);
    });
    console.log('in show_flat, renderSearchResultsList, resultsArray: ', resultsArray);

    return _.map(resultsArray, (place) => {
      console.log('in show_flat, renderSearchResultsList, .map, place: ', place);
      return (
        <div key={place.place_id}>
          <li value={place.place_id} className="map-interaction-search-result" onClick={this.handlePlaceClick.bind(this)}><i className="fa fa-chevron-right"></i>
          &nbsp;{place.name}
          </li>
          <div className="search-result-list-radio-label"><button className="btn btn-primary btn-sm" value={place.place_id} name={place.name} type="checkbox" onClick={this.handleResultAddClick.bind(this)}>Add</ button></div>
        </div>
      )
    });
  }

  handleResultDeleteClick(event) {
    this.props.showLoading();
    const clickedElement = event.target;
    console.log('in show_flat, handleResultDeleteClick, event.target, clickedElement: ', clickedElement);
    const placeId = clickedElement.getAttribute('value');
    console.log('in show_flat, handleResultDeleteClick, placeId: ', placeId);
    this.props.deletePlace(this.props.flat.id, placeId, () => this.resultAddDeleteClickCallback())
  }

  handleSelectedPlaceClick(event) {
    this.unhighlightClickedPlace();

    console.log('in show_flat, handleSelectedPlaceClick, event.target: ', event.target);
    const clickedElement = event.target;
    clickedElement.style.color = 'lightGray';
    const elementVal = clickedElement.getAttribute('value');
    console.log('in show_flat, handleSelectedPlaceClick, elementVal: ', elementVal);

    // this.setState({ clickedclickedPlaceArray: this.state.clickedPlaceArray.push(clickedElement) });
    // Don't know why but this works
    this.state.clickedPlaceArray.push(clickedElement);

    this.createSelectedMarker(elementVal);
  }

  renderSelectedResultsList() {
    // renders the places in the database with flat_id of show flat
    // 'remove' buttons do not show in showflat page
    const { places } = this.props;
    if (places) {
      console.log('in show_flat, renderSelectedResultsList, places: ', places);
      return _.map(places, (place) => {
        console.log('in show_flat, renderSelectedResultsList, .map, place: ', place);
        return (
          <div key={place.id}>
          <li value={place.placeid} className="map-interaction-search-result" onClick={this.handleSelectedPlaceClick.bind(this)}><i className="fa fa-chevron-right"></i>
          &nbsp;{place.place_name}
          </li>
          {this.props.showFlat ? '' : <div className="search-result-list-radio-label"><button className="btn btn-primary btn-sm" value={place.id} type="checkbox" onClick={this.handleResultDeleteClick.bind(this)}>Remove</ button></div>}
          </div>
        );
      });
    }
  }

  handleSearchLanguageSelect() {
    const selection = document.getElementById('mapInteractionLanguageSelect');
    const language = selection.value;
    console.log('in show_flat, handleSearchLanguageSelect, language: ', language);
    // this.getPlaces(type, () => this.getPlacesCallback())
    this.props.placeSearchLanguage(language, () => this.searchLanguageCallback());
  }

  searchLanguageCallback() {
    console.log('in show_flat, searchLanguageCallback, this.props.language: ', this.props.language);
  }

  renderSearchBox() {
    return (
      <div className="map-interaction-box">
      <div className="map-interaction-title"><i className="fa fa-search"></i>  Search for Nearest</div>
      <div value="school"className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Schools</div>
      <div value="convenience_store" className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Convenience Stores</div>
      <div value="supermarket" className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Supermarkets</div>
      <div value="train_station" className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Train Stations</div>
      <div value="subway_station" className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Subway Stations</div>
      <select id="typeSelection" onChange={this.handleSearchTypeSelect.bind(this)}>
      {this.renderSearchSelection()}
      </select>
      <input id="map-interaction-input" className="map-interaction-input-area" type="text" placeholder="Enter place name or address..." />
      <select id="mapInteractionLanguageSelect" className="map-interaction-input-area" onChange={this.handleSearchLanguageSelect.bind(this)}>
      <option>Select Search Output Language</option>
      <option value="en">English</option>
      <option value="jp">Japanese</option>
      </ select>
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
