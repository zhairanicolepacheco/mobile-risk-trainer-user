import React, { useState, useEffect, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
  Text,
} from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search reported contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
      </View>
      {Object.entries(groupedContacts).map(([reason, contacts]) => (
        <View key={reason} style={styles.reasonGroup}>
          <Text style={styles.reasonTitle}>{reason}</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.numberCell]}>Number</Text>
              <Text style={[styles.headerCell, styles.dateCell]}>Date Reported</Text>
            </View>
            {contacts.map(contact => (
              <View key={contact.id} style={styles.tableRow}>
                <Text style={[styles.cell, styles.numberCell]}>{contact.number}</Text>
                <Text style={[styles.cell, styles.dateCell]}>
                  {contact.reportedAt.toDate().toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
      {filteredContacts.length === 0 && (
        <Text style={styles.noResultsText}>No reported contacts found.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#EFEFF4',
    paddingVertical: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingHorizontal: 16,
    marginBottom: 16,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    marginHorizontal: 16,
  },
  searchInput: {
    flex: 1, 
    height: 40,
    paddingHorizontal: 5,
    backgroundColor: 'white',
    color: 'black',
  },
  searchIcon: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFEFF4',
  },
  reasonGroup: {
    marginBottom: 24,
  },
  reasonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 16,
    color: '#333',
  },
  tableContainer: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerCell: {
    fontWeight: 'bold',
    padding: 12,
    color: '#111',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cell: {
    padding: 12,
  },
  numberCell: {
    flex: 2,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  dateCell: {
    flex: 3,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});