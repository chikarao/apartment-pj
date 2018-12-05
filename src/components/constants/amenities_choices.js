// Object for rendering amenities in respective appLanguageCode;
// Corresponds to attributes in the Amenity model in the api.
// Need to add if attribute added in api
const AmenitiesChoices = {
    0: { value: true, en: 'Yes', jp: '有り', type: 'boolean', className: 'form-rectangle' },
    1: { value: false, en: 'None', jp: '無し', type: 'boolean', className: 'form-rectangle' }
};

export default AmenitiesChoices;
