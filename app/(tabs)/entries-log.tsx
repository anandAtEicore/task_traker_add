

import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useState, useEffect, useContext } from "react";
import { Text } from "react-native";
import { UserContext } from "@/context/UserContext";
import TaskFilterModal from "@/components/TaskFilterModal";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import UpdateTicketModal from "@/components/UpdateTicketModal";
import CustomButton from "@/components/CustomButton";
import { ArrowLeft, ArrowRight, Edit, Plus } from "lucide-react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

type TaskTracker = {
  taskTtrackerId: number;
  incidentNo: string;
  ticketType: string;
  bug: string | null;
  location: string;
  startDate: string;
  endDate: string;
  takenBy: string;
  takenFor: string;
  userName: string;
  remarks: string | null;
  challenges: string | null;
  bugStatus: string | null;
  environment: string | null;
  isDeleted: boolean;
  createdDate: string;
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  userId: number;
};

interface Task {
  taskTtrackerId: number;
  incidentNo: string;
  ticketType: string;
  bug: string | null;
  location: string;
  startDate: string;
  endDate: string;
  takenBy: string;
  takenFor: string;
  userName: string;
  remarks: string | null;
  challenges: string | null;
  bugStatus: string | null;
  environment: string | null;
  isDeleted: boolean;
  createdDate: string;
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  userId: number;
}

// Function Types
type ShowAlert = (action: "success" | "error", message: string) => void;
type CloseAlert = () => void;

