import { useCallback } from "react";

/**
 * Simple React Native CSV export hook.
 * Works in React Native and other environments.
 *
 * @template T - The type of data objects to export
 * @param data - Array of data objects to export
 * @returns Simple object with export functions
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
 *   const { copy, csvString, getBuffer } = useCsvExportNative(data);
 *
 *   return (
 *     <div>
 *       <Button title="Copy CSV" onPress={copy} />
 *       <Text>CSV: {csvString}</Text>
 *     </div>
 *   );
 * }
 * ```
 */
export const useCsvExportNative = <T extends Record<string, unknown>>(
  data: T[] | null | undefined
) => {
  // Simple CSV generation
  const generateCsv = useCallback((): string => {
    if (!Array.isArray(data) || data?.length === 0) {
      return "";
    }

    const headers = Object.keys(data[0]);
    if (headers.length === 0) {
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

  // Copy to clipboard - works everywhere
  const copy = useCallback(async () => {
    const csvString = generateCsv();
    if (!csvString) return;

    try {
      if (navigator.clipboard && typeof window !== "undefined") {
        await navigator.clipboard.writeText(csvString);
        console.log("CSV copied to clipboard!");
      } else {
        console.log("Clipboard not available. CSV string:", csvString);
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  }, [generateCsv]);

  // Get CSV as string - works everywhere
  const csvString = generateCsv();

  // Get CSV as buffer for server-side usage
  const getBuffer = useCallback((): Uint8Array | null => {
    const csvString = generateCsv();
    if (!csvString) return null;

    try {
      return new TextEncoder().encode(csvString);
    } catch (error) {
      console.error("Failed to create buffer:", error);
      return null;
    }
  }, [generateCsv]);

  return {
    copy, // Copy CSV to clipboard
    csvString, // Get CSV as string
    getBuffer, // Get CSV as buffer (for server-side)
  };
};
