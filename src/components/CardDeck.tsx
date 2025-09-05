import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Flashcard from "./Flashcard";
import { FlashcardData } from "./CardCreator";
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CardDeckProps {
  cards: FlashcardData[];
  onDeleteCard: (cardId: string) => void;
}

const CardDeck = ({ cards, onDeleteCard }: CardDeckProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<FlashcardData[]>([]);

  const displayCards = isShuffled ? shuffledCards : cards;
  const currentCard = displayCards[currentIndex];

  const goToNext = () => {
    if (currentIndex < displayCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
      toast({
        title: "End of deck reached",
        description: "Starting over from the first card",
      });
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(displayCards.length - 1); // Loop to end
    }
  };

  const shuffleDeck = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setIsShuffled(true);
    setCurrentIndex(0);
    
    toast({
      title: "Deck shuffled",
      description: "Cards are now in random order",
    });
  };

  const resetOrder = () => {
    setIsShuffled(false);
    setCurrentIndex(0);
    
    toast({
      title: "Order reset",
      description: "Cards are back in original order",
    });
  };

  const deleteCurrentCard = () => {
    if (currentCard) {
      onDeleteCard(currentCard.id);
      
      // Adjust current index if needed
      if (currentIndex >= cards.length - 1) {
        setCurrentIndex(Math.max(0, cards.length - 2));
      }
      
      toast({
        title: "Card deleted",
        description: `Removed "${currentCard.word}" from your deck`,
      });
    }
  };

  if (cards.length === 0) {
    return (
      <Card className="p-12 text-center bg-gradient-to-br from-card to-muted/20 border-2 border-muted">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <RotateCcw className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Cards Yet
          </h3>
          <p className="text-muted-foreground">
            Create your first flashcard to start learning!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-4 bg-gradient-to-r from-card to-secondary/10 border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Card {currentIndex + 1} of {displayCards.length}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={shuffleDeck}
              size="sm"
              variant={isShuffled ? "default" : "outline"}
              className="hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Shuffle className="w-4 h-4 mr-1" />
              Shuffle
            </Button>
            
            <Button
              onClick={resetOrder}
              size="sm"
              variant="outline"
              disabled={!isShuffled}
              className="hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            
            <Button
              onClick={deleteCurrentCard}
              size="sm"
              variant="outline"
              className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Flashcard */}
      <div className="flex justify-center">
        <Flashcard
          audioUrl={currentCard.audioUrl || undefined}
          word={currentCard.word}
        />
      </div>

      {/* Navigation */}
      <Card className="p-4 bg-gradient-to-r from-card to-primary/5 border border-primary/20">
        <div className="flex items-center justify-between">
          <Button
            onClick={goToPrevious}
            variant="outline"
            size="lg"
            className="flex-1 mr-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </Button>
          
          <div className="px-4 text-center">
            <div className="text-lg font-bold text-foreground">
              {currentCard.word}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(currentCard.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <Button
            onClick={goToNext}
            variant="outline"
            size="lg"
            className="flex-1 ml-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CardDeck;