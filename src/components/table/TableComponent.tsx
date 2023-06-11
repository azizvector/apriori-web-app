import classNames from 'classnames';

interface IHeaders {
  fieldId: string;
  label: string;
  renderItem?: (item: any) => React.ReactElement | string;
}

interface ITable {
  data?: any[];
  headers: IHeaders[];
  loading?: boolean;
  error?: string;
  action?: boolean;
  onRowClick?: (item: any) => void;
}

export function Table({
  data,
  headers,
  loading,
  error,
  action,
  onRowClick
}: ITable): React.ReactElement {

  const handleRowClick = (item: any) => {
    if (onRowClick) {
      onRowClick(item);
    }
  }

  return (
    <table className="min-w-full">
      <thead className="bg-[#D8E5F3]">
        <tr className="divide-x divide-[#BDBDBD]">
          {headers.map((header, index) => (
            <th
              key={index}
              scope="col"
              className={classNames(
                "p-4 text-center whitespace-nowrap text-sm font-semibold text-[#274C77] uppercase", {
                'w-12': header.fieldId === 'index'
              })}
            >
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white sticky top-0">
        {loading && (
          <tr className="divide-x divide-[#BDBDBD]">
            <td
              colSpan={headers.length}
              className="p-4 text-center whitespace-nowrap text-sm text-[#201B1C]"
            >
              Loading...
            </td>
          </tr>
        )}
        {error && (
          <tr className="divide-x divide-[#BDBDBD]">
            <td
              colSpan={headers.length}
              className="p-4 text-center whitespace-nowrap text-sm text-[#201B1C]"
            >
              {error}
            </td>
          </tr>
        )}
        {!loading && !error && !data && (
          <tr className="divide-x divide-[#BDBDBD]">
            <td
              colSpan={headers.length}
              className="p-4 text-center whitespace-nowrap text-sm text-[#201B1C]"
            >
              No Data
            </td>
          </tr>
        )}
        {!loading && !error && data && data?.map((item, row) => (
          <tr
            key={row}
            onClick={() => handleRowClick(item)}
            role={action ? 'button' : undefined}
            className={classNames(
              'divide-x divide-[#BDBDBD]', {
              'hover:bg-gray-200 cursor-pointer': action
            })}
          >
            {headers.map((header, col) => (
              <td
                key={col}
                className="p-4 text-center whitespace-nowrap text-sm leading-7 text-[#201B1C]"
              >
                {header.fieldId === 'index' && row + 1}
                {!header.renderItem && item[header.fieldId]}
                {header.renderItem && header.renderItem(item[header.fieldId])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
