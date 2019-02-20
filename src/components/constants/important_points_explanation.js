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

const ImportantPointsExplanation = {
  1: {
      document_name: {
        name: 'document_name',
        // className: 'form-control-document',
        // change from input componnet use DocumentChoices
        component: 'DocumentChoices',
        borderColor: 'lightgray',
        choices: {
          0: {
            params: {
              val: 'documentAttributes',
              top: '2%',
              left: '37%',
              width: '30%',
              // change from input componnet use document-rectange
              class_name: 'document-rectangle',
              // !!! height works only with px
              // height: '23px',
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
          0: { params: { val: 'inputFieldValue', top: '11.7%', left: '28.4%', width: '15.5%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      date_year: {
        name: 'date_year',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '11.7%', left: '64.4%', width: '5.5%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      date_month: {
        name: 'date_month',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '11.7%', left: '75.4%', width: '4.5%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      date_day: {
        name: 'date_day',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '11.7%', left: '86.4%', width: '4.5%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      broker_company_name: {
        name: 'broker_company_name',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '20%', left: '19.4%', width: '40%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      broker_representative_name: {
        name: 'broker_representative_name',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '22.7%', left: '19.4%', width: '40%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      broker_address_hq: {
        name: 'broker_address_hq',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '24.5%', left: '19.4%', width: '60%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      broker_registration_number: {
        name: 'broker_registration_number',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '25.9%', left: '19.4%', width: '30%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      broker_registration_date: {
        name: 'broker_registration_date',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '27.4%', left: '19.4%', width: '30%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },


      broker_staff_name: {
        name: 'broker_staff_name',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '32.6%', left: '45.4%', width: '35%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      broker_staff_registration: {
        name: 'broker_staff_registration',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '35.4%', left: '60.4%', width: '15%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      broker_staff_address: {
        name: 'broker_staff_address',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '38.6%', left: '45.4%', width: '45.5%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      broker_staff_phone: {
        name: 'broker_staff_phone',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '41.3%', left: '68.4%', width: '20.5%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      contract_work_sub_type: {
        name: 'contract_work_sub_type',
        input_type: 'string',
        choices: {
          0: { params: { val: 'representative', top: '44.9%', left: '59%', width: '7%', class_name: 'document-rectangle', input_type: 'button' } },
          1: { params: { val: 'broker', top: '44.9%', left: '74.8%', width: '7%', class_name: 'document-rectangle', input_type: 'button' } },
          // 2: { params: { val: 'single_family', top: '25.8%', left: '27%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } },
          // 3: { params: { val: 'others', top: '27.3%', left: '27%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } }
        },
        // box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
        className: 'form-control-document',
        height: '23px',
        component: 'DocumentChoices'
      },
      // address of of listing; use address for consistency with rental contract
      address: {
        name: 'address',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '51.9%', left: '24.4%', width: '64.5%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },
      // name is building name
      name: {
        name: 'name',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '48.9%', left: '24.4%', width: '64.5%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      unit: {
        name: 'unit',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '55%', left: '24.4%', width: '10%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      size: {
        name: 'size',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '57.8%', left: '24.4%', width: '10%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      floor_area_official: {
        name: 'floor_area_official',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '57.8%', left: '69.4%', width: '10%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      construction: {
        name: 'construction',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '61%', left: '24.4%', width: '40.5%', height: '2%', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Building.construction.choices, showLocalLanguage: true },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },
      // owner is the renter building owner is the actual owner of the listing
      owner_name: {
        name: 'owner_name',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '64%', left: '24.4%', width: '64.5%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      owner_address: {
        name: 'owner_address',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '66%', left: '24.4%', width: '64.5%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },
      // not using building owner; corresponds to flat owner_name
      flat_owner_name: {
        name: 'flat_owner_name',
        input_type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '82.3%', left: '22.4%', width: '27%', class_name: 'document-rectangle', input_type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices',
        // record_column to indicate which column in backend model field corresponds to
        record_column: 'owner_contact_name',
      },

      // not using building owner; corresponds to flat owner_address
      flat_owner_address: {
        name: 'flat_owner_address',
        input_type: 'text',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '85.3%', left: '22.4%', width: '27%', height: '3.6%', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices',
        charLimit: 50,
        // record_column to indicate which column in backend model field corresponds to
        record_column: 'owner_address',
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
          0: { params: { val: 'inputFieldValue', top: '82.1%', left: '50.4%', width: '18%', height: '6.4%', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices',
        charLimit: 50,
      },

      other_rights: {
        name: 'other_rights',
        input_type: 'text',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '82.1%', left: '69%', width: '21.8%', height: '6.4%', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices',
        charLimit: 60,
      },
  },
  // end of page 1
  // start of page 2
  2: {
    legal_restrictions: {
      name: 'legal_restrictions',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '8.6%', left: '20%', width: '69.8%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 70,
    },

    legal_restrictions_summary: {
      name: 'legal_restrictions_summary',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '10.5%', left: '20%', width: '69.8%', height: '3.4%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 120,
    },

    water: {
      name: 'water',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Public Water', top: '20.2%', left: '16.5%', width: '5.5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['water_scheduled'], value: '' } },
        1: { params: { val: 'Tank', top: '20.2%', left: '21.9%', width: '5.5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['water_scheduled'], value: '' } },
        2: { params: { val: 'Well', top: '20.2%', left: '27.4%', width: '5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['water_scheduled'], value: '' } },
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
        0: { params: { val: 'inputFieldValue', top: '20.2%', left: '33%', width: '4.9%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    water_month: {
      name: 'water_month',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '20.2%', left: '40.5%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    water_day: {
      name: 'water_day',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '20.2%', left: '45.6%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    water_scheduled: {
      name: 'water_scheduled',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Public Water', top: '20.2%', left: '50%', width: '5.5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['water'], value: '' } },
        1: { params: { val: 'Private Water', top: '20.2%', left: '55.5%', width: '5.5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['water'], value: '' } },
        2: { params: { val: 'Well', top: '20.2%', left: '60.9%', width: '5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['water'], value: '' } },
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
        0: { params: { val: 'inputFieldValue', top: '20.2%', left: '67.9%', width: '22.8%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 40,
    },

    electricity: {
      name: 'electricity',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22.6%', left: '16.4%', width: '15.7%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    electricity_year: {
      name: 'electricity_year',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22.55%', left: '33%', width: '4.9%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    electricity_month: {
      name: 'electricity_month',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22.55%', left: '40.5%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    electricity_day: {
      name: 'electricity_day',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22.55%', left: '45.6%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    electricity_scheduled: {
      name: 'electricity_scheduled',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22.55%', left: '50%', width: '17.3%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 40,
    },

    electricity_notes: {
      name: 'electricity_notes',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22.55%', left: '67.9%', width: '22.8%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 40,
    },

    gas: {
      name: 'gas',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Public Gas', top: '24.95%', left: '17.1%', width: '5.5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'Propane Gas', top: '24.95%', left: '23.3%', width: '7.6%', class_name: 'document-rectangle', input_type: 'button' } },
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
        0: { params: { val: 'inputFieldValue', top: '24.9%', left: '33%', width: '4.9%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    gas_month: {
      name: 'gas_month',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '24.9%', left: '40.5%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    gas_day: {
      name: 'gas_day',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '24.9%', left: '45.6%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    gas_scheduled: {
      name: 'gas_scheduled',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Public Gas', top: '24.95%', left: '50.1%', width: '5.5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'Propane Gas', top: '24.95%', left: '56.1%', width: '7.6%', class_name: 'document-rectangle', input_type: 'button' } },
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
        0: { params: { val: 'inputFieldValue', top: '24.9%', left: '67.9%', width: '22.8%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 20,
    },

    sewage: {
      // !!! SELECT
      name: 'sewage',
      input_type: 'string',
      choices: {
        // 0: { params: { val: 'inputFieldValue', top: '27.3%', left: '17.1%', width: '10.5%', class_name: 'document-rectangle', input_type: 'string' } },
        0: { params: { val: 'Public Sewer', top: '27%', left: '16.9%', width: '16%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' } },
        1: { params: { val: 'Septic Tank', top: '27%', left: '16.9%', width: '16%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' } },
        2: { params: { val: 'None', top: '27%', left: '16.9%', width: '16%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // height: '23px',
      // component: 'SelectField'
      // component: 'DocumentChoices'
      component: 'select',
      mapToModel: Building,
      // borderColor: 'blue'
    },

    sewage_year: {
      name: 'sewage_year',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.25%', left: '33%', width: '4.9%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    sewage_month: {
      name: 'sewage_month',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.25%', left: '40.5%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    sewage_day: {
      name: 'sewage_day',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.25%', left: '45.6%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    sewage_scheduled: {
      name: 'sewage_scheduled',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.3%', left: '50%', width: '17.3%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 20,
    },
    // this will not work since there is no sewage_scheduled on the Building model
    // sewage_scheduled: {
    //   // !!! SELECT
    //   name: 'sewage_scheduled',
    //   input_type: 'string',
    //   choices: {
    //     // 0: { params: { val: 'inputFieldValue', top: '27.3%', left: '17.1%', width: '10.5%', class_name: 'document-rectangle', input_type: 'string' } },
    //     0: { params: { val: 'Public Sewer', top: '27%', left: '50%', width: '16%', height: '24px', class_name: 'document-rectangle', input_type: 'string' } },
    //     1: { params: { val: 'Septic Tank', top: '27%', left: '50%', width: '16%', height: '24px', class_name: 'document-rectangle', input_type: 'string' } },
    //     2: { params: { val: 'None', top: '27%', left: '50%', width: '16%', height: '24px', class_name: 'document-rectangle', input_type: 'string' } },
    //   },
    //   className: 'form-control-document',
    //   height: '23px',
    //   // component: 'SelectField'
    //   // component: 'DocumentChoices'
    //   component: 'select',
    //   mapToModel: Building,
    //   // borderColor: 'blue'
    // },

    sewage_notes: {
      name: 'sewage_notes',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.25%', left: '67.9%', width: '22.8%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 20,
    },

    construction_uncompleted: {
      name: 'construction_uncompleted',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '32.3%', left: '27%', width: '63%', font_size: '12px', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    construction_uncompleted_general: {
      name: 'construction_uncompleted_general',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '34.8%', left: '27%', width: '63%', height: '3.3%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 120,
    },

    facilities_uncompleted_summary: {
      name: 'facilities_uncompleted_summary',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '38.3%', left: '27%', width: '63%', height: '3.2%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 120,
    },

    building_inspection_conducted: {
      name: 'building_inspection_conducted',
      input_type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '44%', left: '57.3%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '44%', left: '78.1%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } }
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
        0: { params: { val: 'inputFieldValue', top: '46.1%', left: '49.3%', width: '41.5%', height: '4.2%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    kitchen: {
      name: 'kitchen',
      input_type: 'string',
      choices: {
             0: { valName: 'Y', params: { val: true, top: '57.5%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.kitchen.choices, showLocalLanguage: true },
             1: { valName: 'N', params: { val: false, top: '57.5%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.kitchen.choices, showLocalLanguage: true }
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
        0: { params: { val: 'inputFieldValue', top: '57.75%', left: '37.4%', width: '11.1%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '57.75%', left: '49%', width: '41.6%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
             0: { valName: 'Y', params: { val: true, top: '59.9%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: FlatForDocuments.toilet.choices, showLocalLanguage: true },
             1: { valName: 'N', params: { val: false, top: '59.9%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: FlatForDocuments.toilet.choices, showLocalLanguage: true }
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
        0: { params: { val: 'inputFieldValue', top: '60%', left: '37.4%', width: '11.1%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '60%', left: '49%', width: '41.6%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
             0: { valName: 'Y', params: { val: true, top: '62.1%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.bath_tub.choices, showLocalLanguage: true },
             1: { valName: 'N', params: { val: false, top: '62.1%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.bath_tub.choices, showLocalLanguage: true }
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
        0: { params: { val: 'inputFieldValue', top: '62.2%', left: '37.4%', width: '11.1%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '62.2%', left: '49%', width: '41.6%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
             0: { valName: 'Y', params: { val: true, top: '64.5%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.hot_water.choices, showLocalLanguage: true },
             1: { valName: 'N', params: { val: false, top: '64.5%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.hot_water.choices, showLocalLanguage: true }
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
        0: { params: { val: 'inputFieldValue', top: '64.6%', left: '37.4%', width: '11.1%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '64.6%', left: '49%', width: '41.6%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
             0: { valName: 'Y', params: { val: true, top: '66.85%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.kitchen_grill.choices, showLocalLanguage: true },
             1: { valName: 'N', params: { val: false, top: '66.85%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.kitchen_grill.choices, showLocalLanguage: true }
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
        0: { params: { val: 'inputFieldValue', top: '66.95%', left: '37.4%', width: '11.1%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '66.95%', left: '49%', width: '41.6%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
             0: { valName: 'Y', params: { val: true, top: '69.15%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.ac.choices, showLocalLanguage: true },
             1: { valName: 'N', params: { val: false, top: '69.15%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' }, selectChoices: Amenities.ac.choices, showLocalLanguage: true }
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
        0: { params: { val: 'inputFieldValue', top: '69.25%', left: '37.4%', width: '11.1%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '69.25%', left: '49%', width: '41.6%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '71.75%', left: '8%', width: '17.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '71.65%', left: '29.55%', width: '7%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '71.65%', left: '37.4%', width: '11.1%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '71.65%', left: '49%', width: '41.6%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '74.1%', left: '8%', width: '17.5%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '74.05%', left: '29.55%', width: '7%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      // choices: {
      //        0: { valName: 'Y', params: { val: true, top: '74.05%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' } },
      //        1: { valName: 'N', params: { val: false, top: '74.05%', left: '29.3%', width: '7%', height: '24px', margin: '0px', class_name: 'document-rectangle', input_type: 'string' } }
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
        0: { params: { val: 'inputFieldValue', top: '74.05%', left: '37.4%', width: '11.1%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '74.05%', left: '49%', width: '41.6%', height: '1.8%', margin: '0', font_size: '10px', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { valName: 'Y', params: { val: true, top: '83.1%', left: '19%', width: '18.5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '83.1%', left: '62.5%', width: '18.5%', class_name: 'document-rectangle', input_type: 'button' } }
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
        0: { valName: 'Y', params: { val: true, top: '89%', left: '19%', width: '18.5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '89%', left: '62.5%', width: '18.5%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },
  },
  // end of page 2
  // start of page 3
  3: {
    inside_tsunami_warning: {
      name: 'inside_tsunami_warning',
      input_type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '8.4%', left: '17.5%', width: '18.5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '8.4%', left: '61%', width: '18.5%', class_name: 'document-rectangle', input_type: 'button' } }
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
        0: { valName: 'Y', params: { val: true, top: '12.8%', left: '57.3%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '12.8%', left: '78.1%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } }
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
        0: { params: { val: 'inputFieldValue', top: '15%', left: '49.3%', width: '41.5%', height: '4.2%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    earthquake_study_performed: {
      name: 'earthquake_study_performed',
      input_type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '21.75%', left: '57.3%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '21.75%', left: '78.1%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } }
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
        0: { params: { val: 'inputFieldValue', top: '23.8%', left: '49.3%', width: '41.5%', height: '4.2%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    other_payments1: {
      name: 'other_payments1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '39.7%', left: '12%', width: '15.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '39.7%', left: '29%', width: '61.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '42%', left: '12%', width: '15.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '42%', left: '29%', width: '61.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '44.35%', left: '12%', width: '15.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '44.35%', left: '29%', width: '61.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '46.65%', left: '12%', width: '15.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '46.65%', left: '29%', width: '61.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '52.8%', left: '7.9%', width: '85%', height: '13.2%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 300,
    },

    warranties: {
      name: 'warranties',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '71.2%', left: '7.9%', width: '85%', height: '13.1%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 300,
    },

    escrow_for_deposit: {
      name: 'escrow_for_deposit',
      input_type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '88.5%', left: '47.3%', width: '10.5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '88.5%', left: '65.1%', width: '14%', class_name: 'document-rectangle', input_type: 'button' } }
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
        0: { params: { val: 'inputFieldValue', top: '90.85%', left: '34%', width: '56.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 60,
    },
  },
  // end of page 3
  // start of page 4
  4: {
    from_year: {
      name: 'from_year',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '8.5%', left: '31.6%', width: '5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    from_month: {
      name: 'from_month',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '8.5%', left: '39%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    from_day: {
      name: 'from_day',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '8.5%', left: '44.5%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    to_year: {
      name: 'to_year',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '11.1%', left: '31.6%', width: '5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    to_month: {
      name: 'to_month',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '11.1%', left: '39%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    to_day: {
      name: 'to_day',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '11.1%', left: '44.5%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    contract_length_years: {
      name: 'contract_length_years',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '8.45%', left: '56.1%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    contract_length_months: {
      name: 'contract_length_months',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '8.45%', left: '63.6%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    contract_type: {
      name: 'contract_type',
      input_type: 'string',
      choices: {
        0: { params: { val: 'ordinary_rental_contract', top: '8%', left: '73%', width: '17.5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'fixed_term_rental_contract', top: '10.35%', left: '73%', width: '17.5%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'end_of_life_rental_contract', top: '12.8%', left: '73%', width: '17.5%', class_name: 'document-rectangle', input_type: 'button' } },
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
        0: { params: { val: 'inputFieldValue', top: '15.1%', left: '24%', width: '27.5%', height: '6.2%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    restrictions_use: {
      name: 'restrictions_use',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '29.4%', left: '23.8%', width: '33.1%', height: '5%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    restrictions_use_other: {
      name: 'restrictions_use_other',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '29.4%', left: '57.5%', width: '33.1%', height: '5%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    deposit_return_terms: {
      name: 'deposit_return_terms',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '36.5%', left: '8.8%', width: '82.5%', height: '14.1%', font_size: '12px', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 300,
    },

    building_management_company: {
      name: 'building_management_company',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '57%', left: '35%', width: '55.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    building_management_address: {
      name: 'building_management_address',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '63.2%', left: '35%', width: '55.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },
  },
  5: {
    bond_deposit_office: {
      name: 'bond_deposit_office',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '14%', left: '29.5%', width: '60.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '16.2%', left: '29.5%', width: '60.5%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '24.7%', left: '33%', width: '58.4%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '27%', left: '33%', width: '58.4%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '29.35%', left: '33%', width: '58.4%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '31.8%', left: '33%', width: '58.4%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
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
        0: { params: { val: 'inputFieldValue', top: '33.5%', left: '33%', width: '58.4%', height: '1.8%', margin: '0', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },
  },
  // end of page 5
  // start of page 6
  6: {
    date_prepared: {
      name: 'date_prepared',
      input_type: 'date',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '9.7%', left: '74.2%', width: '16%', height: '1.8%', margin: '0', font_size: '13px', class_name: 'document-rectangle', input_type: 'date' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      // charLimit: 50,
    },

    building_name_1: {
      name: 'building_name_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '13%', left: '31.9%', width: '53.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      baseKey: 'name'
    },

    address_1: {
      name: 'address_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '15.9%', left: '31.9%', width: '47%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
      baseKey: 'address',
    },
    // button, text hybrid input; when clicked, text toggles on and off with enclosedText
    address_check: {
      name: 'address_check',
      input_type: 'string',
      choices: {
        0: { params: { val: 'address_exists', enclosed_text: 'X', top: '15.6%', left: '79.9%', width: '3%', class_name: 'document-rectangle', input_type: 'button' } },
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
        0: { params: { val: 'address_sit_exists', enclosed_text: 'X', top: '17.3%', left: '79.9%', width: '3%', class_name: 'document-rectangle', input_type: 'button' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 1,
      // xbox: true,
      second_click_off: true,
    },

    // address_site: {
    //   name: 'address_site',
    //   input_type: 'text',
    //   choices: {
    //     0: { params: { val: 'inputFieldValue', top: '17.9%', left: '31.9%', width: '47%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
    //   },
    //   className: 'form-control-document',
    //   component: 'DocumentChoices',
    //   charLimit: 100,
    // },

    building_name_2: {
      name: 'building_name_2',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '20.4%', left: '43.5%', width: '24.5%', height: '3%', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      baseKey: 'name',
      charLimit: 100,
    },
    // unit_1 means the key overlaps with unit from flat, so assign 'unit' to baseKey
    // so that it gets picked up by the function getOverlappedkeysMapped
    // for processing in assignOverLappedKeys
    unit_1: {
      name: 'unit_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '21%', left: '79%', width: '6%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      baseKey: 'unit'
      // charLimit: 10,
    },

    construction_1: {
      name: 'construction_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Wooden', enclosed_text: 'X', top: '24.2%', left: '33.5%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'S', enclosed_text: 'X', top: '24.2%', left: '44%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Aluminum', enclosed_text: 'X', top: '24.2%', left: '57.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
      baseKey: 'construction'
      // borderColor: 'blue'
    },

    floors: {
      name: 'floors',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.8%', left: '38%', width: '4%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // charLimit: 10,
    },

    floors_underground: {
      name: 'floors_underground',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.8%', left: '51%', width: '4%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // charLimit: 10,
    },

    size_1: {
      name: 'size_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.8%', left: '81%', width: '6%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // charLimit: 10,
      baseKey: 'size'
    },

    inspection_date: {
      name: 'inspection_date',
      input_type: 'date',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '31.1%', left: '33%', width: '16%', height: '1.8%', margin: '0', font_size: '13px', class_name: 'document-rectangle', input_type: 'date' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // charLimit: 10,
      // baseKey: 'size'
    },
    // dependentKeys changes other fields to value; eg if below single_family clicked, field flat_sub_types turns to ''
    // inactive in choices turns button inative and does nothing when clicked, but shows X or some enclosedText
    flat_type: {
      name: 'flat_type',
      input_type: 'string',
      choices: {
        0: { params: { val: 'single_family', enclosed_text: 'X', top: '33.5%', left: '33.5%', width: '2%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['flat_sub_type'], value: '' } },
        1: { params: { val: 'flat_in_building', enclosed_text: 'X', top: '36%', left: '33.5%', width: '2%', class_name: 'document-rectangle', input_type: 'button' }, inactive: true },
        2: { params: { val: 'town_house', enclosed_text: 'X', top: '36%', left: '33.5%', width: '2%', class_name: 'document-rectangle', input_type: 'button' }, inactive: true },
        // 3: { params: { val: 'others', top: '27.3%', left: '27%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      // box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
    },

    // dependentKeys changes other fields to value (self is its own val); eg if below single_family clicked, field flat_sub_types turns to ''
    flat_sub_type: {
      name: 'flat_sub_type',
      input_type: 'string',
      choices: {
        // 0: { params: { val: 'single_family', enclosed_text: 'X', top: '33.5%', left: '33.5%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        0: { params: { val: 'town_house', enclosed_text: 'X', top: '36%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['flat_type'], value: 'self' } },
        1: { params: { val: 'flat_in_building', enclosed_text: 'X', top: '36%', left: '70.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['flat_type'], value: 'self' } },
        // 3: { params: { val: 'others', top: '27.3%', left: '27%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      // box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
      baseKey: 'flat_type',
      // dependentValue: 'single_family'
      // changeBaseKey: true,
    },

    degradation_exists_wooden: {
      name: 'degradation_exists_wooden',
      input_type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, enclosed_text: 'X', top: '40.5%', left: '77.7%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, enclosed_text: 'X', top: '40.5%', left: '85.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      wooden: true,
      summaryKey: true,
      inactive: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    foundation: {
      name: 'foundation',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '50.8%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '50.8%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '50.8%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    floor_assembly: {
      name: 'floor_assembly',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '52.2%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '52.2%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '52.2%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    floor: {
      name: 'floor',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '53.6%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '53.6%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '53.6%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    pillars: {
      name: 'pillars',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '55%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '55%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '55%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    exterior_walls: {
      name: 'exterior_walls',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '56.4%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '56.4%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '56.4%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    balcony: {
      name: 'balcony',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '57.8%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '57.8%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '57.8%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    interior_walls: {
      name: 'interior_walls',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '59.2%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '59.2%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '59.2%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    ceilings: {
      name: 'ceilings',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '60.6%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '60.6%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '60.6%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    roof_truss: {
      name: 'roof_truss',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '62%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '62%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '62%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    termite_damage: {
      name: 'termite_damage',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '65.1%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '65.1%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '65.1%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    corrosion: {
      name: 'corrosion',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '66.5%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '66.5%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '66.5%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    reinforcement: {
      name: 'reinforcement',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '67.9%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '67.9%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '67.9%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    concrete_compression: {
      name: 'concrete_compression',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '69.3%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '69.3%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '69.3%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    exterior_walls_rain: {
      name: 'exterior_walls_rain',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '50.8%', left: '76.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '50.8%', left: '80.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '50.8%', left: '83.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    eaves_rain: {
      name: 'eaves_rain',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '52.2%', left: '76.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '52.2%', left: '80.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '52.2%', left: '83.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    balcony_rain: {
      name: 'balcony_rain',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '53.6%', left: '76.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '53.6%', left: '80.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '53.6%', left: '83.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    interior_walls_rain: {
      name: 'interior_walls_rain',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '55%', left: '76.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '55%', left: '80.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '55%', left: '83.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    ceilings_rain: {
      name: 'ceilings_rain',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '56.4%', left: '76.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '56.4%', left: '80.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '56.4%', left: '83.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    roof_truss_rain: {
      name: 'roof_truss_rain',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '57.8%', left: '76.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '57.8%', left: '80.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '57.8%', left: '83.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    roof: {
      name: 'roof',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '59.7%', left: '76.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '59.7%', left: '80.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '59.7%', left: '83.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    inspector_name: {
      name: 'inspector_name',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '74.5%', left: '32%', width: '47%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    inspector_trainer: {
      name: 'inspector_trainer',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '79%', left: '32%', width: '34.4%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    inspector_certificate_number: {
      name: 'inspector_certificate_number',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '79%', left: '67%', width: '23.4%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    architect_qualification_type: {
      name: 'architect_qualification_type',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Class 1', enclosed_text: 'X', top: '82.7%', left: '33.5%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'Class 2', enclosed_text: 'X', top: '82.7%', left: '45.9%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Wooden Strcture', enclosed_text: 'X', top: '82.7%', left: '58.3%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        // 3: { params: { val: 'others', top: '27.3%', left: '27%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
    },

    architect_type: {
      name: 'architect_type',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Minister Registration', enclosed_text: 'X', top: '85.4%', left: '51.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'Governor Registration', enclosed_text: 'X', top: '87.8%', left: '51.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        // 2: { params: { val: 'Wooden Strcture', enclosed_text: 'X', top: '82.7%', left: '58.3%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        // 3: { params: { val: 'others', top: '27.3%', left: '27%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
    },

    architect_registration_number: {
      name: 'architect_registration_number',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '86.5%', left: '69%', width: '16%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    architect_office_name: {
      name: 'architect_office_name',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '90.5%', left: '32%', width: '50%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    architect_office_registration: {
      name: 'architect_office_registration',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '93.85%', left: '69%', width: '16%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },
    // address_type: {
    //   name: 'address_type',
    //   input_type: 'string',
    //   choices: {
    //     0: { params: { val: 'residence_number', top: '8%', left: '73%', width: '17.5%', class_name: 'document-rectangle', input_type: 'button' } },
    //     1: { params: { val: 'site_number', top: '10.35%', left: '73%', width: '17.5%', class_name: 'document-rectangle', input_type: 'button' } },
    //     // 2: { params: { val: 'end_of_life_rental_contract', top: '12.8%', left: '73%', width: '17.5%', class_name: 'document-rectangle', input_type: 'button' } },
    //   },
    //   className: 'form-control-document',
    //   height: '23px',
    //   component: 'DocumentChoices'
    //   // borderColor: 'blue'
    // },
  },
  7: {},
  8: {
    date_prepared_1: {
      name: 'date_prepared_1',
      input_type: 'date',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '9.7%', left: '74.2%', width: '16%', height: '1.8%', margin: '0', font_size: '13px', class_name: 'document-rectangle', input_type: 'date' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      baseKey: 'date_prepared',
      // charLimit: 50,
    },

    building_name_3: {
      name: 'building_name_3',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '13%', left: '31.9%', width: '53.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      baseKey: 'name'
    },

    address_2: {
      name: 'address_2',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '16.3%', left: '31.9%', width: '47%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
      baseKey: 'address',
    },
    // button, text hybrid input; when clicked, text toggles on and off with enclosedText
    address_check_1: {
      name: 'address_check_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'address_exists', enclosed_text: 'X', top: '16.1%', left: '79.8%', width: '3%', class_name: 'document-rectangle', input_type: 'button' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 1,
      // xbox mean check box toggle with x inside button div
      // xbox: true,
      second_click_off: true,
      baseKey: 'address_check',
    },

    address_site_check_1: {
      name: 'address_site_check_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'address_sit_exists', enclosed_text: 'X', top: '17.6%', left: '79.8%', width: '3%', class_name: 'document-rectangle', input_type: 'button' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 1,
      // xbox: true,
      second_click_off: true,
      baseKey: 'address_site_check',
    },

    address_site_1: {
      name: 'address_site_1',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '17.9%', left: '31.9%', width: '47%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
      baseKey: 'address_site',
    },

    building_name_4: {
      name: 'building_name_4',
      input_type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '19.6%', left: '43.5%', width: '24.5%', height: '3%', class_name: 'document-rectangle wrap-textarea', input_type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      baseKey: 'name',
      charLimit: 100,
    },
    // unit_1 means the key overlaps with unit from flat, so assign 'unit' to baseKey
    // so that it gets picked up by the function getOverlappedkeysMapped
    // for processing in assignOverLappedKeys
    unit_2: {
      name: 'unit_2',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '20.2%', left: '79%', width: '6%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      baseKey: 'unit'
      // charLimit: 10,
    },

    construction_2: {
      name: 'construction_2',
      input_type: 'string',
      choices: {
        0: { params: { val: 'RC', enclosed_text: 'X', top: '23.4%', left: '31.7%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'SRC', enclosed_text: 'X', top: '23.4%', left: '50.3%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'CFT', enclosed_text: 'X', top: '23.4%', left: '72.9%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
      baseKey: 'construction'
      // borderColor: 'blue'
    },

    floors_1: {
      name: 'floors_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27%', left: '38%', width: '4%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      baseKey: 'floors'
      // charLimit: 10,
    },

    floors_underground_1: {
      name: 'floors_underground_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27%', left: '51%', width: '4%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      baseKey: 'floors_underground'
      // charLimit: 10,
    },

    size_2: {
      name: 'size_2',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27%', left: '81%', width: '6%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // charLimit: 10,
      baseKey: 'size'
    },

    inspection_date_1: {
      name: 'inspection_date_1',
      input_type: 'date',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '30.3%', left: '33%', width: '16%', height: '1.8%', margin: '0', font_size: '13px', class_name: 'document-rectangle', input_type: 'date' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      baseKey: 'inspection_date'
      // charLimit: 10,
    },

    flat_type_1: {
      name: 'flat_type_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'single_family', enclosed_text: 'X', top: '32.9%', left: '33.5%', width: '2%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['flat_sub_type_1'], value: '' } },
        1: { params: { val: 'flat_in_building', enclosed_text: 'X', top: '35.2%', left: '33.5%', width: '2%', class_name: 'document-rectangle', input_type: 'button' }, inactive: true },
        2: { params: { val: 'town_house', enclosed_text: 'X', top: '35.2%', left: '33.5%', width: '2%', class_name: 'document-rectangle', input_type: 'button' }, inactive: true },
        // 3: { params: { val: 'others', top: '27.3%', left: '27%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      // box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
      baseKey: 'flat_type',
    },

    // dependentKeys changes other fields to value (self is its own val); eg if below single_family clicked, field flat_sub_types turns to ''
    flat_sub_type_1: {
      name: 'flat_sub_type_1',
      input_type: 'string',
      choices: {
        // 0: { params: { val: 'single_family', enclosed_text: 'X', top: '33.5%', left: '33.5%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        0: { params: { val: 'town_house', enclosed_text: 'X', top: '35.25%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['flat_type_1'], value: 'self' } },
        1: { params: { val: 'flat_in_building', enclosed_text: 'X', top: '35.25%', left: '68.4%', width: '2%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: ['flat_type_1'], value: 'self' } },
        // 3: { params: { val: 'others', top: '27.3%', left: '27%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      // box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
      baseKey: 'flat_type',
      // dependentValue: 'single_family'
      // changeBaseKey: true,
    },

    degradation_exists_concrete: {
      name: 'degradation_exists_concrete',
      input_type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, enclosed_text: 'X', top: '39.7%', left: '78.7%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, enclosed_text: 'X', top: '39.7%', left: '85.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      wooden: false,
      summaryKey: true,
      inactive: true,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    foundation_1: {
      name: 'foundation_1',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '50%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '50%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '50%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: false,
      baseKey: 'foundation',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    floor_1: {
      name: 'floor_1',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '51.4%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '51.4%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '51.4%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: false,
      baseKey: 'floor',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    pillars_1: {
      name: 'pillars_1',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '52.8%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '52.8%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '52.8%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: false,
      baseKey: 'pillars',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    exterior_walls_1: {
      name: 'exterior_walls_1',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '54.2%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '54.2%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '54.2%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: false,
      baseKey: 'exterior_walls',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    balcony_1: {
      name: 'balcony_1',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '55.6%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '55.6%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '55.6%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: false,
      baseKey: 'balcony',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    halls: {
      name: 'halls',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '57%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '57%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '55.2%', left: '54.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: false,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    // interior_walls_1: {
    //   name: 'interior_walls_1',
    //   input_type: 'boolean',
    //   choices: {
    //     0: { params: { val: 'Yes', enclosed_text: 'X', top: '57%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
    //     1: { params: { val: 'No', enclosed_text: 'X', top: '57%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
    //     2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '57%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
    //   },
    //   className: 'form-control-document',
    //   component: 'DocumentChoices',
    //   degradationKey: true,
    //   wooden: false,
    //   // attributes; keep just in case
    //   // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    // },

    interior_walls_1: {
      name: 'interior_walls_1',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '58.4%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '58.4%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '58.4%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: false,
      baseKey: 'interior_walls',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    ceilings_1: {
      name: 'ceilings_1',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '59.8%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '59.8%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '59.8%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: false,
      baseKey: 'ceilings',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    reinforcement: {
      name: 'reinforcement',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '63%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '63%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '63%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: false,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    concrete_compression: {
      name: 'concrete_compression',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '64.4%', left: '48.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '64.4%', left: '51.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '64.4%', left: '55.2%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: false,
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    exterior_walls_rain_1: {
      name: 'exterior_walls_rain_1',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '50%', left: '76.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '50%', left: '80.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '50%', left: '83.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: false,
      baseKey: 'exterior_walls_rain',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    interior_walls_rain_1: {
      name: 'interior_walls_rain_1',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '51.4%', left: '76.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '51.4%', left: '80.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '51.4%', left: '83.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: false,
      baseKey: 'interior_walls_rain',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    ceilings_rain_1: {
      name: 'ceilings_rain_1',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '52.8%', left: '76.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '52.8%', left: '80.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '52.8%', left: '83.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: false,
      baseKey: 'ceilings_rain',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    roof_1: {
      name: 'roof_1',
      input_type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosed_text: 'X', top: '54.2%', left: '76.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'No', enclosed_text: 'X', top: '54.2%', left: '80.1%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosed_text: 'X', top: '54.2%', left: '83.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      degradationKey: true,
      wooden: false,
      baseKey: 'roof',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    inspector_name_1: {
      name: 'inspector_name_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '73.7%', left: '32%', width: '47%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
      baseKey: 'inspector_name',
    },

    inspector_trainer_1: {
      name: 'inspector_trainer_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '78.2%', left: '32%', width: '34.4%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
      baseKey: 'inspector_trainer',
    },

    inspector_certificate_number_1: {
      name: 'inspector_certificate_number_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '78.2%', left: '67%', width: '23.4%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
      baseKey: 'inspector_certificate_number',
    },

    architect_qualification_type_1: {
      name: 'architect_qualification_type_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Class 1', enclosed_text: 'X', top: '82%', left: '33.6%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'Class 2', enclosed_text: 'X', top: '82%', left: '46%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Wooden Strcture', enclosed_text: 'X', top: '82%', left: '58.4%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        // 3: { params: { val: 'others', top: '27.3%', left: '27%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
      baseKey: 'architect_qualification_type',
    },

    architect_type_1: {
      name: 'architect_type_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Minister Registration', enclosed_text: 'X', top: '84.7%', left: '53.8%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'Governor Registration', enclosed_text: 'X', top: '87.1%', left: '53.8%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        // 2: { params: { val: 'Wooden Strcture', enclosed_text: 'X', top: '82.7%', left: '58.3%', width: '2%', class_name: 'document-rectangle', input_type: 'button' } },
        // 3: { params: { val: 'others', top: '27.3%', left: '27%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
      baseKey: 'architect_type',
    },

    architect_registration_number_1: {
      name: 'architect_registration_number_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '85.8%', left: '69%', width: '16%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
      baseKey: 'architect_registration_number',
    },

    architect_office_name_1: {
      name: 'architect_office_name_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '89.8%', left: '32%', width: '50%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
      baseKey: 'architect_office_name',
    },

    architect_office_registration_1: {
      name: 'architect_office_registration_1',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '93.1%', left: '69%', width: '16%', class_name: 'document-rectangle wrap-textarea', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
      baseKey: 'architect_office_registration',
    },
  },
  9: {}
};

export default ImportantPointsExplanation;
