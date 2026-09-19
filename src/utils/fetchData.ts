export type Data = {
    "Produto":string,
    "Prateleira":number,
    "Coluna":string,
    "Fileira":number,
    "Lado":string,
    "Imagem":string,
    "Categoria":string
}
const url = process.env.NEXT_PUBLIC_API_URL as string

const fetchData = async(): Promise<Data[] | null> =>{
    try {
        const response = await fetch(url);
        if(!response.ok){
            console.log("Falhou ao solicitar dados "+ response.status)
            return null;
        }
        const json = await response.json();
        return json as Data[];
    } catch (error) {
        console.error(error)
        return null;
    }
}

export default fetchData