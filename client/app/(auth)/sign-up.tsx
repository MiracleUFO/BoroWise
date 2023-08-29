import { useLayoutEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import StyledButton from '@components/StyledButton';
import StyledOpenInput from '@components/StyledOpenInput';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@context/auth';
import { router } from 'expo-router';
import JobForm from '@containers/JobForm';
import VerificationModal from '@containers/VerififcationModal';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginHorizontal: '5%',
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

const SignUp = () => {
  const { signUp } = useAuth();
  const navigation = useNavigation();

  const [isPassHidden, setIsPassHidden] = useState(true);
  const [requiredNotFilled, setRequiredNotFilled] = useState(false);
  const [verificationModalShow, setVerificationModalShow] = useState(false);
  const [isSuccessSignedUp, setIsSuccessSignedUp] = useState('');
  const [accountId, setAccountId] = useState(0);
  const [jobVerified, setIsJobVerified] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nin, setNin] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [securityPin, setSecurityPin] = useState('');

  const [job, setJob] = useState('');
  const [salary, setSalary] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      tabBarStyle: { display: 'none' },
      tabBarVisible: false,
    });
  }, [navigation]);

  const handleSignUp = async () => {
    const salaryValue = parseFloat(salary);
    if (
      email
      && password
      && firstName
      && lastName
      && phoneNumber?.length === 10
      && securityPin?.length === 4
      && job
      && nin?.length === 11
      && (!Number.isNaN(salaryValue) && salaryValue <= 10000000 && salaryValue >= 120000)
    ) {
      setIsSuccessSignedUp('pending');

      // create account
      const accountCreated = await signUp(
        email,
        password,
        firstName,
        lastName,
        nin,
        phoneNumber,
        securityPin,
        job,
        salaryValue,
      );

      setIsSuccessSignedUp(accountCreated && accountCreated?.length > 0 ? 'sucesss' : 'failure');
      setTimeout(() => setIsSuccessSignedUp(''), 5000);

      // open verification modal
      if (accountCreated && accountCreated?.length && accountCreated?.[0]?.id) {
        setAccountId(accountCreated?.[0]?.id);
        ToastAndroid.showWithGravity(
          'Signed up successfully!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setVerificationModalShow(true);
      }
    } else {
      setRequiredNotFilled(true);
      setTimeout(() => setRequiredNotFilled(false), 5000);
    }
  };

  return (
    <>
    {verificationModalShow
      ? <VerificationModal aim='Identification' accountId={accountId} setJobVerified={setIsJobVerified} signUp />
      : <SafeAreaView style={{ flex: 1 }}>
          <View style={{ alignItems: 'center', marginTop: 90, marginBottom: 55 }}>
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
              Welcome
            </Text>
            <Text style={{ color: '#7F7F7F' }}>
              Sign up to get loans.
            </Text>
          </View>

          <View style={{ ...styles.container, flex: 5, height: 10 }}>
            {/* * Input Section * */}
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              style={{ marginBottom: 10, marginHorizontal: 20 }}
            >
              <StyledOpenInput value={firstName} onChangeText={(text) => setFirstName(text)} label='First Name' placeholder='First Name' editable={isSuccessSignedUp !== 'pending'} />
              <StyledOpenInput value={lastName} onChangeText={(text) => setLastName(text)} label='Last Name' placeholder='Last Name' editable={isSuccessSignedUp !== 'pending'} />
              <StyledOpenInput
                label='National Identification Number (NIN)'
                placeholder='_ _ _ _ _ _ _ _ _ _ _'
                keyboardType='numeric'
                value={nin}
                onChangeText={(text) => setNin(text)}
                maxLength={11}
                editable={isSuccessSignedUp !== 'pending'}
              />
              <StyledOpenInput value={email} onChangeText={(text) => setEmail(text)} label='Email' placeholder='example@email.com' keyboardType='email-address' editable={isSuccessSignedUp !== 'pending'} />
              <Pressable onPress={() => setIsPassHidden(!isPassHidden)}>
                <StyledOpenInput
                  value={password}
                  label='Password'
                  secure={isPassHidden}
                  placeholder='* * * * * * * * * *'
                  iconRight={isPassHidden ? 'eye-off-outline' : 'eye-outline'}
                  onChangeText={(text) => setPassword(text)}
                  editable={isSuccessSignedUp !== 'pending'}
                />
              </Pressable>
              <StyledOpenInput
                label='Phone Number'
                placeholder='( _ _ _ ) _ _ _  _ _ _ _'
                keyboardType='phone-pad'
                value={`${phoneNumber}`}
                onChangeText={(text) => setPhoneNumber(text)}
                maxLength={10}
                iconLeft='flag-sharp'
                iconLeftColor='green'
                iconPositionBottom={25}
                editable={isSuccessSignedUp !== 'pending'}
              />
              <StyledOpenInput
                secure
                label='Security Pin'
                placeholder='_ _ _ _'
                keyboardType='numeric'
                value={securityPin}
                onChangeText={(text) => setSecurityPin(text)}
                maxLength={4}
                editable={isSuccessSignedUp !== 'pending'}
              />
              <JobForm
                submissionPending={isSuccessSignedUp}
                accountId={accountId}
                setJobType={setJob}
                setSalaryValue={setSalary}
                jobVerified={jobVerified}
              />
            </ScrollView>

            {isSuccessSignedUp === 'failure'
              ? <View>
                <Text style={{ color: 'red' }}>*Failure. Contact admin.</Text>
              </View>
              : null}

            {isSuccessSignedUp === 'success'
              ? <View>
                <Text style={{ color: 'green', fontWeight: '500', textAlign: 'center' }}>Signed in!</Text>
              </View>
              : null}

            {requiredNotFilled
              ? <View>
                <Text style={{ color: 'red' }}>*Please fill all fields</Text>
              </View>
              : null}

            {/* * Sign up Button * */}
            <View>
              <StyledButton method={handleSignUp} text='Sign up' bgColor='#845FA8' />
            </View>
          </View>

          <View style={{
            ...styles.container,
            flexDirection: 'row',
            marginTop: 20,
            flex: 1,
          }}>
            <Text style={{ color: '#767474', fontSize: 16 }}>Have an account? </Text>
            <Text style={{ color: '#845FA8', fontSize: 16 }} onPress={() => router.replace('/sign-in')}>Sign in</Text>
          </View>
        </SafeAreaView>}
    </>
  );
};

export default SignUp;
