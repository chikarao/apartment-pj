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
      component: 'DocumentChoices',
      translation_record: 'flat_languages',
      // name is the column in model building language
      // translation_column: 'address_translation',
      // translation field is the field in the document that takes the translation
      translation_field: 'address_translation'
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
      component: 'DocumentChoices',
      translation_record: 'building_languages',
      // name is the column in model building language
      translation_column: 'name',
      // translation field is the field in the document that takes the translation
      translation_field: 'name_translation'
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
      // baseLanguageField indicates this field corresponds to
      // base language of the document in constants/documents.js
      choices: {
        0: { params: { val: 'inputFieldValue', top: '83.2%', left: '29%', width: '40.5%', height: '2%', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Building.construction.choices, showLocalLanguage: true, baseLanguageField: true },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      translation_record: 'building_languages',
      // name is the column in model building language
      translation_column: 'construction',
      // translation field is the field in the document that takes the translation
      translation_field: 'construction_translation',
      // if only base record building keeps this data
      language_independent: true
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
        0: { params: { val: 'inputFieldValue', top: '88.5%', left: '29%', width: '29.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    owner_name_translation: {
      name: 'owner_name_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '90.5%', left: '29%', width: '29.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    owner_address: {
      name: 'owner_address',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '94%', left: '29%', width: '63%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    owner_address_translation: {
      name: 'owner_address_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '96%', left: '29%', width: '63%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

  },
  2: {
    // not using building owner; corresponds to flat owner_name
    flat_owner_name: {
      name: 'flat_owner_name',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.2%', left: '15.4%', width: '32.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      translation_record: 'flat_languages',
      translation_column: 'owner_contact_name',
      translation_field: 'flat_owner_name_translation'
    },

    flat_owner_name_translation: {
      name: 'flat_owner_name_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '29.1%', left: '15.4%', width: '32.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    // not using building owner; corresponds to flat owner_address
    flat_owner_address: {
      name: 'flat_owner_address',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '31.3%', left: '15.5%', width: '32.5%', height: '3.6%', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 50,
      translation_record: 'flat_languages',
      translation_column: 'owner_address',
      translation_field: 'flat_owner_address_translation',
    },

    flat_owner_address_translation: {
      name: 'flat_owner_address_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '34.8%', left: '15.5%', width: '32.5%', height: '3.6%', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    // building_owner_address2: {
    //   name: 'building_owner_address2',
    //   input_type: 'string',
    //   choices: {
    //     0: { params: { val: 'inputFieldValue', top: '86.9%', left: '22.4%', width: '27%', class_name: 'document-rectangle', input_type: 'string' } },
    //   },
    //   className: 'form-control-document',
    //   component: 'DocumentChoices'
    // },

    building_ownership_notes: {
      name: 'building_ownership_notes',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27%', left: '49%', width: '18%', height: '5.9%', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    building_ownership_notes_translation: {
      name: 'building_ownership_notes_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '32.5%', left: '49%', width: '18%', height: '5.9%', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    building_ownership_other_notes: {
      name: 'building_ownership_other_notes',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27%', left: '69%', width: '21.8%', height: '5.9%', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    building_ownership_other_notes_translation: {
      name: 'building_ownership_other_notes_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '32.5%', left: '69%', width: '21.8%', height: '5.9%', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 60,
    },
  },
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
