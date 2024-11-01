import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { RootStackParamList } from '../../App';

type ReportReasonScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReportReason'>;
type ReportReasonScreenRouteProp = RouteProp<RootStackParamList, 'ReportReason'>;

type Props = {
  navigation: ReportReasonScreenNavigationProp;
  route: ReportReasonScreenRouteProp;
};

const reasons = ['Fraud', 'Spam', 'Threat', 'Unknown'];

export default function ReportReasonScreen({ navigation, route }: Props) {
  const { senderNumber, userId } = route.params;
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleSubmit = async () => {
    if (selectedReason) {
      try {
        await firestore()
          .collection('reportedNumbers')
          .add({
            number: senderNumber,
            reason: selectedReason,
            reportedAt: firestore.FieldValue.serverTimestamp(),
            reportedBy: userId,
          });
        console.log('Sender number reported successfully');
        navigation.goBack();
      } catch (error) {
        console.error('Error reporting sender number:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a reason for reporting</Text>
      {reasons.map((reason) => (
        <TouchableOpacity
          key={reason}
          style={[
            styles.reasonButton,
            selectedReason === reason && styles.selectedReason,
          ]}
          onPress={() => handleReasonSelect(reason)}
        >
          <Text style={styles.reasonText}>{reason}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[styles.submitButton, !selectedReason && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={!selectedReason}
      >
        <Text style={styles.submitButtonText}>Submit Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  reasonButton: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedReason: {
    backgroundColor: '#f1f8e9',
    borderColor: '#2ecc71',
  },
  reasonText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#b0bec5',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});