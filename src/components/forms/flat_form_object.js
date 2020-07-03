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
};

export default flatFormObject;
