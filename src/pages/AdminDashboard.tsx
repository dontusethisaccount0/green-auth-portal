
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Search, Users, Shield, Eye, UserX } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { getAllUsers, deleteUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      toast({
        title: "Failed to load users",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      try {
        await deleteUser(userId);
        toast({
          title: "User deleted",
          description: `${userName} has been successfully deleted.`,
        });
        loadUsers(); // Refresh the list
      } catch (error) {
        toast({
          title: "Failed to delete user",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const stats = {
    totalUsers: users.length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    activeUsers: users.filter(u => u.lastLogin).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, roles, and monitor system activity.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered accounts
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.adminUsers}</div>
              <p className="text-xs text-muted-foreground">
                Admin accounts
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Have logged in before
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Search and manage user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={user.role === 'admin' ? 'default' : 'secondary'}
                          className={user.role === 'admin' ? 'bg-primary' : 'bg-green-100 text-green-700'}
                        >
                          {user.role === 'admin' ? 'Administrator' : 'User'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Joined {formatDate(user.createdAt)}
                        </span>
                        {user.lastLogin && (
                          <span className="text-xs text-muted-foreground">
                            • Last login {formatDate(user.lastLogin)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/admin/user/${user.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'No users match your search criteria.' : 'No users available.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
