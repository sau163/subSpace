
import { Disclosure } from '@headlessui/react';
import { useAuthenticationStatus, useSignOut } from '@nhost/react';

export default function Header() {
  const { isAuthenticated } = useAuthenticationStatus();
  const { signOut } = useSignOut();

  const handleLogout = async () => {
    await signOut(); 
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center justify-between">
                <div className="flex-shrink-0">
                  <h1 className="text-white text-xl font-bold">YouTube Summarizer</h1>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {isAuthenticated ? (
                      <>
                        <button
                          onClick={handleLogout}
                          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <a
                        href="/login"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Login
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
