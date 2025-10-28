'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Send, Loader2, AlertTriangle, Clock, CheckCircle, DollarSign, Upload, X, Check, Camera, Zap, Sparkles, ImageIcon } from 'lucide-react';
import { processVoiceToText, formatIssueWithAI, analyzeImageWithAI } from '@/lib/ai-processor';
import { commonIssues } from '@/lib/vehicle-models';

interface IssueFormProps {
  vehicleModel: string;
  onSubmit: (issue: any) => void;
}

export default function IssueForm({ vehicleModel, onSubmit }: IssueFormProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [issueText, setIssueText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [autoAnalyzed, setAutoAnalyzed] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setIsProcessing(true);
        
        try {
          const transcribedText = await processVoiceToText(audioBlob);
          setIssueText(transcribedText);
          const analysis = await formatIssueWithAI(transcribedText, vehicleModel);
          setAiAnalysis(analysis);
        } catch (error) {
          console.error('Voice processing failed:', error);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Microphone access denied or not available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Auto-analyze the image immediately
      setIsAnalyzingImage(true);
      setAutoAnalyzed(true);
      try {
        const analysis = await analyzeImageWithAI(file, vehicleModel || 'Unknown');
        setIssueText(analysis.description);
        setAiAnalysis(analysis);
      } catch (error) {
        console.error('Auto image analysis failed:', error);
        setAutoAnalyzed(false);
      } finally {
        setIsAnalyzingImage(false);
      }
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setAutoAnalyzed(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return;
    
    setIsAnalyzingImage(true);
    try {
      const analysis = await analyzeImageWithAI(uploadedImage, vehicleModel || 'Unknown');
      setIssueText(analysis.description);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Image analysis failed:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!issueText.trim()) return;
    
    setIsProcessing(true); 
    try {
      const analysis = await formatIssueWithAI(issueText, vehicleModel);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('AI processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const submitIssue = async () => {
    setIsSubmitting(true);
    
    const issueData = {
      description: aiAnalysis?.formattedIssue || issueText,
      category: aiAnalysis?.category || selectedCategory,
      severity: aiAnalysis?.severity || 'medium',
      suggestedActions: aiAnalysis?.suggestedActions || [],
      possibleCauses: aiAnalysis?.possibleCauses || [],
      urgencyLevel: aiAnalysis?.urgencyLevel || 'Within 1 week',
      estimatedCost: aiAnalysis?.estimatedCost || 'Contact service center',
      vehicleModel,
      status: 'open',
      createdAt: new Date(),
      hasImage: !!uploadedImage,
    };

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData),
      });

      if (response.ok) {
        const savedIssue = await response.json();
        
        // Show success animation
        setIsSubmitted(true);
        
        // Reset form after animation
        setTimeout(() => {
          onSubmit(savedIssue);
          setIssueText('');
          setAiAnalysis(null);
          setSelectedCategory('');
          setUploadedImage(null);
          setImagePreview(null);
          setAutoAnalyzed(false);
          setIsSubmitted(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to submit issue:', error);
      alert('Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success animation overlay
  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 relative overflow-hidden">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold mb-4 text-gray-900">Issue Submitted Successfully!</h3>
          <p className="text-green-700 text-lg">Your vehicle issue has been recorded and analyzed by AI.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section - No Container */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 border-2 border-orange-500 rounded-xl flex items-center justify-center">
            <Send className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report Vehicle Issue</h1>
            <p className="text-gray-600 text-sm">AI-powered issue analysis and diagnosis</p>
          </div>
        </div>
      </div>

      {/* Form Content - No Container */}
      <div className="space-y-8">
        {/* Text Input Section with Image Upload Icon */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-900">Describe Your Issue</Label>
          <div className="flex gap-2">
            <Textarea
              placeholder="Describe the issue with your vehicle in detail..."
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              className="flex-1 bg-white border-orange-200 text-gray-900 placeholder:text-gray-500 focus:border-orange-400 focus:ring-orange-400/20 min-h-[100px] rounded-lg text-sm"
              rows={4}
            />
            <div className="flex flex-col gap-2">
              {/* Image Upload Button */}
              <Button 
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="h-9 w-9 bg-white border-orange-200 hover:bg-orange-500 hover:border-orange-500 group border rounded-lg transition-all duration-200"
                title="Upload Image for AI Analysis"
              >
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                  {uploadedImage && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </Button>
              
              {/* Voice Recording Button */}
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`h-9 w-9 border rounded-lg transition-all duration-200 ${
                  isRecording 
                    ? 'bg-red-100 border-red-300 hover:bg-red-200' 
                    : 'bg-white border-orange-200 hover:bg-orange-500 hover:border-orange-500 group'
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4 text-red-600" />
                ) : (
                  <Mic className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                )}
              </Button>
              
              {/* Analyze Text Button */}
              <Button
                type="button"
                size="icon"
                onClick={handleTextSubmit}
                disabled={!issueText.trim() || isProcessing}
                className="h-9 w-9 bg-white border-orange-200 hover:bg-orange-500 hover:border-orange-500 text-gray-600 hover:text-white rounded-lg transition-all duration-200 group"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
            
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

        {/* Image Preview Section */}
        {imagePreview && (
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-900 flex items-center gap-2"> 
              <Camera className="w-4 h-4 text-orange-600" />
              Uploaded Image
            </Label>
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Issue preview" 
                className="w-full max-w-sm h-48 object-contain rounded-lg border border-orange-200 bg-white mx-auto shadow-sm"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 h-7 w-7 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
              {autoAnalyzed && (
                <div className="absolute bottom-2 left-2 bg-green-100 rounded-lg px-3 py-1 border border-green-300">
                  <div className="flex items-center gap-1 text-green-700">
                    <Sparkles className="w-3 h-3" />
                    <span className="text-xs font-medium">Auto-analyzed by AI</span>
                  </div>
                </div>
              )}
              {!autoAnalyzed && !isAnalyzingImage && (
                <Button
                  type="button"
                  onClick={analyzeImage}
                  className="absolute bottom-2 right-2 bg-white border border-orange-200 hover:bg-orange-500 hover:border-orange-500 text-gray-600 hover:text-white rounded-lg text-xs h-7 transition-all duration-200"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Analyze
                </Button>
              )}
              {isAnalyzingImage && (
                <div className="absolute bottom-2 right-2 bg-blue-100 rounded-lg px-3 py-1 border border-blue-300">
                  <div className="flex items-center gap-1 text-blue-700">
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-medium">Analyzing...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recording Status */}
        {isRecording && (
          <div className="flex items-center gap-3 text-red-700 bg-red-50 p-4 rounded-2xl border border-red-200">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Recording audio... Click stop when finished</span>
          </div>
        )}

        {/* Processing Status */}
        {(isProcessing || isAnalyzingImage) && (
          <div className="flex items-center gap-3 text-blue-700 bg-blue-50 p-4 rounded-2xl border border-blue-200">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium">
              {isAnalyzingImage ? 'AI analyzing image...' : 'Gemini AI processing your issue...'}
            </span>
          </div>
        )}

        {/* Quick Categories */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-900">Quick Issue Categories</Label>
          <div className="flex flex-wrap gap-2">
            {commonIssues.map((issue) => (
              <Badge
                key={issue}
                variant={selectedCategory === issue ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-300 px-3 py-1 text-xs ${
                  selectedCategory === issue 
                    ? 'bg-orange-500 border-orange-500 text-white shadow-md' 
                    : 'bg-white border-orange-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300'
                }`}
                onClick={() => setSelectedCategory(issue)}
              >
                {issue}
              </Badge>
            ))}
          </div>
        </div>

        {/* AI Analysis Results */}
        {aiAnalysis && (
          <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 border-2 border-orange-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI Analysis Complete</h3>
            </div>
            
            <div>
              <Label className="text-sm font-semibold text-gray-800">Formatted Issue Description:</Label>
              <p className="text-sm bg-white rounded-xl p-4 mt-2 text-gray-900 border border-orange-200">{aiAnalysis.formattedIssue}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-semibold text-gray-800">Category:</Label>
                <div className="mt-2">
                  <Badge className="bg-blue-100 border-blue-300 text-blue-800">{aiAnalysis.category}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-800">Severity Level:</Label>
                <div className="mt-2 flex items-center gap-2">
                  {aiAnalysis.severity === 'high' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  {aiAnalysis.severity === 'medium' && <Clock className="w-4 h-4 text-yellow-500" />}
                  {aiAnalysis.severity === 'low' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  <Badge variant={aiAnalysis.severity === 'high' ? 'destructive' : aiAnalysis.severity === 'medium' ? 'default' : 'secondary'}>
                    {aiAnalysis.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-semibold text-gray-800">Urgency Level:</Label>
                <p className="text-sm bg-white rounded-xl p-3 mt-2 font-medium text-gray-900 border border-orange-200">{aiAnalysis.urgencyLevel}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Estimated Cost:
                </Label>
                <p className="text-sm bg-white rounded-xl p-3 mt-2 font-medium text-gray-900 border border-orange-200">{aiAnalysis.estimatedCost}</p>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-semibold text-gray-800">Possible Causes:</Label>
              <ul className="text-sm list-disc list-inside space-y-2 bg-white rounded-xl p-4 mt-2 border border-orange-200">
                {aiAnalysis.possibleCauses.map((cause: string, index: number) => (
                  <li key={index} className="text-gray-700">{cause}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <Label className="text-sm font-semibold text-gray-800">Recommended Actions:</Label>
              <ul className="text-sm list-disc list-inside space-y-2 bg-white rounded-xl p-4 mt-2 border border-orange-200">
                {aiAnalysis.suggestedActions.map((action: string, index: number) => (
                  <li key={index} className="text-gray-700">{action}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button 
          onClick={submitIssue} 
          className="w-full bg-white border border-orange-200 hover:bg-orange-500 hover:border-orange-500 text-gray-900 hover:text-white py-3 text-base font-semibold rounded-lg shadow-sm transition-all duration-200" 
          disabled={!issueText.trim() || isProcessing || isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Submitting Issue...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Submit Issue Report
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}