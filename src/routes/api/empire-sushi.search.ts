import path from 'node:path';
import fs from 'node:fs';
import { createFileRoute } from '@tanstack/react-router';

const EMPIRE_DATA = path.join(process.cwd(), 'public', 'research', 'empire-sushi');
const SEARCH_DIR = path.join(EMPIRE_DATA, 'Search By Stores');

function parseRow(line: string): string[] {
  return line.split(',').map((cell) => cell.replace(/^"|"$/g, '').trim());
}

function parseCSV(content: string): { headers: string[]; rows: string[][] } {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map(parseRow).filter((r) => r.some((c) => c.length > 0));
  return { headers, rows };
}

export const Route = createFileRoute('/api/empire-sushi/search')({
  server: {
    handlers: {
      GET: async () => {
        try {
          if (!fs.existsSync(SEARCH_DIR)) {
            return Response.json({ data: [], stores: [] });
          }
          const files = fs.readdirSync(SEARCH_DIR).filter((f) => f.endsWith('.csv') && !f.startsWith('~$'));

          const byDate: Record<string, Record<string, number>> = {};
          const storeSet = new Set<string>();

          for (const file of files) {
            const filePath = path.join(SEARCH_DIR, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const { headers, rows } = parseCSV(content);
            if (headers.length < 2) continue;
            const storeName = headers[1];
            if (storeSet.has(storeName)) continue;
            storeSet.add(storeName);

            for (const row of rows) {
              const date = row[0];
              const value = parseInt(row[1], 10);
              if (!date || isNaN(value)) continue;
              if (!byDate[date]) byDate[date] = {};
              byDate[date][storeName] = value;
            }
          }

          const dates = Object.keys(byDate).sort();
          const stores = Array.from(storeSet).sort((a, b) => (a === 'Empire Sushi' ? -1 : b === 'Empire Sushi' ? 1 : a.localeCompare(b)));
          const data = dates.map((date) => {
            const row: Record<string, string | number> = { date };
            stores.forEach((s) => (row[s] = byDate[date][s] ?? 0));
            return row;
          });

          return Response.json({ data, stores });
        } catch (e) {
          console.error('Empire sushi search API:', e);
          return Response.json({ data: [], stores: [] }, { status: 500 });
        }
      },
    },
  },
});
