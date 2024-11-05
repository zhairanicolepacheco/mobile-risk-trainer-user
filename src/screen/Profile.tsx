import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type UserProfileProps = {
  userId: string;
};

type UserData = {
  username: string;
  phoneNumber: string;
  email: string;
};

export default function UserProfile({ userId }: UserProfileProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firestore().collection('users').doc(userId).get();
        if (userDoc.exists) {
          setUserData(userDoc.data() as UserData);
        } else {
          console.log('No such user!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <LinearGradient colors={['#006769', '#40A578']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </LinearGradient>
    );
  }

  if (!userData) {
    return (
      <LinearGradient colors={['#006769', '#40A578']} style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load user data</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#006769', '#40A578']} style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Image source={require('../assets/default.jpg')} style={styles.avatar} />
              {/* <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil" size={20} color="#ffffff" />
              </TouchableOpacity> */}
            </View>
            <Text style={styles.username}>{userData.username}</Text>
          </View>
          <View style={styles.infoContainer}>
            <InfoItem iconName="call-outline" label="Phone" value={userData.phoneNumber} />
            <InfoItem iconName="mail-outline" label="Email" value={userData.email} />
          </View>
          {/* <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#ffffff" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity> */}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const InfoItem = ({ iconName, label, value }: { iconName: keyof typeof Ionicons.glyphMap; label: string; value: string }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoIconContainer}>
      <Ionicons name={iconName} size={24} color="#ffffff" />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  // editButton: {
  //   position: 'absolute',
  //   bottom: 0,
  //   right: 0,
  //   backgroundColor: '#40A578',
  //   borderRadius: 20,
  //   width: 40,
  //   height: 40,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderWidth: 3,
  //   borderColor: '#ffffff',
  // },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  infoContainer: {
    margin: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    marginVertical: 10,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});