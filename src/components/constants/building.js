// Object used for input and editing building info in edit flat

const Building = {
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
    // language_independent: true,
    // for rendering in forms only choices that do not exist
    limit_choices: true,
    // map to column in backend database
    map_to_record: 'language_code'
  },

  name: {
    name: 'name',
    en: 'Building Name',
    jp: '名称',
    component: 'input',
    type: 'string',
    className: 'form-control',
  },

  address1: {
    name: 'address1',
    en: 'Street Address',
    jp: '町村番地',
    component: 'input',
    type: 'string',
    className: 'form-control',
  },
  // address2: { en: 'Street Address2', jp: '' },
  city: {
    name: 'city',
    en: 'City',
    jp: '市区',
    component: 'input',
    type: 'string',
    className: 'form-control',
  },

  state: {
    name: 'state',
    en: 'State',
    jp: '都道府県',
    component: 'input',
    type: 'string',
    className: 'form-control',
  },

  zip: {
    name: 'zip',
    en: 'Zip',
    jp: '郵便番号',
    component: 'input',
    type: 'string',
    className: 'form-control',
  },

  country: {
    name: 'country',
    en: 'Country',
    jp: '国',
    component: 'input',
    type: 'string',
    className: 'form-control',
  },

  units: {
    name: 'units',
    en: 'Units',
    jp: '戸数',
    component: 'input',
    type: 'string',
    className: 'form-control',
    language_independent: true,
  },

  year_built: {
    name: 'year_built',
    en: 'Year Built',
    jp: '工事完了年',
    component: 'input',
    type: 'string',
    className: 'form-control',
    language_independent: true,
  },

  last_renovation_year: {
    name: 'last_renovation_year',
    en: 'Last Renovation Year',
    jp: '大規模修繕工事の実施年',
    component: 'input',
    type: 'string',
    className: 'form-control',
    language_independent: true,
  },

  floors: {
    name: 'floors',
    en: 'Floors',
    jp: '階建',
    component: 'input',
    type: 'string',
    className: 'form-control',
    language_independent: true,
  },

  floors_underground: {
    name: 'floors_underground',
    en: 'Floors Underground',
    jp: '地下階数',
    component: 'input',
    type: 'string',
    className: 'form-control',
    language_independent: true,
  },

  construction: {
    name: 'construction',
    en: 'Building Construction',
    jp: '構造',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'RC', en: 'RC (Reinforced Concrete)', jp: 'RC (鉄筋コンクリート)', type: 'button', className: 'form-rectangle' },
      1: { value: 'SRC', en: 'SRC (Steel Reinforced Concrete)', jp: 'SRC (鉄骨鉄筋コンクリート)', type: 'button', className: 'form-rectangle' },
      2: { value: 'CFT', en: 'CFT (Concrete Filled Steel Tube)', jp: 'CFT (コンクリート充填鋼管)', type: 'button', className: 'form-rectangle' },
      3: { value: 'S', en: 'S (Steel Frame)', jp: 'S (軽量鉄骨造)', type: 'button', className: 'form-rectangle' },
      4: { value: 'Aluminum', en: 'AL (Alminium)', jp: 'AL (アルミ)', type: 'button', className: 'form-rectangle' },
      5: { value: 'Wooden', en: 'W (Wooden)', jp: 'W (木造)', type: 'button', className: 'form-rectangle' },
      // 5: { value: 'Other', en: 'Other', jp: 'その他', type: 'button', className: 'form-rectangle' },
      // 4: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    },
  },

  building_type: {
    name: 'building_type',
    en: 'Building Type',
    jp: '種類',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'flat_in_building', en: 'Multi Family', jp: '共同建', type: 'button', className: 'form-rectangle' },
      1: { value: 'town_house', en: 'Townhouse', jp: '長屋建', type: 'button', className: 'form-rectangle' },
      2: { value: 'single_family', en: 'Single Family', jp: '一戸建', type: 'button', className: 'form-rectangle' },
      3: { value: 'other', en: 'Other', jp: 'その他', type: 'button', className: 'form-rectangle' }
    },
    language_independent: true,
  },

  building_management_company: {
    name: 'building_management_company',
    en: 'Building Management Company',
    jp: '管理会社名',
    component: 'input',
    type: 'string',
    className: 'form-control',
  },

  building_management_contact: {
    name: 'building_management_contact',
    en: 'Building Management Contact',
    jp: '管理会社　担当者名',
    component: 'input',
    type: 'string',
    className: 'form-control',
  },

  building_management_phone: {
    name: 'building_management_phone',
    en: 'Building Management Phone',
    jp: '管理会社　電話',
    component: 'input',
    type: 'string',
    className: 'form-control',
    language_independent: true,
  },

  power_usage_amount: {
    name: 'power_usage_amount',
    en: 'Power Usage Amount',
    jp: '使用可能電気容量',
    component: 'input',
    type: 'string',
    className: 'form-control',
    language_independent: true,
  },

  electricity: {
    name: 'electricity',
    en: 'Electric Company',
    jp: '電気会社',
    component: 'input',
    type: 'string',
    className: 'form-control',
    // language_independent: true,
  },

  sewage: {
    name: 'sewage',
    en: 'Sewage',
    jp: '下水道',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Public Sewer', en: 'Public Sewer', jp: '公共下水道', type: 'button', className: 'form-rectangle' },
      1: { value: 'Septic Tank', en: 'Septic Tank', jp: '浄化槽', type: 'button', className: 'form-rectangle' },
      2: { value: 'None', en: 'None', jp: '無し', type: 'button', component: 'button', className: 'form-rectangle' }
    },
    language_independent: true,
  },

  water: {
    name: 'water',
    en: 'Water',
    jp: '上水道',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Public Water', en: 'Public Water', jp: '水道本管より直結', type: 'button', className: 'form-rectangle' },
      // 1: { value: 'Private Water', en: 'Private Water', jp: '市営水道', type: 'button', className: 'form-rectangle' },
      2: { value: 'Water Tank', en: 'Water Tank', jp: '受水槽', type: 'button', className: 'form-rectangle' },
      3: { value: 'Well', en: 'Well', jp: '井戸', type: 'button', className: 'form-rectangle' },
      4: { value: 'none', en: 'None', jp: '無し', type: 'button', component: 'button', className: 'form-rectangle' }
    },
    language_independent: true,
  },

  gas: {
    name: 'gas',
    en: 'Gas',
    jp: 'ガス',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Public Gas', en: 'Public Gas', jp: '都市ガス', type: 'button', className: 'form-rectangle' },
      1: { value: 'Propane Gas', en: 'Propane Gas', jp: 'プロパンガス', type: 'button', className: 'form-rectangle' },
      2: { value: 'none', en: 'None', jp: '無し', type: 'button', component: 'button', className: 'form-rectangle' }
    },
    language_independent: true,
  },

  asbestos_record: {
    name: 'asbestos_record',
    en: 'Asbestos Record',
    jp: 'アスベストス',
    component: 'FormChoices',
    type: 'boolean',
    choices: {
      0: { value: 'true', en: 'Yes, performed', jp: 'はい、調査済み', type: 'button', className: 'form-rectangle' },
      1: { value: 'false', en: 'No, not performed', jp: 'いいえ、調査されてません', type: 'button', className: 'form-rectangle' }
    },
    language_independent: true,
  },

  asbestos_survey_contents: {
    name: 'asbestos_survey_contents',
    en: 'Asbestos Survey Contents',
    jp: 'アスベストス調査の内容',
    component: 'input',
    type: 'string',
    className: 'form-control',
    // choices: {
      //   0: { value: '', val: ''},
      // }
    },
    
  building_owner_name: {
    name: 'building_owner_name',
    en: 'Building Owner Name',
    jp: '物件の所有者名',
    component: 'input',
    type: 'string',
    className: 'form-control',
    // choices: {
    //   0: { value: '', val: ''},
    // }
  },

  building_owner_address: {
    name: 'building_owner_address',
    en: 'Building Owner Address',
    jp: '物件の所有者の住所',
    component: 'input',
    type: 'string',
    className: 'form-control',
    // choices: {
    //   0: { value: '', val: ''},
    // }
  },

  building_owner_phone: {
    name: 'building_owner_phone',
    en: 'Building Owner Phone',
    jp: '物件の所有者の電話番号',
    component: 'input',
    type: 'string',
    className: 'form-control',
    language_independent: true,
    // choices: {
    //   0: { value: '', val: ''},
    // }
  },


  building_inspection_conducted: {
    name: 'building_inspection_conducted',
    en: 'Building Inspection Conducted',
    jp: '建物状況調査の実施の有無',
    component: 'FormChoices',
    type: 'boolean',
    choices: {
      0: { value: 'true', en: 'Yes, conducted', jp: 'はい、実施済み', type: 'button', className: 'form-rectangle' },
      1: { value: 'false', en: 'No, not conducted', jp: 'いいえ、実施されてません', type: 'button', className: 'form-rectangle' }
    },
    language_independent: true,
  },

  earthquake_study_contents: {
    name: 'earthquake_study_contents',
    en: 'Earthquake Study Contents',
    jp: '耐震診断の内容',
    component: 'input',
    type: 'string',
    className: 'form-control',
  },

  legal_restrictions: {
    name: 'legal_restrictions',
    en: 'Legal Restrictions (Name)',
    jp: '法令に基づく制限(法令名)',
    component: 'input',
    type: 'string',
    className: 'form-control',
  },

  legal_restrictions_summary: {
    name: 'legal_restrictions_summary',
    en: 'Legal Restrictions (Summary)',
    jp: '法令に基づく制限(概要)',
    component: 'input',
    type: 'string',
    className: 'form-control',
  },

  earthquake_study_performed: {
    name: 'earthquake_study_performed',
    en: 'Earthquake Study Performed',
    jp: '耐震診断の有無',
    component: 'FormChoices',
    type: 'boolean',
    choices: {
      0: { value: 'true', en: 'Yes, performed', jp: 'はい、有ります', type: 'button', className: 'form-rectangle' },
      1: { value: 'false', en: 'No, not performed', jp: 'いいえ、有りません', type: 'button', className: 'form-rectangle' }
    },
    language_independent: true,
  },

  inside_disaster_prevention: {
    name: 'inside_disaster_prevention',
    en: 'Inside Disaster Prevention Zone',
    jp: '造成宅地防災区域内か否か',
    component: 'FormChoices',
    type: 'boolean',
    choices: {
      0: { value: 'true', en: 'Yes, inside', jp: 'はい、内です', type: 'button', className: 'form-rectangle' },
      1: { value: 'false', en: 'No, outside', jp: 'いいえ、外です', type: 'button', className: 'form-rectangle' }
    },
    language_independent: true,
  },

  inside_disaster_warning: {
    name: 'inside_disaster_warning',
    en: 'Inside Disaster Warning Zone',
    jp: '土砂災害警戒区域内か否か',
    component: 'FormChoices',
    type: 'boolean',
    choices: {
      0: { value: 'true', en: 'Yes, inside', jp: 'はい、内です', type: 'button', className: 'form-rectangle' },
      1: { value: 'false', en: 'No, outside', jp: 'いいえ、外です', type: 'button', className: 'form-rectangle' }
    },
    language_independent: true,
  },

  inside_tsunami_warning: {
    name: 'inside_tsunami_warning',
    en: 'Inside Tsunami Warning Zone',
    jp: '津波災害警戒区域内か否か',
    component: 'FormChoices',
    type: 'boolean',
    choices: {
      0: { value: 'true', en: 'Yes, inside', jp: 'はい、内です', type: 'button', className: 'form-rectangle' },
      1: { value: 'false', en: 'No, outside', jp: 'いいえ、外です', type: 'button', className: 'form-rectangle' }
    },
    language_independent: true,
  },
};

export default Building;
