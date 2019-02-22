import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter} from 'radium-starter';

@withRadiumStarter
export class Tabs extends React.Component {
  static propTypes = {
    // For uncontrolled tabs: provide the initial tab id
    initialActiveTab: PropTypes.string,
    // For controlled tabs: provide the active tab id and a callback
    activeTab: PropTypes.string,
    onChange: PropTypes.func,
    // Other props
    style: PropTypes.object,
    children: PropTypes.node.isRequired,
    styles: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
  };

  state = {activeTab: this.props.initialActiveTab};

  isControlled = () => {
    return this.props.activeTab !== undefined;
  };

  getActiveTab = () => {
    return this.isControlled() ? this.props.activeTab : this.state.activeTab;
  };

  setActiveTab = id => {
    if (this.isControlled()) {
      this.props.onChange(id);
    } else {
      this.setState({activeTab: id});
    }
  };

  render() {
    const {style, children} = this.props;
    const activeTab = this.getActiveTab();

    const tabItems = React.Children.toArray(children).map((element, index) => {
      const {
        props: {id = `tab-${index.toString()}`, title}
      } = element;
      return {id, title, element};
    });
    const activeTabItem = tabItems.find(tab => tab.id === activeTab) || tabItems[0];

    return (
      <>
        <TabBar
          tabItems={tabItems}
          activeTab={activeTabItem.id}
          setActiveTab={this.setActiveTab}
          style={style}
        />
        {activeTabItem.element}
      </>
    );
  }
}

export const Tab = ({children}) => {
  return children;
};
Tab.propTypes = {
  id: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  children: PropTypes.node.isRequired
};

@withRadiumStarter
class TabBar extends React.Component {
  static propTypes = {
    tabItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
      })
    ).isRequired,
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    style: PropTypes.object,
    styles: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
  };

  render() {
    const {tabItems, activeTab, setActiveTab, style, styles: s, theme: t} = this.props;
    const {
      backgroundColor,
      borderColor,
      borderRadius,
      borderWidth,
      buttonXPadding,
      buttonYPadding
    } = t;
    return (
      <ul
        style={{
          ...s.unstyledList,
          borderBottom: `${borderWidth} solid ${borderColor}`,
          ...style
        }}
      >
        {tabItems.map(({id, title}) => {
          const isActive = id === activeTab;
          return (
            <li
              key={id}
              onClick={isActive ? undefined : () => setActiveTab(id)}
              style={{
                display: 'inline-block',
                bottom: '-1px',
                position: 'relative',
                listStyle: 'none',
                padding: `${buttonYPadding} ${buttonXPadding}`,
                backgroundColor: isActive ? backgroundColor : undefined,
                borderWidth,
                borderStyle: 'solid',
                borderColor: isActive ? borderColor : 'transparent',
                borderRadius: isActive ? `${borderRadius} ${borderRadius} 0 0` : undefined,
                borderBottom: 'none',
                cursor: !isActive ? 'pointer' : undefined
              }}
            >
              {typeof title === 'function' ? title() : title}
            </li>
          );
        })}
      </ul>
    );
  }
}
