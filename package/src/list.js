import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter} from 'radium-starter';
import {ItemSelection} from '@medmain/core';

import {CheckboxInput} from './form';
import {withLocale} from './locale-context';

import {ChevronUpIcon} from './icons/chevron-up';
import {ChevronDownIcon} from './icons/chevron-down';

const SectionContext = React.createContext();
const RowContext = React.createContext();

@withLocale
@withRadiumStarter
export class List extends React.Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    bodyRows: PropTypes.object,
    items: PropTypes.array.isRequired,
    onHeaderClick: PropTypes.func,
    onItemClick: PropTypes.func,
    orderBy: PropTypes.string,
    orderDirection: PropTypes.string,
    selection: PropTypes.instanceOf(ItemSelection),
    onSelect: PropTypes.func,
    locale: PropTypes.object.isRequired,
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
  };

  static defaultProps = {
    bodyRows: {},
    onSelect: () => {}
  };

  toggleItem = (itemId, checked, shiftKey) => {
    let {items, selection, onSelect} = this.props;

    if (shiftKey) {
      const itemIds = items.map(item => item.id);
      selection = selection.toggleItemRange(itemId, checked, itemIds);
    } else {
      selection = selection.toggleItem(itemId, checked);
    }

    onSelect(selection);
  };

  toggleAllItems = checked => {
    let {onSelect, selection} = this.props;

    selection = selection.toggleAllItems(checked);

    onSelect(selection);
  };

  render() {
    const {
      columns,
      bodyRows,
      items,
      onHeaderClick,
      onItemClick,
      orderBy,
      orderDirection,
      selection,
      style,
      locale: l,
      styles: s
    } = this.props;

    const hasFooter = columns.some(column => column.footerCell);

    return (
      <div
        style={{
          minHeight: 0, // https://stackoverflow.com/questions/28636832/firefox-overflow-y-not-working-with-nested-flexbox/28639686#28639686
          display: 'flex',
          flexDirection: 'column',
          ...style
        }}
      >
        <ListHeader>
          <ListRow>
            {selection && (
              <td
                style={{
                  width: '28px',
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }}
              >
                <CheckboxInput value={selection.mode === 'all'} onChange={this.toggleAllItems} />
              </td>
            )}
            {columns.map(({path, width, headerCell: {title, style, render}}) => {
              const isCurrentOrder = orderBy === path;
              if (isCurrentOrder) {
                style = {...style, textDecoration: 'underline'};
              }
              return (
                <ListCell
                  key={path}
                  onClick={
                    onHeaderClick &&
                    (() => {
                      onHeaderClick(path);
                    })
                  }
                  title={title && title()}
                  style={{width, ...style}}
                >
                  {render()}
                  {isCurrentOrder && <SortMarker direction={orderDirection} />}
                </ListCell>
              );
            })}
          </ListRow>
        </ListHeader>

        {items.length > 0 && (
          <ListBody style={{flexGrow: 1, flexShrink: 1, overflowY: 'scroll'}}>
            {items.map((item, index) => (
              <ListRow key={index} style={normalizeStyle(bodyRows.style)(item, index)}>
                {selection && (
                  <td
                    key={name}
                    style={{
                      width: '28px',
                      textAlign: 'center',
                      verticalAlign: 'middle'
                    }}
                  >
                    <CheckboxInput
                      value={selection.isItemSelected(item.id)}
                      onChange={(checked, {nativeEvent: {shiftKey}}) => {
                        this.toggleItem(item.id, checked, shiftKey);
                      }}
                    />
                  </td>
                )}
                {columns.map(({path, width, bodyCell: {title, style, render}}) => {
                  return (
                    <ListCell
                      key={path}
                      onClick={
                        onItemClick &&
                        (() => {
                          onItemClick(item, path);
                        })
                      }
                      title={title && title(item)}
                      style={{width, ...normalizeStyle(style)(item, index)}}
                    >
                      {render(item)}
                    </ListCell>
                  );
                })}
              </ListRow>
            ))}
          </ListBody>
        )}

        {hasFooter && (
          <ListFooter>
            <ListRow>
              {columns.map(({path, width, footerCell: {style, render}}) => {
                return (
                  <ListCell key={path} style={{width, ...style}}>
                    {render()}
                  </ListCell>
                );
              })}
            </ListRow>
          </ListFooter>
        )}

        {items.length === 0 && (
          <div
            style={{
              ...s.centeredContent,
              paddingTop: '3rem',
              paddingBottom: '3rem',
              ...s.mutedText
            }}
          >
            {l.listNoItemsFound}
          </div>
        )}
      </div>
    );
  }
}

