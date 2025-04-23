import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';


interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode; // Optional icon as a generic React node
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, disabled = false, loading = false, icon }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        (disabled || loading) && styles.buttonDisabled,
      ]}
    >
      <View style={styles.buttonContent}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 45, // Fixed width to make it more square
    height: 45, // Fixed height to make it more square
    borderRadius: 30, // Half of width/height for circular shape
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonPressed: {
    backgroundColor: '#374151',
    transform: [{ translateY: 1 }],
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    margin: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14, // Slightly smaller font to fit circular button
    fontWeight: '500',
  },
});

export default CustomButton;