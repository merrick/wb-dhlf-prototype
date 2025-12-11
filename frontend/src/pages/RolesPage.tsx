/**
 * Roles Page
 * Version: 3.1.0
 */

import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';
import type { Role } from '@/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight, ChevronDown } from 'lucide-react';

export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const roleTypes = ['Government', 'World Bank', 'Additional Stakeholders'];

  // Map display names to database values
  const typeMapping: Record<string, string> = {
    'Government': 'Government',
    'World Bank': 'World Bank',
    'Additional Stakeholders': 'Other'
  };

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    searchRoles();
  }, [searchTerm, selectedType]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getRoles();
      setRoles(data);
    } catch (err) {
      setError('Failed to load roles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchRoles = async () => {
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedType) params.type = typeMapping[selectedType];

      const data = await apiClient.getRoles(params);
      setRoles(data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const toggleRoleExpansion = (roleId: string) => {
    const newExpanded = new Set(expandedRoles);
    if (newExpanded.has(roleId)) {
      newExpanded.delete(roleId);
    } else {
      newExpanded.add(roleId);
    }
    setExpandedRoles(newExpanded);
  };

  const handleTypeFilter = (type: string | null) => {
    setSelectedType(type);

    // When filtering by type button, update expanded roles
    if (type === null) {
      // "All Types" clicked - close all roles
      setExpandedRoles(new Set());
    } else {
      // Specific type clicked - open only roles of that type
      const dbType = typeMapping[type];
      const typeRoles = roles.filter(role => role.role_type === dbType).map(role => role.role_id);
      setExpandedRoles(new Set(typeRoles));
    }
  };

  const groupedRoles = roles.reduce((acc, role) => {
    // Map database type to display name
    const displayType = role.role_type === 'Other' ? 'Additional Stakeholders' : role.role_type;
    if (!acc[displayType]) {
      acc[displayType] = [];
    }
    acc[displayType].push(role);
    return acc;
  }, {} as Record<string, Role[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading roles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-destructive">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold gradient-text">Professional Roles</h1>
        <p className="text-lg text-slate-600">
          Explore 17 professional roles in digital health. Click on any role to see its detailed description.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        {/* First row: Search box and All Types button */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={selectedType === null ? "default" : "outline"}
            onClick={() => handleTypeFilter(null)}
            className="whitespace-nowrap"
          >
            All Types
          </Button>
        </div>

        {/* Second row: Role type buttons */}
        <div className="flex gap-2 flex-wrap">
          {roleTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => handleTypeFilter(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Roles Display */}
      <div className="space-y-4">
        {roleTypes.map((type) => {
          const typeRoles = groupedRoles[type];
          if (!typeRoles || typeRoles.length === 0) {
            return null;
          }

          return (
            <div key={type} className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-300 pb-2">
                {type} Roles ({typeRoles.length})
              </h2>
              {typeRoles.map((role) => {
                const isExpanded = expandedRoles.has(role.role_id);

                return (
                  <Card
                    key={role.role_id}
                    className="overflow-hidden glass-effect shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow"
                  >
                    <CardHeader
                      className="cursor-pointer hover:bg-blue-50/50 transition-colors"
                      onClick={() => toggleRoleExpansion(role.role_id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 text-xl">
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-blue-600" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-blue-600" />
                            )}
                            <span className="gradient-text">{role.role_title}</span>
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>

                    {isExpanded && role.role_description && (
                      <CardContent className="pt-0">
                        <div className="pl-7 pr-4 pb-2">
                          <p className="text-slate-700 leading-relaxed">
                            {role.role_description}
                          </p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          );
        })}
      </div>

      {roles.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            No roles found matching your search criteria.
          </div>
        </div>
      )}
    </div>
  );
}