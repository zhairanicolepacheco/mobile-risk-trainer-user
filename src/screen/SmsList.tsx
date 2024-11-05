import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Image, Linking } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { format } from 'date-fns';
import LinearGradient from 'react-native-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface SMS {
  _id: string;
  address: string;
  body: string;
  date: number;
}

interface GroupedSMS {
  sender: string;
  latestMessage: SMS;
}

export default function SmsList() {
  const [groupedMessages, setGroupedMessages] = useState<GroupedSMS[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSMS();
  }, []);

  const fetchSMS = () => {
    const filter = {
      box: 'inbox' as const,
      maxCount: 300,
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
        acc[message.address] = message;
      } else if (message.date > acc[message.address].date) {
        acc[message.address] = message;
      }
      return acc;
    }, {} as Record<string, SMS>);

    return Object.entries(groupedObj).map(([sender, latestMessage]) => ({
      sender,
      latestMessage,
    })).sort((a, b) => b.latestMessage.date - a.latestMessage.date);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSMS();
  };

  const openDefaultMessagingApp = (sender: string) => {
    Linking.openURL(`sms:${sender}`);
  };

  const renderConversation = ({ item }: { item: GroupedSMS }) => {
    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => openDefaultMessagingApp(item.sender)}
      >
        <LinearGradient
          colors={['#006769', '#007969']}
          style={styles.avatarContainer}
        >
          <Text style={styles.avatarText}>{item.sender[0].toUpperCase()}</Text>
        </LinearGradient>
        <View style={styles.conversationInfo}>
          <Text style={styles.senderName}>{item.sender}</Text>
          <Text style={styles.messagePreview} numberOfLines={1}>
            {item.latestMessage.body}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.messageDate}>
            {format(new Date(item.latestMessage.date), 'MMM d')}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#006769" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#006769', '#40A578']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Messages</Text>
      </View>
      <FlatList
        data={groupedMessages}
        renderItem={renderConversation}
        keyExtractor={(item) => item.sender}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ffffff" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbox-ellipses-outline" size={48} color="#ffffff" />
            <Text style={styles.emptyText}>No messages found</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  listContent: {
    paddingVertical: 8,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  conversationInfo: {
    flex: 1,
  },
  senderName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  messagePreview: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  messageDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 48,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    color: '#ffffff',
  },
});