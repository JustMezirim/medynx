// Utility functions to handle dates consistently across the project

/**
 * Convert a date to YYYY-MM-DD format without timezone conversion
 */
export function formatDateForStorage(date: Date | string): string {
  if (typeof date === 'string') {
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date
    }
    date = new Date(date)
  }
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

/**
 * Create a Date object from YYYY-MM-DD string at noon UTC to avoid timezone issues
 */
export function createDateFromString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
}

/**
 * Format date for display without timezone conversion
 */
export function formatDateForDisplay(date: Date | string): string {
  if (typeof date === 'string') {
    // If in YYYY-MM-DD format, parse and format
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-')
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString()
    }
    date = new Date(date)
  }
  
  return date.toLocaleDateString()
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return formatDateForStorage(new Date())
}

/**
 * Compare two dates (strings or Date objects) without timezone issues
 */
export function compareDates(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? date1 : formatDateForStorage(date1)
  const d2 = typeof date2 === 'string' ? date2 : formatDateForStorage(date2)
  
  return d1.localeCompare(d2)
}