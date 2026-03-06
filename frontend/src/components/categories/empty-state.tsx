import { Inbox } from 'lucide-react';

export function EmptyState() {
  return (
    <div className='px-6 md:px-12 lg:px-16 pb-16'>
      <div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
        <div className='mb-6 p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full'>
          <Inbox className='w-12 h-12 text-primary/60' />
        </div>

        <h3 className='text-2xl font-bold text-foreground mb-2'>
          No categories yet
        </h3>

        <p className='text-muted-foreground max-w-md mb-6'>
          Create your first category to get started organizing your products and
          content.
        </p>
      </div>
    </div>
  );
}
