


import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { UserContext } from '@/context/UserContext';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { router } from 'expo-router';
import CustomButtonDate from '@/components/CustomButtonDate';
import { ShieldUser } from 'lucide-react-native';
 
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
 
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isLargeScreen = screenWidth >= 768; // Threshold for large screens (tablets, desktops)
 
export default function DashboardScreen() {
  const userContext = useContext(UserContext);
  const userDetails = userContext?.userDetails;
  const isLoading = userContext?.isLoading;
  const navigation = useNavigation();
 
  const [data, setData] = useState<{ response: TaskTracker[] }>({ response: [] });
  const [loading, setLoading] = useState(true);
 
  const fetchData = async () => {
    try {
      const response = await fetch(
        'http://10.10.50.6/TracerAPI/api/TaskManagement/GetAllTask'
      );
      const json = await response.json();
      let filteredData = json;
 
      if (userDetails && json.response && userDetails.roleId === 2) {
        filteredData = {
          ...json,
          response: json.response.filter((task: TaskTracker) => task.userId === userDetails.userId),
        };
      }
 
      setData(filteredData);
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
          <ThemedText style={styles.loadingText}>Loading Dashboard...</ThemedText>
        </ThemedView>
      );
    }
 
  // Calculate daily hours worked
  const dailyHours = data.response
    .filter((task) => !task.isDeleted)
    .reduce((acc, task) => {
      const start = moment(task.startDate);
      const end = moment(task.endDate);
      const date = start.format('YYYY-MM-DD');
      const hours = end.diff(start, 'hours', true);
 
      if (!acc[date]) {
        acc[date] = { hours: 0, count: 0 };
      }
      acc[date].hours += hours;
      acc[date].count += 1;
      return acc;
    }, {} as Record<string, { hours: number; count: number }>);
 
  // Get last 7 days including today
  const today = moment();
  const last7Days = Array.from({ length: 7 }, (_, i) =>
    moment(today).subtract(i, 'days').format('YYYY-MM-DD')
  ).reverse();
 
  // Bar chart data
  const barChartData = {
    labels: last7Days.map((date) => moment(date).format('MMM DD')),
    datasets: [
      {
        data: last7Days.map(
          (date) => (dailyHours[date]?.hours ? Math.round(dailyHours[date].hours * 100) / 100 : 0)
        ),
      },
    ],
  };
 
  // Calculate task status distribution for last 7 days
  const statusCounts = data.response
    .filter((task) => {
      if (task.isDeleted) return false;
      const taskDate = moment(task.startDate).format('YYYY-MM-DD');
      return last7Days.includes(taskDate);
    })
    .reduce(
      (acc, task) => {
        const status = task.bugStatus || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
 
  const pieChartData = Object.entries(statusCounts).map(([status, count], index) => ({
    name: status,
    population: count,
    color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][index % 5],
    legendFontColor: '#7F7F7F',
    legendFontSize: isLargeScreen ? 15 : 12,
  }));
 
  // Calculate dates with no tasks and remaining hours
  const noTaskDates = last7Days
    .map((date) => ({
      date,
      hoursReported: dailyHours[date]?.hours || 0,
    }))
    .filter((item) => item.hoursReported <= 8)
    .map((item) => ({
      date: moment(item.date).format('MMM DD, YYYY'),
      remainingHours: 8 - item.hoursReported ,
    }));
 
  const isAdmin = userDetails?.roleId === 1;
 
  // Responsive chart dimensions
  const chartWidth = isLargeScreen ? (screenWidth - 180) / 2 : screenWidth - 40;
  const chartHeight = isLargeScreen ? 300 : 220;

  const pieChartWidth = isLargeScreen ? (screenWidth - 180) / 2 : screenWidth - 90;
  const pieChartHeight = isLargeScreen ? 300 : 200;
 
  // Render no-task dates list item
  const renderNoTaskItem = ({ item }: { item: { date: string; remainingHours: number } }) => {
    console.log(item);
    return (
      <ThemedView style={styles.noTaskItem}>
        <ThemedText style={styles.noTaskText}>
          {item.date}: No tasks reported, {item.remainingHours} hours remaining
        </ThemedText>
      </ThemedView>
    );
  };
 
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={isLargeScreen ? 350 : 310}
          color="#808080"
          name="chart.bar"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>
          Task Dashboard
        </ThemedText>
        {isAdmin && (
        <TouchableOpacity>
        <CustomButtonDate
          title="Go to Admin Panel"
          onPress={() => router.push("/dashboard/admin")}
          icon={<ShieldUser size={16} color="#FFFFFF" />}
        />
      </TouchableOpacity>
        )}
      </ThemedView>
 
      <ThemedView style={[styles.noTaskContainer  && styles.chartContainer , isLargeScreen && styles.chartContainerRow]}>
        <ThemedView style={styles.chartWrapper}>
          <ThemedText style={styles.chartTitle}>Daily Hours Worked</ThemedText>
          <BarChart
            data={barChartData}
            width={chartWidth}
            height={chartHeight}
            yAxisLabel=""
            yAxisSuffix="h"
            chartConfig={{
              backgroundGradientFrom: '#f3f4f6',
              backgroundGradientTo: '#e5e7eb',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '6', strokeWidth: '2', stroke: '#1e40af' },
              propsForBackgroundLines: {
                stroke: (value: number) => (value === 8 ? '#ff0000' : '#e0e0e0'),
                strokeWidth: (value: number) => (value === 8 ? 2 : 1),
                strokeDasharray: (value: number) => (value === 8 ? '5,5' : ''),
              },
              fillShadowGradient: '#3b82f6',
              fillShadowGradientOpacity: 0.6,
            }}
            style={styles.chart}
            showValuesOnTopOfBars
            fromZero
            yAxisInterval={2}
           // withCustomBarWidth={isLargeScreen ? 20 : 15}
            flatColor
            withHorizontalLabels
            withInnerLines
            showBarTops
          />
        </ThemedView>
 
        <ThemedView style={styles.chartWrapper}>
          <ThemedText style={styles.chartTitle}>Task Status (Last 7 Days)</ThemedText>
          <PieChart
            data={pieChartData.length > 0 ? pieChartData : [{ name: 'No Data', population: 1, color: '#d1d5db', legendFontColor: '#7F7F7F', legendFontSize: isLargeScreen ? 15 : 12 }]}
            width={pieChartWidth }
            height={pieChartHeight}
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
      </ThemedView>
 
      {noTaskDates.length > 0 && (
        <ThemedView style={styles.noTaskContainer}>
          <ThemedText style={styles.chartTitle}>Unreported Task Dates</ThemedText>
          <FlatList
            data={noTaskDates}
            renderItem={renderNoTaskItem}
            keyExtractor={(item) => item.date}
            style={styles.noTaskList}
          />
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}
 
const styles = StyleSheet.create({
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
  chartContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
    gap: isLargeScreen ? 0 : 25,
  },
  chartContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  chartWrapper: {
    flex: isLargeScreen ? 1 : undefined,
    marginHorizontal: isLargeScreen ? 10 : 0,
    alignItems: 'center'
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  chartNote: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 8,
    textAlign: 'center',
  },
  adminButton: {
    backgroundColor: '#3b82f6',
    display: 'flex',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 1,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  noTaskContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  noTaskList: {
    maxHeight: 200,
  },
  noTaskItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  noTaskText: {
    fontSize: 16,
    color: '#b91c1c',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '500',
  },
});