import React, { useState } from 'react';
import { StyleSheet, View, Alert, Pressable, FlatList, Image } from 'react-native';
import { Button, Text, Input, Overlay, ListItem } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons, } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Toast from 'react-native-root-toast';
import { LinearGradient } from 'expo-linear-gradient';

const firebaseConfig = {
  apiKey: "AIzaSyC4Pxe3ZlK72S0hYArVFes9u9dN9GlWLHA",
  authDomain: "ysnpass-eb007.firebaseapp.com",
  projectId: "ysnpass-eb007",
  storageBucket: "ysnpass-eb007.appspot.com",
  messagingSenderId: "731533217399",
  appId: "1:731533217399:web:e39af97ff871b2b1558072"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export default function PasswordsScreen() {
  const [credentials, setCredentials] = useState([]);
  const [loggedUser, setLoggedUser] = useState();
  const [provider, setProvider] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [passVisibility, setPassVisibility] = useState('eye-outline')
  const [security, setSecurity] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPass, setShowPass] = useState();

  //Observer for current user
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoggedUser(user.uid);
      if (loggedUser == null) {
        getValueFor(user.uid);
      };
    }
  });
  //Copy username or password to clipboard
  const copyToClipboard = (value) => {
    Clipboard.setString(value);
    Toast.show(`Copied to clipboard`, {
      duration: Toast.durations.SHORT,
      position: -75,
      animation: true,
      hideOnPress: true,
    });
  };
  //Toggle overlay for credential info on/off
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  //Separator for credential listing
  const seprator = () => {
    return (
      <View style={styles.seprator}></View>
    )
  };
  //Footer for credential listing
  const flatlistFooter = () => {
    return (
      <View style={styles.flFooter}>
        <Text>The End of List</Text>
      </View>
    )
  };
  //Show or hide password
  const showHidePassword = () => {
    if (security == true) {
      setSecurity(false);
      setPassVisibility('eye-off-outline');
    } else {
      setSecurity(true);
      setPassVisibility('eye-outline');
    }
  };
  //Fetch saved info from SecureStore
  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      let x = JSON.parse(result);
      setCredentials(x);
    }
  };
  //Save new credential info to SecureStore
  async function saveCreds() {
    if (provider && userName && password != '') {
      let x = [];
      let result = await SecureStore.getItemAsync(loggedUser);
      if (result) {
        x = JSON.parse(result);
      };
      x.push({ provider: provider, user: userName, password: password });
      let z = JSON.stringify(x);
      await SecureStore.setItemAsync(loggedUser, z);
      setCredentials(x);
      toggleOverlay();
      Toast.show(`✔  Saved`, {
        duration: Toast.durations.SHORT,
        backgroundColor: 'green',
        position: -75,
        animation: true,
        hideOnPress: true,
      });
    } else {
      Alert.alert('', 'Required fields:\nProvider, Username, Password')
    }
  };
  //Delete chosen credential info from SecureStore
  const deleteCred = (ind) => {
    console.log(ind)
    Alert.alert('', 'Are you sure that you want\n to delete this information?',
      [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive', onPress: () => deleteCredConfirmed(ind) }])
  };
  async function deleteCredConfirmed(ind) {
    let result = await SecureStore.getItemAsync(loggedUser);
    if (result) {
      let x = JSON.parse(result);
      x.splice(ind, 1);
      let y = JSON.stringify(x);
      await SecureStore.setItemAsync(loggedUser, y);
      setCredentials(x);
      Toast.show(`✗  Deleted`, {
        duration: Toast.durations.SHORT,
        backgroundColor: 'red',
        position: -75,
        animation: true,
        hideOnPress: true,
      });
    }
  };
  //Show modal for password
  const PasswordOverlay = () => {
    return (
      <Overlay
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        overlayStyle={{ borderRadius: 15, elevation: 8 }}
      >
        <LinearGradient
          colors={['#a5c7b7', '#5d4257']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.modalTextBg}>
          <View style={{ alignItems: 'center', marginBottom: 5 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
              {`Password:`}
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16 }}>
              {`${showPass}`}
            </Text>
          </View>
        </View>
      </Overlay>
    )
  };
  //Credentials FlatList
  const PasswordListing = () => {
    return (
      <FlatList
        data={credentials}
        ItemSeparatorComponent={seprator}
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={flatlistFooter}
        renderItem={({ item, index }) =>
          <View>
            <View style={styles.passwordListItems}>
              <ListItem.Title>{item.provider}</ListItem.Title>
              <Button
                type="clear"
                onPress={() => deleteCred(index)}
                icon={<Ionicons name="md-trash-outline" size={15} />}
              />

            </View>
            <View style={styles.passwordListItems}>
              <ListItem.Subtitle >{item.user}</ListItem.Subtitle>
              <Button
                type="clear"
                onPress={() => copyToClipboard(item.user)}
                icon={<MaterialIcons name="content-copy" size={15} />}
              />
            </View>
            <View style={styles.passwordListItems}>
              <ListItem.Subtitle>✱✱✱✱✱✱</ListItem.Subtitle>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable
                  onPressIn={() => setShowPass(item.password)}
                  onPress={() => setModalVisible(true)}
                  style={({ pressed }) => ([
                    {
                      backgroundColor: pressed
                        ? 'rgb(102, 153, 255)'
                        : 'transparent'
                    },
                    { padding: 5, borderRadius: 5 }
                  ])}
                >
                  <Ionicons name='eye-outline' size={15} />
                </Pressable>
                <Button
                  type="clear"
                  onPress={() => copyToClipboard(item.password)}
                  icon={<MaterialIcons name="content-copy" size={15} />}
                />
              </View>
            </View>
          </View>}
      />
    )
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#a5c7b7', '#5d4257']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Text h4>Your credentials</Text>
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={styles.overlayView}
      >
        <Input
          placeholder='Provider name'
          label='Provider'
          leftIcon={<Ionicons name="briefcase-outline" size={25} color='black' />}
          onChangeText={value => setProvider(value)}
        />
        <Input
          placeholder='Username'
          label='User'
          leftIcon={<Ionicons name="person-outline" size={25} color='black' />}
          onChangeText={value => setUserName(value)}
        />
        <Input
          placeholder='Password'
          label='Password'
          leftIcon={<Ionicons name="key-outline" size={25} color='black' />}
          rightIcon={<Button type="clear" onPress={showHidePassword}
            icon={<Ionicons name={passVisibility} size={25} />}
          />}
          secureTextEntry={security}
          onChangeText={value => setPassword(value)}
        />
        <Pressable style={styles.overlayButton} onPress={saveCreds}>
          {({ pressed }) => (
            <LinearGradient
              colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
              start={{ x: 0.0, y: 0.25 }}
              end={{ x: 1.0, y: 1.0 }}
              locations={[0.3, 1.0]}
              style={styles.button}>
              <Text style={styles.textStyling}>Save</Text>
            </LinearGradient>
          )}
        </Pressable>
      </Overlay>
      <View style={styles.passwordList}>
        <PasswordListing />
      </View>
      <Pressable style={styles.pressableAdd} onPress={toggleOverlay}>
        {({ pressed }) => (
          <LinearGradient
            colors={pressed ? ['#567ef0', '#567ef0'] : ['#355AC5', '#51aef0']}
            start={{ x: 0.0, y: 0.25 }}
            end={{ x: 1.0, y: 1.0 }}
            locations={[0.3, 1.0]}
            style={styles.logScreenButtons}>
            <Image Image style={styles.add} source={require('./add.png')} />
          </LinearGradient>
        )}
      </Pressable>
      <PasswordOverlay />
      <StatusBar hidden={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5e5e5e'
  },
  button: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  logScreenButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    width: 55,
    height: 55,
    bottom: 2,
    right: 2
  },
  pressableAdd: {
    borderWidth: 2,
    borderColor: 'black',
    position: 'absolute',
    elevation: 8,
    borderRadius: 30,
    width: 55,
    height: 55,
    right: 15,
    bottom: 65
  },
  textStyling: {
    color: '#FFFFFF',
    fontSize: 15,
    opacity: 0.65
  },
  textStylingAdd: {
    color: '#FFFFFF',
    fontSize: 35,
    opacity: 0.7,
  },
  overlayView: {
    width: 280,
    borderRadius: 15,
    backgroundColor: '#d3d3d3'
  },
  passwordList: {
    width: '90%',
    flex: 5,
    marginBottom: 50,
    marginTop: 20
  },
  addButtonPostition: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-end',
  },
  passwordListItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalTextBg: {
    borderRadius: 15,
    padding: 10,
    elevation: 8
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '130%',
    borderRadius: 15
  },
  overlayButton: {
    borderRadius: 10,
    width: 260,
  },
  seprator: {
    height: 1,
    backgroundColor: '#03095e',
    marginTop: 5,
    marginBottom: 5
  },
  flFooter: {
    height: 75,
    justifyContent: 'center',
    alignItems: 'center'
  },
  add: {
    width: 100,
    height: 100,
    opacity: 0.8,
    marginRight: 9
  },
});