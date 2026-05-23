import { Inbox } from 'lucide-react';

export function EmptyState() {
  return (
    <div className='px-6 md:px-12 lg:px-16 py-20'>
      <div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
        <div className='mb-6 p-4 bg-gradient-to-br from-brand/10 to-brand/5 rounded-full ring-1 ring-brand/20'>
          <Inbox className='w-12 h-12 text-brand/60' />
        </div>

        <h3 className='text-2xl font-bold text-foreground mb-2'>
          No categories yet
        </h3>

        <p className='text-muted-foreground max-w-md leading-relaxed'>
          Create your first category to get started organizing your products and
          content.
        </p>
      </div>
    </div>
  );
}
