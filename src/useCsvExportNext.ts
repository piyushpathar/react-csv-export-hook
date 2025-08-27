import { useCallback, useEffect, useState } from "react";

/**
 * Simple Next.js CSV export hook with SSR support.
 * Works in both client and server environments.
 *
 * @template T - The type of data objects to export
 * @param data - Array of data objects to export
 * @param fileName - Name for the CSV file (without .csv extension)
 * @returns Simple object with export functions and SSR status
 *
 * @example
 * ```tsx
 * import { useCsvExportNext } from 'react-csv-export-hook';
 *
 * function NextJSComponent() {
 *   const data = [
 *     { name: 'John', age: 30, city: 'New York' },
 *     { name: 'Jane', age: 25, city: 'Los Angeles' }
 *   ];
 *
 *   const { download, copy, csvString, isReady } = useCsvExportNext(data, 'users');
 *
 *   return (
 *     <div>
 *       {!isReady && <p>Loading...</p>}
 *       {isReady && (
 *         <>
 *           <button onClick={download}>Download CSV</button>
 *           <button onClick={copy}>Copy to Clipboard</button>
 *         </>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useCsvExportNext = <T extends Record<string, unknown>>(
  data: T[] | null | undefined,
  fileName: string
) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

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

  // Download function - works in browsers
  const download = useCallback(() => {
    if (!isReady) return;

    const csvString = generateCsv();
    if (!csvString) return;

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
    }
  }, [generateCsv, fileName, isReady]);

  // Copy function - works everywhere
  const copy = useCallback(async () => {
    if (!isReady) return;

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
  }, [generateCsv, isReady]);

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
    download, // Download CSV file (browser only, after hydration)
    copy, // Copy CSV to clipboard (after hydration)
    csvString, // Get CSV as string (works everywhere)
    getBuffer, // Get CSV as buffer (for server-side)
    isReady, // True when hydrated and ready
  };
};
