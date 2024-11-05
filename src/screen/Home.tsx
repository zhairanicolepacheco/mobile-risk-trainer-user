import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { HelloWave } from '../components/HelloWave';
import Smishing from './Smishing';

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
  const [rank, setRank] = useState('Cybersecurity Intern');

  const fetchReportData = async () => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    const reportedNumbersRef = firestore().collection('reportedNumbers');

    const totalSnapshot = await reportedNumbersRef.get();
    const total = totalSnapshot.size;
    setTotalReports(total);

    const userSnapshot = await reportedNumbersRef
      .where('reportedBy', '==', currentUser.uid)
      .get();
    const userTotal = userSnapshot.size;
    setUserReports(userTotal);

    const percentage = Math.min(userTotal / 100, 1);
    setReportPercentage(percentage);

    if (userTotal >= 400) setRank('Professional Cybersecurity Analyst');
    else if (userTotal >= 300) setRank('Cyber Security Manager');
    else if (userTotal >= 200) setRank('Senior Cybersecurity Officer');
    else if (userTotal >= 100) setRank('Junior Cybersecurity Officer');
    else setRank('Cybersecurity Intern');
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <LinearGradient colors={['#006769', '#40A578']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image
          source={require('../assets/smishing.png')}
          style={styles.image}
          accessibilityLabel="Smishing illustration"
        />

        <View style={styles.card}>
          <Text style={styles.heading}>
            Welcome! <HelloWave />
          </Text>
          <Text style={styles.subheading}>
            Learn about smishing, its causes, effects, and how to protect yourself.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.rankText}>Your rank: {rank}</Text>
          <Progress.Circle
            size={150}
            progress={reportPercentage}
            showsText={true}
            color="#fff"
            unfilledColor="rgba(255,255,255,0.2)"
            borderWidth={0}
            thickness={10}
            style={styles.progress}
            textStyle={styles.progressText}
            formatText={() => `${Math.floor(reportPercentage * 100)}%`}
          />
          <Text style={styles.statsText}>
            Your reported numbers: {userReports}
          </Text>
          <Text style={styles.statsText}>
            Total reports in the system: {totalReports}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Smishing')}
          accessibilityLabel="Go to Smishing Details"
          accessibilityHint="Navigate to the screen with detailed information about smishing"
        >
          <Text style={styles.buttonText}>Go to Smishing Details</Text>
        </TouchableOpacity>
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
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  progress: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  progressText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#006769',
    fontSize: 16,
    fontWeight: 'bold',
  },
});