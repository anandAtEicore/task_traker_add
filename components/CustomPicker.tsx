import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Define the Option type for Picker items
interface Option {
  label: string;
  value: string;
}

// Props for the PickerInput component
interface PickerInputProps {
  label: string; // Display label for the field
  value: string; // Current selected/input value
  onChange: (value: string) => void; // Callback to update the value
  options: Option[]; // List of predefined options
  onAddOption: (newOption: Option) => void; // Callback to add a new option
}

const PickerInput: React.FC<PickerInputProps> = ({
  label,
  value,
  onChange,
  options,
  onAddOption,
}) => {
  // Handle Picker selection
  const handlePickerChange = (newValue: string) => {
    onChange(newValue);
  };

  // Handle TextInput changes and add custom options
  const handleInputChange = (text: string) => {
    onChange(text);
    if (text && !options.some((opt) => opt.value === text)) {
      onAddOption({ label: text, value: text });
    }
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
     
      <Picker
        selectedValue={value}
        onValueChange={handlePickerChange}
        style={styles.picker}
      >
        <Picker.Item label={`Select ${label}`} value="" />
        {options.map((option, index) => (
          <Picker.Item
            key={index}
            label={option.label}
            value={option.value}
          />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleInputChange}
        // placeholder={`Enter ${label}`}
        placeholder='other'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
  },
  picker: {
    height: 40,
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 4,
    paddingHorizontal: 8, // Added for consistency with input
    marginBottom: 8,
    backgroundColor: '#fff',
  },
});

export default PickerInput;