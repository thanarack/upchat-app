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
  useGetAdminDeleteUsersMutation,
  useGetAdminUsersMutation,
} from '../../../services/admin/users';
import ModalConfirmation from '../../../shared/ModalConfirmation';
import NewUserModel from './NewUserModel';

export type Users = {
  userId: string;
  profileUrl: string;
  username: string;
  firstName: string;
  lastName: string;
  position: string;
  createdAt: string;
  role: string
};

const table = createTable().setRowType<Users>();

const Action = (props: { value: any; onRefetchData: () => void }) => {
  const [isOpen, setOpen] = useState(false);
  const [getAdminDeleteRooms] = useGetAdminDeleteUsersMutation();

  const onDelete = async () => {
    try {
      const result = await getAdminDeleteRooms(props.value.userId).unwrap();
      if (result.statusCode === 200) {
        props.onRefetchData();
        toast('ลบข้อมูลสำเร็จ', { type: 'success' });
      }
      setOpen(false);
    } catch (err) {
      console.log(err);
      toast('ไม่สามารถลบข้อมูลตัวเองได้', { type: 'warning' });
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
          variant="gray"
          text="ลบผู้ใช้"
          size="sm"
          onClick={() => setOpen(true)}
        />
      </div>
    </>
  );
};

const SettingUsers = () => {
  const [data, setData] = useState(() => []);
  const [isOpen, setOpen] = useState(false);

  // Table data display
  const defaultColumns = [
    table.createDataColumn('profileUrl', {
      header: () => '',
      cell: (info) => (
        <div className="flex">
          <img
            className="w-10 h-10 rounded-full"
            src={info.getValue() || '/user-logo.png'}
            title="Avatar"
          />
        </div>
      ),
    }),
    table.createDataColumn('username', {
      header: () => 'Username',
      cell: (info) => info.getValue(),
    }),
    table.createDataColumn('firstName', {
      header: () => 'ชื่อ',
      cell: (info) => info.getValue(),
    }),
    table.createDataColumn('lastName', {
      header: () => 'นามสกุล',
      cell: (info) => info.getValue(),
    }),
    table.createDataColumn('position', {
      header: () => 'ตำแหน่ง',
      cell: (info) => info.getValue(),
    }),
    table.createDataColumn('role', {
      header: () => 'สิทธิ์',
      cell: (info) => info.getValue(),
    }),
    table.createDataColumn('createdAt', {
      header: () => 'วันที่เพิ่ม',
      cell: (info) =>
        dayjs(info.getValue()).locale('th').format('DD/MM/YYYY'),
    }),
    table.createDataColumn('userId', {
      header: () => <div id="action">จัดการ</div>,
      cell: (info) => (
        <Action value={info.row.original} onRefetchData={getInitialData} />
      ),
    }),
  ];

  const [columns] = useState<typeof defaultColumns>(() => [...defaultColumns]);

  const instance = useTableInstance(table, {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Start fetched data
  const [getAdminUsers] = useGetAdminUsersMutation();
  const getInitialData = async () => {
    try {
      const result = await getAdminUsers({}).unwrap();
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
  // End fetched

  return (
    <div>
      {isOpen && (
        <NewUserModel
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          callBack={getInitialData}
        />
      )}
      <label className="text-xl text-indigo-600 font-bold font-ibm">
        # จัดการผู้ใช้งาน
      </label>
      <div className="mt-6">
        <Button text="เพิ่มผู้ใช้" onClick={() => setOpen(true)} />
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

export default SettingUsers;
