import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import Search from "./Search";
import { SearchProvider, useSearch } from "@/contexts/DataContext";
import fetchData, { Data } from "@/utils/fetchData";

jest.mock("@/utils/fetchData", () => {
  const actual = jest.requireActual("@/utils/fetchData");
  return {
    __esModule: true,
    ...actual,
    default: jest.fn(),
  };
});

const mockFetchData = fetchData as jest.MockedFunction<typeof fetchData>;

const fixture: Data[] = [
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
    Produto: "Cano PVC 50mm",
    Prateleira: 3,
    Coluna: "B",
    Fileira: 1,
    Lado: "Direito",
    Imagem: "https://example.com/cano2.png",
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
  {
    Produto: "Furadeira Bosch",
    Prateleira: 2,
    Coluna: "A",
    Fileira: 1,
    Lado: "Esquerdo",
    Imagem: "https://example.com/furadeira.png",
    Categoria: "ferramentas",
  },
];

let latestSearch: Data[] = [];
let latestError: string | null = null;
let latestLoading = true;

function ContextSpy() {
  const { search, error, loading } = useSearch();
  useEffect(() => {
    latestSearch = search;
    latestError = error;
    latestLoading = loading;
  });
  return null;
}

function renderSearch() {
  return render(
    <SearchProvider>
      <ContextSpy />
      <Search />
    </SearchProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  latestSearch = [];
  latestError = null;
  latestLoading = true;
});

describe("Search (integration)", () => {
  it("carrega todos os produtos ao montar (categoria todos)", async () => {
    mockFetchData.mockResolvedValue(fixture);

    renderSearch();

    await waitFor(() => expect(latestSearch).toHaveLength(4));

    expect(latestError).toBeNull();
    expect(latestLoading).toBe(false);
  });

  it("define error quando fetchData retorna null", async () => {
    mockFetchData.mockResolvedValue(null);

    renderSearch();

    await waitFor(() => expect(latestLoading).toBe(false));
    await waitFor(() => expect(latestError).not.toBeNull());

    expect(latestError).toMatch(/n.o foi poss.vel acessar a api/i);
  });

  it("filtra produtos ao submeter busca por Enter", async () => {
    mockFetchData.mockResolvedValue(fixture);
    const user = userEvent.setup();

    renderSearch();
    await waitFor(() => expect(latestLoading).toBe(false));

    const input = screen.getByPlaceholderText(/persquisar por produto/i);
    await user.type(input, "cano{enter}");

    await waitFor(() => expect(latestSearch).toHaveLength(2));
    expect(latestSearch.every((p) => p.Produto.includes("Cano"))).toBe(true);
  });

  it("retorna sentinela none quando busca nao encontra nada", async () => {
    mockFetchData.mockResolvedValue(fixture);
    const user = userEvent.setup();

    renderSearch();
    await waitFor(() => expect(latestLoading).toBe(false));

    const input = screen.getByPlaceholderText(/persquisar por produto/i);
    await user.type(input, "xyzzz{enter}");

    await waitFor(() => expect(latestSearch).toHaveLength(1));
    expect(latestSearch[0].Produto).toBe("none");
  });

  it("filtra por categoria Eletrica ao clicar no botao", async () => {
    mockFetchData.mockResolvedValue(fixture);
    const user = userEvent.setup();

    renderSearch();
    await waitFor(() => expect(latestLoading).toBe(false));

    await user.click(screen.getByText("Elétrica"));

    await waitFor(() => expect(latestSearch).toHaveLength(1));
    expect(latestSearch[0].Produto).toBe("Tomada 10A");
  });

  it("filtra por categoria Ferramentas ao clicar no botao", async () => {
    mockFetchData.mockResolvedValue(fixture);
    const user = userEvent.setup();

    renderSearch();
    await waitFor(() => expect(latestLoading).toBe(false));

    await user.click(screen.getByText("Ferramentas"));

    await waitFor(() => expect(latestSearch).toHaveLength(1));
    expect(latestSearch[0].Produto).toBe("Furadeira Bosch");
  });

  it("filtra por categoria Conexoes Hidraulicas ao clicar no botao", async () => {
    mockFetchData.mockResolvedValue(fixture);
    const user = userEvent.setup();

    renderSearch();
    await waitFor(() => expect(latestLoading).toBe(false));

    await user.click(screen.getByText("Conexões Hidráulicas"));

    await waitFor(() => expect(latestSearch).toHaveLength(2));
    expect(
      latestSearch.every((p) => p.Categoria === "conexoes hidraulicas"),
    ).toBe(true);
  });

  it("volta para todos os produtos ao clicar em Todos", async () => {
    mockFetchData.mockResolvedValue(fixture);
    const user = userEvent.setup();

    renderSearch();
    await waitFor(() => expect(latestLoading).toBe(false));

    await user.click(screen.getByText("Elétrica"));
    await waitFor(() => expect(latestSearch).toHaveLength(1));

    await user.click(screen.getByText("Todos"));

    await waitFor(() => expect(latestSearch).toHaveLength(4));
  });
});
