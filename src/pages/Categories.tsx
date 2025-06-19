
import React from 'react';
import { CategoryList } from '../components/CategoryList';

const Categories: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Category Management</h1>
          <p className="text-gray-600">
            Manage interview question categories for organizing and filtering questions.
          </p>
        </div>
        
        <CategoryList />
      </div>
    </div>
  );
};

export default Categories;
