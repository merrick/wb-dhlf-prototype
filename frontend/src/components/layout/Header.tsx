/**
 * Header Component
 * Version: 1.0.0
 */

import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Competencies', href: '/' },
  { name: 'Roles', href: '/roles' },
  { name: 'Courses', href: '/courses' },
  { name: 'Mappings', href: '/mappings' },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-xl font-bold text-primary">
                Digital Health Competency Framework
              </div>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}