import React, { useState } from 'react';
import './App.css';
import { AppState, AgeGroup, Question, DiagnosisResult, CareProduct, UserAnswers } from './types';
import HomePage from './pages/HomePage';
import QuestionsPage from './pages/QuestionsPage';
import ResultPage from './pages/ResultPage';
import ProductsPage from './pages/ProductsPage';
import questionsData from './data/questions.json';
import diagnosisData from './data/diagnosis.json';
import productsData from './data/products.json';

// JSONデータを型キャスト
const questions = questionsData as Question[];
const diagnoses = diagnosisData as DiagnosisResult[];
const products = productsData as CareProduct[];

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'home',
    userAnswers: null,
    currentQuestionIndex: 0,
    diagnosisResult: null,
    recommendedProducts: []
  });

  // 年齢から年代グループを取得
  const getAgeGroup = (age: number): AgeGroup => {
    if (age >= 0 && age < 1) return 'infant_early';        // 乳児前期（0〜11ヶ月）
    if (age >= 1 && age <= 2) return 'infant_late';        // 乳児後期（1〜2歳）
    if (age >= 3 && age <= 5) return 'toddler';            // 幼児期（3〜5歳）
    if (age >= 6 && age <= 9) return 'school_early';       // 学童前期（6〜9歳）
    if (age >= 10 && age <= 12) return 'school_late';      // 学童後期（10〜12歳）
    if (age >= 13 && age <= 15) return 'adolescent_early'; // 思春期前期（13〜15歳）
    if (age >= 16 && age <= 18) return 'adolescent_late';  // 思春期後期（16〜18歳）
    if (age >= 19 && age <= 34) return 'young_adult';      // 若年成人（19〜34歳）
    if (age >= 35 && age <= 49) return 'middle_age';       // 中年期（35〜49歳）
    if (age >= 50 && age <= 64) return 'mature_age';       // 壮年期（50〜64歳）
    if (age >= 65) return 'senior';                        // 高齢期（65歳以上）
    return 'infant_early'; // デフォルト
  };

  // 診断開始
  const startDiagnosis = (age: number) => {
    const ageGroup = getAgeGroup(age);
    const userAnswers: UserAnswers = {
      age,
      ageGroup,
      answers: {}
    };
    
    setAppState((prev: AppState) => ({
      ...prev,
      currentPage: 'questions',
      userAnswers,
      currentQuestionIndex: 0
    }));
  };

  // 質問に回答
  const answerQuestion = (questionId: string, answer: boolean) => {
    if (!appState.userAnswers) return;

    const updatedAnswers = {
      ...appState.userAnswers.answers,
      [questionId]: answer
    };

    const updatedUserAnswers = {
      ...appState.userAnswers,
      answers: updatedAnswers
    };

    // 年代別の質問を取得
    const ageGroupQuestions = questions.filter(
      q => q.ageGroup === updatedUserAnswers.ageGroup
    );

    const nextIndex = appState.currentQuestionIndex + 1;

    if (nextIndex >= ageGroupQuestions.length) {
      // 全ての質問が終了 - 診断結果を計算
      const result = calculateDiagnosisResult(updatedUserAnswers);
      const recommendedProducts = getRecommendedProducts(updatedUserAnswers, result);
      
      setAppState((prev: AppState) => ({
        ...prev,
        currentPage: 'result',
        userAnswers: updatedUserAnswers,
        diagnosisResult: result,
        recommendedProducts
      }));
    } else {
      // 次の質問へ
      setAppState((prev: AppState) => ({
        ...prev,
        userAnswers: updatedUserAnswers,
        currentQuestionIndex: nextIndex
      }));
    }
  };

  // 診断結果を計算
  const calculateDiagnosisResult = (userAnswers: UserAnswers): DiagnosisResult => {
    const ageGroupDiagnoses = diagnoses.filter(
      d => d.ageGroup === userAnswers.ageGroup
    );

    // 簡単な診断ロジック（実際はより複雑な条件分岐になる）
    const yesAnswers = Object.values(userAnswers.answers).filter(Boolean).length;
    
    if (yesAnswers === 0) {
      // 全てNoの場合は健康状態
      const healthyResult = ageGroupDiagnoses.find(d => d.conditionKeys.includes('healthy'));
      return healthyResult || ageGroupDiagnoses[0];
    } else {
      // 1つ以上Yesがある場合は注意が必要な状態
      const concernResult = ageGroupDiagnoses.find(d => !d.conditionKeys.includes('healthy'));
      return concernResult || ageGroupDiagnoses[0];
    }
  };

  // おすすめ商品を取得
  const getRecommendedProducts = (userAnswers: UserAnswers, result: DiagnosisResult): CareProduct[] => {
    return products.filter(product => 
      product.ageGroups.includes(userAnswers.ageGroup) &&
      result.conditionKeys.some(key => product.conditions.includes(key))
    ).slice(0, 5); // 最大5個まで
  };

  // ページ遷移
  const goToPage = (page: AppState['currentPage']) => {
    setAppState((prev: AppState) => ({ ...prev, currentPage: page }));
  };

  // アプリリセット
  const resetApp = () => {
    setAppState({
      currentPage: 'home',
      userAnswers: null,
      currentQuestionIndex: 0,
      diagnosisResult: null,
      recommendedProducts: []
    });
  };

  const currentUserAnswers = appState.userAnswers;

  return (
    <div className="App">
      <div className={`container ${(appState.currentPage === 'home' || appState.currentPage === 'result' || appState.currentPage === 'products') ? 'container-home' : 'container-compact'}`}>
        {(appState.currentPage !== 'home' && appState.currentPage !== 'result' && appState.currentPage !== 'products') && (
          <header className="header header-compact">
            <h1 className="title">
              はち<br />
              ケアNavi
            </h1>
          </header>
        )}

        {appState.currentPage === 'home' && (
          <header className="header header-home">
            <h1 className="title">
              はち<br />
              ケアNavi
            </h1>
            <p className="subtitle">
              アプリで簡単チェック！<br />
              あなたのお口の状態に合ったケアをご案内します
            </p>
          </header>
        )}

        {appState.currentPage === 'home' && (
          <HomePage onStart={startDiagnosis} />
        )}

        {appState.currentPage === 'questions' && currentUserAnswers && (
          <QuestionsPage
            userAnswers={currentUserAnswers}
            currentQuestionIndex={appState.currentQuestionIndex}
            questions={questions.filter(q => q.ageGroup === currentUserAnswers.ageGroup)}
            onAnswer={answerQuestion}
          />
        )}

        {appState.currentPage === 'result' && appState.diagnosisResult && (
          <ResultPage
            result={appState.diagnosisResult}
            onViewProducts={() => goToPage('products')}
            onRestart={resetApp}
          />
        )}

        {appState.currentPage === 'products' && (
          <ProductsPage
            products={appState.recommendedProducts}
            onBack={() => goToPage('result')}
            onRestart={resetApp}
          />
        )}
      </div>
    </div>
  );
}

export default App; 