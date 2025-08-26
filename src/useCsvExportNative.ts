import { useCallback } from "react";

/**
 * A React Native specific version of the CSV export hook.
 *
 * This hook returns the CSV string instead of triggering a download,
 * allowing you to use it with React Native sharing libraries.
 *
 * @template T - The type of data objects to export. Must extend Record<string, unknown>.
 * @param data - An array of data objects to export, or null/undefined for empty state.
 * @returns A function that returns the CSV string when called.
 *
 * @example
 * ```tsx
 * import { useCsvExportNative } from 'react-csv-export-hook';
 * import Share from 'react-native-share';
 *
 * function NativeComponent() {
 *   const data = [
 *     { name: 'John', age: 30, city: 'New York' },
 *     { name: 'Jane', age: 25, city: 'Los Angeles' }
 *   ];
 *
 *   const getCsvString = useCsvExportNative(data);
 *
 *   const handleShare = async () => {
 *     try {
 *       const csvString = getCsvString();
 *       await Share.open({
 *         title: 'Export CSV',
 *         message: 'Share your data as CSV',
 *         url: `data:text/csv;base64,${Buffer.from(csvString).toString('base64')}`,
 *         type: 'text/csv'
 *       });
 *     } catch (error) {
 *       console.error('Error sharing CSV:', error);
 *     }
 *   };
 *
 *   return <Button title="Share CSV" onPress={handleShare} />;
 * }
 * ```
 */
export const useCsvExportNative = <T extends Record<string, unknown>>(
  data: T[] | null | undefined
) => {
  const getCsvString = useCallback((): string => {
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

  return getCsvString;
};
