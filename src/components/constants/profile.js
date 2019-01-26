// object for input and edit of profile used in mypage
const Profile = {
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

  // corporation: {
  //   name: 'corporation',
  //   en: 'User is Corporation',
  //   jp: 'ユーザーは法人',
  //   component: 'FormChoices',
  //   type: 'boolean',
  //   choices: {
  //     0: { value: 'true', en: 'Yes', jp: 'はい', type: 'button', className: 'form-rectangle' },
  //     1: { value: 'false', en: 'No', jp: 'いいえ', type: 'button', className: 'form-rectangle', dependentKeys: { fields: ['name'], value: '' } }
  //   }
  // },

  name: {
    name: 'name',
    en: 'Company Name',
    jp: '法人名',
    component: 'input',
    type: 'string',
    className: 'form-control',
    // category: 'basic'
  },

  // username: {
  //   name: 'username',
  //   en: 'Username',
  //   jp: 'ユーザーネーム',
  //   component: 'input',
  //   type: 'string',
  //   className: 'form-control',
  //   language_independent: true,
  //   // category: 'basic'
  // },

  title: {
    name: 'title',
    en: 'Title',
    jp: 'タイトル',
    component: 'input',
    type: 'string',
    className: 'form-control',
    // category: 'basic'
  },

  first_name: {
    name: 'first_name',
    en: 'First Name',
    jp: '名',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'basic'
  },

  last_name: {
    name: 'last_name',
    en: 'Last Name',
    jp: '姓名',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'basic'
  },

  birthday: {
    name: 'birthday',
    en: 'Birthday',
    jp: '生年月日',
    component: 'input',
    type: 'date',
    className: 'form-control',
    category: 'basic',
    language_independent: true,
  },

  address1: {
    name: 'address1',
    en: 'Street Address',
    jp: '町村番地',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'basic'
  },

  city: {
    name: 'city',
    en: 'City',
    jp: '市区',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'basic'
  },

  state: {
    name: 'state',
    en: 'State',
    jp: '都道府県',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'basic'
  },

  zip: {
    name: 'zip',
    en: 'Zip',
    jp: '都道府県',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'basic',
    language_independent: true,
  },

  country: {
    name: 'country',
    en: 'Country',
    jp: '国名',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'basic'
  },

  emergency_contact_name: {
    name: 'emergency_contact_name',
    en: 'Emergency Contact Name',
    jp: '緊急連絡先の名前',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'emergency'
  },

  emergency_contact_phone: {
    name: 'emergency_contact_phone',
    en: 'Emergency Contact Phone',
    jp: '緊急連絡先の電話',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'emergency',
    language_independent: true,
  },

  emergency_contact_address: {
    name: 'emergency_contact_address',
    en: 'Emergency Contact Address',
    jp: '緊急連絡先の住所',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'emergency'
  },

  emergency_contact_relationship: {
    name: 'emergency_contact_relationship',
    en: 'Relationship with Emergency Contact',
    jp: '緊急連絡先との関係',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'emergency'
  },

  introduction: {
    name: 'introduction',
    en: 'Introduction',
    jp: '自己紹介',
    component: 'textarea',
    type: 'text',
    className: 'form-control my-page-profile-introduction',
    // category: 'basic'
  },
};

export default Profile;
