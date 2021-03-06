import Building from './building.js'

// NOTE: imported into /contants/documents.js

const FixedTermRentalContract = {
  // flat_building_name: { top: '204px', left: '-120px', component: 'input', borderColor: 'blue', size: 'medium' }
  // fieldset for inputs takes absolute positioning
  // fieldset form-group-document, takes params.top, params.left, params.width
  // Anything iside params needs to be in snake case eg input_type for use in rails api
  // !!!! Only height needs to be px NOT %
  // !!!add required: true for validation at submit
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

    name: {
      name: 'name',
      // className: 'form-control-document',
      // change from input componnet use DocumentChoices
      component: 'DocumentChoices',
      borderColor: 'lightgray',
      choices: {
        0: {
          params: {
            val: 'inputFieldValue',
            top: '16.5%',
            left: '26.5%',
            width: '63%',
            // change from input componnet use document-rectange
            class_name: 'document-rectangle',
            // !!! height works only with px
            // height: '23px',
            input_type: 'string',
          }
        }
      },
      required: true,
      translation_record: 'building_languages',
      translation_column: 'name',
      translation_field: 'name',
    },

    address: {
      name: 'address',
      // input_type: 'string',
      // className: 'form-control-document',
      component: 'DocumentChoices',
      borderColor: 'lightgray',
      choices: {
        0: {
          params: {
            val: 'inputFieldValue',
            top: '19.1%',
            left: '26.5%',
            width: '63%',
            height: '23px',
            class_name: 'document-rectangle',
            input_type: 'string',
          }
        }
      },
      translation_record: 'flat_languages',
      // required: true
    },

    flat_type: {
      name: 'flat_type',
      input_type: 'string',
      choices: {
        0: { params: { val: 'flat_in_building', top: '22.8%', left: '27%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'town_house', top: '24.3%', left: '27%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'single_family', top: '25.8%', left: '27%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } },
        3: { params: { val: 'others', top: '27.3%', left: '27%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices'
    },

    construction: {
      name: 'construction',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Wooden', top: '21.6%', left: '45%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'inputFieldValue', top: '24%', left: '54.5%', width: '10%', height: '1.8%', class_name: 'document-rectangle', input_type: 'string', text_align: 'right' }, selectChoices: Building.construction.choices }
      },
      box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'cent' } },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices',
      required: true,
      // hybrid_field if there are multipe types of fields eg button and input
      hybrid_field: true,
    },

    floors: {
      name: 'floors',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '26.3%', left: '57%', width: '4%', class_name: 'document-rectangle', input_type: 'string', text_align: 'right' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    year_built: {
      name: 'year_built',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '23.75%', left: '77.5%', width: '5%', class_name: 'document-rectangle', input_type: 'string', text_align: 'right' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    units: {
      name: 'units',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '28.7%', left: '57.5%', width: '5%', class_name: 'document-rectangle', input_type: 'string', text_align: 'right' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    last_renovation_year: {
      name: 'last_renovation_year',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '26.9%', left: '75%', width: '5%', class_name: 'document-rectangle', input_type: 'string', text_align: 'right' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    unit: {
      name: 'unit',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '31.5%', left: '29%', width: '5%', class_name: 'document-rectangle', input_type: 'string', text_align: 'right' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    rooms: {
      name: 'rooms',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '31.5%', left: '50%', width: '5%', class_name: 'document-rectangle', input_type: 'string', text_align: 'right' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    layout: {
      name: 'layout',
      input_type: 'string',
      choices: {
        0: { params: { val: 'LDK', top: '31.5%', left: '56%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'DK', top: '31.5%', left: '61%', width: '4%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'K', top: '31.5%', left: '64.5%', width: '3%', class_name: 'document-rectangle', input_type: 'button' } },
        3: { params: { val: 'One Room', top: '31.5%', left: '68%', width: '10%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices'
      // borderColor: 'blue'
    },

    size: {
      name: 'size',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '34.3%', left: '42.7%', width: '5%', class_name: 'document-rectangle', input_type: 'string', text_align: 'right' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    balcony_size: {
      name: 'balcony_size',
      input_type: 'string',
      choices: {
        0: { params: { val: 'inputFieldValue', top: '34.2%', left: '77.7%', width: '5%', class_name: 'document-rectangle', input_type: 'string', text_align: 'right' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    toilet: {
      name: 'toilet',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Dedicated Flushing Toilet', top: '36.4%', left: '53%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'Dedicated Non-flushing Toilet', top: '36.4%', left: '58.3%', width: '7%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Shared Flushing Toilet', top: '36.4%', left: '72%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } },
        3: { params: { val: 'Shared Non-flushing Toilet', top: '36.4%', left: '77.5%', width: '7%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices'
      // borderColor: 'blue'
    },
　　// !!!!!!bath is assuming if there is a shower, there is a bathingroom
    bath_tub: {
      name: 'bath_tub',
      input_type: 'boolean',
      choices: {
        0: { valName: 'Y', params: { val: true, top: '37.7%', left: '47.3%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '37.7%', left: '51%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // attributes; keep just in case
      attributes: { names: ['bath_tub'], input_type: 'boolean' }
    },

    shower: {
      name: 'shower',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '39.2%', left: '47.3%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '39.2%', left: '51%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    wash_basin: {
      name: 'wash_basin',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '40.7%', left: '47.3%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '40.7%', left: '51%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    washer_dryer_area: {
      name: 'washer_dryer_area',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '42.5%', left: '47.3%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '42.5%', left: '51%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    hot_water: {
      name: 'hot_water',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '44%', left: '47.3%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '44%', left: '51%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    kitchen_grill: {
      name: 'kitchen_grill',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '45.5%', left: '47.3%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '45.5%', left: '51%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    ac: {
      name: 'ac',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '47%', left: '47.3%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '47%', left: '51%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    lighting_fixed: {
      name: 'lighting_fixed',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '48.5%', left: '47.3%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '48.5%', left: '51%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    auto_lock: {
      name: 'auto_lock',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '50%', left: '47.3%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '50%', left: '51%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },
    // cable_tv includes digital
    cable_tv: {
      name: 'cable_tv',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '51.5%', left: '47.3%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '51.5%', left: '51%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    internet_ready: {
      name: 'internet_ready',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '53%', left: '47.3%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '53%', left: '51%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    mail_box: {
      name: 'mail_box',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '54.5%', left: '47.3%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '54.5%', left: '51%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    parcel_delivery_box: {
      name: 'parcel_delivery_box',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '56%', left: '47.3%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '56%', left: '51%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    lock_key: {
      name: 'lock_key',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '57.5%', left: '47.3%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '57.5%', left: '51%', width: '2.7%', class_name: 'document-circle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    key_number: {
      name: 'key_number',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '57.7%', left: '64.4%', width: '13%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    keys: {
      name: 'keys',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '57.7%', left: '82%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    power_usage_amount: {
      name: 'power_usage_amount',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '62.6%', left: '44%', width: '7%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    gas: {
      name: 'gas',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Public Gas', top: '64.1%', left: '42%', width: '7%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'Propane Gas', top: '64.1%', left: '51.3%', width: '12%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'None', top: '64.1%', left: '64.4%', width: '4%', class_name: 'document-rectangle', input_type: 'button' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices'
      // borderColor: 'blue'
    },

    water: {
      name: 'water',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Public Water', top: '65.7%', left: '39%', width: '15.5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'Tank', top: '65.7%', left: '55.3%', width: '6.7%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'Well', top: '65.7%', left: '63%', width: '6.6%', class_name: 'document-rectangle', input_type: 'button' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices'
      // borderColor: 'blue'
    },

    sewage: {
      name: 'sewage',
      input_type: 'string',
      choices: {
        0: { params: { val: 'Public Sewer', top: '67.3%', left: '41.5%', width: '10.5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'Septic Tank', top: '67.3%', left: '52.7%', width: '6.7%', class_name: 'document-rectangle', input_type: 'button' } },
        2: { params: { val: 'None', top: '67.3%', left: '61%', width: '3%', class_name: 'document-rectangle', input_type: 'button' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices'
      // borderColor: 'blue'
    },

    parking_included: {
      name: 'parking_included',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '69%', left: '39%', width: '4.3%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '69%', left: '44.2%', width: '8%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    parking_spaces: {
      name: 'parking_spaces',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '69%', left: '55%', width: '4%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    parking_space_number: {
      name: 'parking_space_number',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '69%', left: '74%', width: '12%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    bicycle_parking_included: {
      name: 'bicycle_parking_included',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '70.9%', left: '39%', width: '4.3%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '70.9%', left: '44.2%', width: '8%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    bicycle_parking_spaces: {
      name: 'bicycle_parking_spaces',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '70.9%', left: '55%', width: '4%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    bicycle_parking_space_number: {
      name: 'bicycle_parking_space_number',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '70.9%', left: '74%', width: '12%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    motorcycle_parking_included: {
      name: 'motorcycle_parking_included',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '72.8%', left: '39%', width: '4.3%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '72.8%', left: '44.2%', width: '8%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    motorcycle_parking_spaces: {
      name: 'motorcycle_parking_spaces',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '72.8%', left: '55%', width: '4%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    motorcycle_parking_space_number: {
      name: 'motorcycle_parking_space_number',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '72.8%', left: '74%', width: '12%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    storage_included: {
      name: 'storage_included',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '74.7%', left: '39%', width: '4.3%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '74.7%', left: '44.2%', width: '8%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    storage_spaces: {
      name: 'storage_spaces',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '74.7%', left: '55%', width: '4%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    storage_space_number: {
      name: 'storage_space_number',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '74.7%', left: '74%', width: '12%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    dedicated_yard: {
      name: 'dedicated_yard',
      input_type: 'boolean',
      choices: {
        // add 1.5% to top
        0: { valName: 'Y', params: { val: true, top: '76.7%', left: '39%', width: '4.3%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { valName: 'N', params: { val: false, top: '76.7%', left: '44.2%', width: '8%', class_name: 'document-rectangle', input_type: 'button' } }
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    // other_facility: {
    //   name: 'other_facility',
    //   input_type: 'boolean',
    //   choices: {
    //     // add 1.5% to top
    //     0: { valName: 'Y', params: { val: true, top: '78.7%', left: '39%', width: '4.3%', class_name: 'document-rectangle', input_type: 'button' } },
    //     1: { valName: 'N', params: { val: false, top: '78.7%', left: '44.2%', width: '8%', class_name: 'document-rectangle', input_type: 'button' } }
    //   },
    //   className: 'form-control-document',
    //   component: 'DocumentChoices'
    // },
    //
    // other_facility_name: {
    //   name: 'other_facility_name',
    //   input_type: 'string',
    //   choices: {
    //     // add 1.5% to top
    //     0: { params: { val: 'inputFieldValue', top: '78.7%', left: '27%', width: '11.4%', class_name: 'document-rectangle', input_type: 'string' } },
    //   },
    //   className: 'form-control-document',
    //   component: 'DocumentChoices'
    // },

    from_year: {
      name: 'from_year',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '83.1%', left: '27%', width: '5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    from_month: {
      name: 'from_month',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '83.1%', left: '40%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    from_day: {
      name: 'from_day',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '83.1%', left: '51.2%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    to_year: {
      name: 'to_year',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '85.3%', left: '27%', width: '5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    to_month: {
      name: 'to_month',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '85.3%', left: '40%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    to_day: {
      name: 'to_day',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '85.3%', left: '51.2%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    contract_length_years: {
      name: 'contract_length_years',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '84.2%', left: '72.1%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    contract_length_months: {
      name: 'contract_length_months',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '84.2%', left: '79.6%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    notice_from_year: {
      name: 'notice_from_year',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '87.4%', left: '42.5%', width: '5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    notice_from_month: {
      name: 'notice_from_month',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '87.4%', left: '50%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    notice_from_day: {
      name: 'notice_from_day',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '87.4%', left: '55.5%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },
    notice_to_year: {
      name: 'notice_to_year',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '87.4%', left: '64.5%', width: '5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    notice_to_month: {
      name: 'notice_to_month',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '87.4%', left: '72%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    notice_to_day: {
      name: 'notice_to_day',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '87.4%', left: '77.5%', width: '3%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    }
  },
  // end of page 1
  2: {
    // price_per_month: {
    final_rent: {
      name: 'final_rent',
      // name: 'price_per_month',
      className: 'form-control-document',
      // input_type: 'string',
      component: 'DocumentChoices',
      borderColor: 'lightgray',
      choices: {
        0: {
          params: {
            val: 'inputFieldValue',
            top: '17.1%',
            left: '24.5%',
            width: '8%',
            class_name: 'document-rectangle',
            // !!! height works only with px
            height: '23px',
            input_type: 'string'
          }
        }
      }
    },

    payment_due_date: {
      name: 'payment_due_date',
      className: 'form-control-document',
      // component: 'input',
      component: 'DocumentChoices',
      // input_type: 'string',
      borderColor: 'lightgray',
      choices: {
        0: {
          params: {
            val: 'inputFieldValue',
            top: '15.7%',
            left: '42.5%',
            width: '4.2%',
            class_name: 'document-rectangle',
            // !!! height works only with px
            height: '23px',
            input_type: 'string'
          }
        }
      }
    },

    management_fees: {
      // its for management fees
      name: 'management_fees',
      className: 'form-control-document',
      component: 'DocumentChoices',
      // input_type: 'string',
      // component: 'input',
      borderColor: 'lightgray',
      choices: {
        0: {
          params: {
            val: 'inputFieldValue',
            top: '23.1%',
            left: '24.5%',
            width: '8%',
            class_name: 'document-rectangle',
            // !!! height works only with px
            height: '23px',
            input_type: 'string'
          }
        }
      }
    },

    fees_payment_due_date: {
      name: 'fees_payment_due_date',
      className: 'form-control-document',
      component: 'DocumentChoices',
      // className: 'form-control-document',
      // component: 'input',
      // input_type: 'string',
      borderColor: 'lightgray',
      choices: {
        0: {
          params: {
            val: 'inputFieldValue',
            top: '22%',
            left: '42.5%',
            width: '4.2%',
            // !!! height works only with px
            height: '23px',
            class_name: 'document-rectangle',
            input_type: 'string'
          }
        }
      }
    },

    bank_name: {
      name: 'bank_name',
      className: 'form-control-document',
      component: 'DocumentChoices',
      // input_type: 'string',
      // className: 'form-control-document',
      // component: 'input',
      borderColor: 'lightgray',
      choices: {
        0: {
          params: {
            val: 'inputFieldValue',
            top: '14.5%',
            left: '59.8%',
            width: '29.5%',
            // !!! height works only with px
            class_name: 'document-rectangle',
            height: '23px',
            input_type: 'string'
          }
        }
      }
    },

    account_type: {
      name: 'account_type',
      input_type: 'string',
      choices: {
        0: { params: { val: 'ordinary', top: '16.3%', left: '64.6%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'current', top: '16.3%', left: '70.3%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices'
      // borderColor: 'blue'
    },

    account_number: {
      name: 'account_number',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '18%', left: '69.5%', width: '20%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    account_name: {
      name: 'account_name',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '19.5%', left: '70.5%', width: '19%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    transfer_fee_paid_by: {
      name: 'transfer_fee_paid_by',
      input_type: 'string',
      choices: {
        0: { params: { val: 'owner', top: '21.4%', left: '75.6%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } },
        1: { params: { val: 'tenant', top: '21.4%', left: '81.3%', width: '5%', class_name: 'document-rectangle', input_type: 'button' } },
      },
      className: 'form-control-document',
      height: '23px',
      component: 'DocumentChoices'
      // borderColor: 'blue'
    },

    rent_payment_method: {
      name: 'rent_payment_method',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '23.2%', left: '67.5%', width: '22%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    final_deposit: {
    // deposit: {
      // in MONTHS
      name: 'final_deposit',
      // name: 'deposit',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '25%', left: '25.8%', width: '5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    deposit_amount: {
      // calculated off of deposit months
      name: 'deposit_amount',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '26.6%', left: '27.8%', width: '10%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    facilities_usage_fee: {
      name: 'facilities_usage_fee',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '29%', left: '29.8%', width: '20%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    other_fees: {
      name: 'other_fees',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '31.5%', left: '29.8%', width: '20%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // required: true
    },

    owner_address: {
      name: 'owner_address',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '37.1%', left: '37.8%', width: '51.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    owner_name: {
      name: 'owner_name',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '38.7%', left: '34.8%', width: '18%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    owner_phone: {
      name: 'owner_phone',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '38.7%', left: '60.8%', width: '20%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    management_address: {
      name: 'management_address',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '41.3%', left: '39.5%', width: '50%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    management_name: {
      name: 'management_name',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '42.85%', left: '34.8%', width: '18%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    management_phone: {
      name: 'management_phone',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '42.85%', left: '60.8%', width: '20%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    management_registration_number_front: {
      name: 'management_registration_number_front',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '44.4%', left: '67.7%', width: '4%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    management_registration_number: {
      name: 'management_registration_number',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '44.4%', left: '75.2%', width: '11.2%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },
    // chnaged from building_owner_name address and phone;
    flat_owner_address: {
      name: 'flat_owner_address',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '48.8%', left: '37.5%', width: '51.8%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // record_column is the column in the database eg flat.owner_address
      record_column: 'owner_address',
      translation_column: 'owner_address',
      translation_record: 'flat_languages',
      translation_field: 'flat_owner_address',

    },

    flat_owner_name: {
      name: 'flat_owner_name',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '50.45%', left: '34.8%', width: '18%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      record_column: 'owner_contact_name',
      translation_column: 'owner_contact_name',
      translation_record: 'flat_languages',
      translation_field: 'flat_owner_name',
    },

    // flat_owner_company: {
    //   name: 'flat_owner_company',
    //   input_type: 'string',
    //   choices: {
    //     // add 1.5% to top
    //     0: { params: { val: 'inputFieldValue', top: '', left: '', width: '18%', class_name: 'document-rectangle', input_type: 'string' } },
    //   },
    //   className: 'form-control-document',
    //   component: 'DocumentChoices',
    //   record_column: 'owner_name'
    // },

    flat_owner_phone: {
      name: 'flat_owner_phone',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '50.45%', left: '60.8%', width: '20%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      record_column: 'owner_phone',
      translation_column: 'owner_phone',
      translation_record: 'flat_languages',
      translation_field: 'flat_owner_phone',
    },

    tenant_name: {
      name: 'tenant_name',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '58.3%', left: '28.8%', width: '15.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    tenant_age: {
      name: 'tenant_age',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '60.2%', left: '32.3%', width: '5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    tenant_phone: {
      name: 'tenant_phone',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '63.2%', left: '28.8%', width: '15.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    co_tenant_name: {
      name: 'co_tenant_name',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '58.7%', left: '52.8%', width: '23%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    co_tenant_age: {
      name: 'co_tenant_age',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '58.7%', left: '82.3%', width: '4%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    co_tenant_name_1: {
      name: 'co_tenant_name_1',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '60.3%', left: '52.8%', width: '23%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // required: true
    },

    co_tenant_age_1: {
      name: 'co_tenant_age_1',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '60.3%', left: '82.3%', width: '4%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices',
      // required: true
    },

    co_tenant_name_2: {
      name: 'co_tenant_name_2',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '61.9%', left: '52.8%', width: '23%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    co_tenant_age_2: {
      name: 'co_tenant_age_2',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '61.9%', left: '82.3%', width: '4%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    co_tenants: {
      name: 'co_tenants',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '63.5%', left: '83%', width: '4%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    emergency_contact_address: {
      name: 'emergency_contact_address',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '65.9%', left: '38.5%', width: '51%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

  emergency_contact_name: {
      name: 'emergency_contact_name',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '67.5%', left: '34.8%', width: '14.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    emergency_contact_phone: {
      name: 'emergency_contact_phone',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '67.5%', left: '57%', width: '12.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    emergency_contact_relationship: {
      name: 'emergency_contact_relationship',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '67.5%', left: '81%', width: '8.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

  guarantor_address: {
      name: 'guarantor_address',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '73.8%', left: '39.5%', width: '50%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    guarantor_name: {
      name: 'guarantor_name',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '75.6%', left: '40.5%', width: '17%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    guarantor_phone: {
      name: 'guarantor_phone',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '75.6%', left: '65.5%', width: '20%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

    guarantor_type: {
      name: 'guarantor_type',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '77.4%', left: '66.6%', width: '2.5%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },
    guarantor_registration: {
      name: 'guarantor_registration',
      input_type: 'string',
      choices: {
        // add 1.5% to top
        0: { params: { val: 'inputFieldValue', top: '77.4%', left: '72.5%', width: '11.2%', class_name: 'document-rectangle', input_type: 'string' } },
      },
      className: 'form-control-document',
      component: 'DocumentChoices'
    },

  }
  // end of page 2
};

export default FixedTermRentalContract;
