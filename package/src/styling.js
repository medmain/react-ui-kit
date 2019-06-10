import Color from 'color';

export function baseTheme() {
  return {
    primaryColor: '#8e338e', // PidPort logo purple
    accentColor: '#2c4892', // Dark blue
    inverseAccentColor: '#f983e3', // Pale light pink
    altTextColor: t =>
      Color(t.baseTextColor)
        .alpha(0.6)
        .string(),
    inverseAltTextColor: t =>
      Color(t.baseInverseTextColor)
        .alpha(0.8)
        .string(),
    altBackgroundColor: t =>
      Color(t.backgroundColor)
        .darken(0.05)
        .string(),
    inverseBackgroundColor: '#111a39', // Night blue
    smallFontSize: '13px',
    strongFontWeight: '600',
    headingsFontWeight: '500',
    headingsLineHeight: t => t.baseLineHeight,
    modularScaleRatio: 1.25,
    // borderWidth: '.99px', // Looks better in Safari with a Retina display?

    // Custom colors
    labelColor: t => t.altTextColor,
    selectionColor: '#c2dbff',
    grayBackgroundColor: '#f5f8fb', // Pale blue gray,
    grayIconColor: '#888',
    annotationBorderColor: '#01ff70' // Source: https://clrs.cc/
  };
}

export function baseStyles(t, s) {
  return {
    centeredPage: {width: '100%', maxWidth: '1280px', margin: '0 auto'},
    centeredContent: {flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center'},
    field: {padding: '0.5rem 0.625rem', ...s.border, ...s.rounded},
    headingInfo: {
      marginLeft: '.75rem',
      fontSize: t.baseFontSize,
      fontWeight: t.headingsFontWeight,
      color: t.mutedTextColor,
      lineHeight: 1
    }
  };
}

export function baseGlobalStyles(_t) {
  return {
    hr: {
      marginTop: '1.5rem',
      marginBottom: '1.5rem'
    },
    '* > h1:first-child, h2:first-child, h3:first-child, h4:first-child, h5:first-child, h6:first-child, p:first-child, ol:first-child, ul:first-child, dl:first-child, li:first-child, dd:first-child, blockquote:first-child, pre:first-child, figure:first-child, .row:first-child': {
      marginTop: '0 !important'
    },
    '* > h1:last-child, h2:last-child, h3:last-child, h4:last-child, h5:last-child, h6:last-child, p:last-child, ol:last-child, ul:last-child, dl:last-child, li:last-child, dd:last-child, blockquote:last-child, pre:last-child, figure:last-child,  .row:last-child': {
      marginBottom: '0 !important'
    }
  };
}
