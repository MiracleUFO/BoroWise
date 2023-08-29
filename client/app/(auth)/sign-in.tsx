import React, { useLayoutEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ToastAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@context/auth';
import StyledButton from '@components/StyledButton';
import StyledOpenInput from '@components/StyledOpenInput';
import { router } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginHorizontal: '10%',
  },
  input: {
    width: '100%',
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    padding: 10,
  },
  title: {
    textTransform: 'uppercase',
    color: '#845FA8',
    fontSize: 35,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});

const SignIn = () => {
  const { signIn } = useAuth();
  const navigation = useNavigation();

  const [isPassHidden, setIsPassHidden] = useState(true);
  const [requiredNotFilled, setRequiredNotFilled] = useState(false);
  const [isSuccessSignedIn, setIsSuccessSignedIn] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      tabBarStyle: { display: 'none' },
      tabBarVisible: false,
    });
  }, [navigation]);

  const handleSignIn = async () => {
    if (email && password) {
      setIsSuccessSignedIn('pending');
      const successSignedIn = await signIn(email, password);
      setIsSuccessSignedIn(successSignedIn?.length > 0 ? 'sucesss' : 'failure');
      setTimeout(() => setIsSuccessSignedIn(''), 5000);
      if (successSignedIn?.length > 0) {
        ToastAndroid.showWithGravity(
          'User signed in successfully!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } else {
      setRequiredNotFilled(true);
      setTimeout(() => setRequiredNotFilled(false), 5000);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', marginTop: 90, marginBottom: 75 }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.title}>
            Borowise
          </Text>
          <Text style={{ color: 'grey', fontSize: 12, marginTop: 25 }}>©</Text>
        </View>
        <Text style={{
          marginTop: 10,
          marginBottom: 8,
          fontSize: 20,
          color: '#626161',
        }}>
          Welcome Back
        </Text>
        <Text style={{ color: '#7F7F7F' }}>
          Sign in to continue.
        </Text>
      </View>

      <View style={{ ...styles.container }}>
        {/* * Input Section * */}
        <View style={{ marginBottom: 30 }}>
          <StyledOpenInput value={email} onChangeText={(text) => setEmail(text)} label='Email' placeholder='example@email.com' keyboardType='email-address' editable={isSuccessSignedIn !== 'pending'} />
          <Pressable onPress={() => setIsPassHidden(!isPassHidden)}>
            <StyledOpenInput
              value={password}
              label='Password'
              secure={isPassHidden}
              placeholder='* * * * * * * * * *'
              iconRight={isPassHidden ? 'eye-off-outline' : 'eye-outline'}
              onChangeText={(text) => setPassword(text)}
              editable={isSuccessSignedIn !== 'pending'}
            />
          </Pressable>
        </View>

        {isSuccessSignedIn === 'failure'
          ? <View>
            <Text style={{ color: 'red' }}>*Incorrect credentials</Text>
          </View>
          : null}

        {isSuccessSignedIn === 'success'
          ? <View>
            <Text style={{ color: 'green', fontWeight: '500', textAlign: 'center' }}>Signed in!</Text>
          </View>
          : null}

        {requiredNotFilled
          ? <View>
            <Text style={{ color: 'red' }}>*Please fill all fields</Text>
          </View>
          : null}

        {/* * Login Button * */}
        <View>
          <StyledButton method={handleSignIn} text='Log in' bgColor='#845FA8' />
        </View>
      </View>

      <View style={{ ...styles.container, flexDirection: 'row', marginTop: 20 }}>
        <Text style={{ color: '#767474', fontSize: 16 }}>Don’t have an account? </Text>
        <Text style={{ color: '#845FA8', fontSize: 16 }} onPress={() => router.replace('/sign-up')}>Sign up</Text>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
