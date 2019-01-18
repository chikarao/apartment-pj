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
  5: {
    damageCompensation: {
      translation: { en: 'Compensation for Damages or Breach of Contract', po: '' },
      params: { top: '8.2%', left: '11.7%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    guaranteeOfDeposits: {
      translation: { en: 'Summary of Guarantee of Any Returnable Deposits', po: '' },
      params: { top: '45.2%', left: '12.1%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    depositHeldInAccount: {
      translation: { en: 'Deposits held in a protective account?', po: '' },
      params: { top: '48%', left: '12.1%', font_size: '10', class_name: 'document-translation', font_weight: 'bold', width: '19%' }
    },

    yesProtective: {
      translation: { en: 'Yes', po: '' },
      params: { top: '48.7%', left: '49.8%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    noProtective: {
      translation: { en: 'No', po: '' },
      params: { top: '48.7%', left: '67.4%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    financialInstitution: {
      translation: { en: 'Financial Institution to Hold Protective Account', po: '' },
      params: { top: '52.3%', left: '12.1%', font_size: '10', class_name: 'document-translation', font_weight: 'bold', width: '19%' }
    },

    contractPeriodAndRenewal: {
      translation: { en: 'Contract Period and Renewal', po: '' },
      params: { top: '58.2%', left: '12.1%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    contractPeriod: {
      translation: { en: 'Contract Period', po: '' },
      params: { top: '62.2%', left: '11.2%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    start: {
      translation: { en: 'Start', po: '' },
      params: { top: '62.2%', left: '28.2%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    yearStart: {
      translation: { en: 'Year', po: '' },
      params: { top: '62.2%', left: '38.2%', font_size: '10', class_name: 'document-translation' }
    },

    monthStart: {
      translation: { en: 'Month', po: '' },
      params: { top: '62.2%', left: '43.7%', font_size: '10', class_name: 'document-translation' }
    },

    dayStart: {
      translation: { en: 'Day', po: '' },
      params: { top: '62.2%', left: '49%', font_size: '10', class_name: 'document-translation' }
    },

    end: {
      translation: { en: 'End', po: '' },
      params: { top: '66%', left: '28.2%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    yearEnd: {
      translation: { en: 'Year', po: '' },
      params: { top: '66%', left: '38.2%', font_size: '10', class_name: 'document-translation' }
    },

    monthEnd: {
      translation: { en: 'Month', po: '' },
      params: { top: '66%', left: '43.7%', font_size: '10', class_name: 'document-translation' }
    },

    dayEnd: {
      translation: { en: 'Day', po: '' },
      params: { top: '66%', left: '49%', font_size: '10', class_name: 'document-translation' }
    },

    years: {
      translation: { en: 'Year(s)', po: '' },
      params: { top: '62.2%', left: '61%', font_size: '10', class_name: 'document-translation' }
    },

    months: {
      translation: { en: 'Month(s)', po: '' },
      params: { top: '62.2%', left: '67.8%', font_size: '10', class_name: 'document-translation' }
    },

    ordinaryRentalContract: {
      translation: { en: 'Ordinary Rental Contract', po: '' },
      params: { top: '61.4%', left: '75.8%', font_size: '10', class_name: 'document-translation' }
    },

    fixedTermRentalContract: {
      translation: { en: 'Fixed Term Rental Contract', po: '' },
      params: { top: '64.6%', left: '74.2%', font_size: '10', class_name: 'document-translation' }
    },

    endOfLifeRentalContract: {
      translation: { en: 'End of Life Rental Contract', po: '' },
      params: { top: '67.6%', left: '74.6%', font_size: '10', class_name: 'document-translation' }
    },

    termsOfRenewal: {
      translation: { en: 'Terms of Renewal', po: '' },
      params: { top: '72.5%', left: '10.2%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    // contractRenewal: {
    //   translation: { en: 'Contract Renewal', po: '' },
    //   params: { top: '71.5%', left: '10.2%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    // },

  },
  6: {
    limitationsOnUseAndOthers: {
      translation: { en: 'Limitations on Use and Others', po: '' },
      params: { top: '6.8%', left: '11.9%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    limitationsOnUse: {
      translation: { en: 'Limitations on Use', po: '' },
      params: { top: '20.1%', left: '12.7%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    limitationsForMultiFamily: {
      translation: { en: 'Limits to Exclusive Areas in Building Under Multiple Ownership', po: '' },
      params: { top: '13.1%', left: '29.4%', font_size: '10', class_name: 'document-translation', font_weight: 'bold', width: '28%' }
    },

    others: {
      translation: { en: 'Others', po: '' },
      params: { top: '13.1%', left: '73.2%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    limitationsOnOtherUses: {
      translation: { en: 'Limitations on Other Uses', po: '' },
      params: { top: '26.8%', left: '12.6%', font_size: '10', class_name: 'document-translation', font_weight: 'bold', width: '13%' }
    },

    returnSecurityDeposit: {
      translation: { en: 'Return of Security Deposit', po: '' },
      params: { top: '38.8%', left: '12.6%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    propertyManagement: {
      translation: { en: 'Property Management', po: '' },
      params: { top: '69.8%', left: '12%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    nameAgent: {
      translation: { en: 'Name of Agent', po: '' },
      params: { top: '73.5%', left: '10%', font_size: '10', class_name: 'document-translation' }
    },

    rules: {
      translation: { en: '(Registration No. under Article 46, Paragraph 1, Subparagraph 2 of the Act on Advancement of Proper Condominium Management or registration no. under Article  5,  Paragraph 1, Subparagraph 2 of the Rental Residential Property Manager Registration Regulations)', po: '' },
      params: { top: '80.3%', left: '10.3%', font_size: '10', class_name: 'document-translation', width: '24%' }
    },

    addressAgent: {
      translation: { en: 'Address', po: '' },
      params: { top: '95%', left: '10.7%', font_size: '10', class_name: 'document-translation' }
    },
  },
  7: {
    otherItems: {
      translation: { en: 'Other Items', po: '' },
      params: { top: '9.5%', left: '11.4%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    detailsOfBond: {
      translation: { en: 'Details of Bond (under Article 35-2 of the Real Estate Act)', po: '' },
      params: { top: '15.9%', left: '11.9%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    ifNotMember: {
      translation: { en: 'If Not a Member of the Real Estate Transaction Guarantee Association', po: '' },
      params: { top: '19.9%', left: '13.6%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    bondOfficeAddress: {
      translation: { en: 'Office Address and Name Where Bond is Deposited', po: '' },
      params: { top: '28.9%', left: '11.6%', font_size: '10', class_name: 'document-translation', width: '19%' }
    },

    ifMember: {
      translation: { en: 'If a Member of the Real Estate Transaction Guarantee Association', po: '' },
      params: { top: '36.9%', left: '13.6%', font_size: '10', class_name: 'document-translation', font_weight: 'bold' }
    },

    Association: {
      translation: { en: 'Real Estate Transaction Guarantee Association', po: '' },
      params: { top: '44.9%', left: '11%', font_size: '10', class_name: 'document-translation', width: '10%' }
    },

    name: {
      translation: { en: 'Name', po: '' },
      params: { top: '41.5%', left: '23%', font_size: '10', class_name: 'document-translation' }
    },

    address: {
      translation: { en: 'Address', po: '' },
      params: { top: '47.3%', left: '23%', font_size: '10', class_name: 'document-translation' }
    },

    officeLocation: {
      translation: { en: 'Office Location', po: '' },
      params: { top: '52.5%', left: '20.5%', font_size: '10', class_name: 'document-translation' }
    },

    bondOfficeAddress1: {
      translation: { en: 'Office Address and Name Where Bond is Deposited', po: '' },
      params: { top: '60%', left: '11.6%', font_size: '10', class_name: 'document-translation', width: '19%' }
    },
  },
  8: {
    documentTitle: {
      translation: { en: 'Summary of Results of Inspection of Building Conditions (For Use in Explanation of Important Matters)', po: '' },
      params: { top: '7.5%', left: '16.3%', font_size: '12', class_name: 'document-translation', font_weight: 'bold' }
    },

    documentSubTitle: {
      translation: { en: '[Wooden / Steel Frame Construction]', po: '' },
      params: { top: '9%', left: '16.3%', font_size: '12', class_name: 'document-translation', font_weight: 'bold' }
    },

    datePrepared: {
      translation: { en: 'Date Prepared', po: '' },
      params: { top: '12.5%', left: '65.6%', font_size: '10', class_name: 'document-translation' }
    },

    building: {
      translation: { en: 'Building', po: '' },
      params: { top: '28.9%', left: '9.5%', font_size: '10', class_name: 'document-translation', rotate: '90' }
    },

    address: {
      translation: { en: 'Address', po: '' },
      params: { top: '16.5%', left: '16.6%', font_size: '10', class_name: 'document-translation' }
    },

    buildingName: {
      translation: { en: 'Building Name', po: '' },
      params: { top: '21.7%', left: '16.6%', font_size: '10', class_name: 'document-translation' }
    },

    residenceAddress: {
      translation: { en: 'Residence Address', po: '' },
      params: { top: '20%', left: '80%', font_size: '10', class_name: 'document-translation' }
    },

    siteAddress: {
      translation: { en: 'Site Address', po: '' },
      params: { top: '22.7%', left: '80%', font_size: '10', class_name: 'document-translation' }
    },

    inCaseOfMultiFamily: {
      translation: { en: 'In Case Of Multi-family Building', po: '' },
      params: { top: '26%', left: '16.6%', font_size: '10', class_name: 'document-translation', width: '15%' }
    },

    nameOfBuilding: {
      translation: { en: 'Name of Building', po: '' },
      params: { top: '27.1%', left: '32.5%', font_size: '10', class_name: 'document-translation' }
    },

    unitNumber: {
      translation: { en: 'Unit Number', po: '' },
      params: { top: '26.5%', left: '70%', font_size: '10', class_name: 'document-translation' }
    },

    construction: {
      translation: { en: 'Construction', po: '' },
      params: { top: '30.5%', left: '16.6%', font_size: '10', class_name: 'document-translation' }
    },

    wooden: {
      translation: { en: 'Wooden', po: '' },
      params: { top: '30.5%', left: '36.5%', font_size: '10', class_name: 'document-translation' }
    },

    steelFrame: {
      translation: { en: 'Steel Frame', po: '' },
      params: { top: '30.5%', left: '46.9%', font_size: '10', class_name: 'document-translation' }
    },

    others: {
      translation: { en: 'Others', po: '' },
      params: { top: '30.5%', left: '60.1%', font_size: '10', class_name: 'document-translation' }
    },

    floors: {
      translation: { en: 'Floors', po: '' },
      params: { top: '34.1%', left: '16.6%', font_size: '10', class_name: 'document-translation' }
    },

    aboveGround: {
      translation: { en: 'Above Ground', po: '' },
      params: { top: '34.1%', left: '32.5%', font_size: '10', class_name: 'document-translation' }
    },

    floorsAboveGround: {
      translation: { en: 'Floors', po: '' },
      params: { top: '34.1%', left: '42%', font_size: '10', class_name: 'document-translation' }
    },

    underGround: {
      translation: { en: 'Basement', po: '' },
      params: { top: '34.1%', left: '46.4%', font_size: '10', class_name: 'document-translation' }
    },

    floorsUnderground: {
      translation: { en: 'Floors', po: '' },
      params: { top: '34.1%', left: '55%', font_size: '10', class_name: 'document-translation' }
    },

    floorArea: {
      translation: { en: 'Floor Area', po: '' },
      params: { top: '34.1%', left: '61.2%', font_size: '10', class_name: 'document-translation' }
    },

    buildingInpsection: {
      translation: { en: 'Building Inspection', po: '' },
      params: { top: '56.3%', left: '6.1%', font_size: '10', class_name: 'document-translation', rotate: '90' }
    },

    inspectionDate: {
      translation: { en: 'Inspection Date', po: '' },
      params: { top: '37.7%', left: '15.6%', font_size: '10', class_name: 'document-translation' }
    },

    inspectionCategory: {
      translation: { en: 'Inspection Category', po: '' },
      params: { top: '43.4%', left: '18.2%', font_size: '10', class_name: 'document-translation' }
    },

    singleFamily: {
      translation: { en: 'Single Family', po: '' },
      params: { top: '41%', left: '36.6%', font_size: '10', class_name: 'document-translation' }
    },

    multiFamily: {
      translation: { en: 'Multi Family', po: '' },
      params: { top: '44.2%', left: '36.6%', font_size: '10', class_name: 'document-translation' }
    },

    detachedType: {
      translation: { en: 'Detached Type', po: '' },
      params: { top: '44.2%', left: '57.9%', font_size: '10', class_name: 'document-translation' }
    },

    buildingType: {
      translation: { en: 'Building Type', po: '' },
      params: { top: '44.2%', left: '73.2%', font_size: '10', class_name: 'document-translation' }
    },

    presenceOfDegradation: {
      translation: { en: 'Presence of Degradation', po: '' },
      params: { top: '49.9%', left: '15.9%', font_size: '10', class_name: 'document-translation' }
    },

    presenceOfAnyDegradation: {
      translation: { en: 'Presence of Any Degradation etc. of Individual Components', po: '' },
      params: { top: '74.9%', left: '15.9%', font_size: '10', class_name: 'document-translation', width: '17%' }
    },

    crossOutUnrelated: {
      translation: { en: 'Note: Cross out any components not present in the subject building with two lines.', po: '' },
      params: { top: '80.7%', left: '15.9%', font_size: '10', class_name: 'document-translation', width: '17%' }
    },

    anyDegradation: {
      translation: { en: 'Any degradation etc. based on standards for inspection of building conditions?', po: '' },
      params: { top: '49%', left: '34%', font_size: '10', class_name: 'document-translation', width: '38%' }
    },

    yes: {
      translation: { en: 'Yes', po: '' },
      params: { top: '49%', left: '81.5%', font_size: '10', class_name: 'document-translation' }
    },

    no: {
      translation: { en: 'No', po: '' },
      params: { top: '49%', left: '88.9%', font_size: '10', class_name: 'document-translation' }
    },

    componentsStructuralResilience: {
      translation: { en: 'Inspected Components Related to Key Structures for Structural Resilience', po: '' },
      params: { top: '53.5%', left: '33%', font_size: '10', class_name: 'document-translation', width: '30%' }
    },

    componentsRainWater: {
      translation: { en: 'Inspected Components Related to Structures for Keeping Out Rainwater , etc.', po: '' },
      params: { top: '53.5%', left: '64%', font_size: '10', class_name: 'document-translation', width: '28%' }
    },

    degradationStructural: {
      translation: { en: 'Degradation', po: '' },
      params: { top: '57.7%', left: '49%', font_size: '10', class_name: 'document-translation' }
    },

    degradationRain: {
      translation: { en: 'Degradation', po: '' },
      params: { top: '57.7%', left: '77.5%', font_size: '10', class_name: 'document-translation' }
    },

    yesStructural: {
      translation: { en: 'Yes', po: '' },
      params: { top: '60%', left: '49%', font_size: '10', class_name: 'document-translation' }
    },

    noStructural: {
      translation: { en: 'No', po: '' },
      params: { top: '60%', left: '52.5%', font_size: '10', class_name: 'document-translation' }
    },

    uninspectableStructural: {
      translation: { en: 'Uninspectable', po: '' },
      params: { top: '60%', left: '54.7%', font_size: '10', class_name: 'document-translation' }
    },

    yesRain: {
      translation: { en: 'Yes', po: '' },
      params: { top: '60.3%', left: '77.5%', font_size: '10', class_name: 'document-translation' }
    },

    noRain: {
      translation: { en: 'No', po: '' },
      params: { top: '60.3%', left: '80.9%', font_size: '10', class_name: 'document-translation' }
    },

    uninspectableRain: {
      translation: { en: 'Uninspectable', po: '' },
      params: { top: '60.3%', left: '83.1%', font_size: '10', class_name: 'document-translation' }
    },

    foundation: {
      translation: { en: 'Foundation', po: '' },
      params: { top: '62.5%', left: '33.3%', font_size: '10', class_name: 'document-translation' }
    },

    baseAndFloorAssemble: {
      translation: { en: 'Base & Floor Assemble', po: '' },
      params: { top: '64.8%', left: '33.3%', font_size: '10', class_name: 'document-translation' }
    },

    floor: {
      translation: { en: 'floor', po: '' },
      params: { top: '67.1%', left: '33.3%', font_size: '10', class_name: 'document-translation' }
    },

    pillarsAndBeams: {
      translation: { en: 'Pillars & Eaves', po: '' },
      params: { top: '70%', left: '33.3%', font_size: '10', class_name: 'document-translation' }
    },

    exteriorWallsAndEaves: {
      translation: { en: 'Exterior Walls & Eaves', po: '' },
      params: { top: '72.5%', left: '33.3%', font_size: '10', class_name: 'document-translation' }
    },

    balcony: {
      translation: { en: 'Balcony', po: '' },
      params: { top: '74.8%', left: '33.3%', font_size: '10', class_name: 'document-translation' }
    },

    interiorWalls: {
      translation: { en: 'Interior Walls', po: '' },
      params: { top: '77.5%', left: '33.3%', font_size: '10', class_name: 'document-translation' }
    },

    ceilings: {
      translation: { en: 'Ceilings', po: '' },
      params: { top: '80%', left: '33.3%', font_size: '10', class_name: 'document-translation' }
    },

    roofTruss: {
      translation: { en: 'Roof Truss', po: '' },
      params: { top: '82.7%', left: '33.3%', font_size: '10', class_name: 'document-translation' }
    },

    othersStructural: {
      translation: { en: 'Others', po: '' },
      params: { top: '84.2%', left: '38.3%', font_size: '10', class_name: 'document-translation' }
    },

    termiteDamage: {
      translation: { en: 'Termite Damage', po: '' },
      params: { top: '86.9%', left: '33.3%', font_size: '10', class_name: 'document-translation' }
    },

    rotCorrosion: {
      translation: { en: 'Rot Corrosion', po: '' },
      params: { top: '89.6%', left: '33.3%', font_size: '10', class_name: 'document-translation' }
    },

    reinforcementArrangements: {
      translation: { en: 'Reinforcement Arrangements', po: '' },
      params: { top: '92.5%', left: '33.3%', font_size: '10', class_name: 'document-translation' }
    },

    concreteCompression: {
      translation: { en: 'Concrete Compression Strength', po: '' },
      params: { top: '96.1%', left: '33.3%', font_size: '10', class_name: 'document-translation' }
    },

    exteriorWalls: {
      translation: { en: 'Exterior Walls', po: '' },
      params: { top: '63%', left: '65%', font_size: '10', class_name: 'document-translation' }
    },

    eaves: {
      translation: { en: 'Eaves', po: '' },
      params: { top: '65.3%', left: '65%', font_size: '10', class_name: 'document-translation' }
    },

    balconyRain: {
      translation: { en: 'Balcony', po: '' },
      params: { top: '68%', left: '65%', font_size: '10', class_name: 'document-translation' }
    },

    interiorWallsRain: {
      translation: { en: 'Interior Walls', po: '' },
      params: { top: '70.7%', left: '65%', font_size: '10', class_name: 'document-translation' }
    },

    ceilingsRain: {
      translation: { en: 'Ceilings', po: '' },
      params: { top: '73.4%', left: '65%', font_size: '10', class_name: 'document-translation' }
    },

    roofTrussRain: {
      translation: { en: 'Roof Truss', po: '' },
      params: { top: '76.2%', left: '65%', font_size: '10', class_name: 'document-translation' }
    },

    roofRain: {
      translation: { en: 'Roof', po: '' },
      params: { top: '79.2%', left: '65%', font_size: '10', class_name: 'document-translation' }
    },
  },
  9: {
    buildingInspector: {
      translation: { en: 'Building Inspector', po: '' },
      params: { top: '20.6%', left: '6.1%', font_size: '10', class_name: 'document-translation', rotate: '90' }
    },

    nameInspector: {
      translation: { en: 'Name of Inspector', po: '' },
      params: { top: '7%', left: '14%', font_size: '10', class_name: 'document-translation' }
    },

    certificateNumber: {
      translation: { en: 'Name of Agency Training Inspector and Completion Certificate No.', po: '' },
      params: { top: '13.4%', left: '14%', font_size: '10', class_name: 'document-translation', width: '20%' }
    },

    typeArchitectQualification: {
      translation: { en: 'Type of Architect Qualification', po: '' },
      params: { top: '19.4%', left: '14%', font_size: '10', class_name: 'document-translation' }
    },

    classI: {
      translation: { en: 'Class I', po: '' },
      params: { top: '19.4%', left: '36%', font_size: '10', class_name: 'document-translation' }
    },

    classIi: {
      translation: { en: 'Class II', po: '' },
      params: { top: '19.4%', left: '48%', font_size: '10', class_name: 'document-translation' }
    },

    woodenStructureClass: {
      translation: { en: 'Wooden Structure', po: '' },
      params: { top: '19.4%', left: '61%', font_size: '10', class_name: 'document-translation' }
    },

    architectRegistrationNumber: {
      translation: { en: 'Architect Registration No.', po: '' },
      params: { top: '25.4%', left: '14%', font_size: '10', class_name: 'document-translation' }
    },

    ministersRegistration: {
      translation: { en: 'Minister\'s Reg.', po: '' },
      params: { top: '26.2%', left: '53.7%', font_size: '10', class_name: 'document-translation' }
    },

    governorsRegistration: {
      translation: { en: 'Governor\'s Reg.', po: '' },
      params: { top: '22.4%', left: '53.7%', font_size: '10', class_name: 'document-translation' }
    },

    nameAffiliatedOffice: {
      translation: { en: 'Name of Affiliated Office', po: '' },
      params: { top: '29.4%', left: '14%', font_size: '10', class_name: 'document-translation' }
    },

    officeRegistrationNumber: {
      translation: { en: 'Architectural Office Reg. No.', po: '' },
      params: { top: '32.7%', left: '14%', font_size: '10', class_name: 'document-translation' }
    },

    governorsRegistrationOffice: {
      translation: { en: 'Governor\'s Reg.', po: '' },
      params: { top: '32.8%', left: '54.4%', font_size: '10', class_name: 'document-translation' }
    },
  },
  10: {
    documentTitle: {
      translation: { en: 'Summary of Results of Inspection of Building Conditions (For Use in Explanation of Important Matters)', po: '' },
      params: { top: '8%', left: '16.3%', font_size: '12', class_name: 'document-translation', font_weight: 'bold' }
    },

    documentSubTitle: {
      translation: { en: '[Reinforced Concrete and Others]', po: '' },
      params: { top: '9.5%', left: '16.3%', font_size: '12', class_name: 'document-translation', font_weight: 'bold' }
    },

    datePrepared: {
      translation: { en: 'Date Prepared', po: '' },
      params: { top: '13.8%', left: '65.2%', font_size: '10', class_name: 'document-translation' }
    },

    building: {
      translation: { en: 'Building', po: '' },
      params: { top: '30.8%', left: '8.5%', font_size: '10', class_name: 'document-translation', rotate: '90' }
    },

    address: {
      translation: { en: 'Address', po: '' },
      params: { top: '24%', left: '16%', font_size: '10', class_name: 'document-translation' }
    },

    buildingName: {
      translation: { en: 'Building Name', po: '' },
      params: { top: '18%', left: '16%', font_size: '10', class_name: 'document-translation' }
    },

    residenceAddress: {
      translation: { en: 'Residence Address', po: '' },
      params: { top: '21.8%', left: '79.4%', font_size: '10', class_name: 'document-translation' }
    },

    siteAddress: {
      translation: { en: 'Site Address', po: '' },
      params: { top: '25%', left: '79.4%', font_size: '10', class_name: 'document-translation' }
    },

    inCaseOfMultiFamily: {
      translation: { en: 'In Case Of Multi-family Building', po: '' },
      params: { top: '28.6%', left: '16%', font_size: '10', class_name: 'document-translation', width: '15%' }
    },

    nameOfBuilding: {
      translation: { en: 'Name of Building', po: '' },
      params: { top: '29.8%', left: '32.5%', font_size: '10', class_name: 'document-translation' }
    },

    unitNumber: {
      translation: { en: 'Unit Number', po: '' },
      params: { top: '29.2%', left: '69.4%', font_size: '10', class_name: 'document-translation' }
    },

    construction: {
      translation: { en: 'Construction', po: '' },
      params: { top: '33.4%', left: '16%', font_size: '10', class_name: 'document-translation' }
    },

    wooden: {
      translation: { en: 'Wooden', po: '' },
      params: { top: '33.4%', left: '33.6%', font_size: '10', class_name: 'document-translation' }
    },

    steelFrameRc: {
      translation: { en: 'Steel Frame Reinforced Concrete', po: '' },
      params: { top: '33.4%', left: '52.8%', font_size: '10', class_name: 'document-translation' }
    },

    others: {
      translation: { en: 'Others', po: '' },
      params: { top: '33.4%', left: '75.1%', font_size: '10', class_name: 'document-translation' }
    },

    floors: {
      translation: { en: 'Floors', po: '' },
      params: { top: '37.3%', left: '16%', font_size: '10', class_name: 'document-translation' }
    },

    aboveGround: {
      translation: { en: 'Above Ground', po: '' },
      params: { top: '37.3%', left: '32.5%', font_size: '10', class_name: 'document-translation' }
    },

    floorsAboveGround: {
      translation: { en: 'Floors', po: '' },
      params: { top: '37.3%', left: '42%', font_size: '10', class_name: 'document-translation' }
    },

    underGround: {
      translation: { en: 'Basement', po: '' },
      params: { top: '37.3%', left: '46.4%', font_size: '10', class_name: 'document-translation' }
    },

    floorsUnderground: {
      translation: { en: 'Floors', po: '' },
      params: { top: '37.3%', left: '54%', font_size: '10', class_name: 'document-translation' }
    },

    floorArea: {
      translation: { en: 'Floor Area', po: '' },
      params: { top: '37.3%', left: '61.2%', font_size: '10', class_name: 'document-translation' }
    },

    buildingInpsection: {
      translation: { en: 'Building Inspection', po: '' },
      params: { top: '69.3%', left: '5.5%', font_size: '10', class_name: 'document-translation', rotate: '90' }
    },

    inspectionDate: {
      translation: { en: 'Inspection Date', po: '' },
      params: { top: '40.5%', left: '15.6%', font_size: '10', class_name: 'document-translation' }
    },

    inspectionCategory: {
      translation: { en: 'Inspection Category', po: '' },
      params: { top: '46.1%', left: '17.1%', font_size: '10', class_name: 'document-translation' }
    },

    singleFamily: {
      translation: { en: 'Single Family', po: '' },
      params: { top: '43.7%', left: '36%', font_size: '10', class_name: 'document-translation' }
    },

    multiFamily: {
      translation: { en: 'Multi Family', po: '' },
      params: { top: '47.4%', left: '36%', font_size: '10', class_name: 'document-translation' }
    },

    detachedType: {
      translation: { en: 'Detached Type', po: '' },
      params: { top: '47.4%', left: '57.3%', font_size: '10', class_name: 'document-translation' }
    },

    buildingType: {
      translation: { en: 'Building Type', po: '' },
      params: { top: '47.4%', left: '72.6%', font_size: '10', class_name: 'document-translation' }
    },

    presenceOfDegradation: {
      translation: { en: 'Presence of Degradation', po: '' },
      params: { top: '53.2%', left: '15%', font_size: '10', class_name: 'document-translation' }
    },

    presenceOfAnyDegradation: {
      translation: { en: 'Presence of Any Degradation etc. of Individual Components', po: '' },
      params: { top: '72.9%', left: '15.9%', font_size: '10', class_name: 'document-translation', width: '17%' }
    },

    // crossOutUnrelated: {
    //   translation: { en: 'Note: Cross out any components not present in the subject building with two lines.', po: '' },
    //   params: { top: '82.7%', left: '15.9%', font_size: '10', class_name: 'document-translation', width: '17%' }
    // },

    anyDegradation: {
      translation: { en: 'Any degradation etc. based on standards for inspection of building conditions?', po: '' },
      params: { top: '52.3%', left: '34%', font_size: '10', class_name: 'document-translation', width: '38%' }
    },

    yes: {
      translation: { en: 'Yes', po: '' },
      params: { top: '52.2%', left: '80.9%', font_size: '10', class_name: 'document-translation' }
    },

    no: {
      translation: { en: 'No', po: '' },
      params: { top: '52.2%', left: '88.3%', font_size: '10', class_name: 'document-translation' }
    },

    componentsStructuralResilience: {
      translation: { en: 'Inspected Components Related to Key Structures for Structural Resilience', po: '' },
      params: { top: '57%', left: '32.4%', font_size: '10', class_name: 'document-translation', width: '30%' }
    },

    componentsRainWater: {
      translation: { en: 'Inspected Components Related to Structures for Keeping Out Rainwater , etc.', po: '' },
      params: { top: '57%', left: '63.4%', font_size: '10', class_name: 'document-translation', width: '28%' }
    },

    degradationStructural: {
      translation: { en: 'Degradation', po: '' },
      params: { top: '61%', left: '48.4%', font_size: '10', class_name: 'document-translation' }
    },

    degradationRain: {
      translation: { en: 'Degradation', po: '' },
      params: { top: '61%', left: '76.9%', font_size: '10', class_name: 'document-translation' }
    },

    yesStructural: {
      translation: { en: 'Yes', po: '' },
      params: { top: '63.7%', left: '48.2%', font_size: '10', class_name: 'document-translation' }
    },

    noStructural: {
      translation: { en: 'No', po: '' },
      params: { top: '63.7%', left: '51.7%', font_size: '10', class_name: 'document-translation' }
    },

    uninspectableStructural: {
      translation: { en: 'Uninspectable', po: '' },
      params: { top: '63.7%', left: '53.9%', font_size: '10', class_name: 'document-translation' }
    },

    yesRain: {
      translation: { en: 'Yes', po: '' },
      params: { top: '63.7%', left: '76.7%', font_size: '10', class_name: 'document-translation' }
    },

    noRain: {
      translation: { en: 'No', po: '' },
      params: { top: '63.7%', left: '80.1%', font_size: '10', class_name: 'document-translation' }
    },

    uninspectableRain: {
      translation: { en: 'Uninspectable', po: '' },
      params: { top: '63.7%', left: '82.3%', font_size: '10', class_name: 'document-translation' }
    },

    foundation: {
      translation: { en: 'Foundation', po: '' },
      params: { top: '66.2%', left: '32.9%', font_size: '10', class_name: 'document-translation' }
    },

    floor: {
      translation: { en: 'floor', po: '' },
      params: { top: '68.7%', left: '32.8%', font_size: '10', class_name: 'document-translation' }
    },

    pillarsAndBeams: {
      translation: { en: 'Pillars & Eaves', po: '' },
      params: { top: '71.2%', left: '32.8%', font_size: '10', class_name: 'document-translation' }
    },

    exteriorWallsAndEaves: {
      translation: { en: 'Exterior Walls & Eaves', po: '' },
      params: { top: '73.9%', left: '32.8%', font_size: '10', class_name: 'document-translation' }
    },

    balcony: {
      translation: { en: 'Balcony', po: '' },
      params: { top: '76.5%', left: '32.8%', font_size: '10', class_name: 'document-translation' }
    },

    halls: {
        translation: { en: 'Halls', po: '' },
        params: { top: '79%', left: '32.8%', font_size: '10', class_name: 'document-translation' }
      },

    interiorWalls: {
      translation: { en: 'Interior Walls', po: '' },
      params: { top: '81.5%', left: '32.8%', font_size: '10', class_name: 'document-translation' }
    },

    ceilings: {
      translation: { en: 'Ceilings', po: '' },
      params: { top: '84%', left: '32.8%', font_size: '10', class_name: 'document-translation' }
    },

    othersDegradation: {
      translation: { en: 'Others', po: '' },
      params: { top: '85.7%', left: '40%', font_size: '10', class_name: 'document-translation' }
    },

    reinforcement: {
      translation: { en: 'Reinforcement', po: '' },
      params: { top: '89.7%', left: '33.6%', font_size: '10', class_name: 'document-translation' }
    },

    concreteCompression: {
      translation: { en: 'Concrete Compression', po: '' },
      params: { top: '93.4%', left: '33.6%', font_size: '10', class_name: 'document-translation' }
    },

    exteriorWalls: {
      translation: { en: 'Exterior Walls', po: '' },
      params: { top: '66.2%', left: '64.2%', font_size: '10', class_name: 'document-translation' }
    },

    interiorWallsRain: {
      translation: { en: 'Interior Walls', po: '' },
      params: { top: '68.9%', left: '64.2%', font_size: '10', class_name: 'document-translation' }
    },

    ceilingsRain: {
      translation: { en: 'Ceilings', po: '' },
      params: { top: '71.6%', left: '64.2%', font_size: '10', class_name: 'document-translation' }
    },

    roofRain: {
      translation: { en: 'Roof', po: '' },
      params: { top: '74.5%', left: '64.2%', font_size: '10', class_name: 'document-translation' }
    },

  },
  11: {
    buildingInspector: {
      translation: { en: 'Building Inspector', po: '' },
      params: { top: '22.8%', left: '5.9%', font_size: '10', class_name: 'document-translation', rotate: '90' }
    },

    nameInspector: {
      translation: { en: 'Name of Inspector', po: '' },
      params: { top: '7.6%', left: '13.2%', font_size: '10', class_name: 'document-translation' }
    },

    certificateNumber: {
      translation: { en: 'Name of Agency Training Inspector and Completion Certificate No.', po: '' },
      params: { top: '14%', left: '13.2%', font_size: '10', class_name: 'document-translation', width: '20%' }
    },

    typeArchitectQualification: {
      translation: { en: 'Type of Architect Qualification', po: '' },
      params: { top: '21%', left: '12.9%', font_size: '10', class_name: 'document-translation' }
    },

    classI: {
      translation: { en: 'Class I', po: '' },
      params: { top: '20.4%', left: '35.2%', font_size: '10', class_name: 'document-translation' }
    },

    classIi: {
      translation: { en: 'Class II', po: '' },
      params: { top: '20.4%', left: '47.2%', font_size: '10', class_name: 'document-translation' }
    },

    woodenStructureClass: {
      translation: { en: 'Wooden Structure', po: '' },
      params: { top: '20.4%', left: '60.2%', font_size: '10', class_name: 'document-translation' }
    },

    architectRegistrationNumber: {
      translation: { en: 'Architect Registration No.', po: '' },
      params: { top: '26.7%', left: '13.2%', font_size: '10', class_name: 'document-translation' }
    },

    ministersRegistration: {
      translation: { en: 'Minister\'s Reg.', po: '' },
      params: { top: '24.7%', left: '52.9%', font_size: '10', class_name: 'document-translation' }
    },

    governorsRegistration: {
      translation: { en: 'Governor\'s Reg.', po: '' },
      params: { top: '28.2%', left: '52.9%', font_size: '10', class_name: 'document-translation' }
    },

    nameAffiliatedOffice: {
      translation: { en: 'Name of Affiliated Office', po: '' },
      params: { top: '31.7%', left: '13.2%', font_size: '10', class_name: 'document-translation' }
    },

    officeRegistrationNumber: {
      translation: { en: 'Architectural Office Reg. No.', po: '' },
      params: { top: '35.9%', left: '13.2%', font_size: '10', class_name: 'document-translation' }
    },

    governorsRegistrationOffice: {
      translation: { en: 'Governor\'s Reg.', po: '' },
      params: { top: '35.4%', left: '53.6%', font_size: '10', class_name: 'document-translation' }
    },
  },
};

export default ImportantPointsExplanationBilingualTranslation;
