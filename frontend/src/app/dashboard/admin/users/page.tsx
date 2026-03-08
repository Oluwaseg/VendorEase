'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useGetAllUsers } from '@/hooks/use-admin';
import Image from 'next/image';

export default function AdminUsersPage() {
  const { data: users, isLoading, isError } = useGetAllUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex justify-center py-10'>
            <Spinner className='size-6' />
          </div>
        ) : isError ? (
          <div className='text-destructive'>Failed to load users.</div>
        ) : users && users.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='min-w-full border rounded-xl text-sm'>
              <thead className='bg-muted'>
                <tr>
                  <th className='px-4 py-2 text-left'>Avatar</th>
                  <th className='px-4 py-2 text-left'>Name</th>
                  <th className='px-4 py-2 text-left'>Username</th>
                  <th className='px-4 py-2 text-left'>Email</th>
                  <th className='px-4 py-2 text-left'>Role</th>
                  <th className='px-4 py-2 text-left'>Status</th>
                  <th className='px-4 py-2 text-left'>Email Verified</th>
                  <th className='px-4 py-2 text-left'>Last Login</th>
                  <th className='px-4 py-2 text-left'>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className='border-b last:border-none'>
                    <td className='px-4 py-2'>
                      {user.avatar ? (
                        <Image
                          src={user.avatar.url}
                          alt={user.name}
                          width={32}
                          height={32}
                          className='rounded-full border'
                        />
                      ) : (
                        <div className='size-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground'>
                          {user.name[0]}
                        </div>
                      )}
                    </td>
                    <td className='px-4 py-2 font-medium'>{user.name}</td>
                    <td className='px-4 py-2'>{user.username}</td>
                    <td className='px-4 py-2'>{user.email}</td>
                    <td className='px-4 py-2'>
                      <Badge
                        variant={
                          user.role === 'admin'
                            ? 'destructive'
                            : user.role === 'moderator'
                              ? 'secondary'
                              : 'default'
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className='px-4 py-2'>
                      <Badge variant={user.isActive ? 'default' : 'outline'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className='px-4 py-2'>
                      <Badge
                        variant={user.isEmailVerified ? 'default' : 'outline'}
                      >
                        {user.isEmailVerified ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td className='px-4 py-2 text-xs'>
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString()
                        : '-'}
                    </td>
                    <td className='px-4 py-2 text-xs'>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='text-muted-foreground'>No users found.</div>
        )}
      </CardContent>
    </Card>
  );
}
