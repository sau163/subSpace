import axios from 'axios';
import { nhost } from '../main';

const N8N_WEBHOOK = 'https://sau163.app.n8n.cloud/webhook/ytube';

export const getVideoSummary = async (videoId) => {
  try {
    const response = await axios.post(N8N_WEBHOOK, { videoId });
    const summary = response.data;

    // Store the summary in the database
    await nhost.graphql.request(`
      mutation InsertSummary($videoId: String!, $title: String!, $summary: String!, $metadata: jsonb!) {
        insert_summaries_one(object: {
          video_id: $videoId,
          title: $title,
          summary: $summary,
          metadata: $metadata,
          user_id: $auth.uid()
        }) {
          id
        }
      }
    `, {
      videoId: summary.metadata.videoId,
      title: summary.metadata.title,
      summary: summary.gptSummary,
      metadata: summary.metadata
    });

    return summary;
  } catch (error) {
    throw new Error('Failed to get video summary');
  }
};

export const fetchUserSummaries = async () => {
  try {
    const { data, error } = await nhost.graphql.request(`
      query GetUserSummaries {
        summaries(order_by: {created_at: desc}) {
          id
          video_id
          title
          summary
          metadata
          created_at
        }
      }
    `);

    if (error) throw error;
    return data.summaries;
  } catch (error) {
    throw new Error('Failed to fetch summaries');
  }
};

export const extractVideoId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};