// Object for use with bank account input and edit in mypaage

const BankAccount = {
  account_name: {
    name: 'account_name',
    en: 'Account Name',
    jp: '口座名義人',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  account_name_english: {
    name: 'account_name_english',
    en: 'Account Name (English)',
    jp: '口座名義人(英語名)',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  bank_name: {
    name: 'bank_name',
    en: 'Bank Name',
    jp: '銀行名',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  bank_name_english: {
    name: 'bank_name_english',
    en: 'Bank Name (English)',
    jp: '銀行名（英語名)',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  account_number: {
    name: 'account_number',
    en: 'Account Number',
    jp: '口座番号',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  swift: {
    name: 'swift',
    en: 'SWIFT',
    jp: 'SWIFT',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  account_type: {
    name: 'account_type',
    en: 'Account Type',
    jp: '預金',
    component: 'FormChoices',
    type: 'string',
    choices: {
      // value needs to be lower case since there is a translation in app_languages.js
      0: { value: 'ordinary', en: 'Ordinary', jp: '普通', type: 'button', className: 'form-rectangle' },
      1: { value: 'current', en: 'Current', jp: '当座', type: 'button', className: 'form-rectangle' },
    }
  }
};

export default BankAccount;
