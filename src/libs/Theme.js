import {_responsive} from '@libs/style_helpers';
export default {
  colors: {
    primary: '#041C3F',
    secondary: '#2C85FB',
    basic: '#1BCA7F',
    white: '#ffffff',
    black: '#000',
    primary_grey: '#C0C6CD',
    danger: 'crimson',
  },
  responsive: _responsive,
  height: {
    Header: 60,
  },
  gutter: {
    sm: 10,
    md: 25,
    lg: 40,
    bottom: 90,
    header: _responsive([50, 40]),
    SPACING: _responsive([15]),
    statusBar: _responsive([20, 30]),
    padded: _responsive([15, 30]),
  },
};
