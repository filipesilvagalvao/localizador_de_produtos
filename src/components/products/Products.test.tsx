import { render, screen } from "@testing-library/react";
import { useLayoutEffect } from "react";
import Products from "./Products";
import { SearchProvider, useSearch } from "@/contexts/DataContext";
import { Data } from "@/utils/fetchData";

const sample: Data[] = [
  {
    Produto: "Cano PVC 100mm",
    Prateleira: 3,
    Coluna: "A",
    Fileira: 2,
    Lado: "Esquerdo",
    Imagem: "https://example.com/cano.png",
    Categoria: "conexoes hidraulicas",
  },
  {
    Produto: "Tomada 10A",
    Prateleira: 1,
    Coluna: "C",
    Fileira: 5,
    Lado: "Direito",
    Imagem: "https://example.com/tomada.png",
    Categoria: "eletrica",
  },
];

const responseFalse: Data[] = [
  {
    Produto: "none",
    Prateleira: 0,
    Coluna: "none",
    Fileira: 0,
    Lado: "none",
    Imagem: "none",
    Categoria: "none",
  },
];

type SeedProps = {
  search: Data[];
  loading: boolean;
  error: string | null;
};

function ContextSeed(props: SeedProps) {
  const { setSearch, setLoading, setError } = useSearch();

  useLayoutEffect(() => {
    setSearch(props.search);
    setLoading(props.loading);
    setError(props.error);
  }, []);

  return null;
}

function renderWithState(props: SeedProps) {
  return render(
    <SearchProvider>
      <ContextSeed {...props} />
      <Products />
    </SearchProvider>,
  );
}

describe("<Products /> (integration)", () => {
  it("mostra mensagem de erro quando a API falha", () => {
    renderWithState({ search: [], loading: false, error: "API fora do ar ❌" });
    expect(screen.getByText("API fora do ar ❌")).toBeInTheDocument();
  });

  it("mostra mensagem de carregando enquanto loading=true", () => {
    renderWithState({ search: [], loading: true, error: null });
    expect(screen.getByText("Carregando produtos...")).toBeInTheDocument();
  });

  it("mostra 'Dados não encontrados' quando search vazio e sem loading", () => {
    renderWithState({ search: [], loading: false, error: null });
    expect(screen.getByText("Dados não encontrados ❌")).toBeInTheDocument();
  });

  it("mostra 'Produto ou categoria não encontrado' quando Produto=none", () => {
    renderWithState({ search: responseFalse, loading: false, error: null });
    expect(
      screen.getByText("Produto ou categoria não encontrado(a) ❌"),
    ).toBeInTheDocument();
  });

  it("renderiza um Table para cada produto quando há resultados", () => {
    renderWithState({ search: sample, loading: false, error: null });

    expect(screen.getByText("Cano PVC 100mm")).toBeInTheDocument();
    expect(screen.getByText("Tomada 10A")).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });
});
