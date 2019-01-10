import Building from './building.js'

const FixedTermRentalContractBilingualTranslation = {
  // flat_building_name: { top: '204px', left: '-120px', component: 'input', borderColor: 'blue', size: 'medium' }
  // fieldset for inputs takes absolute positioning
  // fieldset form-group-document, takes params.top, params.left, params.width
  // Anything iside params needs to be in snake case eg input_type for use in rails api
  // !!!! Only height needs to be px NOT %
  // !!!add required: true for validation at submit
  1: {
      documentTitle: {
        translation: { en: 'Fixed Term Rental Contract', po: '' },
        params: { top: '10.5%', left: '41%', font_size: '12', class_name: 'document-translation', font_weight: 'bold' }
      },

      heading: {
        translation: { en: 'Heading', po: '' },
        params: { top: '12.8%', left: '17%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
      },

      rentalInformation: {
        translation: { en: 'Rental Information', po: '' },
        params: { top: '14.5%', left: '32.5%', font_size: '10', class_name: 'document-translation' }
      },

      buildingName: {
        translation: { en: 'Name', po: '' },
        params: { top: '18.8%', left: '22.5%', font_size: '10', class_name: 'document-translation' }
      },

      buildingAddress: {
        translation: { en: 'Address', po: '' },
        params: { top: '23.3%', left: '22%', font_size: '10', class_name: 'document-translation' }
      },

      buildingInformation: {
        translation: { en: 'Building Information', po: '' },
        params: { top: '29%', left: '11%', font_size: '10', class_name: 'document-translation', rotate: '90' }
      },

      buildingType: {
        translation: { en: 'Building Type', po: '' },
        params: { top: '33%', left: '20.5%', font_size: '10', class_name: 'document-translation' }
      },

      apartment: {
        translation: { en: 'Apartment', po: '' },
        params: { top: '26.7%', left: '34%', font_size: '10', class_name: 'document-translation' }
      },

      townhouse: {
        translation: { en: 'Townhouse', po: '' },
        params: { top: '30.5%', left: '34%', font_size: '10', class_name: 'document-translation' }
      },

      singleFamily: {
        translation: { en: 'Single Family', po: '' },
        params: { top: '34.4%', left: '34%', font_size: '10', class_name: 'document-translation' }
      },

      other: {
        translation: { en: 'Other', po: '' },
        params: { top: '37.8%', left: '34%', font_size: '10', class_name: 'document-translation' }
      },

      construction: {
        translation: { en: 'Construction', po: '' },
        params: { top: '30.4%', left: '46.2%', font_size: '10', text_align: 'center', class_name: 'document-translation' }
      },

      numberOfUnits: {
        translation: { en: 'No. of Units', po: '' },
        params: { top: '37.1%', left: '46.4%', font_size: '10', class_name: 'document-translation' }
      },

      wooden: {
        translation: { en: 'Wooden', po: '' },
        params: { top: '26.5%', left: '58.4%', font_size: '10', class_name: 'document-translation' }
      },

      nonWood: {
        translation: { en: 'Non-wood', po: '' },
        params: { top: '29.3%', left: '58.4%', font_size: '10', class_name: 'document-translation' }
      },

      unit: {
        translation: { en: 'Unit', po: '' },
        params: { top: '37.1%', left: '67.4%', font_size: '10', class_name: 'document-translation' }
      },

      stories: {
        translation: { en: 'Stories', po: '' },
        params: { top: '33.3%', left: '66.4%', font_size: '10', class_name: 'document-translation' }
      },

      yearBuilt: {
        translation: { en: 'Year Built', po: '' },
        params: { top: '26.5%', left: '77.8%', font_size: '10', class_name: 'document-translation' }
      },

      majorRenovation: {
        translation: { en: 'Major Renovation', po: '' },
        params: { top: '32.1%', left: '75.6%', font_size: '10', class_name: 'document-translation' }
      },

      completed: {
        translation: { en: 'Completed', po: '' },
        params: { top: '36.5%', left: '77.4%', font_size: '10', class_name: 'document-translation' }
      },

      unitInformation: {
        translation: { en: 'Unit Information', po: '' },
        params: { top: '65%', left: '12.1%', font_size: '10', class_name: 'document-translation', rotate: '90' }
      },

      equipment: {
        translation: { en: 'Equipment', po: '' },
        params: { top: '68%', left: '22.1%', font_size: '10', class_name: 'document-translation', rotate: '90' }
      },

      unitNumber: {
        translation: { en: 'Unit Number', po: '' },
        params: { top: '41%', left: '20.1%', font_size: '10', class_name: 'document-translation' }
      },

      unitNo: {
        translation: { en: 'Unit No.', po: '' },
        params: { top: '41%', left: '39%', font_size: '10', class_name: 'document-translation' }
      },
      layout: {
        translation: { en: 'Layout', po: '' },
        params: { top: '41%', left: '48%', font_size: '10', class_name: 'document-translation' }
      },

      oneRoom: {
        translation: { en: 'One Room', po: '' },
        params: { top: '41%', left: '77.1%', font_size: '10', class_name: 'document-translation' }
      },

      floorSpace: {
        translation: { en: 'Floor Space', po: '' },
        params: { top: '44%', left: '20.1%', font_size: '10', class_name: 'document-translation' }
      },

      balcony: {
        translation: { en: 'In addition, balcony', po: '' },
        params: { top: '44%', left: '57.1%', font_size: '10', class_name: 'document-translation' }
      },

      toilet: {
        translation: { en: 'Toilet', po: '' },
        params: { top: '47%', left: '31.1%', font_size: '10', class_name: 'document-translation' }
      },

      toiletAvailability: {
        translation: { en: 'Own (flush・non-flush) ・Shared (flush・non-flush)', po: '' },
        params: { top: '47%', left: '54.6%', font_size: '10', class_name: 'document-translation' }
      },

      yesNoL: {
        translation: { en: 'Yes・No', po: '' },
        params: { top: '49%', left: '54.4%', font_size: '10', class_name: 'document-translation' }
      },

      yesNoR: {
        translation: { en: 'Yes・No', po: '' },
        params: { top: '49%', left: '83.6%', font_size: '10', class_name: 'document-translation' }
      },

      bathTub: {
        translation: { en: 'Bath Tub', po: '' },
        params: { top: '52%', left: '30.9%', font_size: '10', class_name: 'document-translation' }
      },

      shower: {
        translation: { en: 'Shower', po: '' },
        params: { top: '54.8%', left: '30.9%', font_size: '10', class_name: 'document-translation' }
      },

      washBasin: {
        translation: { en: 'Wash Basin', po: '' },
        params: { top: '57.6%', left: '30.9%', font_size: '10', class_name: 'document-translation' }
      },

      washerArea: {
        translation: { en: 'Washer Area', po: '' },
        params: { top: '60.4%', left: '30.9%', font_size: '10', class_name: 'document-translation' }
      },

      waterHeater: {
        translation: { en: 'Water Heater', po: '' },
        params: { top: '63.2%', left: '30.9%', font_size: '10', class_name: 'document-translation' }
      },

      kitchenStove: {
        translation: { en: 'Kitchen Stove', po: '' },
        params: { top: '66%', left: '30.9%', font_size: '10', class_name: 'document-translation' }
      },

      parcelBox: {
        translation: { en: 'Parcel Box', po: '' },
        params: { top: '68.8%', left: '30.9%', font_size: '10', class_name: 'document-translation' }
      },

      ac: {
        translation: { en: 'A/C', po: '' },
        params: { top: '52%', left: '62.2%', font_size: '10', class_name: 'document-translation' }
      },

      fixedLighting: {
        translation: { en: 'Fixed Lighting', po: '' },
        params: { top: '54.8%', left: '62.2%', font_size: '10', class_name: 'document-translation' }
      },

      autoLock: {
        translation: { en: 'Auto Lock', po: '' },
        params: { top: '57.6%', left: '62.2%', font_size: '10', class_name: 'document-translation' }
      },

      digitalTv: {
        translation: { en: 'Digital TV・CATV Ready', po: '' },
        params: { top: '60.4%', left: '62.2%', font_size: '10', class_name: 'document-translation' }
      },

      internetReady: {
        translation: { en: 'Internet Ready', po: '' },
        params: { top: '63.2%', left: '62.2%', font_size: '10', class_name: 'document-translation' }
      },

      mailBox: {
        translation: { en: 'Mail Box', po: '' },
        params: { top: '66%', left: '62.2%', font_size: '10', class_name: 'document-translation' }
      },

      key: {
        translation: { en: 'Key', po: '' },
        params: { top: '73.8%', left: '31.7%', font_size: '10', class_name: 'document-translation' }
      },

      sets: {
        translation: { en: 'Sets', po: '' },
        params: { top: '73.8%', left: '66.2%', font_size: '10', class_name: 'document-translation' }
      },

      electricCapacity: {
        translation: { en: 'Electric Capacity', po: '' },
        params: { top: '77%', left: '30.9%', font_size: '10', class_name: 'document-translation' }
      },

      gas: {
        translation: { en: 'Gas', po: '' },
        params: { top: '81%', left: '30.9%', font_size: '10', class_name: 'document-translation' }
      },

      water: {
        translation: { en: 'Gas', po: '' },
        params: { top: '85%', left: '30.9%', font_size: '10', class_name: 'document-translation' }
      },

      sewage: {
        translation: { en: 'Sewage', po: '' },
        params: { top: '89%', left: '30.9%', font_size: '10', class_name: 'document-translation' }
      },

      amperes: {
        translation: { en: 'Amperes', po: '' },
        params: { top: '77%', left: '61.9%', font_size: '10', class_name: 'document-translation' }
      },

      gasAvailabiity: {
        translation: { en: 'Yes (City Gas・Propane Gas) ・ None', po: '' },
        params: { top: '81%', left: '48.6%', font_size: '10', class_name: 'document-translation' }
      },

      waterAvailability: {
        translation: { en: 'Direct Link to Public Water・Water Tank ・ Well Water', po: '' },
        params: { top: '85%', left: '48.6%', font_size: '10', class_name: 'document-translation' }
      },

      sewageAvailability: {
        translation: { en: 'Yes (Public Sewage・Septic Tank) ・ None', po: '' },
        params: { top: '89%', left: '48.6%', font_size: '10', class_name: 'document-translation' }
      },
  },
  2: {
    unitInformation: {
      translation: { en: 'Unit Information (Continued)', po: '' },
      params: { top: '16.7%', left: '8.5%', font_size: '10', class_name: 'document-translation', rotate: '90' }
    },

    facilities: {
      translation: { en: 'Facilities', po: '' },
      params: { top: '17%', left: '23%', font_size: '10', class_name: 'document-translation', rotate: '90' }
    },

    includedNotIncluded: {
      translation: { en: 'Included・Not Included', po: '' },
      params: { top: '7.7%', left: '45.6%', font_size: '10', class_name: 'document-translation' }
    },

    parking: {
      translation: { en: 'Parking', po: '' },
      params: { top: '10.7%', left: '30.9%', font_size: '10', class_name: 'document-translation' }
    },

    bicycleParking: {
      translation: { en: 'Bicycle Parking', po: '' },
      params: { top: '14.3%', left: '30.9%', font_size: '10', class_name: 'document-translation' }
    },

    motocycleParking: {
      translation: { en: 'Motorcycle Parking', po: '' },
      params: { top: '17.9%', left: '30.9%', font_size: '10', class_name: 'document-translation' }
    },

    storage: {
      translation: { en: 'Storage', po: '' },
      params: { top: '21.2%', left: '30.9%', font_size: '10', class_name: 'document-translation' }
    },

    ownYard: {
      translation: { en: 'Own Yard', po: '' },
      params: { top: '24.8%', left: '30.9%', font_size: '10', class_name: 'document-translation' }
    },

    vehicles: {
      translation: { en: 'Vehicles', po: '' },
      params: { top: '10.7%', left: '64.9%', font_size: '10', class_name: 'document-translation' }
    },

    spaceNo: {
      translation: { en: 'Space No.', po: '' },
      params: { top: '10.7%', left: '71.5%', font_size: '10', class_name: 'document-translation' }
    },

    vehicles1: {
      translation: { en: 'Vehicles', po: '' },
      params: { top: '14.3%', left: '64.9%', font_size: '10', class_name: 'document-translation' }
    },

    spaceNo1: {
      translation: { en: 'Space No.', po: '' },
      params: { top: '14.3%', left: '71.5%', font_size: '10', class_name: 'document-translation' }
    },

    vehicles2: {
      translation: { en: 'Vehicles', po: '' },
      params: { top: '17.9%', left: '64.9%', font_size: '10', class_name: 'document-translation' }
    },

    spaceNo2: {
      translation: { en: 'Space No.', po: '' },
      params: { top: '17.9%', left: '71.5%', font_size: '10', class_name: 'document-translation' }
    },

    contractPeriod: {
      translation: { en: 'Contract Period', po: '' },
      params: { top: '33%', left: '28%', font_size: '10', class_name: 'document-translation' }
    },

    start: {
      translation: { en: 'Start', po: '' },
      params: { top: '35.9%', left: '14.2%', font_size: '10', class_name: 'document-translation' }
    },

    end: {
      translation: { en: 'End', po: '' },
      params: { top: '38.7%', left: '14.2%', font_size: '10', class_name: 'document-translation' }
    },

    year: {
      translation: { en: 'Year', po: '' },
      params: { top: '35.9%', left: '33%', font_size: '10', class_name: 'document-translation' }
    },

    month: {
      translation: { en: 'Month', po: '' },
      params: { top: '35.9%', left: '44%', font_size: '10', class_name: 'document-translation' }
    },

    day: {
      translation: { en: 'Day', po: '' },
      params: { top: '35.9%', left: '55.2%', font_size: '10', class_name: 'document-translation' }
    },

    year1: {
      translation: { en: 'Year', po: '' },
      params: { top: '38.7%', left: '33%', font_size: '10', class_name: 'document-translation' }
    },

    month1: {
      translation: { en: 'Month', po: '' },
      params: { top: '38.7%', left: '44%', font_size: '10', class_name: 'document-translation' }
    },

    day1: {
      translation: { en: 'Day', po: '' },
      params: { top: '38.7%', left: '55.2%', font_size: '10', class_name: 'document-translation' }
    },

    years: {
      translation: { en: 'Year(s)', po: '' },
      params: { top: '37.4%', left: '76%', font_size: '10', class_name: 'document-translation' }
    },

    months: {
      translation: { en: 'Month(s)', po: '' },
      params: { top: '37.4%', left: '83.5%', font_size: '10', class_name: 'document-translation' }
    },

    contractNoticePeriod: {
      translation: { en: 'Notice of contract conclusion to be served from', po: '' },
      params: { top: '41.7%', left: '14.2%', font_size: '10', class_name: 'document-translation' }
    },

    noticeYear: {
      translation: { en: 'Year', po: '' },
      params: { top: '41.7%', left: '48.3%', font_size: '10', class_name: 'document-translation' }
    },

    noticeMonth: {
      translation: { en: 'Month', po: '' },
      params: { top: '41.7%', left: '53.9%', font_size: '10', class_name: 'document-translation' }
    },

    noticeDay: {
      translation: { en: 'Day', po: '' },
      params: { top: '41.7%', left: '59.6%', font_size: '10', class_name: 'document-translation' }
    },

    noticeTo: {
      translation: { en: 'to', po: '' },
      params: { top: '41.7%', left: '64.6%', font_size: '10', class_name: 'document-translation' }
    },

    noticeYear1: {
      translation: { en: 'Year', po: '' },
      params: { top: '41.7%', left: '70.5%', font_size: '10', class_name: 'document-translation' }
    },

    noticeMonth1: {
      translation: { en: 'Month', po: '' },
      params: { top: '41.7%', left: '76%', font_size: '10', class_name: 'document-translation' }
    },

    noticeDay1: {
      translation: { en: 'Day', po: '' },
      params: { top: '41.7%', left: '81.7%', font_size: '10', class_name: 'document-translation' }
    },

    rentAndOthers: {
      translation: { en: 'Rent & Others', po: '' },
      params: { top: '45.8%', left: '25.7%', font_size: '10', class_name: 'document-translation' }
    },

    rentAndFees: {
      translation: { en: 'Rent・Fees', po: '' },
      params: { top: '48.8%', left: '19.4%', font_size: '10', class_name: 'document-translation' }
    },

    dueDates: {
      translation: { en: 'Payment Due', po: '' },
      params: { top: '48.8%', left: '41.6%', font_size: '10', class_name: 'document-translation' }
    },

    paymentMethod: {
      translation: { en: 'Payment Method', po: '' },
      params: { top: '48.8%', left: '68.6%', font_size: '10', class_name: 'document-translation' }
    },

    rent: {
      translation: { en: 'Rent', po: '' },
      params: { top: '52%', left: '15.5%', font_size: '10', class_name: 'document-translation' }
    },

    jpy: {
      translation: { en: 'JPY', po: '' },
      params: { top: '54.6%', left: '34.1%', font_size: '10', class_name: 'document-translation' }
    },

    rentDueDate: {
      translation: { en: 'Current Month Rent Due Date Each Month', po: '' },
      params: { top: '54%', left: '38.1%', font_size: '10', class_name: 'document-translation', width: '14%' }
    },

    Fees: {
      translation: { en: 'Fees', po: '' },
      params: { top: '58.5%', left: '8.4%', font_size: '10', class_name: 'document-translation', width: '14%' }
    },

    jpy1: {
      translation: { en: 'JPY', po: '' },
      params: { top: '77.6%', left: '34.1%', font_size: '10', class_name: 'document-translation' }
    },

    feesDueDate: {
      translation: { en: 'Current Month Fees Due Date Each Month', po: '' },
      params: { top: '69%', left: '38.1%', font_size: '10', class_name: 'document-translation', width: '14%' }
    },

    accountOrInPerson: {
      translation: { en: 'Bank Wire or In Person', po: '' },
      params: { top: '69%', left: '54%', font_size: '10', class_name: 'document-translation', width: '5%' }
    },

    bankName: {
      translation: { en: 'Bank Name', po: '' },
      params: { top: '53.7%', left: '60.4%', font_size: '10', class_name: 'document-translation' }
    },

    accountType: {
      translation: { en: 'Account Type: Ordinary・Current', po: '' },
      params: { top: '58.9%', left: '60.4%', font_size: '10', class_name: 'document-translation' }
    },

    accountNumber: {
      translation: { en: 'A/C No.', po: '' },
      params: { top: '62.2%', left: '60.4%', font_size: '10', class_name: 'document-translation' }
    },

    accountName: {
      translation: { en: 'Account Name', po: '' },
      params: { top: '67%', left: '60.4%', font_size: '10', class_name: 'document-translation' }
    },

    transferFeePaidBy: {
      translation: { en: 'Transfer Fee Paid By: Landlor・Tenant', po: '' },
      params: { top: '72.5%', left: '60.4%', font_size: '10', class_name: 'document-translation' }
    },

    paidInPerson: {
      translation: { en: 'Paid in Person', po: '' },
      params: { top: '76.5%', left: '60.4%', font_size: '10', class_name: 'document-translation' }
    },

    deposit: {
      translation: { en: 'Deposit', po: '' },
      params: { top: '80.8%', left: '14%', font_size: '10', class_name: 'document-translation' }
    },

    rentDepositX: {
      translation: { en: 'Rent x No. of Months', po: '' },
      params: { top: '80.8%', left: '22.3%', font_size: '10', class_name: 'document-translation' }
    },

    jpyDeposit: {
      translation: { en: 'JPY', po: '' },
      params: { top: '80.8%', left: '63.5%', font_size: '10', class_name: 'document-translation' }
    },

    facilityUsageFee: {
      translation: { en: 'Facility Ussage Fee', po: '' },
      params: { top: '83.7%', left: '14.8%', font_size: '10', class_name: 'document-translation' }
    },

    others: {
      translation: { en: 'Others', po: '' },
      params: { top: '86.7%', left: '17%', font_size: '10', class_name: 'document-translation' }
    },
  },
  3: {},
  12: {}
};

export default FixedTermRentalContractBilingualTranslation;
