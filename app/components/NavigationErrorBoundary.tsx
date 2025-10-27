import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text } from "react-native";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class NavigationErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      "Navigation Error Boundary caught an error:",
      error,
      errorInfo
    );
  }

  public render() {
    if (this.state.hasError) {
      // Check if it's a navigation context error
      if (this.state.error?.message.includes("navigation context")) {
        // Return a loading state instead of crashing
        return (
          <View className="flex-1 bg-slate-900 justify-center items-center">
            <Text className="text-slate-400 text-center">
              Initializing navigation...
            </Text>
          </View>
        );
      }

      // For other errors, show fallback or default error UI
      return (
        this.props.fallback || (
          <View className="flex-1 bg-slate-900 justify-center items-center">
            <Text className="text-red-400 text-center">
              Something went wrong
            </Text>
          </View>
        )
      );
    }

    return this.props.children;
  }
}

export default NavigationErrorBoundary;
