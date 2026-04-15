// Shim: all Base44 references now go through localDB
import { localDB } from '@/lib/localDB';

export const base44 = localDB;