// Timezone configuration
// Default to GMT+8 (Manila/Philippines), can be overridden with NEXT_PUBLIC_TIMEZONE_OFFSET env var
const TIMEZONE_OFFSET = 
  process.env.NEXT_PUBLIC_TIMEZONE_OFFSET !== undefined 
    ? parseInt(process.env.NEXT_PUBLIC_TIMEZONE_OFFSET) 
    : 8; // GMT+8

const TIMEZONE_NAME = 
  process.env.NEXT_PUBLIC_TIMEZONE_NAME || 'Asia/Manila';

/**
 * Format a date using the configured timezone (GMT+8 by default or configurable via env)
 * Extracts YYYY-MM-DD from date strings to avoid timezone conversion issues
 * @param date - Date string or Date object
 * @returns Formatted date string in YYYY-MM-DD format
 */
export function formatDateWithTimezone(date: any): string {
  if (!date) return '';
  
  // If it's a string, always extract YYYY-MM-DD portion first
  // This avoids timezone conversion issues
  if (typeof date === 'string') {
    const match = date.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
  }
  
  // Fallback: parse as Date object and convert to configured timezone
  try {
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
      // Adjust for timezone offset
      const utcDate = dateObj.getTime() + dateObj.getTimezoneOffset() * 60 * 1000;
      const tzDate = new Date(utcDate + TIMEZONE_OFFSET * 60 * 60 * 1000);
      
      const year = tzDate.getFullYear();
      const month = String(tzDate.getMonth() + 1).padStart(2, '0');
      const day = String(tzDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    // Return empty string if parsing fails
  }
  
  return '';
}

/**
 * Get current date in the configured timezone as YYYY-MM-DD
 * @returns Current date string in YYYY-MM-DD format
 */
export function getTodayWithTimezone(): string {
  const now = new Date();
  const utcDate = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const tzDate = new Date(utcDate + TIMEZONE_OFFSET * 60 * 60 * 1000);
  
  const year = tzDate.getFullYear();
  const month = String(tzDate.getMonth() + 1).padStart(2, '0');
  const day = String(tzDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Convert local date to ISO date string in the configured timezone
 * @param date - Date object or Date string
 * @returns ISO date string in configured timezone (YYYY-MM-DD)
 */
export function toTimezoneISOString(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const utcDate = dateObj.getTime() + dateObj.getTimezoneOffset() * 60 * 1000;
  const tzDate = new Date(utcDate + TIMEZONE_OFFSET * 60 * 60 * 1000);
  
  const year = tzDate.getFullYear();
  const month = String(tzDate.getMonth() + 1).padStart(2, '0');
  const day = String(tzDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Get timezone information
 */
export function getTimezoneInfo() {
  return {
    offset: TIMEZONE_OFFSET,
    name: TIMEZONE_NAME,
  };
}
