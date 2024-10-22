import React, { useEffect, useState, useMemo } from 'react';
import { useTable, usePagination } from 'react-table';
import { useAuth0 } from '@auth0/auth0-react';
import './DataTable.css';
import Loading from './Loading';

const DataTable = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch('http://localhost:8080/audit', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAccessTokenSilently]);

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
        Cell: ({ value }) => new Date(value).toUTCString(),
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
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
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
    usePagination
  );

  const downloadCSV = () => {
    const csvData = data.map(row => ({
      EventType: row.auditEvent.eventType,
      EventData: row.auditEvent.eventData,
      EventTime: new Date(row.auditEvent.eventTime).toUTCString(),
      RuleName: row.ruleName,
      RuleDescription: row.ruleDescription,
      CreatedTime: new Date(row.createdTime).toLocaleDateString(),
    }));

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [Object.keys(csvData[0])].concat(csvData.map(e => Object.values(e))).map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'audit_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="table-header">
        <h2 style={{ flex: 1 }} className="App-title">Alert Data</h2>
        <button onClick={downloadCSV} style={{ marginLeft: '20px' }}>
          Download Alerts Data
        </button>
      </div>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} key={column.id}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render('Cell')}
                  </td>
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
          onChange={e => setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
  
};

export default DataTable;
