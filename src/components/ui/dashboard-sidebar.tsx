"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  LogOut,
  Hash,
  ChevronDown,
  ChevronRight,
  Inbox,
  Calendar,
  Activity,
  CreditCard,
  Globe,
  Terminal,
  Blocks,
  PanelLeftClose,
  PanelLeftOpen,
  Clock,
  Command,
  X,
  Ticket,
  ScanLine,
  Gamepad2,
  Tv,
  Wallet
} from 'lucide-react';

export type NavItemData = {
  id: string;
  title: string;
  icon: React.ElementType;
  href?: string;
  badge?: number | string;
  shortcut?: string;
  children?: NavItemData[];
};

export type NavGroupData = {
  heading?: string;
  items: NavItemData[];
};

const mockNavGroups: NavGroupData[] = [
  {
    items: [
      { id: 'search', title: 'Search', icon: Search, shortcut: '⌘K' },
      { id: 'dashboard', title: 'Overview', icon: LayoutDashboard, href: '/admin' },
    ]
  },
  {
    heading: 'Operasional',
    items: [
      { id: 'bookings', title: 'Kelola Pesanan', icon: Ticket, href: '/admin/bookings' },
      { id: 'scanner', title: 'Admin Scanner', icon: ScanLine, href: '/admin/scanner' },
    ]
  },
  {
    heading: 'Manajemen Data',
    items: [
      { id: 'console-types', title: 'Tipe Konsol', icon: Tv, href: '/admin/console-types' },
      { id: 'units', title: 'Data Unit', icon: Tv, href: '/admin/units' },
      { id: 'games', title: 'Katalog Game', icon: Gamepad2, href: '/admin/games' },
      { id: 'packages', title: 'Paket Harga', icon: Wallet, href: '/admin/packages' },
    ]
  }
];

const mockBottomItems: NavItemData[] = [
  { id: 'settings', title: 'Settings', icon: Settings, shortcut: '⌘,' },
  { id: 'logout', title: 'Log out', icon: LogOut },
];

