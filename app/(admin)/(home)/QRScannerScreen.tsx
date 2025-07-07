import { useState } from 'react';
import { View, Text, Button, Modal, Pressable, SafeAreaView, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { getUser, incrementStamp } from 'backend/user';
import { User } from 'components/types';

function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [currentPoints, setCurrentPoints] = useState(0);
  const [stampCount, setStampCount] = useState(1);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    const user = (await getUser(data)) as User;
    setScanned(true);
    setUserId(data);
    setCurrentPoints(user.points);
    setUserName(user.name);
    setModalVisible(true);
  };

  const handleGiveStamp = () => {
    incrementStamp(userId, stampCount);
    setModalVisible(false);
    setScanned(false);
    setStampCount(1);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setScanned(false);
    setStampCount(1);
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
            {currentPoints + stampCount >= 9 ? (
              <Text style={{ marginBottom: 10, fontWeight: 'bold', color: 'green' }}>
                🎉 This stamp will give {userName} a free drink!
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity onPress={() => setStampCount((prev) => Math.max(1, prev - 1))}>
                <Text style={{ fontSize: 20, paddingHorizontal: 10 }}>−</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 20 }}>{stampCount}</Text>
              <TouchableOpacity onPress={() => setStampCount((prev) => prev + 1)}>
                <Text style={{ fontSize: 20, paddingHorizontal: 10 }}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={handleGiveStamp}
              style={{ backgroundColor: '#3490de', padding: 10, borderRadius: 5 }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCancel}
              style={{ marginTop: 10, padding: 10, borderRadius: 5 }}>
              <Text style={{ textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default QRScannerScreen;
