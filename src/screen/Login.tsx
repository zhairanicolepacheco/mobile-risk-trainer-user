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
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import styles from '../../src/styles/styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Drawer: undefined;
  //Profile: { userId: string }; // Profile expects a userId as a parameter
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // console.log("Login attempt with email:", email);
    // try {
    //   // Sign in with email and password
    //   const userCredential = await auth().signInWithEmailAndPassword(email, password);
    //   const user = userCredential.user;

    //   // Check if user exists in Firestore
    //   const userDocument = await firestore()
    //     .collection("users")
    //     .doc(user.uid)
    //     .get();

    //   if (userDocument.exists) {
    //     console.log("User found in Firestore, navigating to tabs.");
    //     navigation.navigate('Drawer'); // Navigate to the tabs
    //   } else {
    //     Alert.alert("User not found", "No user found in our records. Please register.");
    //   }
    // } catch (error) {
    //   if (error instanceof Error) {
    //     console.log("Login error:", error);
    //     Alert.alert("Login failed", error.message);
    //   } else {
    //     console.log("An unknown error occurred");
    //     Alert.alert("Login failed", "An unexpected error occurred. Please try again.");
    //   }
    // }
    navigation.navigate('Drawer'); // Navigate to the tabs

  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = () => {
    navigation.navigate('Register'); // Navigate to the Register screen
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#00712D', '#6EC207']}
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
          <Text style={styles.subheader}>Please log in to continue.</Text>

          <View style={styles.inputContainer}>
            <Icon name="envelope-o" size={20} color="#888" style={styles.icon} />
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
            <Icon name="lock" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
              <Icon name={showPassword ? "eye-slash" : "eye"} size={20} color="#888" />
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
