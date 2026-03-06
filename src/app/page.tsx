import React from 'react';

const features = [
  'Intelligent similarity search algorithms designed for niche databases.',
  'User-friendly interface for non-expert users to easily input queries.',
  'Batch update functionality to modify multiple database entries in one go.',
  'Export options for similarity results in various formats (e.g., CSV, JSON).',
  'Basic analytics dashboard to visualize search results and updates.',
];

const Page: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Empower Your Data Analysis with Smart Searching Tools</h1>
        <p className="mt-2 text-lg text-gray-700">Intuitive tools for data scientists to perform smart similarity searches and database updates.</p>
      </header>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800">Key Features</h2>
        <ul className="mt-4 list-disc list-inside">
          {features.map((feature, index) => (
            <li key={index} className="text-gray-600">{feature}</li>
          ))}
        </ul>
      </section>

      <footer className="text-center mt-10">
        <p className="text-gray-500">© {new Date().getFullYear()} DataSpark. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Page;