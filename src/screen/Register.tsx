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
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import styles from '../styles/styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Drawer: { userId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function Register({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateInputs = () => {
    if (!username || !phoneNumber || !email || !password || !confirmPassword) {
      showError("Error", "All fields are required");
      return false;
    }

    if (password !== confirmPassword) {
      showError("Error", "Passwords do not match");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Error", "Please enter a valid email address");
      return false;
    }

    const phoneRegex = /^\+?[0-9]{10,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      showError("Error", "Please enter a valid phone number");
      return false;
    }

    if (password.length < 6) {
      showError("Error", "Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const checkUserExists = async () => {
    try {
      const emailExists = await auth().fetchSignInMethodsForEmail(email);
      if (emailExists.length > 0) {
        showError("Error", "An account with this email already exists");
        return true;
      }

      const db = firestore();
      const usernameRef = db.collection('users').where('username', '==', username).limit(1);
      const phoneRef = db.collection('users').where('phoneNumber', '==', phoneNumber).limit(1);

      const [usernameSnapshot, phoneSnapshot] = await Promise.all([
        usernameRef.get(),
        phoneRef.get()
      ]);

      if (!usernameSnapshot.empty) {
        showError("Error", "This username is already taken");
        return true;
      }

      if (!phoneSnapshot.empty) {
        showError("Error", "An account with this phone number already exists");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking user existence:", error);
      showError("Error", "An error occurred while checking user information. Please try again.");
      return true;
    }
  };

  const showError = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const userExists = await checkUserExists();
      if (userExists) {
        return;
      }

      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await firestore().collection('users').doc(user.uid).set({
        username: username,
        phoneNumber: phoneNumber,
        email: user.email,
        role: 'client',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      showError("Success", "Account created successfully");
      navigation.replace('Login');
    } catch (error) {
      console.log("Registration error:", error);
      
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string; message: string };
        switch (firebaseError.code) {
          case 'auth/email-already-in-use':
            showError("Error", "That email address is already in use!");
            break;
          case 'auth/invalid-email':
            showError("Error", "That email address is invalid!");
            break;
          case 'auth/weak-password':
            showError("Error", "The password is too weak.");
            break;
          default:
            showError("Error", firebaseError.message);
        }
      } else if (error instanceof Error) {
        showError("Error", error.message);
      } else {
        console.log("An unknown error occurred");
        showError("Error", "An unexpected error occurred. Please try again.");
      }
    }
  };

  const togglePasswordVisibility = (field: string) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#006769', '#40A578']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            <Image
              source={require('../assets/mrt.png')}
              style={styles.logo}
            />

            <Text style={styles.title}>Mobile Risk Trainer</Text>
            <Text style={styles.tagline}>A Mobile App for Smishing Attack Awareness</Text>

            <Text style={styles.header}>REGISTER</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#888"
                accessibilityLabel="Username input"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholderTextColor="#888"
                accessibilityLabel="Phone number input"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="#888"
                accessibilityLabel="Email input"
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
                accessibilityLabel="Password input"
              />
              <TouchableOpacity onPress={() => togglePasswordVisibility('password')} style={styles.icon}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#888"/>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#888"
                accessibilityLabel="Confirm password input"
              />
              <TouchableOpacity onPress={() => togglePasswordVisibility('confirm')} style={styles.icon}>
                <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#888"/>
              </TouchableOpacity>
            </View>

            <TouchableHighlight style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableHighlight>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.registerLink}>
              <Text style={styles.registerText}>Already have an account? Login here</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}