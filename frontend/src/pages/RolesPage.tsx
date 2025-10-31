/**
 * Roles Page
 * Version: 2.0.0
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, GraduationCap, Briefcase, Info } from 'lucide-react';

export function RolesPage() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold gradient-text">Professional Roles</h1>
        <p className="text-lg text-slate-600">
          Explore 17 professional roles in digital health and their competency requirements.
        </p>
      </div>

      {/* Info Card */}
      <Card className="glass-effect border-l-4 border-indigo-500 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600">
              <Info className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">About Roles</CardTitle>
              <CardDescription className="text-base">
                Understanding professional role classifications
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            The Digital Health Competency Framework identifies 17 distinct professional roles,
            each with specific competency requirements mapped to domains and subdomains.
          </p>
          <p>
            Roles are categorized into two main types: Government sector roles and Other sector roles
            (including private sector, academia, and international organizations).
          </p>
        </CardContent>
      </Card>

      {/* Role Categories Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-effect hover:shadow-xl transition-all border-l-4 border-blue-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl gradient-text">Government Roles</CardTitle>
                <CardDescription className="text-base">Public sector positions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-slate-600">
              Roles within government health systems and public health organizations, focused on
              policy development, implementation, and digital health program management.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                Role competency mappings available
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect hover:shadow-xl transition-all border-l-4 border-purple-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl gradient-text">Other Sector Roles</CardTitle>
                <CardDescription className="text-base">Private, academic & international</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-slate-600">
              Positions in private sector organizations, academic institutions, NGOs, and international
              health organizations driving digital health innovation and research.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                Role competency mappings available
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Card */}
      <Card className="glass-effect shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Role Management Features</CardTitle>
              <CardDescription>Coming Soon</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-slate-600">
            <p>We're developing comprehensive role management features including:</p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Browse all 17 professional roles with detailed descriptions</li>
              <li>View competency requirements for each role</li>
              <li>Explore role-specific competency mappings</li>
              <li>Compare competency requirements across roles</li>
              <li>Export role profiles and competency matrices</li>
            </ul>
            <div className="pt-4">
              <div className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-semibold">
                ⏳ Features under active development
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}