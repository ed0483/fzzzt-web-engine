import { useState, useEffect } from 'react'
import cardsData from './cards.json'
import Card from './components/Card'

export default function App() {
  const [deck, setDeck] = useState([])
  const [belt, setBelt] = useState([])
  const [userHand, setUserHand] = useState([1, 2, 3])
  const [aiHand, setAiHand] = useState([1, 2, 3])
  const [userScore, setUserScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [message, setMessage] = useState("Choose a card from your hand to bid!")

  useEffect(() => {
    const shuffled = [...cardsData].sort(() => Math.random() - 0.5)
    setBelt(shuffled.slice(0, 8))
    setDeck(shuffled.slice(8))
  }, [])

  const handleBid = (bidValue) => {
    if (belt.length === 0) return
    const targetCard = belt[0]
    const aiBidValue = aiHand[Math.floor(Math.random() * aiHand.length)]

    if (bidValue >= aiBidValue) {
      setUserScore(userScore + targetCard.points)
      setMessage(`You won! ${targetCard.name} added to your points.`)
    } else {
      setAiScore(aiScore + targetCard.points)
      setMessage(`AI won! It took the ${targetCard.name}.`)
    }

    setUserHand(userHand.filter((v, i) => v !== bidValue || userHand.indexOf(v) !== i))
    setAiHand(aiHand.filter((v, i) => v !== aiBidValue || aiHand.indexOf(v) !== i))
    setBelt(belt.slice(1))

    if (userHand.length <= 1) {
      setUserHand([1, 2, 3, 4, 5]) 
      setAiHand([1, 2, 3, 4, 5])
    }
  }

  const beltSpeed = belt[0]?.beltSpeed || 1

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-black mb-8 text-cyan-400 uppercase tracking-tighter">FZZZT! ENGINE</h1>
      
      <div className="flex gap-8 mb-8 bg-slate-800 p-4 rounded-xl border border-white/10">
        <div className="text-center"><p className="text-xs text-slate-400">YOU</p><p className="text-2xl font-bold">{userScore}</p></div>
        <div className="text-center border-l border-white/10 pl-8"><p className="text-xs text-slate-400">AI</p><p className="text-2xl font-bold text-red-400">{aiScore}</p></div>
      </div>

      <div className="flex gap-4 p-6 bg-black/20 rounded-2xl border border-white/5 mb-12 overflow-x-auto max-w-full">
        {belt.map((card, i) => (
          <Card key={`${card.id}-${i}`} card={card} isHidden={i >= beltSpeed} />
        ))}
      </div>

      <div className="bg-slate-800 p-8 rounded-2xl border-2 border-cyan-500/30 shadow-2xl text-center w-full max-w-md">
        <p className="mb-6 font-medium text-cyan-100">{message}</p>
        <div className="flex gap-4 justify-center">
          {userHand.map((val, i) => (
            <button key={i} onClick={() => handleBid(val)} className="w-12 h-12 bg-cyan-600 rounded-lg font-bold hover:bg-cyan-400 transition-colors">
              {val}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}