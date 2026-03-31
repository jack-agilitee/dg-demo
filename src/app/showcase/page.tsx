import RewardCard from '@/components/molecules/RewardCard/RewardCard';
import styles from './showcase.module.scss';

export default function ShowcasePage() {
  return (
    <main className={styles['showcase']}>
      <h1 className={styles['showcase__heading']}>Component Showcase</h1>

      {/* ------------------------------------------------------------------ */}
      {/* Molecules                                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className={styles['showcase__section']}>
        <h2 className={styles['showcase__section-title']}>Molecules</h2>

        {/* RewardCard */}
        <div className={styles['showcase__component']}>
          <h3 className={styles['showcase__component-title']}>RewardCard</h3>
          <p className={styles['showcase__component-description']}>
            Reward card used in the Explore Rewards section of the Deals page.
            Displays brand logo, an Activate CTA, offer copy, and expiry date
            over a full-bleed brand background image.
          </p>

          <div className={styles['showcase__component-examples']}>
            {/* Kellogg's variant */}
            <div className={styles['showcase__component-example']}>
              <p className={styles['showcase__example-label']}>Kellogg&apos;s</p>
              <RewardCard
                brandLogo="http://localhost:3845/assets/d5eb8a91a69eb2420b041b393a7b42171edc87d4.png"
                backgroundImage="http://localhost:3845/assets/6d212285d18263ec9228774ca447a3b03e24ffa5.png"
                brandName="Kellogg's"
                title="Buy 5 Kellogg's products to earn $3 OFF"
                expiryDate="12/31/26"
              />
            </div>
          </div>

          <div className={styles['showcase__code']}>
            <pre>{`<RewardCard
  brandLogo="/logos/brand.png"
  backgroundImage="/backgrounds/brand-bg.png"
  brandName="Brand Name"
  title="Buy 5 products to earn $3 OFF"
  expiryDate="12/31/26"
  onActivate={() => { /* TODO: API call */ }}
/>`}</pre>
          </div>
        </div>
      </section>
    </main>
  );
}
