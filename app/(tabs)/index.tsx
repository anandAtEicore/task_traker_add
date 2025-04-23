import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { UserContext } from "@/context/UserContext";
import { router } from "expo-router";
import {

  ChevronRight,
  HelpCircle,
  LockKeyhole,
  ShieldCheck,
  SquarePen,
} from "lucide-react-native";
import { useContext } from "react";
import {
  Dimensions,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StyleSheet } from "react-native";

interface EmployeeData {
  employeeId: string | undefined;
  name: string | undefined;
  designation: "admin" | "user";
  email: string | undefined;
  phone: string | undefined;
  department: string;
}

// Define props for DetailItem component
interface DetailItemProps {
  label: string;
  value: string | undefined | number;
}

const ProfileScreen: React.FC = () => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    return <ThemedText>Error: User context not available</ThemedText>;
  }

  const { userDetails, isLoading } = userContext;

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <ThemedText style={styles.loadingText}>Loading Task Tracker...</ThemedText>
        </ThemedView>
    );
  }

  const { width, height } = Dimensions.get("window");

  return (
    <ScrollView style={styles.container}>
      <View
        style={[
          styles.profileCard,
          {
            marginHorizontal: width > 600 ? width * 0.2 : 15, // Wider margins on larger screens
            marginTop: height * 0.1, // Dynamic top margin based on screen height
          },
        ]}
      >
        
        <View style={styles.header}>
          <View
            style={[
              styles.avatar,
              {
                width: width > 600 ? 100 : 80, // Larger avatar on wider screens
                height: width > 600 ? 100 : 80,
                borderRadius: width > 600 ? 50 : 40,
              },
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                { fontSize: width > 600 ? 48 : 36 }, // Responsive font size
              ]}
            ></Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <DetailItem label="Employee ID" value={userDetails?.userId} />
          <DetailItem label="Name" value={userDetails?.userName} />

          <DetailItem label="Email" value={userDetails?.email} />
          <DetailItem label="Phone" value={userDetails?.number} />
          <DetailItem label="Department" value={"Software"} />
          <DetailItem
            label="Designation"
            value={userDetails?.roleId == 1 ? "admin" : "user"}
          />
        </View>

        <View className="items-center flex-1 w-full px-4 mt-4">
          <View className="items-start w-full pt-4 border-t border-neutral-200/60">
            <Text className="text-lg font-[Medium] text-neutral-800">
              Account
            </Text>
            <View className="w-full mt-3">
              <TouchableOpacity className="flex-row items-center justify-between w-full h-12 px-1 py-2 bg-white rounded-lg border-neutral-200/60">
                <View className="flex-row items-center">
                  <SquarePen size={18} color="#404040" />
                  <Text className="text-base font-[Regular] ml-2 text-neutral-800">
                    Edit Profile
                  </Text>
                </View>
                <ChevronRight size={16} color="#737373" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between w-full h-12 px-1 py-2 bg-white border-t rounded-lg border-neutral-200/60">
                <View className="flex-row items-center">
                  <LockKeyhole size={18} color="#404040" />
                  <Text className="text-base font-[Regular] ml-2 text-neutral-800">
                    Change Password
                  </Text>
                </View>
                <ChevronRight size={16} color="#737373" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between w-full h-12 px-1 py-2 bg-white border-t rounded-lg border-neutral-200/60">
                <View className="flex-row items-center">
                  <ShieldCheck size={18} color="#404040" />
                  <Text className="text-base font-[Regular] ml-2 text-neutral-800">
                    Privacy
                  </Text>
                </View>
                <ChevronRight size={16} color="#737373" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between w-full h-12 px-1 py-2 bg-white border-t rounded-lg border-neutral-200/60">
                <View className="flex-row items-center">
                  <HelpCircle size={18} color="#404040" />
                  <Text className="text-base font-[Regular] ml-2 text-neutral-800">
                    Help
                  </Text>
                </View>
                <ChevronRight size={16} color="#737373" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// Detail Item Component with typed props
const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => {
  const { width } = Dimensions.get("window");
  return (
    <View style={styles.detailItem}>
      <Text
        style={[
          styles.label,
          { fontSize: width > 600 ? 18 : 16 }, // Responsive font size
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.value,
          { fontSize: width > 600 ? 18 : 16 }, // Responsive font size
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

// Type-safe styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileCard: {},
  header: {
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  name: {
    fontWeight: "bold",
    color: "#333",
  },
  designation: {
    color: "#666",
    marginTop: 5,
  },
  detailsContainer: {
    padding: 15,
  },
  detailItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    flex: 1,
    color: "#666",
  },
  value: {
    flex: 2,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '500',
  },
} as const);

export default ProfileScreen;
