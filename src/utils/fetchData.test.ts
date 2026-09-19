import fetchData, { Data } from "./fetchData";

describe("fetchData (unit)", () => {
  const mockData: Data[] = [
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

  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("retorna os dados quando a resposta é ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const result = await fetchData();

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("retorna null quando a resposta não é ok", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn(),
    });

    const result = await fetchData();

    expect(result).toBeNull();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("500"));
  });

  it("retorna null quando fetch lança exceção", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    global.fetch = jest.fn().mockRejectedValue(new Error("network down"));

    const result = await fetchData();

    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
  });
});
