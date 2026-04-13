'use client';

import React from 'react';
import styles from './showcase.module.scss';
import RewardCard from '../../components/molecules/RewardCard/RewardCard';

function ShowcaseNavigation() {
  return (
    <nav className={styles.showcaseNav}>
      <a href="#atoms" className={styles.showcaseNav__link}>Atoms</a>
      <a href="#molecules" className={styles.showcaseNav__link}>Molecules</a>
      <a href="#organisms" className={styles.showcaseNav__link}>Organisms</a>
      <a href="#templates" className={styles.showcaseNav__link}>Templates</a>
    </nav>
  );
}

function CodeExample({ children, language = 'tsx' }: { children: string; language?: string }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
  };

  return (
    <div className={styles.codeExample}>
      <div className={styles.codeExample__header}>
        <span className={styles.codeExample__language}>{language}</span>
        <button onClick={handleCopy} className={styles.codeExample__button}>
          Copy
        </button>
      </div>
      <pre className={styles.codeExample__block}>
        <code className={styles.codeExample__content}>
          {children.trim()}
        </code>
      </pre>
    </div>
  );
}

function ShowcaseItem({ title, children, code }: { title: string; children: React.ReactNode; code: string }) {
  return (
    <div className={styles.showcaseItem}>
      <h3 className={styles.showcaseItem__title}>{title}</h3>
      <div className={styles.showcaseItem__preview}>
        {children}
      </div>
      <CodeExample>{code}</CodeExample>
    </div>
  );
}

export default function ShowcasePage() {
  return (
    <div className={styles.showcase}>
      <header className={styles.showcase__header}>
        <h1>Component Showcase</h1>
        <p>Interactive component library organized by Atomic Design principles</p>
      </header>

      <ShowcaseNavigation />

      <main className={styles.showcase__content}>
        <section id="atoms" className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Atoms</h2>
          <p className={styles.showcase__placeholder}>No atoms available yet</p>
        </section>

        <section id="molecules" className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Molecules</h2>

          <ShowcaseItem
            title="RewardCard - Activated, In Progress"
            code={`<RewardCard
  variant="activated"
  backgroundImage="/reward-card/rewards-card-bg-cheetos.png"
  brandLogo="/reward-card/brand-logo-cheetos.png"
  description="Buy 5 Cheetos products to earn 1 for 1¢"
  expiresAt="12/31/26"
  purchasedCount={2}
  totalRequired={5}
/>`}
          >
            <div style={{ maxWidth: '343px' }}>
              <RewardCard
                variant="activated"
                backgroundImage="/reward-card/rewards-card-bg-cheetos.png"
                brandLogo="/reward-card/brand-logo-cheetos.png"
                description="Buy 5 Cheetos products to earn 1 for 1¢"
                expiresAt="12/31/26"
                purchasedCount={2}
                totalRequired={5}
              />
            </div>
          </ShowcaseItem>

          <ShowcaseItem
            title="RewardCard - Activated, With Banked Rewards"
            code={`<RewardCard
  variant="activated"
  backgroundImage="/reward-card/rewards-card-bg-cheetos.png"
  brandLogo="/reward-card/brand-logo-cheetos.png"
  description="Buy 5 Cheetos products to earn 1 for 1¢"
  expiresAt="12/31/26"
  purchasedCount={4}
  totalRequired={5}
  bankedRewards={2}
/>`}
          >
            <div style={{ maxWidth: '343px' }}>
              <RewardCard
                variant="activated"
                backgroundImage="/reward-card/rewards-card-bg-cheetos.png"
                brandLogo="/reward-card/brand-logo-cheetos.png"
                description="Buy 5 Cheetos products to earn 1 for 1¢"
                expiresAt="12/31/26"
                purchasedCount={4}
                totalRequired={5}
                bankedRewards={2}
              />
            </div>
          </ShowcaseItem>

          <ShowcaseItem
            title="RewardCard - Explore, Pre-Activation"
            code={`<RewardCard
  variant="explore"
  backgroundImage="/reward-card/rewards-card-bg-cheetos.png"
  brandLogo="/reward-card/brand-logo-cheetos.png"
  description="Buy 5 Cheetos products to earn 1 for 1¢"
  expiresAt="12/31/26"
  onActivate={() => console.log('Reward activated!')}
/>`}
          >
            <div style={{ maxWidth: '343px' }}>
              <RewardCard
                variant="explore"
                backgroundImage="/reward-card/rewards-card-bg-cheetos.png"
                brandLogo="/reward-card/brand-logo-cheetos.png"
                description="Buy 5 Cheetos products to earn 1 for 1¢"
                expiresAt="12/31/26"
                onActivate={() => console.log('Reward activated!')}
              />
            </div>
          </ShowcaseItem>
        </section>

        <section id="organisms" className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Organisms</h2>
          <p className={styles.showcase__placeholder}>No organisms available yet</p>
        </section>

        <section id="templates" className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Templates</h2>
          <p className={styles.showcase__placeholder}>No templates available yet</p>
        </section>
      </main>
    </div>
  );
}
