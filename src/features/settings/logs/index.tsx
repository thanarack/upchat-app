/* eslint-disable jsx-a11y/alt-text */
import {
  createTable,
  getCoreRowModel,
  useTableInstance,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useGetAdminLogsMutation } from '../../../services/admin/logs';
import classNames from 'classnames';

type Logs = {
  logId: string;
  type: string;
  message: string;
  child: string;
  timestamp: number;
  createdAt: string;
};

const table = createTable().setRowType<Logs>();

const SettingLogs = () => {
  const [data, setData] = useState(() => []);

  // Table data display
  const defaultColumns = [
    table.createDataColumn('type', {
      header: () => 'Logs top #100',
      cell: (info) => (
        <div className="logs-table">
          <div className="flex flex-row gap-1">
            <label>Date</label>
            <div className="font-semibold">
              {dayjs(info.row.original?.createdAt)
                .locale('th')
                .format('DD/MM/YYYY HH:mm')}
            </div>
          </div>
          <div className="flex flex-row gap-1">
            <label>Type</label>
            <div
              className={classNames('font-semibold', {
                'text-indigo-500': info.getValue() === 'info',
                'text-rose-500': info.getValue() === 'error',
              })}
            >
              {info.getValue()}
            </div>
          </div>
          <div className="flex flex-row gap-1">
            <label>Message</label>
            <div className="font-semibold">{info.row.original?.message}</div>
          </div>
          {info.row.original?.child && (
            <div className="flex flex-row gap-1">
              <div className="log-data">
                <code>{info.row.original?.child}</code>
              </div>
            </div>
          )}
        </div>
      ),
    }),
  ];

  const [columns] = useState<typeof defaultColumns>(() => [...defaultColumns]);

  const instance = useTableInstance(table, {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Fetch position data
  const [getAdminLogs] = useGetAdminLogsMutation();
  const getInitialData = async () => {
    try {
      const result = await getAdminLogs({}).unwrap();
      if (result.statusCode === 200) {
        setData(result.result.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!data.length) getInitialData();
  }, []);
  // End fetch data

  return (
    <div>
      <label className="text-xl text-indigo-500 font-bold font-ibm">
        # บันทึกการใช้งาน
      </label>
      <div className="border rounded-md px-6 py-6 mt-6 shadow-sm">
        <table className="normal-table logs-table">
          <thead>
            {instance.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : header.renderHeader()}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {instance.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{cell.renderCell()}</td>
                ))}
              </tr>
            ))}
            {!data.length && (
              <tr className="no-found">
                <td colSpan={7}>
                  <div>- ไม่พบข้อมูล -</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingLogs;
