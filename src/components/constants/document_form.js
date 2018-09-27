// import YesOrNo = './forms/document_yes_or_no'

const DocumentForm = {
  // flat_building_name: { top: '204px', left: '-120px', component: 'input', borderColor: 'blue', size: 'medium' }
  flat_building_name: {
    name: 'flat_building_name',
    className: 'form-control',
    // top: '16%',
    // left: '24.5%',
    // width: '490px',
    // height: '23px',
    component: 'input',
    borderColor: 'lightgray',
    choices: {
      0: {
        params: {
          val: '',
          top: '16%',
          left: '24.5%',
          width: '63%',
          height: '2.1%',
          type: 'string',
        }
      }
      }
    },

  address: {
    name: 'address',
    type: 'string',
    className: 'form-control',
    // top: '208.5px',
    // left: '192px',
    // width: '63%',
    // height: '2.1%',
    component: 'input',
    borderColor: 'lightgray',
    choices: {
      0: {
        params: {
          val: '',
          top: '18.7%',
          left: '24.5%',
          width: '63%',
          height: '2.1%',
        }
      }
    }
  },

  bath: {
    name: 'bath',
    type: 'boolean',
    choices: {
      0: { valName: 'Y', params: { val: true, top: '37.7%', left: '47.3%', width: '2.78%', className: 'document-circle', type: 'button' } },
      1: { valName: 'N', params: { val: false, top: '37.7%', left: '51%', width: '2.78%', className: 'document-circle', type: 'button' } }
    },
    box: { style: { display: 'flex', flexDirection: 'row', justifyContent: 'center' } },
    className: 'form-control-document',
    top: '420.5px',
    left: '376px',
    width: '100px',
    height: '23px',
    component: 'DocumentChoices',
    borderColor: 'blue',
  },

  building_type: {
    name: 'building_type',
    type: 'string',
    choices: {
      0: { params: { val: 'Multi Family', top: '22.8%', left: '27%', width: '10%', className: 'document-rectangle', type: 'button' } },
      1: { params: { val: 'Long Building', top: '24.3%', left: '27%', width: '10%', className: 'document-rectangle', type: 'button' } },
      2: { params: { val: 'Single Family', top: '25.8%', left: '27%', width: '10%', className: 'document-rectangle', type: 'button' } },
      3: { params: { val: 'Others', top: '27.3%', left: '27%', width: '10%', className: 'document-rectangle', type: 'button' } }
    },
    box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
    className: 'form-control-document',
    top: '254px',
    left: '218px',
    width: '100px',
    height: '23px',
    component: 'DocumentChoices',
    borderColor: 'bl u'
  },

  construction: {
    name: 'construction',
    type: 'string',
    choices: {
      0: { params: { val: 'Wooden', top: '21.6%', left: '45%', width: '10%', className: 'document-rectangle', type: 'button' } },
      1: { params: { val: '', top: '24%', left: '54.5%', width: '10%', className: 'document-rectangle', type: 'string' }, margin: '8px 0 0 70px' }
    },
    box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'cent' } },
    className: 'form-control-document',
    top: '21.5%',
    left: '46.5%',
    width: '100px',
    height: '23px',
    component: 'DocumentChoices',
    borderColor: 'blue',
    }
};

export default DocumentForm;
// const DocumentForm = {
//   // flat_building_name: { top: '204px', left: '-120px', component: 'input', borderColor: 'blue', size: 'medium' }
//   flat_building_name: { name: 'flat_building_name', type: 'string', className: 'form-control', top: '177.5px', left: '200px', width: '490px', height: '23px', component: 'input', borderColor: 'blue' },
//   address: { name: 'address', type: 'string', className: 'form-control', top: '205.5px', left: '200px', width: '490px', height: '23px', component: 'input', borderColor: 'blue' },
//   washer: { name: 'washer', type: 'boolean', className: 'form-control', top: '420.5px', left: '412px', width: '100px', height: '23px', component: 'YesOrNo', borderColor: 'blue' }
// }
//
// export default DocumentForm;
