import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { usePostAdminUserUpdateRoomsMutation } from '../../../services/admin/rooms';
import { GetIcon } from '../../../utils/icon';

const UserItem = (props: any) => {
  const { data, isChecked, roomId } = props;
  const [triggerCount, setTriggerCount] = useState(0);
  const [checked, setIsChecked] = useState(isChecked);

  useEffect(() => {
    if (triggerCount > 0) onHandleTriggered();
  }, [triggerCount]);

  const [postAdminUserUpdateRooms] = usePostAdminUserUpdateRoomsMutation();

  const onHandleTriggered = async () => {
    try {
      const result = await postAdminUserUpdateRooms({
        channelId: roomId,
        userId: data.userId,
        isActive: String(checked ? '1' : '0'),
      }).unwrap();
      if (result.statusCode === 200) {
        //
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onHandleClick = () => {
    setIsChecked(!checked);
    setTriggerCount(triggerCount + 1);
  };

  return (
    <li
      key={data.userId}
      className="flex flex-row items-center justify-between gap-2 py-2.5 text-gray-600 border-b border-slate-300"
    >
      <label htmlFor={'user-input-' + data.userId}>{data.username}</label>
      <button
        type="button"
        className={classNames('px-1 py-1 rounded-full', {
          'bg-emerald-600': !checked,
          'bg-rose-600': checked,
        })}
        onClick={onHandleClick}
      >
        {checked && <GetIcon mode="outline" name="x" className="text-white" />}
        {!checked && (
          <GetIcon mode="outline" name="plus" className="text-white" />
        )}
      </button>
    </li>
  );
};

export default UserItem;
