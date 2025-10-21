import { useNavigate } from "react-router-dom";
import { useApiQuery } from "../api/useApiQuery";


function Dashboard() {

    const navigate = useNavigate()
    const { data: allMeetings } = useApiQuery(['allMeetings'], '/api/meetings/meetings/', undefined ,true);
    return (
        <>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

                <div className="w-1/2 mx-auto  p-4 rounded-md border border-gray-200 dark:border-neutral-700 dark:text-white">
                    <div className="p-3 flex justify-center items-center">
                        <div className="text-3xl font-bold text-blue-600">{allMeetings && allMeetings.length}</div>
                    </div>
                    <div className="flex justify-center">Meetings</div>
                </div>
                <div className="w-1/2 mx-auto  p-4 rounded-md border border-gray-200 dark:border-neutral-700 dark:text-white">
                    <div className="p-3 flex justify-center items-center">
                        <div className="text-3xl font-bold text-blue-600">10</div>
                    </div>
                    <div className="flex justify-center">Completed</div>
                </div>
                <div className="w-1/2 mx-auto  p-4 rounded-md border border-gray-200 dark:border-neutral-700 dark:text-white">
                    <div className="p-3 flex justify-center items-center">
                        <div className="text-3xl font-bold text-blue-600">3</div>
                    </div>
                    <div className="flex justify-center">Pending</div>
                </div>
                <div className="w-1/2 mx-auto  p-4 rounded-md border border-gray-200 dark:border-neutral-700 dark:text-white">
                    <div className="p-3 flex justify-center items-center">
                        <div className="text-3xl font-bold text-blue-600">2</div>
                    </div>
                    <div className="flex justify-center">Scheduled</div>
                </div>

            </div>


            <div>
               
                <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 items-center gap-6 md:gap-10">
                        {/* Card */}
                        

                        {
                        
                       allMeetings &&  allMeetings.map((meeting:any)=>(

                        <div onClick={()=>navigate(`/meeting/${meeting.id}`)} className="size-full bg-white shadow-lg rounded-lg p-5 dark:bg-neutral-900 hover:shadow-2xl  ">
                            <div className="flex items-center gap-x-4 mb-3">
                                <div className="inline-flex justify-center items-center size-15.5 rounded-full border-4 border-blue-50 bg-blue-100 dark:border-blue-900 dark:bg-blue-800">
                                    <svg className="shrink-0 size-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z" /><rect x="3" y="14" width="7" height="7" rx="1" /><circle cx="17.5" cy="17.5" r="3.5" /></svg>
                                </div>
                                <div className="shrink-0">
                                    <h3 className="block text-lg font-semibold text-gray-800 dark:text-white">{meeting.title}</h3>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-neutral-400">{meeting.description}</p>
                        </div>
                        ))

                        }
                        {/* End Card */}
                    </div>
                </div>
                {/* End Icon Blocks */}
            </div>
        </>
    );
}

export default Dashboard;
