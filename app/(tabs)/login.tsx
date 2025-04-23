// import { StyleSheet } from "react-native";
// import ParallaxScrollView from "@/components/ParallaxScrollView";
// import { ThemedText } from "@/components/ThemedText";
// import { ThemedView } from "@/components/ThemedView";
// import { IconSymbol } from "@/components/ui/IconSymbol";
// import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
// import React, { useContext, useEffect, useState } from "react";
// import { FormControl } from "@/components/ui/form-control";
// import { VStack } from "@/components/ui/vstack";
// import { Button, ButtonText } from "@/components/ui/button";
// import { Heading } from "@/components/ui/heading";
// import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
// import { Alert, AlertText } from "@/components/ui/alert";
// import { Icon, CloseIcon } from "@/components/ui/icon";
// import { Pressable } from "@/components/ui/pressable";
// import { router } from "expo-router";
// import { UserContext } from "@/context/UserContext";

// // State Types
// type AlertState = {
//   action: "success" | "error";
//   message: string;
// } | null;

// // Component Props Types
// interface IconSymbolProps {
//   size?: number;
//   color?: string;
//   name: string;
//   style?: import("react-native").StyleProp<import("react-native").ViewStyle>;
// }

// interface ThemedTextProps {
//   type?: string;
//   className?: string;
//   children: React.ReactNode;
// }

// interface ThemedViewProps {
//   style?: import("react-native").StyleProp<import("react-native").ViewStyle>;
//   children: React.ReactNode;
// }

// interface FormControlProps {
//   className?: string;
//   children: React.ReactNode;
// }

// interface InputProps {
//   className?: string;
//   children: React.ReactNode;
// }

// interface InputFieldProps {
//   type: "text" | "password";
//   value: string;
//   onChangeText: (text: string) => void;
//   placeholder?: string;
//   autoCapitalize?: "none" | "sentences" | "words" | "characters";
//   keyboardType?: string;
//   secureTextEntry?: boolean;
// }

// interface InputIconProps {
//   as: React.ComponentType<any>;
// }

// interface InputSlotProps {
//   className?: string;
//   onPress: () => void;
//   children: React.ReactNode;
// }

// interface VStackProps {
//   className?: string;
//   space?: string;
//   children: React.ReactNode;
// }

// interface ButtonProps {
//   className?: string;
//   size?: string;
//   onPress: () => void;
//   disabled?: boolean;
//   children: React.ReactNode;
// }

// interface ButtonTextProps {
//   className?: string;
//   children: React.ReactNode;
// }

// interface HeadingProps {
//   className?: string;
//   children: React.ReactNode;
// }

// interface AlertProps {
//   action: "success" | "error";
//   className?: string;
//   children: React.ReactNode;
// }

// interface AlertTextProps {
//   className?: string;
//   size?: string;
//   children: React.ReactNode;
// }

// interface IconProps {
//   as: React.ComponentType<any>;
//   onPress?: () => void;
// }

// // Function Types
// type HandleState = () => void;
// type ShowAlert = (action: "success" | "error", message: string) => void;
// type CloseAlert = () => void;
// type HandleLogin = () => Promise<void>;

// export default function TabTwoScreen() {
//   const userContext = useContext(UserContext);

//   if (!userContext) {
//     return <ThemedText>Error: User context not available</ThemedText>;
//   }

//   const { login, userDetails, isLoading } = userContext;

//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [isLoadinglocal, setIsLoadinglocal] = useState<boolean>(false);
//   const [alert, setAlert] = useState<AlertState>(null);

//   const handleState: HandleState = () => {
//     setShowPassword(!showPassword);
//   };

//   const showAlert: ShowAlert = (action, message) => {
//     setAlert({ action, message });
//   };

//   const closeAlert: CloseAlert = () => {
//     setAlert(null);
//   };

//   const handleLogin: HandleLogin = async () => {
//     console.log("Email input:", email);

//     if (!email.trim() || !password.trim()) {
//       showAlert("error", "Please enter both email and password.");
//       return;
//     }

//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(email.trim())) {
//       showAlert("error", "Please enter a valid email address.");
//       console.log("Email validation failed for:", email);
//       return;
//     }

//     setIsLoadinglocal(true);

//     try {
//       const response = await fetch(
//         "http://10.10.50.6/TracerAPI/api/Account/Login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email,
//             password,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Login failed.");
//       }

//       await login(data.response);
//       showAlert("success", "Logged in successfully!");
//       console.log("Login response:", data);

