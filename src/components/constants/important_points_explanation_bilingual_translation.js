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

const ImportantPointsExplanationBilingualTranslation = {
  1: {
    documentTitle: {
      translation: { en: 'Important Points Explanation of Property to be Leased', po: '' },
      params: { top: '7.5%', left: '29%', font_size: '12', class_name: 'document-translation', font_weight: 'bold' }
    },

    name: {
      translation: { en: 'Name', po: '' },
      params: { top: '11%', left: '9.5%', font_size: '10', class_name: 'document-translation' }
    },

    documentPurpose: {
      translation: { en: 'The following details on the property have been written in accordance with Article 35 of the Real Estate Act. Please ensure you completely understand all of these essential points.', po: '' },
      params: { top: '18.2%', left: '9.3%', font_size: '10', class_name: 'document-translation', width: '90%' }
    },

    year: {
      translation: { en: 'Year', po: '' },
      params: { top: '11.9%', left: '71.5%', font_size: '10', class_name: 'document-translation' }
    },

    month: {
      translation: { en: 'Month', po: '' },
      params: { top: '11.9%', left: '80.5%', font_size: '10', class_name: 'document-translation' }
    },

    day: {
      translation: { en: 'Day', po: '' },
      params: { top: '11.9%', left: '91.4%', font_size: '10', class_name: 'document-translation' }
    },

    companyName: {
      translation: { en: 'Company Name', po: '' },
      params: { top: '25.9%', left: '9.3%', font_size: '10', class_name: 'document-translation' }
    },

    nameOfRepresentative: {
      translation: { en: 'Representative', po: '' },
      params: { top: '30.7%', left: '9.3%', font_size: '10', class_name: 'document-translation' }
    },

    seal: {
      translation: { en: 'Seal', po: '' },
      params: { top: '30.7%', left: '88.3%', font_size: '10', class_name: 'document-translation' }
    },

    mainOffice: {
      translation: { en: 'Main Office', po: '' },
      params: { top: '35.6%', left: '9.3%', font_size: '10', class_name: 'document-translation' }
    },

    licensedNumber: {
      translation: { en: 'License Number', po: '' },
      params: { top: '39.3%', left: '9.3%', font_size: '10', class_name: 'document-translation' }
    },

    dateLicensed: {
      translation: { en: 'Date Licensed', po: '' },
      params: { top: '42.1%', left: '9.3%', font_size: '10', class_name: 'document-translation' }
    },

    designatedAgent: {
      translation: { en: 'Designated Agent for Transaction', po: '' },
      params: { top: '50.1%', left: '11%', font_size: '10', class_name: 'document-translation', width: '11%' }
    },

    nameAgent: {
      translation: { en: 'Name', po: '' },
      params: { top: '47%', left: '34.5%', font_size: '10', class_name: 'document-translation' }
    },

    sealAgent: {
      translation: { en: 'Seal', po: '' },
      params: { top: '47.5%', left: '89%', font_size: '10', class_name: 'document-translation' }
    },

    registrationNumberAgent: {
      translation: { en: 'Registration No.', po: '' },
      params: { top: '51.1%', left: '34.5%', font_size: '10', class_name: 'document-translation' }
    },

    officeAddress: {
      translation: { en: 'Office Address', po: '' },
      params: { top: '56.9%', left: '30.5%', font_size: '10', class_name: 'document-translation' }
    },

    phone: {
      translation: { en: 'Phone', po: '' },
      params: { top: '61.2%', left: '57.7%', font_size: '10', class_name: 'document-translation' }
    },

    transactionType: {
      translation: { en: 'Transaction Type (Section 1, Article 34)', po: '' },
      params: { top: '65.5%', left: '18%', font_size: '10', class_name: 'document-translation' }
    },

    representative: {
      translation: { en: 'Representative', po: '' },
      params: { top: '65.5%', left: '63%', font_size: '10', class_name: 'document-translation' }
    },

    agent: {
      translation: { en: 'Agent', po: '' },
      params: { top: '65.5%', left: '78.7%', font_size: '10', class_name: 'document-translation' }
    },

    building: {
      translation: { en: 'Building', po: '' },
      params: { top: '78.3%', left: '11%', font_size: '10', class_name: 'document-translation', rotate: '90' }
    },

    nameBuilding: {
      translation: { en: 'Name', po: '' },
      params: { top: '70.4%', left: '17.6%', font_size: '10', class_name: 'document-translation' }
    },

    addressBuilding: {
      translation: { en: 'Address', po: '' },
      params: { top: '75.2%', left: '17.6%', font_size: '10', class_name: 'document-translation' }
    },

    unit: {
      translation: { en: 'Unit No.', po: '' },
      params: { top: '78.5%', left: '17.6%', font_size: '10', class_name: 'document-translation' }
    },

    floorArea: {
      translation: { en: 'Floor Area', po: '' },
      params: { top: '81.5%', left: '17.6%', font_size: '10', class_name: 'document-translation' }
    },

    floorAreaOnRecord: {
      translation: { en: 'Floor Area on Record', po: '' },
      params: { top: '81.5%', left: '62.3%', font_size: '10', class_name: 'document-translation' }
    },

    construction: {
      translation: { en: 'Construction', po: '' },
      params: { top: '85.7%', left: '16.6%', font_size: '10', class_name: 'document-translation' }
    },

    landlordNameAddress: {
      translation: { en: 'Landlord Name & Address', po: '' },
      params: { top: '90.5%', left: '11.1%', font_size: '10', class_name: 'document-translation' }
    },

  },
  2: {
    itemsDirectlyRelated: {
      translation: { en: 'Items Directly Related to the Property', po: '' },
      params: { top: '10.5%', left: '12.1%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    itemsRecordedInRegistry: {
      translation: { en: 'Items Recorded in the Registry', po: '' },
      params: { top: '14.5%', left: '12.7%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    detailsOfOwnership: {
      translation: { en: 'Details of Ownership', po: '' },
      params: { top: '18.5%', left: '10.8%', font_size: '10', class_name: 'document-translation' }
    },

    landlord: {
      translation: { en: 'Landlord', po: '' },
      params: { top: '22.4%', left: '11.8%', font_size: '10', class_name: 'document-translation' }
    },

    itemsRightsOfOwnership: {
      translation: { en: 'Items Related to Rights of Ownership', po: '' },
      params: { top: '23.6%', left: '50.8%', font_size: '10', class_name: 'document-translation', width: '15%' }
    },

    itemsOtherThanRightsOfOwnership: {
      translation: { en: 'Items Related to Rights Other than Ownership (tenant)', po: '' },
      params: { top: '20.6%', left: '70.2%', font_size: '10', class_name: 'document-translation', width: '20%' }
    },

    owner: {
      translation: { en: 'Owner', po: '' },
      params: { top: '28.7%', left: '11.1%', font_size: '10', class_name: 'document-translation', width: '20%' }
    },

    name: {
      translation: { en: 'Name', po: '' },
      params: { top: '28.7%', left: '19%', font_size: '10', class_name: 'document-translation', width: '20%' }
    },

    address: {
      translation: { en: 'Address', po: '' },
      params: { top: '34.6%', left: '19.1%', font_size: '10', class_name: 'document-translation', width: '20%' }
    },

    mainLegal: {
      translation: { en: 'Main Legal Restrictions', po: '' },
      params: { top: '42%', left: '11.8%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    titleOfAct: {
      translation: { en: 'Title of Act', po: '' },
      params: { top: '45.2%', left: '11.1%', font_size: '10', class_name: 'document-translation', width: '20%' }
    },

    summaryOfRestrictions: {
      translation: { en: 'Summary of Restrictions', po: '' },
      params: { top: '52%', left: '11.1%', font_size: '10', class_name: 'document-translation', width: '20%' }
    },

    utilities: {
      translation: { en: 'Water, Electricity, Gas & Sewer Supply', po: '' },
      params: { top: '60.5%', left: '12%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    utilitiesAvailableImmediately: {
      translation: { en: 'Utilities Available Immediately', po: '' },
      params: { top: '64.4%', left: '13.5%', font_size: '10', class_name: 'document-translation' }
    },

    utilitiesAvailableFuture: {
      translation: { en: 'Utilities Available in Future', po: '' },
      params: { top: '64.4%', left: '45.5%', font_size: '10', class_name: 'document-translation' }
    },

    Notes: {
      translation: { en: 'Notes', po: '' },
      params: { top: '64.4%', left: '75.7%', font_size: '10', class_name: 'document-translation' }
    },

    water: {
      translation: { en: 'Water', po: '' },
      params: { top: '67.7%', left: '11%', font_size: '10', class_name: 'document-translation' }
    },

    publicWater: {
      translation: { en: 'Public', po: '' },
      params: { top: '67.7%', left: '19%', font_size: '10', class_name: 'document-translation' }
    },

    privateWater: {
      translation: { en: 'Private', po: '' },
      params: { top: '67.7%', left: '24.2%', font_size: '10', class_name: 'document-translation' }
    },

    wellWater: {
      translation: { en: 'Well', po: '' },
      params: { top: '67.7%', left: '29.5%', font_size: '10', class_name: 'document-translation' }
    },

    yearWater: {
      translation: { en: 'Year', po: '' },
      params: { top: '67.7%', left: '39.4%', font_size: '10', class_name: 'document-translation' }
    },

    monthWater: {
      translation: { en: 'Month', po: '' },
      params: { top: '67.7%', left: '44.5%', font_size: '10', class_name: 'document-translation' }
    },

    dayWater: {
      translation: { en: 'Day', po: '' },
      params: { top: '67.7%', left: '50%', font_size: '10', class_name: 'document-translation' }
    },

    publicWater1: {
      translation: { en: 'Public', po: '' },
      params: { top: '67.7%', left: '52.7%', font_size: '10', class_name: 'document-translation' }
    },

    privateWater1: {
      translation: { en: 'Private', po: '' },
      params: { top: '67.7%', left: '57.9%', font_size: '10', class_name: 'document-translation' }
    },

    wellWater1: {
      translation: { en: 'Well', po: '' },
      params: { top: '67.7%', left: '63.3%', font_size: '10', class_name: 'document-translation' }
    },

    electricity: {
      translation: { en: 'Electricity', po: '' },
      params: { top: '70.8%', left: '11%', font_size: '10', class_name: 'document-translation' }
    },

    yearElectricity: {
      translation: { en: 'Year', po: '' },
      params: { top: '70.8%', left: '39.4%', font_size: '10', class_name: 'document-translation' }
    },

    monthElectricity: {
      translation: { en: 'Month', po: '' },
      params: { top: '70.8%', left: '44.5%', font_size: '10', class_name: 'document-translation' }
    },

    dayElectricity: {
      translation: { en: 'Day', po: '' },
      params: { top: '70.8%', left: '50%', font_size: '10', class_name: 'document-translation' }
    },

    gas: {
      translation: { en: 'Gas', po: '' },
      params: { top: '73.9%', left: '11%', font_size: '10', class_name: 'document-translation' }
    },

    cityGas1: {
      translation: { en: 'City', po: '' },
      params: { top: '73.9%', left: '19.9%', font_size: '10', class_name: 'document-translation' }
    },

    propageGas1: {
      translation: { en: 'Propane', po: '' },
      params: { top: '73.9%', left: '25%', font_size: '10', class_name: 'document-translation' }
    },

    yearGas: {
      translation: { en: 'Year', po: '' },
      params: { top: '73.9%', left: '39.4%', font_size: '10', class_name: 'document-translation' }
    },

    monthGas: {
      translation: { en: 'Month', po: '' },
      params: { top: '73.9%', left: '44.5%', font_size: '10', class_name: 'document-translation' }
    },

    dayGas: {
      translation: { en: 'Day', po: '' },
      params: { top: '73.9%', left: '50%', font_size: '10', class_name: 'document-translation' }
    },

    cityGas: {
      translation: { en: 'City', po: '' },
      params: { top: '73.9%', left: '52.7%', font_size: '10', class_name: 'document-translation' }
    },

    propageGas: {
      translation: { en: 'Propane', po: '' },
      params: { top: '73.9%', left: '57.7%', font_size: '10', class_name: 'document-translation' }
    },

    sewage: {
      translation: { en: 'Sewage', po: '' },
      params: { top: '77%', left: '11%', font_size: '10', class_name: 'document-translation' }
    },

    yearSewage: {
      translation: { en: 'Year', po: '' },
      params: { top: '77%', left: '39.4%', font_size: '10', class_name: 'document-translation' }
    },

    monthSewage: {
      translation: { en: 'Month', po: '' },
      params: { top: '77%', left: '44.5%', font_size: '10', class_name: 'document-translation' }
    },

    daySewage: {
      translation: { en: 'Day', po: '' },
      params: { top: '77%', left: '50%', font_size: '10', class_name: 'document-translation' }
    },

    inspectionSummaryHeading: {
      translation: { en: ' Summary of Results of Inspection of Building Conditions (for existing building)', po: '' },
      params: { top: '81.6%', left: '12%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    inspectionConducted: {
      translation: { en: 'Building Inspection Conducted', po: '' },
      params: { top: '84.9%', left: '10.1%', font_size: '10', class_name: 'document-translation' }
    },

    yes: {
      translation: { en: 'Yes', po: '' },
      params: { top: '84.9%', left: '60.4%', font_size: '10', class_name: 'document-translation' }
    },

    no: {
      translation: { en: 'No', po: '' },
      params: { top: '84.9%', left: '81.4%', font_size: '10', class_name: 'document-translation' }
    },

    inspectionSummary: {
      translation: { en: 'Summary of Results of Inspection of Building Conditions', po: '' },
      params: { top: '92%', left: '10.1%', font_size: '10', class_name: 'document-translation' }
    },
  },
  3: {
    itemsRecordedInRegistry: {
      translation: { en: 'State of Repair of Facilities (in case of completed building)', po: '' },
      params: { top: '11.4%', left: '11.9%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    facility: {
      translation: { en: 'Facility', po: '' },
      params: { top: '14.4%', left: '14.6%', font_size: '10', class_name: 'document-translation' }
    },

    available: {
      translation: { en: 'Available', po: '' },
      params: { top: '14.4%', left: '32.6%', font_size: '10', class_name: 'document-translation' }
    },

    format: {
      translation: { en: 'Format', po: '' },
      params: { top: '14.4%', left: '43.8%', font_size: '10', class_name: 'document-translation' }
    },

    other: {
      translation: { en: 'Other', po: '' },
      params: { top: '14.4%', left: '69.5%', font_size: '10', class_name: 'document-translation' }
    },

    kitchen: {
      translation: { en: 'Kitchen', po: '' },
      params: { top: '17.5%', left: '10.2%', font_size: '10', class_name: 'document-translation' }
    },

    toilet: {
      translation: { en: 'Kitchen', po: '' },
      params: { top: '20.5%', left: '10.2%', font_size: '10', class_name: 'document-translation' }
    },

    bathtub: {
      translation: { en: 'Bath Tub', po: '' },
      params: { top: '23.5%', left: '10.2%', font_size: '10', class_name: 'document-translation' }
    },

    waterHeater: {
      translation: { en: 'Water Heater', po: '' },
      params: { top: '26.5%', left: '10.2%', font_size: '10', class_name: 'document-translation' }
    },

    kitchenStove: {
      translation: { en: 'Kitchen Stove', po: '' },
      params: { top: '29.5%', left: '10.2%', font_size: '10', class_name: 'document-translation' }
    },

    ac: {
      translation: { en: 'A/C', po: '' },
      params: { top: '32.5%', left: '10.2%', font_size: '10', class_name: 'document-translation' }
    },

    inDisasterPrevention: {
      translation: { en: 'Is the property within a developed residential land disaster prevention zone?', po: '' },
      params: { top: '43%', left: '11.9%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    insideDisasterPrevention: {
      translation: { en: 'Inside residential disaster prevention zone', po: '' },
      params: { top: '46.5%', left: '22.9%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    outsideDisasterPrevention: {
      translation: { en: 'Outside residential disaster prevention zone', po: '' },
      params: { top: '46.5%', left: '64.9%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    inLandslideWarning: {
      translation: { en: 'Is the property within a landslide disaster warning zone?', po: '' },
      params: { top: '51.6%', left: '11%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    insideLandslideWarning: {
      translation: { en: 'Inside a landslide disaster warning zone', po: '' },
      params: { top: '55.5%', left: '22.9%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    outsideLandslideWarning: {
      translation: { en: 'Outside a landslide disaster warning zone', po: '' },
      params: { top: '55.5%', left: '65%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    inTsunamiWarning: {
      translation: { en: 'Is the building inside a tsunami warning zone?', po: '' },
      params: { top: '62.6%', left: '11.7%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    insideTsunamiWarning: {
      translation: { en: 'Inside tsunami warning zone', po: '' },
      params: { top: '66.1%', left: '22.9%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    outsideTsunamiWarning: {
      translation: { en: 'Outside tsunami warning zone', po: '' },
      params: { top: '66.1%', left: '65%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    asbestos: {
      translation: { en: 'Description of Asbestos Usage Survey', po: '' },
      params: { top: '72%', left: '11.7%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    asbestosRecordsOnRecord: {
      translation: { en: 'Are asbestos usage survey results on record?', po: '' },
      params: { top: '76%', left: '10.5%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    yesAsbestos: {
      translation: { en: 'Yes', po: '' },
      params: { top: '76%', left: '60.3%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    noAsbestos: {
      translation: { en: 'No', po: '' },
      params: { top: '76%', left: '81.2%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    asbestosSurveyContents: {
      translation: { en: 'Contents of Asbestos Usage Survey', po: '' },
      params: { top: '83%', left: '10.5%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    earthquakeResistanceStudy: {
      translation: { en: 'Description of Earthquake Resistance Study', po: '' },
      params: { top: '10%', left: '11.7%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },


  },
  4: {
    earthquakeStudy: {
      translation: { en: 'Description of Earthquake Resistance Study', po: '' },
      params: { top: '12.3%', left: '11.7%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    earthQuakeStudyPerformed: {
      translation: { en: 'Has an earthquake resistance study been performed?', po: '' },
      params: { top: '16.5%', left: '10.2%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    yesearthquake: {
      translation: { en: 'Yes', po: '' },
      params: { top: '16.5%', left: '60.3%', font_size: '10', class_name: 'document-translation' }
    },

    noearthquake: {
      translation: { en: 'No', po: '' },
      params: { top: '16.5%', left: '81.2%', font_size: '10', class_name: 'document-translation' }
    },

    earthquakeStudyContents: {
      translation: { en: 'Contents of Earthquake Resistance Study', po: '' },
      params: { top: '24%', left: '10.5%', font_size: '10', class_name: 'document-translation' }
    },

    transactionConditions: {
      translation: { en: 'Items Regarding Transaction Conditions', po: '' },
      params: { top: '34.9%', left: '11.4%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    nonRentCharges: {
      translation: { en: 'Non-rent related charges', po: '' },
      params: { top: '40.4%', left: '11.6%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    amount: {
      translation: { en: 'Amount', po: '' },
      params: { top: '43.9%', left: '17.8%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    purpose: {
      translation: { en: 'Pupose of Charge', po: '' },
      params: { top: '43.9%', left: '47.3%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    cancellation: {
      translation: { en: 'Cancellation of Contract', po: '' },
      params: { top: '57.8%', left: '11.9%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },
  },
  5: {},
  6: {},
  7: {},
  8: {},
  9: {},
  10: {},
  11: {},
};

export default ImportantPointsExplanationBilingualTranslation;
