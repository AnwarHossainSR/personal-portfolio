import { Code, Cloud, Database, Settings, Layers, Globe } from 'lucide-react';
import { SEOHead } from '@/components/SEO';
import { skillCategories } from '@/data/skills';

const iconMap = {
  'Languages': Code,
  'Frontend': Globe,
  'Backend': Layers,
  'Cloud & DevOps': Cloud,
  'Databases': Database,
  'Tools & Technologies': Settings
};

const experienceLevels = {
  'Expert': { width: '90%', color: 'bg-primary' },
  'Advanced': { width: '75%', color: 'bg-primary/80' },
  'Intermediate': { width: '60%', color: 'bg-primary/60' },
  'Beginner': { width: '30%', color: 'bg-primary/40' }
};

export default function Skills() {
  return (
    <>
      <SEOHead
        title="Technical Skills"
        description="Comprehensive overview of Anwar Hossain's technical skills including AWS, React, Node.js, DevOps, and professional certifications."
        keywords="Anwar Hossain Skills, AWS Skills, React Developer, Node.js Expert, DevOps Skills, Technical Certifications"
        url="https://anwarportfolio.vercel.app/skills"
      />
      <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 slide-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Technical <span className="gradient-text">Skills</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive overview of my technical expertise across different domains of software engineering
          </p>
        </div>

        {/* Skills Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 slide-in-up" style={{ animationDelay: '200ms' }}>
          <div className="premium-card p-6 text-center hover:scale-105 transition-transform">
            <div className="text-3xl font-bold gradient-text mb-2">15+</div>
            <div className="text-sm text-muted-foreground">Programming Languages</div>
          </div>
          <div className="premium-card p-6 text-center hover:scale-105 transition-transform">
            <div className="text-3xl font-bold gradient-text mb-2">25+</div>
            <div className="text-sm text-muted-foreground">Frameworks & Libraries</div>
          </div>
          <div className="premium-card p-6 text-center hover:scale-105 transition-transform">
            <div className="text-3xl font-bold gradient-text mb-2">20+</div>
            <div className="text-sm text-muted-foreground">AWS Services</div>
          </div>
          <div className="premium-card p-6 text-center hover:scale-105 transition-transform">
            <div className="text-3xl font-bold gradient-text mb-2">10+</div>
            <div className="text-sm text-muted-foreground">DevOps Tools</div>
          </div>
        </div>

        {/* Skills Categories */}
        <div className="space-y-12">
          {skillCategories.map((category, categoryIndex) => {
            const Icon = iconMap[category.name as keyof typeof iconMap] || Code;
            
            return (
              <div
                key={category.name}
                className="slide-in-up"
                style={{ animationDelay: `${categoryIndex * 200}ms` }}
              >
                <div className="premium-card p-8">
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{category.name}</h2>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {category.skills.map((skill, skillIndex) => (
                      <div
                        key={skill.name}
                        className="group hover:scale-102 transition-transform duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {skill.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {skill.level}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${
                              experienceLevels[skill.level as keyof typeof experienceLevels]?.color || 'bg-primary'
                            }`}
                            style={{
                              width: experienceLevels[skill.level as keyof typeof experienceLevels]?.width || '50%',
                              animationDelay: `${categoryIndex * 200 + skillIndex * 100}ms`
                            }}
                          />
                        </div>
                        
                        {/* Years of Experience */}
                        {skill.yearsOfExperience && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {skill.yearsOfExperience} years of experience
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </>
  );
}