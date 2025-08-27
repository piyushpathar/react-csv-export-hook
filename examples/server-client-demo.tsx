import React from "react";
import {
  useCsvExport,
  useCsvExportNext,
  useCsvExportNative,
} from "react-csv-export-hook";

// Example data
const sampleData = [
  { name: "John Doe", age: 30, city: "New York", salary: 75000 },
  { name: "Jane Smith", age: 25, city: "Los Angeles", salary: 65000 },
  { name: "Bob Johnson", age: 35, city: "Chicago", salary: 80000 },
  { name: "Alice Brown", age: 28, city: "Houston", salary: 70000 },
];

// Universal Hook Demo - Works everywhere
function UniversalHookDemo() {
  const {
    exportCsv,
    csvString,
    platform,
    environment,
    getCSVBuffer,
    getCSVBlob,
  } = useCsvExport(sampleData, "universal-export");

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>Universal Hook Demo</h3>
      <p>
        <strong>Platform:</strong> {platform}
      </p>
      <p>
        <strong>Environment:</strong>{" "}
        {environment.isClient ? "Client" : "Server"}
      </p>
      <p>
        <strong>Can Use DOM:</strong> {environment.canUseDOM ? "Yes" : "No"}
      </p>
      <p>
        <strong>Can Use File API:</strong>{" "}
        {environment.canUseFileAPI ? "Yes" : "No"}
      </p>

      {environment.canUseDOM && (
        <button
          onClick={exportCsv}
          style={{ margin: "10px", padding: "8px 16px" }}>
          Download CSV (Client Only)
        </button>
      )}

      {environment.isServer && (
        <div>
          <p>
            <strong>Server-side CSV:</strong>
          </p>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "10px",
              fontSize: "12px",
            }}>
            {csvString}
          </pre>
          <p>
            <strong>Buffer available:</strong> {getCSVBuffer() ? "Yes" : "No"}
          </p>
        </div>
      )}

      {environment.canUseFileAPI && (
        <div>
          <p>
            <strong>Blob available:</strong> {getCSVBlob() ? "Yes" : "No"}
          </p>
        </div>
      )}
    </div>
  );
}

