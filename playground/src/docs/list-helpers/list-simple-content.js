export const columns = [
  {
    path: 'id',
    headerCell: {
      render: '#'
    },
    bodyCell: {
      render: item => item.id
    },
    footerCell: {
      render: ''
    }
  },
  {
    path: 'firstName',
    width: '200px',
    // style: {maxWidth: 150},
    headerCell: {
      render: () => 'First Name'
    },
    bodyCell: {
      render: item => item.firstName
    },
    footerCell: {
      render: () => 'Footer 1'
    }
  },
  {
    path: 'lastName',
    width: '200px',
    // style: {maxWidth: 150},
    headerCell: {
      render: () => 'Last Name'
    },
    bodyCell: {
      render: item => item.lastName,
      style: item => (item.lastName === 'Jordan' ? {fontWeight: 'bold'} : {})
    },
    footerCell: {
      render: () => 'Footer 2'
    }
  },
  {
    path: 'team',
    headerCell: {
      render: () => 'Team',
      title: `Player's most famous team`
    },
    bodyCell: {
      render: item => item.team,
      title: item => `${item.lastName} 's main team`,
      style: {backgroundColor: '#fef9eb'}
    },
    footerCell: {
      render: () => 'Footer 3'
    }
  }
];

export const items = [
  {
    id: 1,
    lastName: 'Bird',
    firstName: 'Larry',
    team: 'Boston Celtics'
  },
  {
    id: 2,
    lastName: 'Jordan',
    firstName: 'Michael',
    team: 'Chicago Bulls'
  },
  {
    id: 3,
    lastName: 'Duncan',
    firstName: 'Tim',
    team: 'San Antonio Spurs'
  },
  {
    id: 4,
    lastName: 'Bryant',
    firstName: 'Kobe',
    team: 'LA Lakers'
  },
  {
    id: 5,
    lastName: 'Harden',
    firstName: 'James',
    team: 'Houston Rockets'
  },
  {
    id: 6,
    lastName: 'Liliard',
    firstName: 'Damian',
    team: 'Portand Trailblazers'
  },
  {
    id: 7,
    lastName: 'Antetokounmpo',
    firstName: 'Giannis',
    team: 'Milwaukee Bucks'
  }
];