export default function TaskTrackerScreen() {
  const userContext = useContext(UserContext);
  const userDetails = userContext?.userDetails;
  const isLoading = userContext?.isLoading;

  const [data, setData] = useState<{ response: TaskTracker[] }>({
    response: [],
  });
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);
  const [usernameFilter, setUsernameFilter] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TaskTracker | null>(null);
  const itemsPerPage = 10;

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

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://10.10.50.6/TracerAPI/api/TaskManagement/GetAllTask"
      );
      const json = await response.json();
      console.log("API response:", json);

      let filteredData = json;

      if (userDetails && json.response && userDetails.roleId === 2) {
        filteredData = {
          ...json,
          response: json.response.filter(
            (task: Task) => task.userId === userDetails.userId
          ),
        };
      }

      setData(filteredData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching task data:", error);
      showAlert("error", "Failed to fetch tasks. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [data, startDateFilter, endDateFilter, usernameFilter]);

  // Apply filters for startDate and username
  const filteredData =
    data?.response
      ?.filter((item) => {
        if (item.isDeleted) return false;

        const taskStartDate = new Date(item.startDate);

        if (userDetails?.roleId === 1) {
          // Admin: Filter by startDate range (if provided)
          if (startDateFilter && taskStartDate < startDateFilter) return false;
          if (endDateFilter && taskStartDate > endDateFilter) return false;
        } else {
          // Non-admin or non-user: Filter by exact startDate match (if provided)
          if (
            startDateFilter &&
            taskStartDate.toDateString() !== startDateFilter.toDateString()
          ) {
            return false;
          }
        }

        if (
          usernameFilter &&
          !item.userName.toLowerCase().includes(usernameFilter.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      ) || [];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleNext = () => {
    if (paginationLoading || page >= totalPages) return;

    setPaginationLoading(true);
    setTimeout(() => {
      setPage((prevPage) => prevPage + 1);
      setPaginationLoading(false);
    }, 500);
  };

  const handlePrevious = () => {
    if (paginationLoading || page <= 1) return;

    setPaginationLoading(true);
    setTimeout(() => {
      setPage((prevPage) => prevPage - 1);
      setPaginationLoading(false);
    }, 500);
  };

  const renderPaginationButtons = () => {
    return (
      <ThemedView style={styles.paginationContainer}>
        <TouchableOpacity
          style={[page <= 1 && styles.buttonDisabled]}
          onPress={handlePrevious}
          disabled={page <= 1 || paginationLoading}
        >
          <CustomButton
            title="Previous"
            onPress={handlePrevious}
            icon={<ArrowLeft size={16} color="#FFFFFF" />}
          />
        </TouchableOpacity>
        <ThemedText style={styles.pageInfo}>
          Page {page} of {totalPages}
        </ThemedText>
        <TouchableOpacity
          style={[page >= totalPages && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={page >= totalPages || paginationLoading}
        >
          <CustomButton
            title="Next"
            onPress={handleNext}
            icon={<ArrowRight size={16} color="#FFFFFF" />}
          />
        </TouchableOpacity>
      </ThemedView>
    );
  };

  const renderFooter = () => {
    if (!paginationLoading) return null;
    return (
      <ThemedView style={styles.footer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  };

  const handleApplyFilters = (
    startDate: Date | null,
    endDate: Date | null,
    username: string
  ) => {
    setStartDateFilter(startDate);
    setEndDateFilter(endDate);
    setUsernameFilter(username);
    showAlert("success", "Filters applied successfully!");
  };

  if (loading || isLoading) {
        return (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <ThemedText style={styles.loadingText}>Loading Entry Logs...</ThemedText>
          </ThemedView>
        );
      }

  const TableHeader = () => (
    <ThemedView style={styles.tableHeader}>
      <ThemedText style={styles.headerText}>Incident</ThemedText>
      <ThemedText style={styles.headerText}>Status</ThemedText>
      <ThemedText style={styles.headerText}>Remarks</ThemedText>
      <ThemedText style={styles.headerText}>Created At</ThemedText>
    </ThemedView>
  );

  const truncateText = (text: any, maxWords: any) => {
    const words = text.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return text;
  };

  const handleEditPress = (ticket: TaskTracker) => {
    console.log("taskTtrackerId" + ticket.taskTtrackerId);
    setSelectedTicket(ticket);
    setIsUpdateModalVisible(true);
  };

  const TableRow = ({ item }: { item: TaskTracker }) => {
    console.log("Item Log:" + item.taskTtrackerId);
    const isExpanded = expandedId === item.taskTtrackerId;
    const statusColor = item.bugStatus === "Resolved" ? "#4CAF50" : "#FF9800";

    return (
      <ThemedView style={styles.tableRowContainer}>
        <TouchableOpacity
          style={styles.tableRow}
          onPress={() => setExpandedId(isExpanded ? null : item.taskTtrackerId)}
        >
          <ThemedText style={styles.cellText}>{item.incidentNo}</ThemedText>
          <ThemedText style={[styles.cellText, { color: statusColor }]}>
            {item.bugStatus ?? "N/A"}
          </ThemedText>
          <ThemedText style={styles.cellText}>
            {truncateText(item.remarks ?? "None", 2)}
          </ThemedText>
          <IconSymbol
            name={isExpanded ? "chevron.up" : "chevron.down"}
            size={20}
            color="#808080"
          />
          <ThemedText style={styles.cellText}>
            {new Date(item.createdDate).toLocaleString()}
          </ThemedText>
        </TouchableOpacity>

        {isExpanded && (
          <ThemedView style={styles.detailsContainer}>
            <View style={styles.editbutton}>
              <CustomButton
                title="Edit"
                onPress={() => handleEditPress(item)}
                icon={<Edit size={16} color="#FFFFFF" />}
              />
            </View>
            <DetailRow label="Ticket Type" value={item.ticketType} />
            <DetailRow label="Bug" value={item.bug ?? "None"} />
            <DetailRow label="Location" value={item.location} />
            <DetailRow
              label="Start Date"
              value={new Date(item.startDate).toLocaleString()}
            />
            <DetailRow
              label="End Date"
              value={new Date(item.endDate).toLocaleString()}
            />
            <DetailRow label="Taken For" value={item.takenFor} />
            <DetailRow label="User Name" value={item.userName} />
            <DetailRow label="Remarks" value={item.remarks ?? "None"} />
            <DetailRow label="Challenges" value={item.challenges ?? "None"} />
            <DetailRow label="Environment" value={item.environment ?? "None"} />
            <DetailRow
              label="Created"
              value={new Date(item.createdDate).toLocaleString()}
            />
          </ThemedView>
        )}
      </ThemedView>
    );
  };

  const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <ThemedView style={styles.detailRow}>
      <ThemedText style={styles.detailLabel}>{label}:</ThemedText>
      <ThemedText style={styles.detailValue}>{value || "N/A"}</ThemedText>
    </ThemedView>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="list.bullet.rectangle"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>
          Entry Logs
        </ThemedText>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.titleContainer2}
        >
          <CustomButton
            title="Add"
            onPress={() => router.push("/(tabs)/entry-form")}
            icon={<Plus size={16} color="#FFFFFF" />}
          />
          <Icon
            name="filter"
            size={24}
            color="#1f2937"
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      </ThemedView>

      <TaskFilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApply={handleApplyFilters}
        initialStartDate={startDateFilter}
        initialEndDate={endDateFilter}
        initialUsername={usernameFilter}
        isAdmin={userDetails?.roleId === 1}
      />

      <ThemedView style={styles.tableContainer}>
        <TableHeader />
        <FlatList
          data={paginatedData}
          renderItem={({ item }) => <TableRow item={item} />}
          keyExtractor={(item) =>
            item && item.taskTtrackerId
              ? item.taskTtrackerId.toString()
              : Math.random().toString()
          }
          style={styles.flatList}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={<Text>No entries available</Text>}
        />
        {renderPaginationButtons()}
      </ThemedView>

      {selectedTicket && (
        <UpdateTicketModal
          isOpen={isUpdateModalVisible}
          onClose={() => {
            setIsUpdateModalVisible(false);
            setSelectedTicket(null);
          }}
          ticketData={selectedTicket}
          onUpdate={() => {
            fetchData();
            showAlert("success", "Ticket updated successfully!");
          }}
        />
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#a1a1aa",
    bottom: -100,
    left: -50,
    position: "absolute",
    opacity: 0.9,
    transform: [{ scale: 1.1 }],
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  titleContainer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    gap: 6,
  },
  tableContainer: {
    margin: 8,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    backgroundColor: "#ffffff",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
  },
  tableRowContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginVertical: 2,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
  },
  headerText: {
    flex: 1,
    fontWeight: "700",
    textAlign: "center",
    color: "#1f2937",
    fontSize: 15,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cellText: {
    flex: 1,
    textAlign: "center",
    color: "#374151",
    fontSize: 15,
    fontWeight: "500",
  },
  flatList: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 8,
  },
  editbutton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    margin: 5,
  },
  detailsContainer: {
    padding: 15,
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: "row",
    marginVertical: 6,
    flexWrap: "wrap",
    alignItems: "center",
  },
  detailLabel: {
    width: 110,
    fontWeight: "600",
    color: "#4b5563",
    fontSize: 14,
  },
  detailValue: {
    flex: 1,
    color: "#1f2937",
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 12,
    marginHorizontal: 8,
    elevation: 4,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    transform: [{ scale: 1 }],
  },
  buttonDisabled: {
    backgroundColor: "#d1d5db",
    opacity: 0.7,
    borderRadius: 30,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  pageInfo: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e40af",
    letterSpacing: 0.3,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
});
