import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Alert
} from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';

// Generate 50 mock blocked contacts
const generateMockData = () => {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      id: i.toString(),
      name: `Contact ${i + 1}`,
      phone: `+63 9${Math.floor(100000000 + Math.random() * 900000000)}`,
      reason: ['Spam', 'Harassment', 'Unknown'][Math.floor(Math.random() * 3)]
    });
  }
  return data;
};

export default function ReportList() {
  const [contacts, setContacts] = useState(generateMockData());
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
    );
  }, [contacts, searchQuery]);

  const removeContact = (id: string) => {
    Alert.alert(
      "Remove Contact",
      "Are you sure you want to unblock this contact?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => setContacts(contacts.filter(c => c.id !== id)) }
      ]
    );
  };

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
});