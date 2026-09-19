import { renderHook, act } from "@testing-library/react";
import {
  SearchProvider,
  useSearch,
} from "@/contexts/DataContext";
import { Data } from "@/utils/fetchData";
import { ReactNode } from "react";

const sample: Data[] = [
  {
    Produto: "Cano PVC",
    Prateleira: 3,
    Coluna: "A",
    Fileira: 2,
    Lado: "Esquerdo",
    Imagem: "https://example.com/cano.png",
    Categoria: "conexoes hidraulicas",
  },
];

const wrapper = ({ children }: { children: ReactNode }) => (
  <SearchProvider>{children}</SearchProvider>
);

describe("SearchProvider / useSearch (unit)", () => {
  it("inicia com loading=true, error=null e search vazio", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(result.current.search).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("atualiza search via setSearch", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setSearch(sample);
    });

    expect(result.current.search).toEqual(sample);
  });

  it("atualiza loading via setLoading", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.loading).toBe(false);
  });

  it("atualiza error via setError", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setError("Falha de rede");
    });

    expect(result.current.error).toBe("Falha de rede");
  });

  it("lança erro quando usado fora do provider", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useSearch())).toThrow(
      /useSearch deve ser usado dentro de SearchProvider/,
    );

    consoleSpy.mockRestore();
  });
});
