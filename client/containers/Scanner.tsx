import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ToastAndroid,
} from 'react-native';
import { Camera, CameraCapturedPicture } from 'expo-camera';
import notify from '@utils/notifications/inAppNotifications';

const CameraPreview = ({ photo, retakePicture, savePhoto }: {
  photo: CameraCapturedPicture | undefined,
  retakePicture: () => void,
  savePhoto: () => void,
}) => (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%',
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                }}
              >
                Re-take
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                }}
              >
                save photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
);

let camera: Camera | null;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Scanner = ({
  openCamera,
  setUserData,
}: {
  openCamera: boolean,
  setUserData: (photo: CameraCapturedPicture | undefined | null) => void,
}) => {
  const [startCamera, setStartCamera] = React.useState(openCamera);
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState<CameraCapturedPicture | null>();
  const [cameraType, setCameraType] = React.useState('back');
  const [flashMode, setFlashMode] = React.useState('off');

  const handleStartCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    // eslint-disable-next-line no-console
    console.log('Camera permissions', status);
    if (status === 'granted') {
      setStartCamera(true);
    } else {
      ToastAndroid.showWithGravity(
        'Access denied',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  useEffect(() => {
    if (startCamera) handleStartCamera();
  }, [startCamera]);

  useEffect(() => {
    if (!previewVisible) setUserData(capturedImage);
  }, [previewVisible]);

  const handleTakePicture = async () => {
    const photo = await camera?.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  const handleSavePhoto = async () => {
    await notify('Picture saved', 'Sit tight, document has been scanned and is being verified.');
    // eslint-disable-next-line no-alert
    ToastAndroid.showWithGravity(
      'Picture saved: Sit tight. Document is being verified.',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    setPreviewVisible(false);
    setStartCamera(false);
  };

  const handleRetakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    setStartCamera(true);
  };

  const handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off');
    } else if (flashMode === 'off') {
      setFlashMode('on');
    } else {
      setFlashMode('auto');
    }
  };
  const handleSwitchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front');
    } else {
      setCameraType('back');
    }
  };

  return (
    <View style={styles.container}>
      {startCamera ? (
        <View
          style={{
            flex: 2,
            width: '100%',
          }}
        >
          {previewVisible && capturedImage ? (
            <CameraPreview
              photo={capturedImage}
              savePhoto={handleSavePhoto}
              retakePicture={handleRetakePicture}
            />
          ) : (
            <Camera
              type={0}
              flashMode={0}
              style={{ flex: 1 }}
              ref={(r) => {
                camera = r;
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    left: '5%',
                    top: '10%',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <TouchableOpacity
                    onPress={handleFlashMode}
                    style={{
                      backgroundColor: flashMode === 'off' ? '#000' : '#fff',
                      borderRadius: 12.5,
                      height: 25,
                      width: 25,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                      }}
                    >
                      ⚡️
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSwitchCamera}
                    style={{
                      marginTop: 20,
                      borderRadius: 12.5,
                      height: 25,
                      width: 25,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                      }}
                    >
                      {cameraType === 'front' ? '🤳' : '📷'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    padding: 20,
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'center',
                      flex: 1,
                      alignItems: 'center',
                    }}
                  >
                    <TouchableOpacity
                      onPress={handleTakePicture}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: '#fff',
                      }}
                    />
                  </View>
                </View>
              </View>
            </Camera>
          )}
        </View>
      ) : null
      }

      <StatusBar style="auto" />
    </View>
  );
};

export default Scanner;
