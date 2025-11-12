'use client';

import { useEffect, useState } from 'react';
import AnimatedSection from '@/components/shared/AnimatedSection';

interface TeamMember {
  name: string;
  title: string;
  image: string;
  linkedin: string;
  email: string;
  bio: string[];
  states: string[];
  region: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Steve Caler',
    title: 'Director of Business Development',
    region: 'Southwest/South Region',
    image: '/images/team/steve-headshot.jpg',
    linkedin: 'https://www.linkedin.com/in/steve-caler-csfs-852a7451/',
    email: 'scaler@xlbenefits.com',
    bio: [
      'Steve brings over 20 years of management and personal development experience to XL Benefits. His background spans real estate sales and family ministry leadership, giving him unique insights into relationship building and strategic problem-solving.',
      'At XL Benefits, Steve focuses on expanding broker partnerships and ensuring our services align with market needs. His consultative approach helps brokers understand how stop-loss solutions fit into their overall benefits strategy.',
      'Steve is a sports fanatic, bookworm, and Mexican food enthusiast. He and his wife have six children, which he says is excellent training for managing complex projects.'
    ],
    states: ['CA', 'NV', 'AZ', 'TX', 'OK', 'AR', 'LA', 'MS', 'AL', 'KY', 'TN']
  },
  {
    name: 'Sam Edwards',
    title: 'Stop Loss Sales Consultant',
    region: 'Mountain/Plains/Midwest Region',
    image: '/images/team/sam-headshot.jpg',
    linkedin: 'https://www.linkedin.com/in/samuel-edwards-1baba411a/',
    email: 'sedwards@xlbenefits.com',
    bio: [
      'Sam brings a unique combination of technical expertise and industry knowledge to XL Benefits. With experience in both technology and stop-loss consulting, he helps brokers leverage innovative solutions while providing expert guidance on complex self-funding scenarios.',
      'Specializing in the Mountain, Plains, and Midwest regions, Sam works closely with brokers to navigate the unique regulatory and market conditions across these diverse states.',
      'His approach combines data-driven insights with practical, real-world solutions that help brokers serve their clients more effectively.'
    ],
    states: ['OR', 'WA', 'ID', 'MT', 'WY', 'CO', 'UT', 'NM', 'ND', 'SD', 'NE', 'KS', 'MN', 'WI', 'IA', 'MO', 'IL', 'IN', 'MI', 'OH', 'AK', 'HI']
  },
  {
    name: 'Jennifer Baird-Flynn',
    title: 'Stop Loss Sales Consultant',
    region: 'Eastern Seaboard Region',
    image: '/images/team/jennifer-headshot.jpg',
    linkedin: 'https://www.linkedin.com/in/jennifer-baird-flynn-a2aa113a/',
    email: 'jbaird@xlbenefits.com',
    bio: [
      'Jennifer brings over 20 years of experience in the employee benefits industry, with 4½ years as a benefits consultant and 19 years working directly with a TPA. She specializes in self-funded health plans and cost containment strategies.',
      'Her deep understanding of claims processing, plan administration, and stop-loss coordination helps brokers identify potential issues before they become problems. Jennifer joined XL Benefits in May 2023.',
      'Outside of work, Jennifer is an avid MLS Soccer fan (Charlotte FC), enjoys golfing, spending time at the lake, and volunteering in her community.'
    ],
    states: ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'DE', 'MD', 'DC', 'VA', 'NC', 'SC', 'GA', 'FL', 'WV']
  }
];

// Add Daron as a fallback for any unassigned territories or international visitors
const daronPitts: TeamMember = {
  name: 'Daron Pitts, CSFS',
  title: 'President & Founder',
  region: 'National',
  image: '/images/team/daron-headshot.jpeg',
  linkedin: 'https://www.linkedin.com/in/daron-pitts-b0657063/',
  email: 'dpitts@xlbenefits.com',
  bio: [
    'Daron founded XL Benefits in July 2014 with a mission to bring uncommon service and creative problem-solving to the medical stop-loss industry. With over 12 years of specialized experience, he holds the Certified Self-Funding Specialist (CSFS) designation.',
    'His expertise spans complex rate analysis, multi-carrier RFP management, and helping brokers navigate challenging placements. Daron works primarily with insurance brokers and TPAs across the country, providing the technical depth and carrier relationships needed to serve self-funded groups.',
    'When he\'s not analyzing stop-loss rates, Daron enjoys spending time with his family, coaching youth sports, and following college football.'
  ],
  states: [] // Handles overflow/unassigned
};

/**
 * Get user's location from IP using a geolocation API
 * Returns state code (e.g., 'CA', 'TX', 'NY')
 */
