import React, { Component } from 'react';

class YesOrNo extends Component {
  // <button type="button" onClick={() => onChange(value + 1)}>Inc</button>
  // <button type="button" onClick={() => onChange(value - 1)}>Dec</button>
  // <div>The current value is {value}.</div>
  render() {
    const { input: { value, onChange } } = this.props;
    console.log('YesOrNo, render value', value);
    console.log('YesOrNo, render onChange', onChange);
    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div type="button" onClick={() => onChange('true')} className="document-yes-no-circle" style={value == 'true' ? { borderColor: 'black' } : { borderColor: 'lightgray' } }>Y</div>
          <div type="button" onClick={() => onChange('false')} className="document-yes-no-circle" style={value == 'false' ? { borderColor: 'black' } : { borderColor: 'lightgray' } }>N</div>
        </div>
    )
  }
}

export default YesOrNo;
