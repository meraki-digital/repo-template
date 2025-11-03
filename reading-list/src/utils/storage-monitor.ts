/**
 * Storage monitor utility
 * Estimates localStorage usage and warns when approaching capacity
 */

const TYPICAL_QUOTA = 5 * 1024 * 1024; // 5MB (conservative estimate)
const WARNING_THRESHOLD = 0.8; // Warn at 80%

export function estimateStorageUsage(): number {
  let totalBytes = 0;
  
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const value = localStorage.getItem(key);
      if (value) {
        // Count key + value in bytes (approximate)
        totalBytes += key.length + value.length;
      }
    }
  }
  
  return totalBytes;
}

export function getStoragePercentage(): number {
  const used = estimateStorageUsage();
  const percentage = (used / TYPICAL_QUOTA) * 100;
  return Math.min(percentage, 100); // Cap at 100%
}

export function isNearCapacity(): boolean {
  return getStoragePercentage() >= (WARNING_THRESHOLD * 100);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function getStorageInfo() {
  const used = estimateStorageUsage();
  const percentage = getStoragePercentage();
  const nearCapacity = isNearCapacity();
  
  return {
    used,
    usedFormatted: formatBytes(used),
    percentage: Math.round(percentage),
    nearCapacity,
    quota: TYPICAL_QUOTA,
    quotaFormatted: formatBytes(TYPICAL_QUOTA),
  };
}
