// For edit flat languages box
// objects related display of languages in various parts of the app
const DefaultInsertFieldsObject =
  {
    contract_break_terms: [
      { language_code: 'en', value: 'Here are the contract break terms　\nHere is a line break' },
      { language_code: 'jp', value: '契約解除の欄です。\nラインブレークです。' },
      { language_code: 'po', value: '契約解除の欄です。\nラインブレークです。' }
    ],

    warranties: [
      { language_code: 'en', value: 'Here are the warranty terms　\nHere is a line break' },
      { language_code: 'jp', value: '損害賠償です。\nラインブレークです。' },
      { language_code: 'po', value: '損害賠償です。\nラインブレークです。' }
    ],

    contract_renewal_terms: [
      { language_code: 'en', value: 'Here are the contract renewal terms　\nHere is a line break' },
      { language_code: 'jp', value: '契約更新の条件です。\nラインブレークです。' },
      { language_code: 'po', value: '契約更新の条件です。\nラインブレークです。' }
    ],

    deposit_return_terms: [
      { language_code: 'en', value: 'Here are the deposit return terms　\nHere is a line break' },
      { language_code: 'jp', value: '敷金返却の条件です。\nラインブレークです。' },
      { language_code: 'po', value: '敷金返却の条件です。\nラインブレークです。' }
    ],
  };

export default DefaultInsertFieldsObject;
// in: { name: 'Indian', flag: '🇮🇳', local: '' },
// fl: { name: 'Flemish', flag: '🇧🇪', local: '' },
