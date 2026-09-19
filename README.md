# Localizador de Produtos

Sistema web para localização de produtos em um estoque físico. A aplicação consome dados de uma planilha do **Google Sheets** e exibe para o usuário onde cada produto está guardado (prateleira, coluna, fileira, lado), além de permitir buscas por nome e filtros por categoria.

> **Resumo**: a planilha é a fonte da verdade — adicionar, editar e remover produtos é feito diretamente lá. A aplicação é responsável por leitura, busca, filtros e exibição.

---

## Sumário

- [Visão geral](#visão-geral)
- [Stack](#stack)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Como funciona (fluxo de dados)](#como-funciona-fluxo-de-dados)
- [Configurando a planilha no Google Sheets](#configurando-a-planilha-no-google-sheets)
- [Instalação e execução](#instalação-e-execução)
- [Como usar a aplicação](#como-usar-a-aplicação)
- [Modelo de dados (Data)](#modelo-de-dados-data)
- [Configuração de categorias](#configuração-de-categorias)
- [Adicionando novas categorias](#adicionando-novas-categorias)
- [Tratamento de erros](#tratamento-de-erros)
- [Build de produção](#build-de-produção)
- [Testes](#testes)
- [Limitações conhecidas](#limitações-conhecidas)
- [Próximos passos sugeridos](#próximos-passos-sugeridos)

---

## Visão geral

O **Localizador de Produtos** foi criado para resolver um problema simples: encontrar rapidamente onde um item está no estoque. Em vez de conferir prateleira por prateleira, o usuário digita o nome do produto (ou usa um filtro de categoria) e a aplicação retorna a localização completa — prateleira, coluna, fileira e lado — junto com a imagem de referência.

A gestão do catálogo é feita inteiramente em uma planilha do Google Sheets, o que permite que qualquer pessoa com acesso ao documento mantenha o estoque atualizado **sem precisar mexer no código**.

---

## Stack

| Camada           | Tecnologia                                       |
| ---------------- | ------------------------------------------------ |
| Framework        | [Next.js 16](https://nextjs.org) (App Router)    |
| UI               | React 19 + CSS Modules                           |
| Ícones           | [Font Awesome](https://fontawesome.com) (React)  |
| Fonte            | Inter (via `next/font/google`)                   |
| Linguagem        | TypeScript                                       |
| Fonte de dados   | Google Sheets (publicado como JSON via Apps Script / endpoint) |
| Lint             | ESLint com `eslint-config-next`                  |

---

## Estrutura de pastas

```
localizador-de-produtos/
├── public/
│   └── logo.png
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css         # estilos globais e variáveis CSS
│   │   ├── layout.tsx          # layout raiz + SearchProvider
│   │   ├── page.module.css
│   │   └── page.tsx            # página inicial (Search + Products)
│   ├── components/
│   │   ├── products/
│   │   │   ├── Products.module.css
│   │   │   └── Products.tsx    # listagem + estados (loading/erro/vazio)
│   │   ├── search/
│   │   │   ├── Search.module.css
│   │   │   └── Search.tsx      # barra de busca + filtros por categoria
│   │   └── table/
│   │       ├── Table.module.css
│   │       └── Table.tsx       # cartão com a localização do produto
│   ├── contexts/
│   │   └── DataContext.tsx     # estado global (search/loading/error)
│   └── utils/
│       └── fetchData.ts        # tipagem + fetch da planilha
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Como funciona (fluxo de dados)

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Google Sheets   │ ──► │  Endpoint JSON   │ ──► │  Aplicação Next  │
│  (cadastro)      │     │  (fetchData.ts)  │     │  (UI + filtros)  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
        ▲                                                    │
        │                                                    ▼
   edição manual                                  Search + Products
                                                  exibem resultados
```

1. A planilha do Google Sheets é publicada como JSON através de um *Apps Script* (ou similar), expondo uma URL.
2. `src/utils/fetchData.ts` faz um `fetch()` para essa URL no carregamento da página.
3. O JSON retornado é tipado como `Data[]` (`Produto`, `Prateleira`, `Coluna`, `Fileira`, `Lado`, `Imagem`, `Categoria`).
4. `Search` mantém os dados em estado local e popula o contexto global (`SearchProvider`) com o resultado da busca ou categoria.
5. `Products` consome o contexto e renderiza um `Table` por produto.

---

## Configurando a planilha no Google Sheets

A URL da API está fixa em `src/utils/fetchData.ts`:

```ts
const url = "https://script.googleusercontent.com/macros/echo?user_content_key=...";
```

### Estrutura esperada da planilha

A planilha precisa ter **uma linha de cabeçalho** e as colunas abaixo (os nomes devem ser **idênticos**, sem acentos diferentes):

| Produto | Prateleira | Coluna | Fileira | Lado | Imagem | Categoria |
| ------- | ---------- | ------ | ------- | ---- | ------ | --------- |
| Cano PVC 100mm | 3 | A | 2 | Esquerdo | https://... | conexoes hidraulicas |
| Tomada 10A     | 1 | C | 5 | Direito   | https://... | eletrica |

### Tipos

- **Produto** — texto
- **Prateleira** — número inteiro
- **Coluna** — texto (letra ou código curto)
- **Fileira** — número inteiro
- **Lado** — texto (ex.: `Esquerdo`, `Direito`)
- **Imagem** — URL pública de uma imagem
- **Categoria** — texto em **minúsculas e sem acentos** (é normalizado antes de comparar). Valores suportados hoje: `conexoes hidraulicas`, `eletrica`, `ferramentas`, `banheiro`

### Para trocar a URL da planilha

1. Publique sua planilha (Apps Script ou ferramenta equivalente) e gere a URL JSON.
2. Abra `src/utils/fetchData.ts`.
3. Substitua o valor da constante `url` pela nova URL.

---

## Instalação e execução

### Pré-requisitos

- **Node.js 18+**
- **npm** (ou yarn / pnpm / bun)

### Passo a passo

```bash
# 1. instalar dependências
npm install

# 2. subir o servidor de desenvolvimento
npm run dev
```

A aplicação ficará disponível em <http://localhost:3000>.

### Outros scripts

```bash
npm run lint    # ESLint
npm run build   # build de produção
npm run start   # serve a build de produção
```

---

## Como usar a aplicação

Ao abrir a página, três coisas acontecem automaticamente:

1. A planilha é consultada.
2. A categoria **Todos** é selecionada, exibindo todos os produtos.
3. Cada produto é mostrado em um cartão com:

   - Nome
   - **Prateleira** (número)
   - **Coluna** (letra/código)
   - **Fileira** (número)
   - **Lado** (esquerdo/direito)
   - **Imagem** de referência

### Buscar por produto

Digite o nome (ou parte dele) na barra de busca e pressione Enter / clique na lupa.

- A busca é **case-insensitive**.
- A busca **ignora acentos** (`cano` encontra `Cano`).
- Se nada for encontrado, a aplicação exibe *“Produto ou categoria não encontrado(a) ❌”*.

### Filtrar por categoria

Os botões abaixo da busca aplicam filtros fixos:

- **Todos** — lista tudo.
- **Conexões Hidráulicas** — categoria `conexoes hidraulicas`.
- **Elétrica** — categoria `eletrica`.
- **Ferramentas** — categoria `ferramentas`.
- **Banheiro** — categoria `banheiro`.

> A categoria ativa fica destacada visualmente.

---

## Modelo de dados (Data)

`src/utils/fetchData.ts` define o tipo:

```ts
export type Data = {
    Produto:    string;
    Prateleira: number;
    Coluna:     string;
    Fileira:    number;
    Lado:       string;
    Imagem:     string;
    Categoria:  string;
};
```

Como as chaves vêm com a primeira letra maiúscula da planilha, mantenha a mesma capitalização para evitar divergências.

---

## Configuração de categorias

As categorias estão implementadas como um `switch` em `src/components/search/Search.tsx`, dentro da função `putCategory`:

```ts
case "conexoes hidraulicas":
    const conexoes_hidraulicas = data?.filter(d =>
        normalize(d.Categoria).includes(category))
    ...
```

Ambas as pontas precisam bater:

1. **Planilha**: o valor da coluna `Categoria` (em minúsculas, sem acento).
2. **Código**: o `case "..."` do switch.

> A função `normalize` remove acentos (`"Conexões Hidráulicas"` → `"conexoes hidraulicas"`) e coloca em minúsculas — o que você digitar na planilha precisa estar em **minúsculas e sem acento** para casar com o `case`.

---

## Adicionando novas categorias

1. Adicione a categoria na planilha (em minúsculas, sem acentos).
2. Em `src/components/search/Search.tsx`, dentro de `putCategory()`, acrescente um novo `case`:

   ```ts
   case "sua nova categoria":
       const nova_cat = data?.filter(d =>
           normalize(d.Categoria).includes(category))
       if (nova_cat.length === 0) {
           setSearch(responseFalse)
           return
       }
       setSearch(nova_cat)
       return;
   ```

3. No JSX (`Search.tsx`), adicione o botão correspondente na barra de categorias:

   ```tsx
   <button onClick={() => setCategory("sua nova categoria")}
           style={{ backgroundColor: category === "sua nova categoria" ? "var(--bg-color-3)" : "" }}>
       Nome Amigável
   </button>
   ```

---

## Tratamento de erros

A aplicação cobre os seguintes cenários em `Products.tsx`:

| Situação                                | Mensagem exibida                                              |
| --------------------------------------- | ------------------------------------------------------------- |
| API indisponível / erro de rede         | *“Não foi possível acessar a API ❌”*                         |
| Carregando                              | *“Carregando produtos...”*                                    |
| Categoria vazia / busca sem resultados  | *“Produto ou categoria não encontrado(a) ❌”*                 |
| Planilha vazia / nada veio da API       | *“Dados não encontrados ❌”*                                  |

Os estados são controlados em `src/contexts/DataContext.tsx` (`loading`, `error`) e populados em `src/components/search/Search.tsx` após o `fetch`.

---

## Build de produção

```bash
npm run build
npm run start
```

Por padrão, a aplicação sobe na porta **3000**. Para mudar, use `PORT=4000 npm run start` (Linux/macOS) ou `set PORT=4000 && npm run start` (Windows).

Para deploy, a recomendação oficial é a **[Vercel](https://vercel.com/new)** — basta conectar o repositório e ela detecta o Next.js automaticamente.

---

## Testes

A suíte usa **Jest 29** + **@testing-library/react 16** + **@testing-library/user-event 14** com `jsdom`. Os testes ficam co-localizados com o código (`*.test.ts(x)`).

### Comandos

```bash
npm test              # roda toda a suite
npm run test:watch     # modo watch
npm run test:coverage  # com cobertura
```

### Cobertura

| Arquivo                                  | Tipo            | O que valida                                                               |
| ---------------------------------------- | --------------- | -------------------------------------------------------------------------- |
| `src/utils/fetchData.test.ts`            | **Unitário**    | `fetchData` com `fetch` mockado: sucesso, `!ok`, exceção                   |
| `src/contexts/DataContext.test.tsx`      | **Unitário**    | Estado inicial, setters e erro quando usado fora do Provider               |
| `src/components/table/Table.test.tsx`    | **Integração**  | Renderização do cartão com nome, células e imagem                          |
| `src/components/products/Products.test.tsx` | **Integração** | Todos os estados da UI: erro, loading, vazio, sentinela `none`, resultados |
| `src/components/search/Search.test.tsx`  | **Integração**  | Carga inicial, busca por Enter, filtros de categoria, erro da API          |

### Detalhes importantes

- **Mocks do `fetch`**: o `fetchData` é mockado direto em `global.fetch`.
- **CSS Modules**: mapeados para `tests/styleMock.js` (objeto vazio) via `moduleNameMapper` no `jest.config.js`.
- **Mocks do Font Awesome**: o ícone de lupa renderiza normalmente em `jsdom`, sem mock extra.
- **Testes de interação**: usamos `@testing-library/user-event` (simula interação real, com `type`, `click`, `Enter` etc).
- **`SearchProvider`** é renderizado em volta dos componentes que dependem do contexto. Para evitar loops de re-render ao "semear" o contexto nos testes do `Products`, o seeding é feito em `useLayoutEffect` com dependências vazias.

Total: **5 suites · 25 testes**.

---

## Limitações conhecidas

- A URL da planilha está **hardcoded** — não há UI para trocar a fonte de dados em tempo de execução.
- Categorias são adicionadas **manualmente no código** (veja a seção *Adicionando novas categorias*).
- Não há cache do lado do cliente: cada reload faz uma nova request à planilha.
- Não há paginação: se a planilha tiver milhares de linhas, a renderização pode ficar lenta.
- A busca faz `String.prototype.includes`, então é muito permissiva — não há ordenação por relevância.

---

## Próximos passos sugeridos

- Mover a URL do endpoint para variável de ambiente (`.env.local`) com `NEXT_PUBLIC_SHEETS_URL`.
- Internacionalizar mensagens de erro/loading.
- Adicionar ordenação (por prateleira, alfabética, etc.).
- Adicionar cache com `useSWR` ou `React Query`.
- Persistir a categoria ativa na URL (deep linking).
- Testes unitários com Vitest/Jest para `Search`, `Products` e `fetchData`.

---

## Licença

Projeto privado — uso interno. Adapte esta seção conforme necessário.
