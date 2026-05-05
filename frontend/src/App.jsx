import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/history');
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setVideoUrl(null); // Reset video
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setVideoUrl(res.data.data.output_url);
        fetchHistory(); // Refresh history
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800 selection:text-white">
      {/* Vercel-like Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-6 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <svg aria-label="Vercel Logo" fill="currentColor" viewBox="0 0 76 65" height="22" className="text-white"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z"></path></svg>
              <span className="text-xl font-bold tracking-tight ml-2">VideoAI</span>
            </div>
            <nav className="hidden md:flex gap-6 text-sm text-zinc-400">
              <a href="#" className="hover:text-white transition-colors">Deployments</a>
              <a href="#" className="text-white">Generations</a>
              <a href="#" className="hover:text-white transition-colors">Settings</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-zinc-400 hover:text-white transition-colors">Feedback</button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-500 border border-zinc-600"></div>
          </div>
        </div>
      </header>

      <main className="pt-12 px-6 pb-24 max-w-5xl mx-auto w-full space-y-12">
        {/* Header Section */}
        <section className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
            Generate AI Videos
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Upload any image to instantly synthesize a high-quality video using our advanced generative AI models. Fast, seamless, and production-ready.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Upload and Control Card */}
          <div className="border border-zinc-800 bg-zinc-950/50 rounded-xl p-6 shadow-2xl flex flex-col space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight text-white">Input Image</h2>
              <p className="text-sm text-zinc-400">Select the base image for your video generation.</p>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept="image/*" 
              className="hidden" 
            />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-800 rounded-lg p-10 flex flex-col items-center justify-center text-center hover:bg-zinc-900/50 hover:border-zinc-700 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </div>
              <h3 className="text-sm font-medium text-white mb-1">Click to upload image</h3>
              <p className="text-xs text-zinc-500">PNG, JPG, WEBP up to 10MB</p>
            </div>

            <button 
              onClick={handleUpload}
              disabled={!file || loading}
              className={`w-full py-3 px-4 rounded-md font-medium text-sm transition-all flex items-center justify-center gap-2
                ${(!file || loading) ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200 active:scale-[0.98]'}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Synthesizing...
                </>
              ) : 'Generate Video'}
            </button>
          </div>

          {/* Preview Section */}
          <div className="border border-zinc-800 bg-zinc-950/50 rounded-xl overflow-hidden shadow-2xl relative flex items-center justify-center min-h-[400px]">
            {videoUrl ? (
              <div className="w-full h-full absolute inset-0 overflow-hidden">
                <img src={videoUrl.startsWith('http') ? videoUrl : `http://localhost:5000${videoUrl}`} className="w-full h-full object-cover animate-ai-video" alt="AI Generated Video" />
                <div className="scanline"></div>
              </div>
            ) : preview ? (
              <img src={preview} className="w-full h-full object-cover absolute inset-0 opacity-60" alt="Preview" />
            ) : (
              <div className="text-center p-8 flex flex-col items-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-800 mb-4"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                <p className="text-zinc-500 text-sm">Preview will appear here</p>
              </div>
            )}
            
            {/* Status Badges */}
            {loading && (
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 border border-zinc-700">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[11px] font-medium tracking-wide text-zinc-300">Processing</span>
              </div>
            )}
            {videoUrl && (
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 border border-zinc-700">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[11px] font-medium tracking-wide text-zinc-300">Ready</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent History Table */}
        {history.length > 0 && (
          <section className="space-y-4 pt-8">
            <h2 className="text-xl font-semibold tracking-tight text-white border-b border-zinc-800 pb-4">Recent Deployments</h2>
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-black">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-900/50 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Preview</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Created At</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-900/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="w-16 h-10 bg-zinc-900 rounded overflow-hidden relative border border-zinc-800">
                           <img className="w-full h-full object-cover" src={item.output_url.endsWith('.mp4') ? 'https://fatmachines.com/assignment/ai.mp4' : `http://localhost:5000${item.output_url}`} alt="history" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-zinc-300">Ready</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-500">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <a href={item.output_url} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                            Download
                         </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