export default List;

function normalizeStyle(style) {
  return typeof style === 'function' ?
    style :
    function () {
      return style;
    };
}

const tableStyle = {
  tableLayout: 'fixed',
  width: '100%',
  maxWidth: '100%',
  borderCollapse: 'collapse',
  borderSpacing: 0
};

export class ListHeader extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    children: PropTypes.node.isRequired
  };

  render() {
    const {style, children} = this.props;

    return (
      <div style={{...style}}>
        <table style={{...tableStyle}}>
          <thead>
            <SectionContext.Provider value={{type: 'HEADER'}}>
              <RowContext.Provider value={{position: ['WHATEVER']}}>{children}</RowContext.Provider>
            </SectionContext.Provider>
          </thead>
        </table>
      </div>
    );
  }
}

@withRadiumStarter
export class ListBody extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
  };

  render() {
    const {style, children} = this.props;

    return (
      <div style={{...style}}>
        <table style={{...tableStyle}}>
          <tbody>
            <SectionContext.Provider value={{type: 'BODY'}}>
              {children.map((child, index) => {
                const position = [];
                if (index === 0) {
                  position.push('FIRST');
                }
                if (index === children.length - 1) {
                  position.push('LAST');
                }
                if ((position + 1) % 2 === 0) {
                  position.push('EVEN');
                } else {
                  position.push('ODD');
                }
                return (
                  <RowContext.Provider key={index} value={{position}}>
                    {child}
                  </RowContext.Provider>
                );
              })}
            </SectionContext.Provider>
          </tbody>
        </table>
      </div>
    );
  }
}

export class ListFooter extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    children: PropTypes.node.isRequired
  };

  render() {
    const {style, children} = this.props;

    return (
      <div style={{...style}}>
        <table style={{...tableStyle}}>
          <tfoot>
            <SectionContext.Provider value={{type: 'FOOTER'}}>
              <RowContext.Provider value={{position: ['WHATEVER']}}>{children}</RowContext.Provider>
            </SectionContext.Provider>
          </tfoot>
        </table>
      </div>
    );
  }
}

@withRadiumStarter
export class ListRow extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
  };

  render() {
    const {theme: t, styles: s} = this.props;
    return (
      <SectionContext.Consumer>
        {({type}) => (
          <RowContext.Consumer>
            {({position}) => {
              let {onClick, style, children} = this.props;

              if (type === 'HEADER') {
                style = {
                  ...s.bold,
                  backgroundColor: t.altBackgroundColor,
                  whiteSpace: 'nowrap',
                  ...style
                };
              }

              if (type === 'BODY' && !position.includes('LAST')) {
                style = {
                  ...s.bottomBorder,
                  ...style
                };
              }

              if (type === 'FOOTER') {
                style = {
                  ...s.bold,
                  backgroundColor: t.altBackgroundColor,
                  whiteSpace: 'nowrap',
                  ...style
                };
              }

              if (onClick) {
                style = {cursor: 'pointer', ...style};
              }

              return (
                <tr onClick={onClick} style={{fontSize: t.smallFontSize, ...style}}>
                  {children}
                </tr>
              );
            }}
          </RowContext.Consumer>
        )}
      </SectionContext.Consumer>
    );
  }
}

@withRadiumStarter
export class ListCell extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    title: PropTypes.string,
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.node
  };

  render() {
    let {onClick, title, style, children} = this.props;

    if (onClick) {
      style = {cursor: 'pointer', ...style};
    }

    return (
      <td
        onClick={onClick}
        title={title}
        style={{
          padding: '8px',
          verticalAlign: 'baseline',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          ...style
        }}
      >
        {children}
      </td>
    );
  }
}

@withRadiumStarter
export class SortMarker extends React.Component {
  static propTypes = {
    direction: PropTypes.string, // Possible values: 'ASC' (default) or 'DESC'
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
  };

  static defaultProps = {
    direction: 'ASC'
  };

  render() {
    const {direction, theme: t} = this.props;

    const Component = direction === 'ASC' ? ChevronUpIcon : ChevronDownIcon;

    return (
      <Component
        size={18}
        color={t.altTextColor}
        style={{
          marginLeft: '.2rem',
          verticalAlign: '-5px'
        }}
      />
    );
  }
}
