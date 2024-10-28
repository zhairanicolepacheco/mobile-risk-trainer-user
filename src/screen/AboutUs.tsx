import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';

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
    <Section key={key}>
      <TouchableOpacity onPress={() => toggleSection(key)}>
        <Cell
          cellStyle="Basic"
          title={title}
          accessory={expanded[key] ? "DisclosureIndicator" : "Detail"}
        />
      </TouchableOpacity>
      {expanded[key] && (
        <View style={styles.collapseContent}>
          <Text style={styles.collapseText}>{content}</Text>
        </View>
      )}
    </Section>
  );

  return (
    <ScrollView contentContainerStyle={styles.stage}>
      <TableView>
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
          "This Privacy Policy describes how Mobile Risk Trainer collects, uses, and discloses your personal information when you use our services or otherwise communicate with us."
        )}
        {renderSection(
          "contactUs",
          "Contact Us",
          "Email: mobile.risk.trainer@gmail.com"
        )}
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
  collapseContent: {
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  collapseText: {
    color: '#333333',
  },
});