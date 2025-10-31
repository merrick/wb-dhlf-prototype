/**
 * Mappings Page
 * Version: 2.0.0
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, GitBranch, Users2, Target, Info, ArrowRight } from 'lucide-react';

export function MappingsPage() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold gradient-text">Role-Competency Mappings</h1>
        <p className="text-lg text-slate-600">
          Explore relationships between professional roles and required competencies.
        </p>
      </div>

      {/* Info Card */}
      <Card className="glass-effect border-l-4 border-pink-500 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-pink-600">
              <Info className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">About Mappings</CardTitle>
              <CardDescription className="text-base">
                Understanding role-competency relationships
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            Role-competency mappings define which competencies are required for each professional role
            in the digital health ecosystem. Currently, the framework includes 59 mappings across 17 roles.
          </p>
          <p>
            These mappings help organizations understand competency requirements, identify skills gaps,
            and develop targeted training programs for specific roles.
          </p>
        </CardContent>
      </Card>

      {/* Mapping Types Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass-effect hover:shadow-xl transition-all border-t-4 border-blue-500">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                <Users2 className="h-7 w-7 text-white" />
              </div>
            </div>
            <CardTitle className="gradient-text">Role Analysis</CardTitle>
            <CardDescription>View competency requirements by role</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-center text-sm">
              Explore which competencies are required for each of the 17 professional roles.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect hover:shadow-xl transition-all border-t-4 border-indigo-500">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600">
                <Target className="h-7 w-7 text-white" />
              </div>
            </div>
            <CardTitle className="gradient-text">Competency Coverage</CardTitle>
            <CardDescription>See which roles require each competency</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-center text-sm">
              Understand the breadth of application for each competency across roles.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect hover:shadow-xl transition-all border-t-4 border-purple-500">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                <GitBranch className="h-7 w-7 text-white" />
              </div>
            </div>
            <CardTitle className="gradient-text">Gap Analysis</CardTitle>
            <CardDescription>Identify competency gaps</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-center text-sm">
              Compare current capabilities against role requirements to find gaps.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Mappings Stats */}
      <Card className="glass-effect bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <Network className="h-16 w-16 mx-auto text-blue-600" />
            <div>
              <h3 className="text-3xl font-bold gradient-text mb-2">59 Active Mappings</h3>
              <p className="text-slate-600 text-lg">
                Across 17 professional roles and 214 competencies
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 pt-4">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">17</div>
                <div className="text-sm text-slate-600">Professional Roles</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-indigo-600">214</div>
                <div className="text-sm text-slate-600">Total Competencies</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">59</div>
                <div className="text-sm text-slate-600">Role-Competency Links</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Card */}
      <Card className="glass-effect shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <ArrowRight className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Planned Features</CardTitle>
              <CardDescription>Interactive mapping exploration tools</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-slate-600">
            <p>Upcoming mapping management and visualization features will include:</p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <ul className="space-y-2 list-disc ml-4">
                <li>Interactive mapping visualization</li>
                <li>Filter mappings by domain or role type</li>
                <li>View detailed competency requirements per role</li>
                <li>Compare competency profiles across roles</li>
              </ul>
              <ul className="space-y-2 list-disc ml-4">
                <li>Export mapping matrices</li>
                <li>Copy mappings between similar roles</li>
                <li>Gap analysis and reporting tools</li>
                <li>Bulk mapping management interface</li>
              </ul>
            </div>
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