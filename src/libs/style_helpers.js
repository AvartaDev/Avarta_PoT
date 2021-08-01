import {Dimensions, PixelRatio} from 'react-native';
import {css} from 'styled-components/native';
import {path, identity, compose} from 'ramda';

export const fullwidth = a => {
  return (
    a.fullwidth &&
    css`
      width: 100%;
    `
  );
};

export const fetchPropFromTheme =
  prop =>
  (a, alterFn = identity) =>
    compose(alterFn, path(['theme', prop, a]));
export const colors = fetchPropFromTheme('colors');
export const gutter = fetchPropFromTheme('gutter');
export const responsive = values => a => a.theme.responsive(values);

export const isLarge = ({width, height}) => PixelRatio.get() >= 3;
export const isSmall = ({width, height}) => PixelRatio.get() < 2;
export const isMedium = ({width, height}) =>
  PixelRatio.get() >= 2 && PixelRatio.get() < 3;

export const _responsive = values => {
  if (values.length === 1) {
    return values[0];
  }
  const dimen = Dimensions.get('window');

  // console.log(dimen);

  if (isSmall(dimen)) {
    return values[0];
  }
  if (isMedium(dimen)) {
    return values[1] || values[0];
  }
  if (isLarge(dimen)) {
    return values[values.length - 1];
  }
};
