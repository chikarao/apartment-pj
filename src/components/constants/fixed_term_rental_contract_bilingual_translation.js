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
  2: {},
  3: {},
  12: {}
};

export default FixedTermRentalContractBilingualTranslation;
