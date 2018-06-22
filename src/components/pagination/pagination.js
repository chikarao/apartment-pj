import React, { Component } from 'react';
import _ from 'lodash';
// import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';

let lastPage = 1;
let displayedPagesArray = [];
const MAX_NUM_PAGE_NUMBERS = 5;

// THIS IS A REUSABLE COMPONENT. JUST PASS FLATS OR WHATEVER ELEMENTS AS Flat
// PROPS AND THIS WILL PAGINATE
// CAN BE USED FOR THE RESULTS PAGE IF CURRENT PAGE IS SET WITH APP STATE

class Pagination extends Component {
  constructor() {
  super();
  this.state = {
    // initialized at page 1
    currentPage: 1,
    //******* Adjust how many to show per page here*****************
    cardsPerPage: 1,
    //*************************************************************
    // for flexible paging with ... skipping middle pages
    //firstPagingIndex is the first button
    firstPagingIndex: 0,
    // lastPagingIndex is how many paging buttons appear
    lastPagingIndex: MAX_NUM_PAGE_NUMBERS,
    // check if right arrow has been clicked then 'current style is not applied on index 0'
    rightArrowClicked: false,
    // where the current page was before click
    lastPageIndex: 0,
    lastPageInArray: 0,
    firstPageInArray: 0,
    pageBeforeDots: 0
  };
  // this.handleClick = this.handleClick.bind(this);
}
// Pagination reference: https://stackoverflow.com/questions/40232847/how-to-implement-pagination-in-reactjs


  removeCurrent() {
    const currentPageLi = document.getElementsByClassName('current');
    if (currentPageLi[0]) {
      // console.log('in results, removeCurrent, currentPageLi[0]: ', currentPageLi[0]);
      currentPageLi[0].classList.remove('current');
    }
  }

  addCurrent() {
    // refator from hnadle right and left click
    const currentLi = document.getElementById(this.state.currentPage);
    console.log('in results addCurrent, currentLi: ', currentLi);
    currentLi.classList.add('current');
  }

  handlePageClick(event) {
    // const currentPageLi = document.getElementsByClassName('current');
    // if (currentPageLi[0]) {
    //   console.log('in results handlePageClick, currentPageLi[0]: ', currentPageLi[0]);
    //   currentPageLi[0].classList.remove('current');
    // }
    // remove current style from last selected page
    this.removeCurrent();

    console.log('in results renderPageNumbers, handlePageClick, event.target: ', event.target);
    // add current style to clicked button
    const clickedPages = event.target.classList.add('current');
    // clickedPagesArray.push(clickedPages);
    // console.log('in results, handlePageClick, event: ', event.target.classList);
    // console.log('in results, handlePageClick, currentPageLi: ', currentPageLi);
    // set clicked page as currentPage in component state
    this.setState({
      currentPage: Number(event.target.id)
    }, () => {
      // if the clicked button is the last page, set first and last of array
      // as index last page minus number of buttons and last as last
      console.log('in results handlePageClick, before if lastPage, this.state.currentPage: ', this.state.currentPage)
      if (this.state.currentPage === lastPage) {
        this.setState({
          firstPagingIndex: (lastPage - (MAX_NUM_PAGE_NUMBERS)),
          lastPagingIndex: lastPage,
        }, () => {
          console.log('in results handlePageClick, before if lastPage, displayedPagesArray: ', displayedPagesArray)
        })
        }
      }
    );
  }

  decrementPagingIndex() {
    // lastPage is num, MAX_NUM_PAGE_NUMBERS is num, -1 to comvert to index
    // first check if curren page fits on last set of buttons with no ...
    if (this.state.currentPage < (lastPage - (MAX_NUM_PAGE_NUMBERS - 1))) {
      // if not let current page be the last button before ...
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
      this.addCurrent();
    }
  }

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
      // if at before the ..., get a new array
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

