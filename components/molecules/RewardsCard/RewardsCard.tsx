'use client';

import Image from 'next/image';
import styles from './RewardsCard.module.scss';

interface RewardsCardProps {
  title: string;
  purchasedCount: number;
  totalCount: number;
  expirationDate: string;
  backgroundImage?: string;
  logoSrc?: string;
  onClick?: () => void;
  className?: string;
}

const RewardsCard = ({
  title,
  purchasedCount,
  totalCount,
  expirationDate,
  backgroundImage = '/rewards-card/background.png',
  logoSrc = '/rewards-card/logo.png',
  onClick,
  className = '',
}: RewardsCardProps) => {
  const punches = Array.from({ length: totalCount }, (_, i) => i < purchasedCount);

  return (
    <div
      className={`${styles['rewards-card']} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      <Image
        src={backgroundImage}
        alt=""
        fill
        className={styles['rewards-card__background']}
        priority
      />

      <div className={styles['rewards-card__header']}>
        <div className={styles['rewards-card__logo']}>
          <Image
            src={logoSrc}
            alt="Brand logo"
            width={48}
            height={30}
            className={styles['rewards-card__logo-image']}
          />
        </div>

        <div className={styles['rewards-card__tracker']}>
          <div className={styles['rewards-card__punches']}>
            {punches.map((filled, index) => (
              <div key={index} className={styles['rewards-card__punch']}>
                <Image
                  src={filled ? '/rewards-card/punch-filled.png' : '/rewards-card/punch-empty.png'}
                  alt={filled ? 'Purchased' : 'Not purchased'}
                  width={16}
                  height={16}
                />
              </div>
            ))}
          </div>
          <p className={styles['rewards-card__count-text']}>
            {purchasedCount} of {totalCount} Purchased
          </p>
        </div>

        <div className={styles['rewards-card__rewards-label']}>
          <div className={styles['rewards-card__rewards-icon']}>
            <Image
              src="/rewards-card/rewards-icon-top.png"
              alt=""
              width={16}
              height={16}
            />
          </div>
          <span className={styles['rewards-card__rewards-text']}>Rewards</span>
        </div>
      </div>

      <div className={styles['rewards-card__content']}>
        <p className={styles['rewards-card__title']}>{title}</p>
        <div className={styles['rewards-card__expiration']}>
          <Image
            src="/rewards-card/clock-icon.png"
            alt="Expires"
            width={14}
            height={14}
          />
          <span className={styles['rewards-card__expiration-date']}>
            {expirationDate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RewardsCard;
