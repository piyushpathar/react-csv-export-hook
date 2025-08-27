// Example Next.js API route for CSV export
// This file would be placed in: pages/api/export-csv.ts

import type { NextApiRequest, NextApiResponse } from "next";

// Simple CSV generation function (you could also use the hook in server components)
function generateCSV(data: any[]): string {
  if (!Array.isArray(data) || data.length === 0) {
    return "";
  }

  const headers = Object.keys(data[0]);
  const escapeCsvValue = (value: unknown): string => {
    let strValue = value != null ? String(value) : "";
    if (/[",\n]/.test(strValue)) {
      strValue = `"${strValue.replace(/"/g, '""')}"`;
    }
    return strValue;
  };

  const csvHeader = headers.map((header) => `"${header}"`).join(",") + "\n";
  const csvRows = data
    .map((row) => headers.map((h) => escapeCsvValue(row[h])).join(","))
    .join("\n");

  return csvHeader + csvRows;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed. Use POST.",
    });
  }

  try {
    const { data, fileName } = req.body;

    // Validate input
    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        message: "Invalid data. Must be a non-empty array.",
      });
    }

    if (!fileName || typeof fileName !== "string") {
      return res.status(400).json({
        message: "Invalid fileName. Must be a string.",
      });
    }

    // Generate CSV
    const csvString = generateCSV(data);

    if (!csvString) {
      return res.status(500).json({
        message: "Failed to generate CSV.",
      });
    }

    // Convert to buffer for response
    const buffer = Buffer.from(csvString, "utf-8");

    // Set response headers
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}.csv"`
    );
    res.setHeader("Content-Length", buffer.length.toString());

    // Optional: Add CORS headers if needed
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Send the CSV file
    res.status(200).send(buffer);
  } catch (error) {
    console.error("CSV export error:", error);
    res.status(500).json({
      message: "Internal server error during CSV generation.",
    });
  }
}

// Alternative: Edge Runtime compatible version
export const config = {
  runtime: "edge", // Enable Edge Runtime
};

// Edge Runtime handler (alternative to the above)
export async function edgeHandler(request: Request): Promise<Response> {
  try {
    const { data, fileName } = await request.json();

    // Validate input
    if (!data || !Array.isArray(data) || data.length === 0) {
      return new Response(
        JSON.stringify({ message: "Invalid data. Must be a non-empty array." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!fileName || typeof fileName !== "string") {
      return new Response(
        JSON.stringify({ message: "Invalid fileName. Must be a string." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate CSV
    const csvString = generateCSV(data);

    if (!csvString) {
      return new Response(
        JSON.stringify({ message: "Failed to generate CSV." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Convert to Uint8Array for Edge Runtime
    const buffer = new TextEncoder().encode(csvString);

    // Return CSV file
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}.csv"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Edge CSV export error:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error during CSV generation.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Example usage in a React component:
/*
import { useCsvExportNext } from 'react-csv-export-hook';

function CSVExporter() {
  const { downloadFromAPI } = useCsvExportNext(data, 'export');

  const handleExport = async () => {
    try {
      await downloadFromAPI('/api/export-csv', {
        method: 'POST',
        body: JSON.stringify({ 
          data: data, 
          fileName: 'export' 
        })
      });
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <button onClick={handleExport}>
      Export CSV via API
    </button>
  );
}
*/
