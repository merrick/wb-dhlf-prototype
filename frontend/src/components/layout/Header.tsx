/**
 * Header Component
 * Version: 2.0.0
 */

import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Globe, Users, BookOpen, Network } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Competencies', href: '/competencies', icon: Globe },
  { name: 'Roles', href: '/roles', icon: Users },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Mappings', href: '/mappings', icon: Network },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="border-b bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="text-xl font-bold text-white leading-tight">
                  Digital Health Competency Framework
                </div>
                <div className="text-xs text-blue-100 font-medium">
                  World Bank Draft
                </div>
              </div>
            </Link>
          </div>

          <nav className="flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-white/20 text-white backdrop-blur-sm shadow-md"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}