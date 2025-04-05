import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';

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
          <Text className="self-start text-lg font-bold text-[#f8f9fa]">Password must:</Text>
          <Text className="mb-2.5 self-start text-sm text-[#f8f9fa]">
            {'\n'}- Be at least {minLength} characters long.
            {'\n'}- Contain at least one uppercase letter.
            {'\n'}- Contain at least one lowercase letter.
            {'\n'}- Contain at least one number.
            {'\n'}- Contain at least one special character.
            {'\n'}- Match the confirmation password.
          </Text>
          <View className="w-full flex-col">
            <Pressable
              onPress={onClose}
              className="my-1.5 w-full items-center rounded-[10px] bg-[#3490de] p-2.5">
              <Text className="text-base text-[#f8f9fa]">Ok</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PasswordErrorModal;
