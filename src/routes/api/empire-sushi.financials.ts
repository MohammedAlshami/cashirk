import path from 'node:path';
import fs from 'node:fs';
import { createFileRoute } from '@tanstack/react-router';
import * as XLSX from 'xlsx';

const EMPIRE_DATA = path.join(process.cwd(), 'public', 'research', 'empire-sushi');
const FILE_PATH = path.join(EMPIRE_DATA, 'Financials', 'Sushi Franchies Financial Data.xlsx');

export interface FinancialRow {
  company: string;
  brand: string;
  g: boolean;
  r: boolean;
  o: boolean;
  outlets: number;
  fye: number | null;
  revenueRmThousands: number;
  patRmThousands: number;
  patMargin: number;
}

function hasCheck(val: unknown): boolean {
  if (val === undefined || val === null) return false;
  const s = String(val).trim();
  return s === '√' || s === '✓' || s.toLowerCase() === 'y' || s === '1';
}

export const Route = createFileRoute('/api/empire-sushi/financials')({
  server: {
    handlers: {
      GET: async () => {
        try {
          if (!fs.existsSync(FILE_PATH)) {
            return Response.json({ data: [] });
          }
          const fileBuffer = fs.readFileSync(FILE_PATH);
          const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const raw = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][];

          const rows: FinancialRow[] = [];
          for (let i = 1; i < raw.length; i++) {
            const row = raw[i];
            const company = row[0];
            if (typeof company !== 'string' || !company.trim()) continue;
            if (
              company.startsWith('Subsidiaries') ||
              company.startsWith('Private company') ||
              company === 'Legend' ||
              company.startsWith('G:') ||
              company.startsWith('R:') ||
              company.startsWith('O:') ||
              company.startsWith('PAT/')
            ) {
              continue;
            }
            const outlets = Number(row[4]);
            const fyeVal = row[5];
            const revenue = Number(row[6]);
            const pat = Number(row[7]);
            const margin = Number(row[8]);
            if (isNaN(outlets) && isNaN(revenue)) continue;
            let brand = company.trim();
            const colon = company.indexOf(':');
            if (colon > 0) brand = company.slice(colon + 1).trim();
            const fye = typeof fyeVal === 'number' && !isNaN(fyeVal) ? fyeVal : null;
            rows.push({
              company: company.trim(),
              brand,
              g: hasCheck(row[1]),
              r: hasCheck(row[2]),
              o: hasCheck(row[3]),
              outlets: isNaN(outlets) ? 0 : outlets,
              fye,
              revenueRmThousands: isNaN(revenue) ? 0 : revenue,
              patRmThousands: isNaN(pat) ? 0 : pat,
              patMargin: isNaN(margin) ? 0 : margin,
            });
          }

          return Response.json({ data: rows });
        } catch (error) {
          console.error('Empire sushi financials API:', error);
          return Response.json({ error: 'Failed to load financial data' }, { status: 500 });
        }
      },
    },
  },
});
