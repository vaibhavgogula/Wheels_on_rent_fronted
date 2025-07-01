import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, ShieldCheck, UserCog } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

// Mock data
const users = [
  { id: 'u1', name: 'Alex Johnson', email: 'alex@example.com', role: 'renter', status: 'active', avatar: 'https://placehold.co/40x40.png' },
  { id: 'u2', name: 'Maria Garcia', email: 'maria@example.com', role: 'owner', status: 'active', avatar: 'https://placehold.co/40x40.png' },
  { id: 'u3', name: 'David Chen', email: 'david@example.com', role: 'owner', status: 'active', avatar: 'https://placehold.co/40x40.png' },
  { id: 'u4', name: 'Admin User', email: 'admin@wheelsonrent.com', role: 'admin', status: 'active', avatar: 'https://placehold.co/40x40.png' },
  { id: 'u5', name: 'Test User', email: 'test@example.com', role: 'renter', status: 'blocked', avatar: 'https://placehold.co/40x40.png' },
];

export default function UserManagementPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">User Management</CardTitle>
          <CardDescription>View and manage all registered users on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><UserCog className="mr-2 h-4 w-4" /> Edit Role</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><ShieldCheck className="mr-2 h-4 w-4" /> {user.status === 'active' ? 'Block User' : 'Unblock User'}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
