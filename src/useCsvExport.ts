import { useCallback } from "react";

/**
 * Simple and easy-to-use React hook for exporting data as CSV.
 * Works everywhere: Web, React Native, Next.js, Node.js, SSR.
 *
 * @template T - The type of data objects to export
 * @param data - Array of data objects to export
 * @param fileName - Name for the CSV file (without .csv extension)
 * @returns Simple object with export functions
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
 *   const { download, copy, csvString } = useCsvExport(data, 'users');
 *
 *   return (
 *     <div>
 *       <button onClick={download}>Download CSV</button>
 *       <button onClick={copy}>Copy to Clipboard</button>
 *       <p>CSV: {csvString}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const useCsvExport = <T extends Record<string, unknown>>(
  data: T[] | null | undefined,
  fileName: string
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

  // Simple download function - works in browsers
  const download = useCallback(() => {
    const csvString = generateCsv();
    if (!csvString) return;

    // Check if we're in a browser environment
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      try {
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${fileName || "export"}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Failed to download CSV:", error);
      }
    } else {
      console.log(
        "Download not available in this environment. CSV string:",
        csvString
      );
    }
  }, [generateCsv, fileName]);

  // Simple copy function - works everywhere
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
    download, // Download CSV file (browser only)
    copy, // Copy CSV to clipboard
    csvString, // Get CSV as string
    getBuffer, // Get CSV as buffer (for server-side)
  };
};
