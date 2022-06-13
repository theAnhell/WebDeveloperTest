import styles from "./Table.module.css";
import { useTable, usePagination } from "react-table";
import { Select } from "../../UI/Select/Select";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaPen,
  FaTrash,
} from "react-icons/fa";
import { Button } from "../../UI/Button/Button";
import { Actions } from "../../UI/Actions/Actions";

export type ColumnsTable = {
  Header: string;
  accessor: string;
};

interface TableProps {
  data: any[];
  columns: ColumnsTable[];
}

export const Table: React.FC<TableProps> = (props) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: props.columns,
      data: props.data,
      autoResetPage: false,
    },
    usePagination
  );

  if (!Array.isArray(props.data) || props.data.length === 0) {
    return <div>No hay informacion</div>;
  }

  const options = [5, 10, 15, 20].map((pageSize) => ({
    value: pageSize,
    text: pageSize.toString(),
  }));

  return (
    <div className={styles.Wrapper}>
      <table className={styles.Table} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  console.log(cell.render("Cell"), index, cell);
                  if (typeof cell.value === "object") {
                    const val: {
                      editHandler: () => void;
                      deleteHandler: () => void;
                    } = { ...cell.value };
                    return (
                      <td {...cell.getCellProps()}>
                        <Actions>
                          <Button
                            type="button"
                            icon={FaPen}
                            color="black"
                            onClick={val.editHandler}
                          />
                          <Button
                            type="button"
                            color="black"
                            icon={FaTrash}
                            onClick={val.deleteHandler}
                          />
                        </Actions>
                      </td>
                    );
                  }
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles.Pagination}>
        <div className={styles.Row}>
          <Button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            icon={FaAngleDoubleLeft}
          />
          <Button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            icon={FaAngleLeft}
          />
          <Button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            icon={FaAngleRight}
          />
          <Button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            icon={FaAngleDoubleRight}
          />
        </div>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>{" "}
          | Users: {rows.length}
        </span>

        <Select
          value={pageSize}
          options={options}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        />
      </div>
    </div>
  );
};
