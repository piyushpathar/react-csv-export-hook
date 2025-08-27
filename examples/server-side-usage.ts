// Server-side usage examples for the enhanced CSV export hook
// This demonstrates how the hooks work in server environments

// Example 1: Node.js server usage
export function nodeServerExample() {
  // In a real Node.js environment, you would import the hook
  // import { useCsvExport } from 'react-csv-export-hook';

  const sampleData = [
    { name: "John Doe", age: 30, city: "New York" },
    { name: "Jane Smith", age: 25, city: "Los Angeles" },
  ];

  // Simulate the hook's server-side behavior
  const generateCSV = (data: any[]): string => {
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
  };

  const csvString = generateCSV(sampleData);

  // In Node.js, you can create a Buffer
  const buffer = Buffer.from(csvString, "utf-8");

  console.log("Node.js CSV generated:", {
    csvString,
    bufferLength: buffer.length,
    platform: "node",
  });

  return {
    csvString,
    buffer,
    platform: "node",
  };
}

// Example 2: Edge Runtime usage
export function edgeRuntimeExample() {
  const sampleData = [
    { name: "John Doe", age: 30, city: "New York" },
    { name: "Jane Smith", age: 25, city: "Los Angeles" },
  ];

  const generateCSV = (data: any[]): string => {
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
  };

  const csvString = generateCSV(sampleData);

  // In Edge Runtime, use TextEncoder for Uint8Array
  const buffer = new TextEncoder().encode(csvString);

  console.log("Edge Runtime CSV generated:", {
    csvString,
    bufferLength: buffer.length,
    platform: "edge",
  });

  return {
    csvString,
    buffer,
    platform: "edge",
  };
}

// Example 3: Deno usage
export function denoExample() {
  const sampleData = [
    { name: "John Doe", age: 30, city: "New York" },
    { name: "Jane Smith", age: 25, city: "Los Angeles" },
  ];

  const generateCSV = (data: any[]): string => {
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
  };

  const csvString = generateCSV(sampleData);

  // In Deno, use TextEncoder for Uint8Array
  const buffer = new TextEncoder().encode(csvString);

  console.log("Deno CSV generated:", {
    csvString,
    bufferLength: buffer.length,
    platform: "deno",
  });

  return {
    csvString,
    buffer,
    platform: "deno",
  };
}

// Example 4: Server-side rendering (SSR) usage
export function ssrExample() {
  const sampleData = [
    { name: "John Doe", age: 30, city: "New York" },
    { name: "Jane Smith", age: 25, city: "Los Angeles" },
  ];

  const generateCSV = (data: any[]): string => {
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
  };

  const csvString = generateCSV(sampleData);

  console.log("SSR CSV generated:", {
    csvString,
    platform: "ssr",
    note: "No DOM access, CSV string ready for server-side processing",
  });

  return {
    csvString,
    platform: "ssr",
  };
}

// Example 5: Environment detection utility
export function detectEnvironment() {
  const isWeb =
    typeof window !== "undefined" && typeof document !== "undefined";
  const isReactNative =
    typeof global !== "undefined" &&
    global?.navigator?.product === "ReactNative";
  const isNextJS =
    typeof window !== "undefined" && (window as any).__NEXT_DATA__;
  const isSSR = typeof window === "undefined";
  const isNode =
    typeof process !== "undefined" && process.versions && process.versions.node;
  const isDeno = typeof Deno !== "undefined";
  const isEdge = typeof EdgeRuntime !== "undefined";

  const platform = isSSR
    ? "ssr"
    : isNode
    ? "node"
    : isDeno
    ? "deno"
    : isEdge
    ? "edge"
    : isReactNative
    ? "react-native"
    : isNextJS
    ? "nextjs"
    : "web";

  const environment = {
    isClient: !isSSR,
    isServer: isSSR || isNode || isDeno || isEdge,
    canUseDOM: isWeb && !isSSR,
    canUseFileAPI: isWeb && !isSSR,
    platform,
  };

  console.log("Environment detected:", environment);

  return environment;
}

// Example 6: Safe CSV generation for any environment
export function safeCSVGeneration(data: any[], fileName: string) {
  const environment = detectEnvironment();

  const generateCSV = (data: any[]): string => {
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
  };

  const csvString = generateCSV(data);

  let buffer: Buffer | Uint8Array | null = null;

  if (environment.platform === "node") {
    // Node.js environment
    buffer = Buffer.from(csvString, "utf-8");
  } else if (
    environment.platform === "edge" ||
    environment.platform === "deno"
  ) {
    // Edge Runtime or Deno
    buffer = new TextEncoder().encode(csvString);
  }

  return {
    csvString,
    buffer,
    environment,
    fileName: `${fileName}.csv`,
    contentType: "text/csv; charset=utf-8",
  };
}

// Run examples
if (typeof window === "undefined") {
  // Server-side execution
  console.log("=== Server-Side CSV Export Examples ===\n");

  nodeServerExample();
  console.log("");

  edgeRuntimeExample();
  console.log("");

  denoExample();
  console.log("");

  ssrExample();
  console.log("");

  detectEnvironment();
  console.log("");

  const result = safeCSVGeneration(
    [{ name: "Test User", age: 25, city: "Test City" }],
    "test-export"
  );

  console.log("Safe CSV generation result:", result);
}
