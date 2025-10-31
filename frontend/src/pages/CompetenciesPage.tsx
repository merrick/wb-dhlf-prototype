/**
 * Competencies Page
 * Version: 1.0.0
 */

import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';
import type { Domain, CompetencyWithContext } from '@/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight, ChevronDown } from 'lucide-react';

export function CompetenciesPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [competencies, setCompetencies] = useState<CompetencyWithContext[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    searchCompetencies();
  }, [searchTerm, selectedDomain]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [domainsData, competenciesData] = await Promise.all([
        apiClient.getDomains(),
        apiClient.getCompetencies(),
      ]);
      setDomains(domainsData);
      setCompetencies(competenciesData);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchCompetencies = async () => {
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedDomain) params.domain_id = selectedDomain;
      
      const data = await apiClient.getCompetencies(params);
      setCompetencies(data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const toggleDomainExpansion = (domainId: string) => {
    const newExpanded = new Set(expandedDomains);
    if (newExpanded.has(domainId)) {
      newExpanded.delete(domainId);
    } else {
      newExpanded.add(domainId);
    }
    setExpandedDomains(newExpanded);
  };

  const handleDomainFilter = (domainId: string | null) => {
    setSelectedDomain(domainId);
  };

  const groupedCompetencies = competencies.reduce((acc, competency) => {
    const domainKey = competency.domain_id;
    const subdomainKey = competency.subdomain_id;
    
    if (!acc[domainKey]) {
      acc[domainKey] = {};
    }
    if (!acc[domainKey][subdomainKey]) {
      acc[domainKey][subdomainKey] = [];
    }
    acc[domainKey][subdomainKey].push(competency);
    
    return acc;
  }, {} as Record<string, Record<string, CompetencyWithContext[]>>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading competencies...</div>
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
        <h1 className="text-4xl font-bold gradient-text">Digital Health Competency Framework</h1>
        <p className="text-lg text-slate-600">
          Explore competencies organized by domains and subdomains. Use search to find specific competencies.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search competencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedDomain === null ? "default" : "outline"}
            size="sm"
            onClick={() => handleDomainFilter(null)}
          >
            All Domains
          </Button>
          {domains.slice(0, 3).map((domain) => (
            <Button
              key={domain.domain_id}
              variant={selectedDomain === domain.domain_id ? "default" : "outline"}
              size="sm"
              onClick={() => handleDomainFilter(domain.domain_id)}
            >
              {domain.domain_name}
            </Button>
          ))}
        </div>
      </div>

      {/* Competencies Display */}
      <div className="space-y-4">
        {domains.map((domain) => {
          const domainCompetencies = groupedCompetencies[domain.domain_id];
          if (!domainCompetencies || Object.keys(domainCompetencies).length === 0) {
            return null;
          }

          const isExpanded = expandedDomains.has(domain.domain_id);
          const competencyCount = Object.values(domainCompetencies)
            .reduce((sum, subdomainCompetencies) => sum + subdomainCompetencies.length, 0);

          return (
            <Card key={domain.domain_id} className="overflow-hidden glass-effect shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
              <CardHeader
                className="cursor-pointer hover:bg-blue-50/50 transition-colors"
                onClick={() => toggleDomainExpansion(domain.domain_id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-blue-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-blue-600" />
                      )}
                      <span className="gradient-text">{domain.domain_title}</span>
                    </CardTitle>
                    <CardDescription className="mt-1 text-base">
                      {competencyCount} competencies across {Object.keys(domainCompetencies).length} subdomains
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {Object.entries(domainCompetencies).map(([subdomainId, subdomainCompetencies]) => {
                      const subdomain = subdomainCompetencies[0]; // Get subdomain info from first competency
                      
                      return (
                        <div key={subdomainId} className="border-l-4 border-indigo-300 pl-4 py-2">
                          <h4 className="font-bold text-indigo-700 mb-3 text-lg">
                            {subdomain.subdomain_title}
                          </h4>
                          <div className="space-y-3">
                            {subdomainCompetencies.map((competency) => (
                              <div
                                key={competency.competency_id}
                                className="p-4 bg-white/90 border border-blue-200 rounded-xl hover:shadow-md hover:border-blue-400 transition-all cursor-pointer"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 font-semibold text-xs rounded-md mb-2">
                                      {competency.competency_code}
                                    </div>
                                    <div className="font-bold text-slate-800 mt-1">
                                      {competency.competency_title}
                                    </div>
                                    {competency.competency_statement && (
                                      <div className="text-sm text-slate-600 mt-2 leading-relaxed">
                                        {competency.competency_statement}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {competencies.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            No competencies found matching your search criteria.
          </div>
        </div>
      )}
    </div>
  );
}