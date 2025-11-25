import React from 'react';
import { ScrollFloat } from '../components/scroll';

const HebrewTitleExample: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Default gradient style */}
      <ScrollFloat 
        textClassName="rtl"
        containerClassName="hebrew-title"
      >
        עמותת &quot;כיף לתת&quot;
      </ScrollFloat>
      
      {/* Alternative styles - uncomment to use different gradients */}
      {/* 
      <ScrollFloat 
        textClassName="gradient-gold rtl"
        containerClassName="hebrew-title"
      >
        עמותת &quot;כיף לתת&quot;
      </ScrollFloat>
      */}
      
      {/* 
      <ScrollFloat 
        textClassName="gradient-ocean rtl"
        containerClassName="hebrew-title"
      >
        עמותת &quot;כיף לתת&quot;
      </ScrollFloat>
      */}
      
      {/* 
      <ScrollFloat 
        textClassName="elegant-dark rtl"
        containerClassName="hebrew-title"
      >
        עמותת &quot;כיף לתת&quot;
      </ScrollFloat>
      */}
    </div>
  );
};

export default HebrewTitleExample;