import SelectField from '../forms/select_field.js';
// import Building from '../constants/building.js';
import Amenities from './amenities.js';
import FlatForDocuments from '../constants/flat_for_documents.js';
import Building from './building.js';

import ImportantPointsExplanationBilingualAll from './important_points_explanation_bilingual_all';

const Base = ImportantPointsExplanationBilingualAll;

// NOTE: imported into /contants/documents.js

// constant file referred to as 'model'; record refers to backend records flat, profile, user
// fieldset for inputs takes absolute positioning
// fieldset form-group-document, takes params.top, params.left, params.width
// Anything iside params objects needs to be in snake case eg input_type for use in rails api
// !!!! Only height needs to be px NOT %; however, textarea height works with %
// !!!add required: true for validation at submit
// !!! when there is a boolean params.val, there needs to be an initial value of true of false,
// otherwise, first click on false will not work since there is no value in document choices
// can make params.val boolean a string but need to make consistent for all

const ImportantPointsExplanationBilingualByPage = {
  1: {
    document_name: Base.document_name,
    tenant_name: Base.tenant_name,
    date_year: Base.date_year,
    date_month: Base.date_month,
    date_day: Base.date_day,
    broker_company_name: Base.broker_company_name,
    broker_company_name_translation: Base.broker_company_name_translation,
    broker_representative_name: Base.broker_representative_name,
    broker_representative_name_translation: Base.broker_representative_name_translation,
    broker_address_hq: Base.broker_address_hq,
    broker_address_hq_translation: Base.broker_address_hq_translation,
    broker_registration_number: Base.broker_registration_number,
    broker_registration_date: Base.broker_registration_date,
    broker_staff_name: Base.broker_staff_name,
    broker_staff_name_translation: Base.broker_staff_name_translation,
    broker_staff_registration: Base.broker_staff_registration,
    broker_staff_address: Base.broker_staff_address,
    broker_staff_address_translation: Base.broker_staff_address_translation,
    broker_staff_phone: Base.broker_staff_phone,
    contract_work_sub_type: Base.contract_work_sub_type,
    address: Base.address,
    address_translation: Base.address_translation,
    name: Base.name,
    name_translation: Base.name_translation,
    unit: Base.unit,
    size: Base.size,
    floor_area_official: Base.floor_area_official,
    construction: Base.construction,
    construction_translation: Base.construction_translation,
    owner_name: Base.owner_name,
    owner_name_translation: Base.owner_name_translation,
    owner_address: Base.owner_address,
    owner_address_translation: Base.owner_address_translation,

  },
  2: {
    flat_owner_name: Base.flat_owner_name,
    flat_owner_name_translation: Base.flat_owner_name_translation,
    flat_owner_address: Base.flat_owner_address,
    flat_owner_address_translation: Base.flat_owner_address_translation,
    ownership_rights: Base.ownership_rights,
    ownership_rights_translation: Base.ownership_rights_translation,
    other_rights: Base.other_rights,
    other_rights_translation: Base.other_rights_translation,
    legal_restrictions: Base.legal_restrictions,
    legal_restrictions_translation: Base.legal_restrictions_translation,
    legal_restrictions_summary: Base.legal_restrictions_summary,
    legal_restrictions_summary_translation: Base.legal_restrictions_summary_translation,
    water: Base.water,
    water_year: Base.water_year,
    water_month: Base.water_month,
    water_day: Base.water_day,
    water_scheduled: Base.water_scheduled,
    water_notes: Base.water_notes,
    water_notes_translation: Base.water_notes_translation,
    electricity: Base.electricity,
    electricity_translation: Base.electricity_translation,
    electricity_year: Base.electricity_year,
    electricity_month: Base.electricity_month,
    electricity_day: Base.electricity_day,
    electricity_scheduled: Base.electricity_scheduled,
    electricity_scheduled_translation: Base.electricity_scheduled_translation,
    electricity_notes: Base.electricity_notes,
    electricity_notes_translation: Base.electricity_notes_translation,
    gas: Base.gas,
    gas_year: Base.gas_year,
    gas_month: Base.gas_month,
    gas_day: Base.gas_day,
    gas_scheduled: Base.gas_scheduled,
    gas_notes: Base.gas_notes,
    gas_notes_translation: Base.gas_notes_translation,
    sewage: Base.sewage,
    sewage_translation: Base.sewage_translation,
    sewage_year: Base.sewage_year,
    sewage_month: Base.sewage_month,
    sewage_day: Base.sewage_day,
    sewage_scheduled: Base.sewage_scheduled,
    sewage_scheduled_translation: Base.sewage_scheduled_translation,
    sewage_notes: Base.sewage_notes,
    sewage_notes_translation: Base.sewage_notes_translation,
    building_inspection_conducted: Base.building_inspection_conducted,
    building_inspection_summary: Base.building_inspection_summary,
    building_inspection_summary_translation: Base.building_inspection_summary_translation,
  },
  3: {
    kitchen: Base.kitchen,
    kitchen_format: Base.kitchen_format,
    kitchen_format_translation: Base.kitchen_format_translation,
    kitchen_other: Base.kitchen_other,
    kitchen_other_translation: Base.kitchen_other_translation,
    toilet: Base.toilet,
    toilet_format: Base.toilet_format,
    toilet_format_translation: Base.toilet_format_translation,
    toilet_other: Base.toilet_other,
    toilet_other_translation: Base.toilet_other_translation,
    bath_tub: Base.bath_tub,
    bath_tub_format: Base.bath_tub_format,
    bath_tub_format_translation: Base.bath_tub_format_translation,
    bath_tub_other: Base.bath_tub_other,
    bath_tub_other_translation: Base.bath_tub_other_translation,
    hot_water: Base.hot_water,
    hot_water_format: Base.hot_water_format,
    hot_water_format_translation: Base.hot_water_format_translation,
    hot_water_other: Base.hot_water_other,
    hot_water_other_translation: Base.hot_water_other_translation,
    kitchen_grill: Base.kitchen_grill,
    kitchen_grill_format: Base.kitchen_grill_format,
    kitchen_grill_format_translation: Base.kitchen_grill_format_translation,
    kitchen_grill_other: Base.kitchen_grill_other,
    kitchen_grill_other_translation: Base.kitchen_grill_other_translation,
    ac: Base.ac,
    ac_format: Base.ac_format,
    ac_format_translation: Base.ac_format_translation,
    ac_other: Base.ac_other,
    ac_other_translation: Base.ac_other_translation,
    equipment1_name: Base.equipment1_name,
    equipment1_name_translation: Base.equipment1_name_translation,
    equipment1: Base.equipment1,
    equipment1_format: Base.equipment1_format,
    equipment1_format_translation: Base.equipment1_format_translation,
    equipment1_other: Base.equipment1_other,
    equipment1_other_translation: Base.equipment1_other_translation,
    equipment2_name: Base.equipment2_name,
    equipment2_name_translation: Base.equipment2_name_translation,
    equipment2: Base.equipment2,
    equipment2_format: Base.equipment2_format,
    equipment2_format_translation: Base.equipment2_format_translation,
    equipment2_other: Base.equipment2_other,
    equipment2_other_translation: Base.equipment2_other_translation,
    inside_disaster_prevention: Base.inside_disaster_prevention,
    inside_disaster_warning: Base.inside_disaster_warning,
    inside_tsunami_warning: Base.inside_tsunami_warning,
    asbestos_record: Base.asbestos_record,
    asbestos_survey_contents: Base.asbestos_survey_contents,
    asbestos_survey_contents_translation: Base.asbestos_survey_contents_translation,

  },
  4: {
    earthquake_study_performed: Base.earthquake_study_performed,
    earthquake_study_contents: Base.earthquake_study_contents,
    earthquake_study_contents_translation: Base.earthquake_study_contents_translation,
    other_payments1: Base.other_payments1,
    other_payments1_explanation: Base.other_payments1_explanation,
    other_payments1_explanation_translation: Base.other_payments1_explanation_translation,
    other_payments2: Base.other_payments2,
    other_payments2_explanation: Base.other_payments2_explanation,
    other_payments2_explanation_translation: Base.other_payments2_explanation_translation,
    other_payments3: Base.other_payments3,
    other_payments3_explanation: Base.other_payments3_explanation,
    other_payments3_explanation_translation: Base.other_payments3_explanation_translation,
    other_payments4: Base.other_payments4,
    other_payments4_explanation: Base.other_payments4_explanation,
    other_payments4_explanation_translation: Base.other_payments4_explanation_translation,
    contract_break_terms: Base.contract_break_terms,
    contract_break_terms_translation: Base.contract_break_terms_translation,
  },
  5: {
    warranties: Base.warranties,
    warranties_translation: Base.warranties_translation,
    escrow_for_deposit: Base.escrow_for_deposit,
    escrow_agent_deposit: Base.escrow_agent_deposit,
    escrow_agent_deposit_translation: Base.escrow_agent_deposit_translation,
    from_year: Base.from_year,
    from_month: Base.from_month,
    from_day: Base.from_day,
    to_year: Base.to_year,
    to_month: Base.to_month,
    to_day: Base.to_day,
    contract_length_years: Base.contract_length_years,
    contract_length_months: Base.contract_length_months,
    contract_type: Base.contract_type,
    contract_renewal_terms: Base.contract_renewal_terms,
    contract_renewal_terms_translation: Base.contract_renewal_terms_translation,
  },
  6: {
    limitations_use: Base.limitations_use,
    limitations_use_translation: Base.limitations_use_translation,
    limitations_use_other: Base.limitations_use_other,
    limitations_use_other_translation: Base.limitations_use_other_translation,
    restrictions_use: Base.restrictions_use,
    restrictions_use_translation: Base.restrictions_use_translation,
    restrictions_use_other: Base.restrictions_use_other,
    restrictions_use_other_translation: Base.restrictions_use_other_translation,
    deposit_return_terms: Base.deposit_return_terms,
    deposit_return_terms_translation: Base.deposit_return_terms_translation,
    building_management_company: Base.building_management_company,
    building_management_company_translation: Base.building_management_company_translation,
    building_management_registration: Base.building_management_registration,
    building_management_address: Base.building_management_address,
    building_management_address_translation: Base.building_management_address_translation,
  },
  7: {
    bond_deposit_office: Base.bond_deposit_office,
    bond_deposit_office_translation: Base.bond_deposit_office_translation,
    bond_deposit_office_address: Base.bond_deposit_office_address,
    bond_deposit_office_address_translation: Base.bond_deposit_office_address_translation,
    guaranty_association_name: Base.guaranty_association_name,
    guaranty_association_name_translation: Base.guaranty_association_name_translation,
    guaranty_association_address: Base.guaranty_association_address,
    guaranty_association_address_translation: Base.guaranty_association_address_translation,
    guaranty_association_office_address: Base.guaranty_association_office_address,
    guaranty_association_office_address_translation: Base.guaranty_association_office_address_translation,
    bond_deposit_office_1: Base.bond_deposit_office_1,
    bond_deposit_office_1_translation: Base.bond_deposit_office_1_translation,
    bond_deposit_office_address_1: Base.bond_deposit_office_address_1,
    bond_deposit_office_address_1_translation: Base.bond_deposit_office_address_1_translation,

  },
  8: {
    date_prepared: Base.date_prepared,
    building_name_1: Base.building_name_1,
    building_name_1_translation: Base.building_name_1_translation,
    address_1: Base.address_1,
    address_1_translation: Base.address_1_translation,
    address_check: Base.address_check,
    address_site_check: Base.address_site_check,
    building_name_2: Base.building_name_2,
    building_name_2_translation: Base.building_name_2_translation,
    unit_1: Base.unit_1,
    construction_1: Base.construction_1,
    floors: Base.floors,
    floors_underground: Base.floors_underground,
    size_1: Base.size_1,
    inspection_date: Base.inspection_date,
    flat_type: Base.flat_type,
    flat_sub_type: Base.flat_sub_type,
    degradation_exists_wooden: Base.degradation_exists_wooden,
    foundation: Base.foundation,
    floor_assembly: Base.floor_assembly,
    floor: Base.floor,
    pillars: Base.pillars,
    exterior_walls: Base.exterior_walls,
    balcony: Base.balcony,
    interior_walls: Base.interior_walls,
    ceilings: Base.ceilings,
    roof_truss: Base.roof_truss,
    termite_damage: Base.termite_damage,
    corrosion: Base.corrosion,
    reinforcement: Base.reinforcement,
    concrete_compression: Base.concrete_compression,
    exterior_walls_rain: Base.exterior_walls_rain,
    eaves_rain: Base.eaves_rain,
    balcony_rain: Base.balcony_rain,
    interior_walls_rain: Base.interior_walls_rain,
    ceilings_rain: Base.ceilings_rain,
    roof_truss_rain: Base.roof_truss_rain,
    roof: Base.roof,
  },
  9: {
    inspector_name: Base.inspector_name,
    inspector_name_translation: Base.inspector_name_translation,
    inspector_trainer: Base.inspector_trainer,
    inspector_trainer_translation: Base.inspector_trainer_translation,
    inspector_certificate_number: Base.inspector_certificate_number,
    architect_qualification_type: Base.architect_qualification_type,
    architect_type: Base.architect_type,
    architect_registration_number: Base.architect_registration_number,
    architect_registration_jurisdiction: Base.architect_registration_jurisdiction,
    architect_registration_jurisdiction_translation: Base.architect_registration_jurisdiction_translation,
    architect_office_name: Base.architect_office_name,
    architect_office_name_translation: Base.architect_office_name_translation,
    architect_office_registration_jurisdiction: Base.architect_office_registration_jurisdiction,
    architect_office_registration_jurisdiction_translation: Base.architect_office_registration_jurisdiction_translation,
    architect_office_registration: Base.architect_office_registration,
  },
  10: {
    date_prepared_1: Base.date_prepared_1,
    building_name_3: Base.building_name_3,
    building_name_3_translation: Base.building_name_3_translation,
    address_2: Base.address_2,
    address_2_translation: Base.address_2_translation,
    address_check_1: Base.address_check_1,
    address_site_check_1: Base.address_site_check_1,
    building_name_4: Base.building_name_4,
    building_name_4_translation: Base.building_name_4_translation,
    unit_2: Base.unit_2,
    construction_2: Base.construction_2,
    floors_1: Base.floors_1,
    floors_underground_1: Base.floors_underground_1,
    size_2: Base.size_2,
    inspection_date_1: Base.inspection_date_1,
    flat_type_1: Base.flat_type_1,
    flat_sub_type_1: Base.flat_sub_type_1,
    degradation_exists_concrete: Base.degradation_exists_concrete,
    foundation_1: Base.foundation_1,
    floor_1: Base.floor_1,
    pillars_1: Base.pillars_1,
    exterior_walls_1: Base.exterior_walls_1,
    balcony_1: Base.balcony_1,
    halls: Base.halls,
    interior_walls_1: Base.interior_walls_1,
    ceilings_1: Base.ceilings_1,
    reinforcement_1: Base.reinforcement_1,
    concrete_compression_1: Base.concrete_compression_1,
    exterior_walls_rain_1: Base.exterior_walls_rain_1,
    interior_walls_rain_1: Base.interior_walls_rain_1,
    ceilings_rain_1: Base.ceilings_rain_1,
    roof_1: Base.roof_1,
},
  11: {
    inspector_name_1: Base.inspector_name_1,
    inspector_name_1_translation: Base.inspector_name_1_translation,
    inspector_trainer_1: Base.inspector_trainer_1,
    inspector_trainer_1_translation: Base.inspector_trainer_1_translation,
    inspector_certificate_number_1: Base.inspector_certificate_number_1,
    architect_qualification_type_1: Base.architect_qualification_type_1,
    architect_type_1: Base.architect_type_1,
    architect_registration_number_1: Base.architect_registration_number_1,
    architect_registration_jurisdiction_1: Base.architect_registration_jurisdiction_1,
    architect_registration_jurisdiction_1_translation: Base.architect_registration_jurisdiction_1_translation,
    architect_office_name_1: Base.architect_office_name_1,
    architect_office_name_1_translation: Base.architect_office_name_1_translation,
    architect_office_registration_jurisdiction_1: Base.architect_office_registration_jurisdiction_1,
    architect_office_registration_jurisdiction_1_translation: Base.architect_office_registration_jurisdiction_1_translation,
    architect_office_registration_1: Base.architect_office_registration_1,
  },
};

export default ImportantPointsExplanationBilingualByPage;
