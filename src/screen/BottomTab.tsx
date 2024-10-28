import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
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
        let iconName: keyof typeof Ionicons.glyphMap; // Enforce valid Ionicons name types
  
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Messages') {
          iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
        } else if (route.name === 'Contacts') {
          iconName = focused ? 'call' : 'call-outline';
        }
  
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: tintColor, // Set the active color to green
      tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].text, // Set inactive color
    })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        initialParams={{ userId }}
        options={{ headerShown: false }} // If you want to show the header only for Home
      />
      <Tab.Screen name="Messages" component={SMSScreen}  options={{ headerShown: false }}/>
      <Tab.Screen name="Contacts" component={ContactsScreen}  options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}