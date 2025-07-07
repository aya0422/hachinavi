export interface Question {
  id: string;
  text: string;
  ageGroup: AgeGroup;
}

export interface DiagnosisResult {
  id: string;
  title: string;
  description: string;
  advice: string[];
  character?: string;
  ageGroup: AgeGroup;
  conditionKeys: string[];
  oralImage?: string; // 口腔内画像
  riskDescription?: string; // リスクの説明
  clinicColumn?: ClinicColumn; // 院内コラム情報
}

export interface ClinicColumn {
  title: string;
  description: string;
  image?: string;
  ageGroup: AgeGroup;
}

export interface CareProduct {
  id: string;
  name: string;
  description: string;
  image?: string;
  externalLink?: string;
  ageGroups: AgeGroup[];
  conditions: string[];
  category: 'toothbrush' | 'toothpaste' | 'interdental' | 'mouthwash' | 'other';
  price?: number;
}

// 新しい年齢区分（11区分）
export type AgeGroup = 
  | 'infant_early'      // 乳児前期（0〜11ヶ月）
  | 'infant_late'       // 乳児後期（1〜2歳）
  | 'toddler'           // 幼児期（3〜5歳）
  | 'school_early'      // 学童前期（6〜9歳）
  | 'school_late'       // 学童後期（10〜12歳）
  | 'adolescent_early'  // 思春期前期（13〜15歳）
  | 'adolescent_late'   // 思春期後期（16〜18歳）
  | 'young_adult'       // 若年成人（19〜34歳）
  | 'middle_age'        // 中年期（35〜49歳）
  | 'mature_age'        // 壮年期（50〜64歳）
  | 'senior';           // 高齢期（65歳以上）

export interface UserAnswers {
  age: number;
  ageGroup: AgeGroup;
  answers: { [questionId: string]: boolean };
}

export interface AppState {
  currentPage: 'home' | 'questions' | 'result' | 'products';
  userAnswers: UserAnswers | null;
  currentQuestionIndex: number;
  diagnosisResult: DiagnosisResult | null;
  recommendedProducts: CareProduct[];
} 