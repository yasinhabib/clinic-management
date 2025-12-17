import { useQuery, useMutation } from '@apollo/client/react';
import { GET_WORKFLOWS, DELETE_WORKFLOW } from '../graphql/queries';
import { Link } from 'react-router-dom';

export const WorkflowList = () => {
  const { loading, error, data, refetch } = useQuery<any>(GET_WORKFLOWS);
  const [deleteWorkflow] = useMutation(DELETE_WORKFLOW, {
    onCompleted: () => refetch(),
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        await deleteWorkflow({ variables: { id } });
      } catch (error) {
        console.error('Error deleting workflow:', error);
        alert('Failed to delete workflow');
      }
    }
  };

  if (loading) return <p className="text-center">Loading workflows...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Workflows</h2>
        <Link to="/workflows/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Workflow
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL Path</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.workflows.map((workflow: any) => (
              <tr key={workflow.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{workflow.label}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{workflow.url_path}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{workflow.workflow_order}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(workflow.created_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/workflows/edit/${workflow.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(workflow.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};