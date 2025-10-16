interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export default function ProgressBar({ currentStep, totalSteps, stepTitles }: ProgressBarProps) {
  return (
    <div className="mb-8">
      {/* Step indicators */}
      <div className="flex justify-between items-center mb-4">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  ${isActive ? 'bg-xl-bright-blue text-white' : ''}
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-300 text-gray-600' : ''}
                `}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span className={`
                text-xs mt-2 text-center
                ${isActive ? 'text-xl-bright-blue font-semibold' : 'text-gray-600'}
              `}>
                {title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-xl-bright-blue h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}