async function getUserState(): Promise<string | null> {
  try {
    // Try ipapi.co (free tier available, no API key needed for basic use)
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      return data.region_code || null; // Returns state code like 'CA', 'TX', etc.
    }
  } catch (error) {
    console.error('Error fetching location:', error);
  }

  // Fallback to ip-api.com
  try {
    const response = await fetch('http://ip-api.com/json/');
    if (response.ok) {
      const data = await response.json();
      return data.region || null; // Returns state code
    }
  } catch (error) {
    console.error('Error with fallback location API:', error);
  }

  return null;
}

/**
 * Select team member based on state
 */
function selectMemberByState(stateCode: string | null): TeamMember {
  if (!stateCode) {
    // If we can't determine location, return Daron as default
    return daronPitts;
  }

  // Find the team member responsible for this state
  const assignedMember = teamMembers.find(member =>
    member.states.includes(stateCode.toUpperCase())
  );

  // Return assigned member or Daron as fallback
  return assignedMember || daronPitts;
}

interface FeaturedExpertRotatorProps {
  forceMemberIndex?: number; // For testing or override
  forceState?: string; // For testing specific states
}

export default function FeaturedExpertRotator({ forceMemberIndex, forceState }: FeaturedExpertRotatorProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember>(daronPitts);
  const [isLoading, setIsLoading] = useState(true);
  const [userState, setUserState] = useState<string | null>(null);

  useEffect(() => {
    const selectMember = async () => {
      // Handle forced member for testing
      if (forceMemberIndex !== undefined && forceMemberIndex < teamMembers.length) {
        setSelectedMember(teamMembers[forceMemberIndex]);
        setIsLoading(false);
        return;
      }

      // Handle forced state for testing
      if (forceState) {
        const member = selectMemberByState(forceState);
        setSelectedMember(member);
        setUserState(forceState);
        setIsLoading(false);
        return;
      }

      try {
        // Get user's state from IP geolocation
        const state = await getUserState();
        setUserState(state);

        // Select appropriate team member
        const member = selectMemberByState(state);
        setSelectedMember(member);
      } catch (error) {
        console.error('Error selecting team member:', error);
        // Default to Daron on error
        setSelectedMember(daronPitts);
      } finally {
        setIsLoading(false);
      }
    };

    selectMember();
  }, [forceMemberIndex, forceState]);

  if (isLoading) {
    return (
      <section className="py-16 bg-xl-dark-blue text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1 text-center">
                <div className="w-48 h-48 rounded-full bg-white/10 mx-auto mb-4"></div>
              </div>
              <div className="md:col-span-2">
                <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
                <div className="h-6 bg-white/10 rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-4 bg-white/10 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-xl-dark-blue text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 text-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white/20">
                {selectedMember.image ? (
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const initialsDiv = document.createElement('div');
                      initialsDiv.className = 'w-full h-full bg-xl-bright-blue flex items-center justify-center text-4xl font-bold';
                      initialsDiv.textContent = selectedMember.name.split(' ').map(n => n[0]).join('');
                      target.parentElement?.appendChild(initialsDiv);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-xl-bright-blue flex items-center justify-center text-4xl font-bold">
                    {selectedMember.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-4">
                {selectedMember.linkedin && (
                  <a
                    href={selectedMember.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label="Connect on LinkedIn"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
                <a
                  href={`mailto:${selectedMember.email}`}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Send email"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
              {/* Show region assignment */}
              {selectedMember.region && (
                <p className="text-xs text-white/60 mt-2">
                  {selectedMember.region}
                  {userState && selectedMember.states.length > 0 && (
                    <span className="block">Your State: {userState}</span>
                  )}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-2">{selectedMember.name}</h2>
              <p className="text-xl-bright-blue font-semibold mb-4">
                {selectedMember.title}
                {selectedMember.region !== 'National' && (
                  <span className="block text-sm font-normal text-white/70 mt-1">
                    Your Regional Specialist
                  </span>
                )}
              </p>
              <div className="text-white/90 leading-relaxed space-y-3">
                {selectedMember.bio.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Call to Action */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-white/80 mb-3">
                  {selectedMember.region === 'National'
                    ? 'Have questions about stop-loss solutions?'
                    : `Have questions about stop-loss in ${selectedMember.region.includes('Region') ? 'the ' + selectedMember.region : selectedMember.region}?`
                  }
                </p>
                <a
                  href={`mailto:${selectedMember.email}?subject=Question about Stop-Loss Calculations`}
                  className="inline-flex items-center px-6 py-3 bg-xl-bright-blue rounded-lg hover:bg-xl-dark-blue transition-colors font-semibold text-white hover:text-white"
                  style={{ color: '#FFFFFF' }}
                >
                  Ask {selectedMember.name.split(' ')[0]} a Question
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}