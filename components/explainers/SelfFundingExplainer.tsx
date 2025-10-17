'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Volume2, VolumeX, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Scene {
  id: string
  duration: number // in seconds
  title: string
  content: JSX.Element
}

export default function SelfFundingExplainer() {
  const router = useRouter()
  const [currentScene, setCurrentScene] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const scenes: Scene[] = [
    {
      id: 'intro',
      duration: 3,
      title: 'The Million Dollar Question',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-xl-bright-blue mb-6 animate-slide-up">
              Should You Self-Fund?
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 animate-slide-up animation-delay-200">
              The million dollar question for your benefits
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'problem',
      duration: 5,
      title: 'The Challenge',
      content: (
        <div className="flex flex-col items-center justify-center h-full px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
            <div className="animate-slide-in-left">
              <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
                <h2 className="text-3xl font-bold text-red-600 mb-4">Traditional Insurance</h2>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>Fixed high premiums</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>No control over costs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>Carrier keeps savings</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="animate-slide-in-right animation-delay-300">
              <div className="bg-green-50 rounded-2xl p-8 border-2 border-green-200">
                <h2 className="text-3xl font-bold text-green-600 mb-4">Self-Funding?</h2>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Pay only what you use</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Full transparency</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">?</span>
                    <span className="font-bold">But is it right for you?</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'stats',
      duration: 4,
      title: 'The Opportunity',
      content: (
        <div className="flex flex-col items-center justify-center h-full px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-12 animate-fade-in">
              Companies Like Yours Are Saving Big
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="animate-scale-in">
                <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform">
                  <div className="text-5xl font-bold text-xl-bright-blue counter" data-target="82">0</div>
                  <div className="text-xl text-gray-600 mt-2">%</div>
                  <p className="text-gray-700 mt-4">Of eligible companies could benefit from self-funding</p>
                </div>
              </div>
              <div className="animate-scale-in animation-delay-200">
                <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform">
                  <div className="text-5xl font-bold text-green-600 counter" data-target="25">0</div>
                  <div className="text-xl text-gray-600 mt-2">%</div>
                  <p className="text-gray-700 mt-4">Average first-year savings</p>
                </div>
              </div>
              <div className="animate-scale-in animation-delay-400">
                <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform">
                  <div className="text-5xl font-bold text-purple-600 counter" data-target="1">0</div>
                  <div className="text-xl text-gray-600 mt-2">Million+</div>
                  <p className="text-gray-700 mt-4">Saved by our average client</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'calculator',
      duration: 6,
      title: 'Our Assessment Tool',
      content: (
        <div className="flex flex-col items-center justify-center h-full px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 animate-fade-in">
              Find Out in 2 Minutes
            </h2>
            <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-xl-bright-blue">We Analyze:</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 animate-slide-in-left animation-delay-200">
                      <div className="w-12 h-12 bg-xl-bright-blue rounded-full flex items-center justify-center text-white font-bold">1</div>
                      <span className="text-lg">Your company demographics</span>
                    </div>
                    <div className="flex items-center space-x-3 animate-slide-in-left animation-delay-400">
                      <div className="w-12 h-12 bg-xl-bright-blue rounded-full flex items-center justify-center text-white font-bold">2</div>
                      <span className="text-lg">Current plan performance</span>
                    </div>
                    <div className="flex items-center space-x-3 animate-slide-in-left animation-delay-600">
                      <div className="w-12 h-12 bg-xl-bright-blue rounded-full flex items-center justify-center text-white font-bold">3</div>
                      <span className="text-lg">Risk management capabilities</span>
                    </div>
                    <div className="flex items-center space-x-3 animate-slide-in-left animation-delay-800">
                      <div className="w-12 h-12 bg-xl-bright-blue rounded-full flex items-center justify-center text-white font-bold">4</div>
                      <span className="text-lg">Financial readiness</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative animate-float">
                    <div className="w-48 h-48 bg-gradient-to-br from-xl-bright-blue to-purple-600 rounded-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-5xl font-bold">100</div>
                        <div className="text-lg">Point Score</div>
                      </div>
                    </div>
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                      Instant Results
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'results',
      duration: 5,
      title: 'Your Personalized Report',
      content: (
        <div className="flex flex-col items-center justify-center h-full px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 animate-fade-in">
              Get Clear Answers
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-300 animate-slide-up">
                <div className="text-green-600 text-3xl mb-3">✓</div>
                <h3 className="font-bold text-xl text-green-800 mb-2">Readiness Score</h3>
                <p className="text-gray-700">Know exactly how prepared your company is for self-funding</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300 animate-slide-up animation-delay-200">
                <div className="text-blue-600 text-3xl mb-3">📊</div>
                <h3 className="font-bold text-xl text-blue-800 mb-2">Savings Potential</h3>
                <p className="text-gray-700">See estimated savings based on companies like yours</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-300 animate-slide-up animation-delay-400">
                <div className="text-purple-600 text-3xl mb-3">🎯</div>
                <h3 className="font-bold text-xl text-purple-800 mb-2">Next Steps</h3>
                <p className="text-gray-700">Get a custom roadmap for your self-funding journey</p>
              </div>
            </div>
            <div className="mt-12 text-center animate-fade-in animation-delay-800">
              <p className="text-2xl text-gray-700 font-semibold">
                No obligation. No sales pressure. Just answers.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cta',
      duration: 3,
      title: 'Start Now',
      content: (
        <div className="flex flex-col items-center justify-center h-full px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-5xl font-bold text-xl-bright-blue mb-6 animate-scale-in">
              Ready to Find Out?
            </h2>
            <p className="text-2xl text-gray-700 mb-10 animate-fade-in animation-delay-200">
              Take the assessment now and get your results instantly
            </p>
            <button
              onClick={() => router.push('/tools/self-funding-assessment')}
              className="group bg-xl-bright-blue text-white px-10 py-5 rounded-full text-xl font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl animate-bounce-slow animation-delay-400"
            >
              Start Free Assessment
              <ChevronRight className="inline-block ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <p className="text-gray-500 mt-6 animate-fade-in animation-delay-600">
              Takes less than 2 minutes • 100% confidential
            </p>
          </div>
        </div>
      )
    }
  ]

  // Calculate total duration
  const totalDuration = scenes.reduce((acc, scene) => acc + scene.duration, 0)

  // Handle play/pause
  const togglePlay = () => {
    if (!hasStarted) {
      setHasStarted(true)
      setIsPlaying(true)
      // Speak intro if not muted
      if (!isMuted && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Should you self-fund your employee benefits? Find out in 30 seconds.')
        window.speechSynthesis.speak(utterance)
      }
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  // Handle restart
  const restart = () => {
    setCurrentScene(0)
    setProgress(0)
    setIsPlaying(true)
    setHasStarted(true)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
  }

  // Scene progression
  useEffect(() => {
    if (isPlaying && currentScene < scenes.length) {
      // Update progress bar
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          const sceneProgress = prev + (100 / totalDuration) * 0.1
          return Math.min(sceneProgress, 100)
        })
      }, 100)

      // Move to next scene
      intervalRef.current = setTimeout(() => {
        if (currentScene < scenes.length - 1) {
          setCurrentScene(currentScene + 1)
        } else {
          setIsPlaying(false)
        }
      }, scenes[currentScene].duration * 1000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [isPlaying, currentScene, scenes, totalDuration])

  // Animate counters
  useEffect(() => {
    const counters = document.querySelectorAll('.counter')
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0')
      const duration = 2000 // 2 seconds
      const increment = target / (duration / 16) // 60fps
      let current = 0

      const updateCounter = () => {
        current += increment
        if (current < target) {
          counter.textContent = Math.floor(current).toString()
          requestAnimationFrame(updateCounter)
        } else {
          counter.textContent = target.toString()
        }
      }

      if (scenes[currentScene].id === 'stats') {
        setTimeout(updateCounter, 500)
      }
    })
  }, [currentScene, scenes])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Video Container */}
      <div className="relative h-[calc(100vh-120px)] overflow-hidden">
        {/* Current Scene */}
        <div className="h-full">
          {scenes[currentScene] && scenes[currentScene].content}
        </div>

        {/* Overlay for Start Screen */}
        {!hasStarted && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Self-Funding Assessment</h1>
              <p className="text-xl md:text-2xl mb-8">30-Second Explainer</p>
              <button
                onClick={togglePlay}
                className="bg-xl-bright-blue text-white p-6 rounded-full hover:bg-blue-700 transition-colors shadow-2xl transform hover:scale-110"
                aria-label="Play video"
              >
                <Play className="w-12 h-12" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>{scenes[currentScene]?.title || ''}</span>
              <span>{Math.floor(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-xl-bright-blue h-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="p-3 bg-xl-bright-blue text-white rounded-full hover:bg-blue-700 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button
                onClick={restart}
                className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                aria-label="Restart"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            </div>

            {/* Scene Indicators */}
            <div className="flex items-center space-x-2">
              {scenes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentScene(index)
                    setProgress((100 / scenes.length) * index)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentScene
                      ? 'w-8 bg-xl-bright-blue'
                      : index < currentScene
                      ? 'bg-xl-bright-blue opacity-50'
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to scene ${index + 1}`}
                />
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => router.push('/tools/self-funding-assessment')}
              className="px-6 py-3 bg-xl-bright-blue text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Take Assessment Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}