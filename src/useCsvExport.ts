import { useCallback } from "react";

// Type declarations for global objects
declare global {
  var global:
    | {
        navigator?: {
          product?: string;
        };
      }
    | undefined;

  var ReactNativeClipboard:
    | {
        setString: (text: string) => Promise<void>;
      }
    | undefined;

  var ReactNativeShare:
    | {
        open: (options: any) => Promise<void>;
      }
    | undefined;

  var ExpoSharing:
    | {
        shareAsync: (content: string, options: any) => Promise<void>;
      }
    | undefined;
}

// Extend Window interface for Next.js
declare global {
  interface Window {
    __NEXT_DATA__?: any;
  }
}

// Platform detection utilities
const isWeb = typeof window !== "undefined" && typeof document !== "undefined";
const isReactNative =
  typeof global !== "undefined" && global?.navigator?.product === "ReactNative";
const isNextJS = typeof window !== "undefined" && window.__NEXT_DATA__;
const isSSR = typeof window === "undefined";

/**
 * Universal React hook for exporting data as CSV with cross-platform support.
 *
 * Automatically detects the environment and provides appropriate functionality:
 * - Web browsers: Downloads CSV file automatically
 * - React Native: Returns CSV string for sharing
 * - Next.js: Works in both client and server environments
 * - SSR: Safely handles server-side rendering
 *
 * @template T - The type of data objects to export. Must extend Record<string, unknown>.
 * @param data - An array of data objects to export, or null/undefined for empty state.
 * @param fileName - The name of the CSV file (without .csv extension).
 * @returns An object with platform-specific export functions and utilities.
 *
 * @example
 * ```tsx
 * import { useCsvExport } from 'react-csv-export-hook';
 *
 * function MyComponent() {
 *   const data = [
 *     { name: 'John', age: 30, city: 'New York' },
 *     { name: 'Jane', age: 25, city: 'Los Angeles' }
 *   ];
 *
 *   const { exportCsv, csvString, platform } = useCsvExport(data, 'users-data');
 *
 *   return (
 *     <div>
 *       <p>Platform: {platform}</p>
 *       <button onClick={exportCsv}>
 *         Export to CSV
 *       </button>
 *       {platform === 'react-native' && (
 *         <p>CSV ready for sharing: {csvString}</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With optional chaining safety
 * function UserList({ users }) {
 *   const { exportCsv, csvString } = useCsvExport(users?.data, 'users-export');
 *
 *   return (
 *     <div>
 *       {users?.data && (
 *         <button onClick={exportCsv}>
 *           Export {users.data.length} users
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // React Native usage
 * import { Alert } from 'react-native';
 *
 * function NativeComponent() {
 *   const data = [{ name: 'John', age: 30 }];
 *   const { exportCsv, csvString, shareOptions } = useCsvExport(data, 'users-data');
 *
 *   const handleExport = () => {
 *     exportCsv();
 *     Alert.alert('Success', 'CSV data ready for sharing');
 *   };
 *
 *   return (
 *     <div>
 *       <Button title="Export CSV" onPress={handleExport} />
 *       <Button title="Copy to Clipboard" onPress={() => shareOptions.copyToClipboard()} />
 *     </div>
 *   );
 * }
 * ```
 */
