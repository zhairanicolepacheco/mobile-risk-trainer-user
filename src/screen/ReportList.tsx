import React, { useState, useEffect, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import firestore from '@react-native-firebase/firestore';

type Contact = {
  id: string;
  name: string;
  phone: string;
  reason: string;
};

type ReportListProps = {
  userId: string;
};

export default function ReportList({ userId }: ReportListProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsRef = firestore().collection('users').doc(userId).collection('blockedContacts');
        const snapshot = await contactsRef.get();
        const fetchedContacts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Contact));
        setContacts(fetchedContacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        Alert.alert('Error', 'Failed to load contacts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [userId]);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
    );
  }, [contacts, searchQuery]);

  const removeContact = async (id: string) => {
    Alert.alert(
      "Remove Contact",
      "Are you sure you want to unblock this contact?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "OK", 
          onPress: async () => {
            try {
              await firestore()
                .collection('users')
                .doc(userId)
                .collection('blockedContacts')
                .doc(id)
                .delete();
              setContacts(contacts.filter(c => c.id !== id));
            } catch (error) {
              console.error('Error removing contact:', error);
              Alert.alert('Error', 'Failed to remove contact. Please try again.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.stage}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <TableView>
        <Section header="Blocked Contacts">
          {filteredContacts.map(contact => (
            <Cell
              key={contact.id}
              cellStyle="Subtitle"
              title={contact.name}
              detail={`${contact.phone} - ${contact.reason}`}
              accessory="DetailDisclosure"
              onPress={() => removeContact(contact.id)}
            />
          ))}
        </Section> 
      </TableView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stage: {
    backgroundColor: '#EFEFF4',
    paddingTop: 20,
    paddingBottom: 20,
  },
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFEFF4',
  },
});