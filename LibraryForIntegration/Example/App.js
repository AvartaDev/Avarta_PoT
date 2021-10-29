import React, { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Solus from 'rnsolus';

export default function SolusLibrary() {
  const [UserName, setUserName] = useState('');
  const [Password, setPassword] = useState('');

  const SERVER_BASE_URL = 'https://platform.solusconnect.com/';
  const ORGANISATION_KEY = 'A5014D70-7956-478E-9680-C9B6CEA67689';

  const DeviceKeyIdentifier = 'dO0FSfPMW7eAhYqLcFWbU24lhpl1fW0R';
  const FaceScanEncryptionKey =
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5PxZ3DLj+zP6T6HFgzzk\n' +
    'M77LdzP3fojBoLasw7EfzvLMnJNUlyRb5m8e5QyyJxI+wRjsALHvFgLzGwxM8ehz\n' +
    'DqqBZed+f4w33GgQXFZOS4AOvyPbALgCYoLehigLAbbCNTkeY5RDcmmSI/sbp+s6\n' +
    'mAiAKKvCdIqe17bltZ/rfEoL3gPKEfLXeN549LTj3XBp0hvG4loQ6eC1E1tRzSkf\n' +
    'GJD4GIVvR+j12gXAaftj3ahfYxioBH7F7HQxzmWkwDyn3bqU54eaiB7f0ftsPpWM\n' +
    'ceUaqkL2DZUvgN0efEJjnWy5y1/Gkq5GGWCROI9XG/SwXJ30BbVUehTbVcD70+ZF\n' +
    '8QIDAQAB\n' +
    '-----END PUBLIC KEY-----';

  const EnrollProcess = async () => {
    if (UserName == '') {
      alert('UserName Required Some Value');
      return false;
    } else if (Password == '') {
      alert('Password Required Some Value');
      return false;
    } else {
      //Solus.EnrollProcess(UserName, Password);
      const check = await Enroll(UserName, Password);
      if (check == true) {
        alert(check + ' Enroll workflow is successfull.');
      } else {
        alert(check + ' Enroll workflow failed');
      }
    }
  };
  const AuthenticationProcess = () => {
    if (UserName == '') {
      alert('UserName Required Some Value');
      return false;
    } else if (Password == '') {
      alert('Password Required Some Value');
      return false;
    } else {
      Solus.AuthenticationProcess(UserName, Password);
    }
  };

  const DeEnrollProcess = () => {
    Solus.DeEnrollProcess(UserName, Password);
  };

  const onCreate = () => {
    Solus.onCreate(
      DeviceKeyIdentifier,
      FaceScanEncryptionKey,
      SERVER_BASE_URL,
      ORGANISATION_KEY
    );
  };
  const StepUpProcess = () => {
    if (UserName == '') {
      alert('UserName Required Some Value');
      return false;
    } else if (Password == '') {
      alert('Password Required Some Value');
      return false;
    } else {
      Solus.StepUpProcess(UserName, Password);
    }
  };

  const StepUpElevatedProcess = () => {
    if (UserName == '') {
      alert('UserName Required Some Value');
      return false;
    } else if (Password == '') {
      alert('Password Required Some Value');
      return false;
    } else {
      Solus.StepUpElevatedProcess(UserName, Password);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {onCreate()}
      <TextInput
        placeholder="UserName"
        placeholderTextColor="#708090"
        value={UserName}
        onChangeText={(text) => setUserName(text)}
        style={{
          borderWidth: 2,
          borderRadius: 5,
          borderColor: '#D3D3D3',
          marginVertical: '5%',
          marginHorizontal: '10%',
          padding: '2%',
          paddingHorizontal: '5%',
          color: '#1E90FF',
        }}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#708090"
        value={Password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
        style={{
          borderWidth: 2,
          borderRadius: 5,
          borderColor: '#D3D3D3',
          marginHorizontal: '10%',
          padding: '2%',
          paddingHorizontal: '5%',
          color: '#1E90FF',
        }}
      />

      <View
        style={{
          marginTop: '10%',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}
      >
        <TouchableOpacity
          onPress={() => EnrollProcess()}
          style={{
            backgroundColor: '#1E90FF',
            height: 50,
            width: '30%',
            borderRadius: 5,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#ffffff', fontSize: 15, textAlign: 'center' }}>
            Enroll
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => AuthenticationProcess()}
          style={{
            backgroundColor: '#1E90FF',
            height: 50,
            width: '30%',
            borderRadius: 5,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#ffffff', fontSize: 15, textAlign: 'center' }}>
            Authenticate
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: '5%',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}
      >
        <TouchableOpacity
          onPress={() => StepUpProcess()}
          style={{
            backgroundColor: '#1E90FF',
            height: 50,
            width: '30%',
            borderRadius: 5,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#ffffff', fontSize: 15, textAlign: 'center' }}>
            StepUp
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => StepUpElevatedProcess()}
          style={{
            backgroundColor: '#1E90FF',
            height: 50,
            width: '30%',
            borderRadius: 5,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#ffffff', fontSize: 15, textAlign: 'center' }}>
            StepUp Elevated
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => DeEnrollProcess()}
        style={{
          backgroundColor: '#1E90FF',
          height: 50,
          width: '30%',
          borderRadius: 5,
          justifyContent: 'center',
          marginTop: 20,
          alignSelf: 'center',
        }}
      >
        <Text style={{ color: '#ffffff', fontSize: 15, textAlign: 'center' }}>
          De Enroll
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export function Enroll(username, password) {
  try {
    Solus.EnrollProcess(username, password);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export function DeEnroll(username, password) {
  try {
    Solus.DeEnrollProcess(username, password);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
export function Authenticate(username, password) {
  try {
    Solus.AuthenticationProcess(username, password);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
export function StepUp(username, password) {
  try {
    Solus.StepUpProcess(username, password);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export function StepUpElevated(username, password) {
  try {
    Solus.StepUpElevatedProcess(username, password);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
