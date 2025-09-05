import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, Mic, Play, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AudioUploadProps {
  onAudioChange: (audioUrl: string | null) => void;
  currentAudioUrl?: string | null;
}

const AudioUpload = ({ onAudioChange, currentAudioUrl }: AudioUploadProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedBlob(blob);
        const audioUrl = URL.createObjectURL(blob);
        onAudioChange(audioUrl);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly to record your pronunciation",
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording stopped",
        description: "Audio has been saved successfully",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        const audioUrl = URL.createObjectURL(file);
        onAudioChange(audioUrl);
        setRecordedBlob(file);
        
        toast({
          title: "Audio uploaded",
          description: "Audio file loaded successfully",
        });
      } else {
        toast({
          title: "Invalid file",
          description: "Please select an audio file (MP3, WAV, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const clearAudio = () => {
    if (currentAudioUrl) {
      URL.revokeObjectURL(currentAudioUrl);
    }
    onAudioChange(null);
    setRecordedBlob(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "Audio cleared",
      description: "Audio has been removed",
    });
  };

  const playAudio = () => {
    if (currentAudioUrl) {
      const audio = new Audio(currentAudioUrl);
      audio.play().catch(() => {
        toast({
          title: "Playback failed",
          description: "Could not play the audio file",
          variant: "destructive",
        });
      });
    }
  };

  return (
    <Card className="p-6 space-y-4 bg-gradient-to-br from-card to-muted/20 border-2 border-primary/10">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Add Audio Pronunciation
        </h3>
        <p className="text-sm text-muted-foreground">
          Record your voice or upload an audio file
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? "destructive" : "default"}
          className="h-12 bg-gradient-to-r from-audio-accent to-primary hover:from-primary hover:to-audio-accent transition-all duration-300"
        >
          <Mic className={`w-5 h-5 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
          {isRecording ? "Stop Recording" : "Record Audio"}
        </Button>

        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="h-12 hover:bg-secondary hover:text-secondary-foreground transition-colors"
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload File
        </Button>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {currentAudioUrl && (
        <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex-1 text-sm text-foreground">
            Audio ready to use
          </div>
          <Button
            onClick={playAudio}
            size="sm"
            variant="outline"
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <Play className="w-4 h-4" />
          </Button>
          <Button
            onClick={clearAudio}
            size="sm"
            variant="outline"
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AudioUpload;