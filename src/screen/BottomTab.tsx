import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import HomeScreen from './Home';
import SMSScreen from './SmsList';
import ContactsScreen from './Contacts';

type RootTabParamList = {
  Home: { userId: string };
  Messages: undefined;
  Contacts: undefined;
};

type BottomTabProps = {
  userId: string;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTab({ userId }: BottomTabProps) {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: string;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'comments' : 'comments-o';
          } else if (route.name === 'Contacts') {
            iconName = focused ? 'address-book' : 'address-book-o';
          } else {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].text,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        initialParams={{ userId }}
      />
      <Tab.Screen name="Messages" component={SMSScreen} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
    </Tab.Navigator>
  );
}