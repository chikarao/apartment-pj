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
        0: { params: { val: 'inputFieldValue', top: '66.7%', left: '71.2%', width: '20.5%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
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
      component: 'DocumentChoices'
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
        0: { params: { val: 'inputFieldValue', top: '87.1%', left: '50.1%', width: '41.5%', height: '4.2%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
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
        0: { params: { val: 'inputFieldValue', top: '92.5%', left: '50.1%', width: '41.5%', height: '4.2%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
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
