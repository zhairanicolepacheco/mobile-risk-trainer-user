import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';
import { name as appName } from './app.json';
import { firebase } from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/auth';
import firebaseConfig from './firebaseConfig';

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

registerRootComponent(App);
