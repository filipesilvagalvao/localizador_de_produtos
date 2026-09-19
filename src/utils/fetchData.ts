export type Data = {
    "Produto":string,
    "Prateleira":number,
    "Coluna":string,
    "Fileira":number,
    "Lado":string,
    "Imagem":string,
    "Categoria":string
}
const url = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnSLkDtJF1q1wBYildutnIfqOu4kmq2ofGBvIeePAzGoXmt-8ypdK-_9yv4GZezSYA7vunEVI66k5QqvfYEpSAtr3bNrMAfbszo61XSbS5NBK3lVVE9hy1-83ia_VQ3qfoM33XPpxrVVfvlo2AUIc7eRbUFK7KVYJfvXOPFfr1zMPwFCOlN48NBdbjnqQ5WX8e9sljuIjMGvm1l4rZ4URUMFTKNjGqHtyU2BgGWb0BjdEWH2EGSgr2UDP9oDkat5POkN1b-Wkf_TXpp6wnw&lib=MdcZ2CZz8c9hwZoyL2lrXBkocwecTXvh3"

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