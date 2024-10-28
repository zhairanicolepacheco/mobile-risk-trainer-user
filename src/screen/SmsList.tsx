import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

interface SMS {
  _id: string;
  address: string;
  body: string;
  date: number;
}

interface GroupedSMS {
  sender: string;
  messages: SMS[];
}

export default function SmsList() {
  const [groupedMessages, setGroupedMessages] = useState<GroupedSMS[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSenders, setExpandedSenders] = useState<Set<string>>(new Set());

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
        const grouped = groupMessagesBySender(arr);
        setGroupedMessages(grouped);
        setRefreshing(false);
      },
    );
  };

  const groupMessagesBySender = (messages: SMS[]): GroupedSMS[] => {
    const groupedObj = messages.reduce((acc, message) => {
      if (!acc[message.address]) {
        acc[message.address] = [];
      }
      acc[message.address].push(message);
      return acc;
    }, {} as Record<string, SMS[]>);

    return Object.entries(groupedObj).map(([sender, messages]) => ({
      sender,
      messages: messages.sort((a, b) => b.date - a.date),
    }));
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSMS();
  };

  const toggleExpand = (sender: string) => {
    setExpandedSenders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sender)) {
        newSet.delete(sender);
      } else {
        newSet.add(sender);
      }
      return newSet;
    });
  };

  const renderSenderGroup = ({ item }: { item: GroupedSMS }) => {
    const isExpanded = expandedSenders.has(item.sender);
    const latestMessage = item.messages[0];

    return (
      <View style={styles.senderGroup}>
        <TouchableOpacity onPress={() => toggleExpand(item.sender)} style={styles.senderHeader}>
          <View style={styles.senderInfo}>
            <Text style={styles.senderName}>{item.sender}</Text>
            <Text style={styles.messageCount}>{item.messages.length} messages</Text>
          </View>
          <Ionicons name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'} size={24} color="#666" />
        </TouchableOpacity>
        {isExpanded ? (
          item.messages.map((message) => renderSMS({ item: message }))
        ) : (
          <View style={styles.collapsedPreview}>
            <Text style={styles.previewBody} numberOfLines={1}>
              {latestMessage.body}
            </Text>
            <Text style={styles.previewDate}>{format(new Date(latestMessage.date), 'MMM d, yyyy')}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderSMS = ({ item }: { item: SMS }) => (
    <View style={styles.smsItem} key={item._id}>
      <Text style={styles.smsBody}>{item.body}</Text>
      <Text style={styles.smsDate}>{format(new Date(item.date), 'MMM d, yyyy h:mm a')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={groupedMessages}
        renderItem={renderSenderGroup}
        keyExtractor={(item) => item.sender}
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
    backgroundColor: '#f0f2f5',
  },
  senderGroup: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  senderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  senderInfo: {
    flex: 1,
  },
  senderName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  messageCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  collapsedPreview: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e4e8',
  },
  previewBody: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  previewDate: {
    fontSize: 12,
    color: '#666',
  },
  smsItem: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e4e8',
  },
  smsBody: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  smsDate: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});