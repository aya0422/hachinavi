import React, { useState, useRef, useEffect } from 'react';
import teethIcon from '../assets/teeth-icon.png';

interface HomePageProps {
  onStart: (age: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  const [selectedAge, setSelectedAge] = useState<number>(25);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  // 年齢の配列を生成（0歳から120歳まで）
  const ages = Array.from({ length: 121 }, (_, i) => i);
  const itemHeight = 50; // 各項目の高さ
  const visibleItems = 5; // 表示する項目数
  const centerIndex = Math.floor(visibleItems / 2);

  // 初期位置を設定
  useEffect(() => {
    const initialOffset = -selectedAge * itemHeight;
    setCurrentOffset(initialOffset);
  }, []);

  // ホイールの位置から年齢を計算
  const getAgeFromOffset = (offset: number) => {
    const index = Math.round(-offset / itemHeight);
    return Math.max(0, Math.min(120, index));
  };

  // 年齢からオフセットを計算
  const getOffsetFromAge = (age: number) => {
    return -age * itemHeight;
  };

  // ドラッグ開始
  const handleDragStart = (clientY: number) => {
    setIsDragging(true);
    setStartY(clientY);
  };

  // ドラッグ中
  const handleMove = (clientY: number) => {
    if (!isDragging) return;
    
    const deltaY = clientY - startY;
    const newOffset = currentOffset + deltaY;
    
    // 範囲制限
    const minOffset = -120 * itemHeight;
    const maxOffset = 0;
    const clampedOffset = Math.max(minOffset, Math.min(maxOffset, newOffset));
    
    setCurrentOffset(clampedOffset);
    setStartY(clientY);
  };

  // ドラッグ終了
  const handleEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // 最も近い年齢にスナップ
    const nearestAge = getAgeFromOffset(currentOffset);
    const snappedOffset = getOffsetFromAge(nearestAge);
    
    setCurrentOffset(snappedOffset);
    setSelectedAge(nearestAge);
  };

  // マウスイベント
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientY);
  };

  // タッチイベント
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // グローバルマウスイベント
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleMove(e.clientY);
      };

      const handleGlobalMouseUp = () => {
        handleEnd();
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, currentOffset, startY]);

  // ホイールイベント
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 : -1;
    const newAge = Math.max(0, Math.min(120, selectedAge + delta));
    setSelectedAge(newAge);
    setCurrentOffset(getOffsetFromAge(newAge));
  };

  const handleStartButton = () => {
    onStart(selectedAge);
  };

  return (
    <div className="content">
      <div className="speech-bubble-container">
        <div className="speech-bubble">
          <p className="speech-text">
            アプリで簡単チェック！<br />
            あなたのお口の状態に合ったケアをご案内します
          </p>
        </div>
        <div className="character-avatar" style={{backgroundImage: `url(${teethIcon})`}}></div>
      </div>
      
      <div className="age-wheel-section">
        <label className="age-label">
          年齢を選択してください
        </label>
        
        <div className="age-wheel-container">
          <div className="age-wheel-frame">
            <div className="age-wheel-indicator">
              <div className="indicator-line"></div>
              <div className="selected-age">{selectedAge}歳</div>
              <div className="indicator-line"></div>
            </div>
            
            <div
              ref={wheelRef}
              className="age-wheel"
              style={{
                transform: `translateY(${currentOffset + (centerIndex * itemHeight)}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out'
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
            >
              {ages.map((age) => {
                const distance = Math.abs(age - selectedAge);
                const opacity = Math.max(0.3, 1 - distance * 0.2);
                const scale = Math.max(0.8, 1 - distance * 0.1);
                
                return (
                  <div
                    key={age}
                    className={`age-item ${age === selectedAge ? 'selected' : ''}`}
                    style={{
                      opacity,
                      transform: `scale(${scale})`,
                      height: `${itemHeight}px`
                    }}
                    onClick={() => {
                      setSelectedAge(age);
                      setCurrentOffset(getOffsetFromAge(age));
                    }}
                  >
                    {age}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <button
          className="start-button"
          onClick={handleStartButton}
        >
          スタート！
        </button>
      </div>
    </div>
  );
};

export default HomePage; 