
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuthenticationStatus, useUserData } from '@nhost/react';
import { nhost } from '../main';
import { Clock, Loader } from 'lucide-react';

export default function Sidebar({ onSelectChat }) {
  const { isAuthenticated } = useAuthenticationStatus();
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useUserData();

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await nhost.graphql.request(`
          query GetSummaries {
            summaries(
              where: { user_id: { _eq: "${user.id}" } }
              order_by: { created_at: desc }
            ) {
              id
              title
              metadata
              summary
              created_at
            }
          }
        `);

        if (error) {
          console.error('GraphQL Error:', error);
          return;
        }

        setChatHistory(data.summaries);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <aside className="w-64 bg-gray-50 h-screen p-4">
        <div className="flex items-center justify-center h-full">
          <Loader className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-gray-50 h-[calc(100vh-64px)] overflow-y-auto border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          History
        </h2>
        {chatHistory.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No summaries yet</p>
            <p className="text-gray-400 text-xs mt-2">
              Paste a YouTube URL above to get started
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {chatHistory.map((summary) => (
              <button
                key={summary.id}
                onClick={() => onSelectChat({
                  ...summary,
                  metadata: typeof summary.metadata === 'string'
                    ? JSON.parse(summary.metadata)
                    : summary.metadata,
                })}
                className="w-full p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer text-left transition-colors border border-gray-200 hover:border-gray-300"
              >
                <h3 className="font-medium text-sm truncate">{summary.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(summary.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  onSelectChat: PropTypes.func.isRequired,
};