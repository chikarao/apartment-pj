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

    ownership_rights: {
      name: 'ownership_rights',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27%', left: '49%', width: '18%', height: '5.9%', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 50,
      translation_record: 'flat_languages',
      translation_column: 'ownership_rights',
      translation_field: 'ownership_rights_translation'
    },

    ownership_rights_translation: {
      name: 'ownership_rights_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '32.5%', left: '49%', width: '18%', height: '5.9%', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    other_rights: {
      name: 'other_rights',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27%', left: '69%', width: '21.8%', height: '5.9%', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 60,
      translation_record: 'flat_languages',
      translation_column: 'other_rights',
      translation_field: 'other_rights_translation'
    },

    other_rights_translation: {
      name: 'other_rights_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '32.5%', left: '69%', width: '21.8%', height: '5.9%', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    legal_restrictions: {
      name: 'legal_restrictions',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '44.3%', left: '20%', width: '69.8%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 70,
      translation_record: 'building_languages',
      // name is the column in model building language
      translation_column: 'legal_restrictions',
      // translation field is the field in the document that takes the translation
      translation_field: 'legal_restrictions_translation'
    },

    legal_restrictions_translation: {
      name: 'legal_restrictions_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '46.8%', left: '20%', width: '69.8%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 70,
    },

    legal_restrictions_summary: {
      name: 'legal_restrictions_summary',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '49.2%', left: '26%', width: '65.5%', height: '3.4%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 120,
      translation_record: 'building_languages',
      // name is the column in model building language
      translation_column: 'legal_restrictions_summary',
      // translation field is the field in the document that takes the translation
      translation_field: 'legal_restrictions_summary_translation'
    },

    legal_restrictions_summary_translation: {
      name: 'legal_restrictions_summary_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '52.7%', left: '26%', width: '65.5%', height: '3.4%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 120,
    },

    water: {
      name: 'water',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Public Water', top: '66.7%', left: '17.3%', width: '5.5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['water_scheduled'], value: '' } },
        1: { params: { val: 'Tank', top: '66.7%', left: '23.3%', width: '6.5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['water_scheduled'], value: '' } },
        2: { params: { val: 'Well', top: '66.7%', left: '30%', width: '5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['water_scheduled'], value: '' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices'
      // borderColor: 'blue'
    },

    water_year: {
      name: 'water_year',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '66.7%', left: '36%', width: '4.9%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    water_month: {
      name: 'water_month',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '66.7%', left: '43%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    water_day: {
      name: 'water_day',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '66.7%', left: '48.6%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    water_scheduled: {
      name: 'water_scheduled',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Public Water', top: '66.7%', left: '52.9%', width: '5.5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['water'], value: '' } },
        1: { params: { val: 'Private Water', top: '66.7%', left: '58.4%', width: '6.5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['water'], value: '' } },
        2: { params: { val: 'Well', top: '66.7%', left: '65.3%', width: '5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['water'], value: '' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
      // if click on active button, turn off active in case user mistakenly clicks
      // and attribute is not required such as with water.
      second_click_off: true,
      // borderColor: 'blue'
    },

    water_notes: {
      name: 'water_notes',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '66.5%', left: '71.2%', width: '20.5%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 40,
    },

    water_notes_translation: {
      name: 'water_notes_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '67.8%', left: '71.2%', width: '20.5%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 40,
    },

    electricity: {
      name: 'electricity',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '69.6%', left: '17.3%', width: '17.7%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // translation_record: 'building_languages',
      // // // name is the column in model building language
      // translation_column: 'electricity',
      // // // translation field is the field in the document that takes the translation
      // translation_field: 'electricity_translation',
    },

    electricity_translation: {
      name: 'electricity_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '70.9%', left: '17.3%', width: '17.7%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    electricity_year: {
      name: 'electricity_year',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '69.6%', left: '36%', width: '4.9%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    electricity_month: {
      name: 'electricity_month',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '69.6%', left: '43%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    electricity_day: {
      name: 'electricity_day',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '69.6%', left: '48.6%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    electricity_scheduled: {
      name: 'electricity_scheduled',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '69.6%', left: '53.5%', width: '17.3%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 40,
    },

    electricity_scheduled_translation: {
      name: 'electricity_scheduled_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '70.9%', left: '53.5%', width: '17.3%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 40,
    },

    electricity_notes: {
      name: 'electricity_notes',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '69.6%', left: '71.2%', width: '20.5%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 40,
    },

    electricity_notes_translation: {
      name: 'electricity_notes_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '70.9%', left: '71.2%', width: '20.5%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 40,
    },

    gas: {
      name: 'gas',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Public Gas', top: '72.9%', left: '19%', width: '5.5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['gas_scheduled'], value: '' } },
        1: { params: { val: 'Propane Gas', top: '72.9%', left: '25.2%', width: '7.6%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['gas_scheduled'], value: '' } },
        // 1: { params: { val: 'inputFieldValue', top: '24%', left: '54.5%', width: '10%', class_name: 'document-rectangle', input_type: 'string', textAlign: 'right' } }

        // 2: { params: { val: 'None', top: '24.95%', left: '64.4%', width: '4%', class_name: 'document-rectangle', input_type: 'button' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
      second_click_off: true,
      // borderColor: 'blue',
    },

    gas_year: {
      name: 'gas_year',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '72.9%', left: '36%', width: '4.9%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    gas_month: {
      name: 'gas_month',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '72.9%', left: '43%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    gas_day: {
      name: 'gas_day',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '72.9%', left: '48.6%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    gas_scheduled: {
      name: 'gas_scheduled',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Public Gas', top: '72.9%', left: '53.1%', width: '5.5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['gas'], value: '' } },
        1: { params: { val: 'Propane Gas', top: '72.9%', left: '59%', width: '7.6%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['gas'], value: '' } },
        // 1: { params: { val: 'inputFieldValue', top: '24%', left: '54.5%', width: '10%', class_name: 'document-rectangle', input_type: 'string', textAlign: 'right' } }

        // 2: { params: { val: 'None', top: '24.95%', left: '64.4%', width: '4%', class_name: 'document-rectangle', input_type: 'button' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
      second_click_off: true,
      // borderColor: 'blue'
    },

    gas_notes: {
      name: 'gas_notes',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '72.7%', left: '71.2%', width: '20.5%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 20,
    },

    gas_notes_translation: {
      name: 'gas_notes_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '74%', left: '71.2%', width: '20.5%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 20,
    },

    // sewage: {
    //   // !!! SELECT
    //   name: 'sewage',
    //   input_type: 'string',
    //   choices: {
    //     // 0: { params: { val: 'inputFieldValue', top: '27.3%', left: '17.1%', width: '10.5%', class_name: 'document-rectangle', input_type: 'string' } },
    //     0: { params: { val: 'Public Sewer', top: '75.8%', left: '17.3%', width: '16%', height: '19px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' } },
    //     1: { params: { val: 'Septic Tank', top: '75.8%', left: '17.3%', width: '16%', height: '19px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' } },
    //     2: { params: { val: 'None', top: '75.8%', left: '17.3%', width: '16%', height: '19px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' } },
    //   },
    //   className: 'form-control-document',
    //   // height: '23px',
    //   // component: 'SelectField'
    //   // component: 'DocumentChoices'
    //   component: 'select',
    //   mapToModel: Building,
    //   // borderColor: 'blue'
    // },
    //
    // sewage_translation: {
    //   // !!! SELECT
    //   name: 'sewage_translation',
    //   input_type: 'string',
    //   choices: {
    //     // 0: { params: { val: 'inputFieldValue', top: '27.3%', left: '17.1%', width: '10.5%', class_name: 'document-rectangle', input_type: 'string' } },
    //     0: { params: { val: 'Public Sewer', top: '75.8%', left: '17.3%', width: '16%', height: '19px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' } },
    //     1: { params: { val: 'Septic Tank', top: '75.8%', left: '17.3%', width: '16%', height: '19px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' } },
    //     2: { params: { val: 'None', top: '75.8%', left: '17.3%', width: '16%', height: '19px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' } },
    //   },
    //   className: 'form-control-document',
    //   // height: '23px',
    //   // component: 'SelectField'
    //   // component: 'DocumentChoices'
    //   component: 'select',
    //   mapToModel: Building,
    //   // borderColor: 'blue'
    // },

    sewage: {
      name: 'sewage',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '75.8%', left: '17.3%', width: '17.7%', height: '18px', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Building.sewage.choices, showLocalLanguage: true, baseLanguageField: true },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      translation_record: 'building_languages',
      // name is the column in model building language
      translation_column: 'sewage',
      // translation field is the field in the document that takes the translation
      translation_field: 'sewage_translation',
      language_independent: true,
    },

    sewage_translation: {
      name: 'sewage_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '77.2%', left: '17.3%', width: '17.7%', height: '18px', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Building.sewage.choices, showLocalLanguage: true },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    sewage_year: {
      name: 'sewage_year',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '75.75%', left: '36%', width: '4.9%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    sewage_month: {
      name: 'sewage_month',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '75.75%', left: '43%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    sewage_day: {
      name: 'sewage_day',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '75.75%', left: '48.6%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    sewage_scheduled: {
      name: 'sewage_scheduled',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '75.8%', left: '53.5%', width: '17.3%', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Building.sewage.choices, showLocalLanguage: true, baseLanguageField: true },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 20,
      // language_independent: true
    },

    sewage_scheduled_translation: {
      name: 'sewage_scheduled_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '77.1%', left: '53.5%', width: '17.3%', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Building.sewage.choices, showLocalLanguage: true },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 20,
    },

    sewage_notes: {
      name: 'sewage_notes',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '75.8%', left: '71.2%', width: '20.5%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 20,
    },

    sewage_notes_translation: {
      name: 'sewage_notes_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '77.1%', left: '71.2%', width: '20.5%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 20,
    },

    building_inspection_conducted: {
      name: 'building_inspection_conducted',
      input_type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '83.9%', left: '58.1%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '83.9%', left: '78.9%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    building_inspection_summary: {
      name: 'building_inspection_summary',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '87.1%', left: '50.1%', width: '41.5%', height: '5.2%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
      translation_record: 'inspections',
      // // name is the column in model building language
      translation_column: 'inspection_summary',
      // // translation field is the field in the document that takes the translation
      translation_field: 'building_inspection_summary_translation',
    },

    building_inspection_summary_translation: {
      name: 'building_inspection_summary_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '92.1%', left: '50.1%', width: '41.5%', height: '5.2%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

  },
  3: {
    kitchen: {
      name: 'kitchen',
      input_type: 'string',
      choices: {
             0: { valName: 'Y', params: { val: true, top: '16.8%', left: '28.6%', width: '11.1%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.kitchen.choices, showLocalLanguage: true },
             1: { valName: 'N', params: { val: false, top: '16.8%', left: '28.6%', width: '11.1%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.kitchen.choices, showLocalLanguage: true }
           },
      className: 'form-control-document',
      component: 'select',
      // height: '23px',
      mapToModel: Amenities,
    },

    kitchen_format: {
      name: 'kitchen_format',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '15.9%', left: '39.4%', width: '18.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    kitchen_format_translation: {
      name: 'kitchen_format_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '17.9%', left: '39.4%', width: '18.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    kitchen_other: {
      name: 'kitchen_other',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '15.9%', left: '58.5%', width: '33%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    kitchen_other_translation: {
      name: 'kitchen_other_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '17.9%', left: '58.5%', width: '33%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    toilet: {
      name: 'toilet',
      input_type: 'string',
      choices: {
             0: { valName: 'Y', params: { val: true, top: '20.9%', left: '28.6%', width: '11.1%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: FlatForDocuments.toilet.choices, showLocalLanguage: true },
             1: { valName: 'N', params: { val: false, top: '20.9%', left: '28.6%', width: '11.1%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: FlatForDocuments.toilet.choices, showLocalLanguage: true }
           },
      className: 'form-control-document',
      component: 'select',
      // height: '23px',
      mapToModel: FlatForDocuments,
    },

    toilet_format: {
      name: 'toilet_format',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '20%', left: '39.4%', width: '18.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    toilet_format_translation: {
      name: 'toilet_format_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22%', left: '39.4%', width: '18.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    toilet_other: {
      name: 'toilet_other',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '20%', left: '58.5%', width: '33%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    toilet_other_translation: {
      name: 'toilet_other_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22%', left: '58.5%', width: '33%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    bath_tub: {
      name: 'bath_tub',
      input_type: 'string',
      choices: {
             0: { valName: 'Y', params: { val: true, top: '25%', left: '28.6%', width: '11.1%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.bath_tub.choices, showLocalLanguage: true },
             1: { valName: 'N', params: { val: false, top: '25%', left: '28.6%', width: '11.1%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.bath_tub.choices, showLocalLanguage: true }
           },
      className: 'form-control-document',
      component: 'select',
      // height: '23px',
      mapToModel: Amenities,
    },

    bath_tub_format: {
      name: 'bath_tub_format',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '24.1%', left: '39.4%', width: '18.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    bath_tub_format_translation: {
      name: 'bath_tub_format_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '26.1%', left: '39.4%', width: '18.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    bath_tub_other: {
      name: 'bath_tub_other',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '24.1%', left: '58.5%', width: '33%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    bath_tub_other_translation: {
      name: 'bath_tub_other_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '26.1%', left: '58.5%', width: '33%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    hot_water: {
      name: 'hot_water',
      input_type: 'string',
      choices: {
             0: { valName: 'Y', params: { val: true, top: '29.1%', left: '28.6%', width: '11.1%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.hot_water.choices, showLocalLanguage: true },
             1: { valName: 'N', params: { val: false, top: '29.1%', left: '28.6%', width: '11.1%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.hot_water.choices, showLocalLanguage: true }
           },
      className: 'form-control-document',
      component: 'select',
      // height: '23px',
      mapToModel: Amenities,
    },

    hot_water_format: {
      name: 'hot_water_format',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '28.2%', left: '39.4%', width: '18.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    hot_water_format_translation: {
      name: 'hot_water_format_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '30.2%', left: '39.4%', width: '18.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    hot_water_other: {
      name: 'hot_water_other',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '28.2%', left: '58.5%', width: '33%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    hot_water_other_translation: {
      name: 'hot_water_other_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '30.2%', left: '58.5%', width: '33%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    kitchen_grill: {
      name: 'kitchen_grill',
      input_type: 'string',
      choices: {
             0: { valName: 'Y', params: { val: true, top: '33.2%', left: '28.6%', width: '11.1%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.kitchen_grill.choices, showLocalLanguage: true },
             1: { valName: 'N', params: { val: false, top: '33.2%', left: '28.6%', width: '11.1%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.kitchen_grill.choices, showLocalLanguage: true }
           },
      className: 'form-control-document',
      component: 'select',
      // height: '23px',
      mapToModel: Amenities,
    },

    kitchen_grill_format: {
      name: 'kitchen_grill_format',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '32.3%', left: '39.4%', width: '18.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    kitchen_grill_format_translation: {
      name: 'kitchen_grill_format_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '34.3%', left: '39.4%', width: '18.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    kitchen_grill_other: {
      name: 'kitchen_grill_other',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '32.3%', left: '58.5%', width: '33%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    kitchen_grill_other_translation: {
      name: 'kitchen_grill_other_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '34.3%', left: '58.5%', width: '33%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    ac: {
      name: 'ac',
      input_type: 'string',
      choices: {
             0: { valName: 'Y', params: { val: true, top: '37.3%', left: '28.6%', width: '11.1%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.ac.choices, showLocalLanguage: true },
             1: { valName: 'N', params: { val: false, top: '37.3%', left: '28.6%', width: '11.1%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.ac.choices, showLocalLanguage: true }
           },
      className: 'form-control-document',
      component: 'select',
      // height: '23px',
      mapToModel: Amenities,
    },

    ac_format: {
      name: 'ac_format',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '36.4%', left: '39.4%', width: '18.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    ac_format_translation: {
      name: 'ac_format_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '38.4%', left: '39.4%', width: '18.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    ac_other: {
      name: 'ac_other',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '36.4%', left: '58.5%', width: '33%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    ac_other_translation: {
      name: 'ac_other_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '38.4%', left: '58.5%', width: '33%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment1_name: {
      name: 'equipment1_name',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '40.5%', left: '8.6%', width: '19%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment1_name_translation: {
      name: 'equipment1_name_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '42.5%', left: '8.6%', width: '19%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment1: {
      name: 'equipment1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '41.4%', left: '28%', width: '11.1%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      // choices: {
      //        0: { valName: 'Y', params: { val: true, top: '71.65%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' } },
      //        1: { valName: 'N', params: { val: false, top: '71.65%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' } }
      //      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // height: '23px',
      // mapToModel: Amenities,
    },

    equipment1_format: {
      name: 'equipment1_format',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '40.5%', left: '39.4%', width: '18.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment1_format_translation: {
      name: 'equipment1_format_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '42.5%', left: '39.4%', width: '18.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment1_other: {
      name: 'equipment1_other',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '40.5%', left: '58.5%', width: '33%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment1_other_translation: {
      name: 'equipment1_other_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '42.5%', left: '58.5%', width: '33%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment2_name: {
      name: 'equipment2_name',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '44.6%', left: '8.6%', width: '19%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment2_name_translation: {
      name: 'equipment2_name_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '46.6%', left: '8.6%', width: '19%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment2: {
      name: 'equipment2',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '45.5%', left: '28%', width: '11.1%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      // choices: {
      //        0: { valName: 'Y', params: { val: true, top: '44.6%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' } },
      //        1: { valName: 'N', params: { val: false, top: '44.6%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' } }
      //      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // height: '23px',
      // mapToModel: Amenities,
    },

    equipment2_format: {
      name: 'equipment2_format',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '44.6%', left: '39.4%', width: '18.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment2_format_translation: {
      name: 'equipment2_format_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '46.6%', left: '39.4%', width: '18.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment2_other: {
      name: 'equipment2_other',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '44.6%', left: '58.5%', width: '33%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment2_other_translation: {
      name: 'equipment2_other_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '46.6%', left: '58.5%', width: '33%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    inside_disaster_prevention: {
      name: 'inside_disaster_prevention',
      input_type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '54.2%', left: '21%', width: '18.5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '54.2%', left: '62.7%', width: '18.5%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    inside_disaster_warning: {
      name: 'inside_disaster_warning',
      input_type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '63%', left: '21%', width: '18.5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '63%', left: '62.5%', width: '18.5%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    inside_tsunami_warning: {
      name: 'inside_tsunami_warning',
      input_type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '73.9%', left: '21%', width: '18.5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '73.9%', left: '63%', width: '18.5%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    asbestos_record: {
      name: 'asbestos_record',
      input_type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '84%', left: '58%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '84%', left: '79%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    asbestos_survey_contents: {
      name: 'asbestos_survey_contents',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '87%', left: '50.5%', width: '41%', height: '5.2%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
      translation_record: 'building_languages',
      // // name is the column in model building language
      translation_column: 'asbestos_survey_contents',
      // // translation field is the field in the document that takes the translation
      translation_field: 'asbestos_survey_contents_translation',
    },

    asbestos_survey_contents_translation: {
      name: 'asbestos_survey_contents_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '92.5%', left: '50.5%', width: '41%', height: '5.2%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },


  },
  4: {
    earthquake_study_performed: {
      name: 'earthquake_study_performed',
      input_type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '9.5%', left: '58.2%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '9.5%', left: '79%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    earthquake_study_contents: {
      name: 'earthquake_study_contents',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '13.2%', left: '50.5%', width: '41%', height: '5.2%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
      translation_record: 'building_languages',
      // // name is the column in model building language
      translation_column: 'earthquake_study_contents',
      // // translation field is the field in the document that takes the translation
      translation_field: 'earthquake_study_contents_translation',
    },

    earthquake_study_contents_translation: {
      name: 'earthquake_study_contents_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '18.7%', left: '50.5%', width: '41%', height: '5.2%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    other_payments1: {
      name: 'other_payments1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '41.1%', left: '12.2%', width: '15%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 16,
    },

    other_payments1_explanation: {
      name: 'other_payments1_explanation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '40.2%', left: '29.5%', width: '61.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    other_payments1_explanation_translation: {
      name: 'other_payments1_explanation_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '42%', left: '29.5%', width: '61.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    other_payments2: {
      name: 'other_payments2',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '44.8%', left: '12.2%', width: '15%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 16,
    },

    other_payments2_explanation: {
      name: 'other_payments2_explanation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '43.9%', left: '29.5%', width: '61.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    other_payments2_explanation_translation: {
      name: 'other_payments2_explanation_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '45.7%', left: '29.5%', width: '61.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    other_payments3: {
      name: 'other_payments3',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '48.5%', left: '12.2%', width: '15%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 16,
    },

    other_payments3_explanation: {
      name: 'other_payments3_explanation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '47.6%', left: '29.5%', width: '61.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    other_payments3_explanation_translation: {
      name: 'other_payments3_explanation_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '49.4%', left: '29.5%', width: '61.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    other_payments4: {
      name: 'other_payments4',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '52.6%', left: '12.2%', width: '15%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 16,
    },

    other_payments4_explanation: {
      name: 'other_payments4_explanation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '51.4%', left: '29.5%', width: '61.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    other_payments4_explanation_translation: {
      name: 'other_payments4_explanation_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '53.2%', left: '29.5%', width: '61.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    contract_break_terms: {
      name: 'contract_break_terms',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '60%', left: '9%', width: '83.4%', height: '18%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 300,
    },

    contract_break_terms_translation: {
      name: 'contract_break_terms_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '78.5%', left: '9%', width: '83.4%', height: '18%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 300,
    },
  },
  5: {
    warranties: {
      name: 'warranties',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '9.6%', left: '9%', width: '83.4%', height: '16%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 300,
    },

    warranties_translation: {
      name: 'warranties_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '25.7%', left: '9%', width: '83.4%', height: '16%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 300,
    },

    escrow_for_deposit: {
      name: 'escrow_for_deposit',
      input_type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '46.8%', left: '48.1%', width: '10.5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '46.8%', left: '65.6%', width: '14%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    escrow_agent_deposit: {
      name: 'escrow_agent_deposit',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '50.8%', left: '34.5%', width: '57%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    escrow_agent_deposit_translation: {
      name: 'escrow_agent_deposit_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '52.8%', left: '34.5%', width: '57%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    from_year: {
      name: 'from_year',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '60.4%', left: '32.6%', width: '5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    from_month: {
      name: 'from_month',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '60.4%', left: '40%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    from_day: {
      name: 'from_day',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '60.4%', left: '45.4%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    to_year: {
      name: 'to_year',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '64.2%', left: '32.6%', width: '5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    to_month: {
      name: 'to_month',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '64.2%', left: '40%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    to_day: {
      name: 'to_day',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '64.2%', left: '45.4%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    contract_length_years: {
      name: 'contract_length_years',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '60.3%', left: '57%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    contract_length_months: {
      name: 'contract_length_months',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '60.3%', left: '64.5%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    contract_type: {
      name: 'contract_type',
      input_type: 'string',
      choices: {
        0: { params: { val: 'ordinary_rental_contract', top: '60%', left: '73.2%', width: '17.5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'fixed_term_rental_contract', top: '63%', left: '73.2%', width: '17.5%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'end_of_life_rental_contract', top: '65.9%', left: '73.2%', width: '17.5%', class_name: 'document-rectangle', input_type: 'button' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices'
      // borderColor: 'blue'
    },

    contract_renewal_terms: {
      name: 'contract_renewal_terms',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '69.1%', left: '24.6%', width: '27.5%', height: '3.2%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    contract_renewal_terms_translation: {
      name: 'contract_renewal_terms_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '72.5%', left: '24.6%', width: '27.5%', height: '3.2%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },
  },
  6: {
    limitations_use: {
      name: 'limitations_use',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '16.9%', left: '24.6%', width: '33.1%', height: '5%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    limitations_use_translation: {
      name: 'limitations_use_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22.1%', left: '24.6%', width: '33.1%', height: '5%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    limitations_use_other: {
      name: 'limitations_use_other',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '16.9%', left: '58.4%', width: '33.1%', height: '5%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    limitations_use_other_translation: {
      name: 'limitations_use_other_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22.1%', left: '58.4%', width: '33.1%', height: '5%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    restrictions_use: {
      name: 'restrictions_use',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.9%', left: '24.6%', width: '33.1%', height: '5%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    restrictions_use_translation: {
      name: 'restrictions_use_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '33%', left: '24.6%', width: '33.1%', height: '5%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    restrictions_use_other: {
      name: 'restrictions_use_other',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.9%', left: '58.4%', width: '33.1%', height: '5%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    restrictions_use_other_translation: {
      name: 'restrictions_use_other_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '33%', left: '58.4%', width: '33.1%', height: '5%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    deposit_return_terms: {
      name: 'deposit_return_terms',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '43.2%', left: '9.5%', width: '82.5%', height: '11.1%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 300,
    },

    deposit_return_terms_translation: {
      name: 'deposit_return_terms_translation',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '54.4%', left: '9.5%', width: '82.5%', height: '11.1%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 300,
    },

    building_management_company: {
      name: 'building_management_company',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '72%', left: '35%', width: '56.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    building_management_company_translation: {
      name: 'building_management_company_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '74.3%', left: '35%', width: '56.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 509
    },

    building_management_company_address: {
      name: 'building_management_company_address',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '92.7%', left: '35%', width: '56.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    building_management_company_address_translation: {
      name: 'building_management_company_address_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '95%', left: '35%', width: '56.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

  },
  7: {
    bond_deposit_office: {
      name: 'bond_deposit_office',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22.6%', left: '29.5%', width: '63%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    bond_deposit_office_translation: {
      name: 'bond_deposit_office_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '24.9%', left: '29.5%', width: '63%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    bond_deposit_office_address: {
      name: 'bond_deposit_office_address',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.2%', left: '29.5%', width: '63%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    bond_deposit_office_address_translation: {
      name: 'bond_deposit_office_address_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '29.5%', left: '29.5%', width: '63%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    retga_company: {
      name: 'retga_company',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '39%', left: '33.1%', width: '58.4%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    retga_company_translation: {
      name: 'retga_company_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '41.3%', left: '33.1%', width: '58.4%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    retga_company_address: {
      name: 'retga_company_address',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '44.5%', left: '33.1%', width: '58.4%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    retga_company_address_translation: {
      name: 'retga_company_address_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '46.8%', left: '33.1%', width: '58.4%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    retga_company_office_address: {
      name: 'retga_company_office_address',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '50.1%', left: '33.1%', width: '58.4%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    retga_company_office_address_translation: {
      name: 'retga_company_office_address_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '52.4%', left: '33.1%', width: '58.4%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    retga_company_bond_office: {
      name: 'retga_company_bond_office',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '55.5%', left: '33.1%', width: '58.4%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    retga_company_bond_office_translation: {
      name: 'retga_company_bond_office_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '57.3%', left: '33.1%', width: '58.4%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    retga_company_bond_office_address: {
      name: 'retga_company_bond_office_address',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '59%', left: '33.1%', width: '58.4%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    retga_company_bond_office_address_translation: {
      name: 'retga_company_bond_office_address_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '60.8%', left: '33.1%', width: '58.4%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },
  },
  8: {
    date_prepared: {
      name: 'date_prepared',
      input_type: 'date',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '11.3%', left: '74.7%', width: '16%', height: '1.8%', margin: '0', font_size: '13px', class_name: 'document-rectangle', input_type: 'date' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      // charLimit: 50,
    },

    building_name_2: {
      name: 'building_name_2',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '14.4%', left: '32.4%', width: '53.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      baseKey: 'name',
      translation_record: 'building_languages',
      // // name is the column in model building language
      translation_column: 'name',
      // // translation field is the field in the document that takes the translation
      translation_field: 'building_name_2_translation',
    },

    building_name_2_translation: {
      name: 'building_name_2_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '16.5%', left: '32.4%', width: '53.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // baseKey: 'name'
    },

    address_1: {
      name: 'address_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '18.7%', left: '32.4%', width: '47%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
      baseKey: 'address',
      translation_record: 'flat_languages',
      translation_field: 'address_1_translation',
    },

    address_1_translation: {
      name: 'address_1_translation',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '21.2%', left: '32.4%', width: '47%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
      // baseKey: 'address',
    },

    address_check: {
      name: 'address_check',
      input_type: 'string',
      choices: {
        0: { params: { val: 'address_exists', enclosed_text: 'X', top: '18.4%', left: '79.9%', width: '3%', class_name: 'document-rectangle', input_type: 'button' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 1,
      // xbox mean check box toggle with x inside button div
      // xbox: true,
      second_click_off: true,
    },

    address_site_check: {
      name: 'address_site_check',
      input_type: 'string',
      choices: {
        0: { params: { val: 'address_sit_exists', enclosed_text: 'X', top: '20.7%', left: '79.9%', width: '3%', class_name: 'document-rectangle', input_type: 'button' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 1,
      // xbox: true,
      second_click_off: true,
    },
  },
  9: {},
  10: {},
  11: {},
};

export default ImportantPointsExplanationBilingual;
