import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useState, useEffect } from 'react';
import { 
    StyleSheet, 
    Platform, 
    View, 
    Text, 
    Alert, 
    ActivityIndicator 
} from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RegisterScreen from './src/screen/Register';
import LoginScreen from './src/screen/Login';
import DrawerScreen from './src/screen/Drawer';

import { useColorScheme } from './src/hooks/useColorScheme';

export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Drawer: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
    const [permissionsGranted, setPermissionsGranted] = useState(false);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme();

    const requestPermissions = async () => {
      if (Platform.OS !== 'android') {
        console.log('Permissions are only requested on Android for this example');
        setPermissionsGranted(true);
        setLoading(false);
        return;
      }
  
      try {
        const permissions = [
          PERMISSIONS.ANDROID.READ_CONTACTS,
          PERMISSIONS.ANDROID.READ_SMS,
          PERMISSIONS.ANDROID.RECEIVE_SMS,
        ];
  
        const results = await Promise.all(permissions.map(permission => request(permission)));
  
        const allGranted = results.every(result => result === RESULTS.GRANTED);
  
        if (allGranted) {
          setPermissionsGranted(true);
          console.log('All permissions granted');
        } else {
          Alert.alert('Permission required', 'We need access to your contacts and SMS to continue.');
          console.log('Some permissions were denied');
        }
      } catch (error) {
        console.error('Error requesting permissions: ', error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      requestPermissions();
    }, []);
  
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Checking permissions...</Text>
        </View>
      );
    }
  
    return (
        <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Register" 
                    component={RegisterScreen} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Drawer" 
                    component={DrawerScreen} 
                    options={{ headerShown: false }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
  
const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
});