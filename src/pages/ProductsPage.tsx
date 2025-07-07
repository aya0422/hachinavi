import React, { useState } from 'react';
import { CareProduct } from '../types';

interface ProductsPageProps {
  products: CareProduct[];
  onBack: () => void;
  onRestart: () => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  onBack,
  onRestart
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = {
    all: 'すべて',
    toothbrush: '歯ブラシ',
    toothpaste: '歯磨き剤',
    interdental: '歯間清掃具',
    mouthwash: 'うがい・保湿',
    other: 'その他'
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'toothbrush': return '🪥';
      case 'toothpaste': return '🧴';
      case 'interdental': return '🧵';
      case 'mouthwash': return '💧';
      case 'other': return '🔧';
      default: return '📦';
    }
  };

  const getProductIcon = (category: string, productName: string) => {
    switch (category) {
      case 'toothbrush':
        if (productName.includes('乳幼児') || productName.includes('こども')) return '👶🪥';
        if (productName.includes('タフト')) return '🪥';
        if (productName.includes('やわらか')) return '✨🪥';
        return '🪥';
      case 'toothpaste':
        if (productName.includes('チェックアップ')) return '✅🧴';
        if (productName.includes('ホワイト')) return '⭐🧴';
        if (productName.includes('リペリオ')) return '🌿🧴';
        if (productName.includes('センシティブ')) return '💙🧴';
        return '🧴';
      case 'interdental':
        if (productName.includes('フロス')) return '🧵';
        if (productName.includes('歯間ブラシ')) return '🔸';
        return '🧵';
      case 'mouthwash':
        if (productName.includes('ベビー')) return '🍼💧';
        if (productName.includes('オーラルピース')) return '🌿💧';
        if (productName.includes('コンクール')) return '🛡️💧';
        return '💧';
      case 'other':
        if (productName.includes('ガーゼ')) return '🧽👶';
        if (productName.includes('入れ歯')) return '🦷🧽';
        if (productName.includes('舌')) return '👅🧽';
        return '🔧';
      default:
        return '📦';
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const groupedProducts = Object.entries(categories).reduce((acc, [key, label]) => {
    if (key === 'all') return acc;
    
    const categoryProducts = products.filter(product => product.category === key);
    if (categoryProducts.length > 0) {
      acc[key] = {
        label,
        products: categoryProducts
      };
    }
    return acc;
  }, {} as Record<string, { label: string; products: CareProduct[] }>);

  return (
    <div className="content">
      <div className="products-section">
        <h2 className="products-title">あなたにおすすめのケアグッズ</h2>
        
        <p className="products-description">
          診断結果に基づいて、あなたの口腔状態に適したケアグッズをご紹介します。
          院内でお求めいただけます。
        </p>

        {/* カテゴリフィルター */}
        <div className="category-filter">
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              className={`category-button ${selectedCategory === key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(key)}
            >
              {getCategoryIcon(key)} {label}
            </button>
          ))}
        </div>

        {/* 商品一覧（フィルター表示） */}
        {selectedCategory === 'all' ? (
          // カテゴリ別に整理して表示
          <div className="products-by-category">
            {Object.entries(groupedProducts).map(([categoryKey, categoryData]) => (
              <div key={categoryKey} className="category-section">
                <h3 className="category-title">
                  {getCategoryIcon(categoryKey)} {categoryData.label}
                </h3>
                <div className="products-grid">
                  {categoryData.products.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="product-image">
                        {/* 実際の商品画像がある場合は表示 */}
                        {product.image ? (
                          <>
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="product-img"
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
                            <div className="product-image-placeholder" style={{ display: 'none' }}>
                              {getProductIcon(product.category, product.name)}
                            </div>
                          </>
                        ) : (
                          // 画像がない場合はアイコン表示
                          <div className="product-image-placeholder">
                            {getProductIcon(product.category, product.name)}
                          </div>
                        )}
                      </div>
                      <div className="product-info">
                        <h4 className="product-name">{product.name}</h4>
                        <p className="product-description">{product.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 選択したカテゴリの商品のみ表示
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {/* 実際の商品画像がある場合は表示 */}
                  {product.image ? (
                    <>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="product-img"
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
                      <div className="product-image-placeholder" style={{ display: 'none' }}>
                        {getProductIcon(product.category, product.name)}
                      </div>
                    </>
                  ) : (
                    // 画像がない場合はアイコン表示
                    <div className="product-image-placeholder">
                      {getProductIcon(product.category, product.name)}
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h4 className="product-name">{product.name}</h4>
                  <p className="product-description">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="no-products">
            このカテゴリには該当する商品がありません。
          </div>
        )}

        <div className="products-note">
          <h4>ご購入について</h4>
          <p>
            これらの商品は院内でお求めいただけます。<br />
            詳しい使用方法や選び方について、お気軽にスタッフまでご相談ください。
          </p>
        </div>
      </div>
      
      <div className="navigation">
        <button 
          className="nav-button nav-button-full-width" 
          onClick={onBack}
        >
          診断結果に戻る
        </button>
        <button 
          className="nav-button primary nav-button-full-width" 
          onClick={onRestart}
        >
          もう一度診断する
        </button>
      </div>
    </div>
  );
};

export default ProductsPage; 