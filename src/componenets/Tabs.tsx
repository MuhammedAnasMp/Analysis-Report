import { useState } from "react";

type Tab = {
  id: string;
  label: any;
};

type TabsProps = {
  tabs: Tab[];
  defaultTabId?: string; // optional default selected tab
  onChange?: (tabId: string) => boolean;
};

export function Tabs({ tabs, defaultTabId, onChange }: TabsProps) {
  // default to the provided defaultTabId or the first tab's id
  const [activeTab, setActiveTab] = useState<string | undefined>(
    defaultTabId ?? tabs[0]?.id
  );

  const handleTabClick = (tabId: string) => {
    // if onChange exists and returns false → do NOT switch
    if (onChange && onChange(tabId) === false) return;

    setActiveTab(tabId);
  };

  return (
    <div>
      <div className="flex">
        <nav
          className="flex gap-x-1 bg-gray-200 rounded-md p-0.5 "
          role="tablist"
          aria-label="Tabs"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={[
                  "text-xs px-2 py-1 !rounded transition font-medium",
                  isActive
                    ? "bg-blue-600 text-gray-800"
                    : "!text-gray-600 hover:!bg-gray-300 ",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
