import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  SectionList,
  Image,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import RNContacts from 'react-native-contacts';
import FeatherIcon from 'react-native-vector-icons/Feather';

// Define types for react-native-contacts
interface Contact {
  recordID: string;
  givenName: string;
  familyName: string;
  thumbnailPath: string;
  phoneNumbers: Array<{ label: string; number: string }>;
}

interface Contacts {
  getAll(): Promise<Contact[]>;
  checkPermission(): Promise<string>;
}

const Contacts: Contacts = RNContacts;

interface Section {
  title: string;
  data: Contact[];
}

export default function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const requestContactsPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts Permission',
          message: 'This app needs access to your contacts.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const permission = await Contacts.checkPermission();
      return permission === 'authorized';
    }
  };

  const fetchContacts = useCallback(async () => {
    try {
      const permission = await requestContactsPermission();
      if (permission) {
        const allContacts = await Contacts.getAll();
        setContacts(allContacts);
      } else {
        Alert.alert('Permission Denied', 'Permission to access contacts is denied');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      Alert.alert('Error', 'An error occurred while fetching contacts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const sections = React.useMemo((): Section[] => {
    const sectionsMap: Record<string, Contact[]> = contacts.reduce((acc, contact) => {
      const lastName = contact.familyName || contact.givenName || '';
      const letter = lastName[0]?.toUpperCase() || '#';
      return {
        ...acc,
        [letter]: [...(acc[letter] || []), contact],
      };
    }, {} as Record<string, Contact[]>);

    return Object.entries(sectionsMap)
      .map(([letter, data]) => ({ title: letter, data }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [contacts]);

  const renderItem = useCallback(({ item }: { item: Contact }) => (
    <TouchableOpacity onPress={() => Alert.alert('Contact Pressed', `You selected ${item.givenName} ${item.familyName}`)}>
      <View style={styles.card}>
        {item.thumbnailPath ? (
          <Image
            source={{ uri: item.thumbnailPath }}
            style={styles.cardImg}
          />
        ) : (
          <View style={[styles.cardImg, styles.cardAvatar]}>
            <Text style={styles.cardAvatarText}>{item.givenName[0]}</Text>
          </View>
        )}

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{`${item.givenName} ${item.familyName}`}</Text>
          <Text style={styles.cardPhone}>
            {item.phoneNumbers && item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number : 'No phone number'}
          </Text>
        </View>

        <View style={styles.cardAction}>
          <FeatherIcon color="#9ca3af" name="chevron-right" size={22} />
        </View>
      </View>
    </TouchableOpacity>
  ), []);

  const renderSectionHeader = useCallback(({ section: { title } }: { section: Section }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  ), []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
      </View>

      <SectionList<Contact, Section>
        sections={sections}
        keyExtractor={(item) => item.recordID}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
  },
  listContent: {
    paddingBottom: 24,
  },
  section: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  card: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#d6d6d6',
  },
  cardImg: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  cardAvatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9ca1ac',
  },
  cardAvatarText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardBody: {
    marginRight: 'auto',
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  cardPhone: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: '#616d79',
    marginTop: 3,
  },
  cardAction: {
    paddingLeft: 16,
  },
});