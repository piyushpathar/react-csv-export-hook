import { useCallback } from "react";

/**
 * React Native specific wrapper for the CSV export hook.
 *
 * This is a lightweight wrapper around useCsvExport that provides
 * React Native specific utilities and better TypeScript support.
 *
 * @template T - The type of data objects to export. Must extend Record<string, unknown>.
 * @param data - An array of data objects to export, or null/undefined for empty state.
 * @returns An object with React Native specific CSV utilities.
 *
 * @example
 * ```tsx
 * import { useCsvExportNative } from 'react-csv-export-hook';
 *
 * function NativeComponent() {
 *   const data = [
 *     { name: 'John', age: 30, city: 'New York' },
 *     { name: 'Jane', age: 25, city: 'Los Angeles' }
 *   ];
 *
 *   const { csvString, shareOptions } = useCsvExportNative(data);
 *
 *   const handleShare = () => {
 *     // Copy to clipboard
 *     shareOptions.copyToClipboard();
 *
 *     // Or use with react-native-share (if installed)
 *     // shareOptions.shareWithLibrary();
 *   };
 *
 *   return <Button title="Share CSV" onPress={handleShare} />;
 * }
 * ```
 */
export const useCsvExportNative = <T extends Record<string, unknown>>(
  data: T[] | null | undefined
) => {
  const generateCsv = useCallback((): string => {
    if (!Array.isArray(data) || data?.length === 0) {
      console.warn("[useCsvExportNative] No valid data provided for export.");
      return "";
    }

    const headers = Object.keys(data?.[0] ?? {});
    if (headers.length === 0) {
      console.warn("[useCsvExportNative] Data objects have no keys to export.");
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

  const shareOptions = useCallback(
    () => ({
      // Copy to clipboard
      copyToClipboard: async () => {
        try {
          const csvString = generateCsv();
          if (csvString) {
            // Try to use react-native-clipboard if available
            if (typeof globalThis.ReactNativeClipboard !== "undefined") {
              await globalThis.ReactNativeClipboard.setString(csvString);
              console.log("[useCsvExportNative] CSV copied to clipboard");
            } else {
              console.log(
                "[useCsvExportNative] CSV string ready for clipboard:",
                csvString
              );
              console.log(
                "[useCsvExportNative] Install react-native-clipboard for clipboard support"
              );
            }
          }
        } catch (error) {
          console.error(
            "[useCsvExportNative] Failed to copy to clipboard:",
            error
          );
        }
      },

      // Share with react-native-share (if installed)
      shareWithLibrary: async () => {
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
            console.log(
              "[useCsvExportNative] react-native-share not available"
            );
            console.log(
              "[useCsvExportNative] Install react-native-share for sharing support"
            );
          }
        } catch (error) {
          console.error("[useCsvExportNative] Failed to share:", error);
        }
      },

      // Share with Expo Sharing (if using Expo)
      shareWithExpo: async () => {
        try {
          const csvString = generateCsv();
          if (csvString && typeof globalThis.ExpoSharing !== "undefined") {
            await globalThis.ExpoSharing.shareAsync(csvString, {
              mimeType: "text/csv",
              dialogTitle: "Export CSV",
            });
          } else {
            console.log("[useCsvExportNative] Expo Sharing not available");
            console.log(
              "[useCsvExportNative] Use Expo SDK for sharing support"
            );
          }
        } catch (error) {
          console.error(
            "[useCsvExportNative] Failed to share with Expo:",
            error
          );
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

  return {
    csvString: generateCsv(),
    shareOptions: shareOptions(),
  };
};
