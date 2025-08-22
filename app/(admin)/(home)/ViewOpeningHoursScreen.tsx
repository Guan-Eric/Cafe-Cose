import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { getOpeningHours, updateHours } from 'backend/hours';
import { Hours } from 'components/types';
import BackButton from 'components/BackButton';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StyledInput = ({ value, onChangeText, placeholder }: any) => (
  <TextInput
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    className="w-full rounded-xl bg-input px-3 py-2 text-text "
    placeholderTextColor="#999"
  />
);

const StyledButton = ({ title, onPress }: any) => (
  <TouchableOpacity onPress={onPress} className="my-3 w-[160px] rounded-full bg-primary px-4 py-3 ">
    <Text className="text-center text-base font-semibold text-offwhite">{title}</Text>
  </TouchableOpacity>
);

const ViewOpeningHoursScreen = () => {
  const [hours, setHours] = useState<Hours | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOpeningHours = async () => {
      const fetchedHours = await getOpeningHours();
      setHours(fetchedHours);
      setLoading(false);
    };
    fetchOpeningHours();
  }, []);

  const handleUpdateHours = async () => {
    if (hours) {
      try {
        await updateHours(hours);
        Alert.alert('Success', 'Opening hours updated successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to update opening hours.');
      }
    }
  };
  const handleChangeHours = (
    day: keyof Hours['defaultHours'],
    field: 'open' | 'close',
    value: string
  ) => {
    if (hours) {
      setHours({
        ...hours,
        defaultHours: {
          ...hours.defaultHours,
          [day]: {
            ...hours.defaultHours[day],
            [field]: value,
          },
        },
      });
    }
  };

  const handleChangeHoliday = (index: number, field: 'open' | 'close' | 'name', value: string) => {
    if (hours) {
      const updatedHolidays = [...hours.holiday];
      updatedHolidays[index] = {
        ...updatedHolidays[index],
        [field]: value,
      };
      setHours({
        ...hours,
        holiday: updatedHolidays,
      });
    }
  };

  const handleChangeHolidayDate = (index: number, date: Date) => {
    if (hours) {
      const updatedHolidays = [...hours.holiday];
      updatedHolidays[index] = {
        ...updatedHolidays[index],
        date: date,
      };
      setHours({
        ...hours,
        holiday: updatedHolidays,
      });
    }
  };

  const handleAddHoliday = () => {
    if (hours) {
      const newHoliday = { date: new Date(), open: '', close: '', name: '' };
      setHours({
        ...hours,
        holiday: [...hours.holiday, newHoliday],
      });
    }
  };

  const handleDeleteHoliday = (index: number) => {
    if (hours) {
      const updatedHolidays = hours.holiday.filter((_, i) => i !== index);
      setHours({
        ...hours,
        holiday: updatedHolidays,
      });
    }
  };

  if (loading) {
    return <Text className="mt-10 text-center">Loading...</Text>;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled">
            {/* Header */}
            <View className="mb-6 flex-row items-center">
              <BackButton />
              <Text className=" text-3xl font-bold text-text">Edit Opening Hours</Text>
            </View>

            {/* Default Hours */}
            {hours?.defaultHours &&
              (
                [
                  'Sunday',
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                ] as Array<keyof typeof hours.defaultHours>
              ).map((day) => {
                const { open, close } = hours.defaultHours[day as keyof typeof hours.defaultHours];
                return (
                  <View key={day} className="mx-4 mb-4 rounded-2xl bg-background p-4 shadow-sm">
                    <Text className="mb-2 text-lg font-semibold text-[#3B2F2F]">
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Text>
                    <View className="flex-row gap-2">
                      <View className="flex-1">
                        <Text className="mb-1 text-sm text-gray-600">Open</Text>
                        <StyledInput
                          value={open}
                          onChangeText={(value: string) =>
                            handleChangeHours(day as keyof typeof hours.defaultHours, 'open', value)
                          }
                          placeholder="8:00 AM"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="mb-1 text-sm text-gray-600">Close</Text>
                        <StyledInput
                          value={close}
                          onChangeText={(value: string) =>
                            handleChangeHours(
                              day as keyof typeof hours.defaultHours,
                              'close',
                              value
                            )
                          }
                          placeholder="6:00 PM"
                        />
                      </View>
                    </View>
                  </View>
                );
              })}

            {/* Holidays */}
            <View className="mx-4 flex-row justify-between">
              <Text className="mb-2 mt-6 text-xl font-bold text-primary">Holidays</Text>
              <StyledButton title="+ Add Holiday" onPress={handleAddHoliday} />
            </View>
            {hours?.holiday &&
              hours.holiday.map((holiday, index) => (
                <Swipeable
                  renderRightActions={() => (
                    <TouchableOpacity
                      onPress={() => handleDeleteHoliday(index)}
                      className="mr-4 h-[40px] w-[40px] items-center justify-center self-center rounded-full bg-red-500">
                      <MaterialCommunityIcons name="delete-outline" size={30} color={'white'} />
                    </TouchableOpacity>
                  )}>
                  <View key={index} className="mx-4 mb-4 rounded-2xl bg-background p-4 shadow-sm">
                    <Text className="mb-1 text-sm text-gray-600">Holiday Name</Text>
                    <StyledInput
                      value={holiday.name}
                      onChangeText={(value: string) => handleChangeHoliday(index, 'name', value)}
                    />
                    <View className="mt-2 rounded-md">
                      <Text className="mb-1 text-sm text-gray-600">Date</Text>
                      <DateTimePicker
                        value={holiday.date instanceof Date ? holiday.date : new Date()}
                        mode="date"
                        display="default"
                        textColor="#1a1a1a"
                        accentColor="#762e1f"
                        onChange={(event: DateTimePickerEvent, date?: Date) =>
                          handleChangeHolidayDate(index, date instanceof Date ? date : new Date())
                        }
                        style={{
                          width: '100%',
                          marginLeft: -10,
                        }}
                      />
                    </View>
                    <View className="mt-2 flex-row gap-2">
                      <View className="flex-1">
                        <Text className="mb-1 text-sm text-gray-600">Open</Text>
                        <StyledInput
                          value={holiday.open}
                          onChangeText={(value: string) =>
                            handleChangeHoliday(index, 'open', value)
                          }
                          placeholder="CLOSED"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="mb-1 text-sm text-gray-600">Close</Text>
                        <StyledInput
                          value={holiday.close}
                          onChangeText={(value: string) =>
                            handleChangeHoliday(index, 'close', value)
                          }
                          placeholder="CLOSED"
                        />
                      </View>
                    </View>
                  </View>
                </Swipeable>
              ))}

            {/* Save Button */}
            <View className="items-center">
              <StyledButton title="Update Hours" onPress={handleUpdateHours} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ViewOpeningHoursScreen;
