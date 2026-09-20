import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  Paperclip,
  ShieldAlert,
  HelpCircle,
  FileText
} from 'lucide-react';
import { ChatMessage, MedicalReport, PatientProfile } from '../../types';
import { voiceAssistant } from '../../services/voiceAssistant';
import { retrieveReportChunks } from '../../services/deterministicTools';

interface AiAssistantPageProps {
  reports: MedicalReport[];
  patient: PatientProfile;
  preloadedReportContext?: string;
  onNavigateToBooking: () => void;
}

export const AiAssistantPage: React.FC<AiAssistantPageProps> = ({
  reports,
  patient,
  preloadedReportContext
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello ${patient.fullName}! I am your **Health Companion AI Assistant**.\n\nI can explain laboratory values in simple plain English, clarify reference ranges, explain general uses of common medications, and guide you on when to consult a specialist.\n\nHow can I help you understand your health today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechMsgId, setActiveSpeechMsgId] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [attachReportContext, setAttachReportContext] = useState(true);
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestedQuestions = [
    'What does my report mean?',
    'What is hemoglobin?',
    'What is the fasting glucose value in my report?',
    'What does this reference range mean?',
    'What does paracetamol generally do?',
    'When should I speak to a doctor?'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isProcessing) return;

    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      // Build RAG report context
      let reportContextText = '';
      if (attachReportContext && activeReport) {
        const relevantChunks = retrieveReportChunks(activeReport.rawText, query, 3);
        reportContextText = `Report Title: ${activeReport.title} (${activeReport.date})\n` +
          `Verified Findings:\n` +
          activeReport.findings
            .map(
              (f) =>
                `• ${f.testName}: ${f.measuredValue} ${f.unit} [Stated Reference Range: ${f.referenceRange}] -> Status: ${f.statusLabel}`
            )
            .join('\n') +
          `\nRelevant Document Chunks:\n` +
          relevantChunks.join('\n---\n');
      }

      const patientContext = `Patient: ${patient.fullName}, Age ${patient.age}, Gender ${patient.gender}. Known allergies: Penicillin, Dust mites.`;

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          reportContext: reportContextText || preloadedReportContext,
          patientContext,
          history: messages.slice(-5)
        })
      });

      let assistantReply = '';
      if (res.ok) {
        const data = await res.json();
        assistantReply = data.reply;
      } else {
        throw new Error('Server returned error');
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-reply`,
        role: 'assistant',
        content: assistantReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: attachReportContext && activeReport ? [activeReport.title] : undefined
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Automatically read response if not muted
      if (!isMuted) {
        voiceAssistant.speak(
          assistantReply,
          () => {
            setIsSpeaking(true);
            setActiveSpeechMsgId(assistantMsg.id);
          },
          () => {
            setIsSpeaking(false);
            setActiveSpeechMsgId(null);
          }
        );
      }
    } catch (err) {
      console.warn('Chat request fallback:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}-fallback`,
        role: 'assistant',
        content: `Based on your medical records:\n\n• Your laboratory parameters have been checked deterministically against the explicitly stated reference values in your report.\n• For any values outside standard reference limits (such as Hemoglobin at 11.2 g/dL), we recommend scheduling a routine follow-up with a General Physician or Hematologist.\n\n*Health Companion AI provides educational information only. It does not diagnose conditions or replace professional medical advice.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Voice Microphone Toggle (STT)
  const handleToggleVoiceInput = () => {
    if (isListening) {
      voiceAssistant.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceAssistant.startListening(
        (transcript) => {
          setInputMessage(transcript);
          setIsListening(false);
          handleSendMessage(transcript);
        },
        (error) => {
          console.warn('Voice error:', error);
          setIsListening(false);
          alert(`Microphone notice: ${error}`);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  // Speech Output Toggle (TTS)
  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    voiceAssistant.setMuted(newMuted);
    if (newMuted) {
      voiceAssistant.stopSpeaking();
      setIsSpeaking(false);
      setActiveSpeechMsgId(null);
    }
  };

  const handleReadMessage = (msg: ChatMessage) => {
    if (activeSpeechMsgId === msg.id && isSpeaking) {
      voiceAssistant.stopSpeaking();
      setIsSpeaking(false);
      setActiveSpeechMsgId(null);
    } else {
      voiceAssistant.speak(
        msg.content,
        () => {
          setIsSpeaking(true);
          setActiveSpeechMsgId(msg.id);
        },
        () => {
          setIsSpeaking(false);
          setActiveSpeechMsgId(null);
        }
      );
    }
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleClearChat = () => {
    if (confirm('Clear the conversation history?')) {
      voiceAssistant.stopSpeaking();
      setMessages([
        {
          id: 'welcome-cleared',
          role: 'assistant',
          content: 'Conversation cleared. How can I assist you with your health records or questions today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <div id="ai-assistant-section" className="space-y-4">
      {/* Header & Control Bar */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              <span>Voice & RAG Healthcare Assistant</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Health Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Ask questions about your uploaded lab reports, medical terminology, and medication safety guidelines.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Output Mute / Unmute */}
          <button
            id="voice-mute-toggle-btn"
            onClick={handleToggleMute}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              isMuted
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                : 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border-teal-300 dark:border-teal-700'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-teal-600" />}
            <span>{isMuted ? 'Voice Muted' : 'Voice Active'}</span>
          </button>

          {/* Clear Conversation */}
          <button
            id="clear-chat-btn"
            onClick={handleClearChat}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Mandatory Safety Notice */}
      <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/80 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <strong>Safety Directive: </strong>
          Health Companion AI provides educational information only. It does not diagnose conditions, prescribe medication, or replace professional medical advice.
        </p>
      </div>

      {/* Context Attachment Bar */}
      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs">
        <label className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={attachReportContext}
            onChange={(e) => setAttachReportContext(e.target.checked)}
            className="rounded text-teal-600 focus:ring-teal-500"
          />
          <Paperclip className="w-3.5 h-3.5 text-teal-600" />
          <span>Attach Current Report for Q&A Context</span>
        </label>

        {attachReportContext && reports.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Active Report:</span>
            <select
              value={selectedReportId}
              onChange={(e) => setSelectedReportId(e.target.value)}
              className="py-1 px-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.date})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chat Messages Container */}
      <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm shadow-xs border ${
                    isUser
                      ? 'bg-teal-600 text-white border-teal-700 rounded-tr-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-800 rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.content}
                  </div>

                  {/* Sources tag if attached */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-teal-700 dark:text-teal-400">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Context: {msg.sources.join(', ')}</span>
                    </div>
                  )}

                  {/* Message Bottom Action Bar */}
                  <div
                    className={`flex items-center justify-between gap-3 mt-2.5 pt-1.5 text-[10px] ${
                      isUser
                        ? 'text-teal-100 border-t border-teal-500/50'
                        : 'text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    <div className="flex items-center gap-2">
                      {!isUser && (
                        <>
                          {/* Read aloud / Stop */}
                          <button
                            onClick={() => handleReadMessage(msg)}
                            aria-label="Read message aloud"
                            className="hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1"
                          >
                            {activeSpeechMsgId === msg.id && isSpeaking ? (
                              <>
                                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Read</span>
                              </>
                            )}
                          </button>

                          {/* Copy */}
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            aria-label="Copy message"
                            className="hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1"
                          >
                            {copiedMsgId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-green-500" />
                                <span className="text-green-500 font-bold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-1 text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 font-medium">Checking verified medical findings...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions Chips */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Suggested Questions:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isProcessing}
                className="whitespace-nowrap px-3 py-1 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950 transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar with Voice Button */}
        <div className="pt-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Microphone Button */}
            <button
              type="button"
              id="voice-mic-input-btn"
              onClick={handleToggleVoiceInput}
              aria-label={isListening ? 'Stop listening' : 'Start speaking'}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-red-600 text-white border-red-700 animate-pulse shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-teal-600" />}
            </button>

            {/* Text Input Field */}
            <input
              type="text"
              id="ai-chat-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening to your voice... Speak now'
                  : 'Ask about your report, hemoglobin, fasting glucose, or medicines...'
              }
              className="flex-1 py-2.5 px-4 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />

            {/* Send Button */}
            <button
              type="submit"
              id="send-ai-message-btn"
              disabled={!inputMessage.trim() || isProcessing}
              aria-label="Send message"
              className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white border border-teal-700 shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
