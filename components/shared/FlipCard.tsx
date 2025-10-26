'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FlipCardProps {
  name: string;
  title: string;
  expertise: string[];
  bio?: string;
  email?: string;
  imageUrl?: string;
  linkedinUrl?: string;
}

export default function FlipCard({ name, title, expertise, bio, email, imageUrl, linkedinUrl }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="flip-card-container h-[605px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsFlipped(!isFlipped);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div
        className={`flip-card-inner relative w-full h-full transition-transform duration-500 preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front of card */}
        <div
          className="flip-card-front absolute inset-0 w-full h-full backface-hidden bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between border-2 border-xl-light-grey hover:border-xl-bright-blue transition-colors"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div>
            {imageUrl ? (
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 mx-auto border-4 border-xl-bright-blue/20 bg-gray-100">
                <Image
                  src={imageUrl}
                  alt={name}
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-xl-dark-blue to-xl-bright-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                {name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            <h3 className="text-xl font-bold text-xl-dark-blue mb-2 text-center">{name}</h3>
            <p className="text-sm text-xl-grey mb-4 text-center">{title}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-xl-grey uppercase tracking-wide mb-2">
              Expertise
            </h4>
            <ul className="space-y-1">
              {expertise.map((item, index) => (
                <li key={index} className="flex items-start text-sm text-xl-grey">
                  <svg
                    className="h-4 w-4 text-xl-bright-blue mr-2 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center text-xs text-xl-bright-blue font-semibold mt-4">
            Click to learn more →
          </div>
        </div>

        {/* Back of card */}
        <div
          className="flip-card-back absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-xl-dark-blue to-xl-bright-blue rounded-lg shadow-lg p-6 flex flex-col justify-between text-white"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div>
            <h3 className="text-xl font-bold mb-2">{name}</h3>
            <p className="text-sm text-white/90 mb-4">{title}</p>

            {bio && (
              <div className="text-sm leading-relaxed text-white/90">
                {bio}
              </div>
            )}
          </div>

          {(email || linkedinUrl) && (
            <div className="mt-4 space-y-2">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center text-sm text-white hover:text-white/90 transition-colors bg-white/10 hover:bg-white/20 px-3 py-2 rounded"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {email}
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-white hover:text-white/90 transition-colors bg-white/10 hover:bg-white/20 px-3 py-2 rounded"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  Connect on LinkedIn
                </a>
              )}
            </div>
          )}

          <div className="text-center text-xs font-semibold mt-4 text-white/80">
            Click to flip back ←
          </div>
        </div>
      </div>
    </div>
  );
}
