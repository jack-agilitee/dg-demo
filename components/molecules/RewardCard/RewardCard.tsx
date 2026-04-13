'use client';

import Image from 'next/image';
import styles from './RewardCard.module.scss';

interface RewardCardProps {
  variant: 'activated' | 'explore';
  backgroundImage: string;
  brandLogo: string;
  description: string;
  expiresAt?: string;
  purchasedCount?: number;
  totalRequired?: number;
  bankedRewards?: number;
  onActivate?: () => void;
}

function RewardCard({
  variant,
  backgroundImage,
  brandLogo,
  description,
  expiresAt,
  purchasedCount = 0,
  totalRequired = 5,
  bankedRewards = 0,
  onActivate,
}: RewardCardProps) {
  const circles = Array.from({ length: totalRequired }, (_, i) => i < purchasedCount);

  return (
    <article className={styles['reward-card']}>
      {/* Background image */}
      <Image
        src={backgroundImage}
        alt=""
        aria-hidden
        fill
        className={styles['reward-card__bg']}
        sizes="(max-width: 343px) 100vw, 343px"
      />

      {/* Header row */}
      <div className={styles['reward-card__header']}>
        {/* Brand logo */}
        <Image
          src={brandLogo}
          alt="Brand logo"
          width={48}
          height={30}
          className={styles['reward-card__logo']}
        />

        {/* Punch tracker — activated variant only */}
        {variant === 'activated' && (
          <div className={styles['reward-card__tracker']}>
            <div className={styles['reward-card__circles']}>
              {circles.map((filled, idx) => (
                <Image
                  key={`circle-${idx}`}
                  src={
                    filled
                      ? '/reward-card/punch-circle-checked.svg'
                      : '/reward-card/punch-circle-empty.svg'
                  }
                  alt={filled ? 'Purchased' : 'Remaining'}
                  width={16}
                  height={16}
                />
              ))}
            </div>
            <span className={styles['reward-card__tracker-label']}>
              {purchasedCount} of {totalRequired} Purchased
            </span>
          </div>
        )}

        {/* Rewards badge */}
        <div className={styles['reward-card__badge-wrap']}>
          <div className={styles['reward-card__rewards-badge']}>
            <Image
              src="/reward-card/icon-rewards.svg"
              alt=""
              aria-hidden="true"
              width={21}
              height={19}
            />
            <span className={styles['reward-card__rewards-label']}>Rewards</span>
          </div>

          {/* Banked rewards count badge */}
          {bankedRewards > 0 && (
            <span className={styles['reward-card__banked-badge']}>
              {bankedRewards}
            </span>
          )}
        </div>
      </div>

      {/* Bottom section */}
      <div className={styles['reward-card__bottom']}>
        <p className={styles['reward-card__description']}>{description}</p>

        {variant === 'activated' && expiresAt ? (
          <div className={styles['reward-card__expiry-pill']}>
            <Image
              src="/reward-card/icon-clock.svg"
              alt=""
              aria-hidden
              width={14}
              height={14}
            />
            <span className={styles['reward-card__expiry-text']}>{expiresAt}</span>
          </div>
        ) : variant === 'explore' ? (
          <button
            type="button"
            className={styles['reward-card__activate-btn']}
            onClick={onActivate}
            aria-label={`Activate reward: ${description}`}
          >
            Activate
          </button>
        ) : null}
      </div>
    </article>
  );
}

export default RewardCard;
