import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  Smishing: undefined;
  Content: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Smishing'>;

export default function Smishing({ navigation }: Props) {
  const [collapsedSections, setCollapsedSections] = useState({
    smishing: true,
    cause: true,
    effect: true,
    types: true,
    sample: true,
    reference: true,
  });

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderSection = (title: string, content: React.ReactNode, section: keyof typeof collapsedSections) => (
    <View style={styles.section}>
      <TouchableOpacity onPress={() => toggleSection(section)} style={styles.sectionHeader}>
        <Text style={styles.headerText}>{title}</Text>
        <Ionicons 
          name={collapsedSections[section] ? 'chevron-down-outline' : 'chevron-up-outline'} 
          size={24} 
          color="#fff" 
        />
      </TouchableOpacity>
      <Collapsible collapsed={collapsedSections[section]}>
        <View style={styles.sectionContent}>
          {content}
        </View>
      </Collapsible>
    </View>
  );

  return (
    <LinearGradient
      colors={['#006769', '#40A578']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image
          source={require('../assets/smishing2.png')}
          style={styles.image}
        />

        {renderSection(
          "What is Smishing?",
          <Text style={styles.text}>
            Smishing is a social engineering attack that combines SMS (short message service) with phishing. Scammers or attackers send fake messages containing harmful links to deceive individuals into compromising their mobile phones, which can have serious consequences such as financial loss, identity theft, and compromised personal information.
          </Text>,
          "smishing"
        )}

        {renderSection(
          "Causes of Smishing",
          <>
            <Text style={styles.subheader}>1. Taking Advantage of Trust in SMS:</Text>
            <Text style={styles.text}>People tend to trust text messages more than emails, which often get caught in spam filters. Hackers take advantage of this trust by sending fake messages that look real.</Text>

            <Text style={styles.subheader}>2. Less Security on Mobile Devices:</Text>
            <Text style={styles.text}>Mobile phones usually don't have the same security features as computers, and a lot of people don't use security apps on their phones, making smishing easier.</Text>

            <Text style={styles.subheader}>3. Pretending to Be Legitimate Organizations:</Text>
            <Text style={styles.text}>Attackers often pose as trusted companies like banks, tricking people into believing the message is real.</Text>

            <Text style={styles.subheader}>4. Easy Access to Personal Information:</Text>
            <Text style={styles.text}>Data breaches and personal info shared online have made it easier for attackers to create convincing, personalized messages.</Text>
          </>,
          "cause"
        )}

        {renderSection(
          "Effects of Smishing",
          <>
            <Text style={styles.subheader}>1. Identity Theft:</Text>
            <Text style={styles.text}>Scammers can collect personal info like Social Security numbers to open accounts or apply for loans in the victim's name.</Text>

            <Text style={styles.subheader}>2. Loss of Money:</Text>
            <Text style={styles.text}>Many attacks aim to steal credit card or bank details, leading to unauthorized charges or withdrawals.</Text>

            <Text style={styles.subheader}>3. Stolen Accounts:</Text>
            <Text style={styles.text}>Victims may give up login info, allowing attackers to take over accounts and access sensitive information.</Text>

            <Text style={styles.subheader}>4. Malware on Phones:</Text>
            <Text style={styles.text}>Some smishing texts contain links that download malware onto the victim's phone, potentially stealing passwords and personal data.</Text>
          </>,
          "effect"
        )}

        {renderSection(
          "Types of Smishing Attacks",
          <>
            <Text style={styles.listItem}>• Account Verification Scams</Text>
            <Text style={styles.listItem}>• Prize or Lottery Scams</Text>
            <Text style={styles.listItem}>• Tech Support Scams</Text>
            <Text style={styles.listItem}>• Bank Fraud Alerts</Text>
            <Text style={styles.listItem}>• Tax Scams</Text>
            <Text style={styles.listItem}>• Service Cancellation</Text>
            <Text style={styles.listItem}>• Malicious App downloads</Text>
          </>,
          "types"
        )}

        {renderSection(
          "Examples",
          <>
            <Image source={require('../assets/sample1.jpg')} style={styles.sampleImage} />
            <Image source={require('../assets/sample2.jpg')} style={styles.sampleImage} />
            <Image source={require('../assets/sample3.jpg')} style={styles.sampleImage} />
            <Image source={require('../assets/sample4.jpg')} style={styles.sampleImage} />
          </>,
          "sample"
        )}

        {renderSection(
          "References",
          <>
            <Text style={styles.reference} onPress={() => Linking.openURL('https://www.researchgate.net/publication/366656299_Users_really_do_respond_to_smishing')}>
              Rahman, M. L., Timko, D., Wali, H., & Neupane, A. (2022). Users really do respond to smishing.
            </Text>
            <Text style={styles.reference} onPress={() => Linking.openURL('https://web.archive.org/web/20220309084752/https:/www.ijcit.com/index.php/ijcit/article/download/201/55')}>
              Njuguna, D., Kamau, J., & Kaburu, D. (2022). A Review of Smishing Attacks Mitigation Strategies.
            </Text>
            <Text style={styles.reference} onPress={() => Linking.openURL('https://us.norton.com/blog/emerging-threats/smishing')}>
              Knezevic, O. (2024). What is smishing? Retrieved from https://us.norton.com/blog/emerging-threats/smishing
            </Text>
            <Text style={styles.reference} onPress={() => Linking.openURL('https://news.txtbuff.com/types-of-text-scams/')}>
              Siñel, C. (2011). Types of text scams. Retrieved from https://news.txtbuff.com/types-of-text-scams/
            </Text>
            <Text style={styles.reference} onPress={() => Linking.openURL('https://www.kaspersky.com/resource-center/threats/what-is-smishing-and-how-to-defend-against-it')}>
              Kaspersky (2024). What is smishing and how to defend against it. Retrieved from https://www.kaspersky.com/resource-center/threats/what-is-smishing-and-how-to-defend-against-it
            </Text>
          </>,
          "reference"
        )}

        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
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
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionContent: {
    padding: 16,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  subheader: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  listItem: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  sampleImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  reference: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
  btnContainer: {
    marginTop: 20,
    marginBottom: 100,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#006769',
    fontSize: 16,
    fontWeight: 'bold',
  },
});