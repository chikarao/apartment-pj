// Used in createFlat
const flatFormObject = {
  address1: {
    component: 'inputField',
    appLanguageKey: 'streetAddress',
    labelSpanStyle: { color: 'red' },
    type: 'string',
    className: 'form-control'
  },

  unit: {
    component: 'inputField',
    appLanguageKey: 'unit',
    labelSpanStyle: null,
    type: 'string',
    className: 'form-control',

  },

  city: {
    component: 'inputField',
    appLanguageKey: 'city',
    labelSpanStyle: { color: 'red' },
    type: 'string',
    className: 'form-control'
  },

  state: {
    component: 'inputField',
    appLanguageKey: 'state',
    labelSpanStyle: { color: 'red' },
    type: 'string',
    className: 'form-control'
  },

  zip: {
    component: 'inputField',
    appLanguageKey: 'zip',
    labelSpanStyle: { color: 'red' },
    type: 'string',
    className: 'form-control'
  },

  country: {
    component: 'inputField',
    appLanguageKey: 'country',
    labelSpanStyle: { color: 'red' },
    type: 'string',
    className: 'form-control'
  },

  price_per_month: {
    component: 'inputField',
    appLanguageKey: 'pricePerMonth',
    labelSpanStyle: { color: 'red' },
    type: 'float',
    className: 'form-control'
  },

  size: {
    component: 'inputField',
    appLanguageKey: 'floorSpace',
    labelSpanStyle: { color: 'red' },
    type: 'integer',
    className: 'form-control'
  },

  rooms: {
    component: 'selectField',
    appLanguageKey: 'rooms',
    labelSpanStyle: { color: 'red' },
    type: 'float',
    className: 'form-control',
    optionArray: [
      { value: null, textAppLanguagekey: '' },
      { value: 1, textAppLanguagekey: '' },
      { value: 3, textAppLanguagekey: '' },
      { value: 4, textAppLanguagekey: 'orMore4' },
    ]
  },
  minutes_to_station: {
    component: 'selectField',
    appLanguageKey: 'minutesToNearest',
    labelSpanStyle: { color: 'red' },
    type: 'integer',
    className: 'form-control',
    optionArray: [
      { value: null, textAppLanguagekey: '' },
      { value: 1, textAppLanguagekey: 'under1minute' },
      { value: 3, textAppLanguagekey: 'under3minutes' },
      { value: 5, textAppLanguagekey: 'under5minutes' },
      { value: 7, textAppLanguagekey: 'under7minutes' },
      { value: 10, textAppLanguagekey: 'under10minutes' },
      { value: 15, textAppLanguagekey: 'under15minutes' },
      { value: 16, textAppLanguagekey: 'over15minutes' },
    ]
  },

  requiredMessage: {
    component: null,
    appLanguageKey: 'requiredFields',
    labelSpanStyle: { color: 'red' },
    type: null,
    className: 'form-control',
    style: { float: 'left', paddingLeft: '20px', fontStyle: 'italic' }
  },

  description: {
    component: 'inputField',
    appLanguageKey: 'description',
    labelSpanStyle: null,
    type: 'string',
    className: 'form-control',
  },

  area: {
    component: 'inputField',
    appLanguageKey: 'area',
    labelSpanStyle: null,
    type: 'string',
    className: 'form-control',
  },

  balcony_size: {
    component: 'inputField',
    appLanguageKey: 'balconySize',
    labelSpanStyle: null,
    type: 'integer',
    className: 'form-control',
  },

  layout: {
    component: 'selectField',
    appLanguageKey: 'layout',
    labelSpanStyle: null,
    type: 'integer',
    className: 'form-control',
    optionArray: [
      { value: null, textAppLanguagekey: '' },
      { value: 'LDK', textAppLanguagekey: null },
      { value: 'DK', textAppLanguagekey: null },
      { value: 'L', textAppLanguagekey: null },
      { value: 'one_room', textAppLanguagekey: 'oneRoom' },
    ]
  },

  toilet: {
    component: 'selectField',
    appLanguageKey: 'toilet',
    labelSpanStyle: null,
    type: 'integer',
    className: 'form-control',
    languageFromBackEnd: true,
    optionArray: [
      { value: null, textAppLanguagekey: '' },
      { value: 'dedicatedFlushingToilet', textAppLanguagekey: null },
      { value: 'dedicatedNonFlushingToilet', textAppLanguagekey: null },
      { value: 'sharedFlushingToilet', textAppLanguagekey: null },
      { value: 'sharedNonFlushingToilet', textAppLanguagekey: null },
    ]
  },

  guests: {
    component: 'selectField',
    appLanguageKey: 'guests',
    labelSpanStyle: null,
    type: 'integer',
    className: 'form-control',
    optionArray: [
      { value: null, textAppLanguagekey: '' },
      { value: 1, textAppLanguagekey: '' },
      { value: 2, textAppLanguagekey: '' },
      { value: 3, textAppLanguagekey: '' },
      { value: 4, textAppLanguagekey: '' },
      { value: 5, textAppLanguagekey: '' },
      { value: 6, textAppLanguagekey: '' },
      { value: 7, textAppLanguagekey: '' },
      { value: 8, textAppLanguagekey: '' },
      { value: 9, textAppLanguagekey: '' },
      { value: 10, textAppLanguagekey: '' },
    ]
  },

  sales_point: {
    component: 'inputField',
    appLanguageKey: 'salesPoint',
    labelSpanStyle: null,
    type: 'string',
    className: 'form-control',
  },

  beds: {
    component: 'selectField',
    appLanguageKey: 'beds',
    labelSpanStyle: null,
    type: 'integer',
    className: 'form-control',
    optionArray: [
      { value: null, textAppLanguagekey: '' },
      { value: 1, textAppLanguagekey: '' },
      { value: 2, textAppLanguagekey: '' },
      { value: 3, textAppLanguagekey: '' },
      { value: 4, textAppLanguagekey: '' },
      { value: 5, textAppLanguagekey: '' },
      { value: 6, textAppLanguagekey: 'orMore6' },
    ]
  },

  king_or_queen_bed: {
    component: 'selectField',
    appLanguageKey: 'kingOrQueen',
    labelSpanStyle: null,
    type: 'integer',
    className: 'form-control',
    optionArray: [
      { value: null, textAppLanguagekey: '' },
      { value: 1, textAppLanguagekey: '' },
      { value: 2, textAppLanguagekey: '' },
      { value: 3, textAppLanguagekey: '' },
      { value: 4, textAppLanguagekey: '' },
      { value: 5, textAppLanguagekey: '' },
      { value: 6, textAppLanguagekey: 'orMore6' },
    ]
  },

  flat_type: {
    component: 'selectField',
    appLanguageKey: 'flatType',
    labelSpanStyle: null,
    type: 'string',
    className: 'form-control',
    languageFromBackEnd: true,
    optionArray: [
      { value: null, textAppLanguagekey: '' },
      { value: 'flatInBuilding', textAppLanguagekey: null },
      { value: 'singleFamily', textAppLanguagekey: null },
      { value: 'townHouse', textAppLanguagekey: null },
      { value: 'others', textAppLanguagekey: null },
    ]
  },

  bath: {
    component: 'selectField',
    appLanguageKey: 'bath',
    labelSpanStyle: null,
    type: 'float',
    className: 'form-control',
    optionArray: [
      { value: null, textAppLanguagekey: '' },
      { value: 1, textAppLanguagekey: '' },
      { value: 1.5, textAppLanguagekey: '' },
      { value: 2, textAppLanguagekey: '' },
      { value: 2.5, textAppLanguagekey: '' },
      { value: 3, textAppLanguagekey: '' },
    ]
  },

  intro: {
    component: 'inputField',
    appLanguageKey: 'intro',
    labelSpanStyle: null,
    type: 'text',
    className: 'form-control flat-intro-input',
  },

  owner_name: {
    component: 'inputField',
    appLanguageKey: 'ownerName',
    labelSpanStyle: null,
    type: 'string',
    className: 'form-control',
  },

  ifOwnerDifferent: {
    component: null,
    appLanguageKey: 'ifOwnerDifferent',
    labelSpanStyle: { color: 'red' },
    type: null,
    className: 'form-control',
    style: { float: 'left', paddingLeft: '20px', fontStyle: 'italic' }
  },

  owner_contact_name: {
    component: 'inputField',
    appLanguageKey: 'ownerContactName',
    labelSpanStyle: null,
    type: 'string',
    className: 'form-control',
  },

  owner_address: {
    component: 'inputField',
    appLanguageKey: 'ownerAddress',
    labelSpanStyle: null,
    type: 'string',
    className: 'form-control',
  },

  owner_phone: {
    component: 'inputField',
    appLanguageKey: 'ownerPhone',
    labelSpanStyle: null,
    type: 'string',
    className: 'form-control',
  },

  ownership_rights: {
    component: 'inputField',
    appLanguageKey: 'ownershipRights',
    labelSpanStyle: null,
    type: 'text',
    className: 'form-control',
  },

  other_rights: {
    component: 'inputField',
    appLanguageKey: 'otherRights',
    labelSpanStyle: null,
    type: 'text',
    className: 'form-control',
  },

  cancellation: {
    component: 'selectField',
    appLanguageKey: 'cancellation',
    labelSpanStyle: null,
    type: 'boolean',
    className: 'form-control',
    optionArray: [
      { value: null, textAppLanguagekey: '' },
      { value: true, textAppLanguagekey: 'yesSeePolicies' },
      { value: false, textAppLanguagekey: 'no' },
    ]
  },

  smoking: {
    component: 'selectField',
    appLanguageKey: 'smoking',
    labelSpanStyle: null,
    type: 'boolean',
    className: 'form-control',
    optionArray: [
      { value: null, textAppLanguagekey: '' },
      { value: true, textAppLanguagekey: 'yes' },
      { value: false, textAppLanguagekey: 'no' },
    ]
  },
};

export default flatFormObject;

// <fieldset key={'cancellation'} className="form-group">
//   <label className="create-flat-form-label">{AppLanguages.cancellation[appLanguageCode]}:</label>
//   <Field name="cancellation" component="select" type="boolean" className="form-control">
//     <option></option>
//     <option value={true}>{AppLanguages.yesSeePolicies[appLanguageCode]}</option>
//     <option value={false}>{AppLanguages.zip[appLanguageCode]}</option>
//   </Field>
// </fieldset>
