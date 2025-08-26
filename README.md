# React CSV Export Hook - Universal Cross-Platform Solution

A comprehensive React hook library for exporting data as CSV with universal support for all platforms and React versions.

## 🌟 **Features**

- 🚀 **Universal**: Single hook works on all platforms
- 🔒 **Type Safe**: Full TypeScript support with generics
- 🛡️ **Safe**: Handles null/undefined data gracefully with optional chaining
- 📱 **Cross-Platform**: Web, React Native (iOS/Android), Next.js, SSR
- ⚡ **React 19 Ready**: Compatible with React 17+ including latest versions
- 🎯 **Zero Dependencies**: No external packages required
- 🔄 **SSR Safe**: Works in server-side rendering environments
- 🎨 **Flexible**: Multiple hooks for specialized use cases

## 🚀 **Supported Platforms**

| Platform | Support | Features |
|----------|---------|----------|
| **Web Browsers** | ✅ Full | File download, Blob support |
| **React Native** | ✅ Full | Clipboard, sharing, CSV string |
| **Next.js** | ✅ Full | SSR safe, API integration |
| **React 17-19** | ✅ Full | Modern React patterns |
| **iOS/Android** | ✅ Full | Native sharing capabilities |

## 📦 **Installation**

```bash
npm install react-csv-export-hook
# or
yarn add react-csv-export-hook
# or
pnpm add react-csv-export-hook
```

**That's it! No additional packages needed.** 🎉

## 🎯 **Usage**

### **Universal Hook (Recommended)**

The main `useCsvExport` hook automatically detects your platform and provides appropriate functionality:

```tsx
import { useCsvExport } from 'react-csv-export-hook';

function MyComponent() {
  const data = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' }
  ];
  
  const { exportCsv, csvString, platform, shareOptions } = useCsvExport(data, 'users-data');
  
  return (
    <div>
      <p>Platform: {platform}</p>
      <button onClick={exportCsv}>
        Export to CSV
      </button>
      
      {platform === 'react-native' && (
        <div>
          <p>CSV ready for sharing: {csvString}</p>
          <button onClick={() => shareOptions.copyToClipboard()}>
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
```

### **Web Browser Usage**

```tsx
import { useCsvExport } from 'react-csv-export-hook';

function WebComponent() {
  const data = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' }
  ];
  
  const { exportCsv, platform } = useCsvExport(data, 'users-data');
  
  return (
    <div>
      <p>Platform: {platform}</p>
      <button onClick={exportCsv}>
        Download CSV
      </button>
    </div>
  );
}
```

### **React Native Usage**

```tsx
import { useCsvExport } from 'react-csv-export-hook';
import { Button, Alert } from 'react-native';

function NativeComponent() {
  const data = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' }
  ];
  
  const { exportCsv, csvString, shareOptions } = useCsvExport(data, 'users-data');
  
  const handleExport = () => {
    exportCsv();
    Alert.alert('Success', 'CSV data ready for sharing');
  };
  
  return (
    <div>
      <Button title="Generate CSV" onPress={handleExport} />
      <Button title="Copy to Clipboard" onPress={() => shareOptions.copyToClipboard()} />
      <Button title="Share CSV" onPress={() => shareOptions.shareWithLibrary()} />
    </div>
  );
}
```

### **Next.js Usage**

```tsx
import { useCsvExportNext } from 'react-csv-export-hook';

function NextJSComponent() {
  const data = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' }
  ];
  
  const { exportCsv, csvString, isClient, isSSR, downloadFromAPI } = useCsvExportNext(data, 'users-data');
  
  return (
    <div>
      {isSSR && <p>Loading...</p>}
      {isClient && (
        <>
          <button onClick={exportCsv}>
            Download CSV
          </button>
          <button onClick={() => downloadFromAPI('/api/export-csv')}>
            Download via API
          </button>
        </>
      )}
    </div>
  );
}
```

### **With Optional Chaining Safety**

```tsx
function UserList({ users }) {
  const { exportCsv, csvString } = useCsvExport(users?.data, 'users-export');
  
  return (
    <div>
      {users?.data && (
        <button onClick={exportCsv}>
          Export {users.data.length} users
        </button>
      )}
    </div>
  );
}
```

## 🔧 **API Reference**

### **`useCsvExport<T>(data, fileName)` - Universal Hook**

**Parameters:**
- `data: T[] | null | undefined` - Array of objects to export
- `fileName: string` - Name of the CSV file (without .csv extension)

**Returns:**
- `exportCsv: () => void` - Function that triggers CSV export/download
- `csvString: string` - Generated CSV string
- `platform: string` - Detected platform ('web', 'react-native', 'nextjs', 'ssr')
- `shareOptions: object` - Platform-specific sharing utilities
- `isWeb: boolean` - Whether running in web browser
- `isReactNative: boolean` - Whether running in React Native
- `isNextJS: boolean` - Whether running in Next.js
- `isSSR: boolean` - Whether running in SSR environment

### **`useCsvExportNative<T>(data)` - React Native Specific**

