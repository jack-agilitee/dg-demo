'use client';

import Image from 'next/image';
import styles from './RewardsCard.module.scss';

interface RewardsCardProps {
  backgroundImageUrl: string;
  brandLogoUrl: string;
  rewardDescription: string;
  totalPunches: number;
  completedPunches: number;
  expirationDate: string;
  bankedRewards?: number;
  onClick?: () => void;
}

const RewardsCard = ({
  backgroundImageUrl,
  brandLogoUrl,
  rewardDescription,
  totalPunches,
  completedPunches,
  expirationDate,
  bankedRewards,
  onClick,
}: RewardsCardProps) => {
  return (
    <article
      className={styles['rewards-card']}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={rewardDescription}
    >
      {/* Background image */}
      <Image
        className={styles['rewards-card__background']}
        src={backgroundImageUrl}
        alt=""
        fill
        sizes="343px"
        priority
        aria-hidden="true"
      />

      {/* Top row: logo + punch tracker + rewards badge */}
      <div className={styles['rewards-card__top-row']}>
        {/* Brand logo */}
        <div className={styles['rewards-card__logo-wrapper']}>
          <Image
            className={styles['rewards-card__logo']}
            src={brandLogoUrl}
            alt="Brand logo"
            width={48}
            height={30}

          />
        </div>

        {/* Punch tracker column */}
        <div className={styles['rewards-card__tracker']}>
          <div className={styles['rewards-card__punch-group']} role="list" aria-label="Punch progress">
            {Array.from({ length: totalPunches }).map((_, index) => {
              const isFilled = index < completedPunches;
              return (
                <div
                  key={`punch-${index}`}
                  className={styles['rewards-card__punch-circle']}
                  role="listitem"
                  aria-label={isFilled ? 'Purchased' : 'Not yet purchased'}
                >
                  <Image
                    src={
                      isFilled
                        ? '/rewards-card/punch-circle-filled.svg'
                        : '/rewards-card/punch-circle-empty.svg'
                    }
                    alt=""
                    width={16}
                    height={16}
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>

          <span className={styles['rewards-card__tracker-label']}>
            {completedPunches} of {totalPunches} Purchased
          </span>

          {bankedRewards !== undefined && bankedRewards > 0 && (
            <span className={styles['rewards-card__banked']}>
              {bankedRewards} reward{bankedRewards !== 1 ? 's' : ''} banked
            </span>
          )}
        </div>

        {/* Rewards badge */}
        <div className={styles['rewards-card__badge']} aria-label="Rewards">
          <Image
            className={styles['rewards-card__badge-icon']}
            src="/rewards-card/rewards-icon.svg"
            alt=""
            width={16}
            height={16}
            aria-hidden="true"
          />
          <span className={styles['rewards-card__badge-label']}>Rewards</span>
        </div>
      </div>

      {/* Bottom content: description + expiration */}
      <div className={styles['rewards-card__content']}>
        <p className={styles['rewards-card__description']}>{rewardDescription}</p>

        <div className={styles['rewards-card__expiration']} aria-label={`Expires ${expirationDate}`}>
          <Image
            className={styles['rewards-card__expiration-icon']}
            src="/rewards-card/clock-icon.svg"
            alt=""
            width={14}
            height={14}
            aria-hidden="true"
          />
          <span className={styles['rewards-card__expiration-date']}>{expirationDate}</span>
        </div>
      </div>
    </article>
  );
};

export default RewardsCard;
