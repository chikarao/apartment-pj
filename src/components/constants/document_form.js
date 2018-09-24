// import YesOrNo = './forms/document_yes_or_no'

const DocumentForm = {
  // flat_building_name: { top: '204px', left: '-120px', component: 'input', borderColor: 'blue', size: 'medium' }
  flat_building_name: { name: 'flat_building_name', type: 'string', className: 'form-control', top: '177.5px', left: '200px', width: '490px', height: '23px', component: 'input', borderColor: 'blue' },
  address: { name: 'address', type: 'string', className: 'form-control', top: '205.5px', left: '200px', width: '490px', height: '23px', component: 'input', borderColor: 'blue' },
  bath: { name: 'bath', type: 'boolean', choices: { 0: { valName: 'Y', val: true, width: '22px', className: 'document-circle', type: 'button' }, 1: { valName: 'N', val: false, width: '22px', className: 'document-circle', type: 'button' } }, box: { style: { display: 'flex', flexDirection: 'row', justifyContent: 'center' } }, className: 'form-control', top: '420.5px', left: '412px', width: '100px', height: '23px', component: 'DocumentChoices', borderColor: 'blue' },
  construction: { name: 'construction', type: 'string', choices: { 0: { val: 'Multi Family', width: '80px', className: 'document-rectangle', type: 'button' }, 1: { val: 'Long Building', width: '80px', className: 'document-rectangle', type: 'button' }, 2: { val: 'Single Family', width: '80px', className: 'document-rectangle', type: 'button' }, 3: { val: 'Others', width: '80px', className: 'document-rectangle', type: 'button' } }, box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } }, className: 'form-control', top: '248px', left: '218px', width: '100px', height: '23px', component: 'DocumentChoices', borderColor: 'blue' },
  constructionType: { name: 'constructionType', type: 'string', choices: { 0: { val: 'Wooden', width: '80px', className: 'document-rectangle', type: 'button' }, 1: { val: '', width: '80px', className: 'document-rectangle', type: 'string', margin: '8px 0 0 70px' } }, box: { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center' } }, className: 'form-control', top: '237px', left: '380px', width: '100px', height: '23px', component: 'DocumentChoices', borderColor: 'blue' }
}

export default DocumentForm;
// const DocumentForm = {
//   // flat_building_name: { top: '204px', left: '-120px', component: 'input', borderColor: 'blue', size: 'medium' }
//   flat_building_name: { name: 'flat_building_name', type: 'string', className: 'form-control', top: '177.5px', left: '200px', width: '490px', height: '23px', component: 'input', borderColor: 'blue' },
//   address: { name: 'address', type: 'string', className: 'form-control', top: '205.5px', left: '200px', width: '490px', height: '23px', component: 'input', borderColor: 'blue' },
//   washer: { name: 'washer', type: 'boolean', className: 'form-control', top: '420.5px', left: '412px', width: '100px', height: '23px', component: 'YesOrNo', borderColor: 'blue' }
// }
//
// export default DocumentForm;
