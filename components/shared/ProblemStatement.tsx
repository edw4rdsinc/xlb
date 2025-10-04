interface ProblemStatementProps {
  title: string
  description: string
}

export default function ProblemStatement({ title, description }: ProblemStatementProps) {
  return (
    <div className="bg-gradient-to-r from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}
