import { useCreateCollection, useUpdateCollection } from '@/hooks/use-collection';

export const useCollectionActions = () => {
  const create = useCreateCollection();
  const update = useUpdateCollection();

  return {
    createCollection: create.mutate,
    isCreating: create.isPending,
    updateCollection: update.mutate,
    isUpdating: update.isPending,
  };
};
