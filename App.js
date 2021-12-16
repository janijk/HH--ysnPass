import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, Alert, Image } from 'react-native';
import { Overlay } from 'react-native-elements';
import { initializeApp } from "firebase/app";
import {
  getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged, updatePassword, sendPasswordResetEmail, reauthenticateWithCredential, EmailAuthProvider,
} from "firebase/auth";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import { LinearGradient } from 'expo-linear-gradient';
import CreatePasswordScreen from './CreatePasswordScreen';
import PasswordsScreen from './PasswordsScreen';

const firebaseConfig = {
  apiKey: "AIzaSyC4Pxe3ZlK72S0hYArVFes9u9dN9GlWLHA",
  authDomain: "ysnpass-eb007.firebaseapp.com",
  projectId: "ysnpass-eb007",
  storageBucket: "ysnpass-eb007.appspot.com",
  messagingSenderId: "731533217399",
  appId: "1:731533217399:web:e39af97ff871b2b1558072"
};

const app = initializeApp(firebaseConfig);
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const auth = getAuth();

//---------------- HOME SCREEN------------------------------------------------- HOME SCREEN --------- 
function HomeScreen() {
  const [passCurrent, setPassCurrent] = useState();
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState();
  const [modalVisible2, setModalVisible2] = useState(false);

  const out = () => {
    signOut(auth)
  };

  //Change password
  const change = () => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, passCurrent);
    if (pass1 == pass2 && pass1.length >= 6) {
      reauthenticateWithCredential(user, credential).then(() => {
        updatePassword(user, pass1).then(() => {
          Toast.show(`✔  Password updated`, {
            duration: Toast.durations.SHORT,
            backgroundColor: 'green',
            position: -75,
            animation: true,
            hideOnPress: true,
          });
          setModalVisible2(false);
        }).catch((error) => {
          Toast.show(`✗ Something went wrong`, {
            duration: Toast.durations.SHORT,
            backgroundColor: 'red',
            position: -75,
            animation: true,
            hideOnPress: true,
          });
        });
      }).catch((error) => {
        Toast.show(`✗ Something went wrong`, {
          duration: Toast.durations.SHORT,
          backgroundColor: 'red',
          position: -75,
          animation: true,
          hideOnPress: true,
        });
      });
    } else {
      Alert.alert('', 'Passwords dont match,\nor are too weak.')
    }

  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#a5c7b7', '#5d4257']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.pngView}>
        <Image style={styles.logo} source={require('./logo.png')} />
      </View>
      <View style={styles.midContent}>
        <Pressable style={styles.logScreenButtons} onPress={out}>
          {({ pressed }) => (
            <LinearGradient
              colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
              start={{ x: 0.0, y: 0.25 }}
              end={{ x: 1.0, y: 1.0 }}
              locations={[0.3, 1.0]}
              style={styles.button}>
              <Text style={styles.textStyling}>Sign out</Text>
            </LinearGradient>
          )}
        </Pressable>
        <Pressable style={styles.logScreenButtons} onPress={() => setModalVisible2(true)}>
          {({ pressed }) => (
            <LinearGradient
              colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
              start={{ x: 0.0, y: 0.25 }}
              end={{ x: 1.0, y: 1.0 }}
              locations={[0.3, 1.0]}
              style={styles.button}>
              <Text style={styles.textStyling}>Change Password</Text>
            </LinearGradient>
          )}
        </Pressable>
      </View>
      <View style={{ flex: 1 }}></View>
      <Overlay
        isVisible={modalVisible2}
        onBackdropPress={() => setModalVisible2(false)}
        overlayStyle={{ borderRadius: 15, elevation: 8 }}
      >
        <LinearGradient
          colors={['#a5c7b7', '#5d4257']}
          style={styles.backgroundOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <TextInput
          secureTextEntry={true}
          style={styles.logScreenTextInputs}
          placeholder='Password'
          onChangeText={text => setPassCurrent(text)} />
        <TextInput
          secureTextEntry={true}
          style={styles.logScreenTextInputs}
          placeholder='New password'
          onChangeText={text => setPass1(text)} />
        <TextInput
          secureTextEntry={true}
          style={styles.logScreenTextInputs}
          placeholder='New password again'
          onChangeText={text => setPass2(text)} />
        <Pressable style={styles.overlayButton} onPress={change}>
          {({ pressed }) => (
            <LinearGradient
              colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
              start={{ x: 0.0, y: 0.25 }}
              end={{ x: 1.0, y: 1.0 }}
              locations={[0.3, 1.0]}
              style={styles.button}>
              <Text style={styles.textStyling}>Change</Text>
            </LinearGradient>
          )}
        </Pressable>
      </Overlay>
      <StatusBar hidden={true} />
    </View>
  )
};
//---------------- LOG IN SCREEN--------------------------------------------- LOG IN SCREEN ------------ 
function loginScreen() {
  const [user, setUser] = useState();
  const [pass, setPass] = useState();

  // Create new account   
  const newUser = () => {
    if (user == null || pass == null) {
      Toast.show(`Fill Email & Password`, {
        duration: Toast.durations.SHORT,
        position: 300,
        opacity: 0.65,
        animation: true,
        hideOnPress: true,
      });
    } else {
      createUserWithEmailAndPassword(auth, user, pass)
        .then((userCredential) => {
          Toast.show(`✔  Account created!`, {
            duration: Toast.durations.SHORT,
            backgroundColor: 'green',
            position: -75,
            animation: true,
            hideOnPress: true,
          });
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode == 'auth/email-already-in-use') {
            Toast.show(`Email allready in use`, {
              duration: Toast.durations.SHORT,
              position: 300,
              opacity: 0.65,
              animation: true,
              hideOnPress: true,
            });
          } else if (errorCode == 'auth/invalid-email') {
            Toast.show(`Email not valid`, {
              duration: Toast.durations.SHORT,
              position: 300,
              opacity: 0.65,
              animation: true,
              hideOnPress: true,
            });
          } else if (errorCode == 'auth/weak-password') {
            Toast.show(`Password too short`, {
              duration: Toast.durations.SHORT,
              position: 300,
              opacity: 0.65,
              animation: true,
              hideOnPress: true,
            });
          }
        });
    }
  };
  //Sign in existing user  
  const existingUser = () => {
    if (user == null || pass == null || user == '' || pass == '') {
      Toast.show(`Fill Email & Password`, {
        duration: Toast.durations.SHORT,
        position: 300,
        opacity: 0.65,
        animation: true,
        hideOnPress: true,
      });
    } else {
      signInWithEmailAndPassword(auth, user, pass)
        .catch((error) => {
          if (error) {
            Toast.show(`✗ Wrong Email or Password`, {
              duration: Toast.durations.SHORT,
              backgroundColor: 'red',
              position: -75,
              animation: true,
              hideOnPress: true,
            });
          }
        });
    }
  };
  // Send password reset email
  const resetPass = () => {
    sendPasswordResetEmail(auth, user)
      .then(() => {
        Toast.show(`✔  Password reset email sent!`, {
          duration: Toast.durations.SHORT,
          backgroundColor: 'green',
          position: -75,
          animation: true,
          hideOnPress: true,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode == 'auth/missing-email') {
          Toast.show(`Give email address`, {
            duration: Toast.durations.SHORT,
            position: -75,
            animation: true,
            hideOnPress: true,
          });
        } else if (errorCode == 'auth/user-not-found') {
          Toast.show(`✗ User not found`, {
            duration: Toast.durations.SHORT,
            backgroundColor: 'red',
            position: -75,
            animation: true,
            hideOnPress: true,
          });
        } else {
          Toast.show(`✗ Something went wrong`, {
            duration: Toast.durations.SHORT,
            backgroundColor: 'red',
            position: -75,
            animation: true,
            hideOnPress: true,
          });
        }
      });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#a5c7b7', '#5d4257']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.pngView}>
        <Image style={styles.logo} source={require('./logo.png')} />
      </View>
      <View style={styles.midContent}>
        <View>
          <TextInput
            keyboardType='email-address'
            style={styles.logScreenTextInputs}
            placeholder='Email'
            onChangeText={text => setUser(text)} />

        </View>
        <View>
          <TextInput
            secureTextEntry={true}
            style={styles.logScreenTextInputs}
            placeholder='Password'
            onChangeText={text => setPass(text)} />
        </View>
        <View>
          <Pressable style={styles.logScreenButtons} onPress={newUser}>
            {({ pressed }) => (
              <LinearGradient
                colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
                start={{ x: 0.0, y: 0.25 }}
                end={{ x: 1.0, y: 1.0 }}
                locations={[0.3, 1.0]}
                style={styles.button}>
                <Text style={styles.textStyling}>Create account</Text>
              </LinearGradient>
            )}
          </Pressable>
          <Pressable style={styles.logScreenButtons} onPress={existingUser}>
            {({ pressed }) => (
              <LinearGradient
                colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
                start={{ x: 0.0, y: 0.25 }}
                end={{ x: 1.0, y: 1.0 }}
                locations={[0.3, 1.0]}
                style={styles.button}>
                <Text style={styles.textStyling}>Sign In</Text>
              </LinearGradient>
            )}
          </Pressable>
        </View>
      </View>
      <View style={styles.resetTextPlace}>
        <Text>Forgot your password? Reset via email </Text>
        <View>
          <Pressable
            onPress={resetPass}
            style={styles.resetPassText}
          >
            <Text>Here</Text>
          </Pressable>
        </View>
      </View>
      <StatusBar hidden={true} />
    </View>
  )
};
//---------------- APP -------------------------------------------------------------- APP -------------
export default function App() {
  const [signed, setSigned] = useState(false);

  //Observer, is user signed in  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setSigned(true);
    } else {
      setSigned(false);
    }
  });
  //Tab navigator   
  function HomeTabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'md-home';
            } else if (route.name === 'Passwords') {
              iconName = 'key-outline';
            } else if (route.name === 'Generate Password') {
              iconName = 'construct-outline'
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          unmountOnBlur: true,
          tabBarStyle: { position: 'absolute' },
          tabBarBackground: () => (
            <LinearGradient
              colors={['#212121', '#212121']}
              style={styles.background}
            />
          ),
        })}>
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Passwords" component={PasswordsScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Generate Password" component={CreatePasswordScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    );
  };
  //Stack navigator
  function HomeStack() {

    return (
      <Stack.Navigator>
        {
          !signed ? (
            <>
              <Stack.Screen name='login' component={loginScreen} options={{ headerShown: false }} />
            </>
          ) : (
            <>
              <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
            </>
          )
        }
      </Stack.Navigator>
    )
  };

  return (
    <NavigationContainer>
      <RootSiblingParent>
        <HomeStack />
      </RootSiblingParent>
    </NavigationContainer>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pngView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  midContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resetTextPlace: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 40
  },
  button: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  logScreenButtons: {
    borderRadius: 10,
    width: 150,
    marginTop: 15,
    justifyContent: 'space-around'
  },
  textStyling: {
    color: '#FFFFFF',
    fontSize: 15,
    opacity: 0.65
  },
  logScreenTextInputs: {
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: 'black',
    borderWidth: 1,
    width: 200,
    height: 35,
    marginTop: 10,
    textAlign: 'center'
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  backgroundOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '130%',
    borderRadius: 15
  },
  overlayButton: {
    marginTop: 10,
    borderRadius: 10
  },
  resetPassText: {
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    width: 40,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
