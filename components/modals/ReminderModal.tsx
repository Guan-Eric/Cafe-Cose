import { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { scheduleRunReminder } from 'backend/notification';

interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
  runDate: string;
}

const ReminderModal = ({ visible, onClose, runDate }: ReminderModalProps) => {
  const [reminderTime, setReminderTime] = useState<number | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const reminderPresets = [15, 30, 60, 120];

  const handleSelectPreset = (minutes: number) => {
    setReminderTime(minutes);
    setSelectedPreset(minutes);
  };

  const handleSetReminder = async () => {
    if (reminderTime !== null) {
      const runDateTime = new Date(runDate);
      const notificationId = await scheduleRunReminder(runDateTime, reminderTime);
      if (notificationId) {
        Alert.alert(
          'Reminder Set',
          `Your reminder has been set for ${reminderTime} minutes before the run!`
        );
      } else {
        Alert.alert('Error', 'Failed to set reminder.');
      }
      resetAndClose();
    } else {
      Alert.alert('Error', 'Please select or enter a reminder time.');
    }
  };

  const resetAndClose = () => {
    setReminderTime(null);
    setSelectedPreset(null);
    onClose();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={resetAndClose}>
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View className="w-5/6 rounded-xl bg-white p-6 shadow-xl">
          <Text className="mb-6 text-center text-2xl font-bold text-gray-800">
            Set Run Reminder
          </Text>

          <Text className="mb-3 font-medium text-gray-600">Select reminder time:</Text>
          <View className="mb-5 flex-row flex-wrap justify-between">
            {reminderPresets.map((preset) => (
              <TouchableOpacity
                key={preset}
                onPress={() => {
                  handleSelectPreset(preset);
                }}
                className={`mb-2 w-[48%] rounded-lg py-3`}
                style={{
                  backgroundColor: selectedPreset === preset ? '#3B82F6' : '#E5E7EB',
                }}>
                <Text
                  className={`text-center font-medium`}
                  style={{ color: selectedPreset === preset ? '#FFFFFF' : '#374151' }}>
                  {preset} minutes
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={resetAndClose}
              className="mr-2 flex-1 rounded-lg bg-gray-200 p-3">
              <Text className="text-center font-bold text-gray-700">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSetReminder}
              className="ml-2 flex-1 rounded-lg bg-blue-500 p-3 shadow">
              <Text className="text-center font-bold text-white">Set Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReminderModal;