function WorkspaceSwitcher({ selected, onSelect }: { selected?: string, onSelect?: (ws: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState('Pasrent Store');
  
  const current = selected || internalSelected;
  const handleSelect = onSelect || setInternalSelected;

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-2 py-2 mb-4 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors select-none group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[6px] bg-white flex items-center justify-center shadow-sm overflow-hidden p-1 border border-gray-100 dark:border-gray-800">
            <Image src="/imgs/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[13px] font-medium leading-none mb-1 text-foreground truncate max-w-[120px]">{current}</span>
            <span className="text-[11px] text-muted-foreground leading-none">Admin Workspace</span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground/70 transition-colors shrink-0" strokeWidth={1.5} />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-[52px] left-0 w-full bg-card border border-border/50 rounded-lg shadow-xl z-50 py-1 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
            {['Pasrent Store'].map(ws => (
              <div 
                key={ws}
                onClick={() => { handleSelect(ws); setIsOpen(false); }}
                className={`px-3 py-2 mx-1 text-[13px] rounded-md cursor-pointer transition-colors ${current === ws ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/80 hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                {ws}
              </div>
            ))}
            <div className="h-px bg-border/50 my-1 mx-2" />
            <div className="px-3 py-2 mx-1 text-[13px] text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-md cursor-pointer flex items-center gap-2 transition-colors">
              <span className="text-[16px] leading-none mb-0.5">+</span> Tambah Cabang
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NavItem({ 
  item, 
  activeId, 
  onSelect,
  level = 0
}: { 
  item: NavItemData; 
  activeId: string; 
  onSelect: (id: string) => void;
  level?: number;
}) {
  const isActive = activeId === item.id;
  const hasChildren = !!item.children;
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      onSelect(item.id);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {item.href ? (
        <Link
          href={item.href}
          className={`group flex items-center justify-between px-2.5 py-[7px] rounded-[6px] cursor-pointer transition-all duration-200 select-none
            ${isActive 
              ? 'bg-black/5 dark:bg-white/10 text-foreground font-medium' 
              : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground/90'
            }
          `}
          style={{ paddingLeft: `${level * 12 + 10}px` }}
          onClick={handleClick}
        >
          <div className="flex items-center gap-2.5">
            <item.icon 
              className={`w-[16px] h-[16px] transition-colors
                ${isActive ? 'text-foreground' : 'text-muted-foreground/70 group-hover:text-foreground/70'}
              `} 
              strokeWidth={1.5} 
            />
            <span className="text-[13px] tracking-wide truncate">
              {item.title}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {item.shortcut && (
               <kbd className="hidden group-hover:inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-medium font-mono text-muted-foreground/60 bg-background/50 border border-border/50 rounded-[4px] shadow-xs">
                 {item.shortcut}
               </kbd>
            )}
            {item.badge && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <ChevronRight 
                className={`w-3.5 h-3.5 text-muted-foreground/50 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
                strokeWidth={2}
              />
            )}
          </div>
        </Link>
      ) : (
        <div 
          className={`group flex items-center justify-between px-2.5 py-[7px] rounded-[6px] cursor-pointer transition-all duration-200 select-none
            ${isActive 
              ? 'bg-black/5 dark:bg-white/10 text-foreground font-medium' 
              : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground/90'
            }
          `}
          style={{ paddingLeft: `${level * 12 + 10}px` }}
          onClick={handleClick}
        >
          <div className="flex items-center gap-2.5">
            <item.icon 
              className={`w-[16px] h-[16px] transition-colors
                ${isActive ? 'text-foreground' : 'text-muted-foreground/70 group-hover:text-foreground/70'}
              `} 
              strokeWidth={1.5} 
            />
            <span className="text-[13px] tracking-wide truncate">
              {item.title}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {item.shortcut && (
               <kbd className="hidden group-hover:inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-medium font-mono text-muted-foreground/60 bg-background/50 border border-border/50 rounded-[4px] shadow-xs">
                 {item.shortcut}
               </kbd>
            )}
            {item.badge && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <ChevronRight 
                className={`w-3.5 h-3.5 text-muted-foreground/50 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
                strokeWidth={2}
              />
            )}
          </div>
        </div>
      )}

      {hasChildren && (
        <div 
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden min-h-0 relative flex flex-col gap-0.5 mt-0.5">
            <div 
              className="absolute top-0 bottom-0 border-l border-black/5 dark:border-white/5"
              style={{ left: `${level * 12 + 17.5}px` }}
            />
            {item.children!.map(child => (
              <NavItem 
                key={child.id} 
                item={child} 
                activeId={activeId} 
                onSelect={onSelect} 
                level={level + 1} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return <div className="hidden md:block w-32 h-8 bg-black/5 dark:bg-white/5 rounded-md animate-pulse" />;

  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-black/5 dark:bg-white/5 rounded-md text-sm font-medium text-muted-foreground border border-black/5 dark:border-white/5 shadow-sm">
      <Clock className="w-4 h-4 text-[#5000ef] dark:text-[#00c3cb]" />
      {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
      <span className="text-xs text-muted-foreground/70 hidden lg:inline-block ml-1 border-l border-black/10 dark:border-white/10 pl-2">
        {time.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
      </span>
    </div>
  );
}

export function SidebarNav({ 
  className = '',
  activeId,
  onSelect,
  activeWorkspace,
  onWorkspaceSelect
}: { 
  className?: string,
  activeId?: string,
  onSelect?: (id: string) => void,
  activeWorkspace?: string,
  onWorkspaceSelect?: (ws: string) => void
}) {
  const [internalId, setInternalId] = useState('home');
  const currentId = activeId !== undefined ? activeId : internalId;
  const handleSelect = onSelect || setInternalId;

  return (
    <div className={`flex flex-col w-[260px] h-full bg-card/50 border-r border-border/50 p-3 font-sans ${className}`}>
      <WorkspaceSwitcher selected={activeWorkspace} onSelect={onWorkspaceSelect} />

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-4 mt-2">
        {mockNavGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            {group.heading && (
              <span className="px-2.5 mb-1 text-[11px] font-semibold tracking-wider text-muted-foreground/50 uppercase">
                {group.heading}
              </span>
            )}
            {group.items.map(item => (
              <NavItem 
                key={item.id} 
                item={item} 
                activeId={currentId} 
                onSelect={handleSelect} 
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-border/50 flex flex-col gap-0.5">
        {mockBottomItems.map(item => (
          <NavItem 
            key={item.id} 
            item={item} 
            activeId={currentId} 
            onSelect={handleSelect} 
          />
        ))}
      </div>
    </div>
  );
}

const allItems = [...mockNavGroups.flatMap(g => g.items), ...mockBottomItems];
const flattenItems = (items: NavItemData[]): NavItemData[] => {
  return items.reduce((acc, item) => {
    acc.push(item);
    if (item.children) acc.push(...flattenItems(item.children));
    return acc;
  }, [] as NavItemData[]);
};
const flatMockData = flattenItems(allItems);

export default function SidebarNavPreview({ user, children }: { user?: any, children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState('home');
  const [activeWorkspace, setActiveWorkspace] = useState('Pasrent Store');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const activeItem = flatMockData.find(i => i.id === activeId);
  const activeTitle = activeItem ? activeItem.title : 'Dashboard';

  const handleSelect = (id: string) => {
    if (id === 'search') {
      setIsSearchOpen(true);
      return;
    }
    setActiveId(id);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-background">
      
      <div className="relative w-full h-screen bg-card flex overflow-hidden shadow-sm ring-1 ring-black/5 dark:ring-white/5">
        
        <div 
          className={`h-full transition-all duration-300 ease-in-out shrink-0 overflow-hidden bg-card/50 border-r border-border/50 ${
            isOpen ? 'w-[260px] opacity-100' : 'w-0 opacity-0 border-none'
          }`}
        >
          <SidebarNav 
            className="w-[260px] border-none bg-transparent" 
            activeId={activeId}
            onSelect={handleSelect}
            activeWorkspace={activeWorkspace}
            onWorkspaceSelect={setActiveWorkspace}
          />
        </div>
        
        <div className="flex-1 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col min-w-0 transition-all duration-300">
           
           <div className="h-14 border-b border-border/50 flex items-center px-4 justify-between bg-card shrink-0">
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => setIsOpen(!isOpen)}
                 className="p-1.5 rounded-md text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors"
               >
                 {isOpen ? <PanelLeftClose className="w-[18px] h-[18px]" strokeWidth={1.5} /> : <PanelLeftOpen className="w-[18px] h-[18px]" strokeWidth={1.5} />}
               </button>
               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                 <span className="truncate">{activeWorkspace}</span>
                 <span>/</span>
                 <span className="font-medium text-foreground truncate">{activeTitle}</span>
               </div>
             </div>
             
             <div className="flex items-center gap-3">
               <LiveClock />
               {user ? (
                 <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full py-1 pr-4 pl-1 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                   <div className="w-8 h-8 bg-gradient-to-r from-[#5000ef] to-[#00c3cb] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner">
                     {user.email?.charAt(0).toUpperCase()}
                   </div>
                   <div className="flex flex-col hidden sm:flex">
                     <span className="text-[12px] font-semibold text-gray-900 dark:text-white leading-none mb-0.5">Admin</span>
                     <span className="text-[10px] text-gray-500 leading-none truncate max-w-[120px]">{user.email}</span>
                   </div>
                 </div>
               ) : (
                 <div className="w-8 h-8 bg-primary/10 rounded-full border border-primary/20" />
               )}
             </div>
           </div>

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {children}
            </div>
         </div>

        {isSearchOpen && (
          <div className="absolute inset-0 z-50 flex items-start justify-center pt-[15vh] bg-background/40 backdrop-blur-sm px-4">
            <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />
            <div className="relative w-full max-w-xl bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center px-4 border-b border-border/50">
                <Search className="w-[18px] h-[18px] text-muted-foreground/70 mr-3 shrink-0" strokeWidth={1.5} />
                <input 
                  autoFocus
                  className="flex-1 bg-transparent py-4 outline-none text-[14px] text-foreground placeholder:text-muted-foreground/50"
                  placeholder="Search projects, docs, or actions..."
                />
                <kbd 
                  onClick={() => setIsSearchOpen(false)}
                  className="hidden sm:inline-flex items-center justify-center h-5 px-1.5 ml-2 text-[10px] font-medium font-mono text-muted-foreground/70 bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-[4px] cursor-pointer hover:text-foreground hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                >
                  ESC
                </kbd>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-3 p-1 rounded-md text-muted-foreground/70 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground transition-colors"
                >
                  <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-2 py-8 flex flex-col items-center justify-center">
                 <Command className="w-6 h-6 text-muted-foreground/30 mb-2" strokeWidth={1.5} />
                 <p className="text-[13px] text-muted-foreground font-medium">Type a command or search...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
