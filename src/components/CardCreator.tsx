import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, BookOpen } from "lucide-react";
import AudioUpload from "./AudioUpload";
import { toast } from "@/components/ui/use-toast";

export interface FlashcardData {
  id: string;
  word: string;
  audioUrl: string | null;
  createdAt: Date;
}

interface CardCreatorProps {
  onAddCard: (card: FlashcardData) => void;
}

const CardCreator = ({ onAddCard }: CardCreatorProps) => {
  const [word, setWord] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!word.trim()) {
      toast({
        title: "Word required",
        description: "Please enter a word to create a flashcard",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    const newCard: FlashcardData = {
      id: Date.now().toString(),
      word: word.trim(),
      audioUrl,
      createdAt: new Date(),
    };

    onAddCard(newCard);
    
    // Reset form
    setWord("");
    setAudioUrl(null);
    setIsCreating(false);

    toast({
      title: "Flashcard created!",
      description: `Added "${word}" to your deck`,
    });
  };

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-card to-secondary/10 border-2 border-primary/20 shadow-lg">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
          <BookOpen className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Create New Flashcard
        </h2>
        <p className="text-muted-foreground">
          Add a word and its pronunciation to your learning deck
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="word" className="text-base font-medium">
            Word
          </Label>
          <Input
            id="word"
            type="text"
            placeholder="Enter the word (e.g., car, beautiful, etc.)"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="h-12 text-base border-2 border-input focus:border-primary transition-colors"
            disabled={isCreating}
          />
        </div>

        <AudioUpload 
          onAudioChange={setAudioUrl}
          currentAudioUrl={audioUrl}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isCreating || !word.trim()}
          className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300 shadow-md disabled:opacity-50"
        >
          <Plus className="w-5 h-5 mr-2" />
          {isCreating ? "Creating..." : "Create Flashcard"}
        </Button>
      </form>

      <div className="text-xs text-muted-foreground text-center">
        The dictionary link will be automatically generated from the word
      </div>
    </Card>
  );
};

export default CardCreator;