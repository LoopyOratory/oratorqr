import { atom } from "jotai";

export const urlAtom = atom<string>("");

export const selectedStyleAtom = atom<string>("a1");

export const selectedTabAtom = atom<"simple" | "ai">("simple");
