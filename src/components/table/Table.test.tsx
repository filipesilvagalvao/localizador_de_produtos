import { render, screen } from "@testing-library/react";
import Table from "./Table";

describe("<Table /> (integration)", () => {
  const props = {
    product: "Cano PVC 100mm",
    shelf: 3,
    column: "A",
    row: 2,
    side: "Esquerdo",
    img: "https://example.com/cano.png",
  };

  it("renderiza o nome do produto", () => {
    render(<Table {...props} />);
    expect(screen.getByText("Cano PVC 100mm")).toBeInTheDocument();
  });

  it("renderiza prateleira, coluna, fileira e lado", () => {
    render(<Table {...props} />);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Esquerdo")).toBeInTheDocument();
  });

  it("renderiza a imagem com src e alt corretos", () => {
    render(<Table {...props} />);
    const img = screen.getByRole("img", { name: "Cano PVC 100mm" });
    expect(img).toHaveAttribute("src", "https://example.com/cano.png");
  });

  it("renderiza todos os cabeçalhos da tabela", () => {
    render(<Table {...props} />);
    expect(screen.getByText("Produto")).toBeInTheDocument();
    expect(screen.getByText("Prateleira")).toBeInTheDocument();
    expect(screen.getByText("Coluna")).toBeInTheDocument();
    expect(screen.getByText("Fileira")).toBeInTheDocument();
    expect(screen.getByText("Lado")).toBeInTheDocument();
  });
});
