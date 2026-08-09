import GalleryClientPage from './GalleryClientPage';

export async function generateStaticParams() {
  return [
    { branch: 'lagos' },
    { branch: 'abuja' },
    { branch: 'portharcourt' },
  ];
}

export default function Page({ params }) {
  return <GalleryClientPage params={params} />;
}
