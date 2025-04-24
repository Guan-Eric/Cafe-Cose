import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, Pressable, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { getUser, incrementStamp } from 'backend/user';
import { User } from 'components/types';

function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setUserId(data);
    setUserName(((await getUser(data)) as User).name);
    setModalVisible(true);
  };

  const handleGiveStamp = () => {
    incrementStamp(userId);
    setModalVisible(false);
    setScanned(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setScanned(false);
  };

  if (!permission) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>No access to camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ flex: 1 }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Give Stamp to {userName}?</Text>
            <Text style={{ marginBottom: 20 }}>Do you want to give a stamp to this user?</Text>
            <Pressable
              onPress={handleGiveStamp}
              style={{ backgroundColor: '#3490de', padding: 10, borderRadius: 5 }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Yes</Text>
            </Pressable>
            <Pressable
              onPress={handleCancel}
              style={{ marginTop: 10, padding: 10, borderRadius: 5 }}>
              <Text style={{ textAlign: 'center' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default QRScannerScreen;
