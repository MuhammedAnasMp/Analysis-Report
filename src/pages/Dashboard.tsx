

function Dashboard() {
    return (
        <><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

            <div className="w-1/2 mx-auto  p-4 rounded-md border border-gray-200 dark:border-neutral-700 dark:text-white">
                <div className="p-3 flex justify-center items-center">
                    <div className="text-3xl font-bold text-blue-600">3</div>
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
        </>
    );
}

export default Dashboard;