  handleLeftPageClick() {
    //if page at two or greater then reduce currentPage by 1
    console.log('in results handleLeftPageClick, displayedPagesArray: ', displayedPagesArray);
    const firstPageInArray = displayedPagesArray[0];
    console.log('in results handleLeftPageClick, firstPageInArray: ', firstPageInArray);

    if (this.state.currentPage >= 2) {
      this.removeCurrent();
      this.setState({
        currentPage: (this.state.currentPage - 1)
        // firstPagingIndex: (this.state.firstPagingIndex - 1),
        // lastPagingIndex: (this.state.lastPagingIndex - 1)
      }, () => {
        console.log('in results handleLeftPageClick, this.state.firstPagingIndex, lastPagingIndex: ', this.state.firstPagingIndex, this.state.lastPagingIndex);
        console.log('in results handleLeftPageClick, lastPage: ', lastPage);
        console.log('in results handleLeftPageClick, setState callback this.state.currentPage: ', this.state.currentPage);
        // const currentLi = document.getElementById(this.state.currentPage);
        // currentLi.classList.add('current');
        // addCurrent needs to be called after state is async set in decrementPagingIndex
        if (this.state.currentPage >= (MAX_NUM_PAGE_NUMBERS - 2)) {
          this.decrementPagingIndex();
          // the currentPage is has turn to 1 when click on leff arrow at 2
          // firstPageInArray is still 2
        } else if (firstPageInArray === 2) {
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

        // if ((this.state.currentPage === 2) && (this.state.firstPageInArray === 2)) {
        //   this.setState({
        //     firstPagingIndex: this.state.firstPagingIndex - 1,
        //     lastPagingIndex: this.state.lastPagingIndex - 1
        //   }, () => {
        //     this.addCurrent();
        //   });
        // } else {
        //   this.addCurrent();
        // }
      });// end of first setState
    }
  }

  handleRightPageClick() {
     // console.log('in results handleRightPageClick, this.state.currentPage: ', this.state.currentPage);
     // console.log('in results handleRightPageClick, lastpage: ', lastPage);
     // if currentPage is less than last page, right click does nothing
     // displayedPagesArray is a global variable
    const lastPageIndex = displayedPagesArray.indexOf(this.state.currentPage);
    const firstPageInArray = displayedPagesArray[0];
    const lastPageInArray = displayedPagesArray[(MAX_NUM_PAGE_NUMBERS - 1)];
    const pageBeforeDots = displayedPagesArray[(MAX_NUM_PAGE_NUMBERS - 3)];
    console.log('in results handleRightPageClick, currentPageIndex: ', lastPageIndex);

    if (this.state.currentPage < lastPage) {
      // removes style 'current'
      this.removeCurrent();
      //
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
        console.log('in results handleRightPageClick, displayedPagesArray: ', displayedPagesArray);
        // const currentLi = document.getElementById(this.state.currentPage);
        // function to do currentLi.classList.add('current');
        if (this.state.pageBeforeDots < (lastPage - (MAX_NUM_PAGE_NUMBERS))) {
          console.log('in results handleRightPageClick, if this.state.pageBeforeDots: ', this.state.pageBeforeDots);
          const atPageBeforeDots = false;
          this.incrementPagingIndex(atPageBeforeDots);
        } else if (this.state.pageBeforeDots === (lastPage - MAX_NUM_PAGE_NUMBERS)) {
          const atPageBeforeDots = true;
          this.incrementPagingIndex(atPageBeforeDots);
        } else {
          console.log('in results handleRightPageClick, in else this.state.pageBeforeDots: ', this.state.pageBeforeDots);
          this.addCurrent();
        }
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
            //if right arrow has been clicked, don't automatically assign current to style
            if (this.state.rightArrowClicked) {
              return (
                <li key={index} id={pageNumber} onClick={this.handlePageClick.bind(this)}>{pageNumber}</li>
              );
            }
            // if fresh page and right arrow has not been clicked, assign current to style
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
    if (this.state.currentPage >= (lastPage - (MAX_NUM_PAGE_NUMBERS - 1))) {
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

  render() {
    return (
      <div>{this.renderPagination()}</div>
    );
  }
}
// messaging is designed to be used on my page and show flat
// takes booleans fromShowPage, currentUserIsOwner passed from show flat page and
// Note that uses conversation (singular) passed as props from show flat and covnversations (plural) from app state
// uses app state so that the component rerenders when a message is sent
// function mapStateToProps(state) {
//   console.log('in messaging, mapStateToProps, state: ', state);
//   return {
//     auth: state.auth,
//     // conversations: state.conversation.conversationByUserAndFlat,
//     // noConversation: state.conversation.noConversation,
//     // flat: state.flat.selectedFlatFromParams
//   };
// }

export default Pagination;
