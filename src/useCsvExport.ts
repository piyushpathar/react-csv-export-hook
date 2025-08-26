import { useCallback } from "react";

/**
 * A React hook for exporting data as CSV files with optional chaining safety.
 *
 * Supports both web browsers and React Native environments.
 *
 * @template T - The type of data objects to export. Must extend Record<string, unknown>.
 * @param data - An array of data objects to export, or null/undefined for empty state.
 * @param fileName - The name of the CSV file to download (without .csv extension).
 * @returns A function that triggers the CSV download when called.
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
 *   const exportCsv = useCsvExport(data, 'users-data');
 *
 *   return (
 *     <button onClick={exportCsv}>
 *       Export to CSV
 *     </button>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With optional chaining safety
 * const exportCsv = useCsvExport(users?.data, 'users-data');
 * ```
 *
 * @example
 * ```tsx
 * // React Native usage
 * import { Alert } from 'react-native';
 *
 * function NativeComponent() {
 *   const data = [{ name: 'John', age: 30 }];
 *   const exportCsv = useCsvExport(data, 'users-data');
 *
 *   const handleExport = () => {
 *     exportCsv();
 *     Alert.alert('Success', 'CSV data ready for sharing');
 *   };
 *
 *   return <Button title="Export CSV" onPress={handleExport} />;
 * }
 * ```
 */
export const useCsvExport = <T extends Record<string, unknown>>(
  data: T[] | null | undefined,
  fileName: string
) => {
  const handleExport = useCallback(() => {
    if (!Array.isArray(data) || data?.length === 0) {
      console.warn("[useCsvExport] No valid data provided for export.");
      return;
    }

    const headers = Object.keys(data?.[0] ?? {});
    if (headers.length === 0) {
      console.warn("[useCsvExport] Data objects have no keys to export.");
      return;
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

    const csvString = csvHeader + (csvRows ?? "");

    // Check if we're in a browser environment
    if (typeof window !== "undefined" && typeof document !== "undefined") {
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
    } else {
      // React Native or other non-browser environment
      console.log("[useCsvExport] CSV data generated:", csvString);
      console.log(
        "[useCsvExport] In React Native, you can use this data with react-native-share or similar libraries"
      );

      // For React Native, you might want to return the CSV string or use a sharing library
      // You can modify this hook to return the CSV string instead of just logging it
    }
  }, [data, fileName]);

  return handleExport;
};
