import React from 'react';
import _ from 'lodash';

const SelectField = ({
    input,
    label,
    meta: {touched, error},
    children
  }) => (
      <div>
        <select {...input} className="form-control">
          {children}
        </select>
        {touched && error &&
          <div className="error">
            <span style={{ color: 'red' }}>* </span>{error}
          </div>
        }
      </div>
    );

export default SelectField;
