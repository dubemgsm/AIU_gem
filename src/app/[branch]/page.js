import BranchClientPage from './BranchClientPage';

export async function generateStaticParams() {
  return [
    { branch: 'lagos' },
    { branch: 'abuja' },
    { branch: 'portharcourt' },
  ];
}

export default function Page({ params }) {
  return <BranchClientPage params={params} />;
}
