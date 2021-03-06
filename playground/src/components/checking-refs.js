import React from 'react';
import {RSInput, Button} from '@medmain/react-ui-kit';

/*
Stateful component to be included in the `Input` playground
to check if component "refs" are forwarded correctly.
*/

export class CheckingRefs extends React.Component {
  inputRefs = [0, 1, 2, 3].map(() => React.createRef());

  state = {
    values: {
      text1: 'First input',
      text2: 'Second input',
      accept: true,
      choice: 'Celtics'
    }
  };

  focus(refIndex) {
    const ref = this.inputRefs[refIndex];
    const node = ref.current;
    if (!node || !node.focus) {
      console.warn('No DOM node found with the ref!');
      return;
    }
    node.focus();
  }

  handleChange = event => {
    const {name, value, type, checked} = event.target;

    let newValue = value;
    if (type === 'checkbox') {
      newValue = Boolean(checked);
    }

    this.setState({values: {...this.state.values, [name]: newValue}});
  };

  render() {
    const {values} = this.state;
    return (
      <div>
        <RSInput
          name="text1"
          value={values.text1}
          ref={this.inputRefs[0]}
          onChange={this.handleChange}
        />
        <RSInput
          name="text2"
          value={values.text2}
          ref={this.inputRefs[1]}
          onChange={this.handleChange}
        />
        <hr />
        <div style={{display: 'flex', alignItems: 'center'}}>
          <RSInput
            id="accept"
            name="accept"
            type="checkbox"
            checked={values.accept === true}
            ref={this.inputRefs[2]}
            onChange={this.handleChange}
          />
          <label htmlFor="accept">I accept</label>
        </div>
        <hr />
        <div style={{}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <RSInput
              name="choice"
              type="radio"
              value="Celtics"
              checked={values.choice === 'Celtics'}
              ref={this.inputRefs[3]}
              onChange={this.handleChange}
            />
            <label>Celtics</label>
          </div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <RSInput
              name="choice"
              type="radio"
              value="Lakers"
              checked={values.choice === 'Lakers'}
              onChange={this.handleChange}
            />
            <label>Lakers</label>
          </div>
        </div>
        <hr />
        <p>Push the buttons to set the focus on...</p>
        <Button onClick={() => this.focus(0)}>1st field</Button>{' '}
        <Button onClick={() => this.focus(1)}>2nd field</Button>{' '}
        <Button onClick={() => this.focus(2)}>Checkbox</Button>{' '}
        <Button onClick={() => this.focus(3)}>Radio button</Button>
      </div>
    );
  }
}
