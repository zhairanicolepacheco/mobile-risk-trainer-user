import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

interface SMS {
  _id: string;
  address: string;
  body: string;
  date: number;
}

export default function SmsList() {
  const [messages, setMessages] = useState<SMS[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSMS();
  }, []);

  const fetchSMS = () => {
    const filter = {
      box: 'inbox' as const,
      maxCount: 30,
    };

    SmsAndroid.list(
      JSON.stringify(filter),
      (fail: string) => {
        console.log('Failed to fetch SMS:', fail);
        setRefreshing(false);
      },
      (count: number, smsList: string) => {
        const arr: SMS[] = JSON.parse(smsList);
        setMessages(arr);
        setRefreshing(false);
      },
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSMS();
  };

  const renderSMS = ({ item }: { item: SMS }) => (
    <View style={styles.smsItem}>
      <Text style={styles.smsAddress}>{item.address}</Text>
      <Text style={styles.smsBody}>{item.body}</Text>
      <Text style={styles.smsDate}>{new Date(item.date).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderSMS}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No messages found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  smsItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  smsAddress: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  smsBody: {
    marginBottom: 8,
    color: '#666',
  },
  smsDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});