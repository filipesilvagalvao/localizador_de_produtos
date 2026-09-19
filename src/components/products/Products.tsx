"use client"
import Table from "../table/Table";
import styles from "./Products.module.css"
import { useSearch } from "@/contexts/DataContext";

function Products() {
  const { search, loading, error } = useSearch();

  if (error) {
    return (
      <section className={styles.products}>
        <p className={styles.product__messageSearch}>{error}</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className={styles.products}>
        <p className={styles.product__messageSearch}>Carregando produtos...</p>
      </section>
    );
  }

  if (search.length === 0) {
    return (
      <section className={styles.products}>
        <p className={styles.product__messageSearch}>Dados não encontrados ❌</p>
      </section>
    );
  }

  if (search[0]?.Produto === "none") {
    return (
      <section className={styles.products}>
        <p className={styles.product__messageSearch}>Produto ou categoria não encontrado(a) ❌</p>
      </section>
    );
  }

  return (
    <section className={styles.products}>
      {search.map((d) => (
        <Table
          key={d.Produto + d.Prateleira + d.Coluna}
          column={d.Coluna}
          product={d.Produto}
          row={d.Fileira}
          shelf={d.Prateleira}
          side={d.Lado}
          img={d.Imagem}
        />
      ))}
    </section>
  );
}

export default Products
