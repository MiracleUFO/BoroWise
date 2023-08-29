import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  ToastAndroid,
} from 'react-native';
import { router } from 'expo-router';
import StyledButton from '@components/StyledButton';
import Scanner from '@containers/Scanner';
import { CameraCapturedPicture } from 'expo-camera';
import { useAuth } from '@context/auth';

// import axios from 'axios';
import FormData from 'form-data';
// import notify from '@utils/notifications/inAppNotifications';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 10,
    marginHorizontal: '5%',
  },
  title: {
    textTransform: 'uppercase',
    color: '#845FA8',
    fontSize: 35,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});

const VerificationModal = ({
  aim,
  accountId,
  setJobVerified,
  setAssetVerified,
  signUp,
}: {
  aim: string,
  accountId: number,
  setJobVerified?: (stuff: boolean) => void,
  setAssetVerified?: (stuff: boolean) => void;
  signUp?: boolean;
}) => {
  const [modalAim, setModalAim] = useState(aim);
  const [isBeginSelected, setIsBeginSelected] = useState(false);
  const [userData, setUserData] = useState<CameraCapturedPicture | null>();
  const [isRecognisedFound, setIsRecFound] = useState(false);

  const recognise = (photo: CameraCapturedPicture | null | undefined) => {
    if (photo) {
      // eslint-disable-next-line no-console
      console.log('RECOGNISING...');
      const formData = new FormData();
      formData.append('image/jpeg', photo.uri);
      /* const result = await axios.post('https://api.api-ninjas.com/v1/imagetotext', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Api-Key': 'BRQxc2NiD2/PxUg18XAwqQ==tdXAVH0UbdNvvCW1',
        },
      });
      console.log(result.statusText, result.status);
      console.log('RESULT', result); */
      // should check for user's name and NIN in document
      setIsRecFound(true);
      return true;
    }
    return true;
  };

  const { verifyAccount } = useAuth();

  const navigateToJobModal = () => {
    setModalAim('Job');
  };

  useEffect(() => {
    if (setJobVerified) setJobVerified(false);
  }, []);

  useEffect(() => {
    if (userData) {
      setIsBeginSelected(!userData);
      recognise(userData);
    }
  }, [userData]);

  useEffect(() => {
    if (userData && isRecognisedFound && modalAim === 'Identification') {
      verifyAccount(accountId);
      setUserData(null);
      navigateToJobModal();
    }

    if (userData && isRecognisedFound && modalAim === 'Job') {
      if (setJobVerified) {
        setJobVerified(true);
        if (!signUp) {
          ToastAndroid.showWithGravity(
            'Job Verified successfully',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        } else {
          router.replace('/');
        }
      } else {
        ToastAndroid.showWithGravity(
          'Unable to verify and add job',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    }

    if (userData && isRecognisedFound && modalAim === 'Asset') {
      if (setAssetVerified) {
        setAssetVerified(true);
        ToastAndroid.showWithGravity(
          'Asset Added successfully',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    }
  }, [userData, isRecognisedFound, aim]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isBeginSelected && !userData
        ? <Scanner
            openCamera={isBeginSelected}
            setUserData={(stuff) => setUserData(stuff)}
          />
        : (
          <View style={styles.container}>
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
              Verify {modalAim}
            </Text>
            <Text style={{ color: '#7F7F7F' }}>
              {modalAim === 'Identification' ? 'Please scan your NIN slip or National ID Card' : `Please scan your ${modalAim} document`}
            </Text>
          </View>
          <StyledButton text='Scan Document' method={() => setIsBeginSelected(true)} bgColor='#0F949E' />
          {signUp && modalAim !== 'Identification'
            ? <StyledButton text='Skip Step' method={() => (modalAim === 'Identification' ? navigateToJobModal() : router.replace('/'))} bgColor='#0F949E' />
            : null
          }
          </View>
        )
      }
    </SafeAreaView>
  );
};

export default VerificationModal;
