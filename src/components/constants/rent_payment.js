// import React from 'react';

const RentPayment = {
  rent_payment_method: {
    name: 'rent_payment_method',
    en: 'Rent Payment Method',
    jp: '家賃の支払い方',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'bank_transfer', en: 'Bank Transfer', jp: '銀行振込', type: 'button', className: 'form-rectangle' },
      1: { value: 'submit_to_owner', en: 'Submit to Owner', jp: '物件所有者へ持参', type: 'button', className: 'form-rectangle' },
      2: { value: 'submit_to_landlord', en: 'Submit to Landlord', jp: '物件貸主へ持参', type: 'button', className: 'form-rectangle' },
      3: { value: 'submit_to_broker', en: 'Submit to Broker', jp: '物件管理業者へ持参', type: 'button', className: 'form-rectangle' },
      4: { value: '', en: 'Enter other...', jp: 'その他...', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },
  transfer_fee_paid_by: {
    name: 'transfer_fee_paid_by',
    en: 'Transfer Fee Paid By',
    jp: '振込手数料負担者',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'tenant', en: 'Tenant', jp: '借主', type: 'button', className: 'form-rectangle' },
      1: { value: 'landlord', en: 'Landlord', jp: '貸主', type: 'button', className: 'form-rectangle' },
    }
  }
};

export default RentPayment;
