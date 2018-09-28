// import YesOrNo = './forms/document_yes_or_no'

const DocumentForm = {
  // flat_building_name: { top: '204px', left: '-120px', component: 'input', borderColor: 'blue', size: 'medium' }
  // fieldset for inputs takes absolute positioning
  // fieldset form-group-document, takes params.top, params.left, params.width
  // !!!! Only height needs to be px NOT %
  flat_building_name: {
    name: 'flat_building_name',
    className: 'form-control-document',
    component: 'input',
    borderColor: 'lightgray',
    choices: {
      0: {
        params: {
          val: '',
          top: '16%',
          left: '24.5%',
          width: '63%',
          // !!! height works only with px
          height: '23px',
          type: 'string',
        }
      }
      }
    },

  address: {
    name: 'address',
    type: 'string',
    className: 'form-control-document',
    component: 'input',
    borderColor: 'lightgray',
    choices: {
      0: {
        params: {
          val: '',
          top: '18.7%',
          left: '24.5%',
          width: '63%',
          height: '23px',
        }
      }
    }
  },

  building_type: {
    name: 'building_type',
    type: 'string',
    choices: {
      0: { params: { val: 'Multi Family', top: '22.8%', left: '27%', width: '10%', className: 'document-rectangle', type: 'button' } },
      1: { params: { val: 'Long Building', top: '24.3%', left: '27%', width: '10%', className: 'document-rectangle', type: 'button' } },
      2: { params: { val: 'Single Family', top: '25.8%', left: '27%', width: '10%', className: 'document-rectangle', type: 'button' } },
      3: { params: { val: 'Others', top: '27.3%', left: '27%', width: '10%', className: 'document-rectangle', type: 'button' } }
    },
    box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
    className: 'form-control-document',
    height: '23px',
    component: 'DocumentChoices'
  },

  construction: {
    name: 'construction',
    type: 'string',
    choices: {
      0: { params: { val: 'Wooden', top: '21.6%', left: '45%', width: '10%', className: 'document-rectangle', type: 'button' } },
      1: { params: { val: '', top: '24%', left: '54.5%', width: '10%', className: 'document-rectangle', type: 'string', textAlign: 'right' } }
    },
    box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'cent' } },
    className: 'form-control-document',
    height: '23px',
    component: 'DocumentChoices'
  },

  floors: {
    name: 'floors',
    type: 'string',
    choices: {
      0: { params: { val: '', top: '26.3%', left: '57%', width: '4%', className: 'document-rectangle', type: 'string', textAlign: 'right' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  units: {
    name: 'units',
    type: 'string',
    choices: {
      0: { params: { val: '', top: '23.75%', left: '77.5%', width: '5%', className: 'document-rectangle', type: 'string', textAlign: 'right' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  construction_year: {
    name: 'construction_year',
    type: 'string',
    choices: {
      0: { params: { val: '', top: '28.7%', left: '57.5%', width: '5%', className: 'document-rectangle', type: 'string', textAlign: 'right' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  renovation_year: {
    name: 'renovation_year',
    type: 'string',
    choices: {
      0: { params: { val: '', top: '27%', left: '75%', width: '5%', className: 'document-rectangle', type: 'string', textAlign: 'right' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  unit: {
    name: 'unit',
    type: 'string',
    choices: {
      0: { params: { val: '', top: '31.5%', left: '29%', width: '5%', className: 'document-rectangle', type: 'string', textAlign: 'right' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  bedrooms: {
    name: 'bedrooms',
    type: 'string',
    choices: {
      0: { params: { val: '', top: '31.5%', left: '50%', width: '5%', className: 'document-rectangle', type: 'string', textAlign: 'right' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  layout: {
    name: 'layout',
    type: 'string',
    choices: {
      0: { params: { val: 'LDK', top: '31.5%', left: '56%', width: '5%', className: 'document-rectangle', type: 'button' } },
      1: { params: { val: 'DK', top: '31.5%', left: '61%', width: '4%', className: 'document-rectangle', type: 'button' } },
      2: { params: { val: 'K', top: '31.5%', left: '64.5%', width: '3%', className: 'document-rectangle', type: 'button' } },
      3: { params: { val: 'One Room', top: '31.5%', left: '68%', width: '10%', className: 'document-rectangle', type: 'button' } }
    },
    box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
    className: 'form-control-document',
    height: '23px',
    component: 'DocumentChoices'
    // borderColor: 'blue'
  },

  floor_space: {
    name: 'floor_space',
    type: 'string',
    choices: {
      0: { params: { val: '', top: '34.3%', left: '42.7%', width: '5%', className: 'document-rectangle', type: 'string', textAlign: 'right' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  balcony_space: {
    name: 'balcony_space',
    type: 'string',
    choices: {
      0: { params: { val: '', top: '34.2%', left: '77.7%', width: '5%', className: 'document-rectangle', type: 'string', textAlign: 'right' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  toilet: {
    name: 'toilet',
    type: 'string',
    choices: {
      0: { params: { val: 'Dedicated Flushing Toilet', top: '36.4%', left: '53%', width: '5%', className: 'document-rectangle', type: 'button' } },
      1: { params: { val: 'Dedicated Non-flushing Toilet', top: '36.4%', left: '58.3%', width: '7%', className: 'document-rectangle', type: 'button' } },
      2: { params: { val: 'Shared Flushing Toilet', top: '36.4%', left: '72%', width: '5%', className: 'document-rectangle', type: 'button' } },
      3: { params: { val: 'Shared Non-flushing Toilet', top: '36.4%', left: '77.5%', width: '7%', className: 'document-rectangle', type: 'button' } }
    },
    className: 'form-control-document',
    height: '23px',
    component: 'DocumentChoices'
    // borderColor: 'blue'
  },

  bath: {
    name: 'bath',
    type: 'boolean',
    choices: {
      0: { valName: 'Y', params: { val: true, top: '37.7%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '37.7%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  shower: {
    name: 'shower',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '39.2%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '39.2%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  sink: {
    name: 'sink',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '40.7%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '40.7%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  laundry_area: {
    name: 'laundry_area',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '42.5%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '42.5%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  water_heater: {
    name: 'water_heater',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '44%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '44%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  cooking_stove: {
    name: 'cooking_stove',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '45.5%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '45.5%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  ac: {
    name: 'ac',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '47%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '47%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  permanent_lighting: {
    name: 'permanent_lighting',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '48.5%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '48.5%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  auto_lock: {
    name: 'auto_lock',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '50%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '50%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  ca_tv: {
    name: 'ca_tv',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '51.5%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '51.5%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  internet_connection: {
    name: 'internet_connection',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '53%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '53%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  mail_box: {
    name: 'mail_box',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '54.5%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '54.5%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  parcel_box: {
    name: 'parcel_box',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '56%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '56%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  lock: {
    name: 'lock',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '57.5%', left: '47.3%', width: '2.7%', className: 'document-circle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '57.5%', left: '51%', width: '2.7%', className: 'document-circle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  key_number: {
    name: 'key_number',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '57.7%', left: '64.4%', width: '5%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  keys: {
    name: 'keys',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '57.7%', left: '82%', width: '3%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  power_amount: {
    name: 'power_amount',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '62.7%', left: '44%', width: '7%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  gas: {
    name: 'gas',
    type: 'string',
    choices: {
      0: { params: { val: 'Public Gas', top: '64.1%', left: '42%', width: '7%', className: 'document-rectangle', type: 'button' } },
      1: { params: { val: 'Propane Gas', top: '64.1%', left: '51.3%', width: '12%', className: 'document-rectangle', type: 'button' } },
      2: { params: { val: 'None', top: '64.1%', left: '64.4%', width: '4%', className: 'document-rectangle', type: 'button' } },
    },
    className: 'form-control-document',
    height: '23px',
    component: 'DocumentChoices'
    // borderColor: 'blue'
  },
  water_system: {
    name: 'water_system',
    type: 'string',
    choices: {
      0: { params: { val: 'Public Water', top: '65.7%', left: '39%', width: '15.5%', className: 'document-rectangle', type: 'button' } },
      1: { params: { val: 'Tank', top: '65.7%', left: '55.3%', width: '6.7%', className: 'document-rectangle', type: 'button' } },
      2: { params: { val: 'Well', top: '65.7%', left: '63%', width: '6.6%', className: 'document-rectangle', type: 'button' } },
    },
    className: 'form-control-document',
    height: '23px',
    component: 'DocumentChoices'
    // borderColor: 'blue'
  },

  sewer: {
    name: 'sewer',
    type: 'string',
    choices: {
      0: { params: { val: 'Public Sewer', top: '67.3%', left: '41.5%', width: '10.5%', className: 'document-rectangle', type: 'button' } },
      1: { params: { val: 'Septic Tank', top: '67.3%', left: '52.7%', width: '6.7%', className: 'document-rectangle', type: 'button' } },
      2: { params: { val: 'None', top: '67.3%', left: '61%', width: '3%', className: 'document-rectangle', type: 'button' } },
    },
    className: 'form-control-document',
    height: '23px',
    component: 'DocumentChoices'
    // borderColor: 'blue'
  },

  parking: {
    name: 'parking',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '69%', left: '39%', width: '4.3%', className: 'document-rectangle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '69%', left: '44.2%', width: '8%', className: 'document-rectangle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  parking_spaces: {
    name: 'parking_spaces',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '69%', left: '55%', width: '4%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  parking_space_number: {
    name: 'parking_space_number',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '69%', left: '74%', width: '7%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  bicycle_parking: {
    name: 'bicycle_parking',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '70.9%', left: '39%', width: '4.3%', className: 'document-rectangle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '70.9%', left: '44.2%', width: '8%', className: 'document-rectangle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  bicycle_parking_spaces: {
    name: 'bicycle_parking_spaces',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '70.9%', left: '55%', width: '4%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  bicycle_parking_number: {
    name: 'bicycle_parking_number',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '70.9%', left: '74%', width: '7%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  motorcycle_parking: {
    name: 'motorcycle_parking',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '72.8%', left: '39%', width: '4.3%', className: 'document-rectangle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '72.8%', left: '44.2%', width: '8%', className: 'document-rectangle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  motorcycle_parking_spaces: {
    name: 'motorcycle_parking_spaces',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '72.8%', left: '55%', width: '4%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  motorcycle_parking_number: {
    name: 'motorcycle_parking_number',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '72.8%', left: '74%', width: '7%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  storage: {
    name: 'storage',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '74.7%', left: '39%', width: '4.3%', className: 'document-rectangle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '74.7%', left: '44.2%', width: '8%', className: 'document-rectangle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  yard: {
    name: 'yard',
    type: 'boolean',
    choices: {
      // add 1.5% to top
      0: { valName: 'Y', params: { val: true, top: '76.7%', left: '39%', width: '4.3%', className: 'document-rectangle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '76.7%', left: '44.2%', width: '8%', className: 'document-rectangle', type: 'button' } }
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  from_year: {
    name: 'from_year',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '83.1%', left: '27%', width: '5%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  from_month: {
    name: 'from_month',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '83.1%', left: '40%', width: '3%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  from_day: {
    name: 'from_day',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '83.1%', left: '51.2%', width: '3%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  to_year: {
    name: 'to_year',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '85.3%', left: '27%', width: '5%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  to_month: {
    name: 'to_month',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '85.3%', left: '40%', width: '3%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  to_day: {
    name: 'to_day',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '85.3%', left: '51.2%', width: '3%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  notice_from_year: {
    name: 'notice_from_year',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '87.4%', left: '42.5%', width: '5%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  notice_from_month: {
    name: 'notice_from_month',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '87.4%', left: '50%', width: '3%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  notice_from_day: {
    name: 'notice_from_day',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '87.4%', left: '55.5%', width: '3%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },
  notice_to_year: {
    name: 'notice_to_year',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '87.4%', left: '64.5%', width: '5%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  notice_to_month: {
    name: 'notice_to_month',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '87.4%', left: '72%', width: '3%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },

  notice_to_day: {
    name: 'notice_to_day',
    type: 'string',
    choices: {
      // add 1.5% to top
      0: { params: { val: '', top: '87.4%', left: '77.5%', width: '3%', className: 'document-rectangle', type: 'string' } },
    },
    className: 'form-control-document',
    component: 'DocumentChoices'
  },
};

export default DocumentForm;
// const DocumentForm = {
//   // flat_building_name: { top: '204px', left: '-120px', component: 'input', borderColor: 'blue', size: 'medium' }
//   flat_building_name: { name: 'flat_building_name', type: 'string', className: 'form-control', top: '177.5px', left: '200px', width: '490px', height: '23px', component: 'input', borderColor: 'blue' },
//   address: { name: 'address', type: 'string', className: 'form-control', top: '205.5px', left: '200px', width: '490px', height: '23px', component: 'input', borderColor: 'blue' },
//   washer: { name: 'washer', type: 'boolean', className: 'form-control', top: '420.5px', left: '412px', width: '100px', height: '23px', component: 'YesOrNo', borderColor: 'blue' }
// }
//
// export default DocumentForm;
