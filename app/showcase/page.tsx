'use client';

import RewardsCard from '@/components/molecules/RewardsCard/RewardsCard';
import styles from './page.module.scss';

export default function ShowcasePage() {
  return (
    <div className={styles.showcase}>
      <header className={styles.showcase__header}>
        <h1 className={styles.showcase__title}>Component Showcase</h1>
        <h2 className={styles.showcase__subtitle}>RewardsCard</h2>
      </header>

      <div className={styles.showcase__grid}>
        <div className={styles.showcaseItem}>
          <p className={styles.showcaseItem__label}>Default state (2 of 5 earned)</p>
          <div className={styles.showcaseItem__cardWrapper}>
            <RewardsCard
              backgroundSrc="/images/rewards-card/rewards-card-bg.png"
              logoSrc="/images/rewards-card/logo.png"
              totalPunches={5}
              earnedPunches={2}
              promoText="Buy 5 Cheetos products to earn 1 for 1¢"
              expirationDate="12/31/26"
            />
          </div>
        </div>

        <div className={styles.showcaseItem}>
          <p className={styles.showcaseItem__label}>Almost complete (4 of 5 earned)</p>
          <div className={styles.showcaseItem__cardWrapper}>
            <RewardsCard
              backgroundSrc="/images/rewards-card/rewards-card-bg.png"
              logoSrc="/images/rewards-card/logo.png"
              totalPunches={5}
              earnedPunches={4}
              promoText="Buy 5 Cheetos products to earn 1 for 1¢"
              expirationDate="12/31/26"
            />
          </div>
        </div>

        <div className={styles.showcaseItem}>
          <p className={styles.showcaseItem__label}>Clickable card (5 of 5 earned)</p>
          <div className={styles.showcaseItem__cardWrapper}>
            <RewardsCard
              backgroundSrc="/images/rewards-card/rewards-card-bg.png"
              logoSrc="/images/rewards-card/logo.png"
              totalPunches={5}
              earnedPunches={5}
              promoText="Buy 5 Cheetos products to earn 1 for 1¢"
              expirationDate="12/31/26"
              onClick={() => alert('Card clicked!')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
