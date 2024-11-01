import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Progress from 'react-native-progress';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Smishing from './Smishing';
import { HelloWave } from '../components/HelloWave';

type RootStackParamList = {
  Content: undefined;
  Smishing: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Content'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

function Content({ navigation }: Props) {
  const [reportPercentage, setReportPercentage] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [userReports, setUserReports] = useState(0);

  const fetchReportData = async () => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    const reportedNumbersRef = firestore().collection('reportedNumbers');

    // Get total number of reports
    const totalSnapshot = await reportedNumbersRef.get();
    const total = totalSnapshot.size;
    setTotalReports(total);

    // Get number of reports by current user
    const userSnapshot = await reportedNumbersRef
      .where('reportedBy', '==', currentUser.uid)
      .get();
    const userTotal = userSnapshot.size;
    setUserReports(userTotal);

    // Calculate percentage (user reports out of 100)
    const percentage = Math.min(userTotal, 100);
    setReportPercentage(percentage);
  };

  useEffect(() => {
    fetchReportData();
  }, []); // Empty dependency array to call on component mount

  return (
    <LinearGradient colors={['#006769', '#40A578']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Header Image */}
        <Image
          source={require('../assets/smishing.png')}
          style={styles.image}
        />

        {/* Welcome Text */}
        <View style={styles.div}>
          <Text style={styles.heading}>
            Welcome! <HelloWave />
          </Text>
          <Text style={styles.subheading}>
            Learn about smishing, its causes, effects, and how to protect yourself.
          </Text>
        </View>

        {/* Progress Circle */}
        <View style={styles.div}>
          <Text style={styles.subheading}>
            Your progress in becoming a Cyber Security Officer
          </Text>
          <Progress.Circle
            size={150}
            progress={reportPercentage / 100}
            showsText={true}
            color="#059212"
            borderWidth={2}
            thickness={10}
            style={styles.progress}
            formatText={() => `${reportPercentage}%`}
          />
          <Text style={styles.subheading}>
            Your reported numbers: {userReports}
          </Text>
          <Text style={styles.smallText}>
            Total reports in the system: {totalReports}
          </Text>
        </View>

        {/* Navigation Button */}
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Smishing')}>
            <Text style={styles.buttonText}>Go to Smishing Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

export default function HomeScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Content" component={Content} options={{ headerShown: false }} />
      <Stack.Screen name="Smishing" component={Smishing} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  image: {
    alignSelf: 'center',
    width: '90%',
    height: 200,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  progress: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  smallText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginTop: 10,
    marginBottom: 100,
  },
  buttonText: {
    color: '#059212',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnContainer: {
    alignSelf: 'center',
    width: '90%',
    paddingBottom: 30,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  div: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e1e1e1',
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 20,
  },
});