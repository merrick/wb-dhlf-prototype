/**
 * Learning Modules Page
 * Version: 3.0.0
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, GraduationCap, Video, FileText, Award, Info } from 'lucide-react';

export function LearningModulesPage() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold gradient-text">Learning Modules</h1>
        <p className="text-lg text-slate-600">
          Access training materials, courses, videos, case studies, and other learning resources aligned with digital health competency requirements.
        </p>
      </div>

      {/* Info Card */}
      <Card className="glass-effect border-l-4 border-purple-500 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <Info className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">About Learning Resources</CardTitle>
              <CardDescription className="text-base">
                Competency-aligned learning pathways
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            Our learning resources are carefully mapped to specific competencies and performance
            criteria, ensuring targeted skill development for digital health professionals.
          </p>
          <p>
            Learning modules cover topics across all 9 domains and 45 subdomains, providing comprehensive
            learning pathways for various professional roles in digital health.
          </p>
        </CardContent>
      </Card>

      {/* Learning Module Types Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass-effect hover:shadow-xl transition-all border-t-4 border-blue-500">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                <Video className="h-7 w-7 text-white" />
              </div>
            </div>
            <CardTitle className="gradient-text">Online Courses</CardTitle>
            <CardDescription>Self-paced learning modules</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-center text-sm">
              Interactive video-based courses with quizzes and practical exercises.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect hover:shadow-xl transition-all border-t-4 border-indigo-500">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
            </div>
            <CardTitle className="gradient-text">Workshops</CardTitle>
            <CardDescription>Hands-on training sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-center text-sm">
              Live instructor-led workshops and practical training programs.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect hover:shadow-xl transition-all border-t-4 border-purple-500">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                <FileText className="h-7 w-7 text-white" />
              </div>
            </div>
            <CardTitle className="gradient-text">Resources</CardTitle>
            <CardDescription>Videos, case studies & briefs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-center text-sm">
              Videos, case studies, briefs, guides, and supplementary learning materials.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Card */}
      <Card className="glass-effect shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Planned Features</CardTitle>
              <CardDescription>Learning module management and tracking system</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-slate-600">
            <p>Upcoming learning module management features will include:</p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <ul className="space-y-2 list-disc ml-4">
                <li>Browse learning modules by competency domain</li>
                <li>Filter by delivery format and duration</li>
                <li>View competency-module mappings</li>
                <li>Track module completion progress</li>
              </ul>
              <ul className="space-y-2 list-disc ml-4">
                <li>Certificate generation</li>
                <li>Role-specific learning pathways</li>
                <li>Recommended modules by role</li>
                <li>Training needs gap analysis</li>
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

      {/* CTA Card */}
      <Card className="glass-effect bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-blue-600" />
          <h3 className="text-2xl font-bold gradient-text mb-3">
            Building Capacity Worldwide
          </h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Our learning ecosystem is designed to support continuous professional development
            and build digital health capacity across governments, organizations, and communities worldwide.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
