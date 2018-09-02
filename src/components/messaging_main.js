import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

import Messaging from './messaging/messaging';
import Conversations from './messaging/conversations';
import AppLanguages from './constants/app_languages';

const RESIZE_BREAK_POINT = 800;
// if any of the class names below are changed in any way, update the array below
const SUB_BOX_LISTING_CLASS_ARRAY = [
  'main-messaging-sub-control-listing-details',
  'main-messaging-sub-control-listing-details-img',
  'main-messaging-sub-control-listing-details-box',
  'main-messaging-sub-control-listing-details-box-div',
  'messaging-main-sub-control-box-all-listings'
];

class MessagingMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      showTrashBin: false,
      showArchiveBin: false,
      showAllConversations: true,
      filteredConversationsArray: [],
      showMessageControls: false,
      showMessageSubControls: false,
      sortListingId: null,
      sortListingSelected: false,
      sortByDateNew: true,
      sortByDateOld: false,
      searchInputVal: ''
    };
    // this.handleSearchInput = this.handleSearchInput.bind(this);
  }

  componentDidMount() {
    // console.log('in messagingMain, componentDidMount');
      window.addEventListener('resize', this.handleResize.bind(this));
      // this.props.match.params.id
      this.props.fetchFlatsByUser(this.props.match.params.id, () => {})
      this.props.fetchConversationsByUser(() => {});
      this.props.fetchProfileForUser(() => {});
      this.conversationSlideIn();
  }

  componentWillUnmount() {
    // remove addEventListener for closing control boxes when unmounting component
    if (this.state.showMessageControls || this.state.showMessageSubControls) {
      const body = document.getElementById('messaging-main-main-container');
      body.removeEventListener('click', this.messageControlCloseClick);
    }
  }

  handleResize() {
    // console.log('in messagingMain, createBackghandleResizeroundImage: ', this.state.windowWidth);
    this.setState({ windowWidth: window.innerWidth }, () => {
      // console.log('in messagingMain, handleResize, this.state.windowWidth: ', this.state.windowWidth);
    });
  }

  handleMessageBackClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    // console.log('in messagingMain, handleMessageBackClick, clickedElement: ', clickedElement);
    // console.log('in messagingMain, handleMessageBackClick, elementVal: ', elementVal);
    // this.props.checkedConversations(this.props.checkedConversationsArray);
    this.setState({ showAllConversations: true, showArchiveBin: false, showTrashBin: false });
  }

  renderEachMainControl() {
    if (this.state.showAllConversations) {
      return (
        <div className="messaging-main-controls-left">
          <div
            id="messaging-main-large-archive-sort"
            className="btn messaging-main-large-archive sort"
            value="sort"
            onClick={this.handleMessageEditClick.bind(this)}
          >
            <i
            className="fa fa-sort sort"
            value="sort"
            style={this.state.sortByDateOld ? { color: 'green' } : { color: 'gray' }}
            onClick={this.handleMessageEditClick.bind(this)}
            >
            </i>
          </div>
          <div
            id="messaging-main-large-archive-filter"
            className="btn messaging-main-large-archive filter"
            value="filter"
            onClick={this.handleMessageEditClick.bind(this)}
          >
            <i
              className="fa fa-filter filter"
              value="filter"
              // style={this.state.sortListingSelected ? { color: '#fff600' } : { color: 'gray' }}
              style={(this.state.sortListingSelected || (this.state.searchInputVal !== '')) ? { color: 'green' } : { color: 'gray' }}
              onClick={this.handleMessageEditClick.bind(this)}
            >
            </i>
          </div>
          <div value="archivebin" className="btn messaging-main-large-archive" onClick={this.handleMessageEditClick.bind(this)}>{AppLanguages.archives[this.props.appLanguageCode]}</div>
          <div value="trashbin" className="btn messaging-main-large-archive" onClick={this.handleMessageEditClick.bind(this)}>{AppLanguages.trashBin[this.props.appLanguageCode]}</div>
          <div className="btn messaging-main-large-refresh" id="messaging-refresh" onClick={this.handleMessageRefreshClick.bind(this)}><i className="fa fa-refresh" aria-hidden="true"></i></div>
        </div>
      );
    }
    if (this.state.showArchiveBin) {
      // <div className="btn messaging-main-large-refresh" id="messaging-refresh" onClick={this.handleMessageRefreshClick.bind(this)}><i className="fa fa-refresh" aria-hidden="true"></i></div>
      return (
        <div className="messaging-main-controls-left">
          <div value="archivebin" className="btn messaging-main-large-archive" onClick={this.handleMessageBackClick.bind(this)}><i className="fa fa-angle-left"></i></div>
          <div value="archivebin" className="messaging-main-large-archive" style={{ color: 'black' }}>{AppLanguages.archivedMessages[this.props.appLanguageCode]}</div>
          <div value="unarchive" className="btn messaging-main-large-archive"  style={this.props.checkedConversationsArray.length > 0 ? { color: 'blue' } : { color: 'gray' }} onClick={this.handleMessageEditClick.bind(this)}>{AppLanguages.unarchive[this.props.appLanguageCode]}</div>
          <div value="trash" className="btn messaging-main-large-trash" onClick={this.handleMessageEditClick.bind(this)}><i value="trash" className="fa fa-trash-o"></i></div>
        </div>
      );
    }
    if (this.state.showTrashBin) {
      // <div className="btn messaging-main-large-refresh" id="messaging-refresh" onClick={this.handleMessageRefreshClick.bind(this)}><i className="fa fa-refresh" aria-hidden="true"></i></div>
      return (
        <div className="messaging-main-controls-left">
          <div value="archivebin" className="btn messaging-main-large-archive" onClick={this.handleMessageBackClick.bind(this)}><i className="fa fa-angle-left"></i></div>
          <div value="untrash" className="btn messaging-main-large-archive" style={this.props.checkedConversationsArray.length > 0 ? { color: 'blue' } : { color: 'gray' }} onClick={this.handleMessageEditClick.bind(this)}>{AppLanguages.untrash[this.props.appLanguageCode]}</div>
          <div value="trashbin" className="messaging-main-large-archive" style={{ color: 'black' }}>{AppLanguages.trashBin[this.props.appLanguageCode]}</div>
          <div value="deleteCompletely" className="btn messaging-main-large-archive" style={this.props.checkedConversationsArray.length > 0 ? { color: 'blue' } : { color: 'gray' }} onClick={this.handleMessageEditClick.bind(this)}>{AppLanguages.deleteCompletely[this.props.appLanguageCode]}</div>
        </div>
      );
    }
  }

  renderMainControls() {
    return (
      <div>
        {this.renderEachMainControl()}
      </div>
    );
  }

  renderMessagingControls() {
    // console.log('in messagingMain, renderMessagingControls, this.state.showMessageControls: ', this.state.showMessageControls);
    const conversationBox = document.getElementById('messaging-main-conversation-box')
    const elementFilter = document.getElementById('messaging-main-large-archive-sort')
    let leftDiff = null;
    // console.log('in messagingMain, renderMessagingSubControls, elementFilter, conversationBox: ', elementFilter, conversationBox);
    // console.log('in messagingMain, renderMessagingSubControls: ', this.state.sortListingSelected);
    if (elementFilter && conversationBox) {
      const rect = elementFilter.getBoundingClientRect();
      const rectBox = conversationBox.getBoundingClientRect();
      // console.log('in messagingMain, renderMessagingSubControls, rect.top, rect.right, rect.bottom, rect.left: ', rect.top, rect.right, rect.bottom, rect.left);
      // console.log('in messagingMain, renderMessagingSubControls, rectBox.top, rectBox.right, rectBox.bottom, rectBox.left: ', rectBox.top, rectBox.right, rectBox.bottom, rectBox.left);
      leftDiff = rect.left - rectBox.left;
      // console.log('in messagingMain, renderMessagingSubControls, leftDiff: ', leftDiff);
      // const elementFilterPos = elementFilter.offsetLeft();
      // const conversationBoxPos = conversationBox.offsetLeft();
    }
      return (
        <div className="messaging-main-messaging-control-box-box" id="messaging-main-messaging-control-box-box" style={{ left: `${leftDiff - 5}px` }}>
          <div id="messaging-main-messaging-control-box" className={this.state.showMessageControls ? 'messaging-main-messaging-control-box' : 'hide'}>
            <div style={{ fontWeight: 'bold' }}>{AppLanguages.orderBy[this.props.appLanguageCode]}</div>
            <div value="orderByDate" name="new" className="messaging-controls-div" style={this.state.sortByDateNew ? { backgroundColor: 'lightgray', paddingLeft: '5px' } : { backgroundColor: 'white' }} onClick={this.handleMessageEditClick.bind(this)}>{AppLanguages.messageDateNewest[this.props.appLanguageCode]}</div>
            <div value="orderByDate" name="old" className="messaging-controls-div" style={this.state.sortByDateOld ? { backgroundColor: 'lightgray', paddingLeft: '5px' } : { backgroundColor: 'white' }} onClick={this.handleMessageEditClick.bind(this)}>{AppLanguages.messageDateOldest[this.props.appLanguageCode]}</div>
          </div>
          </div>
      );
  }

  renderListingDetails(listing) {
    return (
      <div name={listing.id} value="listingClick" id="" className="main-messaging-sub-control-listing-details" onClick={this.handleMessageEditClick.bind(this)}>
        <img name={listing.id} className="main-messaging-sub-control-listing-details-img" src={'http://res.cloudinary.com/chikarao/image/upload/v1524032785/' + listing.images[0].publicid + '.jpg'} alt="" />
        <div name={listing.id} className="main-messaging-sub-control-listing-details-box">
          <div name={listing.id} className="main-messaging-sub-control-listing-details-box-div">{listing.description.substring(0, 30)}</div>
          <div name={listing.id} className="main-messaging-sub-control-listing-details-box-div">{listing.area.substring(0, 30)}</div>
          <div name={listing.id} className="main-messaging-sub-control-listing-details-box-div">id: {listing.id}</div>
        </div>
      </div>
    );
  }

  renderEachMessageSubControlListing() {
    return _.map(this.props.flats, listing => {
      // return <div className="messaging-sub-controls-div" name="" value="listing" onClick={this.handleMessageEditClick.bind(this)}>{listing.id}</div>;
      return <div key={listing.id} name={listing.id} value="listingClick" className="messaging-sub-controls-div" onClick={this.handleMessageEditClick.bind(this)}>{this.renderListingDetails(listing)}</div>;
    })
  }

  handleSearchInput(event) {
    const inputElement = event.target;
      // !!!! inputElement.value works not elementVal.value Don't know why; Also dont need do event => this.handleSearchInput(event)
    this.setState({ searchInputVal: inputElement.value }, () => {
      console.log('in messagingMain, handleSearchInput, this.state.searchInputVal: ', this.state.searchInputVal);
    })
  }

  renderMessagingSubControls() {
    const conversationBox = document.getElementById('messaging-main-conversation-box')
    const elementSort = document.getElementById('messaging-main-large-archive-filter')
    let leftDiff = null;
    // console.log('in messagingMain, renderMessagingSubControls, elementSort, conversationBox: ', elementSort, conversationBox);
    // console.log('in messagingMain, renderMessagingSubControls: ', this.state.sortListingSelected);
    if (elementSort && conversationBox) {
      const rect = elementSort.getBoundingClientRect();
      const rectBox = conversationBox.getBoundingClientRect();
      // console.log('in messagingMain, renderMessagingSubControls, rect.top, rect.right, rect.bottom, rect.left: ', rect.top, rect.right, rect.bottom, rect.left);
      // console.log('in messagingMain, renderMessagingSubControls, rectBox.top, rectBox.right, rectBox.bottom, rectBox.left: ', rectBox.top, rectBox.right, rectBox.bottom, rectBox.left);
      leftDiff = rect.left - rectBox.left;
      // console.log('in messagingMain, renderMessagingSubControls, leftDiff: ', leftDiff);
      // const elementSortPos = elementSort.offsetLeft();
      // const conversationBoxPos = conversationBox.offsetLeft();
    }
      return (
        <div className="messaging-main-messaging-sub-control-box-box" id="messaging-main-messaging-sub-control-box-box" style={{ left: `${leftDiff - 19}px` }}>
          <div id="messaging-main-messaging-sub-control-box" className={this.state.showMessageSubControls ? 'messaging-main-messaging-sub-control-box' : 'hide'}>
            <input id="main-messaging-search-box" type="text" placeholder={AppLanguages.filterKeyWords[this.props.appLanguageCode]} value={this.state.searchInputVal} onChange={this.handleSearchInput.bind(this)}></input>
            <div style={{ fontWeight: 'bold' }}>{AppLanguages.filterListing[this.props.appLanguageCode]}</div>
            <div name={0} value="allListings" style={this.state.sortListingSelected ? { border: '1px dotted white', color: 'blue' } : { border: '1px dotted gray' }} id="messaging-main-sub-control-box-all-listings" className="messaging-main-sub-control-box-all-listings" onClick={this.handleMessageEditClick.bind(this)}>{AppLanguages.allListings[this.props.appLanguageCode]}</div>
              <div className="messaging-main-messaging-sub-control-box-scroll">
                {this.renderEachMessageSubControlListing()}
              </div>
          </div>
        </div>
      );
  }

  unhighlightListing() {
    const listings = document.getElementsByClassName('messaging-sub-controls-div');
    const allListings = document.getElementById('messaging-main-sub-control-box-all-listings')

    _.each(listings, listing => {
      const changedListing = listing;
      const child = changedListing.lastChild;
      child.style.backgroundColor = 'white';
    })

      allListings.style.border = 'white';
  }

  highlightListing(ListingId) {
    const listings = document.getElementsByClassName('messaging-sub-controls-div');
    const allListings = document.getElementById('messaging-main-sub-control-box-all-listings')

    _.each(listings, listing => {
      // console.log('in messagingMain, highlightListing, ListingId, listing, listing.name: ', ListingId, listing, listing.name);
      if (listing.getAttribute('name') == ListingId) {
        const changedListing = listing;
        const child = changedListing.lastChild;
        child.style.backgroundColor = 'lightgray';
      }
    })
  }
  // unhighlighting data order
  unhighlightOrder() {
    const orderDivs = document.getElementsByClassName('messaging-controls-div');
    _.each(orderDivs, eachDiv => {
      const divChanged = eachDiv;
      divChanged.style.backgroundColor = 'white';
    })
  }

  highlightOrder(newOrOld) {
    const orderDivs = document.getElementsByClassName('messaging-controls-div');
    _.each(orderDivs, eachDiv => {
      // console.log('in messagingMain, highlightOrder, before if newOrOld, eachDiv.getAttribute(name): ', newOrOld, eachDiv.getAttribute('name'));
      if (newOrOld == eachDiv.getAttribute('name')) {
        // console.log('in messagingMain, highlightOrder, if newOrOld, eachDiv.getAttribute(name): ', newOrOld, eachDiv.getAttribute('name'));
        const changedDiv = eachDiv;
        changedDiv.style.backgroundColor = 'gray'
      }
    })
  }

  // after conversation checkbox checked, handles what to do with the conversations;
  handleMessageEditClick(event) {
    const clickedElement = event.target;
    // const clickedElementParent = clickedElement.parentNode;
    const elementVal = clickedElement.getAttribute('value');
    const elementName = clickedElement.getAttribute('name');
    // console.log('in messagingMain, handleMessageEditClick, clickedElement: ', clickedElement);
    // console.log('in messagingMain, handleMessageEditClick, elementVal: ', elementVal);

    const listingClicked = SUB_BOX_LISTING_CLASS_ARRAY.includes(clickedElement.className)
    // console.log('in messagingMain, handleMessageEditClick, SUB_BOX_LISTING_CLASS_ARRAY: ', SUB_BOX_LISTING_CLASS_ARRAY);
    // console.log('in messagingMain, handleMessageEditClick, listingClicked: ', listingClicked);

    // eleementVal is the conversation id
    // calls action to update conversation in api to mark them archived = true
    if (elementVal == 'archive') {
      const conversationAttributes = { archived: true, archived_by_user: true };
        this.props.updateConversations(this.props.checkedConversationsArray, conversationAttributes, () => {
          this.props.checkedConversations(this.props.checkedConversationsArray);
        });
      // this.setState({ checkedConversationsArray: [] });
      this.setState({ showAllConversations: true });
    }

    // calls action to update conversation in api to mark them trashed = true
    if (elementVal == 'trash') {
      const conversationAttributes = { trashed: true, trashed_by_user: true };
        this.props.updateConversations(this.props.checkedConversationsArray, conversationAttributes, () => {
          // console.log('in messagingMain, handleMessageEditClick, if elementVal == trash, this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
          this.props.checkedConversations(this.props.checkedConversationsArray);
        // this.props.checkedConversations([]);
          this.setState({ showAllConversations: true }, () => {});
        });
      // this.setState({ checkedConversationsArray: [] });
      // console.log('in messagingMain, handleMessageEditClick, this.state: ', this.state);
    }

    // calls action to update conversation in api to mark them trashed = false
    if (elementVal == 'untrash') {
      const conversationAttributes = { trashed: false, trashed_by_user: false };
      console.log('in messagingMain, handleMessageEditClick, if elementVal == untrash, this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
        this.props.updateConversations(this.props.checkedConversationsArray, conversationAttributes, () => {
          this.props.checkedConversations(this.props.checkedConversationsArray);
        });
    }

    if (elementVal == 'deleteCompletely') {
      const conversationAttributes = { deleted: true, deleted_by_user: true };
      console.log('in messagingMain, handleMessageEditClick, if elementVal == deleteCompletely, this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
        this.props.updateConversations(this.props.checkedConversationsArray, conversationAttributes, () => {
            this.props.checkedConversations(this.props.checkedConversationsArray);
        });
    }

    // calls action to update conversation in api to mark them archive = false
    if (elementVal == 'unarchive') {
      const conversationAttributes = { archived: false, archived_by_user: false };
      // console.log('in messagingMain, handleMessageEditClick, if elementVal == unarchive, this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
        this.props.updateConversations(this.props.checkedConversationsArray, conversationAttributes, () => {
          this.props.checkedConversations(this.props.checkedConversationsArray);
        });
      // this.setState({ checkedConversationsArray: [] });
      // console.log('in messagingMain, handleMessageEditClick, this.state: ', this.state);
    }

    // if user clicks on trash bin link, set state to show trash bin view
    if (elementVal == 'trashbin') {
      this.setState({ showTrashBin: true, showArchiveBin: false, showAllConversations: false, filteredConversationsArray: [] }, () => {
        // console.log('in messagingMain, handleMessageEditClick, this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
        this.filterConversations();
      })
    }

    // if user clicks on archive bin link, set state to show archive bin view
    if (elementVal == 'archivebin') {
      this.setState({ showArchiveBin: true, showTrashBin: false, showAllConversations: false, filteredConversationsArray: [] }, () => {
        // console.log('in messagingMain, handleMessageEditClick, this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
        this.filterConversations();
      })
    }
    // invoked when sort icon clicked to show sort box (by date)
    if (elementVal == 'sort') {
      this.setState({ showMessageControls: !this.state.showMessageControls, showMessageSubControls: false }, () => {
        // console.log('in messagingMain, handleMessageEditClick, this.state.showMessageControls: ', this.state.showMessageControls);

        if (this.state.showMessageControls) {
        const body = document.getElementById('messaging-main-main-container');
        body.addEventListener('click', this.messageControlCloseClick);
        }
      });
    }
    // invoked when filter icon clicked to show subcontrol window
    if (elementVal == 'filter') {
      this.setState({ showMessageSubControls: !this.state.showMessageSubControls, showMessageControls: false }, () => {
        // console.log('in messagingMain, handleMessageEditClick, this.state.showMessageSubControls: ', this.state.showMessageSubControls);
        // this.filterConversations();
        // if (this.state.showMessageSubControls) {
          if (this.state.showMessageSubControls) {
            const body = document.getElementById('messaging-main-main-container');
            body.addEventListener('click', this.messageControlCloseClick);
          }
        // }
      })
    }
    // for case when 'all listings' clicked in sub control box
    if (elementVal == 'allListings') {
      // console.log('in messagingMain, handleMessageEditClick, == alllistings elementVal, this.state.sortListingSelected: ', elementVal, this.state.sortListingSelected);
      this.unhighlightListing()
      if (this.state.sortListingSelected) {
        this.setState({ sortListingId: null, sortListingSelected: false }, () => {
          // console.log('in messagingMain, handleMessageEditClick, this.state.sortListingSelected: ', this.state.sortListingSelected);
        });
      }
    }
    // for case when order by date new or old clicked in control box
    if (elementVal == 'orderByDate') {
      // this.unhighlightListing()
      if (elementName == 'new') {
        if (this.state.sortByDateOld) {
          // this.unhighlightOrder();
          this.setState({ sortByDateNew: true, sortByDateOld: false }, () => {
            // console.log('in messagingMain, handleMessageEditClick, this.state.sortByDateNew, this.state.sortByDateOld: ', this.state.sortByDateNew, this.state.sortByDateOld);
            // this.highlightOrder(elementName);
          });
        }
      }
      if (elementName == 'old') {
        if (this.state.sortByDateNew) {
          // this.unhighlightOrder();
          this.setState({ sortByDateNew: false, sortByDateOld: true }, () => {
            // console.log('in messagingMain, handleMessageEditClick, this.state.sortByDateNew, this.state.sortByDateOld: ', this.state.sortByDateNew, this.state.sortByDateOld);
            // this.highlightOrder(elementName);
          });
        }
      }
    }
    // for case when boolean listing clicked true; ie user clicked on listing in subcontrol windows
    if (listingClicked) {
      if (clickedElement.className !== 'messaging-main-sub-control-box-all-listings') {
        this.unhighlightListing(elementName);
        this.setState({ sortListingId: elementName, sortListingSelected: true }, () => {
          // console.log('in messagingMain, handleMessageEditClick, listingClicked, this.state.sortListingId: ', this.state.sortListingId);
          this.highlightListing(this.state.sortListingId);
        })
      }
    }
  }
  // handle clicks after message control box opened by clicking on sort
  // basically, if there are any clicks outside of the two control boxes, close the box(es)
  messageControlCloseClick = (e) => {
    // console.log('in messagingMain, messageControlCloseClick, body.addEventListener, e.target: ', e.target);
    const clickedElement = e.target;
    const elementVal = clickedElement.getAttribute('value');
    // console.log('in messagingMain, messageControlCloseClick, body.addEventListener, e.target.className: ', e.target.className);
    // console.log('in messagingMain, messageControlCloseClick, body.addEventListener, elementVal: ', elementVal);
    // get boxes elements and ellips elements (className returns array)
    // needed to use boxboxes so to have relative positioning on box for arrow
    const box = document.getElementById('messaging-main-messaging-control-box')
    const boxBox = document.getElementById('messaging-main-messaging-control-box-box')
    const subBox = document.getElementById('messaging-main-messaging-sub-control-box')
    const subBoxBox = document.getElementById('messaging-main-messaging-sub-control-box-box')
    const sortIcon = document.getElementById('messaging-main-large-archive-sort')
    const filterIcon = document.getElementById('messaging-main-large-archive-filter')

    // get children of boxes in array to text if click is inside boxes
    // ie on date sort div or listing div
    const boxChildNodeArray = [];
    const subBoxChildNodeArray = [];
    _.each(box.childNodes, boxChild => {
      boxChildNodeArray.push(boxChild.className)
    });
    _.each(subBox.childNodes, subBoxChild => {
      subBoxChildNodeArray.push(subBoxChild.className)
    });

    // !!! If any classes added below subBox, add into this array subBoxOtherDecendantsArray so that any clicks inside will not close box!!!!!
    const subBoxOtherDecendantsArray = SUB_BOX_LISTING_CLASS_ARRAY;
    // test for clicks on elements inside boxes
    const boxChildrenClicked = boxChildNodeArray.includes(e.target.className);
    const subBoxChildrenClicked = subBoxChildNodeArray.includes(e.target.className);
    const subBoxOtherDecendantsClicked = subBoxOtherDecendantsArray.includes(e.target.className);
    const boxClicked = (box.className == e.target.className)
    const subBoxClicked = (subBox.className == e.target.className)
    const boxBoxClicked = (boxBox.className == e.target.className)
    const subBoxBoxClicked = (subBoxBox.className == e.target.className)
    // test for clicks on filter and sort icons
    const sortIconClicked = (sortIcon.getAttribute('value') == elementVal)
    const filterIconClicked = (filterIcon.getAttribute('value') == elementVal)

    if ((!boxClicked & !subBoxClicked & !boxBoxClicked & !subBoxBoxClicked & !boxChildrenClicked & !subBoxChildrenClicked && !subBoxOtherDecendantsClicked)) {
      // console.log('in messagingMain, messageControlCloseClick, after if !boxes...');

        // if controls open and user clicks something other than control box elements or filter and sort icons
        // get element to be clicked to close control boxes and remove addEventListener if any box open
        if (this.state.showMessageControls || this.state.showMessageSubControls) {
          const body = document.getElementById('messaging-main-main-container');
          body.removeEventListener('click', this.messageControlCloseClick);
        }
        // close control box if controls open and sort icon not clicked since
        // if sort above toggles showMessageControls
        if (this.state.showMessageControls && !sortIconClicked) {
          this.setState({ showMessageControls: false }, () => {
            // console.log('in messagingMain, messageControlCloseClick, body.addEventListener, if message control elements clicked, this.state.showMessageSubControls: ', this.state.showMessageSubControls);
          })
        }
        // close sub control box if controls open and sort icon not clicked since
        // if filter above toggles showMessageSubControls
        if (this.state.showMessageSubControls && !filterIconClicked) {
          this.setState({ showMessageSubControls: false }, () => {
            // console.log('in messagingMain, messageControlCloseClick, body.addEventListener, if message control elements clicked, this.state.showMessageSubControls: ', this.state.showMessageSubControls);
          })
        }
    } // end of if !boxClicked...
  }


  // Called when conversation checkboxes checked; shos archive and trash box links
  renderEditControls() {
    return (
      <div className="messaging-main-controls-left">
        <div value="archive" className="btn messaging-main-large-archive" onClick={this.handleMessageEditClick.bind(this)}>{AppLanguages.moveToArchives[this.props.appLanguageCode]}</div>
        <div className="btn messaging-main-large-archive"></div>
        <div value="trash" className="btn messaging-main-large-trash" onClick={this.handleMessageEditClick.bind(this)}><i value="trash" className="fa fa-trash-o"></i></div>
      </div>
    );
  }
  // reference: https://stackoverflow.com/questions/1789945/how-to-check-whether-a-string-contains-a-substring-in-javascript
  // Takes input string downcases it, downcases each message
  // and increments counter when there is a match for each word in any of the messages and
  // keeps an array of each matched word and if the length of array matches the counter, return true
  // So messages in conversation must have each word inputted to return the conversation
  searchConversation(conversation, inputVal) {
    // console.log('in messagingMain, searchConversation, conversation, before each conversation.message, inputVal : ', conversation, inputVal);
    let counter = 0;
    let splitInputVal = [];
    const countedArray = [];
    // iterate through each message in conversation
   _.each(conversation.messages, eachMessage => {
     // downcase messages
      const lowerCaseBody = eachMessage.body.toLowerCase();
      // split the search input string into each word split by space
      splitInputVal = inputVal.split(' ');
      // iterate through each word input
      _.each(splitInputVal, eachWord => {
        // console.log('in messagingMain, searchConversation, conversation, splitInputVal : ', splitInputVal);
        // if message has any one of input words, check if that word has already been counted
        // if not coiunted, add to array to be counted and increment counter
        if (lowerCaseBody.includes(eachWord.toLowerCase())) {
          if (!countedArray.includes(eachWord)) {
            countedArray.push(eachWord);
            counter++;
          }
        }
      });
    });
    // _.each(conversation.flat, flat => {
    //   if (flat) {
    //     // console.log('in messagingMain, searchConversation, conversation, Object.keys(flat): ', Object.keys(flat));
    //     _.each(Object.keys(flat), (k, v) => {
    //       console.log('in messagingMain, searchConversation, conversation, flat : ', flat);
    //       console.log('in messagingMain, searchConversation, conversation, k, v : ', k, v);
    //     })
    //   }
    // });
    // return true if counter value matches the number of words input in search
    return counter == splitInputVal.length;
    // return counter > 0;
  }
  // Reference: https://stackoverflow.com/questions/10123953/sort-javascript-object-array-by-date
  orderByDate(filteredConversationsArray) {
    const newest = [...filteredConversationsArray].sort(function (a, b) {
      // console.log('in messagingMain, orderByDate, newest a, b : ', new Date(a.messages[a.messages.length - 1].created_at), new Date(b.messages[b.messages.length - 1].created_at));
      return (new Date(a.messages[a.messages.length - 1].created_at)) - (new Date(b.messages[b.messages.length - 1].created_at))
    });

    const oldest = [...filteredConversationsArray].sort(function (a, b) {
      // console.log('in messagingMain, initialFilteredConversations, oldest, a, b : ', a, b);
      return (new Date((b.messages[b.messages.length - 1].created_at)) - (new Date(a.messages[a.messages.length - 1].created_at)))
    });
    // console.log('in messagingMain, initialFilteredConversations, newest, oldest : ', newest, oldest);
      return this.state.sortByDateNew ? newest : oldest;
  }

  isConvByUser(conv) {
    const convByUser = conv.id == this.props.auth.id;
    return convByUser;
  }

  // filters (key words, not by flats which is in this.filterConversations) for conversations
  // that are not trashed or archived; called in renderConversations
  // 6 tests;
  // 1. show all conversations;
  // 2. conversation is by user or not,
  // 3. user searching;
  // 4 search words match
  // 5. conversation already added to array of conversations to render
  // 6 order of conversations by date
  initialFilteredConversations() {
    // array to send filtered subset
    const filteredConversationsArray = [];
    // array to test if conversation has already been added to conversation array
    const filteredConversationsIdArray = [];
    // console.log('in messagingMain, initialFilteredConversations, this.props.conversations : ', this.props.conversations);
    // show if user wants all conversations (ie not trash or archive)
    if (this.state.showAllConversations) {
      // console.log('in messagingMain, initialFilteredConversations, this.state.searchInputVal: ', this.state.searchInputVal);
      // iterate through conversations by user
      _.each(this.props.conversations, conv => {
        // test if conv.id is user.id (ie user is not owner of flat involved)
        const convByUser = this.isConvByUser(conv);
        // console.log('in messagingMain, initialFilteredConversations, convByUser, conv.id, this.props.auth.id: ', convByUser, conv.id, this.props.auth.id);
        if (convByUser) {
          // if not owner (ie user), show conversation if conv is not trashed or archived
          if (!conv.trashed_by_user && !conv.archived_by_user) {
            // if user inputs something in search
            if (this.state.searchInputVal !== '') {
              // get input value from search input;
              const inputVal = this.state.searchInputVal;
              // call function to search each message text or body for input string
              const convHasSearchWords = this.searchConversation(conv, inputVal);
              // console.log('in messagingMain, initialFilteredConversations, this.searchConversation(conv, inputVal): ', this.searchConversation(conv, inputVal));
              // console.log('in messagingMain, initialFilteredConversations, conv, inputVal: ', conv, inputVal);
              // console.log('in messagingMain, initialFilteredConversations, convHasSearchWords: ', convHasSearchWords);
              // if strings included in one of messages, add to array of conversation
              // and ids to make sure there is no duplicate
              if (convHasSearchWords) {
                if (!filteredConversationsIdArray.includes(conv.id)) {
                  filteredConversationsArray.push(conv);
                  filteredConversationsIdArray.push(conv.id);
                  // console.log('in messagingMain, initialFilteredConversations, convByUser, conv.trashed_by_user: ', convByUser, conv.trashed_by_user);
                }
              } // end of if convHasSearchWords
            } else { // if searchInputVal has no value ie user is not searching
              // just add to array if not added  already
              if (!filteredConversationsIdArray.includes(conv.id)) {
                filteredConversationsArray.push(conv);
                filteredConversationsIdArray.push(conv.id);
                // console.log('in messagingMain, initialFilteredConversations, convByUser, conv.trashed_by_user: ', convByUser, conv.trashed_by_user);
              }
            }// else searchInputVal has value
          } // if not conv.trashed
        } else { // if not convByUser; ie user is owner of flat and conv.id != auth.id
          // if not trashed or archived true
          if (!conv.trashed && !conv.archived) {
            // if there is input in search
            if (this.state.searchInputVal !== '') {
              // get input value from search input;
              const inputVal = this.state.searchInputVal;
              // call function to search text for input string
              const convHasSearchWords = this.searchConversation(conv, inputVal);
              // console.log('in messagingMain, initialFilteredConversations, this.searchConversation(conv, inputVal): ', this.searchConversation(conv, inputVal));
              // console.log('in messagingMain, initialFilteredConversations, conv, inputVal: ', conv, inputVal);
              // console.log('in messagingMain, initialFilteredConversations, convHasSearchWords: ', convHasSearchWords);
              // if strings included in one of messages, add to array
              if (convHasSearchWords) {
                if (!filteredConversationsIdArray.includes(conv.id)) {
                  filteredConversationsArray.push(conv);
                  filteredConversationsIdArray.push(conv.id);
                  // console.log('in messagingMain, initialFilteredConversations, not convByUser, conv.trashed: ', convByUser, conv.trashed);
                }
              } // end of if convHasSearchWords
            } else { // if searchInputVal does not have value
              // just add to array if not already
              if (!filteredConversationsIdArray.includes(conv.id)) {
                filteredConversationsArray.push(conv);
                filteredConversationsIdArray.push(conv.id);
                // console.log('in messagingMain, initialFilteredConversations, not convByUser, conv.trashed: ', convByUser, conv.trashed);
              }
            }// else searchInputVal has value
          } // if not conv.trashed
        }
      }); // end of each
    } // if show all conversations
    // order array based on user desired order of conversations by date
    const orderedArray = this.orderByDate(filteredConversationsArray);
    // console.log('in messagingMain, initialFilteredConversations, filteredConversationsArray: ', filteredConversationsArray);
    // return filtered and order array for rendering
    return orderedArray;
    // return filteredConversationsArray;
  }
  // filter conversations based on user choice of flat in sub control box
  filteredByListing() {
    const array = [];
    _.each(this.props.conversations, conv => {
      // console.log('in messagingMain, filteredByListing, conv.flat_id, this.state.sortListingId: ', conv.flat_id, this.state.sortListingId);
      if (conv.flat_id == this.state.sortListingId) {
        // console.log('in messagingMain, filteredByListing, conv.flat_id, this.state.sortListingId: ', conv.flat_id, this.state.sortListingId);
        if (!conv.archived && !conv.trashed) {
          array.push(conv);
        }
      }
    })
    // console.log('in messagingMain, filteredByListing, array: ', array);
    return array;
  }
  // filters conversation based on attributes of conversations, trashed or archived
  // and passes to conversation.js
  // called in renderConversations
  // tests:
  // 1. Is conversations prop there?
  // 2  Is sort conversation by flat listing selected?
  // 3. Has user input for search for key words?
  // 4. Do the key words match those in any messages?
  filterConversations() {
    // check if props has been updated with conversations
    if (this.props.conversations) {
      // to be used in trash bin and archived bin
      const filteredConversationsArray = [];
      const filteredConversationsIdArray = [];
      // console.log('in messagingMain, filterConversations, this.props.conversations : ', this.props.conversations);
      // ternary expression to check if sorted by listing in sub controls
      // return just props.conversations if no listing selected and not showing trash or archive bin
      // filter by flat also in trash bin and archive bin
      const convervationsFilteredByListing =
        // this.state.sortListingSelected && !(this.state.showArchiveBin || this.state.showTrashBin) ?
        this.state.sortListingSelected ?
        this.filteredByListing() : this.props.conversations;
        // console.log('in messagingMain, filterConversations, convervationsFilteredByListing: ', convervationsFilteredByListing);

      // iterate through convs filtered by listing to get conversation with key words searched
      const conversationsFilteredByFlatAndSearchArray = [];
      _.each(convervationsFilteredByListing, conv => {
        if (this.state.searchInputVal !== '') {
          // get input value from search input;
          const inputVal = this.state.searchInputVal;
          // call function to search text for input string
          const convHasSearchWords = this.searchConversation(conv, inputVal);
          // console.log('in messagingMain, filterConversations, this.searchConversation(conv, inputVal): ', this.searchConversation(conv, inputVal));
          // console.log('in messagingMain, filterConversations, conv, inputVal: ', conv, inputVal);
          // console.log('in messagingMain, initialFilteredConversations, convHasSearchWords: ', convHasSearchWords);
          // if strings included in one of messages, add to array
          if (convHasSearchWords) {
            conversationsFilteredByFlatAndSearchArray.push(conv);
          } // end of if convHasSearchWords
        } else { // if searchInputVal has value
          // just add conversation to array
          conversationsFilteredByFlatAndSearchArray.push(conv);
        }// else searchInputVal has value
      });

      // if user selects to see trash bin find conversations with trash true attribute in conversation
      // trashed conversation can be arhived or not archived
      if (this.state.showTrashBin) {
        _.each(conversationsFilteredByFlatAndSearchArray, conv => {
          // console.log('in messagingMain, filterConversations, if showTrashBin conv : ', conv);
          // trashed can either be archived or not, so when untrashed, goes back to archives
          // the backend api filters for completely deleted messages
          const convByUser = this.isConvByUser(conv);
          // console.log('in messagingMain, initialFilteredConversations, convByUser, conv.id, this.props.auth.id: ', convByUser, conv.id, this.props.auth.id);
          if (convByUser) {
            // if conv is users ie not flat owner, add conv to array if not already
            // if trashed but not deleted by user
            if (conv.trashed_by_user && !conv.deleted_by_user) {
              filteredConversationsArray.push(conv);
              filteredConversationsIdArray.push(conv.id);
            }
          } else { // if user is not conv user ie conv.user_id != auth.id
            // add to array if trashed but not deleted
            if (conv.trashed && !conv.deleted) {
              filteredConversationsArray.push(conv);
              filteredConversationsIdArray.push(conv.id);
            }
          }
          // if ((conv.trashed || conv.trashed_by_user) && (conv.archived || !conv.archived)) {
          //   if ((conv.user_id == this.props.auth.id) && !conv.deleted_by_user) {
          //     // console.log('in messagingMain, filterConversations, if showTrashBin first conv user, conv.user_id, this.props.auth.id, conv.deleted_by_user  : ', conv.user_id, this.props.auth.id, conv.deleted_by_user);
          //     if (!filteredConversationsIdArray.includes(conv.id)) {
          //       filteredConversationsArray.push(conv);
          //       filteredConversationsIdArray.push(conv.id);
          //     }
          //   }
          //   // !!!!watch out for datatype when doing !== or != or ====;
          //   // No need to do deep comparison here
          //   if ((conv.user_id != this.props.auth.id) && !conv.deleted) {
          //     // console.log('in messagingMain, filterConversations, if showTrashBin second conv user, conv.user_id, this.props.auth.id, conv.deleted  : ', conv.user_id, this.props.auth.id, conv.deleted);
          //     if (!filteredConversationsIdArray.includes(conv.id)) {
          //       filteredConversationsArray.push(conv);
          //       filteredConversationsIdArray.push(conv);
          //     }
          //   }
          // }
        });
      }
      // if user selects to see archived bin
      // Archive messages will not show if trashed
      if (this.state.showArchiveBin) {
        _.each(conversationsFilteredByFlatAndSearchArray, conv => {
          // console.log('in messagingMain, filterConversations, if showArchiveBin conv : ', conv);
          // archived cannot be trashed
          const convByUser = this.isConvByUser(conv);
          // console.log('in messagingMain, initialFilteredConversations, convByUser, conv.id, this.props.auth.id: ', convByUser, conv.id, this.props.auth.id);
          // if conv is users ie not flat owner, add conv to array if not already
          if (convByUser) {
            if ((conv.archived_by_user) && !conv.trashed_by_user && !conv.deleted_by_user) {
              filteredConversationsArray.push(conv);
              filteredConversationsIdArray.push(conv.id);
            }
          } else { // if user is not conv user ie conv.user_id != auth.id
            if ((conv.archived) && !conv.trashed && !conv.deleted_by_user) {
              // add to array if archived but not trashed
              filteredConversationsArray.push(conv);
              filteredConversationsIdArray.push(conv.id);
            }
          }
          // if ((conv.archived || conv.archived_by_user) && !conv.trashed) {
          //   // filteredConversationsArray.push(conv);
          //   if ((conv.user_id == this.props.auth.id) && !conv.archived_by_user) {
          //     // console.log('in messagingMain, filterConversations, if showTrashBin first conv user, conv.user_id, this.props.auth.id, conv.deleted_by_user  : ', conv.user_id, this.props.auth.id, conv.deleted_by_user);
          //     if (!filteredConversationsIdArray.includes(conv.id)) {
          //       filteredConversationsArray.push(conv);
          //       filteredConversationsIdArray.push(conv.id);
          //     }
          //   }
          //   if ((conv.user_id == this.props.auth.id) && !conv.archived) {
          //     // console.log('in messagingMain, filterConversations, if showTrashBin first conv user, conv.user_id, this.props.auth.id, conv.deleted_by_user  : ', conv.user_id, this.props.auth.id, conv.deleted_by_user);
          //     if (!filteredConversationsIdArray.includes(conv.id)) {
          //       filteredConversationsArray.push(conv);
          //       filteredConversationsIdArray.push(conv.id);
          //     }
          //   }
          // }
        });
      }
      // if sorted by listing in sub controls and show all conversations order by date
      if (this.state.sortListingSelected && this.state.showAllConversations) {
        const dataOrderedArray = this.orderByDate(conversationsFilteredByFlatAndSearchArray);
        return dataOrderedArray;
        // return convervationsFilteredByListing;
      }

      const dataOrderedArray = this.orderByDate(filteredConversationsArray);

      return dataOrderedArray;
      // return filteredConversationsArray;
    } // end of first if
    // console.log('in messagingMain, filterConversations, filteredConversationsArray  : ', filteredConversationsArray);
    // return filteredConversationsArray;
  }

  // Calls conversation.js and passes conversations to show based on which box (trash, archive)
  // the user has selected
  renderConversations() {
    // console.log('in messagingMain, renderConversations, this.initialFilteredConversations(): ', this.initialFilteredConversations());
    // console.log('in messagingMain, renderConversations, document.getElementsByTagName  : ', document.getElementsByTagName('input'));
    // console.log('in messagingMain, renderConversations, document.getElementsByClassName  : ', document.getElementsByClassName('conversations-input-checkbox'));
    const moveElemment = document.getElementById('conversation-main-ul');
    console.log('in messagingMain, renderConversations, moveElemment: ', moveElemment);
    // uncheck any checkboxes on conversations; Somehow, when conversation input checked and trashed,
    // the first conversation input that is subsequently rendered is rendered checked. This code does not work in the covnersations.js
    // the propblem seems to be that conversations are rendered before input attributes are updated
    const checkboxes = document.getElementsByClassName('conversations-input-checkbox')
    if (this.props.checkedConversationsArray.length < 1) {
      _.each(checkboxes, cb => {
        cb.checked = false
      });
      // if (checkboxes.length > 1) {
      //   checkboxes[0].checked = false;
      // }
    }
    return (
      // <div className="messaging-main-conversation-box col-md-4">
      <div id="messaging-main-conversation-box" className={this.state.windowWidth > RESIZE_BREAK_POINT ? 'messaging-main-conversation-box col-md-4' : 'messaging-main-mobile-conversation-box'}>
        {this.renderMessagingControls()}
        {this.renderMessagingSubControls()}
        {this.props.checkedConversationsArray.length > 0 && !this.state.showTrashBin && !this.state.showArchiveBin ? this.renderEditControls() : this.renderEachMainControl()}
          <Conversations
            // conversations={this.state.showAllConversations ? this.initialFilteredConversations() : this.state.filteredConversationsArray}
            conversations={this.state.showAllConversations && !this.state.sortListingSelected ? this.initialFilteredConversations() : this.filterConversations()}
            onMessagingMain
            onMessageMainMobile={this.state.windowWidth < RESIZE_BREAK_POINT}
          />
      </div>
    );
  }


  // Class wrapping messaging switches based on window size
  // passes props onMessagingMain and mobileView based on window size
  // noConversation is for messages on showFlat; if noConversation for flat with user,
  // show message to send message if needed
  // conversatinoId passed to specify messages to show for which conversation
  renderMessages() {
    // <div className="messaging-main-messages-box col-md-8">
    // console.log('in messagingMain, renderMessages: this.props.conversationId', this.props.conversationId);
    return (
      <div className={this.state.windowWidth < RESIZE_BREAK_POINT ? 'my-page-message-box' : 'messaging-main-messages-box col-md-8' }>
      <Messaging
        // currentUserIsOwner={false}
        // currentUserIsOwner={this.props.yourFlat}
        // conversation={this.state.conversationToShow}
        noConversation={this.props.noConversation}
        // yourFlat={this.state.yourFlat}
        conversationId={this.props.conversationId}
        onMessagingMain
        mobileView={this.state.windowWidth < RESIZE_BREAK_POINT}
        largeTextBox={this.state.windowWidth > RESIZE_BREAK_POINT}
        // conversationId={this.state.conversationId}
        fromShowPage={false}
      />
      </div>
    );
  }

  handleMessageRefreshClick() {
    // console.log('in messagingMain, handleMessageRefreshClick: ');
    this.props.showLoading();
    this.props.fetchConversationsByUser(() => { this.loadingCallback(); });
  }

  // called to turn off loading modal after conversations are refreshed
  loadingCallback() {
    this.props.showLoading();
  }

  conversationSlideIn() {
      const moveElemment = document.getElementById('conversation-main-ul');
      // console.log('in messagingMain, conversationRollIn, moveElemment: ', moveElemment);
      let pos = -100;
      if (moveElemment) {
        // moveElemment.style.left = '-100% !important';
        // moveElemment.setAttribute('style', 'left: -100%;');

        // console.log('in messagingMain, conversationRollIn, getAttribute style: ', moveElemment.getAttribute('style'));
        // console.log('in messagingMain, conversationRollIn, inside if moveElemment, pos: ', moveElemment, pos);
        const id = setInterval(frame, 10);
        function frame() {
          // console.log('in messagingMain, conversationRollIn, inside function frame, pos: ', moveElemment, pos);
          if (pos == 0) {
            clearInterval(id);
          } else {
            console.log('in messagingMain, conversationRollIn, inside if pos: ', pos);
            pos = pos + 5;
            // moveElemment.style.top = pos + 'px';
            // moveElemment.style.left = pos + 'px';
            // moveElemment.style.left = `${pos} % !important`;
            moveElemment.setAttribute('style', `left: ${pos}%`);

            moveElemment.classList.add('in');
          }
        }
      }
  }

  // When messages are being rendered, click hamburger toggle back to conversations view
  handleMessageHamburgerClick() {
    this.props.showConversations();
    // this.conversationRollIn();
    this.props.checkedConversations(this.props.checkedConversationsArray);
    const moveElemment = document.getElementById('conversation-main-ul');
    console.log('in messagingMain, handleMessageHamburgerClick, moveElemment: ', moveElemment);
  }
// mobile version of messaging; showConversation is a boolean set in
// Conversation handleConversationCardClick; when conversation is clicked, shows messages
  renderMobileMessaging() {
    return (
      <div>
        <div className="my-page-category-title">
          <div className="my-page-category-left"><div id="messaging-hamburger" className={this.props.showConversationCards ? 'hide' : ''} onClick={this.handleMessageHamburgerClick.bind(this)} ><i className="fa fa-bars"></i></div></div>
          <div>Mail Box</div>
          <div className="my-page-category-right"></div>
        </div>
        {this.props.showConversationCards ? this.renderConversations() : this.renderMessages()}
      </div>
    );
  }

  // renders mobile version and regular web version based on window size, RESIZE_BREAK_POINT
  // my-page classes to simplify; my page messaging will be gone but keeping it for now;
  // conversation and messaging come from component/messaging/conversation.js and messaging.js
  render() {
    console.log('in messagingMain, render this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
    // console.log('in Welcome, render, this.state: ', this.state)
    // <div className="messaging-main-controls-container">{this.renderMessagingControls()}</div>
    // console.log('in Welcome, render, this.state.show: ', this.state.show)

    // if (this.state.windowWidth < RESIZE_BREAK_POINT) {
    //     return (
    //       <div>
    //         {this.renderMobileMessaging()}
    //       </div>
    //     );
    // }

    return (
      <div id="messaging-main-main-container" className="messaging-main-main-container">
       {this.state.windowWidth > RESIZE_BREAK_POINT ?
         <div className="messaging-main-container container">
           {this.renderConversations()}
           {this.renderMessages()}
         </div>
         :
         <div className="my-page-category-container">
          {this.renderMobileMessaging()}
         </div>
       }
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in messagingM, mapStateToProps, state: ', state);
  return {
    // flat: state.selectedFlatFromParams.selectedFlat,
    auth: state.auth,
    flats: state.flats.flatsByUser,
    // selectedBookingDates: state.selectedBookingDates.selectedBookingDates,
    // bookingsByUser: state.fetchBookingsByUserData.fetchBookingsByUserData,
    // auth: state.auth,
    conversations: state.conversation.conversationByUserAndFlat,
    noConversation: state.conversation.noConversation,
    conversationId: state.conversation.conversationToShow,
    checkedConversationsArray: state.conversation.checkedConversationsArray,
    showConversationCards: state.conversation.showConversations,
    // separated from currentUserIsOwner since there is a check in the render method in messagin.js
    thisIsYourFlat: state.conversation.yourFlat,
    appLanguageCode: state.languages.appLanguageCode

  };
}

export default connect(mapStateToProps, actions)(MessagingMain);
