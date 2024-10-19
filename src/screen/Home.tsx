import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Progress from 'react-native-progress';
import Smishing from './Smishing';
import { HelloWave } from '../components/HelloWave';

type RootStackParamList = {
  Content: undefined;
  Smishing: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Content'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

function Content({ navigation }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => (prevProgress < 1 ? prevProgress + 0.1 : 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <Animated.Image
        source={require('../assets/smishing.png')}
        style={styles.image}
        sharedTransitionTag="tag"
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
        <Progress.Circle
          size={150}
          progress={progress}
          showsText={true}
          color="#059212"
          borderWidth={2}
          thickness={10}
          style={styles.progress}
        />
        <Text style={styles.subheading}>
          Your progress in becoming a Cyber Security Officer
        </Text>
      </View>

      {/* Navigation Button */}
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Smishing')}>
          <Text style={styles.buttonText}>Go to Smishing Details</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    padding: 20,
    backgroundColor: '#f1f1f1',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
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
  button: {
    height: 50,
    width: '100%',
    backgroundColor: '#059212',
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
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnContainer: {
    width: '100%',
    paddingBottom: 30,
  },
  div: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e1e1e1',
    borderRadius: 15,
    marginBottom: 10,
  },
});
