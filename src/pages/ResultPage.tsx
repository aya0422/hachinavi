import React, { useState } from 'react';
import { DiagnosisResult } from '../types';

interface ResultPageProps {
  result: DiagnosisResult;
  onViewProducts: () => void;
  onRestart: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({
  result,
  onViewProducts,
  onRestart
}) => {
  const [showColumnDetail, setShowColumnDetail] = useState(false);

  const getAgeGroupDisplay = (ageGroup: string) => {
    switch (ageGroup) {
      case 'infant_early': return '乳児前期（0〜11ヶ月）';
      case 'infant_late': return '乳児後期（1〜2歳）';
      case 'toddler': return '幼児期（3〜5歳）';
      case 'school_early': return '学童前期（6〜9歳）';
      case 'school_late': return '学童後期（10〜12歳）';
      case 'adolescent_early': return '思春期前期（13〜15歳）';
      case 'adolescent_late': return '思春期後期（16〜18歳）';
      case 'young_adult': return '若年成人（19〜34歳）';
      case 'middle_age': return '中年期（35〜49歳）';
      case 'mature_age': return '壮年期（50〜64歳）';
      case 'senior': return '高齢期（65歳以上）';
      default: return '';
    }
  };

  const getOralConditionIcon = (ageGroup: string, conditionKeys: string[]) => {
    if (conditionKeys.includes('healthy')) {
      return ageGroup === 'infant_early' ? '🍼' : '😊';
    } else if (conditionKeys.includes('habit_concern')) {
      return '⚠️';
    } else if (conditionKeys.includes('care_resistance')) {
      return '😰';
    } else if (conditionKeys.includes('gingivitis') || conditionKeys.includes('bleeding')) {
      return '🔴';
    } else if (conditionKeys.includes('periodontitis')) {
      return '🟠';
    } else if (conditionKeys.includes('dry_mouth')) {
      return '💧';
    } else if (conditionKeys.includes('recession')) {
      return '📉';
    } else if (conditionKeys.includes('caries_risk')) {
      return '⚠️';
    }
    return '🦷';
  };

  const getOralConditionDescription = (conditionKeys: string[]) => {
    if (conditionKeys.includes('healthy')) {
      return 'お口の状態が良好です';
    } else if (conditionKeys.includes('habit_concern')) {
      return '習癖に注意が必要です';
    } else if (conditionKeys.includes('care_resistance')) {
      return '歯みがきケアの工夫が必要です';
    } else if (conditionKeys.includes('gingivitis')) {
      return '歯茎に軽度の炎症があります';
    } else if (conditionKeys.includes('periodontitis')) {
      return '歯周病の兆候が見られます';
    } else if (conditionKeys.includes('dry_mouth')) {
      return '口腔内の乾燥が気になります';
    } else if (conditionKeys.includes('recession')) {
      return '歯茎の退縮が見られます';
    } else if (conditionKeys.includes('caries_risk')) {
      return '虫歯のリスクが高い状態です';
    }
    return 'お口の状態をチェックしました';
  };

  return (
    <div className="content">
      <div className="result-section">
        <div className="character">
          🦷
        </div>
        
        <div className="age-group-display">
          {getAgeGroupDisplay(result.ageGroup)}
        </div>
        
        <h2 className="result-title">{result.title}</h2>
        
        <p className="result-description">{result.description}</p>

        {/* 口腔状態の視覚的表示 */}
        <div className="oral-image-section">
          <h3>お口の状態</h3>
          {/* 実際の口腔内画像がある場合は表示 */}
          {result.oralImage && (
            <div className="oral-image-container">
              <img 
                src={result.oralImage} 
                alt="口腔内の状態" 
                className="oral-image"
                onError={(e) => {
                  // 画像が読み込めない場合はアイコン表示にフォールバック
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const placeholder = target.nextElementSibling as HTMLElement;
                  if (placeholder) {
                    placeholder.style.display = 'flex';
                  }
                }}
              />
              <div className="oral-image-fallback" style={{ display: 'none' }}>
                <div className="condition-icon">
                  {getOralConditionIcon(result.ageGroup, result.conditionKeys)}
                </div>
                <div className="condition-text">
                  {getOralConditionDescription(result.conditionKeys)}
                </div>
              </div>
            </div>
          )}
          {/* 画像がない場合はアイコン表示 */}
          {!result.oralImage && (
            <div className="oral-condition-display">
              <div className="condition-icon">
                {getOralConditionIcon(result.ageGroup, result.conditionKeys)}
              </div>
              <div className="condition-text">
                {getOralConditionDescription(result.conditionKeys)}
              </div>
            </div>
          )}
        </div>

        {/* リスクの説明 */}
        {result.riskDescription && (
          <div className="risk-description">
            <h3>なぜこの状態になるのか</h3>
            <p>{result.riskDescription}</p>
          </div>
        )}
        
        <div className="advice-list">
          <h3>おすすめのケア方法</h3>
          <ul>
            {result.advice.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* おすすめケアグッズボタン - 院内コラムの前に配置 */}
        <div className="care-products-cta">
          <button 
            className="care-products-button" 
            onClick={onViewProducts}
          >
            おすすめのケアグッズはこちら
            <span className="button-arrow">→</span>
          </button>
        </div>

        {/* 院内コラム情報 */}
        {result.clinicColumn && (
          <div className="clinic-column">
            <h3>この年代に多いお悩み</h3>
            <div className="column-preview">
              <div className="column-icon">📋</div>
              <div className="column-content">
                <h4>
                  {result.clinicColumn.title.includes('はちクラブ') ? (
                    <>
                      はちクラブ<br />
                      {result.clinicColumn.title.replace('はちクラブ2025', '').replace('はちクラブ', '')}
                    </>
                  ) : (
                    result.clinicColumn.title
                  )}
                </h4>
                <p className="column-brief">{result.clinicColumn.description}</p>
              </div>
            </div>
            <button 
              className="column-detail-button"
              onClick={() => setShowColumnDetail(true)}
            >
              詳しく見る
            </button>
          </div>
        )}
      </div>
      
      <div className="navigation">
        <button 
          className="nav-button nav-button-full-width" 
          onClick={onRestart}
        >
          もう一度診断する
        </button>
      </div>

      {/* 院内コラム詳細モーダル */}
      {showColumnDetail && result.clinicColumn && (
        <div className="modal-overlay" onClick={() => setShowColumnDetail(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{result.clinicColumn.title}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowColumnDetail(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>{result.clinicColumn.description}</p>
              <div className="column-features">
                <h4>当院での取り組み</h4>
                <ul>
                  <li>専門的な検査と診断</li>
                  <li>年齢に応じたケア指導</li>
                  <li>定期的なフォローアップ</li>
                  <li>予防プログラムのご提案</li>
                </ul>
              </div>
              <div className="contact-info">
                <p>詳しくはスタッフまでお気軽にお声かけください。</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage; 