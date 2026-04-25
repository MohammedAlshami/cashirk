import path from 'node:path';
import fs from 'node:fs';
import { createFileRoute } from '@tanstack/react-router';
import * as XLSX from 'xlsx';

const EMPIRE_DATA = path.join(process.cwd(), 'public', 'research', 'empire-sushi');
const MENU_DIR = path.join(EMPIRE_DATA, 'Menu Items');

export const Route = createFileRoute('/api/empire-sushi/menu-items')({
  server: {
    handlers: {
      GET: async () => {
        try {
          if (!fs.existsSync(MENU_DIR)) {
            return Response.json([]);
          }
          const files = fs.readdirSync(MENU_DIR).filter((f) => f.endsWith('.xlsx') && !f.startsWith('~$'));
          const allMenuItems: { store: string; item: string; price: number; category?: string }[] = [];

          for (const file of files) {
            try {
              const storeName = file.replace(' Menu.xlsx', '');
              const filePath = path.join(MENU_DIR, file);
              const fileBuffer = fs.readFileSync(filePath);
              const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const data = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

              data.forEach((row) => {
                const itemName =
                  (row['Item'] as string) ||
                  (row['item'] as string) ||
                  (row['Item Name'] as string) ||
                  (row['Name'] as string) ||
                  (row['Product'] as string) ||
                  (row['Menu Item'] as string);
                const price =
                  Number(row['Price']) ||
                  Number(row['price']) ||
                  Number(row['Price (RM)']) ||
                  Number(row['RM']) ||
                  0;
                const category = (row['Category'] as string) || (row['category'] as string) || (row['Type'] as string) || (row['type'] as string);

                if (itemName && price > 0) {
                  allMenuItems.push({
                    store: storeName,
                    item: String(itemName),
                    price,
                    category: category ? String(category) : undefined,
                  });
                }
              });
            } catch {
              // skip invalid files
            }
          }

          return Response.json(allMenuItems);
        } catch (error) {
          console.error('Empire sushi menu-items API:', error);
          return Response.json({ error: 'Failed to load menu items' }, { status: 500 });
        }
      },
    },
  },
});
