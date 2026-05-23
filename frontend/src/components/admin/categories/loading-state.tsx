import { Spinner } from '@/components/ui/spinner';

export function LoadingState() {
  return (
    <div className='px-6 md:px-12 lg:px-16 py-20'>
      <div className='flex flex-col items-center justify-center min-h-[400px]'>
        <Spinner className='w-12 h-12 text-brand/60 mb-4' />
        <p className='text-muted-foreground font-medium'>
          Loading categories...
        </p>
      </div>
    </div>
  );
}
