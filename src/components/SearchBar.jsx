
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticationStatus } from '@nhost/react';
import { getVideoSummary, extractVideoId } from '../utils/api';
import toast from 'react-hot-toast';
import { nhost } from '../main';
import PropTypes from 'prop-types';

export default function SearchBar({ onNewSummary }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthenticationStatus();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to use the summarizer');
      navigate('/login');
      return;
    }

    const videoId = extractVideoId(url);

    if (!videoId) {
      toast.error('Invalid YouTube URL');
      return;
    }

    setLoading(true);
    try {
      const summary = await getVideoSummary(videoId);
      const summaryData = {
        ...summary,
        metadata: summary.metadata,
        summary: summary.gptSummary,
      };
      
      // First update the state through the callback
      onNewSummary(summaryData);
      // Then store in localStorage
      localStorage.setItem('currentSummary', JSON.stringify(summaryData));

      const { error } = await nhost.graphql.request(
        `
        mutation InsertSummary(
          $user_id: uuid!,
          $title: String!,
          $video_id: String!,
          $metadata: jsonb!,
          $summary: String!,
        ) {
          insert_summaries_one(
            object: {
              user_id: $user_id,
              title: $title,
              video_id: $video_id,
              metadata: $metadata,
              summary: $summary,
            }
          ) {
            id
          }
        }
        `,
        {
          user_id: nhost.auth.getUser().id,
          title: summary.metadata.title || "Untitled",
          video_id: videoId,
          metadata: summary.metadata,
          summary: summary.gptSummary,
        }
      );

      if (error) {
        console.error('GraphQL Error:', error);
        throw error;
      }

      toast.success('Video summarized successfully');
      setUrl('');
    } catch (error) {
      console.error('Error during mutation:', error);
      toast.error('Failed to summarize video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube video URL here"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Summarize'}
        </button>
      </div>
    </form>
  );
}

SearchBar.propTypes = {
  onNewSummary: PropTypes.func.isRequired,
};