import dynamic from 'next/dynamic';

// Import Grid dynamically to make it a Client Component
const Grid = dynamic(() => import('./grid'), { ssr: false });

export default function GridClient() {
  return <Grid />;
}