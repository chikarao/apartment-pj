import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';

import * as actions from '../actions';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });


class ShowFlat extends Component {
  componentDidMount() {
    this.props.selectedFlatFromParams(this.props.match.params.id);
  }


  renderFlat(flatId) {
    console.log('in show flat, flatId: ', flatId);
    console.log('in show flat, flat: ', this.props.flat.selectedFlat);
    // const flat = _.find(this.props.flats, (f) => {
    //   return f.id === flatId;
    // });
    // console.log('in show flat, flat: ', flat.description);
    const flatEmpty = _.isEmpty(this.props.flat);
    console.log('in show_flat renderFlat, flat empty: ', flatEmpty);

      if (!flatEmpty) {
        const { description, area, price_per_month, images } = this.props.flat.selectedFlat;
        return (
          <div>
            <div className="show-flat-image-box">
              <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + images[0].publicid + '.jpg'} />
            </div>
            <div>
              { description }
            </div>

            <div>
              { area }
            </div>

            <div>
              { price_per_month }
            </div>

          </div>
        );
      } else {
        return (
          <div>
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
            <div className="spinner">Loading flat...</div>
          </div>
        );
      }
    }

  render() {
    return (
      <div>
        <div>
          {this.renderFlat(this.props.match.params.id)}
        </div>
        <div>
        ID: {this.props.match.params.id}
        </div>
      </div>
    );
  }
}
// export default function ShowFlat(props) {
//     return (
//       <div>Show Flat {props.match.params.id}</div>
//     );
// }

function mapStateToProps(state) {
  return {
    flat: state.flatFromParams
  };
}

export default connect(mapStateToProps, actions)(ShowFlat);
