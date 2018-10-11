// import React from 'react';

const BankAccount = {
  account_name: {
    name: 'account_name',
    en: 'Account Name',
    jp: '口座名義人',
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

  account_number: {
    name: 'account_number',
    en: 'Account Number',
    jp: '口座番号',
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
      0: { value: 'Ordinary', en: 'Ordinary', jp: '普通', type: 'button', className: 'form-rectangle' },
      1: { value: 'Current', en: 'Current', jp: '当座', type: 'button', className: 'form-rectangle' },
    }
  }
};

export default BankAccount;
