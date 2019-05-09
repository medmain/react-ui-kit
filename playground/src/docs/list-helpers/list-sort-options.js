import {useState} from 'react';

export function useSortOptions({orderBy: initialOrderBy, orderDirection: initialOrderDirection}) {
  const [{orderBy, orderDirection}, setSortOptions] = useState({
    orderBy: initialOrderBy,
    orderDirection: initialOrderDirection
  });

  const toggleOrderDirection = () => (orderDirection === 'ASC' ? 'DESC' : 'ASC');

  const toggle = path => {
    if (path === orderBy) {
      return setSortOptions({orderBy, orderDirection: toggleOrderDirection()});
    }
    setSortOptions({orderBy: path, orderDirection: 'ASC'});
  };

  return {
    orderBy,
    orderDirection,
    toggle
  };
}

export function sortItems(items, {orderBy, orderDirection = 'ASC'}) {
  const sorted = items.slice();

  sorted.sort((a, b) => {
    const difference = a[orderBy] > b[orderBy] ? 1 : -1;
    return orderDirection === 'ASC' ? difference : -difference;
  });

  return sorted;
}
