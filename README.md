# Interview Analyzer Frontend

A modern React/Next.js frontend for AI-powered interview analysis using speech recognition and facial expression analysis.

## Features

- 🎥 **Video Upload**: Drag & drop or click to upload MP4 interview videos
- 🎤 **Speech Analysis**: AI-powered speech transcription and content evaluation
- 😊 **Facial Expression Analysis**: Deep learning analysis of facial expressions
- 📊 **Detailed Feedback**: Comprehensive feedback with suggestions for improvement
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- ⚡ **Real-time Progress**: Live progress tracking during analysis

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Backend**: Next.js API Routes
- **ML Integration**: Ready for integration with your Python ML model

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Your ML model (the Python code you provided)

## Installation

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up your ML model**
   - Create a Python environment for your ML model
   - Install the required packages:
     ```bash
     pip install deepface opencv-python SpeechRecognition transformers torch torchaudio moviepy
     ```
   - Save your ML model code as `ml_model.py` in the project root

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
interview-analyzer-frontend/
├── app/
│   ├── components/
│   │   ├── VideoUploader.tsx      # Video upload component
│   │   ├── ProgressIndicator.tsx  # Analysis progress display
│   │   └── AnalysisResults.tsx    # Results display component
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts           # API endpoint for analysis
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page component
├── package.json                   # Dependencies and scripts
├── tailwind.config.js            # Tailwind configuration
├── next.config.js                # Next.js configuration
└── README.md                     # This file
```

## Integration with Your ML Model

The frontend is designed to work with your ML model. Here's how to integrate it:

### Option 1: API Integration (Recommended)

1. **Create a Python Flask/FastAPI server** with your ML model
2. **Update the API route** in `app/api/analyze/route.ts` to call your Python server
3. **Handle file uploads** and return analysis results

### Option 2: Direct Integration

1. **Install Python dependencies** in your Next.js project
2. **Use child_process** to call your Python script directly
3. **Handle the communication** between Node.js and Python

### Example API Integration

```typescript
// In app/api/analyze/route.ts
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('video') as File
    
    // Save file temporarily
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const videoPath = `/tmp/upload_${Date.now()}.mp4`
    await writeFile(videoPath, buffer)
    
    // Call your ML model
    const { stdout } = await execAsync(`python ml_model.py "${videoPath}"`)
    const result = JSON.parse(stdout)
    
    // Clean up
    await unlink(videoPath)
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
```

## Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `app/globals.css` for custom styles
- Use Tailwind classes for responsive design

### Components
- Each component is modular and can be easily modified
- Add new features by creating new components
- Update the analysis flow in `app/page.tsx`

### API Endpoints
- Add new endpoints in `app/api/`
- Modify the analysis route for different ML models
- Add authentication if needed

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Build command: `npm run build`
- **Railway**: Supports Node.js applications
- **AWS/GCP**: Deploy as a containerized application

## Environment Variables

Create a `.env.local` file for environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# ML Model Configuration (if using external service)
ML_MODEL_URL=http://localhost:8000/analyze
ML_MODEL_API_KEY=your_api_key_here
```

## Troubleshooting

### Common Issues

1. **Dependencies not found**
   ```bash
   npm install
   # or delete node_modules and package-lock.json, then npm install
   ```

2. **TypeScript errors**
   ```bash
   npm run build
   # Check for type errors and fix them
   ```

3. **ML model integration issues**
   - Ensure Python environment is set up correctly
   - Check file paths and permissions
   - Verify all ML dependencies are installed

4. **Video upload issues**
   - Check file size limits (100MB default)
   - Verify supported formats (MP4, MOV, AVI)
   - Ensure proper CORS configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the code comments
3. Create an issue in the repository

---

**Note**: This frontend is designed to work with your ML model. Make sure to properly integrate your Python code and test the complete pipeline before deployment. #   m l _ m o d e l  
 