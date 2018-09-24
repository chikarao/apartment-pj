import React, { Component } from 'react';
import _ from 'lodash';

import DocumentForm from '../constants/document_form';

class DocumentChoices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // confirmChecked: false
      inputValue: ''
    };
  }

  handleInputChange(event) {
    const { input: { value, onChange, name } } = this.props;
    return this.setState({ inputValue: event.target.value }, () => {
      console.log('DocumentChoices, handleInputChange this.state.inputValue', this.state.inputValue)
      onChange(this.state.inputValue);
    });
  }

  handleChoiceClick() {
    return this.setState({ inputValue: '' }, () => {
      console.log('DocumentChoices, handleInputChange this.state.inputValue', this.state.inputValue)
    });
  }
  // <button type="button" onClick={() => onChange(value + 1)}>Inc</button>
  // <button type="button" onClick={() => onChange(value - 1)}>Dec</button>
  renderEachChoice() {
    const { input: { value, onChange, name } } = this.props;
    return _.map(DocumentForm[name].choices, choice => {
      // console.log('DocumentChoices, renderEachChoice choice', choice);
      const buttonElement = <div
        key={choice.val}
        type={choice.type}
        onClick={() => {
          onChange(choice.val);
          this.handleChoiceClick();
        }}
        className={choice.className}
        style={value == choice.val ? { borderColor: 'black', width: choice.width } : { borderColor: 'lightgray', width: choice.width } } ></div>
      const inputElement = <input id="valueInput" key={choice.val} value={this.state.inputValue} onChange={this.handleInputChange.bind(this)} type={choice.type} className={choice.className} style={value == choice.val ? { borderColor: 'black', width: choice.width, margin: choice.margin } : { borderColor: 'lightgray', width: choice.width, margin: choice.margin } } />

      if (choice.type == 'string') {
        return inputElement;
      } else {
        return buttonElement;
      }
    })
  }
  render() {
    const { input: { value, onChange, name } } = this.props;
    // console.log('DocumentChoices, render this.props', this.props);
    // console.log('DocumentChoices, render value', value);
    // console.log('DocumentChoices, render name', name);
    // console.log('DocumentChoices, render onChange', onChange);
    // console.log('DocumentChoices, render value !== null', value !== null);
    // console.log('DocumentChoices, render value === ', value === '');
    // console.log('DocumentChoices, render value == undefined', value === undefined);
    // <div>The current value is {String(value)}.</div>

    // <div type={DocumentForm[name].box.type} onClick={() => onChange(val)} className={DocumentForm[name].box.className} style={value == val ? { borderColor: 'black' } : { borderColor: 'lightgray' } }>Y</div>
    return (
        <div key={name} style={DocumentForm[name].box.style}>
         {this.renderEachChoice()}
        </div>
    );
  }
}

export default DocumentChoices;
