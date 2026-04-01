import RewardsCard from '@/components/molecules/RewardsCard/RewardsCard';

export default function ShowcasePage() {
  return (
    <div style={{ padding: '40px', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'Montserrat, sans-serif', marginBottom: '32px' }}>
        Component Showcase
      </h1>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', marginBottom: '16px' }}>
          RewardsCard
        </h2>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <RewardsCard
            title="Buy 5 Cheetos products to earn 1 for 1¢"
            purchasedCount={2}
            totalCount={5}
            expirationDate="12/31/26"
          />
          <RewardsCard
            title="Buy 3 Doritos to get 1 free"
            purchasedCount={3}
            totalCount={3}
            expirationDate="06/30/26"
          />
          <RewardsCard
            title="Buy 10 Lay's bags to earn a free party size"
            purchasedCount={0}
            totalCount={10}
            expirationDate="03/15/27"
          />
        </div>
      </section>
    </div>
  );
}
