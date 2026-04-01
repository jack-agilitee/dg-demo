// Shared Next.js mocks for Jest
// This single file replaces separate __mocks__/next/* files

import React from 'react';

// next/image — renders a plain <img>, strips Next.js-specific props
const NEXT_IMAGE_PROPS = new Set(['fill', 'priority', 'sizes', 'quality', 'placeholder', 'blurDataURL', 'loader', 'unoptimized']);
function MockImage(props: Record<string, unknown>) {
  const imgProps: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (!NEXT_IMAGE_PROPS.has(k)) imgProps[k] = v;
  }
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...(imgProps as React.ImgHTMLAttributes<HTMLImageElement>)} />;
}
export default MockImage;
export { MockImage as Image };

// next/link — renders a plain <a>
export function Link({ children, href, ...rest }: { children: React.ReactNode; href: string; [key: string]: unknown }) {
  return <a href={href} {...rest}>{children}</a>;
}

// next/font/google — stub that returns empty class/variable
export function Montserrat() {
  return { className: 'mock-font', variable: '--font-mock', style: { fontFamily: 'mock' } };
}
export function Inter() {
  return { className: 'mock-font', variable: '--font-mock', style: { fontFamily: 'mock' } };
}
export function Geist() {
  return { className: 'mock-font', variable: '--font-mock', style: { fontFamily: 'mock' } };
}
export function Geist_Mono() {
  return { className: 'mock-font', variable: '--font-mock', style: { fontFamily: 'mock' } };
}
