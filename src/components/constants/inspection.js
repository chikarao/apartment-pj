// import React from 'react';


const Inspection = {
  inspection_language: {
    name: 'inspection_language',
    en: 'Language',
    jp: '言語',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'en', en: '🇬🇧　English', jp: '🇬🇧　English', type: 'button', className: 'form-rectangle' },
      1: { value: 'jp', en: '🇯🇵　Japanese', jp: '🇯🇵　日本語', type: 'button', className: 'form-rectangle' },
      // 2: { value: 'Wooden Structure', en: 'Wooden Structure', jp: '木造', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },
  inspection_date: {
    name: 'inspection_date',
    en: 'Inspection Date',
    jp: '調査の実施日',
    component: 'input',
    type: 'date',
    className: 'form-control'
  },

  inspection_summary: {
    name: 'inspection_summary',
    en: 'Inspection Summary',
    jp: '調査結果の概要',
    component: 'input',
    type: 'text',
    className: 'form-control'
  },

  inspector_name: {
    name: 'inspector_name',
    en: 'Inspector Name',
    jp: '調査実施者の氏名',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  inspector_trainer: {
    name: 'inspector_trainer',
    en: 'Inspector Trainor',
    jp: '実施講習機関名',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  inspector_certificate_number: {
    name: 'inspector_certificate_number',
    en: 'Inspector Certificate Number',
    jp: '調査実施者の修了証明書番号',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  inspector_certificate_number: {
    name: 'inspector_certificate_number',
    en: 'Inspector Certificate Number',
    jp: '調査実施者の修了証明書番号',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  architect_qualification_type: {
    name: 'architect_qualification_type',
    en: 'Architect Qualification Type',
    jp: '建築士資格種別',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Class 1', en: 'Class 1', jp: '一級', type: 'button', className: 'form-rectangle' },
      1: { value: 'Class 2', en: 'Class 2', jp: '二級', type: 'button', className: 'form-rectangle' },
      2: { value: 'Wooden Structure', en: 'Wooden Structure', jp: '木造', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  architect_type: {
    name: 'architect_type',
    en: 'Architect Type',
    jp: '建築士登録種類',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Minister Registration', en: 'Minister\'s Registration', jp: '大臣登録', type: 'button', className: 'form-rectangle' },
      1: { value: 'Governor Registration', en: 'Governor\'s Registration', jp: '知事登録', type: 'button', className: 'form-rectangle' },
      // 2: { value: 'Wooden Structure', en: 'Wooden Structure', jp: '木造', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  architect_registration_number: {
    name: 'architect_registration_number',
    en: 'Architect Registration Number',
    jp: '建築士登録番号',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  architect_office_name: {
    name: 'architect_office_name',
    en: 'Architect Office Name',
    jp: '所属事務所名',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  architect_office_registration: {
    name: 'architect_office_registration',
    en: 'Architect Office Registration',
    jp: '建築士事務所登録番号',
    component: 'input',
    type: 'string',
    className: 'form-control'
  },

  foundation: {
    name: 'foundation',
    en: 'Foundation',
    jp: '基礎',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  floor_assembly: {
    name: 'floor_assembly',
    en: 'Floor Assembly',
    jp: '土台及び床組',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  floor: {
    name: 'floor',
    en: 'Floor',
    jp: '床',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  pillars: {
    name: 'pillars',
    en: 'Pillars',
    jp: '柱及び梁',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  exterior_walls: {
    name: 'exterior_walls',
    en: 'Exterior Walls',
    jp: '外壁及び軒裏',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },


  balcony: {
    name: 'balcony',
    en: 'Balcony',
    jp: 'バルコニー',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  interior_walls: {
    name: 'interior_walls',
    en: 'Interior Walls',
    jp: '内壁',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  ceilings: {
    name: 'ceilings',
    en: 'Ceilings',
    jp: '天井',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  roof_truss: {
    name: 'roof_truss',
    en: 'Roof Truss',
    jp: '小屋組',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  termite_damage: {
    name: 'termite_damage',
    en: 'Termite Damage',
    jp: '蟻害',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },
  corrosion: {
    name: 'corrosion',
    en: 'Corrosion',
    jp: '腐朽・腐食',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  reinforcement: {
    name: 'reinforcement',
    en: 'Reinforcement',
    jp: '配筋調査',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  concrete_compression: {
    name: 'concrete_compression',
    en: 'Concrete Compression',
    jp: 'コンクリート圧縮強度',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },
  // "inspection_date", "inspection_summary", "inspector_name", "inspector_trainer", "inspector_certificate_number", "architect_qualification_type", "architect_type", "architect_registration_number", "architect_registration_type", "architect_office_name", "architect_office_registration", "foundation", "floor_assembly", "floor", "pillars", "exterior_walls", "balcony", "interior_walls", "ceilings", "roof_truss", "termite_damage", "corrosion", "reinforcement", "concrete_compression", "exterior_walls_rain", "eaves_rain", "balcony_rain", "interior_walls_rain", "ceilings_rain", "roof_truss_rain", "roof",
  exterior_walls_rain: {
    name: 'exterior_walls_rain',
    en: 'Exterior Walls for Rain',
    jp: '外壁 雨水の浸入を防止',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  eaves_rain: {
    name: 'eaves_rain',
    en: 'Eaves for Rain',
    jp: '軒裏 雨水の浸入を防止',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  balcony_rain: {
    name: 'balcony_rain',
    en: 'Balcony for Rain',
    jp: 'バルコニー 雨水の浸入を防止',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  interior_walls_rain: {
    name: 'interior_walls_rain',
    en: 'Interior Walls for Rain',
    jp: '内壁 雨水の浸入を防止',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  ceilings_rain: {
    name: 'ceilings_rain',
    en: 'Ceilings Walls for Rain',
    jp: '天井 雨水の浸入を防止',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  roof_truss_rain: {
    name: 'roof_truss_rain',
    en: 'Roof Truss for Rain',
    jp: '小屋組 雨水の浸入を防止',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  roof: {
    name: 'roof',
    en: 'Roof for Rain',
    jp: '屋根 雨水の浸入を防止',
    component: 'FormChoices',
    type: 'string',
    choices: {
      0: { value: 'Yes', en: 'Yes', jp: '有', type: 'button', className: 'form-rectangle' },
      1: { value: 'No', en: 'No', jp: '無', type: 'button', className: 'form-rectangle' },
      2: { value: 'Could not be investigated', en: 'Could not be investigated', jp: '調査できなかった', type: 'button', className: 'form-rectangle' },
      // 2: { value: '', type: 'string', component: 'input', className: 'form-rectangle form-input' }
    }
  },

  // asbestos_record: {
  //   name: 'asbestos_record',
  //   en: 'Asbestos Record',
  //   jp: 'アスベストス',
  //   component: 'FormChoices',
  //   type: 'boolean',
  //   choices: {
  //     0: { value: 'true', en: 'Yes, performed', jp: 'はい、調査済み', type: 'button', className: 'form-rectangle' },
  //     1: { value: 'false', en: 'No, not performed', jp: 'いいえ、調査されてません', type: 'button', className: 'form-rectangle' }
  //   }
  // },
};

export default Inspection;
