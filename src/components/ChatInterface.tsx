import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Mic, AlertTriangle, Sparkles, Wifi, WifiOff } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isAlert?: boolean;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "আসসালামু আলাইকুম! 👋 I'm your Mellow AI assistant. I can help you with:\n\n• Pregnancy care questions\n• Nutrition advice with local foods\n• Symptom checking\n• Appointment reminders\n• Safe practices during pregnancy\n\nHow can I assist you today?",
    timestamp: new Date(),
  },
];

const sampleResponses: Record<string, string> = {
  "headache": "🔔 **About headaches during pregnancy:**\n\nMild headaches are common, especially in the first trimester. Here's what you can do:\n\n✅ Rest in a quiet, dark room\n✅ Apply a cold compress\n✅ Stay hydrated\n✅ Eat regularly\n\n⚠️ **Seek immediate care if:**\n- Severe headache with vision changes\n- Headache with swelling in face/hands\n- Headache that doesn't improve\n\nWould you like me to help you find a nearby clinic?",
  "food": "🥗 **Recommended Bangladeshi foods for pregnancy:**\n\n**Iron-rich (রক্ত বাড়ায়):**\n• কচু শাক (Taro leaves)\n• পালং শাক (Spinach)\n• কলিজা (Liver - 1x/week)\n• ডাল (Lentils)\n\n**Calcium (হাড় মজবুত করে):**\n• দুধ (Milk)\n• ছোট মাছ (Small fish with bones)\n• তিল (Sesame)\n\n**Protein (শিশুর বৃদ্ধি):**\n• ডিম (Eggs)\n• মাছ (Fish)\n• মুরগি (Chicken)\n• ডাল (Dal)\n\n**Avoid:** Raw papaya, excess caffeine, unpasteurized dairy\n\nWould you like a weekly meal plan?",
  "default": "Thank you for your question! I'm here to help with any pregnancy-related concerns. Could you please provide more details so I can give you personalized advice?\n\nYou can ask me about:\n• Nutrition and diet\n• Common symptoms\n• Exercise and rest\n• Checkup schedules\n• Baby development",
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let response = sampleResponses.default;
      let isAlert = false;

      if (lowerInput.includes("headache") || lowerInput.includes("pain") || lowerInput.includes("ব্যথা")) {
        response = sampleResponses.headache;
        isAlert = lowerInput.includes("severe") || lowerInput.includes("vision");
      } else if (lowerInput.includes("food") || lowerInput.includes("eat") || lowerInput.includes("nutrition") || lowerInput.includes("খাবার")) {
        response = sampleResponses.food;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        isAlert,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickQuestions = [
    "What foods should I eat?",
    "I have a headache",
    "Exercise during pregnancy",
    "Baby development week 24",
  ];

  return (
    <Card className="flex flex-col h-[600px] md:h-[700px]">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-hero flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${isOnline ? 'bg-success' : 'bg-muted-foreground'}`} />
            </div>
            <div>
              <CardTitle className="text-lg">Mellow Assistant</CardTitle>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {isOnline ? (
                  <>
                    <Wifi className="h-3 w-3 text-success" /> Online • WHO & DGHS verified
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3" /> Offline mode
                  </>
                )}
              </p>
            </div>
          </div>
          <Badge variant="success">AI Powered</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            {message.role === "assistant" && (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : message.isAlert
                  ? "bg-destructive/10 border border-destructive/30 rounded-bl-md"
                  : "bg-muted rounded-bl-md"
              }`}
            >
              {message.isAlert && (
                <div className="flex items-center gap-2 mb-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs font-semibold">Health Alert</span>
                </div>
              )}
              <p className={`text-sm whitespace-pre-wrap ${message.role === "user" ? "text-primary-foreground" : "text-foreground"}`}>
                {message.content}
              </p>
              <p className={`text-[10px] mt-1 ${message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {message.role === "user" && (
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-accent-foreground" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 animate-fade-in">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      {/* Quick Questions */}
      <div className="px-4 py-2 border-t border-border">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs"
              onClick={() => setInput(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Mic className="h-4 w-4" />
          </Button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your question... (English or বাংলা)"
              className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button
            variant="hero"
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
