import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Retorna la fecha actual en formato YYYY-MM-DD usando la zona horaria LOCAL
 * del navegador/dispositivo (NO UTC). Evita el problema de Vercel donde
 * toISOString() da la fecha del día siguiente para zonas UTC-X.
 */
export function getLocalDateString(date: Date = new Date()): string {
  // 'sv-SE' usa el formato ISO YYYY-MM-DD por defecto
  return date.toLocaleDateString('sv-SE');
}
