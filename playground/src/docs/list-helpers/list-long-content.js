import React from 'react';

import {Badge} from '@medmain/react-ui-kit';

export const columns = [
  {
    path: 'reference',
    width: '50px',
    headerCell: {
      render: () => 'Ref'
    },
    bodyCell: {
      render: item => item.reference
    }
  },
  {
    path: 'patient',
    width: '100px',
    headerCell: {
      render: () => `Patient's name`
    },
    bodyCell: {
      render: item => item.patientName
    }
  },
  {
    path: 'organ',
    width: '100px',
    headerCell: {
      render: () => `Organ`
    },
    bodyCell: {
      render: item => item.organ
    }
  },
  {
    path: 'disease',
    width: '100px',
    headerCell: {
      render: () => `Disease`
    },
    bodyCell: {
      render: item => item.disease
    }
  },
  {
    path: 'tags',
    width: '100px',
    headerCell: {
      render: () => `Tags`
    },
    bodyCell: {
      render: item =>
        item.tags.map(tag => (
          <Badge style={{marginRight: '0.2rem', marginBottom: '0.2rem'}} key={tag}>
            {tag}
          </Badge>
        ))
    }
  },
  {
    path: 'filename',
    width: '100px',
    headerCell: {
      render: () => `Filename`
    },
    bodyCell: {
      render: item => item.filename
    }
  },
  {
    path: 'size',
    width: '50px',
    headerCell: {
      render: () => `Size`
    },
    bodyCell: {
      render: item => item.size
    }
  },
  {
    path: 'addedOn',
    width: '150px',
    headerCell: {
      render: () => `Added on`
    },
    bodyCell: {
      render: item => item.addedOn
    }
  }
];

export const items = [
  {
    reference: '1',
    patientName: 'James Harden',
    organ: 'Thyroid gland',
    disease: 'Long disease name',
    supplier: 'Clyde Drexler',
    tags: ['annotated-by-mr'],
    filename: 'super-high-resolution-picture-2019-2019-05-08.jpg',
    size: '50 M',
    addedOn: 'Apr 16, 2019'
  },
  {
    reference: '2',
    patientName: 'Stephen Curry',
    organ: 'Medulla oblongata',
    disease: 'Disease name',
    supplier: 'Kareem Abdul-Jabbar',
    tags: ['to-annotate'],
    filename: 'an-other-pic.jpg',
    size: '30 M',
    addedOn: 'Apr 30, 2019'
  }
];
