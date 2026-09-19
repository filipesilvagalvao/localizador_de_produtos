"use client"

import { createContext, useContext, useState } from "react"
import { Data } from "@/utils/fetchData";

type SearchContextType = {
    search:Data[],
    setSearch:(value:Data[])=>void,
    loading:boolean,
    setLoading:(value:boolean)=>void,
    error:string | null,
    setError:(value:string | null)=>void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({children}:{children: React.ReactNode}){
    const [search,setSearch] = useState<Data[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);

    return (
        <SearchContext.Provider value={{search,setSearch,loading,setLoading,error,setError}}>
            {children}
        </SearchContext.Provider>
    )
}

export function useSearch() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch deve ser usado dentro de SearchProvider");
  }

  return context;
}