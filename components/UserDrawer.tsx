import React, { useContext, useState } from "react";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Icon } from "@/components/ui/icon";
import {
  User,
  GripVerticalIcon,
  EditIcon,
  LogOut,
  LayoutDashboard,
} from "lucide-react-native";
import { ThemedText } from "@/components/ThemedText";

import { router, useRouter } from "expo-router";
import { UserContext } from "@/context/UserContext";

import { ChevronDownIcon, Download } from "lucide-react-native";

import { Alert, ListRenderItemInfo, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

type UserDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

interface MonthOption {
  label: string;
  value: string;
}

export const UserDrawer: React.FC<UserDrawerProps> = ({ isOpen, onClose }) => {
  const userContext = useContext(UserContext);

  const [monthNumber, setMonthNumber] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  if (!userContext) {
    return null;
  }

  const { userDetails, logout } = userContext;

  const handleLogout = async () => {
    await logout();
    router.replace("/(tabs)/login");
  };

  const monthOptions: MonthOption[] = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const router = useRouter();

  if (!userDetails) {
    return (
      <View>
        <Text>Please log in to continue</Text>
      </View>
    );
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerBackdrop />
      <DrawerContent className="w-[270px]">
        <DrawerHeader className="justify-center flex-col gap-2">
          <Avatar size="2xl">
            <AvatarFallbackText>User</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=687&q=80",
              }}
            />
          </Avatar>
          <VStack>
            {userDetails ? (
              <>
                <ThemedText type="subtitle">
                  Welcome, {userDetails.userName}
                </ThemedText>

                <ThemedText>ID: {userDetails.userId}</ThemedText>
              </>
            ) : (
              <>
                <ThemedText type="subtitle">Not Logged In</ThemedText>
              </>
            )}
          </VStack>
        </DrawerHeader>

        <Divider className="my-4" />
        <DrawerBody contentContainerClassName="gap-2">
          <DrawerItem
            icon={LayoutDashboard}
            label="Dashboard"
            onPress={() => {
              console.log("Navigating to Dashboard");
              router.push("/dashboard");
              onClose();
            }}
          />
          <DrawerItem
            icon={EditIcon}
            label="Entry Form"
            onPress={() => {
              console.log("Navigating to Entry Form");
              router.push("/entry-form");
              onClose();
            }}
          />
          <DrawerItem
            icon={GripVerticalIcon}
            label="Entry Log"
            onPress={() => {
              console.log("Navigating to Entry Log");
              router.push("/entries-log");
              onClose();
            }}
          />
         
        </DrawerBody>
        {userDetails && userDetails.roleId === 1 && (
                <View className="flex justify-center items-center gap-2 p-2">
                  <Picker
                    selectedValue={monthNumber}
                    onValueChange={(itemValue: string) =>
                      setMonthNumber(itemValue)
                    }
                    style={{ height: 50, width: "100%", maxHeight: 30 }}
                  >
                    <Picker.Item label="Select month *" value="" />
                    {monthOptions.map((item) => (
                      <Picker.Item
                        key={item.value}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Picker>
                  <Button
                    onPress={async () => {
                      setIsExporting(true);
                      try {
                        const month = parseInt(monthNumber);
                        if (isNaN(month) || month < 1 || month > 12) {
                          Alert.alert("Error", "Please select a valid month");
                          return;
                        }

                        const response = await fetch(
                          `http://10.10.50.6/TracerAPI/api/TaskManagement/ExportExcel?monthNumber=${month}`,
                          {
                            method: "GET",
                            headers: {
                              Accept:
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            },
                          }
                        );

                        if (response.ok) {
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = `tasks_month_${month}_${new Date().toISOString()}.xlsx`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);

                          Alert.alert(
                            "Success",
                            "Excel file exported successfully"
                          );
                          setMonthNumber("");
                        } else {
                          const errorText = await response.text();
                          Alert.alert("Error", `Export failed: ${errorText}`);
                        }
                      } catch (error) {
                        console.error("Export error:", error);
                        Alert.alert(
                          "Error",
                          "An error occurred while exporting"
                        );
                      } finally {
                        setIsExporting(false);
                      }
                    }}
                    className="w-full gap-2"
                    variant="outline"
                    action="secondary"
                    disabled={isExporting}
                  >
                    <ButtonText>
                      {isExporting ? "Exporting..." : "Export to Excel"}
                    </ButtonText>
                    <ButtonIcon as={Download} />
                  </Button>
                </View>
              )}
              {userDetails && (
            <View>
                <Button
                  onPress={() => {
                    handleLogout();
                    console.log("Navigating to signup");
                    router.push("/signup");
                    onClose();
                  }}
                  variant="outline"
                  action="secondary"
                >
                  <ButtonText>Logout</ButtonText>
                  <ButtonIcon as={LogOut} />
                </Button>
           
            </View>
          )}
        <DrawerFooter>
          
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const DrawerItem = ({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md"
  >
    <Icon as={icon} size="lg" className="text-typography-600" />
    <Text>{label}</Text>
  </Pressable>
);
