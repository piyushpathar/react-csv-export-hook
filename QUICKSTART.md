# Quick Start Guide

## 🚀 Get Started in 3 Lines!

```tsx
import { useCsvExport } from 'react-csv-export-hook';

const { download, copy, csvString } = useCsvExport(data, 'filename');

<button onClick={download}>Download CSV</button>
```

## 📋 What You Get

```tsx
const { download, copy, csvString, getBuffer } = useCsvExport(data, 'users');
```

- **`download()`** - Downloads CSV file (browser only)
- **`copy()`** - Copies CSV to clipboard
- **`csvString`** - Generated CSV string
- **`getBuffer()`** - Returns buffer for server-side usage

## 🎯 Basic Examples

### Download CSV
```tsx
const { download } = useCsvExport(data, 'export');
<button onClick={download}>Download CSV</button>
```

### Copy to Clipboard
```tsx
const { copy } = useCsvExport(data, 'export');
<button onClick={copy}>Copy CSV</button>
```

### Get CSV String
```tsx
const { csvString } = useCsvExport(data, 'export');
<p>CSV: {csvString}</p>
```

### Server-Side Buffer
```tsx
const { getBuffer } = useCsvExport(data, 'export');
const buffer = getBuffer(); // Use in API response
```

## 🌍 Works Everywhere

- ✅ **Web Browsers** - Full download & copy support
- ✅ **React Native** - Copy & string support
- ✅ **Next.js** - SSR safe with hydration
- ✅ **Node.js** - Server-side buffer generation
- ✅ **Edge Runtime** - Universal compatibility

## 🔧 Platform-Specific Hooks

### Next.js (with SSR)
```tsx
import { useCsvExportNext } from 'react-csv-export-hook';

const { download, copy, isReady } = useCsvExportNext(data, 'export');

{!isReady && <p>Loading...</p>}
{isReady && <button onClick={download}>Download</button>}
```

### React Native
```tsx
import { useCsvExportNative } from 'react-csv-export-hook';

const { copy, csvString } = useCsvExportNative(data);

<Button title="Copy CSV" onPress={copy} />
```

## 📊 Data Format

Your data should be an array of objects:

```tsx
const data = [
  { name: 'John', age: 30, city: 'New York' },
  { name: 'Jane', age: 25, city: 'Los Angeles' },
  { name: 'Bob', age: 35, city: 'Chicago' }
];

const { download } = useCsvExport(data, 'users');
// Creates: users.csv with headers: name, age, city
```

## 🎨 Complete Example

```tsx
import React, { useState } from 'react';
import { useCsvExport } from 'react-csv-export-hook';

function CSVExporter() {
  const [data, setData] = useState([
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' }
  ]);

  const { download, copy, csvString } = useCsvExport(data, 'users');

  return (
    <div>
      <h2>Export Users</h2>
      <p>Total users: {data.length}</p>
      
      <button onClick={download}>
        Download CSV ({data.length} users)
      </button>
      
      <button onClick={copy}>
        Copy to Clipboard
      </button>
      
      <details>
        <summary>Preview CSV</summary>
        <pre>{csvString}</pre>
      </details>
    </div>
  );
}
```

## 🚨 Common Issues

### "Download not working"
- Make sure you're in a browser environment
- Check if data is not empty
- Verify the button is not disabled

### "Copy not working"
- Check if clipboard API is available
- Make sure data is not empty
- Try in a secure context (HTTPS)

### "CSV string is empty"
- Verify data is an array
- Check if data has objects with properties
- Ensure data is not null/undefined

## 🎉 That's It!

The library is designed to be **simple and intuitive**. No complex configuration, no environment detection, just straightforward CSV export functionality that works everywhere.

**Need help?** Check the main README or open an issue! 🚀
