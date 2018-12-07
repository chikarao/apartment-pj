// import React from 'react';
// object for input of inspections in edit flat, in building section

const Contractor = {
  language_code: {
    name: 'language_code',
    en: 'Language',
    jp: '言語',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'en', en: '🇬🇧 English', jp: '🇬🇧 English', type: 'button', className: 'form-rectangle' },
      1: { value: 'jp', en: '🇯🇵 Japanese', jp: '🇯🇵 日本語', type: 'button', className: 'form-rectangle' },
      2: { value: 'po', en: '🇵🇹 Portuguese', jp: '🇵🇹 Português', type: 'button', className: 'form-rectangle' },
      // 2: { value: 'Wooden Structure', en: 'Wooden Structure', jp: '木造', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    },
    // for rendering when fields are language indepedent.
    // ie needs to inputted in new language in create contractor modal
    language_independent: true,
    // for rendering in forms only choices that do not exist
    limit_choices: true,
    // map to column in backend code
    map_to_record: 'language_code'

  },

  company_name: {
    name: 'company_name',
    en: 'Company Name',
    jp: '社名',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  contractor_type: {
    name: 'contractor_type',
    en: 'Contractor Type',
    jp: '業種',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'rental_broker', en: 'Rental Broker', jp: '賃貸の仲介業者', type: 'button', className: 'form-rectangle' },
      1: { value: 'house_cleaner', en: 'House Cleaner', jp: '清掃業者', type: 'button', className: 'form-rectangle' },
      // 2: { value: 'Wooden Structure', en: 'Wooden Structure', jp: '木造', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    },
    language_independent: true
  },

  registration_number: {
    name: 'registration_number',
    en: 'Registration Number',
    jp: '免許証番号',
    component: 'input',
    type: 'string',
    className: 'form-control',
    language_independent: true
  },

  registration_date: {
    name: 'registration_date',
    en: 'Registration Date',
    jp: '免許年月日',
    component: 'input',
    type: 'date',
    className: 'form-control',
    language_independent: true
  },

  first_name: {
    name: 'first_name',
    en: 'First Name (Rep)',
    jp: '名',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  last_name: {
    name: 'last_name',
    en: 'Last Name',
    jp: '姓名',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  address1: {
    name: 'address1',
    en: 'Street Address',
    jp: '町村番地',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },
  // address2: { en: 'Street Address2', jp: '' },
  city: {
    name: 'city',
    en: 'City',
    jp: '市区',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  state: {
    name: 'state',
    en: 'State',
    jp: '都道府県',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  zip: {
    name: 'zip',
    en: 'Zip',
    jp: '郵便番号',
    component: 'input',
    type: 'string',
    className: 'form-control',
    language_independent: true
  },

  country: {
    name: 'country',
    en: 'Country',
    jp: '国',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },
};

export default Contractor;
