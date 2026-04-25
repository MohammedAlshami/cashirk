export interface Block {
  id: string;
  type: string;
  content: string | Array<{ id: string; text: string }> | { headers: string[]; rows: string[][] };
  placeholder?: string;
  alignment?: 'left' | 'center' | 'right';
  variables?: Record<string, string>;
  sectionId?: string;
}
