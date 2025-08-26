import { useCallback } from "react";

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
  }, [data, fileName]);

  return handleExport;
};
