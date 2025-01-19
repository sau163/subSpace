
import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Youtube, Download } from 'lucide-react';
import { useAuthenticationStatus } from '@nhost/react';
import PropTypes from 'prop-types';

export default function Summary({ currentSummary: summaryProp }) {
  const [jsonData, setJsonData] = useState(null);
  const { isAuthenticated } = useAuthenticationStatus();

  useEffect(() => {
    if (summaryProp) {
      try {
        if (typeof summaryProp.summary === 'string') {
          try {
            setJsonData(JSON.parse(summaryProp.summary));
          } catch {
            setJsonData({
              gptSummary: {
                summary: summaryProp.summary,
                keyPoints: []
              }
            });
          }
        } else {
          setJsonData({
            gptSummary: summaryProp.summary
          });
        }
      } catch (error) {
        console.error('Error parsing summary:', error);
      }
    }
  }, [summaryProp]);

  const downloadPDF = () => {
    if (!summaryProp || !jsonData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    // Add title
    doc.setFontSize(16);
    doc.text(summaryProp.metadata.title || 'No Title', margin, margin);

    // Add metadata details
    doc.setFontSize(12);
    doc.text(`Duration: ${summaryProp.metadata.duration || 'N/A'}`, margin, margin + 20);
    doc.text(`Views: ${typeof summaryProp.metadata.viewCount === 'number' 
      ? summaryProp.metadata.viewCount.toLocaleString() 
      : 'N/A'}`, margin, margin + 30);
    doc.text(`Likes: ${typeof summaryProp.metadata.likeCount === 'number' 
      ? summaryProp.metadata.likeCount.toLocaleString() 
      : 'N/A'}`, margin, margin + 40);
    doc.text(`Comments: ${typeof summaryProp.metadata.commentCount === 'number' 
      ? summaryProp.metadata.commentCount.toLocaleString() 
      : 'N/A'}`, margin, margin + 50);

    // Add summary
    doc.setFontSize(14);
    doc.text('Summary:', margin, margin + 70);

    const summaryText = jsonData.gptSummary?.summary || 'No summary available';
    const splitText = doc.splitTextToSize(summaryText, maxWidth);
    doc.text(splitText, margin, margin + 80);

    // Save the PDF
    doc.save(`${summaryProp.metadata.title || 'Summary'}.pdf`);
  };

  if (!summaryProp || !jsonData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)]">
        <Youtube className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 text-center">
          No summary available.<br />
          Please paste a YouTube URL above or select one from the sidebar.
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)]">
        <Youtube className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 text-center">
          Login....<br />
          To search and get chat history.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{summaryProp.metadata.title || 'No Title'}</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-semibold">{summaryProp.metadata.duration || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Views</p>
            <p className="font-semibold">
              {summaryProp.metadata.viewCount }
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Likes</p>
            <p className="font-semibold">
              {summaryProp.metadata.likeCount}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Comments</p>
            <p className="font-semibold">
              {summaryProp.metadata.commentCount}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-3">Summary</h3>
            <p className="whitespace-pre-line text-gray-700">
              {jsonData.gptSummary?.summary || 'No summary available'}
            </p>
          </div>

          {jsonData.gptSummary?.keyPoints && (
            <div>
              <h3 className="text-xl font-bold mb-3">Key Points</h3>
              <ul className="list-disc pl-5 space-y-2">
                {jsonData.gptSummary.keyPoints.map((point, index) => (
                  <li key={index} className="text-gray-700">{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={downloadPDF}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
}

Summary.propTypes = {
  currentSummary: PropTypes.object
};