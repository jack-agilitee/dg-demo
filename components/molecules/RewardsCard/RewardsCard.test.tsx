import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RewardsCard from './RewardsCard';

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

// next/image is mocked with a plain <img> so src assertions work without the
// Next.js image optimisation pipeline. Next-specific props (fill, priority,
// quality, placeholder, blurDataURL, unoptimized, onLoad, onError, loader)
// are stripped before forwarding to avoid React DOM unknown-prop warnings.
jest.mock('next/image', () => {
  const NEXT_IMAGE_ONLY_PROPS = new Set([
    'fill',
    'priority',
    'quality',
    'placeholder',
    'blurDataURL',
    'unoptimized',
    'onLoad',
    'onError',
    'loader',
    'sizes',
    'overrideSrc',
  ]);

  const MockImage = ({
    src,
    alt,
    ...rest
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => {
    const domProps = Object.fromEntries(
      Object.entries(rest).filter(([key]) => !NEXT_IMAGE_ONLY_PROPS.has(key))
    );
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...domProps} />;
  };

  MockImage.displayName = 'MockNextImage';
  return MockImage;
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const defaultProps = {
  backgroundSrc: '/images/bg.jpg',
  logoSrc: '/images/logo.png',
  totalPunches: 5,
  earnedPunches: 2,
  promoText: 'Buy 5 get 1 free',
  expirationDate: 'Exp 12/31/2025',
};

type CardOverrides = Partial<typeof defaultProps> & {
  onClick?: () => void;
  className?: string;
};

const renderCard = (overrides: CardOverrides = {}) =>
  render(<RewardsCard {...defaultProps} {...overrides} />);

// Collect raw getAttribute('src') values from ALL <img> elements in the
// container, including those with aria-hidden="true" which are invisible to
// getAllByRole. Bypasses the accessibility tree entirely.
const allImgSrcs = (container: HTMLElement): string[] =>
  Array.from(container.querySelectorAll('img')).map(
    (img) => img.getAttribute('src') ?? ''
  );

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RewardsCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  describe('Rendering', () => {
    it('renders without crashing when given all required props', () => {
      renderCard();
      expect(screen.getByText('Buy 5 get 1 free')).toBeInTheDocument();
    });

    it('displays the promo text', () => {
      renderCard({ promoText: 'Spend $10 get a free drink' });
      expect(screen.getByText('Spend $10 get a free drink')).toBeInTheDocument();
    });

    it('displays the expiration date', () => {
      renderCard({ expirationDate: 'Exp 06/30/2026' });
      expect(screen.getByText('Exp 06/30/2026')).toBeInTheDocument();
    });

    it('renders the static "Rewards" label', () => {
      renderCard();
      expect(screen.getByText('Rewards')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  describe('Punch tracking', () => {
    it('renders the correct total number of punch indicators', () => {
      renderCard({ totalPunches: 5, earnedPunches: 0 });
      // Each punch wrapper div carries an aria-label of "Purchased" or
      // "Not yet purchased" — this is the public API we test against.
      const allPunches = screen.getAllByLabelText(/Purchased|Not yet purchased/i);
      expect(allPunches).toHaveLength(5);
    });

    it('marks the correct number of punches as filled', () => {
      renderCard({ totalPunches: 5, earnedPunches: 3 });
      expect(screen.getAllByLabelText('Purchased')).toHaveLength(3);
      expect(screen.getAllByLabelText('Not yet purchased')).toHaveLength(2);
    });

    it('marks zero punches as filled when earnedPunches is 0', () => {
      renderCard({ totalPunches: 4, earnedPunches: 0 });
      expect(screen.queryAllByLabelText('Purchased')).toHaveLength(0);
      expect(screen.getAllByLabelText('Not yet purchased')).toHaveLength(4);
    });

    it('marks all punches as filled when earnedPunches equals totalPunches', () => {
      renderCard({ totalPunches: 3, earnedPunches: 3 });
      expect(screen.getAllByLabelText('Purchased')).toHaveLength(3);
      expect(screen.queryAllByLabelText('Not yet purchased')).toHaveLength(0);
    });

    it('renders a single punch when totalPunches is 1', () => {
      renderCard({ totalPunches: 1, earnedPunches: 0 });
      const allPunches = screen.getAllByLabelText(/Purchased|Not yet purchased/i);
      expect(allPunches).toHaveLength(1);
    });

    it('shows the filled punch image for earned punches', () => {
      const { container } = renderCard({ totalPunches: 2, earnedPunches: 1 });
      const srcs = allImgSrcs(container);
      expect(srcs.some((s) => s.includes('item-count-filled.png'))).toBe(true);
    });

    it('shows the empty punch image for unearned punches', () => {
      const { container } = renderCard({ totalPunches: 2, earnedPunches: 1 });
      const srcs = allImgSrcs(container);
      expect(srcs.some((s) => s.includes('item-count-empty.png'))).toBe(true);
    });

    it('renders a checkmark image for each filled punch', () => {
      const { container } = renderCard({ totalPunches: 3, earnedPunches: 2 });
      const srcs = allImgSrcs(container);
      const checkmarks = srcs.filter((s) => s.includes('item-count-checkmark.png'));
      // One checkmark per filled punch
      expect(checkmarks).toHaveLength(2);
    });

    it('renders no checkmark images when earnedPunches is 0', () => {
      const { container } = renderCard({ totalPunches: 3, earnedPunches: 0 });
      const srcs = allImgSrcs(container);
      const checkmarks = srcs.filter((s) => s.includes('item-count-checkmark.png'));
      expect(checkmarks).toHaveLength(0);
    });

    it('shows the "X of Y Purchased" count text', () => {
      renderCard({ totalPunches: 6, earnedPunches: 4 });
      expect(screen.getByText('4 of 6 Purchased')).toBeInTheDocument();
    });

    it('shows "0 of Y Purchased" when earnedPunches is 0', () => {
      renderCard({ totalPunches: 5, earnedPunches: 0 });
      expect(screen.getByText('0 of 5 Purchased')).toBeInTheDocument();
    });

    it('shows "Y of Y Purchased" when all punches are earned', () => {
      renderCard({ totalPunches: 5, earnedPunches: 5 });
      expect(screen.getByText('5 of 5 Purchased')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  describe('Images', () => {
    it('renders the background image with the provided backgroundSrc', () => {
      const { container } = renderCard({ backgroundSrc: '/images/custom-bg.jpg' });
      const srcs = allImgSrcs(container);
      expect(srcs.some((s) => s.includes('custom-bg.jpg'))).toBe(true);
    });

    it('renders the logo image with the provided logoSrc', () => {
      renderCard({ logoSrc: '/images/custom-logo.png' });
      // The logo image has a descriptive alt text so it is accessible.
      const logoImage = screen.getByAltText('Brand logo');
      expect(logoImage.getAttribute('src')).toContain('custom-logo.png');
    });

    it('renders the clock icon with its descriptive alt text', () => {
      renderCard();
      expect(screen.getByAltText('Expires')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  describe('onClick interaction', () => {
    it('calls onClick when the card is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      renderCard({ onClick: handleClick });
      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Enter is pressed on the card', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      renderCard({ onClick: handleClick });
      const card = screen.getByRole('button');
      card.focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Space is pressed on the card', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      renderCard({ onClick: handleClick });
      const card = screen.getByRole('button');
      card.focus();
      await user.keyboard('{ }');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when a non-activating key is pressed', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      renderCard({ onClick: handleClick });
      const card = screen.getByRole('button');
      card.focus();
      await user.keyboard('{ArrowDown}');
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not throw when onClick is not provided and the card is clicked', async () => {
      const user = userEvent.setup();
      // No onClick — the wrapper has no role="button"
      renderCard();
      const promoText = screen.getByText('Buy 5 get 1 free');
      await expect(user.click(promoText)).resolves.toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  describe('Accessibility attributes', () => {
    it('has role="button" when onClick is provided', () => {
      renderCard({ onClick: jest.fn() });
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('does not have role="button" when onClick is omitted', () => {
      renderCard();
      expect(screen.queryByRole('button')).toBeNull();
    });

    it('has tabIndex=0 when onClick is provided', () => {
      renderCard({ onClick: jest.fn() });
      expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '0');
    });

    it('does not have a tabIndex when onClick is omitted', () => {
      const { container } = renderCard();
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).not.toHaveAttribute('tabIndex');
    });

    it('each punch indicator has an aria-label describing its state', () => {
      renderCard({ totalPunches: 3, earnedPunches: 1 });
      expect(screen.getByLabelText('Purchased')).toBeInTheDocument();
      expect(screen.getAllByLabelText('Not yet purchased')).toHaveLength(2);
    });
  });

  // -------------------------------------------------------------------------
  describe('className prop', () => {
    it('applies a custom className to the card wrapper', () => {
      const { container } = renderCard({ className: 'my-custom-class' });
      expect(container.firstChild).toHaveClass('my-custom-class');
    });

    it('still applies the base module class alongside the custom className', () => {
      const { container } = renderCard({ className: 'extra' });
      const wrapper = container.firstChild as HTMLElement;
      // identity-obj-proxy returns CSS Module class names as the literal
      // key string (e.g. "rewards-card"), which is visible in className.
      expect(wrapper.className).toContain('rewards-card');
      expect(wrapper.className).toContain('extra');
    });

    it('renders without error when className is not provided (uses default empty string)', () => {
      renderCard();
      expect(screen.getByText('Buy 5 get 1 free')).toBeInTheDocument();
    });
  });
});