//       setEmail("");
//       setPassword("");
//     } catch (error: any) {
//       showAlert(
//         "error",
//         error.message || "Something went wrong. Please try again."
//       );
//       console.error("Login error:", error);
//     } finally {
//       setIsLoadinglocal(false);
//     }
//   };

//   // Navigate when userDetails is updated
//   useEffect(() => {
//     if (!isLoading && userDetails) {
//       console.log("Navigating to / with userDetails:", userDetails);
//       router.replace("/");
//     }
//   }, [userDetails, isLoading]);

//   if (isLoading && isLoadinglocal) {
//     return (
//       <ThemedView className="flex-1 justify-center items-center">
//         <ThemedText>Loading...</ThemedText>
//       </ThemedView>
//     );
//   }

//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
//       headerImage={
//         <IconSymbol
//           size={310}
//           color="#808080"
//           name="chevron.left.forwardslash.chevron.right"
//           style={styles.headerImage}
//         />
//       }
//     >
//       <ThemedView style={styles.parentContainer}>
//         <ThemedView style={styles.mainContainer}>
//           <ThemedView style={styles.mainTitle}>
//             <ThemedText type="title">Log In</ThemedText>
//             <ThemedText>Welcome to Task Tracker</ThemedText>
//           </ThemedView>
//           {alert && (
//             <Alert
//               action={alert.action}
//               className="gap-4 max-w-[585px] w-full self-center items-start min-[400px]:items-center mb-4"
//             >
//               <VStack className="gap-4 min-[400px]:flex-row justify-between flex-1 min-[400px]:items-center">
//                 <AlertText
//                   className="font-semibold text-typography-900"
//                   size="sm"
//                 >
//                   {alert.message}
//                 </AlertText>
//                 {alert.action === "success" && (
//                   <Button
//                     size="sm"
//                     className="hidden sm:flex"
//                     onPress={closeAlert}
//                   >
//                     <ButtonText>OK</ButtonText>
//                   </Button>
//                 )}
//               </VStack>
//               <Pressable onPress={closeAlert}>
//                 <Icon as={CloseIcon} />
//               </Pressable>
//             </Alert>
//           )}
//           <FormControl className="p-4 border rounded-lg border-outline-300">
//             <VStack space="xl">
//               <VStack space="xs">
//                 <ThemedText className="text-typography-500">Email</ThemedText>
//                 <Input className="min-w-[250px]">
//                   <InputField
//                     type="text"
//                     value={email}
//                     onChangeText={setEmail}
//                     placeholder="Enter your email"
//                     autoCapitalize="none"
//                     keyboardType="email-address"
//                   />
//                 </Input>
//               </VStack>
//               <VStack space="xs">
//                 <ThemedText className="text-typography-500">
//                   Password
//                 </ThemedText>
//                 <Input className="text-center">
//                   <InputField
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChangeText={setPassword}
//                     placeholder="Enter your password"
//                     secureTextEntry={!showPassword}
//                   />
//                   <InputSlot className="pr-3" onPress={handleState}>
//                     <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
//                   </InputSlot>
//                 </Input>
//               </VStack>
//               <Button
//                 className="ml-auto"
//                 onPress={handleLogin}
//                 disabled={isLoadinglocal || isLoading}
//               >
//                 <ButtonText className="text-typography-0">
//                   {isLoadinglocal || isLoading ? "Logging in..." : "Login"}
//                 </ButtonText>
//               </Button>
//               <ThemedText>Don't have an account?</ThemedText>
//               <ThemedText
//                 className="text-typography-600"
//                 onPress={() => {
//                   console.log("Navigating to signup");
//                   router.push("/signup");
//                 }}
//                 style={{ textDecorationLine: "underline" }}
//               >
//                 {" "}
//                 Signup
//               </ThemedText>
//             </VStack>
//           </FormControl>
//         </ThemedView>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   mainTitle: {
//     alignItems: "center",
//     gap: 3,
//     marginBottom: 20
//   },
//   headerImage: {
//     color: "#808080",
//     bottom: -90,
//     left: -35,
//     position: "absolute",
//   },
//   parentContainer: {
//     marginTop: 30,
//     flex: 1, // Take full available space
//     alignItems: "center", // Center horizontally
// justifyContent: "center"
    
//   },
//   mainContainer: {

//     margin: 30,
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",

//   },
// });



