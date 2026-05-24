'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { useDeleteUser, useEditUser, useGetAllUsers } from '@/hooks/use-admin';
import { EditUser, User } from '@/types/user';
import {
  AlertCircle,
  CheckCircle,
  Edit2,
  MoreVertical,
  Shield,
  Trash2,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminUsersPage() {
  const { data: users, isLoading, isError } = useGetAllUsers();
  const editUserMutation = useEditUser();
  const deleteUserMutation = useDeleteUser();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditUser>({});
  const [editOpen, setEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditOpen = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio ?? '',
      birthday: user.birthday ?? '',
      phone: user.phone ?? '',
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      referralCode: user.referralCode ?? '',
    });
    setEditOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditSwitch = (name: keyof EditUser, value: boolean) => {
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    // Only send fields that have been modified (filter out empty strings and unchanged values)
    const dataToSend: Record<string, any> = {};
    Object.entries(editForm).forEach(([key, value]) => {
      // Include the field if it has a value and it's not an empty string
      if (value !== '' && value !== null && value !== undefined) {
        dataToSend[key] = value;
      }
    });

    editUserMutation.mutate({ id: editingUser._id, data: dataToSend });
    setEditOpen(false);
  };

  const handleDelete = (user: User) => {
    if (window.confirm(`Delete user ${user.name}?`)) {
      deleteUserMutation.mutate({ id: user._id });
    }
  };

  const filteredUsers =
    users?.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'moderator':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-emerald-500' : 'text-slate-400';
  };

  return (
    <div className='p-4 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div
          className='mb-8'
          style={{
            background:
              'linear-gradient(to bottom right, var(--surface-2), var(--surface-3))',
            padding: '2rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
          }}
        >
          <div className='flex items-center gap-3 mb-2'>
            <div
              style={{
                padding: '0.5rem',
                backgroundColor: 'var(--brand)',
                borderRadius: 'calc(var(--radius) - 0.25rem)',
              }}
            >
              <Users
                className='w-6 h-6'
                style={{ color: 'var(--brand-foreground)' }}
              />
            </div>
            <div>
              <h1 className='text-4xl font-bold text-foreground'>
                User Management
              </h1>
              <p className='text-muted-foreground mt-2'>
                {filteredUsers.length}{' '}
                {filteredUsers.length === 1 ? 'user' : 'users'} found
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className='mb-6'>
          <Input
            placeholder='Search by name, email, or username...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full h-12 border-border'
            style={{ borderColor: 'var(--border)' }}
          />
        </div>

        {/* Main Content */}
        <Card
          className='border-border'
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <CardContent className='p-0'>
            {isLoading ? (
              <div className='flex justify-center items-center py-20'>
                <div className='flex flex-col items-center gap-4'>
                  <Spinner
                    className='w-10 h-10'
                    style={{ color: 'var(--brand)' }}
                  />
                  <p className='text-muted-foreground'>Loading users...</p>
                </div>
              </div>
            ) : isError ? (
              <div className='p-12 text-center'>
                <AlertCircle
                  className='w-10 h-10 mx-auto mb-3'
                  style={{ color: 'var(--danger)' }}
                />
                <p className='font-medium' style={{ color: 'var(--danger)' }}>
                  Failed to load users.
                </p>
              </div>
            ) : filteredUsers.length > 0 ? (
              <>
                {/* Desktop View */}
                <div className='hidden lg:block overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr
                        className='border-b border-border'
                        style={{ backgroundColor: 'var(--surface)' }}
                      >
                        <th className='px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider'>
                          User
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider'>
                          Email
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider'>
                          Role
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider'>
                          Status
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider'>
                          Verified
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider'>
                          Last Login
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-foreground uppercase tracking-wider'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-border'>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user._id}
                          className='border-b border-border transition-colors'
                          style={
                            {
                              '--hover-bg': 'var(--surface)',
                            } as React.CSSProperties
                          }
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              'var(--surface)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              'transparent')
                          }
                        >
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-3'>
                              {user.avatar ? (
                                <Image
                                  src={user.avatar.url}
                                  alt={user.name}
                                  width={40}
                                  height={40}
                                  className='rounded-full border border-border'
                                />
                              ) : (
                                <div
                                  className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold'
                                  style={{
                                    backgroundColor: 'var(--brand)',
                                    color: 'var(--brand-foreground)',
                                  }}
                                >
                                  {user.name[0]}
                                </div>
                              )}
                              <div>
                                <p className='font-medium text-foreground'>
                                  {user.name}
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                  @{user.username}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 text-foreground text-sm'>
                            {user.email}
                          </td>
                          <td className='px-6 py-4'>
                            <Badge
                              variant={getRoleBadgeVariant(user.role)}
                              style={
                                user.role === 'admin'
                                  ? {
                                      backgroundColor: 'var(--brand)',
                                      color: 'var(--brand-foreground)',
                                    }
                                  : undefined
                              }
                            >
                              {user.role === 'admin' && (
                                <Shield className='w-3 h-3 mr-1' />
                              )}
                              {user.role}
                            </Badge>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-2'>
                              <div
                                className='w-2 h-2 rounded-full'
                                style={{
                                  backgroundColor: user.isActive
                                    ? 'var(--success)'
                                    : 'var(--muted)',
                                }}
                              ></div>
                              <span
                                className='text-sm font-medium'
                                style={{
                                  color: user.isActive
                                    ? 'var(--success)'
                                    : 'var(--muted-foreground)',
                                }}
                              >
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-2'>
                              {user.isEmailVerified ? (
                                <CheckCircle
                                  className='w-4 h-4'
                                  style={{ color: 'var(--success)' }}
                                />
                              ) : (
                                <AlertCircle
                                  className='w-4 h-4'
                                  style={{ color: 'var(--warning)' }}
                                />
                              )}
                              <span className='text-sm text-foreground'>
                                {user.isEmailVerified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                          </td>
                          <td className='px-6 py-4 text-sm text-foreground'>
                            {user.lastLogin
                              ? new Date(user.lastLogin).toLocaleDateString()
                              : '-'}
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-2'>
                              <Button
                                size='sm'
                                variant='outline'
                                className='h-8 border-border text-xs'
                                asChild
                              >
                                <Link href={`/admin/users/${user._id}`}>
                                  View Details
                                </Link>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    className='h-8 w-8 p-0'
                                    style={
                                      {
                                        '--tw-ring-color': 'var(--ring)',
                                      } as React.CSSProperties
                                    }
                                  >
                                    <MoreVertical className='h-4 w-4 text-muted-foreground' />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                  <DropdownMenuItem
                                    onClick={() => handleEditOpen(user)}
                                    className='cursor-pointer'
                                  >
                                    <Edit2 className='w-4 h-4 mr-2' />
                                    Edit User
                                  </DropdownMenuItem>
                                  {user.role !== 'admin' && (
                                    <DropdownMenuItem
                                      onClick={() => handleDelete(user)}
                                      className='cursor-pointer'
                                      style={{ color: 'var(--danger)' }}
                                    >
                                      <Trash2 className='w-4 h-4 mr-2' />
                                      Delete User
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View - Card Layout */}
                <div className='lg:hidden space-y-4 p-4'>
                  {filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      className='border border-border rounded-lg p-4 transition-colors'
                      style={
                        {
                          backgroundColor: 'var(--surface)',
                          '--hover-bg': 'var(--surface-2)',
                        } as React.CSSProperties
                      }
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          'var(--surface-2)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          'var(--surface)')
                      }
                    >
                      <div className='flex items-start justify-between gap-4 mb-4'>
                        <div className='flex items-start gap-3 flex-1'>
                          {user.avatar ? (
                            <Image
                              src={user.avatar.url}
                              alt={user.name}
                              width={40}
                              height={40}
                              className='rounded-full border border-border flex-shrink-0'
                            />
                          ) : (
                            <div className='w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0'>
                              {user.name[0]}
                            </div>
                          )}
                          <div className='min-w-0'>
                            <p className='font-medium text-foreground truncate'>
                              {user.name}
                            </p>
                            <p className='text-xs text-muted-foreground truncate'>
                              @{user.username}
                            </p>
                            <p className='text-xs text-muted-foreground truncate'>
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={getRoleBadgeVariant(user.role)}
                          style={
                            user.role === 'admin'
                              ? {
                                  backgroundColor: 'var(--brand)',
                                  color: 'var(--brand-foreground)',
                                }
                              : undefined
                          }
                          className='flex-shrink-0'
                        >
                          {user.role === 'admin' && (
                            <Shield className='w-3 h-3 mr-1' />
                          )}
                          {user.role}
                        </Badge>
                      </div>

                      <div className='grid grid-cols-2 gap-3 mb-4'>
                        <div>
                          <p className='text-xs text-muted-foreground mb-1'>
                            Status
                          </p>
                          <div className='flex items-center gap-2'>
                            <div
                              className='w-2 h-2 rounded-full'
                              style={{
                                backgroundColor: user.isActive
                                  ? 'var(--success)'
                                  : 'var(--muted)',
                              }}
                            ></div>
                            <span
                              className='text-sm font-medium'
                              style={{
                                color: user.isActive
                                  ? 'var(--success)'
                                  : 'var(--muted-foreground)',
                              }}
                            >
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className='text-xs text-muted-foreground mb-1'>
                            Email
                          </p>
                          <div className='flex items-center gap-2'>
                            {user.isEmailVerified ? (
                              <CheckCircle
                                className='w-4 h-4'
                                style={{ color: 'var(--success)' }}
                              />
                            ) : (
                              <AlertCircle
                                className='w-4 h-4'
                                style={{ color: 'var(--warning)' }}
                              />
                            )}
                            <span className='text-sm text-foreground'>
                              {user.isEmailVerified ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='text-xs text-muted-foreground mb-4'>
                        Last Login:{' '}
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : '-'}
                      </div>

                      <div className='flex flex-col gap-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          className='w-full'
                          asChild
                        >
                          <Link href={`/admin/users/${user._id}`}>
                            View Details
                          </Link>
                        </Button>
                        <div className='flex gap-2'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => handleEditOpen(user)}
                            className='flex-1'
                          >
                            <Edit2 className='w-4 h-4 mr-2' />
                            Edit
                          </Button>
                          {user.role !== 'admin' && (
                            <Button
                              size='sm'
                              onClick={() => handleDelete(user)}
                              disabled={deleteUserMutation.status === 'pending'}
                              className='flex-1'
                              style={{
                                backgroundColor: 'var(--danger)',
                                color: 'var(--foreground)',
                              }}
                            >
                              <Trash2 className='w-4 h-4 mr-2' />
                              Delete
                            </Button>
                          )}
                          {user.role === 'admin' && (
                            <div
                              className='flex-1 flex items-center justify-center text-xs text-muted-foreground rounded px-3 py-2'
                              style={{ backgroundColor: 'var(--surface-2)' }}
                            >
                              Admin - Delete disabled
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className='p-16 text-center'>
                <Users
                  className='w-12 h-12 mx-auto mb-4'
                  style={{ color: 'var(--muted-foreground)' }}
                />
                <p className='text-muted-foreground text-lg'>No users found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent
            className='max-w-md max-h-[90vh] flex flex-col border-border'
            style={{ backgroundColor: 'var(--card)' }}
          >
            <DialogHeader
              style={{
                borderBottom: '1px solid var(--border)',
                paddingBottom: '1rem',
              }}
            >
              <DialogTitle className='text-2xl font-bold text-foreground'>
                Edit User
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleEditSubmit}
              className='space-y-5 overflow-y-auto flex-1 pr-4 py-4'
            >
              <div>
                <Label className='m-2' htmlFor='name'>
                  Name
                </Label>
                <Input
                  name='name'
                  value={editForm.name || ''}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <Label className='m-2' htmlFor='email'>
                  Email
                </Label>
                <Input
                  name='email'
                  value={editForm.email || ''}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <Label className='m-2' htmlFor='username'>
                  Username
                </Label>
                <Input
                  name='username'
                  value={editForm.username || ''}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <Label className='m-2' htmlFor='role'>
                  Role
                </Label>
                <select
                  name='role'
                  value={editForm.role || ''}
                  onChange={handleEditChange}
                  className='w-full bg-input border border-border rounded-md px-3 py-2 text-foreground'
                >
                  <option value='user'>User</option>
                  <option value='admin'>Admin</option>
                  <option value='moderator'>Moderator</option>
                </select>
              </div>
              <div>
                <Label className='m-2' htmlFor='bio'>
                  Bio
                </Label>
                <Input
                  name='bio'
                  value={editForm.bio || ''}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <Label className='m-2' htmlFor='phone'>
                  Phone
                </Label>
                <Input
                  name='phone'
                  value={editForm.phone || ''}
                  onChange={handleEditChange}
                />
              </div>
              <div className='flex items-center justify-between p-3 bg-muted rounded'>
                <Label className='m-2' htmlFor='isActive'>
                  Active
                </Label>
                <Switch
                  checked={!!editForm.isActive}
                  className='data-[state=checked]:bg-brand cursor-pointer'
                  onCheckedChange={(val) => handleEditSwitch('isActive', val)}
                />
              </div>
            </form>
            <DialogFooter className='mt-6 border-t border-border pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setEditOpen(false)}
                className='border-border'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={editUserMutation.status === 'pending'}
                onClick={handleEditSubmit}
                style={{
                  backgroundColor: 'var(--brand)',
                  color: 'var(--brand-foreground)',
                }}
                className='hover:opacity-90'
              >
                {editUserMutation.status === 'pending' ? (
                  <>
                    <Spinner
                      className='w-4 h-4 mr-2'
                      style={{ color: 'var(--brand-foreground)' }}
                    />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
