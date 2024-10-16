import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

const App = () => {
  const [screen, setScreen] = useState('home');
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);

  const handleCameraAccess = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(status === 'granted');
    setScreen('camera');
  };

  const handleLocationAccess = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permissão de localização negada');
      return;
    }
    const userLocation = await Location.getCurrentPositionAsync({});
    setLocation(userLocation);
    setScreen('location');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Acesse a sua camera e localização</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleCameraAccess}>
                <Text style={styles.buttonText}>Acessar Câmera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleLocationAccess}>
                <Text style={styles.buttonText}>Acessar Localização</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'camera':
        return (
          <CameraScreen 
            hasCameraPermission={hasCameraPermission} 
            onGoBack={() => setScreen('home')}
            onTakePicture={setPhoto}
          />
        );
      case 'location':
        return <LocationScreen location={location} onGoBack={() => setScreen('home')} />;
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderScreen()}</View>;
};

const CameraScreen = ({ hasCameraPermission, onGoBack, onTakePicture }) => {
  const [cameraRef, setCameraRef] = useState(null);

  if (hasCameraPermission === null) {
    return <Text>Solicitando permissão da câmera...</Text>;
  }
  if (hasCameraPermission === false) {
    return <Text>Sem acesso à câmera</Text>;
  }

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      onTakePicture(photo.uri);
    }
  };

  return (
    <View style={styles.cameraContainer}>
      <Camera style={styles.camera} ref={ref => setCameraRef(ref)}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText}>Tirar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onGoBack}>
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const LocationScreen = ({ location, onGoBack }) => {
  return (
    <View style={styles.locationContainer}>
      <Text style={styles.locationTitle}>Localização:</Text>
      <Text style={styles.locationText}>{location ? JSON.stringify(location) : 'Localização não disponível'}</Text>
      <TouchableOpacity style={styles.button} onPress={onGoBack}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E0F7FA', 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00796B', 
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4DB6AC', 
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#009688', 
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 18,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  camera: {
    flex: 1,
  },
  locationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    padding: 20,
    borderRadius: 10,
  },
  locationTitle: {
    fontSize: 24,
    color: '#00796B',
    marginBottom: 10,
  },
  locationText: {
    textAlign: 'center',
    color: '#004D40', 
  },
});

export default App;
