# React CSV Export Hook

A lightweight React hook to export data as CSV with optional chaining safety.

## Features

- 🚀 **Lightweight**: Minimal bundle size with no external dependencies
- 🔒 **Type Safe**: Full TypeScript support with generic types
- 🛡️ **Safe**: Handles null/undefined data gracefully
- 📱 **Universal**: Works in any React environment (browser, SSR, etc.)
- 🎯 **Simple**: One hook, one function, easy to use

## Installation

```bash
npm install react-csv-export-hook
# or
yarn add react-csv-export-hook
# or
pnpm add react-csv-export-hook
```

## Usage

### Basic Example

```tsx
import { useCsvExport } from 'react-csv-export-hook';

function MyComponent() {
  const data = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' },
    { name: 'Bob', age: 35, city: 'Chicago' }
  ];
  
  const exportCsv = useCsvExport(data, 'users-data');
  
  return (
    <button onClick={exportCsv}>
      Export to CSV
    </button>
  );
}
```

### With Optional Chaining

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

### Dynamic File Names

```tsx
function DataExport({ data, reportType }) {
  const fileName = `${reportType}-${new Date().toISOString().split('T')[0]}`;
  const exportCsv = useCsvExport(data, fileName);
  
  return (
    <button onClick={exportCsv}>
      Export {reportType} Report
    </button>
  );
}
```

## API Reference

### `useCsvExport<T>(data, fileName)`

**Parameters:**
- `data: T[] | null | undefined` - Array of objects to export, or null/undefined
- `fileName: string` - Name of the CSV file (without .csv extension)

**Returns:**
- `() => void` - Function that triggers the CSV download when called

**Generic Type:**
- `T extends Record<string, unknown>` - Type constraint ensuring data objects have string keys

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

### Common Issues

- **Data not exporting**: Ensure your data is an array of objects with string keys
- **File not downloading**: Check if your browser blocks popups/downloads
- **Empty CSV**: Verify your data array is not empty and objects have properties

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ React 17+ (uses modern React patterns)
- ✅ TypeScript 4.0+

## License

MIT License - see [LICENSE.md](LICENSE.md) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
