import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  MessageSquare, 
  CheckCircle2,
  Globe2,
  Bot
} from 'lucide-react';
import { Language, SUPPORTED_LANGUAGES, getTranslation } from '../i18n/translations';
import { Threat, Campaign } from '../types/threat';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  brandName: string;
  threats: Threat[];
  campaigns: Campaign[];
  onNavigateToCampaign?: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onLanguageChange,
  brandName,
  threats,
  campaigns,
  onNavigateToCampaign,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      sender: 'assistant',
      text: getWelcomeMessage(currentLang, brandName),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Re-generate welcome message when language changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'assistant') {
      setMessages([
        {
          id: 'm-welcome',
          sender: 'assistant',
          text: getWelcomeMessage(currentLang, brandName),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [currentLang, brandName]);

  // Scroll to bottom on message update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isListening, isSpeaking]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang);
      recognition.lang = langObj?.voiceLang || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleUserQuery(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, [currentLang]);

  // Text-To-Speech Function
  const speakText = (text: string) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang);
    utterance.lang = langObj?.voiceLang || 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick appropriate voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang.startsWith(utterance.lang));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Please use the text input.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      try {
        const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang);
        recognitionRef.current.lang = langObj?.voiceLang || 'en-US';
        recognitionRef.current.start();
      } catch (err) {
        console.error('Speech recognition start failed:', err);
      }
    }
  };

  // AI Cyber Assistant Logic
  const handleUserQuery = (query: string) => {
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Generate intelligent response
    setTimeout(() => {
      const responseText = generateAssistantAnswer(query, currentLang, brandName, threats, campaigns);
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakText(responseText);
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-[620px] rounded-xl border border-slate-700 bg-slate-900 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {getTranslation(currentLang, 'voiceTitle')}
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                  AI VOICE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {getTranslation(currentLang, 'voiceSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector Inside Assistant */}
            <div className="flex items-center gap-1 p-1 rounded bg-slate-900 border border-slate-800 text-xs">
              <Globe2 className="w-3.5 h-3.5 text-slate-400 ml-1" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer pr-1"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Mute Toggle */}
            <button
              onClick={() => {
                if (isSpeaking) window.speechSynthesis.cancel();
                setIsVoiceEnabled(!isVoiceEnabled);
              }}
              className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title={isVoiceEnabled ? getTranslation(currentLang, 'voiceMuteTTS') : getTranslation(currentLang, 'voiceUnmuteTTS')}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-lg leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-rose-600 text-white rounded-br-none'
                    : 'bg-slate-800/80 border border-slate-700/80 text-slate-100 rounded-bl-none shadow-md'
                }`}
              >
                <p className="whitespace-pre-line text-xs md:text-[13px]">{msg.text}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1 px-1">
                {msg.sender === 'assistant' ? 'DRPP Cyber AI' : 'Security Analyst'} · {msg.timestamp}
              </span>
            </div>
          ))}

          {/* Listening Indicator */}
          {isListening && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-300 animate-pulse">
              <Mic className="w-4 h-4 text-rose-400" />
              <span className="font-mono text-xs font-semibold">
                {getTranslation(currentLang, 'voiceListening')}
              </span>
              <div className="flex items-center gap-1 ml-auto">
                <span className="w-1.5 h-3 bg-rose-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-5 bg-rose-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-1.5 h-3 bg-rose-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          )}

          {/* Speaking Indicator */}
          {isSpeaking && (
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] p-2 bg-emerald-950/30 rounded border border-emerald-900/40">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>{getTranslation(currentLang, 'voiceSpeaking')}</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-5 py-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 shrink-0 font-mono">Suggestions:</span>
          <button
            onClick={() => handleUserQuery(getTranslation(currentLang, 'voiceQuick1'))}
            className="px-2.5 py-1 rounded-full border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 whitespace-nowrap shrink-0 transition-colors"
          >
            {getTranslation(currentLang, 'voiceQuick1')}
          </button>
          <button
            onClick={() => handleUserQuery(getTranslation(currentLang, 'voiceQuick2'))}
            className="px-2.5 py-1 rounded-full border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 whitespace-nowrap shrink-0 transition-colors"
          >
            {getTranslation(currentLang, 'voiceQuick2')}
          </button>
          <button
            onClick={() => handleUserQuery(getTranslation(currentLang, 'voiceQuick3'))}
            className="px-2.5 py-1 rounded-full border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 whitespace-nowrap shrink-0 transition-colors"
          >
            {getTranslation(currentLang, 'voiceQuick3')}
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserQuery(inputText);
            }}
            className="flex items-center gap-2"
          >
            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3 rounded-lg border transition-all ${
                isListening
                  ? 'bg-rose-600 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={isListening ? getTranslation(currentLang, 'voiceStopListening') : getTranslation(currentLang, 'voiceStartListening')}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-rose-400" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={getTranslation(currentLang, 'voicePlaceholder')}
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{getTranslation(currentLang, 'voiceSend')}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Natural Language Response Generators in Telugu, Hindi, Marathi, English
// -------------------------------------------------------------

function getWelcomeMessage(lang: Language, brand: string): string {
  switch (lang) {
    case 'te':
      return `నమస్కారం! నేను DRPP AI సైబర్ సెక్యూరిటీ వాయిస్ అసిస్టెంట్‌ని. ${brand} పై జరుగుతున్న ఫిషింగ్ దాడులు, నకిలీ సోషల్ ప్రొఫైల్స్, అనుమానాస్పద APK యాప్‌లు మరియు వాటిని ఎలా తొలగించాలో (Takedown) నన్ను అడగండి. మీరు మైక్ బటన్ నొక్కి తెలుగులో మాట్లాడవచ్చు!`;
    case 'hi':
      return `नमस्ते! मैं DRPP AI साइबर सुरक्षा वॉयस असिस्टेंट हूँ। ${brand} पर हो रहे फ़िशिंग हमले, फर्जी सोशल मीडिया प्रोफाइल, संदिग्ध APK ऐप्स और उन्हें हटाने (Takedown) के बारे में मुझसे पूछें। आप माइक दबाकर हिंदी में बोल सकते हैं!`;
    case 'mr':
      return `नमस्कार! मी DRPP AI सायबर सुरक्षा व्हॉइस असिस्टंट आहे. ${brand} वरील बनावट सोशल प्रोफाइल्स, फिशिंग लिंक्स, धोकादायक APK अॅप्स आणि टेकडाउन उपायांबद्दल मला विचारा. तुम्ही माइक दाबून मराठीत बोलू शकता!`;
    default:
      return `Hello! I am your DRPP Cybersecurity Voice Assistant. Ask me anything about active threats targeting ${brand}, the Storm-0842 campaign, static APK risks, or takedown actions. You can speak via microphone or type in English, Telugu, Hindi, or Marathi!`;
  }
}

function generateAssistantAnswer(
  query: string,
  lang: Language,
  brand: string,
  threats: Threat[],
  campaigns: Campaign[]
): string {
  const q = query.toLowerCase();
  const criticalCount = threats.filter((t) => t.risk_level === 'CRITICAL').length;
  const topCritical = threats.find((t) => t.risk_level === 'CRITICAL');

  // Query 1: Critical threats / active status
  if (q.includes('critical') || q.includes('క్రిటికల్') || q.includes('ప్రమాదకర') || q.includes('गंभीर') || q.includes('धोके') || q.includes('threat')) {
    if (lang === 'te') {
      return `${brand} బ్రాండ్‌పై ప్రస్తుతం ${criticalCount} అత్యంత తీవ్రమైన (Critical) ముప్పులు నమోదయ్యాయి. ప్రధానమైనది: ${topCritical?.entity || '@ApexPay_Support247'} (రిస్క్ స్కోరు: ${topCritical?.risk_score || 94}/100). ఇది కస్టమర్ల రికవరీ కీలను మరియు బ్యాంకింగ్ SMS OTPలను దొంగిలించడానికి ప్రయత్నిస్తోంది.`;
    } else if (lang === 'hi') {
      return `${brand} ब्रांड पर वर्तमान में ${criticalCount} अति-गंभीर (Critical) खतरे सक्रिय हैं। सबसे प्रमुख खतरा '${topCritical?.entity || '@ApexPay_Support247'}' है (रिस्क स्कोर: ${topCritical?.risk_score || 94}/100)। यह उपयोगकर्ताओं के वॉलेट ओटीपी और पासवर्ड चुराने की कोशिश कर रहा है।`;
    } else if (lang === 'mr') {
      return `${brand} ब्रँडवर सध्या ${criticalCount} अति-गंभीर (Critical) धोके सक्रिय आहेत. मुख्य धोका '${topCritical?.entity || '@ApexPay_Support247'}' (जोखीम स्कोअर: ${topCritical?.risk_score || 94}/100) हा आहे, जो बनावट खात्याद्वारे ग्राहकांचे बँक OTP चोरत आहे.`;
    } else {
      return `Currently, there are ${criticalCount} CRITICAL threats actively targeting ${brand}. The highest severity incident is ${topCritical?.entity || '@ApexPay_Support247'} (Risk Score: ${topCritical?.risk_score || 94}/100), which is harvesting banking SMS OTPs and user credentials.`;
    }
  }

  // Query 2: Storm-0842 / Campaign explanation
  if (q.includes('storm') || q.includes('campaign') || q.includes('క్యాంపెయిన్') || q.includes('दादी') || q.includes('मोहीम') || q.includes('गैंग')) {
    if (lang === 'te') {
      return `Storm-0842 అనేది ఒక ఆర్ధిక ఉద్దేశ్యంతో పనిచేసే సైబర్ నేరగాళ్ల సమూహం. వీరు మొదట ట్విట్టర్‌లో @ApexPay_Support247 పేరిట నకిలీ సపోర్ట్ ఖాతాను సృష్టించారు. దాని బయో లింక్ ద్వారా apexpay-security-verify.cc అనే ఫిషింగ్ వెబ్‌సైట్‌కి తీసుకెళ్లి, అక్కడ నుండి ApexPay_2FA_Authenticator.apk అనే మాల్వేర్‌ను డౌన్‌లోడ్ చేయిస్తారు. ఇది SMS OTPలను దొంగిలిస్తుంది.`;
    } else if (lang === 'hi') {
      return `Storm-0842 एक संगठित वित्तीय साइबर अपराध गिरोह है। उन्होंने @ApexPay_Support247 के नाम से फर्जी सोशल हैंडल बनाया, उसे apexpay-security-verify.cc फ़िशिंग पोर्टल से जोड़ा, और वहाँ से ApexPay_2FA_Authenticator.apk मैलवेयर वितरित किया, जो बैंकिंग एसएमएस चुराता है।`;
    } else if (lang === 'mr') {
      return `Storm-0842 ही एक संघटित सायबर टोळी आहे. त्यांनी @ApexPay_Support247 हे बनावट सोशल खाते सुरू केले, त्याला apexpay-security-verify.cc या फिशिंग वेबसाइटशी जोडले, आणि तिथून ApexPay_2FA_Authenticator.apk हे ट्रोजन अॅप पसरवले जे बँकेचे OTP चोरते.`;
    } else {
      return `Storm-0842 is a coordinated cyber syndicate targeting ${brand}. They operate a 3-tier campaign: 1) Impersonating customer support via @ApexPay_Support247, 2) Funneling victims to phishing domain apexpay-security-verify.cc, and 3) Sideloading ApexPay_2FA_Authenticator.apk which intercepts 2FA banking SMS.`;
    }
  }

  // Query 3: APK Takedown / Remediation
  if (q.includes('apk') || q.includes('takedown') || q.includes('యాప్') || q.includes('తొలగించ') || q.includes('हटाएं') || q.includes('काढून')) {
    if (lang === 'te') {
      return `నకిలీ APK ని నిరోధించడానికి DRPP 3 చర్యలను సిఫార్సు చేస్తుంది: 1) Google Play Protect మరియు శాంసంగ్ సెక్యూరిటీ డెస్క్‌కు SHA-256 సంతకాన్ని నివేదించడం. 2) APKPure, MediaFire వంటి హోస్టింగ్‌లకు DMCA నోటీసు జారీ చేయడం. 3) C2 డొమైన్‌ను ఫైర్‌వాల్ DNS సింక్‌హోల్‌లో చేర్చడం.`;
    } else if (lang === 'hi') {
      return `फर्जी APK को निष्प्रभावी करने के लिए DRPP 3 मुख्य कदम उठाता है: 1) Google Play Protect और VirusTotal पर SHA-256 हैश सबमिट करना। 2) APKMirror और मीडिया होस्टिंग को DMCA टेकडाउन नोटिस भेजना। 3) C2 सर्वर डोमेन को फायरवॉल में ब्लॉक करना।`;
    } else if (lang === 'mr') {
      return `बनावट APK बंद करण्यासाठी DRPP 3 उपाय सुचवते: 1) Google Play Protect आणि VirusTotal ला SHA-256 हॅश पाठवणे. 2) APK होस्टिंग वेबसाइट्सना DMCA टेकडाउन नोटीस जारी करणे. 3) कमांड अँड कंट्रोल डोमेन फायरवॉलमध्ये ब्लॉक करणे.`;
    } else {
      return `To neutralize the rogue APK, DRPP executes 3 countermeasures: 1) Submitting the package SHA-256 hash to Google Play Protect & VirusTotal threat feeds, 2) Dispatching DMCA takedown notices to third-party APK mirrors, and 3) Blackholing the embedded C2 domain at the enterprise firewall.`;
    }
  }

  // Query 4: Top 5 Datasets & Model Training
  if (q.includes('dataset') || q.includes('డేటాసెట్') || q.includes('डेटासेट') || q.includes('cresci') || q.includes('twibot') || q.includes('phiusiil') || q.includes('maldroid') || q.includes('train') || q.includes('మోడల్') || q.includes('ट्रेन')) {
    if (lang === 'te') {
      return `DRPP ప్లాట్‌ఫామ్ ప్రపంచంలోనే అత్యుత్తమ టాప్ 5 పరిశోధనా డేటాసెట్‌ల ద్వారా శిక్షణ పొందింది: 1) Kaggle ఇన్‌స్టాగ్రామ్ ఫేక్ స్పామర్స్ (94.8% ఖచ్చితత్వం), 2) Cresci-2017 సోషల్ బాట్ డేటాసెట్ (96.4%), 3) TwiBot-22 మల్టీమోడల్ గ్రాఫ్ డేటాసెట్ (95.1%), 4) UCI PhiUSIIL ఫిషింగ్ URL డేటాసెట్ (98.1%), మరియు 5) UNB CICMalDroid 2020 ఆండ్రాయిడ్ మాల్వేర్ డేటాసెట్ (97.3%). మీరు సైడ్‌బార్‌లోని "టాప్ 5 డేటాసెట్‌లు" పేజీలో లైవ్ టెస్ట్ బెంచ్ ద్వారా వీటిని నేరుగా పరీక్షించవచ్చు!`;
    } else if (lang === 'hi') {
      return `DRPP प्लेटफॉर्म को दुनिया के शीर्ष 5 बेंचमार्क डेटासेट्स पर प्रशिक्षित किया गया है: 1) Kaggle इंस्टाग्राम फेक अकाउंट्स (94.8% सटीकता), 2) Cresci-2017 सोशल बॉटनेट (96.4%), 3) NeurIPS TwiBot-22 (95.1%), 4) UCI PhiUSIIL फ़िशिंग URL (98.1%), और 5) UNB CICMalDroid 2020 एंड्रॉयड मैलवेयर (97.3%)। आप साइडबार में "शीर्ष 5 ML डेटासेट्स" स्टूडियो में जाकर लाइव परीक्षण कर सकते हैं!`;
    } else if (lang === 'mr') {
      return `DRPP प्लॅटफॉर्म जगातील अव्वल 5 संशोधन डेटासेट्सवर प्रशिक्षित आहे: 1) Kaggle इन्स्टाग्राम बनावट खाती (94.8% अचूकता), 2) Cresci-2017 सोशल बॉट्स (96.4%), 3) TwiBot-22 (95.1%), 4) UCI PhiUSIIL फिशिंग URLs (98.1%), आणि 5) UNB CICMalDroid 2020 अँड्रॉइड मालवेअर (97.3%). आपण साइडबारमधील "अव्वल 5 ML डेटासेट्स" पेजवर थेट चाचणी करू शकता!`;
    } else {
      return `DRPP is trained on the Top 5 cybersecurity benchmarks: 1) Instagram Fake Spammers (Kaggle - 94.8% Acc), 2) Cresci-2017 Social Botnet (Botometer - 96.4% Acc), 3) TwiBot-22 Graph Botnet (NeurIPS - 95.1% Acc), 4) PhiUSIIL Phishing URLs (UCI - 98.1% Acc), and 5) CICMalDroid 2020 Android Malware (UNB - 97.3% Acc). Inspect feature importances and run live inference in the Top 5 ML Benchmarks studio!`;
    }
  }

  // Default Fallback
  if (lang === 'te') {
    return `${brand} బ్రాండ్ రక్షణ కోసం DRPP AI సిద్ధంగా ఉంది. మొత్తం ${threats.length} ముప్పులు పర్యవేక్షించబడుతున్నాయి. మీరు క్రిటికల్ అలర్ట్‌లు, క్యాంపెయిన్ గ్రాఫ్ లేదా ఏదైనా డొమైన్/యాప్ రిస్క్ గురించి అడగవచ్చు.`;
  } else if (lang === 'hi') {
    return `${brand} ब्रांड सुरक्षा के लिए DRPP AI सक्रिय है। वर्तमान में ${threats.length} खतरों की निगरानी की जा रही है। आप किसी भी डोमेन, फर्जी प्रोफाइल या टेकडाउन प्रक्रिया के बारे में पूछ सकते हैं।`;
  } else if (lang === 'mr') {
    return `${brand} ब्रँडच्या संरक्षणासाठी DRPP AI कार्यरत आहे. सध्या ${threats.length} सायबर धोके तपासले जात आहेत. आपण कोणत्याही बनावट खाते, डोमेन किंवा टेकडाउनबद्दल अधिक विचारू शकता.`;
  } else {
    return `DRPP AI is actively monitoring ${threats.length} threat vectors against ${brand}. You can ask about our 0-100 risk scoring engine, view campaign correlation, or evaluate any new suspicious profile, URL, or APK manifest.`;
  }
}
