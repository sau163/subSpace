
import { useState } from 'react';
import { useAuthenticationStatus, useSignInEmailPassword, useSignOut } from '@nhost/react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInEmailPassword } = useSignInEmailPassword(); // Use function directly
  const { isAuthenticated } = useAuthenticationStatus(); // Authentication status
 
  const navigate = useNavigate();
  const { signOut } = useSignOut();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await signOut();
    try {
      // Attempt login
      const { error } = await signInEmailPassword(email, password);

      if (error) {
        // Handle login failure
        toast.error(error.message || 'Failed to log in. Please try again.');
      } else {
        // On successful login, navigate to the home page
        toast.success('Logged in successfully');
        navigate('/');
      }
    } catch (err) {
      // Handle unexpected errors
      console.error('Unexpected error during login:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm sm:text-sm"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
