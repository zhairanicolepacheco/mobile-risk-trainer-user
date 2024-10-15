import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import SMSViewer from './src/screen/SMSviewer';
import { PermissionsAndroid, Alert } from 'react-native';

const App = () => {
  useEffect(() => {
    requestReadSmsPermission();
  }, []);

  const requestReadSmsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'Read SMS Permission',
          message: 'This app needs access to read your SMS messages.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can read SMS messages');
        // Proceed with reading SMS
      } else {
        console.log('Read SMS permission denied');
        Alert.alert('Permission Denied', 'Cannot read SMS without permission.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SMSViewer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App;
