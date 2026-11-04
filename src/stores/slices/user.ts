import type { StateCreator } from "zustand";

export interface UserSlice {
  typoraMd: string;
  setTyporaMd: (v: string) => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  typoraMd: `# Hi, I'm Kunal 👋\n\nI'm an AI Engineer building agentic systems, enterprise RAG, and production AI infrastructure.\n\nOpen the **Bear** app for my experience and full project case studies, or the **Terminal** app to explore my background as a tiny filesystem.\n\n*(This is a live markdown editor, so type away.)*`,
  setTyporaMd: (v) => set(() => ({ typoraMd: v }))
});
