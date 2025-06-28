'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Video, 
  Mic, 
  Smile, 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  FileVideo,
  Play,
  Pause
} from 'lucide-react'
import VideoUploader from './components/VideoUploader'
import AnalysisResults from './components/AnalysisResults'
import ProgressIndicator from './components/ProgressIndicator'

interface AnalysisResult {
  speechAnalysis: {
    text: string
    evaluation: string
    confidence: number
    feedback: string
    suggestions: string[]
  }
  facialAnalysis: {
    dominantExpression: string
    feedback: string
  }
  isComplete: boolean
}

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleVideoReady = () => {
    setVideoReady(true)
    setAnalysisResult(null)
    setError(null)
  }

  const performAnalysis = async () => {
    if (!videoReady) return

    setIsAnalyzing(true)
    setCurrentStep(0)
    setProgress(0)
    setError(null)

    try {
      // Update progress steps
      const steps = [
        { name: 'Loading video file...', duration: 1000 },
        { name: 'Extracting audio from video...', duration: 2000 },
        { name: 'Transcribing speech...', duration: 3000 },
        { name: 'Analyzing speech content...', duration: 2500 },
        { name: 'Processing facial expressions...', duration: 4000 },
        { name: 'Generating feedback...', duration: 1500 }
      ]

      // Simulate progress while API call is processing
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)
        setProgress((i / steps.length) * 100)
        
        if (i === 0) {
          // Make the actual API call at the beginning
          const response = await fetch('/api/analyze', {
            method: 'POST',
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const result = await response.json()
          
          if (result.error) {
            throw new Error(result.error)
          }

          setAnalysisResult(result)
        }
        
        await new Promise(resolve => setTimeout(resolve, steps[i].duration))
      }

      setProgress(100)
    } catch (error) {
      console.error('Analysis error:', error)
      setError(error instanceof Error ? error.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setVideoReady(false)
    setAnalysisResult(null)
    setCurrentStep(0)
    setProgress(0)
    setError(null)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-full mr-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Interview Analyzer</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant AI-powered feedback on your interview performance with speech and facial expression analysis
          </p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Analysis Error:</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Video Status and Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Video className="w-6 h-6 mr-2 text-primary-600" />
                Video Analysis
              </h2>
              
              {!videoReady ? (
                <VideoUploader onVideoReady={handleVideoReady} />
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <FileVideo className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">temp.mp4.mp4 loaded</p>
                        <p className="text-sm text-gray-500">Ready for analysis</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={performAnalysis}
                      disabled={isAnalyzing}
                      className="btn-primary flex items-center"
                    >
                      {isAnalyzing ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-5 h-5 mr-2" />
                      )}
                      {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
                    </button>
                    
                    <button
                      onClick={resetAnalysis}
                      className="btn-secondary"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Analysis Progress and Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {isAnalyzing ? (
              <div className="card">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Loader2 className="w-6 h-6 mr-2 text-primary-600 animate-spin" />
                  Analyzing Your Interview
                </h2>
                <ProgressIndicator 
                  currentStep={currentStep}
                  progress={progress}
                />
              </div>
            ) : analysisResult ? (
              <div className="card">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                  Analysis Complete
                </h2>
                <AnalysisResults result={analysisResult} />
                <div className="mt-6">
                  <button
                    onClick={resetAnalysis}
                    className="btn-secondary w-full"
                  >
                    Analyze Another Video
                  </button>
                </div>
              </div>
            ) : (
              <div className="card">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Brain className="w-6 h-6 mr-2 text-primary-600" />
                  Analysis Results
                </h2>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    Upload a video and start analysis to see results here
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Upload Video</h3>
              <p className="text-gray-600">
                Upload your MP4 interview video. Our system will extract audio and analyze video frames.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mic className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Speech Analysis</h3>
              <p className="text-gray-600">
                AI transcribes your speech and evaluates clarity, structure, and content quality.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Smile className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Facial Analysis</h3>
              <p className="text-gray-600">
                Deep learning analyzes your facial expressions for confidence and emotional state.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 