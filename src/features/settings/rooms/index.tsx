import {
  createTable,
  getCoreRowModel,
  useTableInstance,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import Button from '../../../components/button/Button';
import formatNumber from '../../../utils/formatNumber';
import {
  useGetAdminDeleteRoomsMutation,
  useGetAdminRoomsMutation,
  usePostAdminUpdateRoomsMutation,
} from '../../../services/admin/rooms';
import ModalConfirmation from '../../../shared/ModalConfirmation';
import { useAddUserRoomMutation } from '../../../services/users';

type Channels = {
  channelId?: string;
  createdAt: string;
  count: string;
  title: string;
};

const table = createTable().setRowType<Channels>();

const Action = (props: {
  value: any;
  onRefetchData: () => void;
  onEdit: (a: any) => void;
}) => {
  const [isOpen, setOpen] = useState(false);
  const [getAdminDeleteRooms] = useGetAdminDeleteRoomsMutation();

  const onDelete = async () => {
    try {
      await getAdminDeleteRooms(props.value.channelId).unwrap();
      props.onRefetchData();
      toast('ลบข้อมูลสำเร็จ', { type: 'success' });
      setOpen(false);
    } catch (err) {
      console.log(err);
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
          text="ลบข้อมูล"
          size="sm"
          onClick={() => setOpen(true)}
        />
      </div>
    </>
  );
};

const SettingRooms = () => {
  const [data, setData] = useState(() => []);
  const [editId, setEditId] = useState('');
  const [input, setInput] = useState('');

  // Table data display
  const defaultColumns = [
    table.createDataColumn('title', {
      header: () => 'ชื่อห้อง',
      cell: (info) => info.getValue(),
    }),
    table.createDataColumn('count', {
      header: () => 'จำนวนผู้สมาชิก',
      cell: (info) => (
        <div className="bg-slate-400 rounded-full px-3 py-1.5 w-fit text-white text-xs font-semibold">
          {formatNumber(+info.getValue())}
        </div>
      ),
    }),
    table.createDataColumn('createdAt', {
      header: () => 'วันที่เพิ่ม',
      cell: (info) =>
        dayjs(info.getValue()).locale('th').format('DD MMMM YYYY'),
    }),
    table.createDataColumn('channelId', {
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

  const [getAdminRooms] = useGetAdminRoomsMutation();
  const getInitialData = async () => {
    try {
      const result = await getAdminRooms({}).unwrap();
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

  // End data setting

  // Add new room and update
  const onUpdateRow = (data: Channels) => {
    if (data.channelId) {
      setEditId(data?.channelId);
      setInput(data.title);
    }
  };
  const [serviceAddUserRoom] = useAddUserRoomMutation();
  const [serviceAdminUpdateUserRoom] = usePostAdminUpdateRoomsMutation();
  const onUpdateRooms = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (input) {
        let result;
        if (editId) {
          result = await serviceAdminUpdateUserRoom({
            channelId: editId,
            title: input,
          }).unwrap();
        } else {
          result = await serviceAddUserRoom({
            title: input,
            roomType: 'group',
            userAllow: 'public',
          }).unwrap();
        }

        if (result.statusCode === 200) {
          if (editId) {
            toast('แก้ไขห้องสำเร็จ', { type: 'success' });
            setEditId('');
          } else {
            toast('เพิ่มห้องใหม่สำเร็จ', { type: 'success' });
          }
          getInitialData();
          setInput('');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const resetEdit = () => {
    setEditId('');
    setInput('');
  };
  // End new room

  return (
    <div>
      <label className="text-xl text-indigo-500 font-semibold">
        #จัดการห้องสทนา
      </label>
      <form
        onSubmit={onUpdateRooms}
        id="form-room"
        className="rounded-md mt-6 bg-indigo-50"
      >
        <div className="w-8/12 grid grid-cols-2 gap-4">
          <div>
            <div className="form-group mt-6">
              {!editId && <label>ชื่อห้องใหม่</label>}
              {editId && <label>แก้ไขห้อง</label>}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="form-input"
                placeholder="กรอกชื่อห้อง"
              />
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Button text={editId ? 'แก้ไข' : 'เพิ่มห้อง'} form="form-room" />
            {editId && (
              <Button text="ยกเลิก" variant="gray" onClick={resetEdit} />
            )}
          </div>
        </div>
      </form>
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingRooms;
