'use client';

import Image from 'next/image';
import styles from './RewardsCard.module.scss';

interface RewardsCardProps {
  backgroundSrc: string;
  logoSrc: string;
  totalPunches: number;
  earnedPunches: number;
  promoText: string;
  expirationDate: string;
  onClick?: () => void;
  className?: string;
}

const RewardsCard: React.FC<RewardsCardProps> = ({
  backgroundSrc,
  logoSrc,
  totalPunches,
  earnedPunches,
  promoText,
  expirationDate,
  onClick,
  className = '',
}) => {
  const punches = Array.from({ length: totalPunches }, (_, i) => i < earnedPunches);

  return (
    <div
      className={`${styles['rewards-card']} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick();
            }
          : undefined
      }
    >
      {/* Full-bleed background image */}
      <Image
        src={backgroundSrc}
        alt=""
        fill
        className={styles['rewards-card__background']}
        priority
        aria-hidden="true"
      />

      {/* Top bar: logo | punch tracker | rewards label */}
      <div className={styles['rewards-card__top-bar']}>
        {/* Brand logo */}
        <div className={styles['rewards-card__logo']}>
          <Image
            src={logoSrc}
            alt="Brand logo"
            width={48}
            height={30}
          />
        </div>

        {/* Punch progress tracker */}
        <div className={styles['rewards-card__tracker']}>
          <div className={styles['rewards-card__punch-group']}>
            {punches.map((filled, index) => (
              <div
                key={index}
                className={styles['rewards-card__punch']}
                aria-label={filled ? 'Purchased' : 'Not yet purchased'}
              >
                <Image
                  src={
                    filled
                      ? '/images/rewards-card/item-count-filled.png'
                      : '/images/rewards-card/item-count-empty.png'
                  }
                  alt=""
                  width={16}
                  height={16}
                  aria-hidden="true"
                />
                {filled && (
                  <Image
                    src="/images/rewards-card/item-count-checkmark.png"
                    alt=""
                    width={16}
                    height={16}
                    className={styles['rewards-card__punch-checkmark']}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
          <p className={styles['rewards-card__tracker-text']}>
            {earnedPunches} of {totalPunches} Purchased
          </p>
        </div>

        {/* Rewards label: stacked icon layers + text */}
        <div className={styles['rewards-card__rewards-label']}>
          <div className={styles['rewards-card__rewards-icon']}>
            <Image
              src="/images/rewards-card/rewards-icon-bottom.png"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
            />
            <Image
              src="/images/rewards-card/rewards-icon-top.png"
              alt=""
              width={16}
              height={16}
              className={styles['rewards-card__rewards-icon-top']}
              aria-hidden="true"
            />
          </div>
          <span className={styles['rewards-card__rewards-text']}>Rewards</span>
        </div>
      </div>

      {/* Bottom content: promo text + expiration badge */}
      <div className={styles['rewards-card__content']}>
        <p className={styles['rewards-card__promo-text']}>{promoText}</p>
        <div className={styles['rewards-card__expiry-badge']}>
          <Image
            src="/images/rewards-card/icon-clock.png"
            alt="Expires"
            width={14}
            height={14}
            className={styles['rewards-card__expiry-icon']}
          />
          <span className={styles['rewards-card__expiry-date']}>{expirationDate}</span>
        </div>
      </div>
    </div>
  );
};

export default RewardsCard;
