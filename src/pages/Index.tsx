
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, Users, Lock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Secure Authentication System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A modern, secure authentication platform with advanced session management and administrative controls.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Secure Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Multi-factor authentication with Google OAuth integration for enhanced security.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Session Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor and control active sessions across all devices with real-time insights.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive user management with role-based access control and analytics.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
