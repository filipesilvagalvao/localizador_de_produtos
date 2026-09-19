"use client"
import { useState, SyntheticEvent, useEffect } from "react"
import styles from "./Search.module.css"
import fetchData, { Data } from "@/utils/fetchData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSearch } from "@/contexts/DataContext";

function Search() {
    const { setSearch, setLoading, setError } = useSearch(); //função que serve para armazenar o resultado pesquisado e coloca isso em global

    const [data, setData] = useState<Data[]>([]);
    const [term, setTerm] = useState("");//useState para capturar o termo escrito
    const [category, setCategory] = useState("")

    //useEffect para puxar todos os dados inicialmente puxados pela função fetchData(), pega tudo oque há na planilha
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            setError(null);
            const data = await fetchData();
            if (!data) {
                setError("Não foi possível acessar a API ❌");
                setLoading(false);
                return;
            }
            setData(data);
            setCategory("todos")
            setLoading(false);
        }
        loadData();
    }, []);

    const normalize = (str: string) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

    const responseFalse = [
        {
            Produto: "none",
            Prateleira: 0,
            Coluna: "none",
            Fileira: 0,
            Lado: "none",
            Imagem: "none",
            Categoria: "none"
        }
    ]

    //função que pega o termo pesquisado, filtra e veririfica se há em data e coloca no state global "search"
    const getSearch = (e: SyntheticEvent) => {

        e.preventDefault()

        const normalizedTerm = normalize(term)
        const result = data?.filter(d => normalize(d.Produto).includes(normalizedTerm))

        if (result.length === 0) {
            setSearch(
                responseFalse
            )
            return
        }

        setSearch(result)

    }

    const putCategory = () => {
        switch (category) {
            case "todos":
                setSearch(data)
                return;

            case "conexoes hidraulicas":
                const conexoes_hidraulicas = data?.filter(d => normalize(d.Categoria).includes(category))
                if (conexoes_hidraulicas.length === 0) {
                    setSearch(
                        responseFalse
                    )
                    return
                }
                setSearch(conexoes_hidraulicas)
                return;

            case "eletrica":
                const eletrica = data?.filter(d => normalize(d.Categoria).includes(category))
                if (eletrica.length === 0) {
                    setSearch(
                        responseFalse
                    )
                    return
                }
                setSearch(eletrica)
                return;

            case "ferramentas":
                const ferramentas = data?.filter(d => normalize(d.Categoria).includes(category))
                if (ferramentas.length === 0) {
                    setSearch(
                        responseFalse
                    )
                    return
                }
                setSearch(ferramentas)
                return;

            case "banheiro":
                const banheiro = data?.filter(d => normalize(d.Categoria).includes(category))
                if (banheiro.length === 0) {
                    setSearch(
                        responseFalse
                    )
                    return
                }
                setSearch(banheiro)
                return;

            default:
                break;
        }
    }

    useEffect(() => {
        if (data && data.length > 0) putCategory()
    }, [category])

    return (
        <>
            <form className={styles.search} onSubmit={getSearch}>

                <input
                    type="search"
                    onChange={(e) => setTerm(e.target.value)}
                    value={term}
                    className={styles.search__bar}
                    placeholder="persquisar por produto..."
                    required
                />

                <button
                    className={styles.search__btn}
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>

            </form>

            <div className={styles.search__category}>
                <button onClick={() => setCategory("todos")} style={{backgroundColor: category === "todos"?"var(--bg-color-3)":" "}}>Todos</button>
                <span>/</span>
                <button onClick={() => setCategory("conexoes hidraulicas")} style={{backgroundColor: category === "conexoes hidraulicas"?"var(--bg-color-3)":" "}}>Conexões Hidráulicas</button>
                <span>/</span>
                <button onClick={() => setCategory("eletrica")} style={{backgroundColor: category === "eletrica"?"var(--bg-color-3)":" "}}>Elétrica</button>
                <span>/</span>
                <button onClick={() => setCategory("ferramentas")} style={{backgroundColor: category === "ferramentas"?"var(--bg-color-3)":" "}}>Ferramentas</button>
                <span>/</span>
                <button onClick={() => setCategory("banheiro")} style={{backgroundColor: category === "banheiro"?"var(--bg-color-3)":" "}}>Banheiro</button>
            </div>
        </>
    )
}

export default Search