import { LayoutDashboard, Inbox, Users, Briefcase, Upload, Settings } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: 'dashboard' | 'pipeline' | 'sponsors' | 'portfolio' | 'upload') => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline', icon: Inbox, badge: 24 },
    { id: 'sponsors', label: 'Sponsors', icon: Users },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'upload', label: 'Upload', icon: Upload },
  ];

  return (
    <div className="w-60 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8">
        <div className="text-black tracking-tight">
          <div className="text-lg">Builder</div>
          <div className="text-lg">Operating System</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 transition-colors ${
                isActive
                  ? 'bg-gray-100 text-black'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              <span className="text-sm flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="px-3 pb-6">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
          <Settings size={18} strokeWidth={2} />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
}