import React, { useState, useEffect, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';

type ReportedContact = {
  id: string;
  number: string;
  reason: string;
  reportedAt: FirebaseFirestoreTypes.Timestamp;
};

type ReportedContactsListProps = {
  userId: string;
};

export default function ReportedContactsList({ userId }: ReportedContactsListProps) {
  const [reportedContacts, setReportedContacts] = useState<ReportedContact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportedContacts = async () => {
      try {
        const reportedContactsRef = firestore().collection('reportedNumbers').where('reportedBy', '==', userId);
        const snapshot = await reportedContactsRef.get();
        const fetchedContacts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          reportedAt: doc.data().reportedAt as FirebaseFirestoreTypes.Timestamp
        } as ReportedContact));
        setReportedContacts(fetchedContacts);
      } catch (error) {
        console.error('Error fetching reported contacts:', error);
        Alert.alert('Error', 'Failed to load reported contacts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReportedContacts();
  }, [userId]);

  const filteredContacts = useMemo(() => {
    return reportedContacts.filter(contact => 
      contact.number.includes(searchQuery) ||
      contact.reason.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reportedContacts, searchQuery]);

  const groupedContacts = useMemo(() => {
    return filteredContacts.reduce((acc, contact) => {
      if (!acc[contact.reason]) {
        acc[contact.reason] = [];
      }
      acc[contact.reason].push(contact);
      return acc;
    }, {} as Record<string, ReportedContact[]>);
  }, [filteredContacts]);

  if (loading) {
    return (
      <LinearGradient colors={['#006769', '#40A578']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#006769', '#40A578']} style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search reported contacts..."
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.8)" style={styles.searchIcon} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {Object.entries(groupedContacts).map(([reason, contacts]) => (
          <View key={reason} style={styles.reasonGroup}>
            <Text style={styles.reasonTitle}>{reason}</Text>
            <View style={styles.tableContainer}>
              {contacts.map(contact => (
                <TouchableOpacity key={contact.id} style={styles.tableRow}>
                  <Text style={[styles.cell, styles.numberCell]}>{contact.number}</Text>
                  <Text style={[styles.cell, styles.dateCell]}>
                    {contact.reportedAt.toDate().toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        {filteredContacts.length === 0 && (
          <Text style={styles.noResultsText}>No reported contacts found.</Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    color: '#ffffff',
  },
  searchIcon: {
    marginRight: 12,
  },
  reasonGroup: {
    marginBottom: 24,
  },
  reasonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff',
  },
  tableContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  cell: {
    padding: 12,
    color: '#ffffff',
  },
  numberCell: {
    flex: 2,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
  },
  dateCell: {
    flex: 3,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#ffffff',
  },
});