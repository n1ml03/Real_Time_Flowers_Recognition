import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import VideoStream from './components/VideoStream';
import RecognitionResults from './components/RecognitionResults';
import * as tf from '@tensorflow/tfjs';

function App() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<{ name: string; confidence: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const classes = ["Daisy", "Dandelion", "Rose", "Sunflower", "Tulip"];

  useEffect(() => {
    const loadModel = async () => {
      console.log("Loading model...");
      const loadedModel = await tf.loadLayersModel("/models/model.json");
      console.log("Model loaded...");
      setModel(loadedModel);
    };

    loadModel();
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: facingMode, width: 400, height: 400 } 
        });
        setStream(mediaStream);
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleRecognition = async () => {
    if (videoRef.current && canvasRef.current && model) {
      setIsLoading(true);
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 400, 400);
        const imageData = ctx.getImageData(0, 0, 224, 224);
        const tensor = tf.browser.fromPixels(imageData).toFloat().expandDims();
        const normalized = tensor.div(255.0);
        const results = model.predict(normalized) as tf.Tensor;
        const data = results.dataSync();
        const maxIndex = data.indexOf(Math.max(...data));
        setRecognitionResult({
          name: classes[maxIndex],
          confidence: data[maxIndex]
        });
      }
      setIsLoading(false);
    }
  };

  const switchCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-green-800">Flower Recognition App</h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <VideoStream videoRef={videoRef} facingMode={facingMode} />
        <canvas ref={canvasRef} width="224" height="224" className="hidden"></canvas>
        <div className="p-4 space-y-4">
          <button
            onClick={handleRecognition}
            disabled={isLoading || !model}
            className={`w-full ${isLoading || !model ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white font-bold py-3 px-4 rounded-full flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105`}
          >
            {isLoading ? (
              <span className="animate-spin mr-2">&#9696;</span>
            ) : (
              <Camera className="mr-2" />
            )}
            {isLoading ? 'Recognizing...' : 'Recognize Flower'}
          </button>
          <button
            onClick={switchCamera}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
          >
            <RefreshCw className="mr-2" />
            Switch Camera
          </button>
        </div>
      </div>
      <RecognitionResults result={recognitionResult} />
    </div>
  );
}

export default App;