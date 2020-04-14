// import React from 'react';
// object for input of inspections in edit flat, in building section
// import Documents from './documents';

const DocumentInsert = {
  insert_name: {
    name: 'insert_name',
    en: 'Document Name',
    jp: 'ドキュメント名',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  language_code_1: {
    name: 'language_code_1',
    en: 'Base Language',
    jp: 'ベースの言語',
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

  // main_agreement: {
  //   name: 'main_agreement',
  //   en: 'Main Agreement?',
  //   jp: '契約書本文ですか？',
  //   component: 'FormChoices',
  //   type: 'string',
  //   choices: {
  //     0: { value: 'true', en: 'Yes', jp: 'はい', type: 'button', className: 'form-rectangle' },
  //     1: { value: 'false', en: 'No', jp: 'いいえ', type: 'button', className: 'form-rectangle' },
  //   }
  // },

  // contractor_type: {
  //   name: 'contractor_type',
  //   en: 'DocumentInsert Type',
  //   jp: '業種',
  //   component: 'FormChoices',
  //   type: 'string',
  //   choices: {
  //     0: { value: 'rental_broker', en: 'Rental Broker', jp: '賃貸の仲介業者', type: 'button', className: 'form-rectangle' },
  //     1: { value: 'house_cleaner', en: 'House Cleaner', jp: '清掃業者', type: 'button', className: 'form-rectangle' },
  //     2: { value: 'management', en: 'Property Manager', jp: '管理業者', type: 'button', className: 'form-rectangle' },
  //     3: { value: 'guarantor', en: 'Rent Guarantor', jp: '賃貸保証会社', type: 'button', className: 'form-rectangle' },
  //     // 2: { value: 'Wooden Structure', en: 'Wooden Structure', jp: '木造', type: 'button', className: 'form-rectangle' },
  //     // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
  //   },
  //   language_independent: true
  // },
  //
  // registration_number: {
  //   name: 'registration_number',
  //   en: 'Registration Number',
  //   jp: '免許証番号',
  //   component: 'input',
  //   type: 'string',
  //   className: 'form-control',
  //   language_independent: true
  // },
  //
  // registration_jurisdiction: {
  //   name: 'registration_jurisdiction',
  //   en: 'Registration Prefecture',
  //   jp: '登録都道府県',
  //   component: 'input',
  //   type: 'string',
  //   className: 'form-control',
  //   language_independent: true,
  // },
  //
  // registration_number_front: {
  //   name: 'registration_number_front',
  //   en: 'Front Registration Number',
  //   jp: '免許証番号()内番号',
  //   component: 'input',
  //   type: 'string',
  //   className: 'form-control',
  //   language_independent: true,
  // },
  //
  // registration_grantor: {
  //   name: 'registration_grantor',
  //   en: 'Governor or Minister Reg.',
  //   jp: '登録（知事・国土交通大臣)',
  //   component: 'FormChoices',
  //   type: 'string',
  //   choices: {
  //     0: { value: 'governor', en: 'Governor', jp: '知事', type: 'button', className: 'form-rectangle' },
  //     1: { value: 'minister', en: 'Minister', jp: '国土交通大臣', type: 'button', className: 'form-rectangle' },
  //     // 2: { value: 'Wooden Structure', en: 'Wooden Structure', jp: '木造', type: 'button', className: 'form-rectangle' },
  //     // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
  //   },
  //   language_independent: true
  // },
  //
  // registration_date: {
  //   name: 'registration_date',
  //   en: 'Registration Date',
  //   jp: '免許年月日',
  //   component: 'input',
  //   type: 'date',
  //   className: 'form-control',
  //   language_independent: true
  // },
  //
  // phone: {
  //   name: 'phone',
  //   en: 'Phone',
  //   jp: '電話番号',
  //   component: 'input',
  //   type: 'string',
  //   className: 'form-control',
  //   language_independent: true
  // },
  //
  // first_name: {
  //   name: 'first_name',
  //   en: 'First Name (Rep)',
  //   jp: '名',
  //   component: 'input',
  //   type: 'string',
  //   className: 'form-control'
  // },
  //
  // last_name: {
  //   name: 'last_name',
  //   en: 'Last Name',
  //   jp: '姓名',
  //   component: 'input',
  //   type: 'string',
  //   className: 'form-control'
  // },
  //
  // address1: {
  //   name: 'address1',
  //   en: 'Street Address',
  //   jp: '町村番地',
  //   component: 'input',
  //   type: 'string',
  //   className: 'form-control'
  // },
  // // address2: { en: 'Street Address2', jp: '' },
  // city: {
  //   name: 'city',
  //   en: 'City',
  //   jp: '市区',
  //   component: 'input',
  //   type: 'string',
  //   className: 'form-control'
  // },
  //
  // state: {
  //   name: 'state',
  //   en: 'State',
  //   jp: '都道府県',
  //   component: 'input',
  //   type: 'string',
  //   className: 'form-control'
  // },
  //
  // zip: {
  //   name: 'zip',
  //   en: 'Zip',
  //   jp: '郵便番号',
  //   component: 'input',
  //   type: 'string',
  //   className: 'form-control',
  //   language_independent: true
  // },
  //
  // country: {
  //   name: 'country',
  //   en: 'Country',
  //   jp: '国',
  //   component: 'input',
  //   type: 'string',
  //   className: 'form-control'
  // },
};

export default DocumentInsert;
