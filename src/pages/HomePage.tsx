import React, { useState } from 'react';
import teethIcon from '../assets/teeth-icon.png';

interface HomePageProps {
  onStart: (age: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  const [age, setAge] = useState<string>('');

  const handleStart = () => {
    const ageNumber = parseInt(age);
    if (ageNumber >= 0 && ageNumber <= 120) {
      onStart(ageNumber);
    }
  };

  const isValidAge = age !== '' && parseInt(age) >= 0 && parseInt(age) <= 120;

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
      
      <div className="age-input-section">
        <label className="age-label">
          年齢を入力してください
        </label>
        <input
          type="number"
          className="age-input"
          placeholder="例: 25"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          min="0"
          max="120"
        />
        <button
          className="start-button"
          onClick={handleStart}
          disabled={!isValidAge}
        >
          スタート！
        </button>
      </div>
    </div>
  );
};

export default HomePage; 