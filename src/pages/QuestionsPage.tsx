import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Question, UserAnswers } from '../types';

interface QuestionsPageProps {
  userAnswers: UserAnswers;
  currentQuestionIndex: number;
  questions: Question[];
  onAnswer: (questionId: string, answer: boolean) => void;
}

const QuestionsPage: React.FC<QuestionsPageProps> = ({
  currentQuestionIndex,
  questions,
  onAnswer
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // マウス/タッチ操作中
  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || isAnimating) return;
    
    const offset = clientX - startX;
    setDragOffset(offset);
  }, [isDragging, startX, isAnimating]);

  // マウス/タッチ操作終了
  const handleEnd = useCallback(() => {
    if (!isDragging || isAnimating) return;
    
    setIsDragging(false);
    
    const threshold = 100; // スワイプ判定の閾値
    
    if (Math.abs(dragOffset) > threshold) {
      // カードを飛ばすアニメーション開始
      setIsAnimating(true);
      
      if (dragOffset > 0) {
        // 右スワイプ = いいえ
        setAnimationDirection('right');
        setTimeout(() => {
          if (questions[currentQuestionIndex]) {
            onAnswer(questions[currentQuestionIndex].id, false);
          }
          setIsAnimating(false);
          setAnimationDirection(null);
          setDragOffset(0);
        }, 300);
      } else {
        // 左スワイプ = はい
        setAnimationDirection('left');
        setTimeout(() => {
          if (questions[currentQuestionIndex]) {
            onAnswer(questions[currentQuestionIndex].id, true);
          }
          setIsAnimating(false);
          setAnimationDirection(null);
          setDragOffset(0);
        }, 300);
      }
    } else {
      // 元の位置に戻す
      setDragOffset(0);
    }
  }, [isDragging, dragOffset, questions, currentQuestionIndex, onAnswer, isAnimating]);

  // グローバルマウスイベントの設定
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX);
      };

      const handleGlobalMouseUp = (e: MouseEvent) => {
        handleEnd();
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, handleMove, handleEnd]);

  if (questions.length === 0) {
    return <div className="content">質問が見つかりません</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // マウス/タッチ操作開始
  const handleStart = (clientX: number) => {
    if (isAnimating) return;
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
  };

  // マウスイベント
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  // タッチイベント
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    handleEnd();
  };

  // カードの変形計算
  const getCardStyle = () => {
    if (isAnimating && animationDirection) {
      // アニメーション中は画面外に飛ばす
      const flyDistance = animationDirection === 'left' ? -400 : 400;
      const rotation = animationDirection === 'left' ? -30 : 30;
      
      return {
        transform: `translateX(${flyDistance}px) rotate(${rotation}deg)`,
        opacity: 0,
        transition: 'all 0.3s ease-out'
      };
    }
    
    if (isDragging) {
      const rotation = dragOffset * 0.1; // 回転角度
      const opacity = Math.max(0.7, 1 - Math.abs(dragOffset) * 0.002);
      
      return {
        transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
        opacity,
        transition: 'none'
      };
    }
    
    return {
      transform: 'translateX(0px) rotate(0deg)',
      opacity: 1,
      transition: 'all 0.3s ease-out'
    };
  };

  // 次のカードのスタイル
  const getNextCardStyle = () => {
    if (isAnimating) {
      return {
        transform: 'translateX(0px) scale(1)',
        opacity: 1,
        transition: 'all 0.3s ease-out'
      };
    }
    
    return {
      transform: 'translateX(0px) scale(0.95)',
      opacity: 0.7,
      transition: 'all 0.3s ease-out'
    };
  };

  // スワイプ方向の表示
  const getSwipeIndicator = () => {
    if (isAnimating) return null;
    if (Math.abs(dragOffset) < 50) return null;
    
    if (dragOffset > 0) {
      return <div className="swipe-indicator no">いいえ</div>;
    } else {
      return <div className="swipe-indicator yes">はい</div>;
    }
  };

  // 背景の色変化
  const getBackgroundOverlay = () => {
    if (isAnimating) return null;
    if (Math.abs(dragOffset) < 50) return null;
    
    const intensity = Math.min(Math.abs(dragOffset) / 200, 0.3);
    const color = dragOffset > 0 ? 'rgba(255, 99, 132, ' : 'rgba(75, 192, 192, ';
    
    return (
      <div 
        className="swipe-background-overlay"
        style={{
          background: color + intensity + ')',
          opacity: intensity
        }}
      />
    );
  };

  return (
    <div className="content">
      <div className="question-swipe-container">
        <div className="progress">
          質問 {currentQuestionIndex + 1} / {questions.length}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="answer-instructions">
          <h3>スワイプで回答してください</h3>
        </div>
        
        <div className="swipe-instructions">
          <div className="instruction-item">
            <span className="swipe-arrow left">←</span>
            <span>はい</span>
          </div>
          <div className="instruction-item">
            <span>いいえ</span>
            <span className="swipe-arrow right">→</span>
          </div>
        </div>

        <div className="question-card-stack">
          {/* 背景オーバーレイ */}
          {getBackgroundOverlay()}
          
          {/* 次のカード（背景用） */}
          {currentQuestionIndex + 1 < questions.length && (
            <div 
              className="question-card next-card"
              style={getNextCardStyle()}
            >
              <div className="question-text">
                {questions[currentQuestionIndex + 1].text}
              </div>
            </div>
          )}
          
          {/* 現在のカード */}
          <div 
            ref={cardRef}
            className="question-card swipeable current-card"
            style={getCardStyle()}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="question-text">
              {currentQuestion.text}
            </div>
            
            {getSwipeIndicator()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage; 