import styles from "./Table.module.css"
type tableProps = {
    product: string,
    shelf: number,
    column: string,
    row: number,
    side: string,
    img: string
}

function Table({ product, shelf, column, row, side, img }: tableProps) {
    return (
        <div className={styles.table__wrapper}>
            <table className={styles.table}>
                <thead className={styles.table__header}>
                    <tr className={styles.table__headerLine}>
                        <th>Produto</th>
                        <th>Prateleira</th>
                        <th>Coluna</th>
                        <th>Fileira</th>
                        <th>Lado</th>
                    </tr>
                </thead>
                <tbody className={styles.table_body}>
                    <tr className={styles.table__bodyLine}>
                        <td>{product}</td>
                        <td>{shelf}</td>
                        <td>{column}</td>
                        <td>{row}</td>
                        <td>{side}</td>
                    </tr>
                </tbody>
            </table>
            <div className={styles.table__img}>
                <img src={img} alt={product} />
            </div>
        </div>
    )
}

export default Table