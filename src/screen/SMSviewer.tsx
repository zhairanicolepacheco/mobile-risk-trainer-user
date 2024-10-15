import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as SmsAndroid from 'react-native-get-sms-android';

type SMS = {
  _id: number;
  address: string;
  date: number;
  body: string;
};

export default function SMSViewer() {
  const [messages, setMessages] = useState<SMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'inbox' | 'sent'>('inbox');

  useEffect(() => {
    fetchSMS();
  }, [filter]);

  const fetchSMS = () => {
    setLoading(true);
    const smsFilter: SmsAndroid.SmsFilter = {
      box: filter,
      maxCount: 30,
    };

    SmsAndroid.list(
      JSON.stringify(smsFilter),
      (fail) => {
        console.log('Failed to fetch SMS:', fail);
        setLoading(false);
      },
      (count, smsList) => {
        const parsedList: SMS[] = JSON.parse(smsList);
        setMessages(parsedList);
        setLoading(false);
      }
    );
  };

  const renderSMS = ({ item }: { item: SMS }) => (
    <View style={styles.smsItem}>
      <Text style={styles.sender}>{item.address}</Text>
      <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'inbox' && styles.activeFilter]}
          onPress={() => setFilter('inbox')}
        >
          <Text style={styles.filterText}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'sent' && styles.activeFilter]}
          onPress={() => setFilter('sent')}
        >
          <Text style={styles.filterText}>Sent</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={messages}
          renderItem={renderSMS}
          keyExtractor={(item) => item._id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
  },
  activeFilter: {
    backgroundColor: '#e0e0e0',
  },
  filterText: {
    fontWeight: 'bold',
  },
  smsItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sender: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  body: {
    fontSize: 14,
  },
});