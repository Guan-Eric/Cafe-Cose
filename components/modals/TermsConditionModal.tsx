import React, { useState } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface TermsConditionModalProps {
  modalVisible: boolean;
  onClose: () => void;
}

const TermsConditionModal: React.FC<TermsConditionModalProps> = ({ modalVisible, onClose }) => {
  const [isCheck, setIsCheck] = useState<boolean>(false);

  return (
    <Modal visible={modalVisible} animationType="fade" transparent onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="h-[80%] w-[86%] rounded-2xl bg-card ">
          <ScrollView contentContainerClassName="p-4">
            <Text className="mb-2 text-center text-lg font-bold text-text">
              End User License Agreement (EULA) and Terms of Service
            </Text>

            <Text className="mt-3 text-base font-bold text-text">1. Acceptance of Terms</Text>
            <Text className="mt-1 text-sm leading-5 text-text">
              By downloading, accessing, or using the App, you confirm that you have read,
              understood, and agree to this Agreement. If you are under 18 years of age, you may
              only use the App with the consent of a parent or legal guardian.
            </Text>

            <Text className="mt-3 text-base font-bold text-text">2. Prohibited Activities</Text>
            <Text className="mt-1 text-sm leading-5 text-text">
              The following activities are strictly prohibited within the App: - Posting, sharing,
              or transmitting any content that is abusive, defamatory, hateful, obscene, or
              otherwise objectionable. - Harassing, threatening, or impersonating other users.
            </Text>

            <Text className="mt-3 text-base font-bold text-text">3. Content Moderation</Text>
            <Text className="mt-1 text-sm leading-5 text-text">
              All user-generated content ("UGC") will be monitored for compliance with this
              Agreement. The Company reserves the right to review, edit, or remove any UGC that
              violates these terms without prior notice. The Company is not liable for any
              user-generated content but will act promptly to address flagged issues.
            </Text>

            <Text className="mt-3 text-base font-bold text-text">4. User Responsibility</Text>
            <Text className="mt-1 text-sm leading-5 text-text">
              Users are solely responsible for the content they post, share, or interact with on the
              App.
            </Text>

            <Text className="mt-3 text-base font-bold text-text">5. Termination</Text>
            <Text className="mt-1 text-sm leading-5 text-text">
              The Company reserves the right to suspend or terminate your access to the App if you
              violate this Agreement or engage in any prohibited activities.
            </Text>

            <Text className="mt-3 text-base font-bold text-text">6. Privacy Policy</Text>
            <Text className="mt-1 text-sm leading-5 text-text">
              Your use of the App is subject to the Company's Privacy Policy, which is incorporated
              into this Agreement. By using the App, you consent to the data practices described in
              the Privacy Policy.
            </Text>

            <Text className="mt-3 text-base font-bold text-text">7. Disclaimer of Warranties</Text>
            <Text className="mt-1 text-sm leading-5 text-text">
              The App is provided "as is" without any warranties of any kind, whether express or
              implied. The Company does not guarantee the accuracy, reliability, or availability of
              the App or its content.
            </Text>

            <Text className="mt-3 text-base font-bold text-text">8. Limitation of Liability</Text>
            <Text className="mt-1 text-sm leading-5 text-text">
              The Company shall not be liable for any damages arising from your use of the App or
              inability to use the App.
            </Text>

            <Text className="mt-3 text-base font-bold text-text">9. Governing Law</Text>
            <Text className="mt-1 text-sm leading-5 text-text">
              This Agreement shall be governed by and construed in accordance with the laws of
              Canada.
            </Text>

            <Text className="mt-3 text-base font-bold text-text">10. Contact Information</Text>
            <Text className="mt-1 text-sm leading-5 text-text">
              If you have any questions or concerns regarding this Agreement, please contact us at:
              info@cafecose.com
            </Text>

            <TouchableOpacity
              onPress={() => setIsCheck(!isCheck)}
              className="mt-4 flex-row items-center">
              <View
                className={`mr-2 h-5 w-5 items-center justify-center rounded border-2 border-text ${isCheck ? 'bg-primary' : 'bg-transparent'}`}></View>
              <Text className="text-sm text-text">
                I declare that I have read the EULA and Terms of Service
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!isCheck}
              onPress={onClose}
              className={`mt-4 items-center rounded-xl py-3 ${
                isCheck ? 'bg-primary' : 'bg-input'
              }`}>
              <Text className={`font-bold text-white ${!isCheck ? 'opacity-50' : ''}`}>Agree</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default TermsConditionModal;
