import React, {useState, useEffect} from 'react';
import {
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
} from 'react-native';
import {enroll} from 'facetec-rn';
import { setLatestExternalDatabaseRefID } from '@libs/localPersistenceUtils';

const SolusLibrary = () => {
  useEffect(() => {
    DeviceEventEmitter.addListener('ENROLL', (event) => {
      console.log(`Facetec Enroll Success, message: ${event}`)
      const val = event['latestExternalDataRefID']
      setLatestExternalDatabaseRefID(val)
    })
  }, []);
  return (
    <View
      style={{
        marginTop: '10%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      }}>
      <TouchableOpacity
        onPress={() => enroll()}
        style={{
          backgroundColor: '#1E90FF',
          height: 50,
          width: '30%',
          borderRadius: 5,
          justifyContent: 'center',
        }}>
        <Text style={{color: '#ffffff', fontSize: 15, textAlign: 'center'}}>
          Enroll
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SolusLibrary;
