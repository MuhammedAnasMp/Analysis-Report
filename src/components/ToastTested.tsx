import { useApiMutation } from '../api/useApiMutation';
import { useApiQuery } from '../api/useApiQuery';
import useToast from '../hooks/Toast';
import { BeakerIcon } from '@heroicons/react/24/solid'
import type { RootState } from '../redux/app/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setIsOpened } from '../redux/features/global/globalSlice';


const ToastTester = () => {
  const { showToast } = useToast();
  const { data: users, isLoading, refetch } = useApiQuery(['users'], '/api/test/', undefined, false);

  const { mutate } = useApiMutation('POST', '/api/test/');
  const handleClick = () => {
    mutate(
      { id: 3, name: "RAJ" },
      {
        onSuccess: () => {
        },
        onError: (error: any) => {
          console.log(error.message)
        }
      }
    );
  };
  if (isLoading) return <>API loading...</>;


  const isSidebarOpen = useSelector((state: RootState) => state.global.isOpened);

  const dispatch = useDispatch();
  const isOpened = useSelector((state: RootState) => state.global.isOpened);

  const handleToggle = () => {
    dispatch(setIsOpened(!isOpened));

  }
  return (
    <div className="p-4 space-y-4">
      <div className="p-3 bg-amber-200 text-stone-700 w-fit rounded-xl active:bg-amber-700" onClick={handleToggle}>Dashboard</div>
      <div onClick={() => refetch()} className="p-3 bg-red-200 text-red-700 w-fit rounded-xl active:bg-yellow-700" >Call Api</div>
      <ul>
        {users?.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>



      <h2 className="text-lg font-bold">Test Toast Notifications</h2>

      {/* Markup1 with Link */}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() =>
          showToast({
            type: "markup1",
            title: "New Message",
            message: "You have a new notification!",
            //   avatar: "https://randomuser.me/api/portraits/men/45.jpg",
            avatar: <BeakerIcon className="size-6 text-blue-500" />,
            actionText: "View",
            actionLink: "https://example.com",
            duration: 5000,
          })
        }
      >
        Show Markup1 Toast (With Link)
      </button>

      {/* Markup1 with SVG Avatar */}
      <button
        className="px-4 py-2 bg-green-500 text-white rounded"
        onClick={() =>
          showToast({
            type: "markup1",
            title: "Alert",
            message: "This is a warning!",
            avatar: `<svg width="40" height="40" fill="orange"><circle cx="20" cy="20" r="20"/></svg>`,
            actionText: "Learn More",
            actionLink: "example/user",
            duration: 4000,
          })
        }
      >
        Show Markup1 Toast (With SVG)
      </button>

      {/* Markup2 - Success */}
      <button
        className="px-4 py-2 bg-green-600 text-white rounded"
        onClick={() =>
          showToast({
            type: "markup2",
            message: "Operation completed successfully!",
            status: "success",
            avatar: "https://randomuser.me/api/portraits/women/32.jpg",
            duration: 3000,
          })
        }
      >
        Show Success Toast
      </button>

      {/* Markup2 - Failed */}
      <button
        className="px-4 py-2 bg-red-500 text-white rounded"
        onClick={() =>
          showToast({
            type: "markup2",
            message: "Action failed. Please try again!",
            status: "failed",
            avatar: "https://randomuser.me/api/portraits/men/50.jpg",
            duration: 3000,
          })
        }
      >
        Show Failed Toast
      </button>
      <BeakerIcon className="size-6 text-blue-500" />
      {/* Markup2 - Warning */}
      <button
        className="px-4 py-2 bg-yellow-500 text-white rounded"
        onClick={() =>
          showToast({
            type: "markup2",
            message: "Warning! Check your input.",
            status: "warning",
            avatar: <BeakerIcon className="size-6 text-blue-500" />,
            duration: 3000,
          })
        }
      >
        Show Warning Toast
      </button>

      {/* Markup2 - Normal */}
      <button
        className="px-4 py-2 bg-gray-500 text-white rounded"
        onClick={() =>
          showToast({
            type: "markup2",
            message: "This is a normal info message.",
            status: "normal",
            avatar: "https://randomuser.me/api/portraits/men/60.jpg",
            duration: 3000,
          })
        }
      >
        Show Normal Toast
      </button>
    </div>
  );
};

export default ToastTester;