import React from 'react';

export const withForwardedRef = Wrapped =>
  React.forwardRef((props, ref) => {
    return <Wrapped {...props} forwardedRef={ref} />;
  });
