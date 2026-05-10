import { useCallback } from "react";
import {
  DEMO_MENU,
  formatModifiersAr,
  type MenuModifierHints,
  type OrderLine,
} from "@/lib/demo-menu";

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ").replace(/[ًٌٍَُِّْٰ]/g, "");
}

function parseModifierHints(params: Record<string, unknown>): MenuModifierHints {
  return {
    sugar: ["regular", "less", "none"].includes(String(params.sugar))
      ? (params.sugar as MenuModifierHints["sugar"])
      : undefined,
    notes: typeof params.notes === "string" ? params.notes : undefined,
  };
}

function resolveMenuItem(params: Record<string, unknown>) {
  const rawId = String(params.item_id ?? params.id ?? "").trim();
  const rawName = String(params.item_name ?? params.name ?? "").trim();

  if (rawId) {
    const byId = DEMO_MENU.find((item) => item.id === rawId);
    if (byId) return byId;
  }

  if (rawName) {
    const normalized = normalizeText(rawName);

    return (
      DEMO_MENU.find((item) => normalizeText(item.name) === normalized) ||
      DEMO_MENU.find(
        (item) =>
          normalizeText(item.name).includes(normalized) ||
          normalized.includes(normalizeText(item.name)),
      )
    );
  }

  return null;
}

function buildOrderLine(params: Record<string, unknown>): OrderLine | null {
  const item = resolveMenuItem(params);
  if (!item) return null;

  const qty = Math.max(1, Number(params.quantity) || 1);
  const modifiers = parseModifierHints(params);
  const modifiersLabel = formatModifiersAr(modifiers);

  return {
    lineKey: `${item.id}|${modifiersLabel}`,
    itemId: item.id,
    name: modifiersLabel === "???? ????? ?????" ? item.name : `${item.name} (${modifiersLabel})`,
    qty,
    price: item.price,
    imageSrc: item.imageSrc,
    modifiersLabel,
    modifiers,
  };
}

export function useVoiceTools(
  setOrderItems: React.Dispatch<React.SetStateAction<OrderLine[]>>,
  setPreviewLine: (line: OrderLine | null) => void,
  setOrderFinalized: (v: boolean) => void,
  endSessionRef: React.MutableRefObject<(() => void | Promise<void>) | null>,
) {
  const addMenuItem = useCallback((params: Record<string, unknown>) => {
    const line = buildOrderLine(params);
    if (!line) return JSON.stringify({ ok: false });

    setOrderItems((current) => {
      const existing = current.find((l) => l.lineKey === line.lineKey);
      if (existing) {
        return current.map((l) =>
          l.lineKey === line.lineKey ? { ...l, qty: l.qty + line.qty } : l,
        );
      }
      return [...current, line];
    });

    return JSON.stringify({ ok: true });
  }, []);

  const preaddMenuItem = useCallback((params: Record<string, unknown>) => {
    const line = buildOrderLine(params);
    if (line) setPreviewLine(line);
    return JSON.stringify({ ok: true });
  }, []);

  const clearOrder = useCallback(() => {
    setOrderItems([]);
    setPreviewLine(null);
    setOrderFinalized(false);
    return JSON.stringify({ ok: true });
  }, []);

  const completeOrder = useCallback(() => {
    setOrderFinalized(true);
    setPreviewLine(null);
    setTimeout(() => endSessionRef.current?.(), 0);
    return JSON.stringify({ ok: true });
  }, []);

  return {
    addMenuItem,
    preaddMenuItem,
    clearOrder,
    completeOrder,
  };
}