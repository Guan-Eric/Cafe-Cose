import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

interface PasswordErrorModalProps {
  modalVisible: boolean;
  onClose: () => void;
  minLength: number;
}

const PasswordErrorModal: React.FC<PasswordErrorModalProps> = ({
  modalVisible,
  onClose,
  minLength,
}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/40">
        <View className="w-[300px] items-center rounded-[20px] bg-[#1f1f1f] p-5">
          <Text className="self-start font-sans text-lg text-[#f8f9fa]">Password must:</Text>
          <Text className="mb-2.5 self-start font-sans text-sm text-[#f8f9fa]">
            {'\n'}- Be at least {minLength} characters long.
            {'\n'}- Match the confirmation password.
          </Text>
          <View className="w-full flex-col">
            <TouchableOpacity
              onPress={onClose}
              className="my-1.5 w-full items-center rounded-[10px] bg-[#3490de] p-2.5">
              <Text className="font-sans text-base text-[#f8f9fa]">Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PasswordErrorModal;
