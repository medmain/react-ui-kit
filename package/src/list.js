import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter} from 'radium-starter';

import {CheckboxInput} from './form';
import {withLocale} from './locale-context';

import {ChevronUpIcon} from './icons/chevron-up';
import {ChevronDownIcon} from './icons/chevron-down';

@withLocale
@withRadiumStarter
export class List extends React.Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    columnDefaults: PropTypes.shape({shrink: PropTypes.bool, truncate: PropTypes.bool}),
    bodyRows: PropTypes.object,
    items: PropTypes.array.isRequired,
    onHeaderClick: PropTypes.func,
    onItemClick: PropTypes.func,
    orderBy: PropTypes.string,
    orderDirection: PropTypes.string,
    selection: PropTypes.object,
    onSelect: PropTypes.func,
    style: PropTypes.object,
    locale: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
  };

  static defaultProps = {
    bodyRows: {},
    columnDefaults: {},
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

  getColumnDefaults() {
    const {
      columnDefaults: {shrink = true, truncate = false}
    } = this.props;
    return {shrink, truncate};
  }

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

    const columnDefaults = this.getColumnDefaults();
    const enableScrolling = columnDefaults.shrink === false; // no scrolling by default
    const hasFooter = columns.some(column => column.footerCell) && items.length > 0;
    const hasTruncatedColumn = columnDefaults.truncate || columns.some(column => column.truncate);

    const getCellTitle = ({item, title, render, truncate}) => {
      if (title) {
        return evaluate(title, item);
      }
      if (truncate) {
        const renderedContent = evaluate(render, item);
        if (typeof renderedContent === 'string') {
          return renderedContent;
        }
      }
    };

    return (
      <>
        <ListRoot
          style={style}
          tableStyle={{tableLayout: enableScrolling || hasTruncatedColumn ? 'fixed' : 'auto'}}
        >
          <ListHeader>
            <ListRow>
              {selection && (
                <ListCell
                  style={{
                    width: '28px',
                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}
                >
                  <CheckboxInput value={selection.mode === 'all'} onChange={this.toggleAllItems} />
                </ListCell>
              )}
              {columns.map(
                ({
                  path,
                  width = columnDefaults.width,
                  truncate = columnDefaults.truncate,
                  style: columnStyle = columnDefaults.style,
                  headerCell: {title, style: cellStyle, render}
                }) => {
                  const isCurrentOrder = orderBy === path;
                  if (isCurrentOrder) {
                    cellStyle = {...cellStyle, textDecoration: 'underline'};
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
                      title={getCellTitle({title, render, truncate})}
                      truncate={truncate}
                      style={{
                        width,
                        ...columnStyle,
                        ...cellStyle
                      }}
                    >
                      {evaluate(render)}
                      {isCurrentOrder && <SortMarker direction={orderDirection} />}
                    </ListCell>
                  );
                }
              )}
            </ListRow>
          </ListHeader>

          {items.length > 0 && (
            <ListBody>
              {items.map((item, index) => (
                <ListRow key={index} style={evaluate(bodyRows.style, item, index)}>
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
                  {columns.map(
                    ({
                      path,
                      width = columnDefaults.width,
                      truncate = columnDefaults.truncate,
                      style: columnStyle = columnDefaults.style,
                      bodyCell: {title, style: cellStyle, render}
                    }) => {
                      return (
                        <ListCell
                          key={path}
                          onClick={
                            onItemClick &&
                            (() => {
                              onItemClick(item, path);
                            })
                          }
                          title={getCellTitle({item, title, render, truncate})}
                          truncate={truncate}
                          style={{width, ...columnStyle, ...evaluate(cellStyle, item, index)}}
                        >
                          {evaluate(render, item)}
                        </ListCell>
                      );
                    }
                  )}
                </ListRow>
              ))}
            </ListBody>
          )}

          {hasFooter && (
            <ListFooter>
              <ListRow>
                {selection && <ListCell>&nbsp;</ListCell>}
                {columns.map(
                  ({
                    path,
                    width = columnDefaults.width,
                    truncate = columnDefaults.truncate,
                    style: columnStyle = columnDefaults.style,
                    footerCell: {style: cellStyle, title, render}
                  }) => {
                    return (
                      <ListCell
                        key={path}
                        title={getCellTitle({title, render, truncate})}
                        truncate={truncate}
                        style={{
                          width,
                          ...columnStyle,
                          ...cellStyle
                        }}
                      >
                        {evaluate(render)}
                      </ListCell>
                    );
                  }
                )}
              </ListRow>
            </ListFooter>
          )}
        </ListRoot>

        {!items.length && (
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
      </>
    );
  }
}

function evaluate(valueOrFunction, ...args) {
  if (typeof valueOrFunction === 'function') {
    return valueOrFunction(...args);
  }
  return valueOrFunction;
}

// === Low level components ===

const SectionContext = React.createContext();
const RowContext = React.createContext();

@withRadiumStarter
export class ListRoot extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    tableStyle: PropTypes.object,
    children: PropTypes.node.isRequired,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
  };

  render() {
    const {style, tableStyle, children} = this.props;

    return (
      <div
        style={{
          overflow: 'auto',
          ...style
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            borderSpacing: 0,
            ...tableStyle
          }}
        >
          {children}
        </table>
      </div>
    );
  }
}

export class ListHeader extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    children: PropTypes.node.isRequired
  };

  render() {
    const {children} = this.props;

    return (
      <thead>
        <SectionContext.Provider value={{type: 'HEADER'}}>
          <RowContext.Provider value={{position: ['WHATEVER']}}>{children}</RowContext.Provider>
        </SectionContext.Provider>
      </thead>
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
    const {children} = this.props;

    return (
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
    );
  }
}

export class ListFooter extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    children: PropTypes.node.isRequired
  };

  render() {
    const {children} = this.props;

    return (
      <tfoot>
        <SectionContext.Provider value={{type: 'FOOTER'}}>
          <RowContext.Provider value={{position: ['WHATEVER']}}>{children}</RowContext.Provider>
        </SectionContext.Provider>
      </tfoot>
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

              if (type === 'BODY' && !position.includes('LAST')) {
                style = {
                  ...s.bottomBorder,
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
    truncate: PropTypes.bool,
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.node
  };

  render() {
    let {onClick, title, truncate, style, children, styles: s, theme: t} = this.props;

    if (onClick) {
      style = {cursor: 'pointer', ...style};
    }

    return (
      <SectionContext.Consumer>
        {({type}) => {
          if (type === 'HEADER') {
            style = {
              position: 'sticky',
              top: 0,
              backgroundColor: t.altBackgroundColor,
              ...s.bold,
              ...style
            };
          }

          if (type === 'FOOTER') {
            style = {
              position: 'sticky',
              bottom: 0,
              backgroundColor: t.altBackgroundColor,
              ...s.bold,
              ...style
            };
          }

          return (
            <td
              onClick={onClick}
              title={title}
              style={{
                padding: '8px',
                verticalAlign: 'middle',
                ...(truncate && {
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis'
                }),
                ...style
              }}
            >
              {children}
            </td>
          );
        }}
      </SectionContext.Consumer>
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
