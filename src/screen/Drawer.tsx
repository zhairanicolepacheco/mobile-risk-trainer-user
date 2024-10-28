import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import Tabs from './BottomTab';
import ReportScreen from './ReportList';
import AboutScreen from './AboutUs';
import CustomDrawerContent from '../components/CustomDrawerContent';
import UserProfile from './Profile';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Drawer: { userId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Drawer'>;

const Drawer = createDrawerNavigator();

export default function DrawerDashboard({ route }: Props) {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const userId = route.params?.userId;

  console.log('Logged in user ID:', userId);

  return (
    <Drawer.Navigator
      initialRouteName="Mobile Risk Trainer"
      drawerContent={props => <CustomDrawerContent {...props} userId={userId} />}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: tintColor,
        drawerInactiveTintColor: Colors[colorScheme ?? 'light'].text,
      }}>
        
      <Drawer.Screen
        name="Mobile Risk Trainer"
        options={{ 
          title: 'Mobile Risk Trainer',
          drawerIcon: ({color, size, focused}) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={size} />

          ),
        }}
      >
        {(props) => <Tabs {...props} userId={userId} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="User Profile"
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
      >
        {(props) => <UserProfile {...props} userId={userId} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Reported Numbers"
        initialParams={{ userId }}
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
      >
        {(props) => <ReportScreen {...props} userId={userId} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="About Us"
        component={AboutScreen}
        initialParams={{ userId }}
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