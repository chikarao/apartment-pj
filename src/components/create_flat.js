import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';

import Upload from './images/upload';
import * as actions from '../actions';
import RenderDropzoneInput from './images/render_dropzone_input';

const FILE_FIELD_NAME = 'files';

class CreateFlat extends Component {

  handleFormSubmit({ description, area }) {
    // console.log('in createflat, handleFormSubmit, data: ', data);
    console.log('in createflat, handleFormSubmit, submit clicked');
    console.log('in createflat, handleFormSubmit, description: ', description);
    console.log('in createflat, handleFormSubmit, area: ', area);
    // this.props.signinUser({ email, password }, () => this.props.history.push('/feature'));
    // navigates back to prior page after sign in; call back sent to action signinUser
    // this.props.signinUser({ email, password }, () => this.props.history.goBack());
    // this.props.createFlat({ flatAttributes }, (images) => this.props.history.goBack(images));
  }


  // createImages(images) {
  //  upload image code here...
  // }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
        <strong>Ooops! </strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  renderFields() {
    const { handleSubmit, fields: { description, area } } = this.props;
    console.log('in createflat, renderFields, this.props: ', this.props);
    // console.log('in createflat, renderFields, Field: ', Field);
    // handle submit came from redux form; fields came from below
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Description:</label>
          <input {...description} type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Area:</label>
          <input {...area} type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor={FILE_FIELD_NAME}></label>
          <Field
            name={FILE_FIELD_NAME}
            component={RenderDropzoneInput}
          />
        </fieldset>
        {this.renderAlert()}
        <button action="submit" id="submit-all" className="btn btn-primary btn-lg">Submit</button>
      </form>
    );
  }

  render() {
    return (
      <div>
        {this.renderFields()}
      </div>
    );
  }
}
//   render() {
//     return (
//       <div>
//         {this.renderFields()}
//       <div>
//         <Upload />
//       </div>
//       </div>
//     );
//   }
// }
//   render() {
//     return (
//       <div>
//         {this.renderFields()}
//       <div>
//       <label htmlFor={FILE_FIELD_NAME}>Files</label>
//        <Field
//          name={FILE_FIELD_NAME}
//          component={RenderDropzoneInput}
//        />
//       </div>
//       </div>
//     );
//   }
// }

function mapStateToProps(state) {
  console.log('in feature mapStateToProps: ', state);
  return {
    errorMessage: state.auth.message,
    flat: state.flat
   };
}

export default reduxForm({
  form: 'simple',
  fields: [
    'address1',
    'city',
    'zip',
    'country',
    'area',
    'price_per_day',
    'price_per_month',
    'guests',
    'sales_point',
    'description',
    'rooms',
    'beds',
    'flat_type',
    'bath'
  ]
}, mapStateToProps, actions)(CreateFlat);
