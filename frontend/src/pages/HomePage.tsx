/**
 * Home Page - Landing Page
 * Version: 1.0.0
 */

import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Users, BookOpen, Network, ArrowRight, CheckCircle2 } from 'lucide-react';

export function HomePage() {
  const features = [
    {
      icon: Globe,
      title: 'Competencies',
      description: 'Explore 214 digital health competencies organized across 9 domains and 45 subdomains.',
      href: '/competencies',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Roles',
      description: 'Discover 17 professional roles and their required competency mappings in digital health.',
      href: '/roles',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: BookOpen,
      title: 'Learning Modules',
      description: 'Access training materials, courses, videos, case studies, and briefs aligned with competency requirements.',
      href: '/learning-modules',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Network,
      title: 'Mappings',
      description: 'View detailed mappings between roles, competencies, and training resources.',
      href: '/mappings',
      color: 'from-pink-500 to-pink-600'
    },
  ];

  const highlights = [
    '9 Core Domains',
    '45 Subdomains',
    '214 Competencies',
    '923 Performance Criteria',
    '17 Professional Roles',
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 opacity-50" />
        <div className="relative px-6 py-20 text-center">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              World Bank Draft Framework
            </div>
            <h1 className="text-5xl md:text-6xl font-bold gradient-text leading-tight">
              Digital Health Competency Framework
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              A comprehensive framework for building digital health capacity worldwide.
              Empowering healthcare professionals with essential competencies for the digital age.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link to="/competencies">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8">
                  Explore Competencies
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/roles">
                <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                  View Roles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6">
        <div className="mx-auto max-w-6xl">
          <Card className="glass-effect shadow-xl border-0">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {highlights.map((highlight, index) => (
                  <div key={index} className="text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="font-bold text-slate-800">{highlight}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold gradient-text">Explore the Framework</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Navigate through our comprehensive resources to build digital health capacity
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} to={feature.href}>
                  <Card className="glass-effect hover:shadow-2xl transition-all duration-300 border-0 h-full group">
                    <CardHeader>
                      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-2xl group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                        Learn more
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="px-6">
        <div className="mx-auto max-w-4xl">
          <Card className="glass-effect border-l-4 border-blue-500 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">About This Framework</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                The Digital Health Competency Framework is a comprehensive resource developed by the World Bank
                to support the growth and development of digital health capacity worldwide.
              </p>
              <p>
                This framework identifies essential competencies, maps them to professional roles, and connects
                them with relevant training resources to ensure healthcare professionals are equipped for the digital transformation of healthcare.
              </p>
              <div className="pt-4">
                <div className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-semibold">
                  ⚠️ This is a draft framework under active development
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
