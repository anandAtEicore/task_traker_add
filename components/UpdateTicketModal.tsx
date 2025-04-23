// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   Platform,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import CustomButton from "./CustomButton";
// import { SendHorizontal, X } from "lucide-react-native";

// // Define the ticket data interface
// interface TicketData {
//   taskTtrackerId: number;
//   incidentNo: string;
//   ticketType: string;
//   bug: string;
//   location: string;
//   startDate: string;
//   endDate: string;
//   takenBy: string;
//   takenFor: string;
//   userName: string;
//   remarks: string;
//   challenges: string;
//   bugStatus: string;
//   environment: string;
//   userId: number;
// }

// // Define the form data interface (consistent with API payload)
// interface FormData {
//   taskId: number;
//   incidentNo: string;
//   ticketType: string;
//   bug: string;
//   location: string;
//   startDate: string;
//   endDate: string;
//   takenBy: string;
//   takenFor: string;
//   userName: string;
//   remarks: string;
//   challenges: string;
//   bugStatus: string;
//   environment: string;
//   userId: number;
// }

// interface UpdateTicketModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   ticketData: TicketData;
//   onUpdate: () => void; // Callback to refresh parent component's data
// }

// const UpdateTicketModal: React.FC<UpdateTicketModalProps> = ({
//   isOpen,
//   onClose,
//   ticketData,
//   onUpdate,
// }) => {
//   const [formData, setFormData] = useState<FormData>({
//     taskId: ticketData.taskTtrackerId || 0,
//     incidentNo: ticketData.incidentNo || "",
//     ticketType: ticketData.ticketType || "",
//     bug: ticketData.bug || "",
//     location: ticketData.location || "",
//     startDate: ticketData.startDate || new Date().toISOString(),
//     endDate: ticketData.endDate || new Date().toISOString(),
//     takenBy: ticketData.takenBy || "",
//     takenFor: ticketData.takenFor || "",
//     userName: ticketData.userName || "",
//     remarks: ticketData.remarks || "",
//     challenges: ticketData.challenges || "",
//     bugStatus: ticketData.bugStatus || "",
//     environment: ticketData.environment || "",
//     userId: ticketData.userId || 0,
//   });
//   const [showStartDatePicker, setShowStartDatePicker] = useState(false);
//   const [showEndDatePicker, setShowEndDatePicker] = useState(false);

//   const handleChange = (name: keyof FormData, value: string | number) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleDateChange = (
//     event: any,
//     selectedDate: Date | undefined,
//     field: "startDate" | "endDate"
//   ) => {
//     const currentDate = selectedDate || new Date(formData[field]);
//     setShowStartDatePicker(field === "startDate" ? false : showStartDatePicker);
//     setShowEndDatePicker(field === "endDate" ? false : showEndDatePicker);
//     handleChange(field, currentDate.toISOString());
//   };

//   const handleSubmit = async () => {
//     console.log("Submit Pressed");
//     try {
//       console.log("Form Data:", formData);

//       // Send the update request to the API
//       const response = await fetch(
//         "http://10.10.50.6/TracerAPI/api/TaskManagement/UpdateTask",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         }
//       );

