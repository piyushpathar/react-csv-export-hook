# React CSV Export Hook

A simple and easy-to-use React hook for exporting data as CSV. Works everywhere: Web, React Native, Next.js, Node.js, SSR.

## 🌟 Features

- **Simple API**: Just 3 functions: `download`, `copy`, `csvString`
- **Universal**: Works on Web, React Native, Next.js, Node.js, Edge Runtime, SSR
- **Zero Dependencies**: Lightweight with no external packages
- **TypeScript**: Full type safety and IntelliSense support
- **SSR Safe**: Works in server-side rendering environments

## 🚀 Installation

```bash
npm install react-csv-export-hook
# or
yarn add react-csv-export-hook
# or
pnpm add react-csv-export-hook
```

## 📖 Usage

### Basic Usage (3 lines of code!)

```tsx
import { useCsvExport } from 'react-csv-export-hook';

function MyComponent() {
  const data = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' }
  ];

  const { download, copy, csvString } = useCsvExport(data, 'users');

  return (
    <div>
      <button onClick={download}>Download CSV</button>
      <button onClick={copy}>Copy to Clipboard</button>
      <p>CSV: {csvString}</p>
    </div>
  );
}
```

That's it! 🎉

### Next.js with SSR Support

```tsx
import { useCsvExportNext } from 'react-csv-export-hook';

function NextJSComponent() {
  const data = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' }
  ];

  const { download, copy, csvString, isReady } = useCsvExportNext(data, 'users');

  return (
    <div>
      {!isReady && <p>Loading...</p>}
      {isReady && (
        <>
          <button onClick={download}>Download CSV</button>
          <button onClick={copy}>Copy to Clipboard</button>
        </>
      )}
      <p>CSV: {csvString}</p>
    </div>
  );
}
```

### React Native

```tsx
import { useCsvExportNative } from 'react-csv-export-hook';

function NativeComponent() {
  const data = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' }
  ];

  const { copy, csvString } = useCsvExportNative(data);

  return (
    <div>
      <Button title="Copy CSV" onPress={copy} />
      <Text>CSV: {csvString}</Text>
    </div>
  );
}
```

### Server-Side Usage

```tsx
import { useCsvExport } from 'react-csv-export-hook';

function ServerComponent() {
  const data = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' }
  ];

  const { csvString, getBuffer } = useCsvExport(data, 'users');

  // Use in server environments
  const handleServerExport = () => {
    const buffer = getBuffer();
    if (buffer) {
      // Send as response or save to file
      console.log('Server buffer created:', buffer);
    }
  };

  return (
    <div>
      <button onClick={handleServerExport}>Create Server Buffer</button>
      <p>CSV: {csvString}</p>
    </div>
  );
}
```

## 🔧 API Reference

### `useCsvExport(data, fileName)` - Universal Hook

**Parameters:**
- `data: T[]` - Array of objects to export
- `fileName: string` - Name for the CSV file (without .csv extension)

**Returns:**
- `download()` - Downloads CSV file (browser only)
- `copy()` - Copies CSV to clipboard
- `csvString: string` - Generated CSV string
- `getBuffer()` - Returns Uint8Array for server-side usage

### `useCsvExportNext(data, fileName)` - Next.js Hook

**Returns:**
- All features from `useCsvExport`
- `isReady: boolean` - True when hydrated and ready

### `useCsvExportNative(data)` - React Native Hook

**Returns:**
- `copy()` - Copy CSV to clipboard
- `csvString: string` - Generated CSV string
- `getBuffer()` - Returns Uint8Array for server-side usage

## 🌍 Environment Support

| Environment | Download | Copy | String | Buffer |
|-------------|----------|------|--------|--------|
| **Web Browser** | ✅ | ✅ | ✅ | ✅ |
| **React Native** | ❌ | ✅ | ✅ | ✅ |
| **Next.js SSR** | ❌ | ❌ | ✅ | ✅ |
| **Node.js** | ❌ | ❌ | ✅ | ✅ |
| **Edge Runtime** | ❌ | ❌ | ✅ | ✅ |

## 📝 Examples

### Advanced Usage

```tsx
function AdvancedComponent() {
  const [data, setData] = useState([]);
  const { download, copy, csvString, getBuffer } = useCsvExport(data, 'export');

  const handleDownload = () => {
    if (data.length === 0) {
      alert('No data to export!');
      return;
    }
    download();
  };

  const handleCopy = async () => {
    try {
      await copy();
      alert('CSV copied to clipboard!');
    } catch (error) {
      alert('Failed to copy CSV');
    }
  };

  const handleServerExport = () => {
    const buffer = getBuffer();
    if (buffer) {
      // Use buffer in API call
      fetch('/api/export', {
        method: 'POST',
        body: buffer
      });
    }
  };

  return (
    <div>
      <button onClick={handleDownload} disabled={data.length === 0}>
        Download CSV ({data.length} rows)
      </button>
      <button onClick={handleCopy}>Copy to Clipboard</button>
      <button onClick={handleServerExport}>Server Export</button>
    </div>
  );
}
```

### With Dynamic Data

```tsx
function DynamicComponent({ users, fileName }) {
  const { download, copy, csvString } = useCsvExport(users, fileName);

  return (
    <div>
      <p>Exporting {users?.length || 0} users</p>
      <button onClick={download} disabled={!users?.length}>
        Download {fileName}.csv
      </button>
      <button onClick={copy} disabled={!users?.length}>
        Copy CSV
      </button>
    </div>
  );
}
```

## 🛡️ Safety Features

- **SSR Safe**: No DOM access during server-side rendering
- **Hydration Aware**: Waits for client hydration before DOM operations
- **Error Handling**: Graceful fallbacks for unsupported operations
- **Type Safe**: Full TypeScript support

## 🔄 Migration Guide

### From v1.0.x to v1.1.x

The library is fully backward compatible. New features are additive:

```tsx
// Old usage still works
const { exportCsv, csvString } = useCsvExport(data, 'export');

// New simplified usage
const { download, copy, csvString } = useCsvExport(data, 'export');

// Use the new functions
download();  // Instead of exportCsv()
copy();      // New: Copy to clipboard
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 🆘 Support

- 📚 [Documentation](https://github.com/your-repo/react-csv-export-hook)
- 🐛 [Issue Tracker](https://github.com/your-repo/react-csv-export-hook/issues)
- 💬 [Discussions](https://github.com/your-repo/react-csv-export-hook/discussions)

---

**Simple. Universal. Powerful.** 🚀
