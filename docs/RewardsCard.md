# RewardsCard

A punch card molecule component that displays reward program progress, including brand logo, purchase tracker, promotional title, and expiration date.

## Figma Design

[Rewards Phase 2 — Figma](https://www.figma.com/design/QdNa0mQSKgQHvX7ZgQM6NR/Rewards-Phase-2?node-id=16458-15805&m=dev)

## Location

`components/molecules/RewardsCard/RewardsCard.tsx`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | *required* | Promotional text displayed on the card |
| `purchasedCount` | `number` | *required* | Number of items already purchased |
| `totalCount` | `number` | *required* | Total items needed to complete the reward |
| `expirationDate` | `string` | *required* | Expiration date displayed on the badge |
| `backgroundImage` | `string` | `'/rewards-card/background.png'` | Card background image path |
| `logoSrc` | `string` | `'/rewards-card/logo.png'` | Brand logo image path |
| `onClick` | `() => void` | `undefined` | Click handler — makes the card interactive |
| `className` | `string` | `''` | Additional CSS class name |

## Usage

```tsx
import RewardsCard from '@/components/molecules/RewardsCard/RewardsCard';

<RewardsCard
  title="Buy 5 Cheetos products to earn 1 for 1¢"
  purchasedCount={2}
  totalCount={5}
  expirationDate="12/31/26"
  onClick={() => console.log('Card clicked')}
/>
```

## Atomic Design Level

**Molecule** — Composed of multiple atomic elements (images, text, badge) working together as a cohesive unit.

## Accessibility

- When `onClick` is provided, the card receives `role="button"` and `tabIndex={0}`
- Keyboard navigation supported (Enter/Space to activate)
- Focus-visible outline for keyboard users
- All images have appropriate alt text