import { ActivityIndicator, StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import { FormControl } from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { router } from "expo-router";
import { UserContext } from "@/context/UserContext";
import Toast from "react-native-toast-message";

// Component Props Types
interface IconSymbolProps {
  size?: number;
  color?: string;
  name: string;
  style?: import("react-native").StyleProp<import("react-native").ViewStyle>;
}

interface ThemedTextProps {
  type?: string;
  className?: string;
  children: React.ReactNode;
}

interface ThemedViewProps {
  style?: import("react-native").StyleProp<import("react-native").ViewStyle>;
  children: React.ReactNode;
}

interface FormControlProps {
  className?: string;
  children: React.ReactNode;
}

interface InputProps {
  className?: string;
  children: React.ReactNode;
}

interface InputFieldProps {
  type: "text" | "password";
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: string;
  secureTextEntry?: boolean;
}

interface InputIconProps {
  as: React.ComponentType<any>;
}

interface InputSlotProps {
  className?: string;
  onPress: () => void;
  children: React.ReactNode;
}

interface VStackProps {
  className?: string;
  space?: string;
  children: React.ReactNode;
}

interface ButtonProps {
  className?: string;
  size?: string;
  onPress: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

interface ButtonTextProps {
  className?: string;
  children: React.ReactNode;
}

// Function Types
type HandleState = () => void;
type ShowAlert = (action: "success" | "error", message: string) => void;
type CloseAlert = () => void;
type HandleLogin = () => Promise<void>;

export default function TabTwoScreen() {
  const userContext = useContext(UserContext);

  if (!userContext) {
    return <ThemedText>Error: User context not available</ThemedText>;
  }

  const { login, userDetails, isLoading } = userContext;

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoadinglocal, setIsLoadinglocal] = useState<boolean>(false);

  const handleState: HandleState = () => {
    setShowPassword(!showPassword);
  };

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

  const handleLogin: HandleLogin = async () => {
    console.log("Email input:", email);

    if (!email.trim() || !password.trim()) {
      showAlert("error", "Please enter both email and password.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      showAlert("error", "Please enter a valid email address.");
      console.log("Email validation failed for:", email);
      return;
    }

    setIsLoadinglocal(true);

    try {
      const response = await fetch(
        "http://10.10.50.6/TracerAPI/api/Account/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      await login(data.response);
      showAlert("success", "Logged in successfully!");
      console.log("Login response:", data);

      setEmail("");
      setPassword("");
    } catch (error: any) {
      showAlert(
        "error",
        error.message || "Something went wrong. Please try again."
      );
      console.error("Login error:", error);
    } finally {
      setIsLoadinglocal(false);
    }
  };

  // Navigate when userDetails is updated
  useEffect(() => {
    if (!isLoading && userDetails) {
      console.log("Navigating to / with userDetails:", userDetails);
      // Delay navigation to ensure toast displays
      setTimeout(() => router.replace("/"), 2000);
    }
  }, [userDetails, isLoading]);

  if (isLoading || isLoadinglocal) {
    return (
      <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <ThemedText style={styles.loadingText}>Loading Login Panel...</ThemedText>
        </ThemedView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.parentContainer}>
        <ThemedView style={styles.mainContainer}>
          <ThemedView style={styles.mainTitle}>
            <ThemedText type="title">Log In</ThemedText>
            <ThemedText>Welcome to Task Tracker</ThemedText>
          </ThemedView>
          <FormControl className="p-4 border rounded-lg border-outline-300">
            <VStack space="xl">
              <VStack space="xs">
                <ThemedText className="text-typography-500">Email</ThemedText>
                <Input className="min-w-[250px]">
                  <InputField
                    type="text"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </Input>
              </VStack>
              <VStack space="xs">
                <ThemedText className="text-typography-500">
                  Password
                </ThemedText>
                <Input className="text-center">
                  <InputField
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                  />
                  <InputSlot className="pr-3" onPress={handleState}>
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                  </InputSlot>
                </Input>
              </VStack>
              <Button
                className="ml-auto"
                onPress={handleLogin}
                disabled={isLoadinglocal || isLoading}
              >
                <ButtonText className="text-typography-0">
                  {isLoadinglocal || isLoading ? "Logging in..." : "Login"}
                </ButtonText>
              </Button>
              <ThemedText>Don't have an account?</ThemedText>
              <ThemedText
                className="text-typography-600"
                onPress={() => {
                  console.log("Navigating to signup");
                  router.push("/signup");
                }}
                style={{ textDecorationLine: "underline" }}
              >
                Signup
              </ThemedText>
            </VStack>
          </FormControl>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  mainTitle: {
    alignItems: "center",
    gap: 3,
    marginBottom: 20
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  parentContainer: {
    marginTop: 30,
    flex: 1, // Take full available space
    alignItems: "center", // Center horizontally
    justifyContent: "center"
  },
  mainContainer: {
    margin: 30,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
