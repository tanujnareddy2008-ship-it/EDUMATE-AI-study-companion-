import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Tv, 
  ExternalLink, 
  Play, 
  Sparkles, 
  Search, 
  Users, 
  Star, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight,
  Flame
} from 'lucide-react';

export const LectureGuideView: React.FC = () => {
  const { profile } = useApp();
  const [topic, setTopic] = useState<string>(profile.currentTopic);
  const [channels, setChannels] = useState<any[]>([]);
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLectureGuide = async (targetTopic: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/lecture-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic,
          subject: profile.selectedSubject,
          examType: profile.examType,
        }),
      });
      const data = await res.json();
      setChannels(data.recommendedChannels || []);
      setCurriculum(data.curatedLecturePlan || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTopic(profile.currentTopic);
    fetchLectureGuide(profile.currentTopic);
  }, [profile.currentTopic]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      fetchLectureGuide(topic.trim());
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide">
              Rule 17: Video Lecture Navigator
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Top Most-Viewed Channels
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Curated YouTube Lectures for "{topic}"
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Directly guiding you to the most viewed, highest-rated master educators with billions of verified views and lecture roadmaps.
          </p>
        </div>

        {/* Topic Input */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto shrink-0">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Search topic lectures..."
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 outline-none focus:border-rose-500 w-full md:w-64"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition shrink-0"
          >
            Find
          </button>
        </form>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <div className="w-12 h-12 border-3 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-800">Fetching Top YouTube Channels &amp; Playlists...</h3>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Channels Grid (Rule 17) */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Tv className="w-5 h-5 text-rose-600" />
              <span>Most Viewed &amp; Recommended YouTube Channels for "{topic}"</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {channels.map((chan, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-rose-300 hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                        <Play className="w-5 h-5 fill-rose-600" />
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${chan.badgeColor}`}>
                        {chan.rating}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900">
                      {chan.channelName}
                    </h4>
                    <p className="text-[11px] font-semibold text-rose-600">
                      {chan.subscribers}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {chan.specialty}
                    </p>
                  </div>

                  <a
                    href={chan.searchQuery}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Watch Lectures on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Recommended Lecture Roadmap (Rule 17) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div>
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
                Optimal Video Study Flow
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">
                Recommended 3-Phase Lecture Roadmap for {topic}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Follow this sequence when watching video playlists to maximize conceptual clarity before taking quizzes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {curriculum.map((phase, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-indigo-600">Phase 0{idx + 1}</span>
                    <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-bold border border-slate-200 text-slate-600">
                      {phase.duration}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {phase.phase}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {phase.focus}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
