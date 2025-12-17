import { useQuery, useMutation } from '@apollo/client/react';
import { GET_WORKFLOWS, DELETE_WORKFLOW, UPDATE_WORKFLOW_ORDER } from '../graphql/queries';
import { Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useEffect } from 'react';

interface SortableRowProps {
  workflow: any;
  onDelete: (id: number) => void;
}

const SortableRow = ({ workflow, onDelete }: SortableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: workflow.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-move">
        <span className="mr-2">⋮⋮</span>
        {workflow.label}
      </td>
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
          onClick={() => onDelete(workflow.id)}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export const WorkflowList = () => {
  const { loading, error, data, refetch } = useQuery<any>(GET_WORKFLOWS);
  const [deleteWorkflow] = useMutation(DELETE_WORKFLOW, {
    onCompleted: () => refetch(),
  });
  const [updateWorkflowOrder] = useMutation(UPDATE_WORKFLOW_ORDER);
  const [workflows, setWorkflows] = useState<any[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update local state when data changes
  useEffect(() => {
    if (data?.workflows) {
      setWorkflows(data.workflows);
    }
  }, [data]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = workflows.findIndex((workflow) => workflow.id === active.id);
      const newIndex = workflows.findIndex((workflow) => workflow.id === over.id);

      const newWorkflows = arrayMove(workflows, oldIndex, newIndex);
      setWorkflows(newWorkflows);

      // Update orders in backend
      for (let i = 0; i < newWorkflows.length; i++) {
        const workflow = newWorkflows[i];
        if (workflow.workflow_order !== i + 1) {
          try {
            await updateWorkflowOrder({
              variables: { id: Number(workflow.id), workflow_order: i + 1 },
            });
          } catch (error) {
            console.error('Error updating workflow order:', error);
          }
        }
      }

      refetch();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        await deleteWorkflow({ variables: { id: Number(id) } });
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
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
            <SortableContext items={workflows.map(w => w.id)} strategy={verticalListSortingStrategy}>
              <tbody className="bg-white divide-y divide-gray-200">
                {workflows.map((workflow: any) => (
                  <SortableRow key={workflow.id} workflow={workflow} onDelete={handleDelete} />
                ))}
              </tbody>
            </SortableContext>
          </table>
        </DndContext>
      </div>
    </div>
  );
};