import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
// import { BarCodeScanner } from "expo-barcode-scanner";
import {Colors, Sizes} from '../constants/styles';
import DashedLineBorder from '../components/DashedLineBorder';
import {Svg, Rect, Path, Circle, Line, G} from 'react-native-svg';
import 'react-native-reanimated';
import {runOnJS} from 'react-native-reanimated';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
  scanQRCodes,
} from 'react-native-vision-camera';
import Loader from '../components/Loader';

const {width, height} = Dimensions.get('screen');

const Scanner = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [device, setDevice] = useState(null);

  const radius = 80; // Specify the radius of the circle
  const circumference = 3 * Math.PI * radius; // Calculate the circumference
  const arcLength = 0.3 * circumference; // Calculate the desired arc length
  const angle = (arcLength / circumference) * 360; //
  const devices = useCameraDevices();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const newCameraPermission = await Camera.requestCameraPermission();
        const newMicrophonePermission =
          await Camera.requestMicrophonePermission();
        console.log(newCameraPermission);
        if (newCameraPermission == 'authorized') {
          setDevice(devices.back);
          setHasPermission(true);
        }
        // await BarcodeTracking.start();
      } catch (err) {
        console.log('Error starting camera: ', err);
      }
    };
    startCamera()
  }, [hasPermission]);

  const handleBarCodeScanned = ({data}) => {
    setScanned(true);
    alert(`Scanned data: ${data}`);
  };

  const onQRCodeDetected = useCallback((qrCode: string) => {
    console.log(qrCode);
    // navigation.push("ProductPage", { productId: qrCode })
  }, []);

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      const qrCodes = scanQRCodes(frame);
      console.log(frame);
      if (qrCodes.length > 0) {
        runOnJS(onQRCodeDetected)(qrCodes[0]);
      }
    },
    [onQRCodeDetected],
  );

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera.</Text>;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Colors.blackColor}
        barStyle={'light-content'}
      />
      <View style={styles.squareContainer}>
        {hasPermission && device && (
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
          />
        )}

        <View style={styles.overlay}>
          <View style={styles.scanArea}></View>
        </View>
      </View>
      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blackColor,
  },
  squareContainer: {
    position: 'relative',
    width: '80%',
    aspectRatio: 1,
    overflow: 'hidden',
    backgroundColor: 'red',
    borderRadius: 15,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  scanArea: {
    width: '90%',
    height: '90%',
    borderWidth: 3,
    borderColor: Colors.whiteColor,
    borderRadius: 15,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '25%',
    borderWidth: 2,
    borderColor: 'white',
  },
  borderLeft: {
    position: 'absolute',
    top: '25%',
    left: 0,
    width: '25%',
    height: '50%',
    borderWidth: 2,
    borderColor: 'white',
  },
  borderRight: {
    position: 'absolute',
    top: '25%',
    right: 0,
    width: '25%',
    height: '50%',
    borderWidth: 2,
    borderColor: 'white',
  },
  borderBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '25%',
    borderWidth: 2,
    borderColor: 'white',
  },
  button: {
    marginTop: 20,
  },
});

export default Scanner;
