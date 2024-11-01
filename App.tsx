import React, { useState, useEffect, useRef } from 'react';
import { 
    StyleSheet, 
    Platform, 
    View, 
    Text, 
    ActivityIndicator 
} from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SmsAndroid from 'react-native-get-sms-android';
import RegisterScreen from './src/screen/Register';
import LoginScreen from './src/screen/Login';
import DrawerScreen from './src/screen/Drawer';
import PermissionsScreen from './src/screen/Permissions';
import ReportReasonScreen from './src/screen/ReportReason';
import { useColorScheme } from './src/hooks/useColorScheme';
import BackgroundFetch from 'react-native-background-fetch';
import PushNotification, { Importance } from 'react-native-push-notification';
import SmsListener from 'react-native-android-sms-listener';

export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Drawer: { userId: string };
  Permissions: undefined;
  ReportReason: { senderNumber: string; userId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [permissionsGranted, setPermissionsGranted] = useState(false);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme();
    const navigationRef = useRef<any>(null);
    const [lastCheckedTimestamp, setLastCheckedTimestamp] = useState(Date.now());

    const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
        setUser(user);
        if (initializing) setInitializing(false);
    };

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; 
    }, []);

    useEffect(() => {
        checkPermissions();
    }, []);

    useEffect(() => {
        if (permissionsGranted) {
            setupSmsListener();
            setupNotifications();
        }
    }, [permissionsGranted]);

    const setupSmsListener = () => {
        if (Platform.OS === 'android') {
            SmsListener.addListener((message) => {
                checkForUrlInMessage(message);
            });
        }
    };

    const checkPermissions = async () => {
        if (Platform.OS !== 'android') {
            setPermissionsGranted(true);
            setLoading(false);
            return;
        }

        try {
            const permissions = [
                PERMISSIONS.ANDROID.READ_CONTACTS,
                PERMISSIONS.ANDROID.READ_SMS,
                PERMISSIONS.ANDROID.RECEIVE_SMS,
            ];

            const results = await Promise.all(permissions.map(permission => request(permission)));
            const allGranted = results.every(result => result === RESULTS.GRANTED);
            setPermissionsGranted(allGranted);
        } catch (error) {
            console.error('Error checking permissions: ', error);
        } finally {
            setLoading(false);
        }
    };

    // const setupBackgroundFetch = () => {
    //     BackgroundFetch.configure(
    //         {
    //             minimumFetchInterval: 2,
    //             stopOnTerminate: false,
    //             startOnBoot: true,
    //             enableHeadless: true,
    //         },
    //         async (taskId) => {
    //             console.log("Background Fetch event:", taskId);
    //             await checkForUrlsInMessages();
    //             BackgroundFetch.finish(taskId);
    //         },
    //         (error) => {
    //             console.log("Background Fetch failed to start", error);
    //         }
    //     );

    //     BackgroundFetch.start();
    // };

    const setupNotifications = () => {
        PushNotification.createChannel(
            {
                channelId: "url-detection-channel",
                channelName: "URL Detection Channel",
                channelDescription: "A channel for alerts about URLs",
                importance: Importance.HIGH,
                vibrate: true,
            },
            (created) => console.log(`createChannel returned '${created}'`)
        );

        PushNotification.configure({
            onAction: function (notification) {
                console.log("ACTION:", notification.action);
                console.log("NOTIFICATION:", notification);

                if (notification.action === "report" && user) {
                    navigateToReportReason(notification.data.sender, user.uid);
                }
            },
            onNotification: function(notification) {
                console.log("NOTIFICATION:", notification);
                if (notification.userInteraction && user) {
                    navigateToReportReason(notification.data.sender, user.uid);
                }
            },
            popInitialNotification: true,
            requestPermissions: true,
        });
    };

    const checkForUrlInMessage = (message: any) => {
        const URL_REGEX = /(?<protocol>https?:\/\/)?(?<domain>(?:[\w-]+\.)+[\w-]+)(?<path>\/[^\s]*)?/g;
        const bodyWithoutSpaces = message.body.replace(/\s+/g, '');

        if (URL_REGEX.test(bodyWithoutSpaces)) {
            PushNotification.localNotification({
                channelId: "url-detection-channel",
                title: "URL Detected",
                message: message.body,
                bigText: `URL detected in message from ${message.originatingAddress}. Do you want to report this?`,
                priority: "high",
                visibility: "public",
                playSound: true,
                soundName: "default",
                vibrate: true,
                actions: '["Report"]',
                data: { sender: message.originatingAddress },
            });
        }
    };

    // const fetchMessages = () => {
    //     return new Promise<any[]>((resolve, reject) => {
    //         if (Platform.OS !== 'android') {
    //             reject('SMS retrieval is only available on Android');
    //             return;
    //         }

    //         const filter = {
    //             box: 'inbox',
    //             minDate: lastCheckedTimestamp,
    //             maxCount: 10,
    //         };

    //         SmsAndroid.list(
    //             JSON.stringify(filter),
    //             (fail) => {
    //                 console.log('Failed with this error: ' + fail);
    //                 reject(fail);
    //             },
    //             (count, smsList) => {
    //                 console.log('Count: ', count);
    //                 const arr = JSON.parse(smsList);
    //                 resolve(arr);
    //             },
    //         );
    //     });
    // };

    const navigateToReportReason = (senderNumber: string, userId: string) => {
        console.log("Navigating to ReportReason screen", { senderNumber, userId });
        if (navigationRef.current) {
            navigationRef.current.navigate('ReportReason', { senderNumber, userId });
        } else {
            console.log("Navigation ref is not available");
        }
    };

    if (initializing || loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer 
            ref={navigationRef}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
            <Stack.Navigator>
                {!permissionsGranted ? (
                    <Stack.Screen 
                        name="Permissions" 
                        component={PermissionsScreen} 
                        options={{ headerShown: false }}
                    />
                ) : user ? (
                    <>
                        <Stack.Screen 
                            name="Drawer" 
                            component={DrawerScreen} 
                            options={{ headerShown: false }} 
                            initialParams={{ userId: user.uid }}
                        />
                        <Stack.Screen 
                            name="ReportReason" 
                            component={ReportReasonScreen} 
                            options={{ title: 'Report Reason' }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen 
                            name="Login" 
                            component={LoginScreen} 
                            options={{ headerShown: false }} 
                        />
                        <Stack.Screen 
                            name="Register" 
                            component={RegisterScreen} 
                            options={{ headerShown: false }} 
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});