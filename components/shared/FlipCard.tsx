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
}

export default function FlipCard({ name, title, expertise, bio, email, imageUrl }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="flip-card-container h-80 cursor-pointer"
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
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 mx-auto border-4 border-xl-bright-blue/20">
                <Image
                  src={imageUrl}
                  alt={name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
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

          {email && (
            <div className="mt-4">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center text-sm text-white hover:text-white/80 transition-colors"
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
