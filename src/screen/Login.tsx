import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import styles from '../../src/styles/styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Drawer: { userId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Component({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    console.log("Login attempt with email:", email);
    if (!email.includes('@')) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      const userDocument = await firestore()
        .collection("users")
        .doc(user.uid)
        .get();
  
      if (userDocument.exists) {
        const userData = userDocument.data();
        if (userData && userData.role === 'client') {
          console.log("User is a client, navigating to drawer.");
          navigation.navigate('Drawer', { userId: user.uid });
        } else {
          console.log("User is not a client. Role:", userData?.role);
          Alert.alert("Access Denied", "Only clients are allowed to log in.");
          await auth().signOut();
        }
      } else {
        console.log("User not found in Firestore.");
        Alert.alert("User not found", "No user found in our records. Please register.");
        await auth().signOut();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("Login error:", error);
        Alert.alert("Login failed", error.message);
      } else {
        console.log("An unknown error occurred");
        Alert.alert("Login failed", "An unexpected error occurred. Please try again.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = () => {
    navigation.navigate('Register'); 
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#006769', '#40A578']}
        style={styles.container}
      >
        <View style={styles.content}>
          <Image
            source={require('../../src/assets/mrt.png')}
            style={styles.logo}
          />

          <Text style={styles.title}>Mobile Risk Trainer</Text>
          <Text style={styles.tagline}>A Mobile App for Smishing Attack Awareness</Text>

          <Text style={styles.header}>LOGIN</Text>
          {/* <Text style={styles.subheader}>Please log in to continue.</Text> */}

          <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#888"/>
            </TouchableOpacity>
          </View>

          <TouchableHighlight style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>

          <TouchableOpacity onPress={handleRegister} style={styles.registerLink}>
            <Text style={styles.registerText}>Don't have an account? Click here</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}