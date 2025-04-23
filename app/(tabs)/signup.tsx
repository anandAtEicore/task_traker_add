import { StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import React, { useContext, useState } from "react";
import { FormControl } from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Alert, AlertText } from "@/components/ui/alert";
import { Icon, CloseIcon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { router } from "expo-router";
import { UserContext } from "@/context/UserContext";

// State Types
type AlertState = {
  action: "success" | "error";
  message: string;
} | null;

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
  const [alert, setAlert] = useState<AlertState>(null);

  const handleState: HandleState = () => {
    setShowPassword(!showPassword);
  };

  const showAlert: ShowAlert = (action, message) => {
    setAlert({ action, message });
  };

  const closeAlert: CloseAlert = () => {
    setAlert(null);
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
      const response = await fetch("https://api.example.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      showAlert("success", "Logged in successfully!");
      console.log("Login response:", data);

      setEmail("");
      setPassword("");

      await login(data);

      // Navigate to home screen
      router.replace("/(tabs)");
    } catch (error: any) {
      showAlert(
        "error",
        error.message || "Something went wrong. Please try again."
      );
      console.log("Login error:", error);
    } finally {
      setIsLoadinglocal(false);
    }
  };

  if (isLoading && isLoadinglocal) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText>Loading...</ThemedText>
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
            <ThemedText type="title">Sign Up</ThemedText>
            <ThemedText style={styles.mainTitle}>
              Welcome to Task Tracker
            </ThemedText>
          </ThemedView>
          {alert && (
            <Alert
              action={alert.action}
              className="gap-4 max-w-[585px] w-full self-center items-start min-[400px]:items-center mb-4"
            >
              <VStack className="gap-4 min-[400px]:flex-row justify-between flex-1 min-[400px]:items-center">
                <AlertText
                  className="font-semibold text-typography-900"
                  size="sm"
                >
                  {alert.message}
                </AlertText>
                {alert.action === "success" && (
                  <Button
                    size="sm"
                    className="hidden sm:flex"
                    onPress={closeAlert}
                  >
                    <ButtonText>OK</ButtonText>
                  </Button>
                )}
              </VStack>
              <Pressable onPress={closeAlert}>
                <Icon as={CloseIcon} />
              </Pressable>
            </Alert>
          )}
          <FormControl className="p-4 border rounded-lg border-outline-300">
            <VStack space="xl">
              <Heading className="text-typography-900">Login</Heading>
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
                disabled={isLoading}
              >
                <ButtonText className="text-typography-0">
                  {isLoading ? "signup in..." : "signup"}
                </ButtonText>
              </Button>
              <ThemedText>Already have an account?</ThemedText>
              <ThemedText
                className="text-typography-600"
                onPress={() => {
                  console.log("Navigating to login");
                  router.push("/login");
                }}
                style={{ textDecorationLine: "underline" }}
              >
                Login
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
    margin: 20,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  parentContainer: {
    flex: 1, // Take full available space
    alignItems: "center", // Center horizontally
    justifyContent: "center", // Center vertically
  },
  mainContainer: {
    margin: 30,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "30%", // Keep the 30% width
    // Replaced 'gap' with margin for compatibility (or use rowGap/columnGap in RN 0.71+)
    // If using RN 0.71+, you can use columnGap: 8 instead
  },
});
