export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative inline-block">{children}</div>;
};

export const DropdownMenuTrigger = ({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) => {
  return <>{children}</>;
};

export const DropdownMenuContent = ({ align, children }: { align?: "start" | "end"; children: React.ReactNode }) => {
  return (
    <div className={`absolute ${align === "end" ? "right-0" : "left-0"} mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50`}>
      <div className="py-1" role="menu">
        {children}
      </div>
    </div>
  );
};

export const DropdownMenuLabel = ({ children }: { children: React.ReactNode }) => {
  return <div className="px-4 py-2 text-sm font-semibold text-gray-700">{children}</div>;
};

export const DropdownMenuSeparator = () => {
  return <div className="h-px bg-gray-200 my-1" />;
};

export const DropdownMenuItem = ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
      role="menuitem"
    >
      {children}
    </button>
  );
};
