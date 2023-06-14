import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { Tooltip } from 'react-tooltip';

interface IHeaders {
  fieldId: string;
  label: string;
  renderItem?: (item: any, index: number) => React.ReactElement | string;
  width?: number;
}

interface ITable {
  data?: any[];
  headers: IHeaders[];
  loading?: boolean;
  error?: string;
  action?: boolean;
  truncate?: boolean;
  onRowClick?: (item: any) => void;
}

export function Table({
  data,
  headers,
  loading,
  error,
  action,
  truncate,
  onRowClick
}: ITable): React.ReactElement {

  const handleRowClick = (item: any) => {
    if (onRowClick) {
      onRowClick(item);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-t-lg">
        <table className="min-w-full">
          <thead className="bg-[#D8E5F3]">
            <tr className="divide-x divide-[#BDBDBD]">
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="p-4 text-center whitespace-nowrap text-sm font-semibold text-[#274C77] uppercase"
                  style={{ width: header.width }}
                >
                  {truncate && <>
                    <Tooltip
                      id={`${index}-${header.fieldId}-tooltip`}
                      content={`${header.label}`}
                      place={"top"}
                    />
                    <div
                      data-tooltip-id={`${index}-${header.fieldId}-tooltip`}
                      className="truncate text-center hover:cursor-pointer"
                      style={{ width: header.width && header.width - 29 }}
                    >
                      {header.label}
                    </div>
                  </>}
                  {!truncate && header.label}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
      <div className="rounded-b-lg overflow-x-auto max-h-[calc(100vh_-_24rem)]">
        <table className="min-w-full">
          <tbody className="bg-white">
            {loading && (
              <tr className="divide-x divide-[#BDBDBD]">
                <td
                  colSpan={headers.length}
                  className="p-4 text-center whitespace-nowrap text-sm text-[#464E5F]"
                >
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr className="divide-x divide-[#BDBDBD]">
                <td
                  colSpan={headers.length}
                  className="p-4 text-center whitespace-nowrap text-sm text-[#464E5F]"
                >
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && isEmpty(data) && (
              <tr className="divide-x divide-[#BDBDBD]">
                <td
                  colSpan={headers.length}
                  className="py-10 px-4 text-center whitespace-nowrap text-sm text-[#464E5F]"
                >
                  <DocumentMagnifyingGlassIcon className="mx-auto h-14 w-14 text-gray-300" />
                  <p className="mt-4">Tidak ada data</p>
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
                    className="p-4 text-center whitespace-nowrap text-sm leading-7 text-[#464E5F]"
                    style={{ width: header.width }}
                  >
                    {header.fieldId === 'index' && row + 1}
                    {!header.renderItem && item[header.fieldId]}
                    {header.renderItem && header.renderItem(item[header.fieldId], row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
