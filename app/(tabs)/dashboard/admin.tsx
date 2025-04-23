 
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { UserContext } from '@/context/UserContext';
import { PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import CustomButtonDate from '@/components/CustomButtonDate';
import { router } from 'expo-router';
import { LayoutDashboard } from 'lucide-react-native';
 
interface TaskTracker {
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
 
const { width: screenWidth } = Dimensions.get('window');
const isLargeScreen = screenWidth >= 768; // Threshold for large screens (tablets, desktops)
 
type NavigationProp = {
  navigate: (screen: string) => void;
};
 
export default function AdminPanelScreen() {
  const userContext = useContext(UserContext);
  const userDetails = userContext?.userDetails;
  const isLoading = userContext?.isLoading;
  const navigation = useNavigation<NavigationProp>();
 
  const [data, setData] = useState<{ response: TaskTracker[] }>({ response: [] });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(''); // Date filter
 
  if (userDetails?.roleId !== 1) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>Access Denied: Admins Only</ThemedText>
      </ThemedView>
    );
  }
 
  const fetchData = async () => {
    try {
      const response = await fetch(
        'http://10.10.50.6/TracerAPI/api/TaskManagement/GetAllTask'
      );
      const json = await response.json();
      setData(json);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching task data:', error);
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchData();
  }, []);
 
  if (loading || isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <ThemedText style={styles.loadingText}>Loading Admin Panel...</ThemedText>
      </ThemedView>
    );
  }
 
  // Get unique users
  const users = Array.from(new Set(data.response.map((task) => task.userName))).sort();
 
  // Get last 7 days including today
  const today = moment();
  const last30Days = Array.from({ length: 30 }, (_, i) =>
    moment(today).subtract(i, 'days').format('YYYY-MM-DD')
  ).reverse();
 
  // Calculate active ticket counts for all users
  const activeTicketCounts = data.response
    .filter((task) => !task.isDeleted && task.bugStatus !== 'Closed' && task.bugStatus !== 'Resolved')
    .reduce(
      (acc, task) => {
        const user = task.userName;
        acc[user] = (acc[user] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
 
  // Pie chart data for active tickets by user
  const pieChartData = Object.entries(activeTicketCounts).map(([user, count], index) => ({
    name: user,
    population: count || 0.01, // Ensure non-zero for pie chart
    color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'][index % 6],
    legendFontColor: '#7F7F7F',
    legendFontSize: isLargeScreen ? 15 : 12,
  }));
 
  // Calculate pending task hours by user and date
  const MAX_DAILY_HOURS = 8;

const userPendingHoursByDate = data.response
  .filter((task) => !task.isDeleted)
  .reduce(
    (acc, task) => {
      const start = moment(task.startDate);
      const end = moment(task.endDate);
      const user = task.userName;

      // Handle tasks that span multiple days
      let currentDate = start.clone();
      while (currentDate.isSameOrBefore(end, 'day')) {
        const date = currentDate.format('YYYY-MM-DD');

        // Calculate hours for the current date
        const startOfDay = currentDate.clone().startOf('day');
        const endOfDay = currentDate.clone().endOf('day');
        const taskStart = moment.max(start, startOfDay);
        const taskEnd = moment.min(end, endOfDay);
        
        // Ensure non-negative hours
        const hours = Math.max(0, taskEnd.diff(taskStart, 'hours', true));

        // Initialize user and date if not present
        if (!acc[user]) {
          acc[user] = {};
        }
        if (!acc[user][date]) {
          acc[user][date] = { hoursWorked: 0, remainingHours: MAX_DAILY_HOURS, taskCount: 0 };
        }

        // Update hours worked and task count
        acc[user][date].hoursWorked += hours;
        acc[user][date].taskCount += 1;

        // Update remaining hours (cap at 0 to avoid negative values)
        acc[user][date].remainingHours = Math.max(
          0,
          MAX_DAILY_HOURS - acc[user][date].hoursWorked
        );

        // Move to next day
        currentDate.add(1, 'day');
      }

      return acc;
    },
    {} as Record<string, Record<string, { hoursWorked: number; remainingHours: number; taskCount: number }>>
  );
 
  // Prepare list data for selected user and date
  const pendingTaskList = selectedUser
  ? last30Days
      .filter((date) => !selectedDate || date === selectedDate)
      .map((date) => {
        const hoursWorked = userPendingHoursByDate[selectedUser]?.[date]?.hoursWorked || 0;
        const remainingHours = hoursWorked < 8 ? Math.round((8 - hoursWorked) * 100) / 100 : 0;

        return {
          user: selectedUser,
          date: moment(date).format('MMM DD, YYYY'),
          hours: remainingHours,
          taskCount: userPendingHoursByDate[selectedUser]?.[date]?.taskCount || 0,
        };
      })
  : [];

 
  const renderPendingTaskRow = ({ item }: { item: { user: string; date: string; hours: number; taskCount: number } }) => (
    <ThemedView style={styles.tableRow}>
      <ThemedText style={styles.cellText}>{item.user}</ThemedText>
      <ThemedText style={styles.cellText}>{item.date}</ThemedText>
      <ThemedText style={styles.cellText}>{item.taskCount}</ThemedText>
      <ThemedText style={styles.cellText}>{item.hours.toFixed(2)}h</ThemedText>
    </ThemedView>
  );
 
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={isLargeScreen ? 350 : 310}
          color="#808080"
          name="chart.pie"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>
          Admin Panel
        </ThemedText>
        <TouchableOpacity>
            <CustomButtonDate
              title="Back to Dashboard"
              onPress={() => router.push("/(tabs)/dashboard")}
              icon={<LayoutDashboard size={16} color="#FFFFFF" />}
            />
          </TouchableOpacity>
      </ThemedView>
 
      <ThemedView style={styles.chartContainer}>
        <ThemedText style={styles.chartTitle}>Active Tickets by User</ThemedText>
        <PieChart
          data={pieChartData.length > 0 ? pieChartData : [{ name: 'No Data', population: 1, color: '#d1d5db', legendFontColor: '#7F7F7F', legendFontSize: isLargeScreen ? 15 : 12 }]}
          width={screenWidth - 110}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft={isLargeScreen ? '30' : '15'}
          absolute
          style={styles.chart}
        />
      </ThemedView>
 
      <ThemedView style={styles.filterContainer}>
        <ThemedText style={styles.chartTitle}>Filter Pending Tasks</ThemedText>
        <Picker
          selectedValue={selectedUser}
          onValueChange={(itemValue) => setSelectedUser(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select User" value="" />
          {users.map((user) => (
            <Picker.Item key={user} label={user} value={user} />
          ))}
        </Picker>
        <TextInput
          style={styles.dateInput}
          placeholder="Filter by Date (YYYY-MM-DD)"
          value={selectedDate}
          onChangeText={(text) => setSelectedDate(text)}
        />
      </ThemedView>
 
      {selectedUser && (
        <ThemedView style={styles.tableContainer}>
          <ThemedText style={styles.chartTitle}>Pending Task Details for {selectedUser}</ThemedText>
          <ThemedView style={styles.tableHeader}>
            <ThemedText style={styles.headerText}>User</ThemedText>
            <ThemedText style={styles.headerText}>Date</ThemedText>
            <ThemedText style={styles.headerText}>Pending Tasks</ThemedText>
            <ThemedText style={styles.headerText}>Pending Hours</ThemedText>
          </ThemedView>
          <FlatList
            data={pendingTaskList}
            renderItem={renderPendingTaskRow}
            keyExtractor={(item) => `${item.user}-${item.date}`}
            style={styles.flatList}
            ListEmptyComponent={<Text>No pending tasks for selected user and date</Text>}
          />
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#dc2626',
    fontWeight: '600',
  },
  headerImage: {
    color: '#a1a1aa',
    bottom: -100,
    left: -50,
    position: 'absolute',
    opacity: 0.9,
    transform: [{ scale: 1.1 }],
  },
  titleContainer: {
    flexDirection: isLargeScreen ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: isLargeScreen ? 'center' : 'flex-start',
    flexWrap: 'wrap',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    margin: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e40af',
    letterSpacing: 0.3,
    marginBottom: isLargeScreen ? 0 : 12,
  },
  filterContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  chartContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 16,
  },
  tableContainer: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  headerText: {
    flex: 1,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1f2937',
    fontSize: 15,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cellText: {
    flex: 1,
    textAlign: 'center',
    color: '#374151',
    fontSize: 15,
    fontWeight: '500',
  },
  flatList: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 8,
  },
  backButton: {
    backgroundColor: '#3b82f6',
    display: 'flex',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  picker: {
    height: 50,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  dateInput: {
    height: 50,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#374151',
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
 