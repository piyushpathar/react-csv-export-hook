# React CSV Export Hook

A lightweight React hook to export data as CSV with optional chaining safety. Supports both web browsers and React Native environments.

## Features

- 🚀 **Lightweight**: Minimal bundle size with no external dependencies
- 🔒 **Type Safe**: Full TypeScript support with generic types
- 🛡️ **Safe**: Handles null/undefined data gracefully with optional chaining
- 📱 **Universal**: Works in web browsers and React Native
- 🎯 **Simple**: Two hooks for different environments
- ⚡ **React 19 Ready**: Compatible with React 17+ including latest versions

## Installation

```bash
npm install react-csv-export-hook
# or
yarn add react-csv-export-hook
# or
pnpm add react-csv-export-hook
```

### React Native Setup

For React Native projects, install a sharing library:

```bash
npm install react-native-share
# or
yarn add react-native-share
```

## Usage

### Web Browser Usage

```tsx
import { useCsvExport } from 'react-csv-export-hook';

function MyComponent() {
  const data = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' }
  ];
  
  const exportCsv = useCsvExport(data, 'users-data');
  
  return (
    <button onClick={exportCsv}>
      Export to CSV
    </button>
  );
}
```

### React Native Usage

```tsx
import { useCsvExportNative } from 'react-csv-export-hook';
import Share from 'react-native-share';
import { Button } from 'react-native';

function NativeComponent() {
  const data = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' }
  ];
  
  const getCsvString = useCsvExportNative(data);
  
  const handleShare = async () => {
    try {
      const csvString = getCsvString();
      await Share.open({
        title: 'Export CSV',
        message: 'Share your data as CSV',
        url: `data:text/csv;base64,${Buffer.from(csvString).toString('base64')}`,
        type: 'text/csv'
      });
    } catch (error) {
      console.error('Error sharing CSV:', error);
    }
  };
  
  return <Button title="Share CSV" onPress={handleShare} />;
}
```

### With Optional Chaining Safety

```tsx
function UserList({ users }) {
  // Safe to use with optional chaining
  const exportCsv = useCsvExport(users?.data, 'users-export');
  
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

### React Native with useCsvExport

```tsx
import { Alert } from 'react-native';

function NativeComponent() {
  const data = [{ name: 'John', age: 30 }];
  const exportCsv = useCsvExport(data, 'users-data');
  
  const handleExport = () => {
    exportCsv();
    Alert.alert('Success', 'CSV data ready for sharing');
  };
  
  return <Button title="Export CSV" onPress={handleExport} />;
}
```

## API Reference

### `useCsvExport<T>(data, fileName)` - Universal Hook

**Parameters:**
- `data: T[] | null | undefined` - Array of objects to export, or null/undefined
- `fileName: string` - Name of the CSV file (without .csv extension)

**Returns:**
- `() => void` - Function that triggers CSV download in browsers or logs CSV string in React Native

**Behavior:**
- **Web Browser**: Downloads CSV file automatically
- **React Native**: Logs CSV string to console (use `useCsvExportNative` for better integration)

### `useCsvExportNative<T>(data)` - React Native Specific

**Parameters:**
- `data: T[] | null | undefined` - Array of objects to export, or null/undefined

**Returns:**
- `() => string` - Function that returns the CSV string when called

**Generic Type:**
- `T extends Record<string, unknown>` - Type constraint ensuring data objects have string keys

## How It Works

### Web Browser Environment
- Detects browser environment using `typeof window !== "undefined" && typeof document !== "undefined"`
- Creates a Blob with CSV data
- Generates download link and triggers file download
- Automatically cleans up resources

### React Native Environment
- **`useCsvExport`**: Logs CSV string to console for debugging
- **`useCsvExportNative`**: Returns CSV string for use with sharing libraries
- No DOM manipulation (safe for React Native)

### CSV Generation
- Automatically extracts headers from first data object
- Escapes special characters (quotes, commas, newlines)
- Handles null/undefined values safely
- Generates properly formatted CSV with headers

## Error Handling

The hooks include built-in error handling:

- **Empty Data**: Warns if no data is provided
- **Invalid Data**: Warns if data objects have no keys
- **Export Failures**: Logs errors if CSV generation fails
- **Platform Detection**: Automatically adapts to environment

## React 19 Compatibility

This package is fully compatible with React 19 and uses modern React patterns:

- ✅ **React 17+** (including React 18 and 19)
- ✅ **Concurrent Features** ready
- ✅ **Strict Mode** compatible
- ✅ **Server Components** safe (for web usage)
- ✅ **Optional Chaining** support

## React Native Compatibility

The package provides two approaches for React Native:

1. **`useCsvExport`** - Universal hook that logs CSV in React Native
2. **`useCsvExportNative`** - Dedicated hook that returns CSV string

### React Native Integration

```tsx
// Using with react-native-share
import { useCsvExportNative } from 'react-csv-export-hook';
import Share from 'react-native-share';

const getCsvString = useCsvExportNative(data);
const csvString = getCsvString();

// Share the CSV string
await Share.open({
  url: `data:text/csv;base64,${Buffer.from(csvString).toString('base64')}`,
  type: 'text/csv'
});
```

## Troubleshooting

### Import Suggestions Not Working

If you're not getting import suggestions in your IDE:

1. **Ensure TypeScript is installed** in your project:
   ```bash
   npm install -D typescript @types/node
   ```

2. **Check your tsconfig.json** includes the package:
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "node",
       "esModuleInterop": true,
       "allowSyntheticDefaultImports": true
     }
   }
   ```

3. **Restart your TypeScript language server** in your IDE

4. **Clear node_modules and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### React Native Issues

- **CSV not sharing**: Ensure you have `react-native-share` installed and properly linked
- **Permission errors**: Check if your app has the necessary sharing permissions
- **Base64 encoding**: The example uses `Buffer.from()` - you might need to polyfill this in React Native

### Common Issues

- **Data not exporting**: Ensure your data is an array of objects with string keys
- **File not downloading**: Check if your browser blocks popups/downloads
- **Empty CSV**: Verify your data array is not empty and objects have properties
- **CSV string not returned**: Use `useCsvExportNative` for React Native string output

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ React 17+ (including React 18 and 19)
- ✅ TypeScript 4.0+

## React Native Support

- ✅ React Native 0.60+
- ✅ Expo (managed and bare workflows)
- ✅ TypeScript support
- ✅ No native dependencies

## License

MIT License - see [LICENSE.md](LICENSE.md) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
