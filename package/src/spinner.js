import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter} from 'radium-starter';
import MDSpinner from 'react-md-spinner';

@withRadiumStarter
export class Spinner extends React.Component {
  static propTypes = {
    size: PropTypes.number,
    delay: PropTypes.number,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
  };

  static defaultProps = {
    delay: 0
  };

  state = {
    isVisible: this.props.delay === 0
  };

  componentDidMount() {
    this.timeoutId = setTimeout(() => {
      this.setState({isVisible: true});
    }, this.props.delay);
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  render() {
    const {size, theme: t} = this.props;

    if (!this.state.isVisible) {
      return null;
    }

    return (
      <MDSpinner
        size={size}
        color1={t.primaryColor}
        color2={t.accentColor}
        color3={t.primaryColor}
        color4={t.accentColor}
      />
    );
  }
}
