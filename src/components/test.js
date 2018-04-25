<div className="container" id="map">
  <GoogleMap />
</div>

<div className="container main-card-container">
  <div className="row card-row">
    <MainCards
      whatever={publicId}
    />
    <MainCards />
    <MainCards />
    <MainCards />
    <MainCards />
    <MainCards />
  </div>
</div>

// <i className="fa fa-wifi"></i>
// <i className="fa fa-bath"></i>
// <i className="fa fa-utensils"></i>

// <div className="card-flat-amenities">
//
// </div>

<div
  className="card-image"
  style={{ background: `url(${this.createBackgroundImage(this.props.flat.images[this.state.imageIndex].publicid)})` }}
>
  <div className="card">
    <div className="card-box">
      <div className="card-arrow-box" onClick={this.handleLeftArrowClick.bind(this)}>
        <i className="fa fa-angle-left"></i>
      </div>
      <div className="card-cover">
        {this.props.flat.sales_point}
      </div>
      <div className="card-arrow-box" onClick={this.handleRightArrowClick.bind(this)}>
        <i className="fa fa-angle-right"></i>
      </div>
    </div>
  </div>

// <INFOWINDOW>STYLING</INFOWINDOW>
  .gm-style-iw {
    color: gray;
    font-weight: bold;
    padding: 10px;
    /* display: none; */
    pointer-events: none;
  }

  a {
      text-decoration: none !important;
  }

  .gm-style img {
      max-width: none;
      width: 120px;
      height: 120px;
  }
  /* .gm-style .card-image-infowindow {
      max-width: none;
      width: 120px;
      height: 120px;
  } */
  /* .gm-style #infowindow-box {
      min-height: 150px;
      min-width: 150px;
  } */
  /* .gm-style .infowindow-box-custom {
    width: 100%;
    height: 100%;
  } */

  /* .gm-style-iw #infowindow-box-custom div:first-child div:first-child {
    width: 125px;
    height: 125px;
  } */

  /* forth div the box for the image and text */
  .gm-style-iw div div div div {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .gm-style-iw div:not(a) {
    pointer-events: none;
  }

  /* fifth div the image */
  .gm-style-iw div div div div div {
    height: 125px !important;
    width: 125px !important;
    /* background-color: lightgray; */
    padding: 0px;
    margin: 5px 5px 0px 0px;
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    /* background-size: cover; */
    background-size: cover !important;
    padding: 0;
    background-position: center;
    /* background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.2)); */
  }

//CARD BOX JAPANESE
  .card-box-infowindow i {
    color: dark-gray !important;
    font-size: 40px;
    padding: 10px;
  }

  .gmap-info-window {
      position: relative;
      width: 250px;
      padding: 25px 30px;
      /* border: 2px solid #EC492C; */
      background-color: #fff;
  }

  .gmap-info-window img {
      float: right;
      vertical-align: top;
  }

  .gmap-info-window:before {
          display: inline-block;
          position: absolute;
          left: 50%;
          bottom: -10px;
          width: 20px;
          height: 10px;
          transform: translate(-50%, 0);
          background: url(https://82mou.github.io/infobox/img/gmap-info-window-frame-point.png) no-repeat 0 0;
          content: '';
      }
  .gmap-info-window-title {
      color: #EC492C;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
  }
  .gmap-info-window-address {
      margin-top: 10px;
      font-size: 12px;
      font-weight: bold;
  }

  .gm-style-iw div div div div div {
    height: 125px !important;
    width: 125px !important;
    /* background-color: lightgray; */
    padding: 0px;
    margin: 5px 5px 0px 0px;
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    /* background-size: cover; */
    background-size: cover !important;
    padding: 0;
    background-position: center;
    /* background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.2)); */
  }
