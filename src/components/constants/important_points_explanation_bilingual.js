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

    broker_company_name: {
      name: 'broker_company_name',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '23.5%', left: '19.4%', width: '40%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    broker_company_name_translation: {
      name: 'broker_company_name_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '25.7%', left: '19.4%', width: '40%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    broker_representative_name: {
      name: 'broker_representative_name',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '28.1%', left: '19.4%', width: '40%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    broker_representative_name_translation: {
      name: 'broker_representative_name_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '30.3%', left: '19.4%', width: '40%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    broker_address_hq: {
      name: 'broker_address_hq',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '33.1%', left: '19.4%', width: '60%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    broker_address_hq_translation: {
      name: 'broker_address_hq_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '35.1%', left: '19.4%', width: '60%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    broker_registration_number: {
      name: 'broker_registration_number',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '37.7%', left: '19.4%', width: '30%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    broker_registration_date: {
      name: 'broker_registration_date',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '40.7%', left: '19.4%', width: '30%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    broker_staff_name: {
      name: 'broker_staff_name',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '45.1%', left: '46.9%', width: '35%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    broker_staff_name_translation: {
      name: 'broker_staff_name_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '47%', left: '46.9%', width: '35%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    broker_staff_registration: {
      name: 'broker_staff_registration',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '49.4%', left: '62.8%', width: '13%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    broker_staff_address: {
      name: 'broker_staff_address',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '54.2%', left: '46.6%', width: '45.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    broker_staff_address_translation: {
      name: 'broker_staff_address_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '56.6%', left: '46.6%', width: '45.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    broker_staff_phone: {
      name: 'broker_staff_phone',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '59.9%', left: '68.4%', width: '20.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    contract_work_sub_type: {
      name: 'contract_work_sub_type',
      input_type: 'string',
      choices: {
        0: { params: { val: 'representative', top: '63.9%', left: '60.5%', width: '7%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'broker', top: '63.9%', left: '76%', width: '7%', class_name: 'document-rectangle', input_type: 'button' } },
        // 2: { params: { val: 'single_family', top: '25.8%', left: '27%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } },
        // 3: { params: { val: 'others', top: '27.3%', left: '27%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      // box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices'
    },

    address: {
      name: 'address',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '73.1%', left: '29%', width: '63%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    address_translation: {
      name: 'address_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '75.1%', left: '29%', width: '63%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },
    // name is building name
    name: {
      name: 'name',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '68.5%', left: '29%', width: '63%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    name_translation: {
      name: 'name_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '70.7%', left: '29%', width: '63%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    unit: {
      name: 'unit',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '77.6%', left: '29%', width: '10%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    size: {
      name: 'size',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '80.5%', left: '29%', width: '10%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    floor_area_official: {
      name: 'floor_area_official',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '79.9%', left: '74%', width: '10%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    construction: {
      name: 'construction',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '83.2%', left: '29%', width: '40.5%', height: '2%', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Building.construction.choices, showLocalLanguage: true },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    construction_translation: {
      name: 'construction_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '85.2%', left: '29%', width: '40.5%', height: '2%', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Building.construction.choices, showLocalLanguage: true },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    owner_name: {
      name: 'owner_name',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '87.5%', left: '29%', width: '29.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    owner_name_translation: {
      name: 'owner_name_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '87.5%', left: '59%', width: '29.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    owner_address: {
      name: 'owner_address',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '89.2%', left: '29%', width: '64.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    owner_address_translation: {
      name: 'owner_address_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '90.6%', left: '29%', width: '64.5%', class_name: 'document-rectangle', input_type: 'string' } },
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
