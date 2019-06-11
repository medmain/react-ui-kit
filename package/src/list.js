import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter} from 'radium-starter';
import get from 'lodash/get';
import isPlainObject from 'lodash/isPlainObject';

import {CheckboxInput} from './input';
import {withLocale} from './locale-context';
import {ChevronUpIcon} from './icons/chevron-up';
import {ChevronDownIcon} from './icons/chevron-down';
import {Popover} from './popover';
import {Menu} from './menu';

export class List extends React.Component {
  render() {
    const {contextMenuItems, style} = this.props;

    return (
      <div style={{overflow: 'auto', ...style}}>
        {contextMenuItems ? <ListWithMenu {...this.props} /> : <BasicList {...this.props} />}
      </div>
    );
  }
}

@withLocale
@withRadiumStarter
class BasicList extends React.Component {
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
    onContextMenu: PropTypes.func,
    style: PropTypes.object,
    locale: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
  };

  static defaultProps = {
    bodyRows: {},
    columnDefaults: {shrink: false, truncate: false},
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

  renderCellContent({content, item, path}) {
    if (content !== undefined) {
      return evaluate(content, item); // caution: `render` can be an empty string
    }
    if (item) {
      return get(item, path); // get a property from a nested object using a "dot path"
    }
    return path;
  }

  selectContextMenuItem(itemId) {
    let {onSelect, selection} = this.props;

    if (!selection.isItemSelected(itemId)) {
      selection = selection.toggleAllItems(false);
      selection = selection.toggleItem(itemId, true);
      onSelect(selection);
    }
  }

  render() {
    const {
      columns: rawColumns,
      bodyRows,
      items,
      onHeaderClick,
      onItemClick,
      orderBy,
      orderDirection,
      selection,
      onContextMenu,
      style,
      locale: l,
      styles: s
    } = this.props;

    const columns = rawColumns.map(normalizeColumnDefinition);
    const columnDefaults = {
      ...this.constructor.defaultProps.columnDefaults,
      ...this.props.columnDefaults
    };
    const enableScrolling = columnDefaults.shrink === false; // no scrolling by default
    const hasFooter = columns.some(column => column.footerCell) && items.length > 0;
    const hasTruncatedColumn = columnDefaults.truncate || columns.some(column => column.truncate);

    return (
      <>
        <ListRoot
          style={{...style, tableLayout: enableScrolling || hasTruncatedColumn ? 'fixed' : 'auto'}}
        >
          <ListHeader>
            <ListRow>
              {selection && (
                <ListCell
                  style={{
                    width: '28px',
                    verticalAlign: 'middle',
                    padding: '0 0 0 5px'
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
                  headerCell: {tooltip, style: cellStyle, content} = {}
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
                      tooltip={getCellTooltipLabel({tooltip, content, truncate})}
                      truncate={truncate}
                      style={{
                        width,
                        ...columnStyle,
                        ...cellStyle
                      }}
                    >
                      {this.renderCellContent({content, path})}
                      {isCurrentOrder && <SortMarker direction={orderDirection} />}
                    </ListCell>
                  );
                }
              )}
            </ListRow>
          </ListHeader>

          {items.length > 0 && (
            <ListBody>
              {items.map((item, index) => {
                const handleContextMenu =
                  onContextMenu &&
                  (event => {
                    this.selectContextMenuItem(item.id);
                    onContextMenu(event);
                  });

                return (
                  <ListRow key={index} style={evaluate(bodyRows.style, item, index)}>
                    {selection && (
                      <ListCell
                        key={name}
                        isItemSelected={selection?.isItemSelected(item.id)}
                        onContextMenu={handleContextMenu}
                        style={{
                          width: '28px',
                          verticalAlign: 'middle',
                          padding: '0 0 0 5px'
                        }}
                      >
                        <CheckboxInput
                          value={selection.isItemSelected(item.id)}
                          onChange={(checked, {nativeEvent: {shiftKey}}) => {
                            this.toggleItem(item.id, checked, shiftKey);
                          }}
                        />
                      </ListCell>
                    )}
                    {columns.map(
                      ({
                        path,
                        width = columnDefaults.width,
                        truncate = columnDefaults.truncate,
                        style: columnStyle = columnDefaults.style,
                        bodyCell: {tooltip, style: cellStyle, content} = {}
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
                            onContextMenu={handleContextMenu}
                            tooltip={getCellTooltipLabel({item, tooltip, content, truncate})}
                            truncate={truncate}
                            isItemSelected={selection?.isItemSelected(item.id)}
                            style={{width, ...columnStyle, ...evaluate(cellStyle, item, index)}}
                          >
                            {this.renderCellContent({content, item, path})}
                          </ListCell>
                        );
                      }
                    )}
                  </ListRow>
                );
              })}
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
                    footerCell: {style: cellStyle, tooltip, content} = {}
                  }) => {
                    return (
                      <ListCell
                        key={path}
                        tooltip={getCellTooltipLabel({tooltip, content, truncate})}
                        truncate={truncate}
                        style={{
                          width,
                          ...columnStyle,
                          ...cellStyle
                        }}
                      >
                        {this.renderCellContent({content, path})}
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

class ListWithMenu extends React.Component {
  // We do like GMail after a right click on a row:
  // Do nothing if the row item was already selected, otherwise select ONLY the row item.
  render() {
    const {contextMenuItems} = this.props;

    const content =
      typeof contextMenuItems === 'function' ?
        contextMenuItems :
        ({close}) => <Menu items={contextMenuItems} onClick={close} />;

    return (
      <Popover content={content} position={'cursor'}>
        {({open}) => {
          return <BasicList {...this.props} onContextMenu={open} />;
        }}
      </Popover>
    );
  }
}

// === Helper functions ===

function normalizeColumnDefinition({headerCell, bodyCell, footerCell, ...colDefinition}) {
  return {
    ...colDefinition,
    headerCell: normalizeCellDefinition(headerCell),
    bodyCell: normalizeCellDefinition(bodyCell),
    ...(footerCell !== undefined && {footerCell: normalizeCellDefinition(footerCell)})
  };
}

// `content` property is implicit in cell definitions
function normalizeCellDefinition(cellDefinition) {
  return isPlainObject(cellDefinition) ? cellDefinition : {content: cellDefinition};
}

function evaluate(valueOrFunction, ...args) {
  if (typeof valueOrFunction === 'function') {
    return valueOrFunction(...args);
  }
  return valueOrFunction;
}

function getCellTooltipLabel({item, tooltip, content, truncate}) {
  if (tooltip) {
    return evaluate(tooltip, item);
  }
  if (truncate) {
    const renderedContent = evaluate(content, item);
    if (typeof renderedContent === 'string') {
      return renderedContent;
    }
  }
}

// === Low level components ===

const SectionContext = React.createContext();
const RowContext = React.createContext();

@withRadiumStarter
export class ListRoot extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    children: PropTypes.node.isRequired,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
  };

  render() {
    const {style, children} = this.props;

    return (
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          borderSpacing: 0,
          ...style
        }}
      >
        {children}
      </table>
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
    onContextMenu: PropTypes.func,
    tooltip: PropTypes.string,
    truncate: PropTypes.bool,
    isItemSelected: PropTypes.bool,
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.node
  };

  handleContextMenu = event => {
    const {onContextMenu} = this.props;

    if (onContextMenu) {
      event.preventDefault();
      onContextMenu(event);
    }
  };

  render() {
    let {
      onClick,
      tooltip,
      isItemSelected,
      truncate,
      style,
      children,
      styles: s,
      theme: t
    } = this.props;

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

          if (type === 'BODY' && isItemSelected) {
            style = {
              backgroundColor: t.selectionColor,
              MozUserSelect: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              ...style
            };
          }

          return (
            <td
              onClick={onClick}
              onContextMenu={this.handleContextMenu}
              title={tooltip}
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
