"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Upload, Bot, Sparkles, Scale, FileText, Lock } from "lucide-react";
import { aiService } from "@/modules/ai/services/aiService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { marked } from "marked";

export default function AiAssistantPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"CHAT" | "DOCUMENT">("CHAT");
  const [messages, setMessages] = useState<{ role: "USER" | "AI"; content: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionPublicId, setSessionPublicId] = useState<string | undefined>();
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docAnalysis, setDocAnalysis] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, docAnalysis]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setMessages(prev => [...prev, { role: "USER", content: userText }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await aiService.chat(userText, sessionPublicId);
      if (!sessionPublicId) {
        setSessionPublicId(response.sessionPublicId);
      }
      setMessages(prev => [...prev, { role: "AI", content: response.responseMessage }]);
    } catch (error: any) {
      if (error.message === "REQUIRES_UPGRADE") {
        setNeedsUpgrade(true);
      } else {
        toast.error("Error al comunicarse con la IA.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeDoc = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setDocAnalysis("");

    try {
      const response = await aiService.analyzeDocument(selectedFile);
      setDocAnalysis(response.analysisResult);
      toast.success("Documento analizado con éxito.");
    } catch (error: any) {
      if (error.message === "REQUIRES_UPGRADE") {
        setNeedsUpgrade(true);
      } else {
        toast.error("Error al analizar el documento.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (needsUpgrade) {
    return (
      <div className="flex h-full min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="bg-amber-100 p-6 rounded-full mb-6">
          <Lock className="w-16 h-16 text-amber-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Funcionalidad Premium</h2>
        <p className="text-lg text-slate-600 max-w-lg mb-8">
          El Asistente de IA Legal y el Análisis de Documentos están disponibles exclusivamente en nuestros planes Premium y Corporativo.
        </p>
        <button 
          onClick={() => router.push("/dashboard/subscription")}
          className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition shadow-lg flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Mejorar mi Plan
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
      {/* Header Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 p-2">
        <button
          onClick={() => setActiveTab("CHAT")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold rounded-xl transition ${
            activeTab === "CHAT" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-200/50"
          }`}
        >
          <Scale className="w-5 h-5" />
          Consulta Legal e Investigación
        </button>
        <button
          onClick={() => setActiveTab("DOCUMENT")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold rounded-xl transition ${
            activeTab === "DOCUMENT" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-200/50"
          }`}
        >
          <FileText className="w-5 h-5" />
          Análisis de Documentos
        </button>
      </div>

      {activeTab === "CHAT" ? (
        <>
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <Bot className="w-16 h-16 text-slate-300" />
                <p className="text-lg font-medium text-slate-500">¿En qué puedo ayudarte hoy?</p>
                <div className="flex gap-2 mt-4 text-sm">
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-600 border border-slate-200">Leyes</span>
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-600 border border-slate-200">Jurisprudencia</span>
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-600 border border-slate-200">Doctrina</span>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.role === "USER" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "AI" && (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
                      <Bot className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                  <div className={`p-4 rounded-2xl max-w-[80%] ${
                    msg.role === "USER" 
                      ? "bg-slate-900 text-white rounded-br-none" 
                      : "bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm"
                  }`}>
                    {msg.role === "USER" ? (
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                    ) : (
                      <div 
                        className="prose prose-slate prose-sm max-w-none leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: marked.parse(msg.content, { async: false }) as string }}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex gap-4 justify-start animate-pulse">
                 <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
                 <div className="bg-slate-100 p-4 rounded-2xl w-48 h-12 rounded-bl-none"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Escribe tu consulta legal aquí..."
                className="w-full bg-slate-100 border-none rounded-full py-4 pl-6 pr-14 outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-3">La IA es un asistente de apoyo. Para problemas determinantes valide con su propio criterio profesional.</p>
          </div>
        </>
      ) : (
        /* Document Analysis Area */
        <div className="flex-1 flex flex-col p-6 bg-slate-50/50 overflow-y-auto">
          <div className="max-w-2xl mx-auto w-full space-y-6 mt-8">
            
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center flex flex-col items-center justify-center transition-all hover:bg-slate-50">
              <input 
                type="file" 
                accept="application/pdf"
                id="doc-upload" 
                className="hidden" 
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Sube un documento Legal</h3>
                <p className="text-slate-500 mb-6 font-medium">Soporta formatos PDF hasta 10MB</p>
                <div className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800">
                  Seleccionar Archivo
                </div>
              </label>

              {selectedFile && (
                <div className="mt-6 p-4 bg-slate-100 rounded-xl w-full flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-slate-500 w-6 h-6" />
                    <span className="font-semibold text-slate-700">{selectedFile.name}</span>
                  </div>
                  <button 
                    onClick={handleAnalyzeDoc}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? "Analizando..." : <><Sparkles className="w-4 h-4"/> Analizar</>}
                  </button>
                </div>
              )}
            </div>

            {docAnalysis && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-8">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  <h3 className="text-xl font-bold text-slate-900">Análisis Jurídico</h3>
                </div>
                <div 
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: marked.parse(docAnalysis, { async: false }) as string }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
