import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Helper to parse JSON text elements (for SQLite compatibility)
export const parseTextElements = (textElements) => {
  if (typeof textElements === 'string') {
    try {
      return JSON.parse(textElements);
    } catch (e) {
      return [];
    }
  }
  return textElements;
};

// Helper to stringify text elements (for SQLite compatibility)
export const stringifyTextElements = (textElements) => {
  return typeof textElements === 'string' ? textElements : JSON.stringify(textElements);
};

export default prisma;
