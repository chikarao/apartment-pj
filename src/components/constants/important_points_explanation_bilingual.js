import SelectField from '../forms/select_field.js';
// import Building from '../constants/building.js';
import Amenities from './amenities.js';
import FlatForDocuments from '../constants/flat_for_documents.js';
import Building from './building.js';

// constant file referred to as 'model'; record refers to backend records flat, profile, user
// fieldset for inputs takes absolute positioning
// fieldset form-group-document, takes params.top, params.left, params.width
// Anything iside params objects needs to be in snake case eg input_type for use in rails api
// !!!! Only height needs to be px NOT %; however, textarea height works with %
// !!!add required: true for validation at submit
// !!! when there is a boolean params.val, there needs to be an initial value of true of false,
// otherwise, first click on false will not work since there is no value in document choices
// can make params.val boolean a string but need to make consistent for all

const ImportantPointsExplanationBilingual = {
  1: {
    document_name: {
      name: 'document_name',
      // className: 'form-control-document',
      // !!!! Not a field to be rendered on pdf; Attribute of agreement record
      component: 'DocumentChoices',
      borderColor: 'lightgray',
      choices: {
        0: {
          params: {
            val: 'documentAttributes',
            top: '2%',
            left: '32%',
            width: '40%',
            // change from input componnet use document-rectange
            class_name: 'document-rectangle',
            // !!! height works only with px
            input_type: 'string',
          }
        }
      },
      required: true
    },

    tenant_name: {
      name: 'tenant_name',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '10.2%', left: '13.3%', width: '29.5%', height: '1.6%', text_align: 'right', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    date_year: {
      name: 'date_year',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '10.2%', left: '64.4%', width: '5.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    date_month: {
      name: 'date_month',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '10.2%', left: '75.4%', width: '4.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    date_day: {
      name: 'date_day',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '10.2%', left: '86.4%', width: '4.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

  },
  2: {},
  3: {},
  4: {},
  5: {},
  6: {},
  7: {},
  8: {},
  9: {},
  10: {},
  11: {},
};

export default ImportantPointsExplanationBilingual;
