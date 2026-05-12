/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Send, Sparkles, Trophy, AlertCircle, Target, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * 遊戲訊息的型別定義
 */
type FeedbackType = 'neutral' | 'high' | 'low' | 'success' | 'error';

interface GameState {
  targetNumber: number;
  attempts: number;
  message: string;
  isGameOver: boolean;
  feedbackType: FeedbackType;
  min: number;
  max: number;
}

export default function App() {
  // 遊戲狀態管理
  const [gameState, setGameState] = useState<GameState>({
    targetNumber: 0,
    attempts: 0,
    message: '請輸入一個 1 到 100 之間的數字',
    isGameOver: false,
    feedbackType: 'neutral',
    min: 1,
    max: 100
  });

  const [currentGuess, setCurrentGuess] = useState<string>('');

  // 初始化遊戲
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    setGameState({
      targetNumber: randomNum,
      attempts: 0,
      message: '冒險開始！準備好猜測了嗎？',
      isGameOver: false,
      feedbackType: 'neutral',
      min: 1,
      max: 100
    });
    setCurrentGuess('');
  };

  const handleGuess = (e: FormEvent) => {
    e.preventDefault();
    
    const guessNum = parseInt(currentGuess);

    // 輸入驗證
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      setGameState(prev => ({
        ...prev,
        message: '嘿！請輸入 1-100 之間的有效數字喔！',
        feedbackType: 'error'
      }));
      return;
    }

    const newAttempts = gameState.attempts + 1;
    let newMin = gameState.min;
    let newMax = gameState.max;

    if (guessNum === gameState.targetNumber) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899']
      });
      
      setGameState({
        ...gameState,
        attempts: newAttempts,
        message: `太強了！你猜對了！正確答案就是 ${gameState.targetNumber}`,
        isGameOver: true,
        feedbackType: 'success'
      });
    } else if (guessNum > gameState.targetNumber) {
      newMax = Math.min(newMax, guessNum - 1);
      setGameState({
        ...gameState,
        attempts: newAttempts,
        message: '哎呀！太大了點～',
        feedbackType: 'high',
        max: newMax
      });
    } else {
      newMin = Math.max(newMin, guessNum + 1);
      setGameState({
        ...gameState,
        attempts: newAttempts,
        message: '矮油！太小了啦～',
        feedbackType: 'low',
        min: newMin
      });
    }

    setCurrentGuess('');
  };

  const getFeedbackStyles = (type: FeedbackType) => {
    switch (type) {
      case 'high': return 'text-rose-500 bg-rose-50 border-rose-200 shadow-sm shadow-rose-100';
      case 'low': return 'text-amber-500 bg-amber-50 border-amber-200 shadow-sm shadow-amber-100';
      case 'success': return 'text-emerald-600 bg-emerald-50 border-emerald-200 shadow-lg shadow-emerald-100 scale-105';
      case 'error': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-indigo-500 bg-indigo-50 border-indigo-100';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-emerald-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white overflow-hidden relative"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Target size={120} />
        </div>

        {/* Header */}
        <div className="relative p-10 text-center">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              y: [0, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-6 relative"
          >
            <div className="absolute inset-0 bg-indigo-400 blur-2xl opacity-20 rounded-full animate-pulse"></div>
            <div className="relative bg-gradient-to-tr from-indigo-600 to-violet-500 p-5 rounded-3xl shadow-xl shadow-indigo-200">
              <Zap size={32} className="text-yellow-300 fill-yellow-300" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-display font-black text-slate-800 tracking-tight mb-2">數字大冒險</h1>
          <div className="flex items-center justify-center gap-2 text-slate-400 font-medium">
            <Sparkles size={16} className="text-amber-400" />
            <span>精準直覺挑戰賽</span>
            <Sparkles size={16} className="text-amber-400" />
          </div>
        </div>

        {/* Content */}
        <div className="px-10 pb-10">
          {/* Status Message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={gameState.message}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-5 rounded-3xl border-2 mb-8 text-center font-bold text-lg transition-all duration-300 ${getFeedbackStyles(gameState.feedbackType)}`}
            >
              {gameState.feedbackType === 'success' && <Trophy className="inline-block mr-2 mb-1 animate-bounce" size={24} />}
              {gameState.message}
            </motion.div>
          </AnimatePresence>

          {/* Range Indicator */}
          <div className="mb-8 flex flex-col items-center">
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-3 relative">
              <motion.div 
                className="absolute h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                initial={{ left: "0%", right: "0%" }}
                animate={{ 
                  left: `${gameState.min - 1}%`,
                  right: `${100 - gameState.max}%`
                }}
                transition={{ type: "spring", stiffness: 100 }}
              />
            </div>
            <div className="flex justify-between w-full px-1 text-sm font-black tracking-widest text-slate-400 uppercase">
              <span className={gameState.min > 1 ? "text-indigo-600" : ""}>{gameState.min}</span>
              <span className="text-slate-300">鎖定範圍</span>
              <span className={gameState.max < 100 ? "text-emerald-600" : ""}>{gameState.max}</span>
            </div>
            {gameState.min !== 1 || gameState.max !== 100 ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-indigo-600 font-bold bg-indigo-50 px-4 py-1 rounded-full text-xs"
              >
                目前鎖定：{gameState.min} ～ {gameState.max}
              </motion.p>
            ) : null}
          </div>

          {!gameState.isGameOver ? (
            <form onSubmit={handleGuess} className="space-y-6">
              <div className="relative group">
                <input
                  id="guess-input"
                  type="number"
                  value={currentGuess}
                  onChange={(e) => setCurrentGuess(e.target.value)}
                  placeholder="?"
                  className="w-full px-8 py-6 bg-slate-50 border-3 border-transparent rounded-[2rem] text-4xl font-display font-black text-center focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-100 transition-all placeholder:text-slate-200"
                  autoFocus
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none group-focus-within:opacity-40 transition-opacity">
                  <Target size={32} />
                </div>
              </div>

              <div className="flex justify-center">
                <div className="bg-slate-100 px-6 py-2 rounded-2xl text-xs font-bold text-slate-500 uppercase tracking-widest">
                  嘗試次數: <span className="text-indigo-600 text-sm ml-1">{gameState.attempts}</span>
                </div>
              </div>

              <motion.button
                id="submit-guess"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 transition-all cursor-pointer text-lg tracking-wider"
              >
                <Send size={22} className="-rotate-12" />
                立即挑戰
              </motion.button>
            </form>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-8"
            >
              <div className="p-8 bg-emerald-50 rounded-[2.5rem] border-2 border-emerald-100 border-dashed relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-100/50 to-transparent"></div>
                <div className="relative">
                  <p className="text-emerald-800 font-bold mb-2 uppercase tracking-tighter">總共只花了</p>
                  <div className="text-7xl font-display font-black text-emerald-600 leading-none">
                    {gameState.attempts}
                    <span className="text-2xl ml-2 text-emerald-400">次</span>
                  </div>
                </div>
              </div>
              
              <motion.button
                id="play-again"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={startNewGame}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black py-5 rounded-[2.5rem] shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 transition-all cursor-pointer text-lg"
              >
                <RotateCcw size={22} />
                再玩一次挑戰
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50/50 p-6 text-center border-t border-slate-100/50">
          <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">Guess Number Quest v2.0</p>
        </div>
      </motion.div>
    </div>
  );
}
