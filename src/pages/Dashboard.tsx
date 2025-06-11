
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Clock, Shield, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Here's an overview of your account activity.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </Badge>
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Since</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDate(user.createdAt)}</div>
              <p className="text-xs text-muted-foreground">
                Account creation date
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Login</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.lastLogin ? formatDateTime(user.lastLogin) : 'First time'}
              </div>
              <p className="text-xs text-muted-foreground">
                Recent activity
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Protected</div>
              <p className="text-xs text-muted-foreground">
                All systems secure
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your account and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/sessions">
                  <Activity className="mr-2 h-4 w-4" />
                  Manage Sessions
                </Link>
              </Button>
              {user.role === 'admin' && (
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Role:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Account ID:</span>
                <span className="text-sm text-muted-foreground font-mono">{user.id}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