//       if (response.ok) {
//         Alert.alert("Success", "Ticket updated successfully!");
//         onUpdate(); // Call onUpdate to refresh parent component's data
//         onClose(); // Close the modal
//       } else {
//         const errorText = await response.text();
//         Alert.alert("Error", `Failed to update ticket: ${errorText}`);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       Alert.alert("Error", "An error occurred while updating the ticket.");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <Modal visible={isOpen} transparent animationType="fade">
//       <View style={styles.overlay}>
//         <View style={styles.modalContainer}>
//           <View style={styles.header}>
//             <Text style={styles.headerText}>Update Ticket</Text>
//           </View>
//           <ScrollView style={styles.formContainer}>
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Incident No *</Text>
//               <TextInput
//                 style={styles.input}
//                 value={formData.incidentNo}
//                 onChangeText={(value) => handleChange("incidentNo", value)}
//                 placeholder="Enter Incident No"
//                 autoCapitalize="none"
//               />
//             </View>
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Ticket Type *</Text>
//               <TextInput
//                 style={styles.input}
//                 value={formData.ticketType}
//                 onChangeText={(value) => handleChange("ticketType", value)}
//                 placeholder="Enter Ticket Type"
//                 autoCapitalize="none"
//               />
//             </View>
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Bug Description *</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 value={formData.bug}
//                 onChangeText={(value) => handleChange("bug", value)}
//                 placeholder="Describe the bug"
//                 multiline
//                 numberOfLines={4}
//               />
//             </View>
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Location *</Text>
//               <TextInput
//                 style={styles.input}
//                 value={formData.location}
//                 onChangeText={(value) => handleChange("location", value)}
//                 placeholder="Enter Location"
//                 autoCapitalize="none"
//               />
//             </View>
//             <View style={styles.row}>
//               <View style={[styles.inputGroup, styles.halfWidth]}>
//                 <Text style={styles.label}>Start Date *</Text>
//                 <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
//                   <TextInput
//                     style={styles.input}
//                     value={new Date(formData.startDate).toLocaleString()}
//                     editable={false}
//                     placeholder="Select Start Date"
//                   />
//                 </TouchableOpacity>
//                 {showStartDatePicker && (
//                   <DateTimePicker
//                     value={new Date(formData.startDate)}
//                     mode="datetime"
//                     display={Platform.OS === "ios" ? "inline" : "default"}
//                     onChange={(event, date) =>
//                       handleDateChange(event, date, "startDate")
//                     }
//                   />
//                 )}
//               </View>
//               <View style={[styles.inputGroup, styles.halfWidth]}>
//                 <Text style={styles.label}>End Date *</Text>
//                 <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
//                   <TextInput
//                     style={styles.input}
//                     value={new Date(formData.endDate).toLocaleString()}
//                     editable={false}
//                     placeholder="Select End Date"
//                   />
//                 </TouchableOpacity>
//                 {showEndDatePicker && (
//                   <DateTimePicker
//                     value={new Date(formData.endDate)}
//                     mode="datetime"
//                     display={Platform.OS === "ios" ? "inline" : "default"}
//                     onChange={(event, date) =>
//                       handleDateChange(event, date, "endDate")
//                     }
//                   />
//                 )}
//               </View>
//             </View>
//             <View style={styles.row}>
//               <View style={[styles.inputGroup, styles.halfWidth]}>
//                 <Text style={styles.label}>Taken By *</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.takenBy}
//                   onChangeText={(value) => handleChange("takenBy", value)}
//                   placeholder="Enter Taken By"
//                   autoCapitalize="none"
//                 />
//               </View>
//               <View style={[styles.inputGroup, styles.halfWidth]}>
//                 <Text style={styles.label}>Taken For *</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.takenFor}
//                   onChangeText={(value) => handleChange("takenFor", value)}
//                   placeholder="Enter Taken For"
//                   autoCapitalize="none"
//                 />
//               </View>
//             </View>
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>User Name *</Text>
//               <TextInput
//                 style={styles.input}
//                 value={formData.userName}
//                 onChangeText={(value) => handleChange("userName", value)}
//                 placeholder="Enter User Name"
//                 autoCapitalize="none"
//               />
//             </View>
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Remarks</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 value={formData.remarks}
//                 onChangeText={(value) => handleChange("remarks", value)}
//                 placeholder="Enter Remarks"
//                 multiline
//                 numberOfLines={4}
//               />
//             </View>
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Challenges</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 value={formData.challenges}
//                 onChangeText={(value) => handleChange("challenges", value)}
//                 placeholder="Enter Challenges"
//                 multiline
//                 numberOfLines={4}
//               />
//             </View>
//             <View style={styles.row}>
//               <View style={[styles.inputGroup, styles.halfWidth]}>
//                 <Text style={styles.label}>Bug Status *</Text>
//                 <View style={styles.pickerContainer}>
//                   <Picker
//                     selectedValue={formData.bugStatus}
//                     onValueChange={(value) => handleChange("bugStatus", value)}
//                     style={styles.picker}
//                   >
//                     <Picker.Item label="Select Status" value="" />
//                     <Picker.Item label="Open" value="Open" />
//                     <Picker.Item label="In Progress" value="In Progress" />
//                     <Picker.Item label="Resolved" value="Resolved" />
//                     <Picker.Item label="Closed" value="Closed" />
//                   </Picker>
//                 </View>
//               </View>
//               <View style={[styles.inputGroup, styles.halfWidth]}>
//                 <Text style={styles.label}>Environment *</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={formData.environment}
//                   onChangeText={(value) => handleChange("environment", value)}
//                   placeholder="Enter Environment"
//                   autoCapitalize="none"
//                 />
//               </View>
//             </View>
//           </ScrollView>
//             <View style={styles.buttonContainer}>
//               <View>
//                 <CustomButton
//                   title="Edit"
//                   onPress={onClose}
//                   icon={<X size={16} color="#FFFFFF" />}
//                 />
//               </View>
//               <View>
//                 <CustomButton
//                   title="Update"
//                   onPress={handleSubmit}
//                   icon={<SendHorizontal size={16} color="#FFFFFF" />}
//                 />
//               </View>
//             </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContainer: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     width: "90%",
//     maxHeight: "80%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   header: {
//     backgroundColor: "#1F2937",
//     padding: 16,
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#fff",
//     textAlign: "center",
//   },
//   formContainer: {
//     padding: 16,
//   },
//   inputGroup: {
//     marginBottom: 12,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#374151",
//     marginBottom: 4,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 16,
//     backgroundColor: "#fff",
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: "top",
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   halfWidth: {
//     width: "48%",
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     borderRadius: 8,
//     backgroundColor: "#fff",
//   },
//   picker: {
//     height: Platform.OS === "ios" ? 120 : 50,
//     width: "100%",
//   },
//   buttonContainer: {
//     flexDirection: 'row',       
//     justifyContent: 'flex-end',    
//     margin: 16,                 
//     gap: 10,                       
//     flexWrap: 'nowrap',           
//     alignItems: 'center',          
//     paddingHorizontal: 8,
//   },
//   cancelButton: {
//     backgroundColor: "#FF0000",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   submitButton: {
//     backgroundColor: "#3b82f6",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//     textAlign: "center",
//   },
// });

// export default UpdateTicketModal;


import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "./CustomButton";
import { SendHorizontal, X } from "lucide-react-native";

// Define the ticket data interface
interface TicketData {
  taskTtrackerId: number;
  incidentNo: string;
  ticketType: string;
  bug: string;
  location: string;
  startDate: string;
  endDate: string;
  takenBy: string;
  takenFor: string;
  userName: string;
  remarks: string;
  challenges: string;
  bugStatus: string;
  environment: string;
  userId: number;
}

// Define the form data interface (consistent with API payload)
interface FormData {
  taskId: number;
  incidentNo: string;
  ticketType: string;
  bug: string;
  location: string;
  startDate: string;
  endDate: string;
  takenBy: string;
  takenFor: string;
  userName: string;
  remarks: string;
  challenges: string;
  bugStatus: string;
  environment: string;
  userId: number;
}

interface UpdateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketData: TicketData;
  onUpdate: () => void; // Callback to refresh parent component's data
}

