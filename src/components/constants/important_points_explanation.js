import SelectField from '../forms/select_field.js'
import Building from '../constants/building.js'
import Amenities from '../constants/amenities.js'
import FlatForDocuments from '../constants/flat_for_documents.js'
// constant file referred to as 'model'; record refers to backend records flat, profile, user
// fieldset for inputs takes absolute positioning
// fieldset form-group-document, takes params.top, params.left, params.width
// !!!! Only height needs to be px NOT %; however, textarea height works with %
// !!!add required: true for validation at submit
// !!! when there is a boolean params.val, there needs to be an initial value of true of false,
// otherwise, first click on false will not work since there is no value in document choices
// can make params.val boolean a string but need to make consistent for all

const ImportantPointsExplanation = {
  1: {
      tenant_name: {
        name: 'tenant_name',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '11.7%', left: '28.4%', width: '15.5%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      date_year: {
        name: 'date_year',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '11.7%', left: '64.4%', width: '5.5%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      date_month: {
        name: 'date_month',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '11.7%', left: '75.4%', width: '4.5%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      date_day: {
        name: 'date_day',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '11.7%', left: '86.4%', width: '4.5%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      broker_company_name: {
        name: 'broker_company_name',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '20%', left: '19.4%', width: '30%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      broker_representative_name: {
        name: 'broker_representative_name',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '22.7%', left: '19.4%', width: '30%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      broker_address_hq: {
        name: 'broker_address_hq',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '24.5%', left: '19.4%', width: '60%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      broker_registration_number: {
        name: 'broker_registration_number',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '25.9%', left: '19.4%', width: '30%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      broker_registration_date: {
        name: 'broker_registration_date',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '27.4%', left: '19.4%', width: '30%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },


      broker_staff_name: {
        name: 'broker_staff_name',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '32.6%', left: '45.4%', width: '35%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      broker_staff_registration: {
        name: 'broker_staff_registration',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '35.4%', left: '60.4%', width: '15%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      broker_staff_address: {
        name: 'broker_staff_address',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '38.6%', left: '45.4%', width: '45.5%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      broker_staff_phone: {
        name: 'broker_staff_phone',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '41.3%', left: '68.4%', width: '20.5%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      contract_work_sub_type: {
        name: 'contract_work_sub_type',
        type: 'string',
        choices: {
          0: { params: { val: 'broker', top: '44.9%', left: '59%', width: '7%', className: 'document-rectangle', type: 'button' } },
          1: { params: { val: 'representative', top: '44.9%', left: '74.8%', width: '7%', className: 'document-rectangle', type: 'button' } },
          // 2: { params: { val: 'single_family', top: '25.8%', left: '27%', width: '10%', className: 'document-rectangle', type: 'button' } },
          // 3: { params: { val: 'others', top: '27.3%', left: '27%', width: '10%', className: 'document-rectangle', type: 'button' } }
        },
        box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
        className: 'form-control-document',
        height: '23px',
        component: 'DocumentChoices'
      },
      // address of of listing; use address for consistency with rental contract
      address: {
        name: 'address',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '51.9%', left: '24.4%', width: '64.5%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },
      // name is building name
      name: {
        name: 'name',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '48.9%', left: '24.4%', width: '64.5%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      unit: {
        name: 'unit',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '55%', left: '24.4%', width: '10%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      size: {
        name: 'size',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '57.8%', left: '24.4%', width: '10%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      floor_area_official: {
        name: 'floor_area_official',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '57.8%', left: '69.4%', width: '10%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      construction: {
        name: 'construction',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '61%', left: '24.4%', width: '20.5%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },
      // owner is the renter building owner is the actual owner of the listing
      owner_name: {
        name: 'owner_name',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '64%', left: '24.4%', width: '64.5%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      owner_address: {
        name: 'owner_address',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '66%', left: '24.4%', width: '64.5%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },
      // not using building owner; corresponds to flat owner_name
      flat_owner_name: {
        name: 'flat_owner_name',
        type: 'string',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '82.3%', left: '22.4%', width: '27%', className: 'document-rectangle', type: 'string' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices'
      },

      // not using building owner; corresponds to flat owner_address
      flat_owner_address: {
        name: 'flat_owner_address',
        type: 'text',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '85.3%', left: '22.4%', width: '27%', height: '3.6%', className: 'document-rectangle wrap-textarea', type: 'text' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices',
        charLimit: 50,
      },

      // building_owner_address2: {
      //   name: 'building_owner_address2',
      //   type: 'string',
      //   choices: {
      //     0: { params: { val: 'inputFieldValue', top: '86.9%', left: '22.4%', width: '27%', className: 'document-rectangle', type: 'string' } },
      //   },
      //   className: 'form-control-document',
      //   component: 'DocumentChoices'
      // },

      building_ownership_notes: {
        name: 'building_ownership_notes',
        type: 'text',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '82.1%', left: '50.4%', width: '18%', height: '6.4%', className: 'document-rectangle wrap-textarea', type: 'text' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices',
        charLimit: 50,
      },

      building_ownership_other_notes: {
        name: 'building_ownership_other_notes',
        type: 'text',
        choices: {
          0: { params: { val: 'inputFieldValue', top: '82.1%', left: '69%', width: '21.8%', height: '6.4%', className: 'document-rectangle wrap-textarea', type: 'text' } },
        },
        className: 'form-control-document',
        component: 'DocumentChoices',
        charLimit: 60,
      },
  },
  // end of page 1
  // start of page 2
  2: {
    regulation_name: {
      name: 'regulation_name',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '8.6%', left: '20%', width: '69.8%', fontSize: '12px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 70,
    },

    regulation_summary: {
      name: 'regulation_summary',
      type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '10.5%', left: '20%', width: '69.8%', height: '3.4%', fontSize: '12px', className: 'document-rectangle wrap-textarea', type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 120,
    },

    water: {
      name: 'water',
      type: 'string',
      choices: {
        0: { params: { val: 'Public Water', top: '20.2%', left: '16.5%', width: '5.5%', className: 'document-rectangle', type: 'button' } },
        1: { params: { val: 'Private Water', top: '20.2%', left: '21.9%', width: '5.5%', className: 'document-rectangle', type: 'button' } },
        2: { params: { val: 'Well', top: '20.2%', left: '27.4%', width: '5%', className: 'document-rectangle', type: 'button' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices'
      // borderColor: 'blue'
    },

    water_year: {
      name: 'water_year',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '20.2%', left: '33%', width: '4.9%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    water_month: {
      name: 'water_month',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '20.2%', left: '40.5%', width: '3%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    water_day: {
      name: 'water_day',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '20.2%', left: '45.6%', width: '3%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    water_scheduled: {
      name: 'water_scheduled',
      type: 'string',
      choices: {
        0: { params: { val: 'Public Water', top: '20.2%', left: '50%', width: '5.5%', className: 'document-rectangle', type: 'button' } },
        1: { params: { val: 'Private Water', top: '20.2%', left: '55.5%', width: '5.5%', className: 'document-rectangle', type: 'button' } },
        2: { params: { val: 'Well', top: '20.2%', left: '60.9%', width: '5%', className: 'document-rectangle', type: 'button' } },
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
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '20.2%', left: '67.9%', width: '22.8%', fontSize: '12px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 40,
    },

    electricity: {
      name: 'electricity',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22.6%', left: '16.4%', width: '15.7%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    electricity_year: {
      name: 'electricity_year',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22.55%', left: '33%', width: '4.9%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    electricity_month: {
      name: 'electricity_month',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22.55%', left: '40.5%', width: '3%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    electricity_day: {
      name: 'electricity_day',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22.55%', left: '45.6%', width: '3%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    electricity_scheduled: {
      name: 'electricity_scheduled',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22.55%', left: '50%', width: '17.3%', fontSize: '12px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 40,
    },

    electricity_notes: {
      name: 'electricity_notes',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '22.55%', left: '67.9%', width: '22.8%', fontSize: '12px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 40,
    },

    gas: {
      name: 'gas',
      type: 'string',
      choices: {
        0: { params: { val: 'Public Gas', top: '24.95%', left: '17.1%', width: '5.5%', className: 'document-rectangle', type: 'button' } },
        1: { params: { val: 'Propane Gas', top: '24.95%', left: '23.3%', width: '7.6%', className: 'document-rectangle', type: 'button' } },
        // 1: { params: { val: 'inputFieldValue', top: '24%', left: '54.5%', width: '10%', className: 'document-rectangle', type: 'string', textAlign: 'right' } }

        // 2: { params: { val: 'None', top: '24.95%', left: '64.4%', width: '4%', className: 'document-rectangle', type: 'button' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
      second_click_off: true,
      // borderColor: 'blue',
    },

    gas_year: {
      name: 'gas_year',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '24.9%', left: '33%', width: '4.9%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    gas_month: {
      name: 'gas_month',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '24.9%', left: '40.5%', width: '3%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    gas_day: {
      name: 'gas_day',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '24.9%', left: '45.6%', width: '3%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    gas_scheduled: {
      name: 'gas_scheduled',
      type: 'string',
      choices: {
        0: { params: { val: 'Public Gas', top: '24.95%', left: '50.1%', width: '5.5%', className: 'document-rectangle', type: 'button' } },
        1: { params: { val: 'Propane Gas', top: '24.95%', left: '56.1%', width: '7.6%', className: 'document-rectangle', type: 'button' } },
        // 1: { params: { val: 'inputFieldValue', top: '24%', left: '54.5%', width: '10%', className: 'document-rectangle', type: 'string', textAlign: 'right' } }

        // 2: { params: { val: 'None', top: '24.95%', left: '64.4%', width: '4%', className: 'document-rectangle', type: 'button' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
      second_click_off: true,
      // borderColor: 'blue'
    },

    gas_notes: {
      name: 'gas_notes',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '24.9%', left: '67.9%', width: '22.8%', fontSize: '12px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 20,
    },

    sewage: {
      // !!! SELECT
      name: 'sewage',
      type: 'string',
      choices: {
        // 0: { params: { val: 'inputFieldValue', top: '27.3%', left: '17.1%', width: '10.5%', className: 'document-rectangle', type: 'string' } },
        0: { params: { val: 'Public Sewer', top: '27%', left: '16.9%', width: '16%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } },
        1: { params: { val: 'Septic Tank', top: '27%', left: '16.9%', width: '16%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } },
        2: { params: { val: 'None', top: '27%', left: '16.9%', width: '16%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } },
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
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.25%', left: '33%', width: '4.9%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    sewage_month: {
      name: 'sewage_month',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.25%', left: '40.5%', width: '3%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    sewage_day: {
      name: 'sewage_day',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.25%', left: '45.6%', width: '3%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    sewage_scheduled: {
      name: 'sewage_scheduled',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.3%', left: '50%', width: '17.3%', fontSize: '12px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 20,
    },
    // this will not work since there is no sewage_scheduled on the Building model
    // sewage_scheduled: {
    //   // !!! SELECT
    //   name: 'sewage_scheduled',
    //   type: 'string',
    //   choices: {
    //     // 0: { params: { val: 'inputFieldValue', top: '27.3%', left: '17.1%', width: '10.5%', className: 'document-rectangle', type: 'string' } },
    //     0: { params: { val: 'Public Sewer', top: '27%', left: '50%', width: '16%', height: '24px', className: 'document-rectangle', type: 'string' } },
    //     1: { params: { val: 'Septic Tank', top: '27%', left: '50%', width: '16%', height: '24px', className: 'document-rectangle', type: 'string' } },
    //     2: { params: { val: 'None', top: '27%', left: '50%', width: '16%', height: '24px', className: 'document-rectangle', type: 'string' } },
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
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.25%', left: '67.9%', width: '22.8%', fontSize: '12px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 20,
    },

    construction_uncompleted: {
      name: 'construction_uncompleted',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '32.3%', left: '27%', width: '63%', fontSize: '12px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    construction_uncompleted_general: {
      name: 'construction_uncompleted_general',
      type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '34.8%', left: '27%', width: '63%', height: '3.3%', fontSize: '12px', className: 'document-rectangle wrap-textarea', type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 120,
    },

    facilities_uncompleted_summary: {
      name: 'facilities_uncompleted_summary',
      type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '38.3%', left: '27%', width: '63%', height: '3.2%', fontSize: '12px', className: 'document-rectangle wrap-textarea', type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 120,
    },

    building_inspection_conducted: {
      name: 'building_inspection_conducted',
      type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '44%', left: '57.3%', width: '5%', className: 'document-rectangle', type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '44%', left: '78.1%', width: '5%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },

    building_inspection_summary: {
      name: 'building_inspection_summary',
      type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '46.1%', left: '49.3%', width: '41.5%', height: '4.2%', fontSize: '12px', className: 'document-rectangle wrap-textarea', type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    kitchen: {
      name: 'kitchen',
      type: 'string',
      choices: {
             0: { valName: 'Y', params: { val: true, top: '57.5%', left: '29.3%', width: '7%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } },
             1: { valName: 'N', params: { val: false, top: '57.5%', left: '29.3%', width: '7%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } }
           },
      className: 'form-control-document',
      component: 'select',
      // height: '23px',
      mapToModel: Amenities,
    },

    kitchen_format: {
      name: 'kitchen_format',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '57.75%', left: '37.4%', width: '11.1%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    kitchen_other: {
      name: 'kitchen_other',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '57.75%', left: '49%', width: '41.6%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    toilet: {
      name: 'toilet',
      type: 'string',
      choices: {
             0: { valName: 'Y', params: { val: true, top: '59.9%', left: '29.3%', width: '7%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } },
             1: { valName: 'N', params: { val: false, top: '59.9%', left: '29.3%', width: '7%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } }
           },
      className: 'form-control-document',
      component: 'select',
      // height: '23px',
      mapToModel: FlatForDocuments,
    },

    toilet_format: {
      name: 'toilet_format',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '60%', left: '37.4%', width: '11.1%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    toilet_other: {
      name: 'toilet_other',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '60%', left: '49%', width: '41.6%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    bath_tub: {
      name: 'bath_tub',
      type: 'string',
      choices: {
             0: { valName: 'Y', params: { val: true, top: '62.1%', left: '29.3%', width: '7%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } },
             1: { valName: 'N', params: { val: false, top: '62.1%', left: '29.3%', width: '7%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } }
           },
      className: 'form-control-document',
      component: 'select',
      // height: '23px',
      mapToModel: Amenities,
    },

    bath_tub_format: {
      name: 'bath_tub_format',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '62.2%', left: '37.4%', width: '11.1%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    bath_tub_other: {
      name: 'bath_tub_other',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '62.2%', left: '49%', width: '41.6%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    hot_water: {
      name: 'hot_water',
      type: 'string',
      choices: {
             0: { valName: 'Y', params: { val: true, top: '64.5%', left: '29.3%', width: '7%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } },
             1: { valName: 'N', params: { val: false, top: '64.5%', left: '29.3%', width: '7%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } }
           },
      className: 'form-control-document',
      component: 'select',
      // height: '23px',
      mapToModel: Amenities,
    },

    hot_water_format: {
      name: 'hot_water_format',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '64.6%', left: '37.4%', width: '11.1%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    hot_water_other: {
      name: 'hot_water_other',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '64.6%', left: '49%', width: '41.6%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    kitchen_grill: {
      name: 'kitchen_grill',
      type: 'string',
      choices: {
             0: { valName: 'Y', params: { val: true, top: '66.85%', left: '29.3%', width: '7%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } },
             1: { valName: 'N', params: { val: false, top: '66.85%', left: '29.3%', width: '7%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } }
           },
      className: 'form-control-document',
      component: 'select',
      // height: '23px',
      mapToModel: Amenities,
    },

    kitchen_grill_format: {
      name: 'kitchen_grill_format',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '66.95%', left: '37.4%', width: '11.1%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    kitchen_grill_other: {
      name: 'kitchen_grill_other',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '66.95%', left: '49%', width: '41.6%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    ac: {
      name: 'ac',
      type: 'string',
      choices: {
             0: { valName: 'Y', params: { val: true, top: '69.15%', left: '29.3%', width: '7%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } },
             1: { valName: 'N', params: { val: false, top: '69.15%', left: '29.3%', width: '7%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } }
           },
      className: 'form-control-document',
      component: 'select',
      // height: '23px',
      mapToModel: Amenities,
    },

    ac_format: {
      name: 'ac_format',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '69.25%', left: '37.4%', width: '11.1%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    ac_other: {
      name: 'ac_other',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '69.25%', left: '49%', width: '41.6%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment1_name: {
      name: 'equipment1_name',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '71.75%', left: '8%', width: '17.5%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment1: {
      name: 'equipment1',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '71.65%', left: '29.55%', width: '7%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      // choices: {
      //        0: { valName: 'Y', params: { val: true, top: '71.65%', left: '29.3%', width: '7%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } },
      //        1: { valName: 'N', params: { val: false, top: '71.65%', left: '29.3%', width: '7%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } }
      //      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // height: '23px',
      // mapToModel: Amenities,
    },

    equipment1_format: {
      name: 'equipment1_format',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '71.65%', left: '37.4%', width: '11.1%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment1_other: {
      name: 'equipment1_other',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '71.65%', left: '49%', width: '41.6%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment2_name: {
      name: 'equipment2_name',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '74.1%', left: '8%', width: '17.5%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment2: {
      name: 'equipment2',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '74.05%', left: '29.55%', width: '7%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      // choices: {
      //        0: { valName: 'Y', params: { val: true, top: '74.05%', left: '29.3%', width: '7%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } },
      //        1: { valName: 'N', params: { val: false, top: '74.05%', left: '29.3%', width: '7%', height: '24px', margin: '0px', className: 'document-rectangle', type: 'string' } }
      //      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // height: '23px',
      // mapToModel: Amenities,
    },

    equipment2_format: {
      name: 'equipment2_format',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '74.05%', left: '37.4%', width: '11.1%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    equipment2_other: {
      name: 'equipment2_other',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '74.05%', left: '49%', width: '41.6%', height: '1.8%', margin: '0', fontSize: '10px', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 8,
    },

    inside_disaster_prevention: {
      name: 'inside_disaster_prevention',
      type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '83.1%', left: '19%', width: '18.5%', className: 'document-rectangle', type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '83.1%', left: '62.5%', width: '18.5%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },

    inside_disaster_warning: {
      name: 'inside_disaster_warning',
      type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '89%', left: '19%', width: '18.5%', className: 'document-rectangle', type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '89%', left: '62.5%', width: '18.5%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },
  },
  // end of page 2
  // start of page 3
  3: {
    inside_tsunami_warning: {
      name: 'inside_tsunami_warning',
      type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '8.4%', left: '17.5%', width: '18.5%', className: 'document-rectangle', type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '8.4%', left: '61%', width: '18.5%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },

    asbestos_record: {
      name: 'asbestos_record',
      type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '12.8%', left: '57.3%', width: '5%', className: 'document-rectangle', type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '12.8%', left: '78.1%', width: '5%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },

    asbestos_survey_contents: {
      name: 'asbestos_survey_contents',
      type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '15%', left: '49.3%', width: '41.5%', height: '4.2%', fontSize: '12px', className: 'document-rectangle wrap-textarea', type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    earthquake_study_performed: {
      name: 'earthquake_study_performed',
      type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '21.75%', left: '57.3%', width: '5%', className: 'document-rectangle', type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '21.75%', left: '78.1%', width: '5%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },

    earthquake_study_contents: {
      name: 'earthquake_study_contents',
      type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '23.8%', left: '49.3%', width: '41.5%', height: '4.2%', fontSize: '12px', className: 'document-rectangle wrap-textarea', type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    other_payments1: {
      name: 'other_payments1',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '39.7%', left: '12%', width: '15.5%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 16,
    },

    other_payments1_explanation: {
      name: 'other_payments1_explanation',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '39.7%', left: '29%', width: '61.5%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    other_payments2: {
      name: 'other_payments2',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '42%', left: '12%', width: '15.5%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 16,
    },

    other_payments2_explanation: {
      name: 'other_payments2_explanation',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '42%', left: '29%', width: '61.5%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    other_payments3: {
      name: 'other_payments3',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '44.35%', left: '12%', width: '15.5%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 16,
    },

    other_payments3_explanation: {
      name: 'other_payments3_explanation',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '44.35%', left: '29%', width: '61.5%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    other_payments4: {
      name: 'other_payments4',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '46.65%', left: '12%', width: '15.5%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 16,
    },

    other_payments4_explanation: {
      name: 'other_payments4_explanation',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '46.65%', left: '29%', width: '61.5%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 60,
    },

    contract_break_terms: {
      name: 'contract_break_terms',
      type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '52.8%', left: '7.9%', width: '85%', height: '13.2%', fontSize: '12px', className: 'document-rectangle wrap-textarea', type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 300,
    },

    warranties: {
      name: 'warranties',
      type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '71.2%', left: '7.9%', width: '85%', height: '13.1%', fontSize: '12px', className: 'document-rectangle wrap-textarea', type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 300,
    },

    escrow_for_deposit: {
      name: 'escrow_for_deposit',
      type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '88.5%', left: '47.3%', width: '10.5%', className: 'document-rectangle', type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '88.5%', left: '65.1%', width: '14%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },

    escrow_agent_deposit: {
      name: 'escrow_agent_deposit',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '90.85%', left: '34%', width: '56.5%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
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
      type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '8.5%', left: '31.6%', width: '5%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    from_month: {
      name: 'from_month',
      type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '8.5%', left: '39%', width: '3%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    from_day: {
      name: 'from_day',
      type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '8.5%', left: '44.5%', width: '3%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    to_year: {
      name: 'to_year',
      type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '11.1%', left: '31.6%', width: '5%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    to_month: {
      name: 'to_month',
      type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '11.1%', left: '39%', width: '3%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    to_day: {
      name: 'to_day',
      type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '11.1%', left: '44.5%', width: '3%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    contract_length_years: {
      name: 'contract_length_years',
      type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '8.45%', left: '56.1%', width: '3%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    contract_length_months: {
      name: 'contract_length_months',
      type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '8.45%', left: '63.6%', width: '3%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    contract_type: {
      name: 'contract_type',
      type: 'string',
      choices: {
        0: { params: { val: 'ordinary_rental_contract', top: '8%', left: '73%', width: '17.5%', className: 'document-rectangle', type: 'button' } },
        1: { params: { val: 'fixed_term_rental_contract', top: '10.35%', left: '73%', width: '17.5%', className: 'document-rectangle', type: 'button' } },
        2: { params: { val: 'end_of_life_rental_contract', top: '12.8%', left: '73%', width: '17.5%', className: 'document-rectangle', type: 'button' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices'
      // borderColor: 'blue'
    },

    contract_renewal_terms: {
      name: 'contract_renewal_terms',
      type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '15.1%', left: '24%', width: '27.5%', height: '6.2%', fontSize: '12px', className: 'document-rectangle wrap-textarea', type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    restrictions_use: {
      name: 'restrictions_use',
      type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '29.4%', left: '23.8%', width: '33.1%', height: '5%', fontSize: '12px', className: 'document-rectangle wrap-textarea', type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    restrictions_use_other: {
      name: 'restrictions_use_other',
      type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '29.4%', left: '57.5%', width: '33.1%', height: '5%', fontSize: '12px', className: 'document-rectangle wrap-textarea', type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    deposit_return_terms: {
      name: 'deposit_return_terms',
      type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '36.5%', left: '8.8%', width: '82.5%', height: '14.1%', fontSize: '12px', className: 'document-rectangle wrap-textarea', type: 'text' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 300,
    },

    building_management_company: {
      name: 'building_management_company',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '57%', left: '35%', width: '55.5%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    building_management_company_address: {
      name: 'building_management_company_address',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '63.2%', left: '35%', width: '55.5%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
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
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '14%', left: '29.5%', width: '60.5%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    bond_deposit_office_address: {
      name: 'bond_deposit_office_address',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '16.2%', left: '29.5%', width: '60.5%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    retga_company: {
      name: 'retga_company',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '24.7%', left: '33%', width: '58.4%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    retga_company_address: {
      name: 'retga_company_address',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27%', left: '33%', width: '58.4%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    retga_company_office_address: {
      name: 'retga_company_office_address',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '29.35%', left: '33%', width: '58.4%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    retga_company_bond_office: {
      name: 'retga_company_bond_office',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '31.8%', left: '33%', width: '58.4%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      charLimit: 50,
    },

    retga_company_bond_office_address: {
      name: 'retga_company_bond_office_address',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '33.5%', left: '33%', width: '58.4%', height: '1.8%', margin: '0', className: 'document-rectangle', type: 'string' } },
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
      type: 'date',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '9.7%', left: '74.2%', width: '16%', height: '1.8%', margin: '0', fontSize: '13px', className: 'document-rectangle', type: 'date' } },
      },
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      // charLimit: 50,
    },

    building_name_2: {
      name: 'building_name_2',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '13%', left: '31.9%', width: '53.5%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      baseKey: 'name'
    },

    address_1: {
      name: 'address_1',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '15.9%', left: '31.9%', width: '47%', className: 'document-rectangle wrap-textarea', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
      baseKey: 'address',
    },
    // button, text hybrid input; when clicked, text toggles on and off with enclosedText
    address_check: {
      name: 'address_check',
      type: 'string',
      choices: {
        0: { params: { val: 'address_exists', enclosedText: 'X', top: '15.6%', left: '79.9%', width: '3%', className: 'document-rectangle', type: 'button' } },
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
      type: 'string',
      choices: {
        0: { params: { val: 'address_sit_exists', enclosedText: 'X', top: '17.3%', left: '79.9%', width: '3%', className: 'document-rectangle', type: 'button' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 1,
      // xbox: true,
      second_click_off: true,
    },

    address_site: {
      name: 'address_site',
      type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '17.9%', left: '31.9%', width: '47%', className: 'document-rectangle wrap-textarea', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      charLimit: 100,
    },

    building_name_1: {
      name: 'building_name_1',
      type: 'text',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '20.4%', left: '43.5%', width: '24.5%', height: '3%', className: 'document-rectangle wrap-textarea', type: 'text' } },
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
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '21%', left: '79%', width: '6%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      baseKey: 'unit'
      // charLimit: 10,
    },

    construction_1: {
      name: 'construction_1',
      type: 'string',
      choices: {
        0: { params: { val: 'Wooden', enclosedText: 'X', top: '24.2%', left: '33.5%', width: '2%', className: 'document-rectangle', type: 'button' } },
        1: { params: { val: 'S', enclosedText: 'X', top: '24.2%', left: '44%', width: '2%', className: 'document-rectangle', type: 'button' } },
        2: { params: { val: 'Other', enclosedText: 'X', top: '24.2%', left: '57.1%', width: '2%', className: 'document-rectangle', type: 'button' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
      baseKey: 'construction'
      // borderColor: 'blue'
    },

    floors: {
      name: 'floors',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.8%', left: '38%', width: '4%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // charLimit: 10,
    },

    floors_underground: {
      name: 'floors_underground',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.8%', left: '51%', width: '4%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // charLimit: 10,
    },

    size_1: {
      name: 'size_1',
      type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '27.8%', left: '81%', width: '6%', className: 'document-rectangle', type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // charLimit: 10,
      baseKey: 'size'
    },

    inspection_date: {
      name: 'inspection_date',
      type: 'date',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '31.1%', left: '33%', width: '16%', height: '1.8%', margin: '0', fontSize: '13px', className: 'document-rectangle', type: 'date' } },
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
      type: 'string',
      choices: {
        0: { params: { val: 'single_family', enclosedText: 'X', top: '33.5%', left: '33.5%', width: '2%', className: 'document-rectangle', type: 'button' }, dependentKeys: { fields: ['flat_sub_type'], value: '' } },
        1: { params: { val: 'flat_in_building', enclosedText: 'X', top: '36%', left: '33.5%', width: '2%', className: 'document-rectangle', type: 'button' }, inactive: true },
        2: { params: { val: 'town_house', enclosedText: 'X', top: '36%', left: '33.5%', width: '2%', className: 'document-rectangle', type: 'button' }, inactive: true },
        // 3: { params: { val: 'others', top: '27.3%', left: '27%', width: '10%', className: 'document-rectangle', type: 'button' } }
      },
      // box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
    },

    // dependentKeys changes other fields to value (self is its own val); eg if below single_family clicked, field flat_sub_types turns to ''
    flat_sub_type: {
      name: 'flat_sub_type',
      type: 'string',
      choices: {
        // 0: { params: { val: 'single_family', enclosedText: 'X', top: '33.5%', left: '33.5%', width: '2%', className: 'document-rectangle', type: 'button' } },
        0: { params: { val: 'town_house', enclosedText: 'X', top: '36%', left: '55.2%', width: '2%', className: 'document-rectangle', type: 'button' }, dependentKeys: { fields: ['flat_type'], value: 'self' } },
        1: { params: { val: 'flat_in_building', enclosedText: 'X', top: '36%', left: '70.6%', width: '2%', className: 'document-rectangle', type: 'button' }, dependentKeys: { fields: ['flat_type'], value: 'self' } },
        // 3: { params: { val: 'others', top: '27.3%', left: '27%', width: '10%', className: 'document-rectangle', type: 'button' } }
      },
      // box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
      baseKey: 'flat_type',
      // dependentValue: 'single_family'
      // changeBaseKey: true,
    },

    degradation_exists: {
      name: 'degradation_exists',
      type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, enclosedText: 'X', top: '40.5%', left: '77.7%', width: '2%', className: 'document-rectangle', type: 'button' } },
        1: { valName: 'N', params: { val: false, enclosedText: 'X', top: '40.5%', left: '85.1%', width: '2%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },

    foundation: {
      name: 'foundation',
      type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosedText: 'X', top: '50.8%', left: '48.1%', width: '2%', className: 'document-rectangle', type: 'button' } },
        1: { params: { val: 'No', enclosedText: 'X', top: '50.8%', left: '51.6%', width: '2%', className: 'document-rectangle', type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosedText: 'X', top: '50.8%', left: '55.2%', width: '2%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },

    floor_assembly: {
      name: 'floor_assembly',
      type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosedText: 'X', top: '52.2%', left: '48.1%', width: '2%', className: 'document-rectangle', type: 'button' } },
        1: { params: { val: 'No', enclosedText: 'X', top: '52.2%', left: '51.6%', width: '2%', className: 'document-rectangle', type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosedText: 'X', top: '52.2%', left: '55.2%', width: '2%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },

    floor: {
      name: 'floor',
      type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosedText: 'X', top: '53.6%', left: '48.1%', width: '2%', className: 'document-rectangle', type: 'button' } },
        1: { params: { val: 'No', enclosedText: 'X', top: '53.6%', left: '51.6%', width: '2%', className: 'document-rectangle', type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosedText: 'X', top: '53.6%', left: '55.2%', width: '2%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },

    pillars: {
      name: 'pillars',
      type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosedText: 'X', top: '55%', left: '48.1%', width: '2%', className: 'document-rectangle', type: 'button' } },
        1: { params: { val: 'No', enclosedText: 'X', top: '55%', left: '51.6%', width: '2%', className: 'document-rectangle', type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosedText: 'X', top: '55%', left: '55.2%', width: '2%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },

    exterior_walls: {
      name: 'exterior_walls',
      type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosedText: 'X', top: '56.4%', left: '48.1%', width: '2%', className: 'document-rectangle', type: 'button' } },
        1: { params: { val: 'No', enclosedText: 'X', top: '56.4%', left: '51.6%', width: '2%', className: 'document-rectangle', type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosedText: 'X', top: '56.4%', left: '55.2%', width: '2%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },

    balcony: {
      name: 'balcony',
      type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosedText: 'X', top: '57.8%', left: '48.1%', width: '2%', className: 'document-rectangle', type: 'button' } },
        1: { params: { val: 'No', enclosedText: 'X', top: '57.8%', left: '51.6%', width: '2%', className: 'document-rectangle', type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosedText: 'X', top: '57.8%', left: '55.2%', width: '2%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },

    interior_walls: {
      name: 'interior_walls',
      type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosedText: 'X', top: '59.2%', left: '48.1%', width: '2%', className: 'document-rectangle', type: 'button' } },
        1: { params: { val: 'No', enclosedText: 'X', top: '59.2%', left: '51.6%', width: '2%', className: 'document-rectangle', type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosedText: 'X', top: '59.2%', left: '55.2%', width: '2%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },

    ceilings: {
      name: 'ceilings',
      type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosedText: 'X', top: '60.6%', left: '48.1%', width: '2%', className: 'document-rectangle', type: 'button' } },
        1: { params: { val: 'No', enclosedText: 'X', top: '60.6%', left: '51.6%', width: '2%', className: 'document-rectangle', type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosedText: 'X', top: '60.6%', left: '55.2%', width: '2%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },

    roof_truss: {
      name: 'roof_truss',
      type: 'boolean',
      choices: {
        0: { params: { val: 'Yes', enclosedText: 'X', top: '62%', left: '48.1%', width: '2%', className: 'document-rectangle', type: 'button' } },
        1: { params: { val: 'No', enclosedText: 'X', top: '62%', left: '51.6%', width: '2%', className: 'document-rectangle', type: 'button' } },
        2: { params: { val: 'Could not be investigated', enclosedText: 'X', top: '62%', left: '55.2%', width: '2%', className: 'document-rectangle', type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      // attributes: { names: ['bath_tub'], type: 'boolean' }
    },


    // address_type: {
    //   name: 'address_type',
    //   type: 'string',
    //   choices: {
    //     0: { params: { val: 'residence_number', top: '8%', left: '73%', width: '17.5%', className: 'document-rectangle', type: 'button' } },
    //     1: { params: { val: 'site_number', top: '10.35%', left: '73%', width: '17.5%', className: 'document-rectangle', type: 'button' } },
    //     // 2: { params: { val: 'end_of_life_rental_contract', top: '12.8%', left: '73%', width: '17.5%', className: 'document-rectangle', type: 'button' } },
    //   },
    //   className: 'form-control-document',
    //   height: '23px',
    //   component: 'DocumentChoices'
    //   // borderColor: 'blue'
    // },
  },
  7: {},
  8: {},
  9: {}

//     name: {
//       name: 'name',
//       // className: 'form-control-document',
//       // change from input componnet use DocumentChoices
//       component: 'DocumentChoices',
//       borderColor: 'lightgray',
//       choices: {
//         0: {
//           params: {
//             val: 'inputFieldValue',
//             top: '16.5%',
//             left: '26.5%',
//             width: '63%',
//             // change from input componnet use document-rectange
//             className: 'document-rectangle',
//             // !!! height works only with px
//             // height: '23px',
//             type: 'string',
//           }
//         }
//       },
//       required: true
//     },

//
//     address: {
//       name: 'address',
//       // type: 'string',
//       // className: 'form-control-document',
//       component: 'DocumentChoices',
//       borderColor: 'lightgray',
//       choices: {
//         0: {
//           params: {
//             val: 'inputFieldValue',
//             top: '19.1%',
//             left: '26.5%',
//             width: '63%',
//             height: '23px',
//             className: 'document-rectangle',
//             type: 'string',
//           }
//         }
//       },
//       // required: true
//     },
//
//
//     construction: {
//       name: 'construction',
//       type: 'string',
//       choices: {
//         0: { params: { val: 'Wooden', top: '21.6%', left: '45%', width: '10%', className: 'document-rectangle', type: 'button' } },
//         1: { params: { val: 'inputFieldValue', top: '24%', left: '54.5%', width: '10%', className: 'document-rectangle', type: 'string', textAlign: 'right' } }
//       },
//       box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'cent' } },
//       className: 'form-control-document',
//       height: '23px',
//       component: 'DocumentChoices',
//       required: true
//     },
//
//     floors: {
//       name: 'floors',
//       type: 'string',
//       choices: {
//         0: { params: { val: 'inputFieldValue', top: '26.3%', left: '57%', width: '4%', className: 'document-rectangle', type: 'string', textAlign: 'right' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     year_built: {
//       name: 'year_built',
//       type: 'string',
//       choices: {
//         0: { params: { val: 'inputFieldValue', top: '23.75%', left: '77.5%', width: '5%', className: 'document-rectangle', type: 'string', textAlign: 'right' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     units: {
//       name: 'units',
//       type: 'string',
//       choices: {
//         0: { params: { val: 'inputFieldValue', top: '28.7%', left: '57.5%', width: '5%', className: 'document-rectangle', type: 'string', textAlign: 'right' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     last_renovation_year: {
//       name: 'last_renovation_year',
//       type: 'string',
//       choices: {
//         0: { params: { val: 'inputFieldValue', top: '26.9%', left: '75%', width: '5%', className: 'document-rectangle', type: 'string', textAlign: 'right' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     unit: {
//       name: 'unit',
//       type: 'string',
//       choices: {
//         0: { params: { val: 'inputFieldValue', top: '31.5%', left: '29%', width: '5%', className: 'document-rectangle', type: 'string', textAlign: 'right' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     rooms: {
//       name: 'rooms',
//       type: 'string',
//       choices: {
//         0: { params: { val: 'inputFieldValue', top: '31.5%', left: '50%', width: '5%', className: 'document-rectangle', type: 'string', textAlign: 'right' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     layout: {
//       name: 'layout',
//       type: 'string',
//       choices: {
//         0: { params: { val: 'LDK', top: '31.5%', left: '56%', width: '5%', className: 'document-rectangle', type: 'button' } },
//         1: { params: { val: 'DK', top: '31.5%', left: '61%', width: '4%', className: 'document-rectangle', type: 'button' } },
//         2: { params: { val: 'K', top: '31.5%', left: '64.5%', width: '3%', className: 'document-rectangle', type: 'button' } },
//         3: { params: { val: 'One Room', top: '31.5%', left: '68%', width: '10%', className: 'document-rectangle', type: 'button' } }
//       },
//       box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
//       className: 'form-control-document',
//       height: '23px',
//       component: 'DocumentChoices'
//       // borderColor: 'blue'
//     },
//
//     size: {
//       name: 'size',
//       type: 'string',
//       choices: {
//         0: { params: { val: 'inputFieldValue', top: '34.3%', left: '42.7%', width: '5%', className: 'document-rectangle', type: 'string', textAlign: 'right' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     balcony_size: {
//       name: 'balcony_size',
//       type: 'string',
//       choices: {
//         0: { params: { val: 'inputFieldValue', top: '34.2%', left: '77.7%', width: '5%', className: 'document-rectangle', type: 'string', textAlign: 'right' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     toilet: {
//       name: 'toilet',
//       type: 'string',
//       choices: {
//         0: { params: { val: 'Dedicated Flushing Toilet', top: '36.4%', left: '53%', width: '5%', className: 'document-rectangle', type: 'button' } },
//         1: { params: { val: 'Dedicated Non-flushing Toilet', top: '36.4%', left: '58.3%', width: '7%', className: 'document-rectangle', type: 'button' } },
//         2: { params: { val: 'Shared Flushing Toilet', top: '36.4%', left: '72%', width: '5%', className: 'document-rectangle', type: 'button' } },
//         3: { params: { val: 'Shared Non-flushing Toilet', top: '36.4%', left: '77.5%', width: '7%', className: 'document-rectangle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       height: '23px',
//       component: 'DocumentChoices'
//       // borderColor: 'blue'
//     },
// 　　// !!!!!!bath is assuming if there is a shower, there is a bathingroom
//     bath_tub: {
//       name: 'bath_tub',
//       type: 'boolean',
//       choices: {
//         0: { valName: 'Y', params: { val: true, top: '37.7%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '37.7%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices',
//       // attributes; keep just in case
//       attributes: { names: ['bath_tub'], type: 'boolean' }
//     },
//
//     shower: {
//       name: 'shower',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '39.2%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '39.2%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     wash_basin: {
//       name: 'wash_basin',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '40.7%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '40.7%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     washer_dryer_area: {
//       name: 'washer_dryer_area',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '42.5%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '42.5%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     hot_water: {
//       name: 'hot_water',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '44%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '44%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     kitchen_grill: {
//       name: 'kitchen_grill',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '45.5%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '45.5%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     ac: {
//       name: 'ac',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '47%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '47%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     lighting_fixed: {
//       name: 'lighting_fixed',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '48.5%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '48.5%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     auto_lock: {
//       name: 'auto_lock',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '50%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '50%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//     // cable_tv includes digital
//     cable_tv: {
//       name: 'cable_tv',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '51.5%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '51.5%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     internet_ready: {
//       name: 'internet_ready',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '53%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '53%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     mail_box: {
//       name: 'mail_box',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '54.5%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '54.5%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     parcel_delivery_box: {
//       name: 'parcel_delivery_box',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '56%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '56%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     lock_key: {
//       name: 'lock_key',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '57.5%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '57.5%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     key_number: {
//       name: 'key_number',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '57.7%', left: '64.4%', width: '13%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     keys: {
//       name: 'keys',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '57.7%', left: '82%', width: '3%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     power_usage_amount: {
//       name: 'power_usage_amount',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '62.6%', left: '44%', width: '7%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     gas: {
//       name: 'gas',
//       type: 'string',
//       choices: {
//         0: { params: { val: 'Public Gas', top: '64.1%', left: '42%', width: '7%', className: 'document-rectangle', type: 'button' } },
//         1: { params: { val: 'Propane Gas', top: '64.1%', left: '51.3%', width: '12%', className: 'document-rectangle', type: 'button' } },
//         2: { params: { val: 'None', top: '64.1%', left: '64.4%', width: '4%', className: 'document-rectangle', type: 'button' } },
//       },
//       className: 'form-control-document',
//       height: '23px',
//       component: 'DocumentChoices'
//       // borderColor: 'blue'
//     },
//
//     water: {
//       name: 'water',
//       type: 'string',
//       choices: {
//         0: { params: { val: 'Public Water', top: '65.7%', left: '39%', width: '15.5%', className: 'document-rectangle', type: 'button' } },
//         1: { params: { val: 'Tank', top: '65.7%', left: '55.3%', width: '6.7%', className: 'document-rectangle', type: 'button' } },
//         2: { params: { val: 'Well', top: '65.7%', left: '63%', width: '6.6%', className: 'document-rectangle', type: 'button' } },
//       },
//       className: 'form-control-document',
//       height: '23px',
//       component: 'DocumentChoices'
//       // borderColor: 'blue'
//     },
//
//     sewage: {
//       name: 'sewage',
//       type: 'string',
//       choices: {
//         0: { params: { val: 'Public Sewer', top: '67.3%', left: '41.5%', width: '10.5%', className: 'document-rectangle', type: 'button' } },
//         1: { params: { val: 'Septic Tank', top: '67.3%', left: '52.7%', width: '6.7%', className: 'document-rectangle', type: 'button' } },
//         2: { params: { val: 'None', top: '67.3%', left: '61%', width: '3%', className: 'document-rectangle', type: 'button' } },
//       },
//       className: 'form-control-document',
//       height: '23px',
//       component: 'DocumentChoices'
//       // borderColor: 'blue'
//     },
//
//     parking_included: {
//       name: 'parking_included',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '69%', left: '39%', width: '4.3%', className: 'document-rectangle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '69%', left: '44.2%', width: '8%', className: 'document-rectangle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     parking_spaces: {
//       name: 'parking_spaces',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '69%', left: '55%', width: '4%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     parking_space_number: {
//       name: 'parking_space_number',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '69%', left: '74%', width: '12%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     bicycle_parking_included: {
//       name: 'bicycle_parking_included',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '70.9%', left: '39%', width: '4.3%', className: 'document-rectangle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '70.9%', left: '44.2%', width: '8%', className: 'document-rectangle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     bicycle_parking_spaces: {
//       name: 'bicycle_parking_spaces',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '70.9%', left: '55%', width: '4%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     bicycle_parking_space_number: {
//       name: 'bicycle_parking_space_number',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '70.9%', left: '74%', width: '12%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     motorcycle_parking_included: {
//       name: 'motorcycle_parking_included',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '72.8%', left: '39%', width: '4.3%', className: 'document-rectangle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '72.8%', left: '44.2%', width: '8%', className: 'document-rectangle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     motorcycle_parking_spaces: {
//       name: 'motorcycle_parking_spaces',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '72.8%', left: '55%', width: '4%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     motorcycle_parking_space_number: {
//       name: 'motorcycle_parking_space_number',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '72.8%', left: '74%', width: '12%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     storage_included: {
//       name: 'storage_included',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '74.7%', left: '39%', width: '4.3%', className: 'document-rectangle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '74.7%', left: '44.2%', width: '8%', className: 'document-rectangle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     storage_spaces: {
//       name: 'storage_spaces',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '74.7%', left: '55%', width: '4%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     storage_space_number: {
//       name: 'storage_space_number',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '74.7%', left: '74%', width: '12%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     dedicated_yard: {
//       name: 'dedicated_yard',
//       type: 'boolean',
//       choices: {
//         // add 1.5% to top
//         0: { valName: 'Y', params: { val: true, top: '76.7%', left: '39%', width: '4.3%', className: 'document-rectangle', type: 'button' } },
//         1: { valName: 'N', params: { val: false, top: '76.7%', left: '44.2%', width: '8%', className: 'document-rectangle', type: 'button' } }
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     // other_facility: {
//     //   name: 'other_facility',
//     //   type: 'boolean',
//     //   choices: {
//     //     // add 1.5% to top
//     //     0: { valName: 'Y', params: { val: true, top: '78.7%', left: '39%', width: '4.3%', className: 'document-rectangle', type: 'button' } },
//     //     1: { valName: 'N', params: { val: false, top: '78.7%', left: '44.2%', width: '8%', className: 'document-rectangle', type: 'button' } }
//     //   },
//     //   className: 'form-control-document',
//     //   component: 'DocumentChoices'
//     // },
//     //
//     // other_facility_name: {
//     //   name: 'other_facility_name',
//     //   type: 'string',
//     //   choices: {
//     //     // add 1.5% to top
//     //     0: { params: { val: 'inputFieldValue', top: '78.7%', left: '27%', width: '11.4%', className: 'document-rectangle', type: 'string' } },
//     //   },
//     //   className: 'form-control-document',
//     //   component: 'DocumentChoices'
//     // },
//
//     from_year: {
//       name: 'from_year',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '83.1%', left: '27%', width: '5%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     from_month: {
//       name: 'from_month',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '83.1%', left: '40%', width: '3%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     from_day: {
//       name: 'from_day',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '83.1%', left: '51.2%', width: '3%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     to_year: {
//       name: 'to_year',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '85.3%', left: '27%', width: '5%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     to_month: {
//       name: 'to_month',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '85.3%', left: '40%', width: '3%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     to_day: {
//       name: 'to_day',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '85.3%', left: '51.2%', width: '3%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     contract_length_years: {
//       name: 'contract_length_years',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '84.2%', left: '72.1%', width: '3%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     contract_length_months: {
//       name: 'contract_length_months',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '84.2%', left: '79.6%', width: '3%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     notice_from_year: {
//       name: 'notice_from_year',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '87.4%', left: '42.5%', width: '5%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     notice_from_month: {
//       name: 'notice_from_month',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '87.4%', left: '50%', width: '3%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     notice_from_day: {
//       name: 'notice_from_day',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '87.4%', left: '55.5%', width: '3%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//     notice_to_year: {
//       name: 'notice_to_year',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '87.4%', left: '64.5%', width: '5%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     notice_to_month: {
//       name: 'notice_to_month',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '87.4%', left: '72%', width: '3%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     },
//
//     notice_to_day: {
//       name: 'notice_to_day',
//       type: 'string',
//       choices: {
//         // add 1.5% to top
//         0: { params: { val: 'inputFieldValue', top: '87.4%', left: '77.5%', width: '3%', className: 'document-rectangle', type: 'string' } },
//       },
//       className: 'form-control-document',
//       component: 'DocumentChoices'
//     }
  // },
  // end of page 1
  // 2: {
  //   price_per_month: {
  //     name: 'price_per_month',
  //     className: 'form-control-document',
  //     // type: 'string',
  //     component: 'DocumentChoices',
  //     borderColor: 'lightgray',
  //     choices: {
  //       0: {
  //         params: {
  //           val: 'inputFieldValue',
  //           top: '17.1%',
  //           left: '24.5%',
  //           width: '8%',
  //           className: 'document-rectangle',
  //           // !!! height works only with px
  //           height: '23px',
  //           type: 'string'
  //         }
  //       }
  //     }
  //   },
  //
  //   payment_due_date: {
  //     name: 'payment_due_date',
  //     className: 'form-control-document',
  //     // component: 'input',
  //     component: 'DocumentChoices',
  //     // type: 'string',
  //     borderColor: 'lightgray',
  //     choices: {
  //       0: {
  //         params: {
  //           val: 'inputFieldValue',
  //           top: '15.7%',
  //           left: '42.5%',
  //           width: '4.2%',
  //           className: 'document-rectangle',
  //           // !!! height works only with px
  //           height: '23px',
  //           type: 'string'
  //         }
  //       }
  //     }
  //   },
  //
  //   management_fees: {
  //     // its for management fees
  //     name: 'management_fees',
  //     className: 'form-control-document',
  //     component: 'DocumentChoices',
  //     // type: 'string',
  //     // component: 'input',
  //     borderColor: 'lightgray',
  //     choices: {
  //       0: {
  //         params: {
  //           val: 'inputFieldValue',
  //           top: '23.1%',
  //           left: '24.5%',
  //           width: '8%',
  //           className: 'document-rectangle',
  //           // !!! height works only with px
  //           height: '23px',
  //           type: 'string'
  //         }
  //       }
  //     }
  //   },
  //
  //   fees_payment_due_date: {
  //     name: 'fees_payment_due_date',
  //     className: 'form-control-document',
  //     component: 'DocumentChoices',
  //     // className: 'form-control-document',
  //     // component: 'input',
  //     // type: 'string',
  //     borderColor: 'lightgray',
  //     choices: {
  //       0: {
  //         params: {
  //           val: 'inputFieldValue',
  //           top: '22%',
  //           left: '42.5%',
  //           width: '4.2%',
  //           // !!! height works only with px
  //           height: '23px',
  //           className: 'document-rectangle',
  //           type: 'string'
  //         }
  //       }
  //     }
  //   },
  //
  //   bank_name: {
  //     name: 'bank_name',
  //     className: 'form-control-document',
  //     component: 'DocumentChoices',
  //     // type: 'string',
  //     // className: 'form-control-document',
  //     // component: 'input',
  //     borderColor: 'lightgray',
  //     choices: {
  //       0: {
  //         params: {
  //           val: 'inputFieldValue',
  //           top: '14.5%',
  //           left: '59.8%',
  //           width: '29.5%',
  //           // !!! height works only with px
  //           className: 'document-rectangle',
  //           height: '23px',
  //           type: 'string'
  //         }
  //       }
  //     }
  //   },
  //
  //   account_type: {
  //     name: 'account_type',
  //     type: 'string',
  //     choices: {
  //       0: { params: { val: 'ordinary', top: '16.3%', left: '64.6%', width: '5%', className: 'document-rectangle', type: 'button' } },
  //       1: { params: { val: 'current', top: '16.3%', left: '70.3%', width: '5%', className: 'document-rectangle', type: 'button' } },
  //     },
  //     className: 'form-control-document',
  //     height: '23px',
  //     component: 'DocumentChoices'
  //     // borderColor: 'blue'
  //   },
  //
  //   account_number: {
  //     name: 'account_number',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '18%', left: '69.5%', width: '20%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   account_name: {
  //     name: 'account_name',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '19.5%', left: '70.5%', width: '19%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   transfer_fee_paid_by: {
  //     name: 'transfer_fee_paid_by',
  //     type: 'string',
  //     choices: {
  //       0: { params: { val: 'owner', top: '21.4%', left: '75.6%', width: '5%', className: 'document-rectangle', type: 'button' } },
  //       1: { params: { val: 'tenant', top: '21.4%', left: '81.3%', width: '5%', className: 'document-rectangle', type: 'button' } },
  //     },
  //     className: 'form-control-document',
  //     height: '23px',
  //     component: 'DocumentChoices'
  //     // borderColor: 'blue'
  //   },
  //
  //   rent_payment_method: {
  //     name: 'rent_payment_method',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '23.2%', left: '67.5%', width: '22%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   deposit: {
  //     // in MONTHS
  //     name: 'deposit',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '25%', left: '25.8%', width: '5%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   deposit_amount: {
  //     // calculated off of deposit months
  //     name: 'deposit_amount',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '26.6%', left: '27.8%', width: '10%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   facilities_usage_fee: {
  //     name: 'facilities_usage_fee',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '29%', left: '29.8%', width: '20%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   other_fees: {
  //     name: 'other_fees',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '31.5%', left: '29.8%', width: '20%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices',
  //     // required: true
  //   },
  //
  //   owner_address: {
  //     name: 'owner_address',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '37.1%', left: '37.8%', width: '51.5%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   owner_name: {
  //     name: 'owner_name',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '38.7%', left: '34.8%', width: '18%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   owner_phone: {
  //     name: 'owner_phone',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '38.7%', left: '60.8%', width: '20%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   management_address: {
  //     name: 'management_address',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '41.3%', left: '39.5%', width: '50%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   management_name: {
  //     name: 'management_name',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '42.85%', left: '34.8%', width: '18%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   management_phone: {
  //     name: 'management_phone',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '42.85%', left: '60.8%', width: '20%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   management_registration_type: {
  //     name: 'management_registration_type',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '44.4%', left: '67.7%', width: '4%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //   management_registration_number: {
  //     name: 'management_registration_number',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '44.4%', left: '75.2%', width: '11.2%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   building_owner_address: {
  //     name: 'building_owner_address',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '48.8%', left: '37.5%', width: '51.8%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   building_owner_name: {
  //     name: 'building_owner_name',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '50.45%', left: '34.8%', width: '18%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   building_owner_phone: {
  //     name: 'building_owner_phone',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '50.45%', left: '60.8%', width: '20%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   tenant_name: {
  //     name: 'tenant_name',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '58.3%', left: '28.8%', width: '15.5%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   tenant_age: {
  //     name: 'tenant_age',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '60.2%', left: '32.3%', width: '5%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   tenant_phone: {
  //     name: 'tenant_phone',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '63.2%', left: '28.8%', width: '15.5%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   co_tenant_name: {
  //     name: 'co_tenant_name',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '58.7%', left: '52.8%', width: '23%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   co_tenant_age: {
  //     name: 'co_tenant_age',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '58.7%', left: '82.3%', width: '4%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   co_tenant_name_1: {
  //     name: 'co_tenant_name_1',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '60.3%', left: '52.8%', width: '23%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices',
  //     // required: true
  //   },
  //
  //   co_tenant_age_1: {
  //     name: 'co_tenant_age_1',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '60.3%', left: '82.3%', width: '4%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices',
  //     // required: true
  //   },
  //
  //   co_tenant_name_2: {
  //     name: 'co_tenant_name_2',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '61.9%', left: '52.8%', width: '23%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   co_tenant_age_2: {
  //     name: 'co_tenant_age_2',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '61.9%', left: '82.3%', width: '4%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   co_tenants: {
  //     name: 'co_tenants',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '63.5%', left: '83%', width: '4%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   emergency_contact_address: {
  //     name: 'emergency_contact_address',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '65.9%', left: '38.5%', width: '51%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  // emergency_contact_name: {
  //     name: 'emergency_contact_name',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '67.5%', left: '34.8%', width: '14.5%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   emergency_contact_phone: {
  //     name: 'emergency_contact_phone',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '67.5%', left: '57%', width: '12.5%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   emergency_contact_relationship: {
  //     name: 'emergency_contact_relationship',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '67.5%', left: '81%', width: '8.5%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  // guarantor_address: {
  //     name: 'guarantor_address',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '73.8%', left: '39.5%', width: '50%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   guarantor_name: {
  //     name: 'guarantor_name',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '75.6%', left: '40.5%', width: '17%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   guarantor_phone: {
  //     name: 'guarantor_phone',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '75.6%', left: '65.5%', width: '20%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  //   guarantor_type: {
  //     name: 'guarantor_type',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '77.4%', left: '66.6%', width: '2.5%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //   guarantor_registration: {
  //     name: 'guarantor_registration',
  //     type: 'string',
  //     choices: {
  //       // add 1.5% to top
  //       0: { params: { val: 'inputFieldValue', top: '77.4%', left: '72.5%', width: '11.2%', className: 'document-rectangle', type: 'string' } },
  //     },
  //     className: 'form-control-document',
  //     component: 'DocumentChoices'
  //   },
  //
  // }
  // end of page 2
};

export default ImportantPointsExplanation;
