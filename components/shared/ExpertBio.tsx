import Image from 'next/image'
import Link from 'next/link'

interface ExpertBioProps {
  name: string
  title: string
  expertise: string[]
  imagePath?: string
  linkedinUrl?: string
}

export default function ExpertBio({ name, title, expertise, imagePath, linkedinUrl }: ExpertBioProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {imagePath ? (
            <Image
              src={imagePath}
              alt={name}
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600 mb-3">{title}</p>
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Expertise:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {expertise.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          {linkedinUrl && (
            <Link
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                  clipRule="evenodd"
                />
              </svg>
              Connect on LinkedIn
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
