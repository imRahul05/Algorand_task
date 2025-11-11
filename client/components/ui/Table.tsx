import React from 'react';

const Table: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
  <div className="relative w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className}`}>
      {children}
    </table>
  </div>
);

const TableHeader: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
  <thead className={`[&_tr]:border-b [&_tr]:border-border/50 ${className}`}>
    {children}
  </thead>
);

const TableBody: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`}>
    {children}
  </tbody>
);

const TableRow: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
  <tr className={`border-b border-border/50 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}>
    {children}
  </tr>
);

const TableHead: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
  <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}>
    {children}
  </th>
);

const TableCell: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>
    {children}
  </td>
);

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };