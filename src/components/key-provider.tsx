"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const KeyProvider = createContext<
  | undefined
  | {
      key: string | undefined;
      setKey: Dispatch<SetStateAction<string | undefined>>;
    }
>(undefined);
export default function Provider({ children }: { children: React.ReactNode }) {
  const [key, setKey] = useState<undefined | string>(undefined);
  useEffect(() => {
    if (typeof localStorage == "undefined") return;
    if (localStorage.getItem("secret")) {
      setKey(localStorage.getItem("secret") as string);
    }
  }, []);
  useEffect(() => {
    if (
      !(typeof key == "undefined") &&
      (key?.startsWith("sk_live_") || key?.startsWith("sk_test_"))
    ) {
      localStorage.setItem("secret", key);
    }
  }, [key]);
  return (
    <KeyProvider.Provider value={{ key, setKey }}>
      {children}
    </KeyProvider.Provider>
  );
}

export function useKeyProvider() {
  const ctx = useContext(KeyProvider);
  if (ctx === undefined)
    throw new Error("useKeyProvider must be used within a KeyProvider");
  return ctx;
}
