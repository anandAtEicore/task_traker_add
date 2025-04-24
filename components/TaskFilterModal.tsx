

import { StyleSheet, TextInput, Modal, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DatePickerInput } from 'react-native-paper-dates';
import { useState } from 'react';
import { en, registerTranslation } from 'react-native-paper-dates';
import { VStack } from './ui/vstack';
import { Send, X } from 'lucide-react-native';
import CustomButtonDate from './CustomButtonDate';
import CustomButton from './CustomButton';

// Register English locale for date picker
registerTranslation('en', en);

type TaskFilterModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (startDate: Date | null, endDate: Date | null, username: string) => void;
  initialStartDate: Date | null;
  initialEndDate: Date | null;
  initialUsername: string;
  isAdmin: boolean;
};

export default function TaskFilterModal({
  visible,
  onClose,
  onApply,
  initialStartDate,
  initialEndDate,
  initialUsername,
  isAdmin,
}: TaskFilterModalProps) {
  const [tempStartDate, setTempStartDate] = useState<Date | null>(initialStartDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(initialEndDate);
  const [tempUsername, setTempUsername] = useState<string>(initialUsername);

  const handleApplyFilters = () => {
    onApply(tempStartDate, tempEndDate, tempUsername);
    onClose();
  };

  const handleClearFilters = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    setTempUsername('');
    onApply(null, null, '');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={styles.modalContainer}>
          <ThemedText style={styles.modalTitle}>Filter Tasks</ThemedText>

          {/* Start Date */}
          <ThemedView style={styles.modalInputContainer}>
            <ThemedText style={styles.modalLabel}>Start Date:</ThemedText>
            <DatePickerInput
              locale="en"
              value={tempStartDate || undefined}
              onChange={(date) => setTempStartDate(date || null)}
              inputMode="start"
              style={styles.dateInput}
              placeholder="Select Date"
            />
          </ThemedView>

          {/* End Date (Admin Only) */}
          {isAdmin && (
            <VStack>

            <ThemedView style={styles.modalInputContainer}>
              <ThemedText style={styles.modalLabel}>End Date:</ThemedText>
              <DatePickerInput
                locale="en"
                value={tempEndDate || undefined}
                onChange={(date) => setTempEndDate(date || null)}
                inputMode="start"
                style={styles.dateInput}
                placeholder="Select Date"
                />
            </ThemedView>
            <ThemedView style={styles.modalInputContainer}>
            <ThemedText style={styles.modalLabel}>Username:</ThemedText>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter username"
              value={tempUsername}
              onChangeText={setTempUsername}
              placeholderTextColor="#999"
              />
          </ThemedView>
              </VStack>
          )}

  
          

          {/* Buttons */}
          <ThemedView style={styles.modalButtonContainer}>
          <CustomButton
                      title="Clear"
                      onPress={handleClearFilters}
                      icon={<X size={16} color="#FFFFFF" />}
                    />
                      <CustomButton
                      title="Apply"
                      onPress={handleApplyFilters}
                      icon={<Send size={16} color="#FFFFFF" />}
                    />
       
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInputContainer: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap:10
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  clearButton: {
    backgroundColor: '#ff4d4f',
  },
  applyButton: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});