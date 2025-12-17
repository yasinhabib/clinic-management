import { useState } from 'react';
import { CREATE_WORKFLOW, GET_WORKFLOWS } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';

export const CreateWorkflow = () => {
  const [label, setLabel] = useState('');
  const [urlPath, setUrlPath] = useState('');
  const [workflowOrder, setWorkflowOrder] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [createWorkflow, { loading }] = useMutation(CREATE_WORKFLOW, {
    refetchQueries: [{ query: GET_WORKFLOWS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWorkflow({
        variables: {
          createWorkflowInput: {
            label,
            url_path: urlPath,
            workflow_order: parseInt(workflowOrder),
          },
        },
      });
      setLabel('');
      setUrlPath('');
      setWorkflowOrder('');
      navigate('/workflows');
    } catch (error) {
      console.error('Error creating workflow:', error);
      alert('Failed to create workflow');
    }
  };

  if (!isAuthenticated) {
    return <p className="text-center text-red-500">Please login to create workflows</p>;
  }

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Workflow</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-2">
            Label
          </label>
          <input
            id="label"
            type="text"
            placeholder="Enter workflow label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="urlPath" className="block text-sm font-medium text-gray-700 mb-2">
            URL Path
          </label>
          <input
            id="urlPath"
            type="text"
            placeholder="Enter URL path"
            value={urlPath}
            onChange={(e) => setUrlPath(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="workflowOrder" className="block text-sm font-medium text-gray-700 mb-2">
            Workflow Order
          </label>
          <input
            id="workflowOrder"
            type="number"
            placeholder="Enter workflow order"
            value={workflowOrder}
            onChange={(e) => setWorkflowOrder(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/workflows')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Workflow'}
          </button>
        </div>
      </form>
    </div>
  );
};