import React from "react";

interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  isLoading: boolean; // Indicates if initial loading
  isFetching: boolean; // Indicates if data is being fetched (e.g., pagination)
  isPending: boolean; // Any other pending state, like action completion
  skeletonRowCount?: number; // Number of skeleton rows to display
}

const Table = <T,>({
  data = [],
  columns,
  isLoading,
  isFetching,
  isPending,
  skeletonRowCount = 5,
}: TableProps<T>) => {
  const showSkeleton = isLoading || isFetching || isPending;

  return (
    <div className="overflow-x-auto rounded-lg border border-stroke bg-white px-0 pb-2.5 pt-2 shadow-default xl:pb-1">
      <table className="w-full table-auto rounded-xl">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {columns.map((column: any, index: number) => (
              <th
                key={index}
                className={`px-4 py-4 font-medium text-black dark:text-white ${
                  column.className || ""
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {showSkeleton ? (
            Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column: any, colIndex: number) => (
                  <td key={colIndex} className="animate-pulse px-2 py-3">
                    <div className="h-10 w-48 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-500 dark:text-gray-300"
              >
                No data found
              </td>
            </tr>
          ) : (
            data.map((row: any, rowIndex: number) => (
              <tr key={rowIndex}>
                {columns.map((column: any, colIndex: number) => {
                  const content: React.ReactNode =
                    typeof column.accessor === "function"
                      ? column.accessor(row)
                      : (row[column.accessor] as React.ReactNode);

                  return (
                    <td
                      key={colIndex}
                      className="border-b border-[#eee] px-4 py-4 dark:border-strokedark"
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
