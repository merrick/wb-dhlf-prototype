/**
 * Roles Page
 * Version: 4.1.0
 *
 * Now includes competency mapping display with collapsible domains
 */

import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';
import type { Role, RoleCompetencyWithDetails, CompetencyWithDetails } from '@/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, ChevronRight, ChevronDown } from 'lucide-react';

export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());
  const [expandedDomains, setExpandedDomains] = useState<Record<string, Set<string>>>({});
  const [roleCompetencies, setRoleCompetencies] = useState<Record<string, RoleCompetencyWithDetails[]>>({});
  const [loadingCompetencies, setLoadingCompetencies] = useState<Set<string>>(new Set());
  const [selectedCompetency, setSelectedCompetency] = useState<CompetencyWithDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Fetch competencies when a role is expanded
  useEffect(() => {
    expandedRoles.forEach((roleId) => {
      if (!roleCompetencies[roleId] && !loadingCompetencies.has(roleId)) {
        loadRoleCompetencies(roleId);
      }
    });
  }, [expandedRoles]);

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

  const loadRoleCompetencies = async (roleId: string) => {
    try {
      setLoadingCompetencies(prev => new Set([...prev, roleId]));
      const competencies = await apiClient.getRoleCompetencies(roleId);
      setRoleCompetencies(prev => ({ ...prev, [roleId]: competencies }));
    } catch (err) {
      console.error('Failed to load competencies for role:', err);
    } finally {
      setLoadingCompetencies(prev => {
        const newSet = new Set(prev);
        newSet.delete(roleId);
        return newSet;
      });
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

  const toggleDomainExpansion = (roleId: string, domainName: string) => {
    setExpandedDomains(prev => {
      const roleDomains = prev[roleId] || new Set();
      const newDomains = new Set(roleDomains);
      if (newDomains.has(domainName)) {
        newDomains.delete(domainName);
      } else {
        newDomains.add(domainName);
      }
      return { ...prev, [roleId]: newDomains };
    });
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

  const handleCompetencyClick = async (competencyId: string) => {
    try {
      const details = await apiClient.getCompetency(competencyId);
      setSelectedCompetency(details);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Failed to load competency details:', err);
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
          Explore 17 professional roles in digital health. Click on any role to see its detailed description and required competencies.
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
                const competencies = roleCompetencies[role.role_id] || [];
                const isLoadingComp = loadingCompetencies.has(role.role_id);

                // Group competencies by domain
                const groupedCompetencies = competencies.reduce((acc, comp) => {
                  if (!acc[comp.domain_name]) {
                    acc[comp.domain_name] = [];
                  }
                  acc[comp.domain_name].push(comp);
                  return acc;
                }, {} as Record<string, RoleCompetencyWithDetails[]>);

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

                    {isExpanded && (
                      <CardContent className="pt-0">
                        <div className="pl-7 pr-4 pb-2 space-y-6">
                          {/* Role Description */}
                          {role.role_description && (
                            <div>
                              <h4 className="font-semibold text-slate-800 mb-2">Description</h4>
                              <p className="text-slate-700 leading-relaxed">
                                {role.role_description}
                              </p>
                            </div>
                          )}

                          {/* Competencies Section */}
                          <div>
                            <h4 className="font-semibold text-slate-800 mb-3">
                              Required Competencies {competencies.length > 0 && `(${competencies.length})`}
                            </h4>

                            {isLoadingComp && (
                              <div className="text-sm text-slate-500 py-4">Loading competencies...</div>
                            )}

                            {!isLoadingComp && competencies.length === 0 && (
                              <div className="text-sm text-slate-500 py-4 bg-slate-50 rounded-lg p-4 text-center">
                                No competencies mapped to this role yet. Use the Mappings page to import competencies.
                              </div>
                            )}

                            {!isLoadingComp && competencies.length > 0 && (
                              <div className="space-y-4">
                                {Object.entries(groupedCompetencies).map(([domainName, domainComps]) => {
                                  const isDomainExpanded = expandedDomains[role.role_id]?.has(domainName) || false;

                                  return (
                                    <div key={domainName} className="border-l-4 border-indigo-300 pl-4 py-2">
                                      <div
                                        className="flex items-center gap-2 cursor-pointer hover:bg-indigo-50/50 rounded px-2 py-1 -ml-2 transition-colors"
                                        onClick={() => toggleDomainExpansion(role.role_id, domainName)}
                                      >
                                        {isDomainExpanded ? (
                                          <ChevronDown className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                                        ) : (
                                          <ChevronRight className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                                        )}
                                        <h5 className="font-bold text-indigo-700 text-base">
                                          {domainName} ({domainComps.length})
                                        </h5>
                                      </div>

                                      {isDomainExpanded && (
                                        <div className="space-y-2 mt-3">
                                          {domainComps.map((comp) => (
                                            <div
                                              key={comp.role_competency_id}
                                              className="p-3 bg-white/90 border border-blue-200 rounded-lg hover:shadow-md hover:border-blue-400 transition-all cursor-pointer"
                                              onClick={() => handleCompetencyClick(comp.competency_id)}
                                            >
                                              <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                  <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 font-semibold text-xs rounded-md mb-1">
                                                    {comp.competency_code}
                                                  </div>
                                                  <div className="font-semibold text-slate-800 text-sm">
                                                    {comp.competency_title}
                                                  </div>
                                                  {comp.competency_statement && (
                                                    <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                                                      {comp.competency_statement}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
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

      {/* Competency Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedCompetency && (
            <>
              <DialogHeader>
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-bold text-sm rounded-md mb-3 w-fit">
                  {selectedCompetency.competency_code}
                </div>
                <DialogTitle className="text-2xl font-bold text-slate-800">
                  {selectedCompetency.competency_title}
                </DialogTitle>
                {selectedCompetency.competency_statement && (
                  <DialogDescription className="text-base text-slate-600 mt-2">
                    {selectedCompetency.competency_statement}
                  </DialogDescription>
                )}
              </DialogHeader>

              {selectedCompetency.performance_criteria && selectedCompetency.performance_criteria.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Performance Criteria</h3>
                  <ul className="space-y-3">
                    {selectedCompetency.performance_criteria
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((criteria, index) => (
                        <li
                          key={criteria.criteria_id}
                          className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="text-slate-700 leading-relaxed">
                            {criteria.criteria_text}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
