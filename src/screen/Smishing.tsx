import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Smishing: undefined;
  Content: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Smishing'>;

export default function Smishing({ navigation }: Props) {
  const [collapsedSmishing, setCollapsedSmishing] = useState(true);
  const [collapsedCause, setCollapsedCause] = useState(true);
  const [collapsedEffect, setCollapsedEffect] = useState(true);
  const [collapsedTypes, setCollapsedTypes] = useState(true);
  const [collapsedSample, setCollapsedSample] = useState(true);
  const [collapsedReference, setCollapsedReference] = useState(true);

  const toggleSmishing = () => setCollapsedSmishing(!collapsedSmishing);
  const toggleCause = () => setCollapsedCause(!collapsedCause);
  const toggleEffect = () => setCollapsedEffect(!collapsedEffect);
  const toggleTypes = () => setCollapsedTypes(!collapsedTypes);
  const toggleSample = () => setCollapsedSample(!collapsedSample);
  const toggleReference = () => setCollapsedReference(!collapsedReference);

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <Animated.Image
        source={require('../assets/smishing2.png')}
        style={styles.image}
        sharedTransitionTag="tag"
      />

      {/* Smishing Section */}
      <TouchableOpacity onPress={toggleSmishing} style={styles.sectionHeader}>
        <Text style={styles.headerText}>What is Smishing?</Text>
        <Icon name={collapsedSmishing ? 'chevron-down' : 'chevron-up'} size={20} color="#059212" />
      </TouchableOpacity>
      <Collapsible collapsed={collapsedSmishing}>
        <View style={styles.sectionContent}>
          <Text>
            Smishing is a social engineering attack that combines SMS (short message service) with phishing. Scammers or attackers send fake messages containing harmful links to deceive individuals into compromising their mobile phones, which can have serious consequences such as financial loss, identity theft, and compromised personal information.
          </Text>
        </View>
      </Collapsible>

      {/* Cause Section */}
      <TouchableOpacity onPress={toggleCause} style={styles.sectionHeader}>
        <Text style={styles.headerText}>Causes of Smishing</Text>
        <Icon name={collapsedCause ? 'chevron-down' : 'chevron-up'} size={20} color="#059212" />
      </TouchableOpacity>
      <Collapsible collapsed={collapsedCause}>
        <View style={styles.sectionContent}>
          <Text style={styles.bold}>1. Taking Advantage of Trust in SMS:</Text>
          <Text>People tend to trust text messages more than emails, which often get caught in spam filters. Hackers take advantage of this trust by sending fake messages that look real.</Text>

          <Text style={styles.bold}>2. Less Security on Mobile Devices:</Text>
          <Text>Mobile phones usually don’t have the same security features as computers, and a lot of people don’t use security apps on their phones, making smishing easier.</Text>

          <Text style={styles.bold}>3. Pretending to Be Legitimate Organizations:</Text>
          <Text>Attackers often pose as trusted companies like banks, tricking people into believing the message is real.</Text>

          <Text style={styles.bold}>4. Easy Access to Personal Information:</Text>
          <Text>Data breaches and personal info shared online have made it easier for attackers to create convincing, personalized messages.</Text>
        </View>
      </Collapsible>

      {/* Effect Section */}
      <TouchableOpacity onPress={toggleEffect} style={styles.sectionHeader}>
        <Text style={styles.headerText}>Effects of Smishing</Text>
        <Icon name={collapsedEffect ? 'chevron-down' : 'chevron-up'} size={20} color="#059212" />
      </TouchableOpacity>
      <Collapsible collapsed={collapsedEffect}>
        <View style={styles.sectionContent}>
          <Text style={styles.bold}>1. Identity Theft:</Text>
          <Text>Scammers can collect personal info like Social Security numbers to open accounts or apply for loans in the victim’s name.</Text>

          <Text style={styles.bold}>2. Loss of Money:</Text>
          <Text>Many attacks aim to steal credit card or bank details, leading to unauthorized charges or withdrawals.</Text>

          <Text style={styles.bold}>3. Stolen Accounts:</Text>
          <Text>Victims may give up login info, allowing attackers to take over accounts and access sensitive information.</Text>

          <Text style={styles.bold}>4. Malware on Phones:</Text>
          <Text>Some smishing texts contain links that download malware onto the victim’s phone, potentially stealing passwords and personal data.</Text>
        </View>
      </Collapsible>

      {/* Types Section */}
      <TouchableOpacity onPress={toggleTypes} style={styles.sectionHeader}>
        <Text style={styles.headerText}>Types of Smishing Attacks</Text>
        <Icon name={collapsedTypes ? 'chevron-down' : 'chevron-up'} size={20} color="#059212" />
      </TouchableOpacity>
      <Collapsible collapsed={collapsedTypes}>
        <View style={styles.sectionContent}>
          <Text style={styles.bold}>- Account Verification Scams</Text>
          <Text style={styles.bold}>- Prize or Lottery Scams</Text>
          <Text style={styles.bold}>- Tech Support Scams</Text>
          <Text style={styles.bold}>- Bank Fraud Alerts</Text>
          <Text style={styles.bold}>- Tax Scams</Text>
          <Text style={styles.bold}>- Service Cancellation</Text>
          <Text style={styles.bold}>- Malicious App Downloads</Text>
        </View>
      </Collapsible>

      {/* Sample Section */}
      <TouchableOpacity onPress={toggleSample} style={styles.sectionHeader}>
        <Text style={styles.headerText}>Examples</Text>
        <Icon name={collapsedSample ? 'chevron-down' : 'chevron-up'} size={20} color="#059212" />
      </TouchableOpacity>
      <Collapsible collapsed={collapsedSample}>
        <View style={styles.sectionContent}>
          <Animated.Image
            source={require('../assets/sample1.jpg')}
            style={styles.image}
            // sharedTransitionTag="tag1"
          />

        <Animated.Image
          source={require('../assets/sample2.jpg')}
          style={styles.image}
          // sharedTransitionTag="tag2"
        />

        <Animated.Image
          source={require('../assets/sample3.jpg')}
          style={styles.image}
          // sharedTransitionTag="tag3"
        />

        <Animated.Image
          source={require('../assets/sample4.jpg')}
          style={styles.image}
          // sharedTransitionTag="tag4"
        />
        </View>
      </Collapsible>

      {/* Reference Section */}
      <TouchableOpacity onPress={toggleReference} style={styles.sectionHeader}>
        <Text style={styles.headerText}>References</Text>
        <Icon name={collapsedReference ? 'chevron-down' : 'chevron-up'} size={20} color="#059212" />
      </TouchableOpacity>
      <Collapsible collapsed={collapsedReference}>
        <View style={styles.sectionContent}>
          <Text
            style={styles.reference}
            onPress={() => Linking.openURL('https://www.researchgate.net/publication/366656299_Users_really_do_respond_to_smishing')}
          >
            Rahman, M. L., Timko, D., Wali, H., & Neupane, A. (2022). Users really do respond to smishing.
          </Text>
          <Text
            style={styles.reference}
            onPress={() => Linking.openURL('https://web.archive.org/web/20220309084752/https:/www.ijcit.com/index.php/ijcit/article/download/201/55')}
          >
            Njuguna, D., Kamau, J., & Kaburu, D. (2022). A Review of Smishing Attacks Mitigation Strategies.
          </Text>
          <Text
            style={styles.reference}
            onPress={() => Linking.openURL('https://us.norton.com/blog/emerging-threats/smishing')}
          >
            Knezevic, O. (2024). What is smishing? Retrieved from https://us.norton.com/blog/emerging-threats/smishing
          </Text>
          <Text
            style={styles.reference}
            onPress={() => Linking.openURL('https://news.txtbuff.com/types-of-text-scams/')}
          >
            Siñel, C. (2011). Types of text scams. Retrieved from https://news.txtbuff.com/types-of-text-scams/
          </Text>
          <Text
            style={styles.reference}
            onPress={() => Linking.openURL('https://www.kaspersky.com/resource-center/threats/what-is-smishing-and-how-to-defend-against-it')}
          >
            Kaspersky (2024). What is smishing and how to defend against it. Retrieved from https://www.kaspersky.com/resource-center/threats/what-is-smishing-and-how-to-defend-against-it
          </Text>
        </View>
      </Collapsible>

      {/* Go Back Button */}
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f1f1f1',
  },
  image: {
    width: '100%',
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eaeaea',
    borderRadius: 5,
    marginBottom: 5,
  },
  headerText: {
    fontSize: 20, // Increased from 18
    fontWeight: 'bold',
    color: '#059212',
  },
  sectionContent: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    height: 50,
    width: '100%',
    backgroundColor: '#059212',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnContainer: {
    paddingBottom: 150,
  },
  reference: {
    fontSize: 14,
    color: '#1e90ff',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  regularText: {
    fontSize: 16,
  },
});