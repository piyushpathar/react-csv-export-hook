import React from "react";
import {
  useCsvExport,
  useCsvExportNext,
  useCsvExportNative,
} from "react-csv-export-hook";

// Sample data
const sampleData = [
  { name: "John Doe", age: 30, city: "New York", salary: 75000 },
  { name: "Jane Smith", age: 25, city: "Los Angeles", salary: 65000 },
  { name: "Bob Johnson", age: 35, city: "Chicago", salary: 80000 },
];

// Simple usage - works everywhere
function SimpleComponent() {
  const { download, copy, csvString } = useCsvExport(sampleData, "users");

  return (
    <div>
      <h3>Simple CSV Export</h3>
      <button onClick={download}>Download CSV</button>
      <button onClick={copy}>Copy to Clipboard</button>
      <p>CSV String: {csvString}</p>
    </div>
  );
}

// Next.js usage - with SSR support
function NextJSComponent() {
  const { download, copy, csvString, isReady } = useCsvExportNext(
    sampleData,
    "users"
  );

  return (
    <div>
      <h3>Next.js CSV Export</h3>
      {!isReady && <p>Loading...</p>}
      {isReady && (
        <>
          <button onClick={download}>Download CSV</button>
          <button onClick={copy}>Copy to Clipboard</button>
        </>
      )}
      <p>CSV String: {csvString}</p>
    </div>
  );
}

// React Native usage
function ReactNativeComponent() {
  const { copy, csvString } = useCsvExportNative(sampleData);

  return (
    <div>
      <h3>React Native CSV Export</h3>
      <button onClick={copy}>Copy to Clipboard</button>
      <p>CSV String: {csvString}</p>
    </div>
  );
}

// Server-side usage
function ServerComponent() {
  const { csvString, getBuffer } = useCsvExport(sampleData, "users");

  // This would run on the server
  const handleServerExport = () => {
    const buffer = getBuffer();
    if (buffer) {
      console.log("Server-side buffer created:", buffer);
      // Use buffer in API response or save to file
    }
  };

  return (
    <div>
      <h3>Server Component</h3>
      <button onClick={handleServerExport}>Create Server Buffer</button>
      <p>CSV String: {csvString}</p>
    </div>
  );
}

// Main App
function App() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}>
      <h1 style={{ textAlign: "center" }}>Simple CSV Export Examples</h1>

      <SimpleComponent />
      <hr />
      <NextJSComponent />
      <hr />
      <ReactNativeComponent />
      <hr />
      <ServerComponent />

      <div
        style={{ marginTop: "30px", padding: "20px", background: "#f9f9f9" }}>
        <h3>How to Use:</h3>
        <ol>
          <li>
            <strong>Import:</strong>{" "}
            <code>import {useCsvExport} from 'react-csv-export-hook'</code>
          </li>
          <li>
            <strong>Use:</strong>{" "}
            <code>
              const {(download, copy, csvString)} = useCsvExport(data,
              'filename')
            </code>
          </li>
          <li>
            <strong>Download:</strong>{" "}
            <code>
              &lt;button onClick={download}&gt;Download CSV&lt;/button&gt;
            </code>
          </li>
          <li>
            <strong>Copy:</strong>{" "}
            <code>
              &lt;button onClick={copy}&gt;Copy to Clipboard&lt;/button&gt;
            </code>
          </li>
          <li>
            <strong>String:</strong> <code>&lt;p&gt;{csvString}&lt;/p&gt;</code>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default App;
