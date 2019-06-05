import React from 'react';

export const columns = [
  // Using the `path` property to render the cell
  {
    path: 'id',
    footerCell: ''
  },
  // Example of column using the shorthand syntax for column content
  {
    path: 'firstName',
    width: '200px',
    headerCell: 'First name',
    bodyCell: item => <span>{item.firstName}</span>, // extra <span> tag useful to check pointer position detection, see context menu example
    footerCell: 'Footer 1'
  },
  {
    path: 'lastName',
    width: '200px',
    headerCell: {
      content: 'Last name'
    },
    bodyCell: {
      content: item => item.lastName,
      style: item => (item.lastName === 'Jordan' ? {fontWeight: 'bold'} : {}) // using a function
    },
    footerCell: {
      content: () => 'Footer 2'
    }
  },
  {
    path: 'team',
    headerCell: {
      content: () => 'Team',
      tooltip: `Player's most famous team`
    },
    bodyCell: {
      content: item => item.team,
      tooltip: item => `${item.lastName} 's main team`,
      style: {backgroundColor: '#fef9eb'} // using a style object instead of a function
    },
    footerCell: {
      content: () => 'Footer 3'
    }
  }
];

export const items = [
  {
    id: '1',
    lastName: 'Bird',
    firstName: 'Larry',
    team: 'Boston Celtics'
  },
  {
    id: '2',
    lastName: 'Jordan',
    firstName: 'Michael',
    team: 'Chicago Bulls'
  },
  {
    id: '3',
    lastName: 'Duncan',
    firstName: 'Tim',
    team: 'San Antonio Spurs'
  },
  {
    id: '4',
    lastName: 'Bryant',
    firstName: 'Kobe',
    team: 'LA Lakers'
  },
  {
    id: '5',
    lastName: 'Harden',
    firstName: 'James',
    team: 'Houston Rockets'
  },
  {
    id: '6',
    lastName: 'Liliard',
    firstName: 'Damian',
    team: 'Portland Trailblazers'
  },
  {
    id: '7',
    lastName: 'Antetokounmpo',
    firstName: 'Giannis',
    team: 'Milwaukee Bucks'
  }
];
