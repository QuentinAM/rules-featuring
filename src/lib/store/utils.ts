import { writable } from "svelte/store";

export const allCards = writable<any[]>([]);
export const language = writable<string>('FR');