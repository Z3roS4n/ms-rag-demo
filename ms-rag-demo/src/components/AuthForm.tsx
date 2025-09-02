"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn, signUp } from '@/lib/auth-client';
import { Github, Mail } from 'lucide-react';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const result = await signIn.email({
          email,
          password,
        });
        if (result.error) {
          setMessage(result.error.message || 'Login failed');
        }
      } else {
        const result = await signUp.email({
          email,
          password,
          name,
        });
        if (result.error) {
          setMessage(result.error.message || 'Signup failed');
        } else {
          setMessage('Account created successfully! Please sign in.');
          setIsLogin(true);
        }
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signIn.social({
        provider: 'github',
      });
    } catch (error) {
      setMessage('GitHub sign in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isLogin ? 'Sign In' : 'Sign Up'} to MS RAG Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Mail className="h-4 w-4 mr-2" />
              {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGithubSignIn}
          >
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </Button>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {message && (
            <p className={`text-sm text-center ${
              message.includes('success') ? 'text-green-600' : 'text-red-600'
            }`}>
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
