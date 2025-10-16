import React, { useState, useEffect, useRef } from 'react';

interface UserOption {
    id: string | number;
    name: string;
    description: string;
    selected: boolean;
    disabled: boolean;
    avatar: string;
}

interface MeetingInvitationProps {
    usersFromApi: UserOption[];
    onUpdatedList: (users: UserOption[]) => void;
    error: boolean;
}

const MeetingInvitation: React.FC<MeetingInvitationProps> = ({ usersFromApi, onUpdatedList, error }) => {
    const [selectedUsers, setSelectedUsers] = useState<UserOption[]>(
        usersFromApi.filter((user) => user.selected)
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const toggleUser = (user: UserOption) => {
        if (user.disabled) return;

        const alreadySelected = selectedUsers.some((u) => u.id === user.id);
        const updated = alreadySelected
            ? selectedUsers.filter((u) => u.id !== user.id)
            : [...selectedUsers, user];

        setSelectedUsers(updated);
        setSearchQuery('');
        setIsDropdownOpen(true);
    };

    const removeUser = (id: string | number) => {
        setSelectedUsers((prev) => prev.filter((user) => user.id !== id));
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredUsers = usersFromApi.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !selectedUsers.some((u) => u.id === user.id)
    );

    useEffect(() => {
        onUpdatedList(selectedUsers)
    }, [selectedUsers])

    return (
        <div ref={wrapperRef} className="relative w-full ">
            {/* Selected Tags + Inline Search */}
            <div
                className={`border border-gray-300 rounded-lg pl-3 p-2 flex flex-wrap items-center gap-2 bg-white dark:bg-neutral-800 OS dark:border-neutral-700   ${error && 'border-red-700 dark:border-red-700'}`}
                onClick={() => {
                    setIsDropdownOpen(true);
                    inputRef.current?.focus();
                }}
            >
                {/* Selected users as pills */}
                {selectedUsers.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center bg-white border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 rounded-full px-2 py-1"
                    >
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-5 h-5 rounded-full mr-1 object-cover"
                        />
                        <span className="text-xs text-gray-800 dark:text-neutral-200">{user.name}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeUser(user.id);
                            }}
                            className="ml-1 text-xs text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                ))}

                {/* Inline Search Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                    }}
                    placeholder={selectedUsers.length === 0 ? 'Invite Guests ...' : ''}
                    className="flex-grow min-w-[120px] text-sm bg-transparent outline-none text-gray-700 dark:text-white placeholder:text-gray-400 w-12 "
                />
            </div>

            {/* Dropdown Options */}
            {isDropdownOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white dark:bg-neutral-800 OS border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-y-auto max-w-md">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => toggleUser(user)}
                                className={`flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 ${user.disabled ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <div className="flex items-center">
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full mr-3 object-cover"
                                    />
                                    <div>
                                        <div className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                            {user.name}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-neutral-500">
                                            {user.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-3 text-sm text-gray-500 dark:text-neutral-400">No users found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MeetingInvitation;
