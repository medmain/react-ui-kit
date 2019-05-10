import React from 'react';

import {Badge} from '@medmain/react-ui-kit';

export const columns = [
  {
    path: 'reference',
    width: '50px',
    headerCell: {
      content: () => 'Ref'
    },
    bodyCell: {
      content: item => item.reference
    }
  },
  {
    path: 'patient',
    width: '100px',
    headerCell: {
      content: () => `Patient's name`
    },
    bodyCell: {
      content: item => item.patientName
    }
  },
  {
    path: 'organ',
    width: '100px',
    headerCell: {
      content: () => `Organ`
    },
    bodyCell: {
      content: item => item.organ
    }
  },
  {
    path: 'disease',
    width: '100px',
    headerCell: {
      content: () => `Disease`
    },
    bodyCell: {
      content: item => item.disease
    }
  },
  {
    path: 'tags',
    width: '100px',
    headerCell: {
      content: () => `Tags`
    },
    bodyCell: {
      content: item =>
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
      content: () => `Filename`
    },
    bodyCell: {
      content: item => item.filename
    }
  },
  {
    path: 'size',
    width: '50px',
    headerCell: {
      content: () => `Size`
    },
    bodyCell: {
      content: item => item.size
    }
  },
  {
    path: 'addedOn',
    width: '150px',
    headerCell: {
      content: () => `Added on`
    },
    bodyCell: {
      content: item => item.addedOn
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
