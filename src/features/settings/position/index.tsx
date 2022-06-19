/* eslint-disable jsx-a11y/alt-text */
import {
  createTable,
  getCoreRowModel,
  useTableInstance,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import Button from '../../../components/button/Button';
import {
  useGetAdminDeleteUserPositionMutation,
  useGetAdminUsersPositionMutation,
} from '../../../services/admin/users';
import ModalConfirmation from '../../../shared/ModalConfirmation';
import formatNumber from '../../../utils/formatNumber';
import NewPositionModel from './NewPositionModel';

export type Position = {
  positionId: string;
  title: string;
  count: string;
  createdAt: string;
};

const table = createTable().setRowType<Position>();

const Action = (props: {
  value: any;
  onRefetchData: () => void;
  onEdit: (a: any) => void;
}) => {
  const [isOpen, setOpen] = useState(false);
  const [getAdminDeleteUsersPosition, getAdminDeleteUsersPositionResult] =
    useGetAdminDeleteUserPositionMutation();

  const onDelete = async () => {
    try {
      const result = await getAdminDeleteUsersPosition(
        props.value.positionId
      ).unwrap();
      if (result.statusCode === 200) {
        props.onRefetchData();
        toast('ลบข้อมูลสำเร็จ', { type: 'success' });
      }
      setOpen(false);
    } catch (err) {
      console.log(err);
      toast('ไม่สามารถลบข้อมูลตัวเองได้', { type: 'error' });
      setOpen(false);
    }
  };

  return (
    <>
      <ModalConfirmation
        isOpen={isOpen}
        title="ต้องการลบข้อมูลใช่หรือไม่ ?"
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        onAccept={onDelete}
      />
      <div className="flex flex-row gap-4 justify-end">
        <Button
          text="แก้ไข"
          size="sm"
          onClick={() => props.onEdit(props.value)}
        />
        <Button
          variant="gray"
          text="ลบ"
          size="sm"
          isLoading={getAdminDeleteUsersPositionResult.isLoading}
          onClick={() => setOpen(true)}
        />
      </div>
    </>
  );
};

const SettingPosition = () => {
  const [data, setData] = useState(() => []);
  const [editValue, setEditValue] = useState<Position | null>(null);
  const [isOpen, setOpen] = useState(false);

  // Table data display
  const defaultColumns = [
    table.createDataColumn('title', {
      header: () => 'ตำแหน่ง',
      cell: (info) => (
        <span>
          <span className="mr-1 text-lg">👔</span>
          {info.getValue()}
        </span>
      ),
    }),
    table.createDataColumn('count', {
      header: () => 'จำนวนผู้ใช้งาน',
      cell: (info) => (
        <div className="bg-slate-400 rounded-full px-3 py-1.5 w-fit text-white text-xs font-semibold">
          {formatNumber(+info.getValue())}
        </div>
      ),
    }),
    table.createDataColumn('createdAt', {
      header: () => 'วันที่เพิ่ม',
      cell: (info) => dayjs(info.getValue()).locale('th').format('DD/MM/YYYY'),
    }),
    table.createDataColumn('positionId', {
      header: () => <div id="action">จัดการ</div>,
      cell: (info) => (
        <Action
          value={info.row.original}
          onRefetchData={getInitialData}
          onEdit={onUpdateRow}
        />
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
  const [getAdminUsersPosition] = useGetAdminUsersPositionMutation();
  const getInitialData = async () => {
    try {
      const result = await getAdminUsersPosition({}).unwrap();
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

  const onUpdateRow = (data: Position) => {
    if (data) {
      setEditValue(data);
      setOpen(true);
    }
  };

  return (
    <div>
      {isOpen && (
        <NewPositionModel
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          callBack={getInitialData}
          editValue={editValue}
        />
      )}
      <label className="text-xl text-indigo-500 font-bold font-ibm">
        # จัดตำแหน่งภายในบริษัท
      </label>
      <div className="mt-6">
        <Button
          text="เพิ่มตำแหน่ง"
          onClick={() => {
            setOpen(true);
            setEditValue(null);
          }}
        />
      </div>
      <div className="border rounded-md px-6 py-6 mt-6 shadow-sm">
        <table className="normal-table">
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

export default SettingPosition;
