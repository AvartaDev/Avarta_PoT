import React from 'react';
import {View, ImageBackground, Text} from 'react-native';
import useTheme from '@hooks/useTheme';
import {BgView} from '@components/Layout';
import {LabelInput} from '@components/Input';
import Button from '@components/Button';
import useWallet from '@hooks/useWallet';

const Import = ({navigation}) => {
  const {colors, gutter} = useTheme();
  const {deriveAccountFromPrivateKey, deriveAccountFromMnemonic} = useWallet();

  const [formData, setFormData] = React.useState({
    privateKey: '',
  });

  const {privateKey} = formData;

  const handleChange = field => value => {
    setFormData({...formData, [field]: value});
  };
  const onClick = async () => {
    await deriveAccountFromMnemonic(
      'frown holiday catalog rough exit body sister doll strong toward actual effort',
    );
    navigation.navigate('home');
  };
  return (
    <ImageBackground
      source={require('@assets/images/BG.png')}
      style={{width: '100%', height: '100%'}}>
      <BgView>
        <View style={{marginHorizontal: gutter.md}}>
          <Text
            style={{
              color: colors.white,
              textAlign: 'center',
              marginVertical: gutter.lg,
              fontWeight: 'bold',
              fontSize: 26,
            }}>
            Import Your Account
          </Text>
          <LabelInput
            label="Private Key"
            value={formData.privateKey}
            required
            onChangeText={handleChange('privateKey')}
            placeholderTextColor={colors.primary_grey}
          />

          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '7%',
            }}>
            <Button
              text="Import"
              textColor={colors.primary}
              onPress={onClick}
            />
          </View>
        </View>
      </BgView>
    </ImageBackground>
  );
};

export default Import;
