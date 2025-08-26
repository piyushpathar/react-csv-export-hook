# 📦 react-csv-export-hook

A lightweight **React hook** to export JSON/array data to CSV files.  
Built with **TypeScript**, safe with **optional chaining**, and ready for production.  

---

## ✨ Features
- ✅ Easy to use React hook (`useCsvExport`)
- ✅ TypeScript support with generics
- ✅ Handles special characters (quotes, commas, new lines)
- ✅ Works with **React 17+ and 18+**
- ✅ Exports data to CSV with one click

---

## 📦 Installation
```bash
npm install react-csv-export-hook
# or
yarn add react-csv-export-hook
```

---

## 🚀 Usage

```tsx
import React from "react";
import { useCsvExport } from "react-csv-export-hook";

const App = () => {
  const data = [
    { name: "Alice", age: 25, city: "New York" },
    { name: "Bob", age: 30, city: "London" },
  ];

  const exportCsv = useCsvExport(data, "users.csv");

  return (
    <button onClick={exportCsv}>
      Export Users
    </button>
  );
};

export default App;
```

✅ Clicking the button will download a file named `users.csv` with your data.

---

## 📄 Example CSV Output
Input data:
```json
[
  { "name": "Alice", "age": 25, "city": "New York" },
  { "name": "Bob", "age": 30, "city": "London" }
]
```

Output file:
```csv
"name","age","city"
"Alice","25","New York"
"Bob","30","London"
```

---

## 🔧 API

### `useCsvExport<T>(data: T[] | null | undefined, fileName: string)`

| Parameter   | Type                          | Description                                      |
|-------------|-------------------------------|--------------------------------------------------|
| `data`      | `T[] | null | undefined`      | Array of objects to export as CSV                |
| `fileName`  | `string`                      | File name for the exported CSV (e.g. `"users.csv"`) |

**Returns:**  
- A function `() => void` → Call it to trigger the CSV download.

---

## ⚡ Advanced Usage

### Export Dynamic Data
```tsx
import { useCsvExport } from "react-csv-export-hook";

const ExportLeads = ({ leads }) => {
  const exportCsv = useCsvExport(leads, "leads.csv");

  return <button onClick={exportCsv}>Download Leads</button>;
};
```

### With Fallback Filename
```tsx
const exportCsv = useCsvExport(data, ""); 
// defaults to "export.csv"
```

---

## 🛡️ Safety Features
- Uses **optional chaining (`?.`)** → avoids crashes on missing fields
- Converts all values to strings safely
- Escapes CSV-specific characters (`"`, `,`, `
`)
- Provides default filename (`export.csv`) if none is given

---

## 📚 Requirements
- React `^17.0.0` or `^18.0.0`
- TypeScript (recommended, but optional)

---

## 🏗️ Roadmap
- [ ] Custom column headers
- [ ] Exclude specific fields
- [ ] Async/streaming support for large datasets
- [ ] Column ordering support

---

## 📝 License
MIT © 2025 Piyush Pathar
