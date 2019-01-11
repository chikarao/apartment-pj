// For create_edit_document mapStateToProps
import FixedTermRentalContract from './fixed_term_rental_contract.js';
import FixedTermRentalContractBilingual from './fixed_term_rental_contract_bilingual.js';
import FixedTermRentalContractBilingualTranslation from './fixed_term_rental_contract_bilingual_translation.js';
import ImportantPointsExplanationBilingualTranslation from './important_points_explanation_bilingual_translation.js';
import ImportantPointsExplanation from './important_points_explanation.js';
import ImportantPointsExplanationBilingual from './important_points_explanation_bilingual.js';
import getInitialValuesObjectFixedTermContract from '../functions/get_initialvalues_object-fixed-term-contract.js';
import getInitialValuesObjectImportantPointsExplanation from '../functions/get_initialvalues_object_important_points_explanation.js';

// ADD NEW DOCUMENTS FOR CREATION HERE!!!!!
// form for setting inputs and buttons with absolute position top and left attributes
// on the image for the contract
// contains all the params needed to render PDF on the back end
// image is publicid for cloudinary
// method or function for gettting intialvalues in create_edit_document for redux-forms
// called in create_edit_document
const Documents =
  {
    fixed_term_rental_contract_jp: {
        form: FixedTermRentalContract,
        en: 'Fixed Term Rental Contract',
        jp: '定期借家契約',
        file: 'teishaku-saimuhosho',
        method: getInitialValuesObjectFixedTermContract,
        type: 'fixed_term_rental_contract'
      },

    important_points_explanation_jp: {
        form: ImportantPointsExplanation,
        en: 'Important Points Explanation Form',
        jp: '重要事項説明書',
        file: 'juyoujikou-setsumei-jp',
        method: getInitialValuesObjectImportantPointsExplanation,
      },

    fixed_term_rental_contract_bilingual: {
      form: FixedTermRentalContractBilingual,
      en: 'Fixed Term Rental Contract Bilingual',
      jp: '定期借家契約 バイリンガル',
      file: 'teishaku-saimuhosho-bilingual-v3-no-translation-1',
      method: getInitialValuesObjectFixedTermContract,
      translation: FixedTermRentalContractBilingualTranslation
      // method: '',
      // type: 'fixed_term_rental_contract'
    },

    important_points_explanation_bilingual: {
      form: ImportantPointsExplanationBilingual,
      en: 'Important Points Explanation Form Bilingual',
      jp: '重要事項説明書 バイリンガル',
      file: 'juyoujikou-setsumei-bilingual-v3-no-translation-2',
      method: getInitialValuesObjectImportantPointsExplanation,
      translation: ImportantPointsExplanationBilingualTranslation,
      // method: '',
      // type: 'fixed_term_rental_contract'
    },
  };

export default Documents;
// in: { name: 'Indian', flag: '🇮🇳', local: '' },
// fl: { name: 'Flemish', flag: '🇧🇪', local: '' },
