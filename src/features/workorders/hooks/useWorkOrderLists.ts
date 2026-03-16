"use client";
import { useEffect, useState } from "react";

export type ListItem = {
  id: string | number;
  value: string;
};

export function useWorkOrderLists() {
  const [itemList, setItemList] = useState<ListItem[]>([]);
  const [workCodeList, setWorkCodeList] = useState<ListItem[]>([]);
  const [othersList, setOthersList] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [itemsRes, codesRes, othersRes] = await Promise.all([
          fetch("/api/v2/construction-item"),
          fetch("/api/v2/work-code"),
          fetch("/api/v2/others"),
        ]);

        const items = await itemsRes.json();
        const codes = await codesRes.json();
        const others = await othersRes.json();

        // Convert to ListItem format with id and value
        const parseListItems = (data: any): ListItem[] => {
          if (!Array.isArray(data)) return [];
          return data
            .map((item: any) => {
              if (typeof item === "string") {
                return { id: item, value: item };
              }
              if (item && typeof item === "object") {
                const value = item.value || item.name || String(item.id || "");
                const id = item.id || item.value || "";
                return value ? { id, value: String(value) } : null;
              }
              return null;
            })
            .filter((item): item is ListItem => item !== null);
        };

        setItemList(parseListItems(items));
        setWorkCodeList(parseListItems(codes));
        setOthersList(parseListItems(others));
      } catch (err: any) {
        console.error("Failed to fetch dropdown lists:", err);
        setError(err?.message || "Failed to fetch lists");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, []);

  return {
    itemList,
    workCodeList,
    othersList,
    isLoading,
    error,
  };
}
