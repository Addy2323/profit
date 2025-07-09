export function exportCsv(rows: any[], filename: string) {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvLines: string[] = [];
  csvLines.push(headers.join(','));
  for (const row of rows) {
    csvLines.push(
      headers
        .map((h) => {
          const val = row[h] ?? '';
          // Escape double quotes and wrap field in quotes in case of commas
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(','),
    );
  }
  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