**Parameters:**
- `data: T[] | null | undefined` - Array of objects to export

**Returns:**
- `csvString: string` - Generated CSV string
- `shareOptions: object` - React Native sharing utilities

### **`useCsvExportNext<T>(data, fileName)` - Next.js Specific**

**Parameters:**
- `data: T[] | null | undefined` - Array of objects to export
- `fileName: string` - Name of the CSV file

**Returns:**
- `exportCsv: () => void` - Client-side CSV export
- `csvString: string` - Generated CSV string
- `isClient: boolean` - Whether component is hydrated
- `isSSR: boolean` - Whether running in SSR
- `downloadFromAPI: (route, options) => Promise<void>` - API-based download
- `getCSVForAPI: () => object` - CSV data for API integration

## 🌐 **Platform Detection**

The hooks automatically detect your environment:

```tsx
const { platform, isWeb, isReactNative, isNextJS, isSSR } = useCsvExport(data, 'filename');

console.log(platform); // 'web' | 'react-native' | 'nextjs' | 'ssr'
```

## 📱 **React Native Sharing Options**

### **Built-in Functionality (No Dependencies)**
```tsx
const { shareOptions } = useCsvExport(data, 'filename');

// Copy to clipboard
await shareOptions.copyToClipboard();

// Get CSV string
const csvString = shareOptions.getString();

// Get base64 data URL
const dataUrl = shareOptions.getDataUrl();
```

### **Optional Libraries (Enhanced Functionality)**
```tsx
// With react-native-share (optional)
await shareOptions.shareWithLibrary();

// With Expo Sharing (optional)
await shareOptions.shareWithExpo();
```

## 🔄 **Next.js Integration**

### **API Route Example**
```typescript
// pages/api/export-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { data, fileName } = req.body;
  
  // Generate CSV
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${row[h]}"`).join(','))
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}.csv"`);
  res.status(200).send(csvContent);
}
```

### **Client Usage**
```tsx
const { downloadFromAPI } = useCsvExportNext(data, 'users-data');

const handleDownload = () => {
  downloadFromAPI('/api/export-csv');
};
```

## 🚀 **React 19 Compatibility**

This package is fully compatible with React 19 and uses modern React patterns:

- ✅ **React 17+** (including React 18 and 19)
- ✅ **Concurrent Features** ready
- ✅ **Strict Mode** compatible
- ✅ **Server Components** safe
- ✅ **Optional Chaining** support
- ✅ **Modern Hooks** patterns

## 🔧 **Advanced Usage**

### **Custom CSV Generation**
```tsx
const { csvString, shareOptions } = useCsvExport(data, 'filename');

// Use CSV string for custom purposes
const customProcessing = (csv: string) => {
  // Your custom logic here
  console.log('Processing CSV:', csv);
};

customProcessing(csvString);
```

### **Platform-Specific Logic**
```tsx
const { platform, exportCsv, shareOptions } = useCsvExport(data, 'filename');

if (platform === 'react-native') {
  // React Native specific logic
  shareOptions.copyToClipboard();
} else if (platform === 'web') {
  // Web specific logic
  exportCsv();
} else if (platform === 'ssr') {
  // Server-side logic
  console.log('CSV generated on server');
}
```

## 🛠 **Troubleshooting**

### **Import Suggestions Not Working**

1. **Ensure TypeScript is installed**:
   ```bash
   npm install -D typescript @types/node
   ```

2. **Check your tsconfig.json**:
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "node",
       "esModuleInterop": true,
       "allowSyntheticDefaultImports": true
     }
   }
   ```

3. **Restart TypeScript language server** in your IDE

### **Platform-Specific Issues**

- **Web**: Ensure browser supports Blob and download
- **React Native**: Check clipboard permissions
- **Next.js**: Verify SSR/CSR hydration
- **SSR**: Use `csvString` for server-side processing

## 🌍 **Browser Support**

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ React 17+ (including React 18 and 19)
- ✅ TypeScript 4.0+

## 📱 **React Native Support**

- ✅ React Native 0.60+
- ✅ Expo (managed and bare workflows)
- ✅ iOS and Android
- ✅ TypeScript support
- ✅ No native dependencies

## ⚡ **Performance**

- **Lightweight**: Minimal bundle size
- **Efficient**: Uses React.useCallback for optimization
- **Lazy**: CSV generation only when needed
- **Memory Safe**: Automatic cleanup of resources

## 📄 **License**

MIT License - see [LICENSE.md](LICENSE.md) for details.

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

## 🆕 **Migration Guide**

### **From v1.0.4 to v1.0.5**

The main hook now returns an object instead of a function:

```tsx
// Old (v1.0.4)
const exportCsv = useCsvExport(data, 'filename');
exportCsv(); // Call the function

// New (v1.0.5)
const { exportCsv, csvString, platform } = useCsvExport(data, 'filename');
exportCsv(); // Call the function
```

**Backward compatibility is maintained** - the old API still works, but the new API provides more features.
