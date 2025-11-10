import { useState, useEffect, useRef } from "react";
import { Trophy, Star, Clock, Zap, ArrowLeft, Play, RefreshCw, CheckCircle, XCircle, Trash2, Leaf, Droplet, TreePine, Fish } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { toast } from "sonner@2.0.3";

interface GamesScreenProps {
  onPointsEarned?: (points: number) => void;
}

type GameType = 'memory' | 'recycling' | 'treeplant' | 'quiz' | 'ocean' | 'ecorun' | null;

// Memory Card Interface
interface MemoryCard {
  id: number;
  icon: string;
  name: string;
  flipped: boolean;
  matched: boolean;
}

// Recycling Item Interface
interface RecyclingItem {
  id: number;
  name: string;
  icon: any;
  correctBin: 'recycle' | 'compost' | 'trash';
}

export function GamesScreen({ onPointsEarned }: GamesScreenProps) {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);

  const handlePointsEarned = (points: number) => {
    setTotalPointsEarned(prev => prev + points);
    onPointsEarned?.(points);
    toast.success(`+${points} points earned! 🎉`);
  };

  const games = [
    {
      id: 'ecorun',
      title: 'EcoRun',
      description: 'Run and clean garbage from the track!',
      points: '50-150 points',
      difficulty: 'Medium',
      color: 'from-emerald-400 to-teal-500',
      icon: '🏃',
    },
    {
      id: 'memory',
      title: 'Eco Memory Match',
      description: 'Match pairs of eco-friendly items',
      points: '20-50 points',
      difficulty: 'Easy',
      color: 'from-green-400 to-emerald-500',
      icon: '🌿',
    },
    {
      id: 'recycling',
      title: 'Recycling Master',
      description: 'Sort waste into correct bins',
      points: '30-60 points',
      difficulty: 'Medium',
      color: 'from-blue-400 to-cyan-500',
      icon: '♻️',
    },
    {
      id: 'treeplant',
      title: 'Tree Planter',
      description: 'Plant trees as fast as you can',
      points: '40-80 points',
      difficulty: 'Easy',
      color: 'from-green-500 to-lime-500',
      icon: '🌳',
    },
    {
      id: 'quiz',
      title: 'Eco Quiz Challenge',
      description: 'Test your environmental knowledge',
      points: '50-100 points',
      difficulty: 'Hard',
      color: 'from-purple-400 to-pink-500',
      icon: '🧠',
    },
    {
      id: 'ocean',
      title: 'Clean the Ocean',
      description: 'Remove pollution from the sea',
      points: '35-70 points',
      difficulty: 'Medium',
      color: 'from-blue-500 to-indigo-500',
      icon: '🌊',
    },
  ];

  if (activeGame === 'ecorun') {
    return <EcoRunGame onBack={() => setActiveGame(null)} onPointsEarned={handlePointsEarned} />;
  }

  if (activeGame === 'memory') {
    return <MemoryGame onBack={() => setActiveGame(null)} onPointsEarned={handlePointsEarned} />;
  }

  if (activeGame === 'recycling') {
    return <RecyclingGame onBack={() => setActiveGame(null)} onPointsEarned={handlePointsEarned} />;
  }

  if (activeGame === 'treeplant') {
    return <TreePlantGame onBack={() => setActiveGame(null)} onPointsEarned={handlePointsEarned} />;
  }

  if (activeGame === 'quiz') {
    return <QuizGame onBack={() => setActiveGame(null)} onPointsEarned={handlePointsEarned} />;
  }

  if (activeGame === 'ocean') {
    return <OceanCleanupGame onBack={() => setActiveGame(null)} onPointsEarned={handlePointsEarned} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 pt-12 pb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Eco Games</h1>
        <p className="text-purple-100">Play games, learn about the environment, earn points!</p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Card className="bg-white/10 backdrop-blur-sm border-0 p-4">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
              <div>
                <p className="text-2xl font-bold">{totalPointsEarned}</p>
                <p className="text-sm text-purple-100">Points Today</p>
              </div>
            </div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-0 p-4">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-yellow-300" />
              <div>
                <p className="text-2xl font-bold">6</p>
                <p className="text-sm text-purple-100">Games Available</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Games Grid */}
      <div className="px-6 py-6 space-y-4">
        {games.map((game) => (
          <Card key={game.id} className="overflow-hidden border-0 shadow-md">
            <div className={`bg-gradient-to-r ${game.color} p-6 text-white`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl">
                  {game.icon}
                </div>
                <Badge className="bg-white/20 backdrop-blur-sm border-0 text-white">
                  {game.difficulty}
                </Badge>
              </div>
              <h3 className="text-xl font-bold mb-2">{game.title}</h3>
              <p className="text-white/90 text-sm mb-4">{game.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span className="text-sm font-semibold">{game.points}</span>
                </div>
                <Button
                  onClick={() => setActiveGame(game.id as GameType)}
                  className="bg-white text-gray-900 hover:bg-gray-100"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play Now
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tips Section */}
      <div className="px-6 pb-6">
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Pro Tip!</h3>
              <p className="text-sm text-gray-700">
                Play games daily to earn bonus points and learn fun environmental facts. Higher scores = more points!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Memory Match Game Component
function MemoryGame({ onBack, onPointsEarned }: { onBack: () => void; onPointsEarned: (points: number) => void }) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const ecoIcons = ['🌱', '♻️', '🌍', '💧', '🌳', '☀️', '🚲', '🌿'];

  const initializeGame = () => {
    const gameCards: MemoryCard[] = [];
    ecoIcons.forEach((icon, index) => {
      gameCards.push(
        { id: index * 2, icon, name: icon, flipped: false, matched: false },
        { id: index * 2 + 1, icon, name: icon, flipped: false, matched: false }
      );
    });
    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setGameOver(false);
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0 && matches < 8) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || matches === 8) {
      setIsPlaying(false);
      setGameOver(true);
      if (matches === 8) {
        const points = Math.max(20, 50 - moves * 2);
        onPointsEarned(points);
      }
    }
  }, [isPlaying, timeLeft, matches]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      setMoves(moves + 1);

      if (cards[first].icon === cards[second].icon) {
        setCards(cards.map((card, index) =>
          index === first || index === second ? { ...card, matched: true } : card
        ));
        setMatches(matches + 1);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(cards.map((card, index) =>
            index === first || index === second ? { ...card, flipped: false } : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards]);

  const handleCardClick = (index: number) => {
    if (!isPlaying || flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;

    setCards(cards.map((card, i) => (i === index ? { ...card, flipped: true } : card)));
    setFlippedCards([...flippedCards, index]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 pt-12 pb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Badge className="bg-white/20 backdrop-blur-sm border-0 text-white">
            <Clock className="w-4 h-4 mr-1" />
            {timeLeft}s
          </Badge>
        </div>
        <h1 className="text-2xl font-bold mb-4">Eco Memory Match</h1>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm text-green-100">Moves</p>
            <p className="text-2xl font-bold">{moves}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm text-green-100">Matches</p>
            <p className="text-2xl font-bold">{matches}/8</p>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 px-6 py-6">
        {!isPlaying && !gameOver && (
          <div className="text-center">
            <Button onClick={initializeGame} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Start Game
            </Button>
          </div>
        )}

        {gameOver && (
          <Card className="p-6 text-center mb-6">
            <div className="mb-4">
              {matches === 8 ? (
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-2" />
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {matches === 8 ? '🎉 Perfect!' : 'Time\'s Up!'}
            </h2>
            <p className="text-gray-600 mb-4">
              You found {matches}/8 matches in {moves} moves!
            </p>
            <Button onClick={initializeGame} className="bg-green-600 hover:bg-green-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </Card>
        )}

        {isPlaying && (
          <div className="grid grid-cols-4 gap-3">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`aspect-square rounded-xl flex items-center justify-center text-4xl transition-all transform ${
                  card.flipped || card.matched
                    ? 'bg-white shadow-lg scale-100'
                    : 'bg-green-600 shadow-md hover:scale-105 active:scale-95'
                }`}
                disabled={card.matched}
              >
                {card.flipped || card.matched ? card.icon : '?'}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Recycling Sorting Game
function RecyclingGame({ onBack, onPointsEarned }: { onBack: () => void; onPointsEarned: (points: number) => void }) {
  const [items, setItems] = useState<RecyclingItem[]>([]);
  const [currentItem, setCurrentItem] = useState<RecyclingItem | null>(null);
  const [score, setScore] = useState(0);
  const [itemsProcessed, setItemsProcessed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [streak, setStreak] = useState(0);

  const allItems: RecyclingItem[] = [
    { id: 1, name: 'Plastic Bottle', icon: '🍾', correctBin: 'recycle' },
    { id: 2, name: 'Banana Peel', icon: '🍌', correctBin: 'compost' },
    { id: 3, name: 'Paper', icon: '📄', correctBin: 'recycle' },
    { id: 4, name: 'Apple Core', icon: '🍎', correctBin: 'compost' },
    { id: 5, name: 'Plastic Bag', icon: '🛍️', correctBin: 'trash' },
    { id: 6, name: 'Glass Bottle', icon: '🍺', correctBin: 'recycle' },
    { id: 7, name: 'Food Scraps', icon: '🥗', correctBin: 'compost' },
    { id: 8, name: 'Cardboard', icon: '📦', correctBin: 'recycle' },
    { id: 9, name: 'Styrofoam', icon: '🥤', correctBin: 'trash' },
    { id: 10, name: 'Leaves', icon: '🍂', correctBin: 'compost' },
  ];

  const startGame = () => {
    const shuffled = [...allItems].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setCurrentItem(shuffled[0]);
    setScore(0);
    setItemsProcessed(0);
    setStreak(0);
    setIsPlaying(true);
  };

  const handleBinChoice = (bin: 'recycle' | 'compost' | 'trash') => {
    if (!currentItem) return;

    const isCorrect = bin === currentItem.correctBin;
    
    if (isCorrect) {
      const points = 5 + streak;
      setScore(score + points);
      setStreak(streak + 1);
      toast.success(`+${points} points! Streak: ${streak + 1}`);
    } else {
      setStreak(0);
      toast.error('Wrong bin! Streak reset.');
    }

    const nextIndex = itemsProcessed + 1;
    setItemsProcessed(nextIndex);

    if (nextIndex >= items.length) {
      setIsPlaying(false);
      const finalPoints = Math.floor(score / 2);
      onPointsEarned(finalPoints);
      toast.success(`Game complete! Earned ${finalPoints} eco points!`);
    } else {
      setCurrentItem(items[nextIndex]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 pt-12 pb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Badge className="bg-white/20 backdrop-blur-sm border-0 text-white">
            {itemsProcessed}/{items.length}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold mb-4">Recycling Master</h1>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm text-blue-100">Score</p>
            <p className="text-2xl font-bold">{score}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm text-blue-100">Streak</p>
            <p className="text-2xl font-bold">{streak} 🔥</p>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 px-6 py-6 flex flex-col items-center justify-center">
        {!isPlaying && itemsProcessed === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">♻️</div>
            <h2 className="text-xl font-bold mb-2">Sort the Waste!</h2>
            <p className="text-gray-600 mb-6">Tap the correct bin for each item</p>
            <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Start Game
            </Button>
          </div>
        )}

        {isPlaying && currentItem && (
          <>
            <Card className="p-8 mb-8 text-center w-full max-w-sm">
              <div className="text-8xl mb-4">{currentItem.icon}</div>
              <h3 className="text-xl font-bold text-gray-800">{currentItem.name}</h3>
              <p className="text-sm text-gray-600 mt-2">Where does this go?</p>
            </Card>

            <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
              <button
                onClick={() => handleBinChoice('recycle')}
                className="flex flex-col items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-6 transition-transform active:scale-95"
              >
                <div className="text-4xl mb-2">♻️</div>
                <p className="text-sm font-semibold">Recycle</p>
              </button>
              <button
                onClick={() => handleBinChoice('compost')}
                className="flex flex-col items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-xl p-6 transition-transform active:scale-95"
              >
                <div className="text-4xl mb-2">🌱</div>
                <p className="text-sm font-semibold">Compost</p>
              </button>
              <button
                onClick={() => handleBinChoice('trash')}
                className="flex flex-col items-center justify-center bg-gray-500 hover:bg-gray-600 text-white rounded-xl p-6 transition-transform active:scale-95"
              >
                <div className="text-4xl mb-2">🗑️</div>
                <p className="text-sm font-semibold">Trash</p>
              </button>
            </div>
          </>
        )}

        {!isPlaying && itemsProcessed > 0 && (
          <Card className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Great Job!</h2>
            <p className="text-gray-600 mb-4">Final Score: {score} points</p>
            <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

// Tree Planting Clicker Game
function TreePlantGame({ onBack, onPointsEarned }: { onBack: () => void; onPointsEarned: (points: number) => void }) {
  const [trees, setTrees] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clicks, setClicks] = useState(0);

  const startGame = () => {
    setTrees(0);
    setTimeLeft(30);
    setClicks(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      const points = Math.min(80, trees * 2);
      onPointsEarned(points);
      toast.success(`Planted ${trees} trees! Earned ${points} points!`);
    }
  }, [isPlaying, timeLeft]);

  const plantTree = () => {
    if (!isPlaying) return;
    setTrees(trees + 1);
    setClicks(clicks + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-lime-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-lime-500 px-6 pt-12 pb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Badge className="bg-white/20 backdrop-blur-sm border-0 text-white">
            <Clock className="w-4 h-4 mr-1" />
            {timeLeft}s
          </Badge>
        </div>
        <h1 className="text-2xl font-bold mb-4">Tree Planter</h1>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <p className="text-sm text-green-100">Trees Planted</p>
          <p className="text-3xl font-bold">{trees} 🌳</p>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 px-6 py-6 flex flex-col items-center justify-center">
        {!isPlaying && clicks === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">🌳</div>
            <h2 className="text-xl font-bold mb-2">Plant Trees Fast!</h2>
            <p className="text-gray-600 mb-6">Tap as many times as you can in 30 seconds</p>
            <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Start Planting
            </Button>
          </div>
        )}

        {isPlaying && (
          <button
            onClick={plantTree}
            className="w-64 h-64 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-9xl transition-transform active:scale-90 shadow-2xl hover:shadow-3xl"
          >
            🌳
          </button>
        )}

        {!isPlaying && clicks > 0 && (
          <Card className="p-6 text-center">
            <div className="text-6xl mb-4">🌲🌳🌲</div>
            <h2 className="text-2xl font-bold mb-2">Amazing!</h2>
            <p className="text-gray-600 mb-4">You planted {trees} virtual trees!</p>
            <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Plant More
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

// Eco Quiz Game
function QuizGame({ onBack, onPointsEarned }: { onBack: () => void; onPointsEarned: (points: number) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const questions = [
    {
      question: "How long does a plastic bottle take to decompose?",
      answers: ["1 year", "50 years", "450 years", "Never fully"],
      correct: 2,
      fact: "Plastic bottles can take 450+ years to decompose!"
    },
    {
      question: "What percentage of Earth's water is fresh water?",
      answers: ["2.5%", "10%", "25%", "50%"],
      correct: 0,
      fact: "Only 2.5% of Earth's water is fresh water!"
    },
    {
      question: "Which produces the most greenhouse gases?",
      answers: ["Cars", "Livestock farming", "Airplanes", "Factories"],
      correct: 1,
      fact: "Livestock farming produces more greenhouse gases than cars!"
    },
    {
      question: "How many trees does one person need to offset their CO₂?",
      answers: ["5 trees", "15 trees", "50 trees", "100+ trees"],
      correct: 3,
      fact: "An average person needs 100+ trees to offset their annual CO₂!"
    },
    {
      question: "What uses the most household energy?",
      answers: ["Lighting", "Heating/Cooling", "Appliances", "Water heater"],
      correct: 1,
      fact: "Heating and cooling uses about 45% of home energy!"
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 20);
      toast.success("+20 points! Correct! 🎉");
    } else {
      toast.error("Incorrect. Learn the fact below!");
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setShowResult(true);
        onPointsEarned(score + (answerIndex === questions[currentQuestion].correct ? 20 : 0));
      }
    }, 2500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  if (showResult) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pb-20">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 pt-12 pb-6 text-white">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Quiz Complete!</h1>
        </div>

        <div className="flex-1 px-6 py-6 flex items-center justify-center">
          <Card className="p-8 text-center w-full max-w-md">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Your Score</h2>
            <p className="text-5xl font-bold text-purple-600 mb-4">{score}/100</p>
            <p className="text-gray-600 mb-6">
              You got {score / 20} out of {questions.length} questions correct!
            </p>
            <Button onClick={resetQuiz} className="bg-purple-600 hover:bg-purple-700 w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 pt-12 pb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Badge className="bg-white/20 backdrop-blur-sm border-0 text-white">
            Question {currentQuestion + 1}/{questions.length}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold mb-4">Eco Quiz</h1>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <p className="text-sm text-purple-100">Score</p>
          <p className="text-2xl font-bold">{score} points</p>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-6 py-6">
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">{question.question}</h3>
          
          <div className="space-y-3">
            {question.answers.map((answer, index) => {
              const isCorrect = index === question.correct;
              const isSelected = index === selectedAnswer;
              
              let bgColor = 'bg-white hover:bg-gray-50';
              if (isAnswered) {
                if (isCorrect) {
                  bgColor = 'bg-green-100 border-green-500';
                } else if (isSelected && !isCorrect) {
                  bgColor = 'bg-red-100 border-red-500';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${bgColor} ${
                    isAnswered ? 'cursor-default' : 'cursor-pointer active:scale-98'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{answer}</span>
                    {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {isAnswered && (
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">💡</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Did you know?</h4>
                <p className="text-sm text-gray-700">{question.fact}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// Ocean Cleanup Tap Game
function OceanCleanupGame({ onBack, onPointsEarned }: { onBack: () => void; onPointsEarned: (points: number) => void }) {
  const [pollution, setPollution] = useState<Array<{ id: number; x: number; y: number; type: string }>>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const pollutionTypes = ['🍾', '🥤', '🛍️', '⚙️', '🧴'];

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setPollution([]);
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      const points = Math.min(70, score);
      onPointsEarned(points);
      toast.success(`Cleaned ${score} items! Earned ${points} points!`);
    }
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const newItem = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: -10,
          type: pollutionTypes[Math.floor(Math.random() * pollutionTypes.length)]
        };
        setPollution(prev => [...prev, newItem]);
      }, 800);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      const moveInterval = setInterval(() => {
        setPollution(prev => 
          prev.map(item => ({ ...item, y: item.y + 2 }))
            .filter(item => item.y < 100)
        );
      }, 50);

      return () => clearInterval(moveInterval);
    }
  }, [isPlaying]);

  const handleCleanup = (id: number) => {
    setPollution(prev => prev.filter(item => item.id !== id));
    setScore(score + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-cyan-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 pt-12 pb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Badge className="bg-white/20 backdrop-blur-sm border-0 text-white">
            <Clock className="w-4 h-4 mr-1" />
            {timeLeft}s
          </Badge>
        </div>
        <h1 className="text-2xl font-bold mb-4">Clean the Ocean</h1>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <p className="text-sm text-blue-100">Items Cleaned</p>
          <p className="text-2xl font-bold">{score} 🌊</p>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 px-6 py-6 flex flex-col items-center justify-center">
        {!isPlaying && score === 0 && (
          <div className="text-center">
            <div className="text-6xl mb-4">🌊</div>
            <h2 className="text-xl font-bold mb-2">Save the Ocean!</h2>
            <p className="text-gray-600 mb-6">Tap pollution items before they sink</p>
            <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Start Cleanup
            </Button>
          </div>
        )}

        {isPlaying && (
          <div
            ref={gameAreaRef}
            className="relative w-full h-96 bg-gradient-to-b from-blue-300 to-blue-500 rounded-xl overflow-hidden shadow-lg"
          >
            {/* Water waves effect */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute w-full h-20 bg-blue-400 rounded-full blur-2xl animate-pulse"></div>
            </div>

            {/* Pollution items */}
            {pollution.map(item => (
              <button
                key={item.id}
                onClick={() => handleCleanup(item.id)}
                className="absolute text-3xl transition-transform active:scale-75"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {item.type}
              </button>
            ))}

            {/* Ocean floor */}
            <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-blue-900 to-transparent flex items-end justify-center pb-2 text-2xl">
              🐠 🐟 🦈 🐙
            </div>
          </div>
        )}

        {!isPlaying && score > 0 && (
          <Card className="p-6 text-center mt-6">
            <Fish className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ocean Saved!</h2>
            <p className="text-gray-600 mb-4">You cleaned {score} pollution items!</p>
            <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Clean Again
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

// EcoRun Game - Endless Runner
function EcoRunGame({ onBack, onPointsEarned }: { onBack: () => void; onPointsEarned: (points: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameStateRef = useRef({
    playerLane: 1, // 0 = left, 1 = center, 2 = right
    speed: 5,
    score: 0,
    distance: 0,
    garbageItems: [] as Array<{ x: number; y: number; lane: number; type: string; size: number }>,
    obstacles: [] as Array<{ x: number; y: number; lane: number; type: string }>,
    lastGarbageSpawn: 0,
    lastObstacleSpawn: 0,
    combo: 0,
    animationFrame: 0,
  });

  const garbageTypes = ['🗑️', '🍾', '🥤', '🛍️', '📦', '🧃'];
  const obstacleTypes = ['🌳', '🪨', '🚧'];

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const LANE_WIDTH = canvas.width / 3;
    const PLAYER_Y = canvas.height - 120;
    
    let animationId: number;

    const gameLoop = () => {
      const state = gameStateRef.current;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background (road)
      drawBackground(ctx, canvas, state.animationFrame);

      // Update and draw garbage
      state.garbageItems = state.garbageItems.filter(item => {
        item.y += state.speed;
        
        // Draw garbage
        ctx.font = `${item.size}px Arial`;
        ctx.fillText(item.type, item.x, item.y);

        // Check collision with player
        const playerX = state.playerLane * LANE_WIDTH + LANE_WIDTH / 2;
        const distance = Math.sqrt(Math.pow(item.x - playerX, 2) + Math.pow(item.y - PLAYER_Y, 2));
        
        if (distance < 40 && Math.abs(item.y - PLAYER_Y) < 30) {
          // Garbage collected!
          state.score += 10 + state.combo;
          state.combo += 1;
          setScore(state.score);
          return false; // Remove garbage
        }

        // Keep if still on screen
        return item.y < canvas.height + 50;
      });

      // Update and draw obstacles
      state.obstacles = state.obstacles.filter(obstacle => {
        obstacle.y += state.speed;
        
        // Draw obstacle
        ctx.font = '40px Arial';
        ctx.fillText(obstacle.type, obstacle.x, obstacle.y);

        // Check collision with player
        const playerX = state.playerLane * LANE_WIDTH + LANE_WIDTH / 2;
        const distance = Math.sqrt(Math.pow(obstacle.x - playerX, 2) + Math.pow(obstacle.y - PLAYER_Y, 2));
        
        if (distance < 35 && Math.abs(obstacle.y - PLAYER_Y) < 25) {
          // Hit obstacle - game over
          endGame();
          return false;
        }

        return obstacle.y < canvas.height + 50;
      });

      // Spawn new garbage
      state.distance += state.speed;
      if (state.distance - state.lastGarbageSpawn > 80) {
        const lane = Math.floor(Math.random() * 3);
        state.garbageItems.push({
          x: lane * LANE_WIDTH + LANE_WIDTH / 2 - 15,
          y: -30,
          lane,
          type: garbageTypes[Math.floor(Math.random() * garbageTypes.length)],
          size: 30,
        });
        state.lastGarbageSpawn = state.distance;
      }

      // Spawn obstacles less frequently
      if (state.distance - state.lastObstacleSpawn > 200) {
        const lane = Math.floor(Math.random() * 3);
        state.obstacles.push({
          x: lane * LANE_WIDTH + LANE_WIDTH / 2 - 20,
          y: -30,
          lane,
          type: obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)],
        });
        state.lastObstacleSpawn = state.distance;
      }

      // Draw player (running character)
      const playerX = state.playerLane * LANE_WIDTH + LANE_WIDTH / 2;
      drawPlayer(ctx, playerX, PLAYER_Y, state.animationFrame);

      // Draw lane lines
      drawLanes(ctx, canvas, state.animationFrame);

      // Increase speed gradually
      if (state.distance % 500 === 0) {
        state.speed = Math.min(state.speed + 0.1, 12);
      }

      // Reset combo if no garbage collected recently
      if (state.garbageItems.length === 0 || state.garbageItems.every(g => g.y < PLAYER_Y - 100)) {
        state.combo = 0;
      }

      state.animationFrame += 1;
      animationId = requestAnimationFrame(gameLoop);
    };

    const endGame = () => {
      const state = gameStateRef.current;
      setIsPlaying(false);
      setGameOver(true);
      if (state.score > highScore) {
        setHighScore(state.score);
      }
      const earnedPoints = Math.min(150, Math.floor(state.score / 2));
      onPointsEarned(earnedPoints);
      toast.success(`Game Over! Collected ${state.score} items. Earned ${earnedPoints} eco points!`);
    };

    gameLoop();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying]);

  const drawBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: number) => {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98D8C8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Road
    ctx.fillStyle = '#5A5A5A';
    ctx.fillRect(0, canvas.height - 200, canvas.width, 200);

    // Grass strips on sides
    ctx.fillStyle = '#2E7D32';
    ctx.fillRect(0, canvas.height - 205, canvas.width, 5);
    
    // Moving background elements (clouds)
    ctx.font = '30px Arial';
    ctx.fillText('☁️', 50, 60 - (frame % 400));
    ctx.fillText('☁️', 200, 120 - (frame % 400));
    ctx.fillText('☁️', 100, 180 - (frame % 400));
  };

  const drawLanes = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: number) => {
    const LANE_WIDTH = canvas.width / 3;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 10]);

    // Draw dashed lane dividers
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * LANE_WIDTH, canvas.height - 200 + (frame % 30));
      ctx.lineTo(i * LANE_WIDTH, canvas.height);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) => {
    // Animated running character
    const bounce = Math.sin(frame * 0.3) * 3;
    ctx.font = '50px Arial';
    ctx.fillText('🏃', x - 25, y + bounce);
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.ellipse(x, y + 15, 20, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    gameStateRef.current = {
      playerLane: 1,
      speed: 5,
      score: 0,
      distance: 0,
      garbageItems: [],
      obstacles: [],
      lastGarbageSpawn: 0,
      lastObstacleSpawn: 0,
      combo: 0,
      animationFrame: 0,
    };
  };

  const changeLane = (direction: 'left' | 'right') => {
    if (!isPlaying) return;
    const state = gameStateRef.current;
    
    if (direction === 'left' && state.playerLane > 0) {
      state.playerLane -= 1;
    } else if (direction === 'right' && state.playerLane < 2) {
      state.playerLane += 1;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') changeLane('left');
    if (e.key === 'ArrowRight') changeLane('right');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 pt-12 pb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Badge className="bg-white/20 backdrop-blur-sm border-0 text-white">
            High: {highScore}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold mb-4">EcoRun 🏃</h1>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm text-emerald-100">Score</p>
            <p className="text-2xl font-bold">{score}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm text-emerald-100">Combo</p>
            <p className="text-2xl font-bold">{gameStateRef.current.combo}x 🔥</p>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 px-6 py-6 flex flex-col items-center justify-center">
        {!isPlaying && !gameOver && (
          <div className="text-center">
            <div className="text-6xl mb-4">🏃💨</div>
            <h2 className="text-xl font-bold mb-2">Clean While You Run!</h2>
            <p className="text-gray-600 mb-4 max-w-xs">
              Swipe left/right to change lanes. Collect garbage and avoid obstacles!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-xs">
              <p className="text-sm text-gray-700 mb-2">🎮 Controls:</p>
              <p className="text-xs text-gray-600">• Tap buttons below to move</p>
              <p className="text-xs text-gray-600">• Keyboard: ← → arrows</p>
            </div>
            <Button onClick={startGame} className="bg-emerald-600 hover:bg-emerald-700">
              <Play className="w-4 h-4 mr-2" />
              Start Running
            </Button>
          </div>
        )}

        {isPlaying && (
          <>
            <canvas
              ref={canvasRef}
              width={300}
              height={500}
              className="rounded-xl shadow-2xl border-4 border-white"
              tabIndex={0}
              onKeyDown={handleKeyPress}
            />
            
            {/* Touch Controls */}
            <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-xs">
              <Button
                onClick={() => changeLane('left')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white h-16"
                size="lg"
              >
                ← Left
              </Button>
              <Button
                onClick={() => changeLane('right')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white h-16"
                size="lg"
              >
                Right →
              </Button>
            </div>
          </>
        )}

        {gameOver && (
          <Card className="p-6 text-center max-w-sm">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-2">Run Complete!</h2>
            <p className="text-gray-600 mb-4">
              You cleaned {score} pieces of garbage!
            </p>
            <div className="bg-emerald-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">Stats:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Score</p>
                  <p className="font-bold text-emerald-600">{score}</p>
                </div>
                <div>
                  <p className="text-gray-600">High Score</p>
                  <p className="font-bold text-emerald-600">{highScore}</p>
                </div>
              </div>
            </div>
            <Button onClick={startGame} className="bg-emerald-600 hover:bg-emerald-700 w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Again
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