export const useCsvExport = <T extends Record<string, unknown>>(
  data: T[] | null | undefined,
  fileName: string
) => {
  const generateCsv = useCallback((): string => {
    if (!Array.isArray(data) || data?.length === 0) {
      console.warn("[useCsvExport] No valid data provided for export.");
      return "";
    }

    const headers = Object.keys(data?.[0] ?? {});
    if (headers.length === 0) {
      console.warn("[useCsvExport] Data objects have no keys to export.");
      return "";
    }

    const escapeCsvValue = (value: unknown): string => {
      let strValue = value != null ? String(value) : "";
      if (/[",\n]/.test(strValue)) {
        strValue = `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    };

    const csvHeader = headers.map((header) => `"${header}"`).join(",") + "\n";
    const csvRows = data
      ?.map((row) => headers.map((h) => escapeCsvValue(row?.[h])).join(","))
      .join("\n");

    return csvHeader + (csvRows ?? "");
  }, [data]);

  const exportCsv = useCallback(() => {
    const csvString = generateCsv();
    if (!csvString) return;

    if (isWeb && !isSSR) {
      // Web browser environment
      try {
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName || "export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("[useCsvExport] Failed to export CSV:", error);
      }
    } else if (isReactNative) {
      // React Native environment
      console.log(
        "[useCsvExport] CSV data generated for React Native:",
        csvString
      );
      console.log("[useCsvExport] Use shareOptions for sharing functionality");
    } else if (isSSR) {
      // Server-side rendering
      console.log("[useCsvExport] CSV generated on server:", csvString);
      console.log("[useCsvExport] Use csvString for server-side processing");
    } else {
      // Other environments
      console.log("[useCsvExport] CSV data generated:", csvString);
    }
  }, [generateCsv, fileName]);

  const shareOptions = useCallback(
    () => ({
      // Copy to clipboard (React Native)
      copyToClipboard: async () => {
        if (!isReactNative) {
          console.warn(
            "[useCsvExport] copyToClipboard only works in React Native"
          );
          return;
        }

        try {
          const csvString = generateCsv();
          if (csvString) {
            // Try to use react-native-clipboard if available
            if (typeof globalThis.ReactNativeClipboard !== "undefined") {
              await globalThis.ReactNativeClipboard.setString(csvString);
              console.log("[useCsvExport] CSV copied to clipboard");
            } else {
              console.log(
                "[useCsvExport] CSV string ready for clipboard:",
                csvString
              );
              console.log(
                "[useCsvExport] Install react-native-clipboard for clipboard support"
              );
            }
          }
        } catch (error) {
          console.error("[useCsvExport] Failed to copy to clipboard:", error);
        }
      },

      // Share with react-native-share (if installed)
      shareWithLibrary: async () => {
        if (!isReactNative) {
          console.warn(
            "[useCsvExport] shareWithLibrary only works in React Native"
          );
          return;
        }

        try {
          const csvString = generateCsv();
          if (csvString && typeof globalThis.ReactNativeShare !== "undefined") {
            await globalThis.ReactNativeShare.open({
              title: "Export CSV",
              message: "Share your data as CSV",
              url: `data:text/csv;base64,${btoa(csvString)}`,
              type: "text/csv",
            });
          } else {
            console.log("[useCsvExport] react-native-share not available");
            console.log(
              "[useCsvExport] Install react-native-share for sharing support"
            );
          }
        } catch (error) {
          console.error("[useCsvExport] Failed to share:", error);
        }
      },

      // Share with Expo Sharing (if using Expo)
      shareWithExpo: async () => {
        if (!isReactNative) {
          console.warn(
            "[useCsvExport] shareWithExpo only works in React Native"
          );
          return;
        }

        try {
          const csvString = generateCsv();
          if (csvString && typeof globalThis.ExpoSharing !== "undefined") {
            await globalThis.ExpoSharing.shareAsync(csvString, {
              mimeType: "text/csv",
              dialogTitle: "Export CSV",
            });
          } else {
            console.log("[useCsvExport] Expo Sharing not available");
            console.log("[useCsvExport] Use Expo SDK for sharing support");
          }
        } catch (error) {
          console.error("[useCsvExport] Failed to share with Expo:", error);
        }
      },

      // Get base64 encoded data URL
      getDataUrl: (): string => {
        const csvString = generateCsv();
        if (csvString) {
          return `data:text/csv;base64,${btoa(csvString)}`;
        }
        return "";
      },

      // Get raw CSV string
      getString: (): string => generateCsv(),
    }),
    [generateCsv]
  );

  // Determine platform
  const platform = isSSR
    ? "ssr"
    : isReactNative
    ? "react-native"
    : isNextJS
    ? "nextjs"
    : "web";

  return {
    exportCsv,
    csvString: generateCsv(),
    platform,
    shareOptions: shareOptions(),
    isWeb,
    isReactNative,
    isNextJS,
    isSSR,
  };
};
