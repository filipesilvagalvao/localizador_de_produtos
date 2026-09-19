import Products from "@/components/products/Products";
import Search from "@/components/search/Search";

const BASE_PATH = "/localizador_de_produtos";

export default function Home() {
  return (
    <main>
      <h1 className="logo">
        <img src={`${BASE_PATH}/logo.png`} alt="logo" />
        <span>Sistema de localização de produtos</span>
      </h1>
      <Search />
      <Products />
    </main>
  );
}
