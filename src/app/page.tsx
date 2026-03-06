import React from 'react';
import { Title, Subtitle, FeaturesList, FeatureItem, CTAButton } from '@/components/ui';
import { useQuery } from 'react-query';
import axios from 'axios';

const fetchFeatures = async () => {
  const response = await axios.get('/api/features');
  return response.data;
};

const Page: React.FC = () => {
  const { data: features, error, isLoading } = useQuery('features', fetchFeatures);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error instanceof Error ? error.message : String(error)}</div>;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <Title>Empower Your Data Analysis with Smart Searching Tools</Title>
      <Subtitle>
        Intuitive tools for data scientists to perform smart similarity searches and database updates.
      </Subtitle>
      <FeaturesList>
        {features.map((feature: string, index: number) => (
          <FeatureItem key={index}>{feature}</FeatureItem>
        ))}
      </FeaturesList>
      <CTAButton href="/get-started">Get Started</CTAButton>
    </div>
  );
};

export default Page;