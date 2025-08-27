/**
 * React CSV Export Hook - Simple & Universal
 *
 * A simple React hook library for exporting data as CSV.
 * Works everywhere: Web, React Native, Next.js, Node.js, SSR.
 *
 * @packageDocumentation
 */

// Main universal hook - works on all platforms
export { useCsvExport } from "./useCsvExport";

// Platform-specific hooks for specialized use cases
export { useCsvExportNative } from "./useCsvExportNative";
export { useCsvExportNext } from "./useCsvExportNext";

// Re-export the main hook as default for backward compatibility
export { useCsvExport as default } from "./useCsvExport";

// Type exports for better TypeScript support
export type {} from "./useCsvExport";
