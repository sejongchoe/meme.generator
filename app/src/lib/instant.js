import { init } from '@instantdb/react';

// Initialize InstantDB with your App ID
export const db = init({
  appId: '77790f0d-33cf-4de1-afdf-846dad908dea',
});

// Export hooks for convenience
export const { useAuth, useQuery, transact, auth, storage, tx, id } = db;

