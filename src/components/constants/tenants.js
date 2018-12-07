// Object for configuring input and edit of tenants in booking_request.js

const Tenants = {
  co_tenant_name: {
    name: 'co_tenant_name',
    en: '1. Tenant Name',
    jp: '1. 同居人名',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'tenants',
    // maps to tenant_name in api model tenant
    tenantObjectMap: 'name',
    group: 0
  },

  co_tenant_age: {
    name: 'co_tenant_age',
    en: 'Age',
    jp: '年齢',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'tenants',
    tenantObjectMap: 'age',
    group: 0
  },

  co_tenant_name_1: {
    name: 'co_tenant_name_1',
    en: '2. Tenant Name',
    jp: '2. 同居人名',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'tenants',
    tenantObjectMap: 'name',
    group: 1
  },

  co_tenant_age_1: {
    name: 'co_tenant_age_1',
    en: 'Age',
    jp: '年齢',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'tenants',
    tenantObjectMap: 'age',
    group: 1
  },

  co_tenant_name_2: {
    name: 'co_tenant_name_2',
    en: '3. Tenant Name',
    jp: '3. 同居人名',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'tenants',
    tenantObjectMap: 'name',
    group: 2
  },

  co_tenant_age_2: {
    name: 'co_tenant_age',
    en: 'Age',
    jp: '年齢',
    component: 'input',
    type: 'string',
    className: 'form-control',
    category: 'tenants',
    tenantObjectMap: 'age',
    group: 2
  },
};

export default Tenants;