const UpdateTicketModal: React.FC<UpdateTicketModalProps> = ({
  isOpen,
  onClose,
  ticketData,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<FormData>({
    taskId: ticketData.taskTtrackerId || 0,
    incidentNo: ticketData.incidentNo || "",
    ticketType: ticketData.ticketType || "",
    bug: ticketData.bug || "",
    location: ticketData.location || "",
    startDate: ticketData.startDate || new Date().toISOString(),
    endDate: ticketData.endDate || new Date().toISOString(),
    takenBy: ticketData.takenBy || "",
    takenFor: ticketData.takenFor || "",
    userName: ticketData.userName || "",
    remarks: ticketData.remarks || "",
    challenges: ticketData.challenges || "",
    bugStatus: ticketData.bugStatus || "",
    environment: ticketData.environment || "",
    userId: ticketData.userId || 0,
  });

  const handleChange = (name: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log("Submit Pressed");
    try {
      console.log("Form Data:", formData);

      // Send the update request to the API
      const response = await fetch(
        "http://10.10.50.6/TracerAPI/api/TaskManagement/UpdateTask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Ticket updated successfully!");
        onUpdate(); // Call onUpdate to refresh parent component's data
        onClose(); // Close the modal
      } else {
        const errorText = await response.text();
        Alert.alert("Error", `Failed to update ticket: ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while updating the ticket.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Update Ticket</Text>
          </View>
          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Incident No *</Text>
              <TextInput
                style={styles.input}
                value={formData.incidentNo}
                onChangeText={(value) => handleChange("incidentNo", value)}
                placeholder="Enter Incident No"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ticket Type *</Text>
              <TextInput
                style={styles.input}
                value={formData.ticketType}
                onChangeText={(value) => handleChange("ticketType", value)}
                placeholder="Enter Ticket Type"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bug Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.bug}
                onChangeText={(value) => handleChange("bug", value)}
                placeholder="Describe the bug"
                multiline
                numberOfLines={4}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(value) => handleChange("location", value)}
                placeholder="Enter Location"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Start Date *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.startDate}
                  onChangeText={(value) => handleChange("startDate", value)}
                  placeholder="Enter Start Date (e.g., 2025-04-23 10:00)"
                />
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>End Date *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.endDate}
                  onChangeText={(value) => handleChange("endDate", value)}
                  placeholder="Enter End Date (e.g., 2025-04-23 12:00)"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Taken By *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.takenBy}
                  onChangeText={(value) => handleChange("takenBy", value)}
                  placeholder="Enter Taken By"
                  autoCapitalize="none"
                />
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Taken For *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.takenFor}
                  onChangeText={(value) => handleChange("takenFor", value)}
                  placeholder="Enter Taken For"
                  autoCapitalize="none"
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>User Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.userName}
                onChangeText={(value) => handleChange("userName", value)}
                placeholder="Enter User Name"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Remarks</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.remarks}
                onChangeText={(value) => handleChange("remarks", value)}
                placeholder="Enter Remarks"
                multiline
                numberOfLines={4}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Challenges</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.challenges}
                onChangeText={(value) => handleChange("challenges", value)}
                placeholder="Enter Challenges"
                multiline
                numberOfLines={4}
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Bug Status *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.bugStatus}
                    onValueChange={(value) => handleChange("bugStatus", value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Status" value="" />
                    <Picker.Item label="Open" value="Open" />
                    <Picker.Item label="In Progress" value="In Progress" />
                    <Picker.Item label="Resolved" value="Resolved" />
                    <Picker.Item label="Closed" value="Closed" />
                  </Picker>
                </View>
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Environment *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.environment}
                  onChangeText={(value) => handleChange("environment", value)}
                  placeholder="Enter Environment"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <View>
              <CustomButton
                title="Edit"
                onPress={onClose}
                icon={<X size={16} color="#FFFFFF" />}
              />
            </View>
            <View>
              <CustomButton
                title="Update"
                onPress={handleSubmit}
                icon={<SendHorizontal size={16} color="#FFFFFF" />}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    backgroundColor: "#1F2937",
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    height: Platform.OS === "ios" ? 120 : 50,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 16,
    gap: 10,
    flexWrap: "nowrap",
    alignItems: "center",
    paddingHorizontal: 8,
  },
});

export default UpdateTicketModal;