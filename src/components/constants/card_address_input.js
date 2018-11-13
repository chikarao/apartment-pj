// Object for use with Stripe; input and edit card holder information

// const cardAddressInputObject = {
//   name: 'Name on Card',
//   address_line1: 'Street Address',
//   address_line2: 'Street Address 2',
//   address_city: 'City',
//   address_state: 'State',
//   address_zip: 'Postal Code / Zip',
//   address_country: 'Country'
//   // currency: 'Currency'
// };

// export default cardAddressInputObject;
const cardAddressInputObject = {
  name: { en: 'Name on Card', jp: 'カード名義' },
  address_line1: { en: 'Street Address', jp: '町村番地' },
  address_line2: { en: 'Street Address 2', jp: 'マンション名・部屋番号' },
  address_city: { en: 'City', jp: '市区' },
  address_state: { en: 'State', jp: '都道府県' },
  address_zip: { en: 'Postal Code / Zip', jp: '郵便番号' },
  address_country: { en: 'Country', jp: '国名' }
  // currency: 'Currency'
};

export default cardAddressInputObject;
