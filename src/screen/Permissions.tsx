import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform, Linking, TouchableOpacity } from 'react-native';
import { request, PERMISSIONS, RESULTS, checkMultiple, PermissionStatus } from 'react-native-permissions';

const ANDROID_PERMISSIONS = [
  PERMISSIONS.ANDROID.READ_SMS,
  PERMISSIONS.ANDROID.READ_CONTACTS,
];

export default function PermissionsScreen() {
  const [permissionStatuses, setPermissionStatuses] = useState({
    sms: false,
    contacts: false,
    overlay: false,
  });

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      const statuses = await checkMultiple(ANDROID_PERMISSIONS);
      const overlayStatus = await checkOverlayPermission();
      setPermissionStatuses({
        sms: statuses[PERMISSIONS.ANDROID.READ_SMS] === RESULTS.GRANTED,
        contacts: statuses[PERMISSIONS.ANDROID.READ_CONTACTS] === RESULTS.GRANTED,
        overlay: overlayStatus,
      });
    }
  };

  const checkOverlayPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      return await Linking.canOpenURL('package:android.settings.action.MANAGE_OVERLAY_PERMISSION');
    }
    return false;
  };

  const requestPermission = async (permission: 'sms' | 'contacts' | 'overlay') => {
    if (Platform.OS === 'android') {
      try {
        let result: PermissionStatus | boolean;
        switch (permission) {
          case 'sms':
            result = await request(PERMISSIONS.ANDROID.READ_SMS);
            break;
          case 'contacts':
            result = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
            break;
          case 'overlay':
            result = await requestOverlayPermission();
            break;
          default:
            return;
        }
        if (result === RESULTS.GRANTED || result === true) {
          setPermissionStatuses(prev => ({ ...prev, [permission]: true }));
        } else {
          Alert.alert(
            'Permission Denied',
            `Please grant ${permission} permission in your device settings to use this feature.`
          );
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
      }
    }
  };

  const requestOverlayPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      Linking.openSettings();
      return new Promise((resolve) => {
        const checkPermissionAfterReturn = () => {
          checkOverlayPermission().then(resolve);
        };
        const subscription = Linking.addEventListener('url', checkPermissionAfterReturn);
        return () => subscription.remove();
      });
    }
    return false;
  };

  const allPermissionsGranted = Object.values(permissionStatuses).every(status => status);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please grant the following permissions to enjoy full service of MRT</Text>
      
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>SMS Access</Text>
        <TouchableOpacity
          onPress={() => requestPermission('sms')}
          disabled={permissionStatuses.sms}
          style={[styles.button, permissionStatuses.sms && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {permissionStatuses.sms ? 'Granted' : 'Grant'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Contacts Access</Text>
        <TouchableOpacity
          onPress={() => requestPermission('contacts')}
          disabled={permissionStatuses.contacts}
          style={[styles.button, permissionStatuses.contacts && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {permissionStatuses.contacts ? 'Granted' : 'Grant'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Display Over Other Apps</Text>
        <TouchableOpacity
          onPress={() => requestPermission('overlay')}
          disabled={permissionStatuses.overlay}
          style={[styles.button, permissionStatuses.overlay && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {permissionStatuses.overlay ? 'Granted' : 'Grant'}
          </Text>
        </TouchableOpacity>
      </View>

      {allPermissionsGranted && (
        <Text style={styles.successText}>
          All permissions granted. You can now enjoy the full service of MRT!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e8f5e9', // Light green background
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2e7d32', // Dark green text
  },
  permissionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  permissionText: {
    fontSize: 16,
    color: '#1b5e20', // Darker green text
  },
  button: {
    backgroundColor: '#4caf50', // Green button
    padding: 10,
    borderRadius: 5,
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7', // Light green for disabled state
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  successText: {
    marginTop: 20,
    fontSize: 16,
    color: '#2e7d32', // Dark green success message
    textAlign: 'center',
  },
});