// Next.js Hook Demo - Enhanced SSR support
function NextJSHookDemo() {
  const {
    exportCsv,
    csvString,
    isClient,
    isSSR,
    isReady,
    downloadFromAPI,
    getCSVBuffer,
    environment,
  } = useCsvExportNext(sampleData, "nextjs-export");

  const handleAPIDownload = async () => {
    try {
      await downloadFromAPI("/api/export-csv", {
        method: "POST",
        body: JSON.stringify({
          data: sampleData,
          fileName: "nextjs-export",
        }),
      });
    } catch (error) {
      console.error("API download failed:", error);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #blue", margin: "10px" }}>
      <h3>Next.js Hook Demo</h3>
      <p>
        <strong>Client:</strong> {isClient ? "Yes" : "No"}
      </p>
      <p>
        <strong>SSR:</strong> {isSSR ? "Yes" : "No"}
      </p>
      <p>
        <strong>Ready:</strong> {isReady ? "Yes" : "No"}
      </p>
      <p>
        <strong>Environment:</strong>{" "}
        {environment.isClient ? "Client" : "Server"}
      </p>

      {isSSR && <p style={{ color: "orange" }}>🔄 Server-side rendering...</p>}

      {isReady && (
        <div>
          <button
            onClick={exportCsv}
            style={{ margin: "10px", padding: "8px 16px" }}>
            Download CSV
          </button>
          <button
            onClick={handleAPIDownload}
            style={{ margin: "10px", padding: "8px 16px" }}>
            Download via API
          </button>
        </div>
      )}

      {isReady && (
        <div>
          <p>
            <strong>CSV String:</strong>
          </p>
          <pre
            style={{
              background: "#f0f8ff",
              padding: "10px",
              fontSize: "12px",
            }}>
            {csvString}
          </pre>
          <p>
            <strong>Buffer available:</strong> {getCSVBuffer() ? "Yes" : "No"}
          </p>
        </div>
      )}
    </div>
  );
}

// React Native Hook Demo - Mobile optimized
function ReactNativeHookDemo() {
  const { csvString, shareOptions, environment, isReady, platform } =
    useCsvExportNative(sampleData);

  const handleCopyToClipboard = async () => {
    try {
      await shareOptions.copyToClipboard();
      alert("CSV copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const handleShare = async () => {
    try {
      await shareOptions.shareWithLibrary();
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #green", margin: "10px" }}>
      <h3>React Native Hook Demo</h3>
      <p>
        <strong>Platform:</strong> {platform}
      </p>
      <p>
        <strong>Ready:</strong> {isReady ? "Yes" : "No"}
      </p>
      <p>
        <strong>Environment:</strong>{" "}
        {environment.isClient ? "Client" : "Server"}
      </p>
      <p>
        <strong>Is React Native:</strong>{" "}
        {environment.isReactNative ? "Yes" : "No"}
      </p>

      {isReady && (
        <div>
          <button
            onClick={handleCopyToClipboard}
            style={{ margin: "10px", padding: "8px 16px" }}>
            Copy to Clipboard
          </button>
          <button
            onClick={handleShare}
            style={{ margin: "10px", padding: "8px 16px" }}>
            Share CSV
          </button>
        </div>
      )}

      <div>
        <p>
          <strong>CSV String:</strong>
        </p>
        <pre
          style={{ background: "#f0fff0", padding: "10px", fontSize: "12px" }}>
          {csvString}
        </pre>
        <p>
          <strong>Data URL:</strong> {shareOptions.getDataUrl()}
        </p>
        <p>
          <strong>Buffer available:</strong>{" "}
          {shareOptions.getBuffer() ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
}

// Server Component Demo - Shows server-side usage
function ServerComponentDemo() {
  const { csvString, getCSVBuffer, platform, environment } = useCsvExport(
    sampleData,
    "server-export"
  );

  // This would run on the server in Next.js
  const serverSideProcessing = () => {
    if (environment.isServer) {
      const buffer = getCSVBuffer();
      console.log("Server-side buffer created:", buffer);
      return buffer;
    }
    return null;
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #purple", margin: "10px" }}>
      <h3>Server Component Demo</h3>
      <p>
        <strong>Platform:</strong> {platform}
      </p>
      <p>
        <strong>Environment:</strong>{" "}
        {environment.isServer ? "Server" : "Client"}
      </p>
      <p>
        <strong>Can Use DOM:</strong> {environment.canUseDOM ? "Yes" : "No"}
      </p>

      <div>
        <p>
          <strong>Server-side CSV:</strong>
        </p>
        <pre
          style={{ background: "#faf0ff", padding: "10px", fontSize: "12px" }}>
          {csvString}
        </pre>
        <p>
          <strong>Buffer available:</strong> {getCSVBuffer() ? "Yes" : "No"}
        </p>
        <p>
          <strong>Server processing result:</strong>{" "}
          {serverSideProcessing() ? "Buffer created" : "Not on server"}
        </p>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>
        React CSV Export Hook - Server/Client Compatibility Demo
      </h1>

      <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
        This demo showcases the enhanced server/client compatibility features
      </p>

      <UniversalHookDemo />
      <NextJSHookDemo />
      <ReactNativeHookDemo />
      <ServerComponentDemo />

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#f9f9f9",
          borderRadius: "8px",
        }}>
        <h3>Key Features Demonstrated:</h3>
        <ul>
          <li>
            <strong>Universal Compatibility:</strong> Works on Web, React
            Native, Next.js, Node.js, Edge Runtime
          </li>
          <li>
            <strong>SSR Safe:</strong> No DOM access during server-side
            rendering
          </li>
          <li>
            <strong>Environment Detection:</strong> Automatically adapts to
            runtime environment
          </li>
          <li>
            <strong>Server Utilities:</strong> Buffer generation for server-side
            processing
          </li>
          <li>
            <strong>Hydration Aware:</strong> Waits for client hydration before
            DOM operations
          </li>
          <li>
            <strong>Type Safe:</strong> Full TypeScript support with proper type
            guards
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
