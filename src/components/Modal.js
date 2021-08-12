import React from 'react';
import {View, Text} from 'react-native';
import {BgView} from './Layout';
import useTheme from '@hooks/useTheme';
import Modal from 'react-native-modal';

export const PrimaryModal = ({visible, children}) => {
  const {colors, gutter} = useTheme();
  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.9}
      backdropColor={colors.primary}>
      <View
        style={{
          display: 'flex',
          paddingVertical: gutter.md,
          borderRadius: 10,
          backgroundColor: colors.white,
          paddingHorizontal: gutter.md,
        }}>
        {children}
      </View>
    </Modal>
  );
};
