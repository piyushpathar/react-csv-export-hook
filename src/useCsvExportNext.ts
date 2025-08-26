import { useCallback, useEffect, useState } from "react";

/**
 * Next.js specific CSV export hook with enhanced SSR support.
 *
 * This hook provides Next.js specific functionality:
 * - Safe SSR handling
 * - Client-side hydration support
 * - Next.js specific optimizations
 * - API route integration support
 *
 * @template T - The type of data objects to export. Must extend Record<string, unknown>.
 * @param data - An array of data objects to export, or null/undefined for empty state.
 * @param fileName - The name of the CSV file (without .csv extension).
 * @returns An object with Next.js specific CSV utilities and SSR-safe functions.
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
 *   const { exportCsv, csvString, isClient, isSSR } = useCsvExportNext(data, 'users-data');
 *
 *   return (
 *     <div>
 *       {isSSR && <p>Loading...</p>}
 *       {isClient && (
 *         <button onClick={exportCsv}>
 *           Export to CSV
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With API route integration
 * function APIIntegration() {
 *   const { csvString, downloadFromAPI } = useCsvExportNext(data, 'users-data');
 *
 *   const handleDownload = async () => {
 *     await downloadFromAPI('/api/export-csv', {
 *       method: 'POST',
 *       body: JSON.stringify({ data, fileName: 'users-data' })
 *     });
 *   };
 *
 *   return <button onClick={handleDownload}>Download via API</button>;
 * }
 * ```
 */
export const useCsvExportNext = <T extends Record<string, unknown>>(
  data: T[] | null | undefined,
  fileName: string
) => {
  const [isClient, setIsClient] = useState(false);
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsClient(true);
    setIsSSR(false);
  }, []);

  const generateCsv = useCallback((): string => {
    if (!Array.isArray(data) || data?.length === 0) {
      console.warn("[useCsvExportNext] No valid data provided for export.");
      return "";
    }

    const headers = Object.keys(data?.[0] ?? {});
    if (headers.length === 0) {
      console.warn("[useCsvExportNext] Data objects have no keys to export.");
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
    if (!isClient) {
      console.warn("[useCsvExportNext] exportCsv called during SSR");
      return;
    }

    const csvString = generateCsv();
    if (!csvString) return;

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
      console.error("[useCsvExportNext] Failed to export CSV:", error);
    }
  }, [generateCsv, fileName, isClient]);

  const downloadFromAPI = useCallback(
    async (apiRoute: string, options: RequestInit = {}) => {
      if (!isClient) {
        console.warn("[useCsvExportNext] downloadFromAPI called during SSR");
        return;
      }

      try {
        const response = await fetch(apiRoute, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          body: JSON.stringify({
            data,
            fileName: fileName || "export.csv",
          }),
          ...options,
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName || "export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("[useCsvExportNext] Failed to download from API:", error);
      }
    },
    [data, fileName, isClient]
  );

  const getCSVForAPI = useCallback(() => {
    const csvString = generateCsv();
    return {
      csvString,
      headers: data?.[0] ? Object.keys(data[0]) : [],
      rowCount: data?.length || 0,
      fileName: fileName || "export.csv",
    };
  }, [generateCsv, data, fileName]);

  return {
    exportCsv,
    csvString: generateCsv(),
    isClient,
    isSSR,
    downloadFromAPI,
    getCSVForAPI,
    platform: "nextjs",
  };
};
