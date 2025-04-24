
import React, { useContext, useMemo, useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import {
  TextInput,
  StyleSheet,
  ScrollView,
  ViewStyle,
  View,
} from "react-native";
import moment from "moment";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import PickerInput from "@/components/CustomPicker";
import { Button as Btn, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { UserContext } from "@/context/UserContext";
import { HStack } from "@/components/ui/hstack";
import CustomButton from "@/components/CustomButton";
import { ArrowLeft, ArrowRight, Calendar, Clock3, Plus } from "lucide-react-native";
import CustomButtonDate from "@/components/CustomButtonDate";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

interface TaskFormData {
  incidentNo: string;
  ticketType: string;
  bug: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  takenBy: string;
  takenFor: string;
  userName: string;
  remarks: string;
  challenges: string;
  bugStatus: string;
  environment: string;
  userId: string | number;
}

interface Option {
  label: string;
  value: string;
}

type TakenByOption = "Dev" | "QA" | "UAT" | "Security" | "Support" | "Infra";
type ShowAlert = (action: "success" | "error", message: string) => void;
type CloseAlert = () => void;

const initialTicketTypeOptions = [
  { label: "Internal Scrum", value: "Internal Scrum" },
  { label: "Daily Scrum Meeting and Internal Team Meeting", value: "Daily Scrum Meeting and Internal Team Meeting" },
  { label: "Story", value: "Story" },
  { label: "Deployment Call", value: "Deployment Call" },
  { label: "Meeting", value: "Meeting" },
  { label: "Discussion", value: "Discussion" },
];
const initialLocationOptions = [
  { label: "OMN", value: "OMN" },
  { label: "AUH", value: "AUH" },
  { label: "DXB", value: "DXB" },
  { label: "KWT", value: "KWT" },
];
const takenByOptions = [
  { label: "Dev", value: "Dev" },
  { label: "QA", value: "QA" },
  { label: "UAT", value: "UAT" },
  { label: "Security", value: "Security" },
  { label: "Support", value: "Support" },
  { label: "Infra", value: "Infra" },
];
const environments = [
  { label: "Production", value: "Production" },
  { label: "Staging", value: "Staging" },
  { label: "Development", value: "Development" },
  { label: "Testing", value: "Testing" },
];
const bugStatus = [
  { label: "Resolved", value: "Resolved" },
  { label: "In Progress", value: "In Progress" },
];

export default function TabTwoScreen() {
  const userContext = useContext(UserContext);

  if (!userContext || !userContext.userDetails) {
    return (
      <ThemedText>Error: User context or details not available</ThemedText>
    );
  }

  const { userDetails } = userContext;

  // Set default dates and times to current date/time
  const now = moment();
  const [formData, setFormData] = useState<TaskFormData>({
    incidentNo: "",
    ticketType: "",
    bug: "",
    location: "",
    startDate: now.format('YYYY-MM-DD'),
    startTime: now.format('HH:mm'),
    endDate: now.format('YYYY-MM-DD'),
    endTime: now.format('HH:mm'),
    takenBy: "",
    takenFor: "",
    userName: userDetails.userName,
    remarks: "",
    challenges: "",
    bugStatus: "",
    environment: "",
    userId: userDetails.userId,
  });

  const [ticketType, setTicketType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [takenBy, setTakenBy] = useState<string>("");
  const [takenFor, setTakenFor] = useState<string>("");
  const [ticketTypeOptions, setTicketTypeOptions] = useState<Option[]>(initialTicketTypeOptions);
  const [locationOptions, setLocationOptions] = useState<Option[]>(initialLocationOptions);
  const [takenForOptionsState, setTakenForOptionsState] = useState<Record<TakenByOption, Option[]>>({
    Dev: [
      { label: "Analysis", value: "Analysis" },
      { label: "Bug Reported", value: "Bug Reported" },
    ],
    QA: [
      { label: "Raise QA Bug", value: "Raise QA Bug" },
      { label: "Feedback", value: "Feedback" },
    ],
    UAT: [
      { label: "UAT Bug", value: "UAT Bug" },
      { label: "UAT in Progress", value: "UAT in Progress" },
      { label: "UAT Sign Off", value: "UAT Sign Off" },
    ],
    Security: [
      { label: "Security Bug", value: "Security Bug" },
      { label: "Security Sign Off", value: "Security Sign Off" },
    ],
    Support: [
      { label: "Prod Deployment", value: "Prod Deployment" },
      { label: "External Meeting", value: "External Meeting" },
    ],
    Infra: [
      { label: "Prod Deployment", value: "Prod Deployment" },
      { label: "Meeting", value: "Meeting" },
      { label: "Infra Related Issue", value: "Infra Related Issue" },
    ],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [startTimeOpen, setStartTimeOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [endTimeOpen, setEndTimeOpen] = useState(false);

  const onDismissStartDate = () => setStartDateOpen(false);
  const onConfirmStartDate = ({ date }: any) => {
    setStartDateOpen(false);
    setFormData((prev) => ({ ...prev, startDate: date.toISOString().split('T')[0] }));
    setStartTimeOpen(true);
  };

  const onDismissStartTime = () => setStartTimeOpen(false);
  const onConfirmStartTime = ({ hours, minutes }: any) => {
    setStartTimeOpen(false);
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    setFormData((prev) => ({ ...prev, startTime: timeString }));
  };

  const onDismissEndDate = () => setEndDateOpen(false);
  const onConfirmEndDate = ({ date }: any) => {
    setEndDateOpen(false);
    setFormData((prev) => ({ ...prev, endDate: date.toISOString().split('T')[0] }));
    setEndTimeOpen(true);
  };

  const onDismissEndTime = () => setEndTimeOpen(false);
  const onConfirmEndTime = ({ hours, minutes }: any) => {
    setEndTimeOpen(false);
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    setFormData((prev) => ({ ...prev, endTime: timeString }));
  };

  const handleChange = (field: keyof TaskFormData) => (text: string) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  const combineDateTime = (date: string, time: string): string => {
    if (!date || !time) return "";
    return `${date}T${time}:00.000Z`;
  };

  const formatDateTimeDisplay = (date: string, time: string): string => {
    if (!date) return "";
    return `${moment(date).format('LL')} ${time || ''}`.trim();
  };

  const getTakenForOptions = useMemo(() => {
    const isValidTakenBy = (value: string): value is TakenByOption =>
      ["Dev", "QA", "UAT", "Security", "Support", "Infra"].includes(value);

    if (isValidTakenBy(takenBy) && takenForOptionsState[takenBy]) {
      return takenForOptionsState[takenBy];
    }
    return [{ label: "Select Taken For", value: "" }];
  }, [takenBy, takenForOptionsState]);

  const showAlert: ShowAlert = (action, message) => {
    console.log(`Triggering toast: ${action} - ${message}`);
    Toast.show({
      type: action,
      text1: action === "success" ? "Success" : "Error",
      text2: message,
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
      onShow: () => console.log("Toast displayed"),
      onHide: () => console.log("Toast hidden"),
    });
  };

  const closeAlert: CloseAlert = () => {
    console.log("Manually closing toast");
    Toast.hide();
  };

  const validateForm = (): string | null => {
    if (step === 1) {
      if (!formData.incidentNo.trim()) return "Incident No is required";
      if (formData.incidentNo.length > 150) return "Incident No must be 150 characters or less";
      if (!formData.ticketType) return "Ticket Type is required";
      if (formData.bug.length > 255) return "Bug description must be 255 characters or less";
      if (!formData.location) return "Location is required";
      if (!formData.startDate) return "Start Date is required";
      if (!formData.startTime) return "Start Time is required";
      if (!formData.endDate) return "End Date is required";
      if (!formData.endTime) return "End Time is required";
      const startDateTime = combineDateTime(formData.startDate, formData.startTime);
      const endDateTime = combineDateTime(formData.endDate, formData.endTime);
      if (moment(endDateTime).isBefore(moment(startDateTime)))
        return "End Date/Time cannot be before Start Date/Time";
    } else if (step === 2) {
      if (!formData.takenBy) return "Taken By is required";
      if (!formData.takenFor) return "Taken For is required";
      if (formData.userName.length > 200) return "UserName must be 200 characters or less";
      if (!formData.bugStatus || !bugStatus.find((opt) => opt.value === formData.bugStatus))
        return "Bug Status must be 'Resolved' or 'In Progress'";
      if (!formData.environment) return "Environment is required";
    }
    return null;
  };

  const handleNext = () => {
    const validationError = validateForm();
    if (validationError) {
      showAlert("error", validationError);
      return;
    }
    if (step === 1) setStep(2);
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      showAlert("error", validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        startDate: combineDateTime(formData.startDate, formData.startTime),
        endDate: combineDateTime(formData.endDate, formData.endTime),
      };

      const response = await fetch(
        "http://10.10.50.6/TracerAPI/api/TaskManagement/CreateTask",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      showAlert("success", "Task submitted successfully!");
      setFormData({
        incidentNo: "",
        ticketType: "",
        bug: "",
        location: "",
        startDate: moment().format('YYYY-MM-DD'),
        startTime: moment().format('HH:mm'),
        endDate: moment().format('YYYY-MM-DD'),
        endTime: moment().format('HH:mm'),
        takenBy: "",
        takenFor: "",
        userName: userDetails.userName,
        remarks: "",
        challenges: "",
        bugStatus: "",
        environment: "",
        userId: userDetails.userId,
      });
      setTicketType("");
      setLocation("");
      setTakenBy("");
      setTakenFor("");
      setTicketTypeOptions(initialTicketTypeOptions);
      setLocationOptions(initialLocationOptions);
      setStep(1);
      setTimeout(() => router.push("/(tabs)/entries-log"), 2000);
    } catch (error) {
      showAlert(
        "error",
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage as ViewStyle}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          {userDetails && (
            <ThemedText type="title">
              Hello, {userDetails.userName}
            </ThemedText>
          )}
        </ThemedView>

        <View style={styles.stepContainer}>
          <HStack>
            <View style={[styles.stepCircle, step === 1 && styles.activeStepCircle]}>
              <ThemedText style={[styles.stepText, step === 1 && styles.activeStepText]}>
                1
              </ThemedText>
            </View>
            <ThemedText style={styles.stepLabel}>First Details</ThemedText>
          </HStack>
          <HStack>
            <View style={[styles.stepCircle, step === 2 && styles.activeStepCircle]}>
              <ThemedText style={[styles.stepText, step === 2 && styles.activeStepText]}>
                2
              </ThemedText>
            </View>
            <ThemedText style={styles.stepLabel}>Second Details</ThemedText>
          </HStack>
        </View>

        {step === 1 && (
          <ScrollView style={styles.formContainer}>
            <VStack style={styles.formStack}>
              <HStack style={styles.formRow}>
                <VStack style={styles.fieldGroup}>
                  <ThemedText style={styles.label}>Incident No *</ThemedText>
                  <TextInput
                    style={styles.input}
                    value={formData.incidentNo}
                    onChangeText={handleChange("incidentNo")}
                  />
                </VStack>
              </HStack>
              <HStack style={styles.formRow}>
                <VStack style={styles.fieldGroup}>
                  <HStack style={styles.formRow}>
                    <CustomButtonDate
                      title="Change Start Date"
                      onPress={() => setStartDateOpen(true)}
                      icon={<Calendar size={16} color="#FFFFFF" />}
                    />
                    <CustomButtonDate
                      title="Pick Start Time *"
                      onPress={() => setStartTimeOpen(true)}
                      icon={<Clock3 size={16} color="#FFFFFF" />}
                      disabled={!formData.startDate}
                    />
                  </HStack>
                  <ThemedText style={styles.dateText}>
                    {formatDateTimeDisplay(formData.startDate, formData.startTime)}
                  </ThemedText>
                  <DatePickerModal
                    locale="en"
                    mode="single"
                    visible={startDateOpen}
                    onDismiss={onDismissStartDate}
                    date={formData.startDate ? new Date(formData.startDate) : new Date()}
                    onConfirm={onConfirmStartDate}
                  />
                  <TimePickerModal
                    visible={startTimeOpen}
                    onDismiss={onDismissStartTime}
                    onConfirm={onConfirmStartTime}
                    hours={formData.startTime ? parseInt(formData.startTime.split(':')[0]) : moment().hours()}
                    minutes={formData.startTime ? parseInt(formData.startTime.split(':')[1]) : moment().minutes()}
                  />
                  <HStack style={styles.formRow}>
                    <CustomButtonDate
                      title="Change End Date"
                      onPress={() => setEndDateOpen(true)}
                      icon={<Calendar size={16} color="#FFFFFF" />}
                    />
                    <CustomButtonDate
                      title="Pick End Time *"
                      onPress={() => setEndTimeOpen(true)}
                      icon={<Clock3 size={16} color="#FFFFFF" />}
                      disabled={!formData.endDate}
                    />
                  </HStack>
                  <ThemedText style={styles.dateText}>
                    {formatDateTimeDisplay(formData.endDate, formData.endTime)}
                  </ThemedText>
                  <DatePickerModal
                    locale="en"
                    mode="single"
                    visible={endDateOpen}
                    onDismiss={onDismissEndDate}
                    date={formData.endDate ? new Date(formData.endDate) : new Date()}
                    onConfirm={onConfirmEndDate}
                  />
                  <TimePickerModal
                    visible={endTimeOpen}
                    onDismiss={onDismissEndTime}
                    onConfirm={onConfirmEndTime}
                    hours={formData.endTime ? parseInt(formData.endTime.split(':')[0]) : moment().hours()}
                    minutes={formData.endTime ? parseInt(formData.endTime.split(':')[1]) : moment().minutes()}
                  />
                </VStack>
              </HStack>
              <HStack style={styles.formRow}>
                <VStack style={styles.fieldGroup}>
                  <PickerInput
                    label="Ticket Type *"
                    value={ticketType}
                    onChange={(newValue) => {
                      setTicketType(newValue);
                      setFormData((prev) => ({ ...prev, ticketType: newValue }));
                    }}
                    options={ticketTypeOptions}
                    onAddOption={(newOption) =>
                      setTicketTypeOptions([...ticketTypeOptions, newOption])
                    }
                  />
                </VStack>
                <VStack style={styles.fieldGroup}>
                  <PickerInput
                    label="Location *"
                    value={location}
                    onChange={(newValue) => {
                      setLocation(newValue);
                      setFormData((prev) => ({ ...prev, location: newValue }));
                    }}
                    options={locationOptions}
                    onAddOption={(newOption) =>
                      setLocationOptions([...locationOptions, newOption])
                    }
                  />
                </VStack>
              </HStack>
              <HStack style={styles.formRow}>
                <VStack style={styles.fieldGroup}>
                  <ThemedText style={styles.label}>Challenges *</ThemedText>
                  <TextInput
                    style={[styles.input, { height: 80 }]}
                    value={formData.challenges}
                    onChangeText={handleChange("challenges")}
                    multiline
                  />
                </VStack>
              </HStack>
            </VStack>
          </ScrollView>
        )}

        {step === 2 && (
          <ScrollView style={styles.formContainer}>
            <VStack style={styles.formStack}>
              <HStack style={styles.formRow}>
                <VStack style={styles.fieldGroup}>
                  <PickerInput
                    label="Taken By *"
                    value={takenBy}
                    onChange={(newValue) => {
                      setTakenBy(newValue);
                      setTakenFor("");
                      setFormData((prev) => ({
                        ...prev,
                        takenBy: newValue,
                        takenFor: "",
                      }));
                    }}
                    options={takenByOptions}
                    onAddOption={() => {}}
                  />
                </VStack>
                <VStack style={styles.fieldGroup}>
                  <PickerInput
                    label="Taken For *"
                    value={takenFor}
                    onChange={(newValue) => {
                      setTakenFor(newValue);
                      setFormData((prev) => ({ ...prev, takenFor: newValue }));
                    }}
                    options={getTakenForOptions}
                    onAddOption={(newOption) => {
                      if (takenBy) {
                        const isValidTakenBy = (value: string): value is TakenByOption =>
                          ["Dev", "QA", "UAT", "Security", "Support", "Infra"].includes(value);
                        if (isValidTakenBy(takenBy) && takenForOptionsState[takenBy]) {
                          setTakenForOptionsState((prev) => ({
                            ...prev,
                            [takenBy]: [...prev[takenBy], newOption],
                          }));
                          setTakenFor(newOption.value);
                          setFormData((prev) => ({ ...prev, takenFor: newOption.value }));
                        }
                      }
                    }}
                  />
                </VStack>
              </HStack>
              <HStack style={styles.formRow}>
                <VStack style={styles.fieldGroup}>
                  <PickerInput
                    label="Bug Status *"
                    value={formData.bugStatus}
                    onChange={(newValue) =>
                      setFormData((prev) => ({ ...prev, bugStatus: newValue }))
                    }
                    options={bugStatus}
                    onAddOption={() => {}}
                  />
                </VStack>
                <VStack style={styles.fieldGroup}>
                  <PickerInput
                    label="Environment *"
                    value={formData.environment}
                    onChange={(newValue) =>
                      setFormData((prev) => ({ ...prev, environment: newValue }))
                    }
                    options={environments}
                    onAddOption={() => {}}
                  />
                </VStack>
              </HStack>
              <HStack style={styles.formRow}>
                <VStack style={styles.fieldGroup}>
                  <ThemedText style={styles.label}>Remarks *</ThemedText>
                  <TextInput
                    style={[styles.input, { height: 80 }]}
                    value={formData.remarks}
                    onChangeText={handleChange("remarks")}
                    multiline
                  />
                </VStack>
              </HStack>
            </VStack>
          </ScrollView>
        )}

        <HStack style={styles.buttonRow}>
          {step === 1 ? (
            <View style={styles.nextButtonPosition}>
              <CustomButton
                title="Next"
                onPress={handleNext}
                icon={<ArrowRight size={16} color="#FFFFFF" />}
              />
            </View>
          ) : (
            <CustomButton
              title="Back"
              onPress={() => setStep(1)}
              icon={<ArrowLeft size={16} color="#FFFFFF" />}
            />
          )}
          {step === 2 && (
            <CustomButton
              title="Add"
              onPress={handleSubmit}
              disabled={isSubmitting}
              loading={isSubmitting}
              icon={<Plus size={16} color="#FFFFFF" />}
            />
          )}
        </HStack>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  container: {
    flex: 1,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  activeStepCircle: {
    backgroundColor: "#3B82F6",
  },
  stepText: {
    fontSize: 16,
    color: "#6B7280",
  },
  activeStepText: {
    color: "#FFFFFF",
  },
  stepLabel: {
    fontSize: 16,
    color: "#6B7280",
    marginHorizontal: 8,
  },
  formContainer: {
    flex: 1,
    paddingVertical: 15,
  },
  formStack: {
    paddingHorizontal: 8,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginTop: 5,
  },
  fieldGroup: {
    flex: 1,
    marginHorizontal: 5,
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
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    padding: 5,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  nextButtonPosition: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 8,
    marginVertical: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
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
    marginHorizontal: 2,
  },
  dateTimeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  dateTimeButtonDisabled: {
    backgroundColor: "#A0A0A0",
    opacity: 0.7,
  },
});