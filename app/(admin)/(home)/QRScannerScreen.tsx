import { useState } from 'react';
import { View, Text, Button, Modal, SafeAreaView, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { getUser, incrementStamp } from 'backend/user';
import { User } from 'components/types';
import BackButtonWithBackground from 'components/BackButtonWithBackground';

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
    setCurrentPoints(user.points % 10);
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
      <SafeAreaView className="flex-1">
        <Text>No access to camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1">
      <BackButtonWithBackground />
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
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View className="w-75 rounded-3xl bg-background p-5">
            <Text className="mb-2 self-center font-sans text-xl">Give Stamp to {userName}?</Text>
            <Text className="mb-2 self-center font-sans">
              How many stamps do you want to give to this user?
            </Text>
            {currentPoints + stampCount >= 9 ? (
              <Text className=" self-center font-sans text-primary">
                🎉 This stamp will give {userName} a free drink!
              </Text>
            ) : null}
            <View className="my-4 flex-row items-center justify-center">
              <TouchableOpacity onPress={() => setStampCount((prev) => Math.max(1, prev - 1))}>
                <Text className="px-2 font-sans text-3xl">−</Text>
              </TouchableOpacity>
              <Text className="font-sans text-3xl">{stampCount}</Text>
              <TouchableOpacity onPress={() => setStampCount((prev) => prev + 1)}>
                <Text className="px-2 font-sans text-3xl">+</Text>
              </TouchableOpacity>
            </View>
            <View className="mt-4 flex-row gap-4 self-center">
              <TouchableOpacity
                onPress={handleGiveStamp}
                className="w-[100px] self-center rounded-full bg-primary p-2">
                <Text className="text-center font-sans text-offwhite">Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancel}
                className=" w-[100px] self-center rounded-full bg-gray-400 p-2">
                <Text className="text-center font-sans text-offwhite">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default QRScannerScreen;
