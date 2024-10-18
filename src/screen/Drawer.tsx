import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import Tabs from './BottomTab';
import ReportScreen from './ReportList';
import AboutScreen from './AboutUs';
import CustomDrawerContent from '../components/CustomDrawerContent';
import ProfileScreen from './Profile';

const Drawer = createDrawerNavigator();

export default function DrawerDashboard() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <Drawer.Navigator
      initialRouteName="Mobile Risk Trainer"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: tintColor,
        drawerInactiveTintColor: Colors[colorScheme ?? 'light'].text,
      }}>
      <Drawer.Screen
        name="Mobile Risk Trainer"
        component={Tabs}
        options={{
          title: 'Mobile Risk Trainer',
          drawerIcon: ({color, size, focused}) => (
            <Ionicons
              name={focused ? 'shield' : 'shield-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="User Profile"
        component={ProfileScreen}
        options={{
          title: 'User Profile',
          drawerIcon: ({color, size, focused}) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Reported Numbers"
        component={ReportScreen}
        options={{
          title: 'Reported Numbers',
          drawerIcon: ({color, size, focused}) => (
            <Ionicons
              name={focused ? 'list' : 'list-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="About Us"
        component={AboutScreen}
        options={{
          title: 'About Us',
          drawerIcon: ({color, size, focused}) => (
            <Ionicons
              name={focused ? 'information-circle' : 'information-circle-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}