import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  RefreshControl,
} from 'react-native';
import RNContacts from 'react-native-contacts';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';

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
  const [refreshing, setRefreshing] = useState(false);

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
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchContacts();
  }, [fetchContacts]);

  const sections = useMemo((): Section[] => {
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
    <TouchableOpacity 
      onPress={() => Alert.alert('Contact Pressed', `You selected ${item.givenName} ${item.familyName}`)}
      style={styles.card}
    >
      {item.thumbnailPath ? (
        <Image
          source={{ uri: item.thumbnailPath }}
          style={styles.cardImg}
        />
      ) : (
        <LinearGradient
          colors={['#006769', '#007969']}
          style={[styles.cardImg, styles.cardAvatar]}
        >
          <Text style={styles.cardAvatarText}>{item.givenName[0]}</Text>
        </LinearGradient>
      )}

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{`${item.givenName} ${item.familyName}`}</Text>
        <Text style={styles.cardPhone}>
          {item.phoneNumbers && item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number : 'No phone number'}
        </Text>
      </View>

      <Ionicons color="#006769" name="chevron-forward" size={22} />
    </TouchableOpacity>
  ), []);

  const renderSectionHeader = useCallback(({ section: { title } }: { section: Section }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  ), []);

  if (loading) {
    return (
      <LinearGradient colors={['#006769', '#40A578']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#006769', '#40A578']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ffffff" />
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  listContent: {
    paddingBottom: 24,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  card: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  cardAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardBody: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardPhone: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
});