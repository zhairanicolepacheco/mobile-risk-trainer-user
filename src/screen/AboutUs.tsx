import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface ExpandedState {
  aboutUs: boolean;
  currentVersion: boolean;
  privacyPolicy: boolean;
  contactUs: boolean;
}

export default function AboutScreen() {
  const [expanded, setExpanded] = useState<ExpandedState>({
    aboutUs: false,
    currentVersion: false,
    privacyPolicy: false,
    contactUs: false,
  });

  const toggleSection = (section: keyof ExpandedState) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderSection = (
    key: keyof ExpandedState,
    title: string,
    content: string
  ) => (
    <View key={key} style={styles.section}>
      <TouchableOpacity onPress={() => toggleSection(key)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons 
          name={expanded[key] ? 'chevron-up' : 'chevron-down'} 
          size={24} 
          color="#ffffff" 
        />
      </TouchableOpacity>
      {expanded[key] && (
        <View style={styles.collapseContent}>
          <Text style={styles.collapseText}>{content}</Text>
        </View>
      )}
    </View>
  );

  return (
    <LinearGradient colors={['#006769', '#40A578']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* <Text style={styles.headerText}>About</Text> */}
        {renderSection(
          "aboutUs",
          "About Us",
          "A mobile app for smishing attack awareness. The development of MRT aims to educate users about the dangers of smishing attacks, how to identify, and mitigate them, and promote safe mobile device usage practices."
        )}
        {renderSection(
          "currentVersion",
          "Current Version",
          "Current Version: 1.0.0"
        )}
        {renderSection(
          "privacyPolicy",
          "Privacy Policy",
          "This Privacy Policy describes how Mobile Risk Trainer collects, uses, and discloses your personal information when you use our services or otherwise communicate with us. For purposes of this Privacy Policy, ''you'' and ''your'' means you as the user of the Services, whether you are a customer, website visitor, or another individual whose information we have collected pursuant to this Privacy Policy."
        )}
        {renderSection(
          "contactUs",
          "Contact Us",
          "Email: mobile.risk.trainer@gmail.com"
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  collapseContent: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  collapseText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
  },
});