// Object used for input and editing building info for documents ONLY!!!!!!!
// NOT for input in create flat or edit flat!!!!!!!

const FlatForDocuments = {
  toilet: {
    name: 'toilet',
    en: 'Toilet',
    jp: 'トイレ',
    component: 'DocumentChoices',
    type: 'string',
    choices: {
      // toilet notes
      0: { value: 'Dedicated Flushing Toilet', en: 'Dedicated Flushing Toilet', jp: '専用　水洗', type: 'button', className: 'form-rectangle' },
      1: { value: 'Dedicated Non-flushing Toilet', en: 'Dedicated Non-flushing Toilet', jp: '専用　非水洗', type: 'button', className: 'form-rectangle' },
      2: { value: 'Shared Flushing Toilet', en: 'Shared Flushing Toilet', jp: '共用　水洗', type: 'button', className: 'form-rectangle' },
      3: { value: 'Shared Non-flushing Toilet', en: 'Shared Non-flushing Toilet', jp: '共用　非水洗', type: 'button', className: 'form-rectangle' },
      // booleans for use in toilet
      4: { value: true, en: 'Yes', jp: '有り', type: 'boolean', className: 'form-rectangle' },
      5: { value: false, en: 'None', jp: '無し', type: 'boolean', className: 'form-rectangle' }
      // 2: { value: 'Wooden Structure', en: 'Wooden Structure', jp: '木造', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    },
  },
  
  flat_type: {
    name: 'flat_type',
    en: 'Flat Type',
    jp: '物件の種類',
    component: 'DocumentChoices',
    type: 'string',
    choices: {
      // toilet notes
      0: { value: 'flat_in_building', en: 'Flat in Building', jp: '共同住宅', type: 'button', className: 'form-rectangle' },
      1: { value: 'single_family', en: 'House', jp: '一戸建て', type: 'button', className: 'form-rectangle' },
      2: { value: 'town_house', en: 'Town House', jp: '長屋建', type: 'button', className: 'form-rectangle' },
      3: { value: 'others', en: 'Others', jp: 'その他', type: 'button', className: 'form-rectangle' },
      // // booleans for use in toilet
      // 4: { value: true, en: 'Yes', jp: '有り', type: 'boolean', className: 'form-rectangle' },
      // 5: { value: false, en: 'None', jp: '無し', type: 'boolean', className: 'form-rectangle' }
      // 2: { value: 'Wooden Structure', en: 'Wooden Structure', jp: '木造', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    },

    // for rendering when fields are language indepedent.
    // ie needs to inputted in new language in create contractor modal
    // language_independent: true,
    // for rendering in forms only choices that do not exist
    // limit_choices: true,
    // map to column in backend code
    // map_to_record: 'toilet'
  },
};

export default FlatForDocuments;
