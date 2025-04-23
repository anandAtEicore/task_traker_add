import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Adjust import path as needed

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode; // Optional icon as a generic React node
}

const CustomButtonDate: React.FC<CustomButtonProps> = ({ title, onPress, disabled = false, loading = false, icon }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.dateTimeButton,
        pressed && styles.buttonPressed,
        (disabled || loading) && styles.dateTimeButtonDisabled,
      ]}
    >
      <View style={styles.buttonContent}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <ThemedText style={styles.dateTimeButtonText}>
          {loading ? 'Submitting...' : title}
        </ThemedText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  dateTimeButton: {
    flex: 1,                // Allows buttons to share space evenly in the row
    backgroundColor: '#1F2937', // Original dark gray color
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 2,    // Small margin to prevent buttons from touching
  },
  buttonPressed: {
    backgroundColor: '#374151', // Original pressed color
    transform: [{ translateY: 1 }],
  },
  dateTimeButtonDisabled: {
    backgroundColor: '#9CA3AF', // Original disabled color
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginRight: 3,
  },
  dateTimeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 2,          // Space between icon and text
  },
});

export default CustomButtonDate;