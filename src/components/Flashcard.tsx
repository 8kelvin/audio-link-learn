import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  audioUrl?: string;
  word: string;
  onFlip?: () => void;
}

const Flashcard = ({ audioUrl, word, onFlip }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  const playAudio = () => {
    if (!audioUrl) return;
    
    setIsPlaying(true);
    const audio = new Audio(audioUrl);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);
    audio.play().catch(() => setIsPlaying(false));
  };

  const dictionaryUrl = `https://www.ldoceonline.com/dictionary/${word.toLowerCase()}`;

  return (
    <div className="[perspective:1000px] w-full max-w-md mx-auto">
      <div
        className={cn(
          "relative w-full h-96 transition-transform duration-700 [transform-style:preserve-3d] cursor-pointer",
          isFlipped && "[transform:rotateY(180deg)]"
        )}
        onClick={handleFlip}
      >
        {/* Front Card - Audio */}
        <Card className="absolute inset-0 [backface-visibility:hidden] bg-gradient-to-br from-card via-card to-muted border-2 border-flashcard-shadow shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Listen & Learn
              </h2>
              <p className="text-muted-foreground">
                Click play to hear the pronunciation
              </p>
            </div>
            
            {audioUrl ? (
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio();
                }}
                disabled={isPlaying}
                size="lg"
                className="bg-gradient-to-r from-audio-accent to-primary hover:from-primary hover:to-audio-accent transition-all duration-300 shadow-md"
              >
                <Play className={cn("w-5 h-5 mr-2", isPlaying && "animate-pulse")} />
                {isPlaying ? "Playing..." : "Play Audio"}
              </Button>
            ) : (
              <p className="text-muted-foreground text-sm">
                No audio available
              </p>
            )}
            
            <div className="mt-8 text-xs text-muted-foreground">
              Click card to flip
            </div>
          </div>
        </Card>

        {/* Back Card - Dictionary */}
        <Card className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-card via-card to-secondary/20 border-2 border-accent/30 shadow-lg">
          <div className="h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">
                Dictionary: {word}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                className="hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {word}
              </h3>
              
              <p className="text-muted-foreground mb-6">
                View full definition and examples in Longman Dictionary
              </p>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(dictionaryUrl, '_blank', 'noopener,noreferrer');
                }}
                size="lg"
                className="bg-gradient-to-r from-accent to-primary hover:from-primary hover:to-accent transition-all duration-300 shadow-md"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Open Dictionary
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Flashcard;