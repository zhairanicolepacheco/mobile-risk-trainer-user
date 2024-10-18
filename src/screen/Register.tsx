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
type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function Register({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!username || !phoneNumber || !email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    // try {
    //   const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    //   const user = userCredential.user;

    //   await firestore().collection('users').doc(user.uid).set({
    //     username: username,
    //     phoneNumber: phoneNumber,
    //     email: user.email,
    //     role: 'client',
    //     createdAt: firestore.FieldValue.serverTimestamp(),
    //   });

    //   Alert.alert("Success", "Account created successfully");
    //   navigation.navigate('Login');
    // } catch (error) {
    //   if (error instanceof Error) {
    //     console.log("Registration error:", error);
    //     Alert.alert("Registration failed", error.message);
    //   } else {
    //     console.log("An unknown error occurred");
    //     Alert.alert("Registration failed", "An unexpected error occurred. Please try again.");
    //   }
    // }
    
    navigation.navigate('Login');
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
        colors={['#00712D', '#6EC207'] as [string, string]}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            <Image
              source={require('../../src/assets/mrt.png')}
              style={styles.logo}
            />

            <Text style={styles.title}>Mobile Risk Trainer</Text>
            <Text style={styles.tagline}>A Mobile App for Smishing Attack Awareness</Text>

            <Text style={styles.header}>REGISTER</Text>
            <Text style={styles.subheader}>Create a new account</Text>

            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="phone" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholderTextColor="#888"
              />
            </View>

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
              <TouchableOpacity onPress={() => togglePasswordVisibility('password')} style={styles.icon}>
                <Icon name={showPassword ? "eye-slash" : "eye"} size={20} color="#888" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#888"
              />
              <TouchableOpacity onPress={() => togglePasswordVisibility('confirm')} style={styles.icon}>
                <Icon name={showConfirmPassword ? "eye-slash" : "eye"} size={20} color="#888" />
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