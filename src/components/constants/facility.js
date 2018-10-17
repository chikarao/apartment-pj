// import React from 'react';

const Facility = {
  facility_type: {
    name: 'facility_type',
    en: 'Facility Type',
    jp: '種類',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'car_parking', en: 'Car Parking', jp: '駐車場', type: 'button', className: 'form-rectangle', documentFormMap1: 'parking_spaces', documentFormMap2: 'parking_space_number' },
      1: { value: 'bicycle_parking', en: 'Bicycle Parking', jp: '駐輪場', type: 'button', className: 'form-rectangle', documentFormMap1: 'bicycle_parking_spaces', documentFormMap2: 'bicycle_parking_space_number' },
      2: { value: 'motorcycle_parking', en: 'Motorcycle Parking', jp: 'バイク置場', type: 'button', className: 'form-rectangle', documentFormMap1: 'motorcycle_parking_spaces', documentFormMap2: 'motorcycle_parking_space_number' },
      3: { value: 'storage', en: 'Storage', jp: '物置', type: 'button', className: 'form-rectangle', documentFormMap1: 'storage_spaces', documentFormMap2: 'storage_space_number' },
      4: { value: 'dedicated_yard', en: 'Own Yard', jp: '専用庭', type: 'button', className: 'form-rectangle' },
      // 5: { value: 'other_facility_name', en: 'Enter other...', jp: 'その他...', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  optional: {
    name: 'optional',
    en: 'Optional?',
    jp: 'オプショナルですか？',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'true', en: 'Yes', jp: 'はい', type: 'button', className: 'form-rectangle' },
      1: { value: 'false', en: 'No', jp: 'いいえ', type: 'button', className: 'form-rectangle' },
    }
  },

  price_per_month: {
    name: 'price_per_month',
    en: 'Price per Month',
    jp: '料金(月)',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  facility_number: {
    name: 'facility_number',
    en: 'Facility ID',
    jp: '施設の番号',
    component: 'input',
    type: 'string',
    className: 'form-control'
  }
};

export default Facility;
