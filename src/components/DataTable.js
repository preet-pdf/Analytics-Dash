
import React, { useMemo } from 'react';
import {
  useTable,
  usePagination,
  useFilters,
} from 'react-table';
import './DataTable.css';

const DataTable = () => {
  // Sample dummy data
  const data = useMemo(
    () => [
      {
        auditEvent: {
          eventType: 'Login',
          eventData: 'User logged in',
          eventTime: new Date().toLocaleString(),
        },
        ruleName: 'Login Rule',
        ruleDescription: 'Rule for login events',
        createdTime: Date.now(),
      },
      {
        auditEvent: {
          eventType: 'Logout',
          eventData: 'User logged out',
          eventTime: new Date().toLocaleString(),
        },
        ruleName: 'Logout Rule',
        ruleDescription: 'Rule for logout events',
        createdTime: Date.now(),
      },
      {
        auditEvent: {
          eventType: 'Data Access',
          eventData: 'User accessed data',
          eventTime: new Date().toLocaleString(),
        },
        ruleName: 'Data Access Rule',
        ruleDescription: 'Rule for data access events',
        createdTime: Date.now(),
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Event Type',
        accessor: 'auditEvent.eventType',
      },
      {
        Header: 'Event Data',
        accessor: 'auditEvent.eventData',
      },
      {
        Header: 'Event Time',
        accessor: 'auditEvent.eventTime',
      },
      {
        Header: 'Rule Name',
        accessor: 'ruleName',
      },
      {
        Header: 'Rule Description',
        accessor: 'ruleDescription',
      },
      {
        Header: 'Created Time',
        accessor: 'createdTime',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
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
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    usePagination
  );

  return (
    <div>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DataTable;
