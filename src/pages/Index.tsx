import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Plus, Library } from "lucide-react";
import CardCreator, { FlashcardData } from "@/components/CardCreator";
import CardDeck from "@/components/CardDeck";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [activeTab, setActiveTab] = useState("study");

  // Load cards from localStorage on mount
  useEffect(() => {
    const savedCards = localStorage.getItem("flashcards");
    if (savedCards) {
      try {
        const parsedCards = JSON.parse(savedCards);
        setCards(parsedCards.map((card: any) => ({
          ...card,
          createdAt: new Date(card.createdAt)
        })));
      } catch (error) {
        console.error("Error loading saved cards:", error);
      }
    }
  }, []);

  // Save cards to localStorage whenever cards change
  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(cards));
  }, [cards]);

  const addCard = (newCard: FlashcardData) => {
    setCards(prev => [...prev, newCard]);
    setActiveTab("study"); // Switch to study tab after creating
  };

  const deleteCard = (cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Language Learning
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master pronunciation with audio flashcards and dictionary integration
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-card border border-border">
            <TabsTrigger 
              value="study" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Library className="w-4 h-4 mr-2" />
              Study ({cards.length})
            </TabsTrigger>
            <TabsTrigger 
              value="create"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create
            </TabsTrigger>
          </TabsList>

          <TabsContent value="study" className="space-y-6">
            <CardDeck cards={cards} onDeleteCard={deleteCard} />
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <CardCreator onAddCard={addCard} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats Footer */}
        <Card className="mt-12 p-6 bg-gradient-to-r from-card to-primary/5 border border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {cards.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Cards
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {cards.filter(card => card.audioUrl).length}
              </div>
              <div className="text-sm text-muted-foreground">
                With Audio
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-glow">
                {Math.round((cards.filter(card => card.audioUrl).length / Math.max(cards.length, 1)) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Audio Coverage
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
