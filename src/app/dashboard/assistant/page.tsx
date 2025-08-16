'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { askDocumentQuestion } from '@/ai/flows/document-assistant';
import { Loader2, Send, Upload, User, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AssistantPage() {
  const [documentContent, setDocumentContent] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setDocumentContent(e.target?.result as string);
          toast({
            title: 'Success',
            description: `File "${file.name}" uploaded successfully.`,
          });
          setMessages([]);
        };
        reader.readAsText(file);
      } else {
        toast({
          title: 'Error',
          description: 'Please upload a valid .txt file.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleAskQuestion = async () => {
    if (!documentContent) {
      toast({ title: 'Error', description: 'Please upload a document first.', variant: 'destructive' });
      return;
    }
    if (!question.trim()) {
      toast({ title: 'Error', description: 'Please enter a question.', variant: 'destructive' });
      return;
    }
    
    setLoading(true);
    const newMessages: Message[] = [...messages, { role: 'user', content: question }];
    setMessages(newMessages);
    setQuestion('');

    try {
      const response = await askDocumentQuestion({ documentContent, question });
      setMessages([...newMessages, { role: 'assistant', content: response.answer }]);
    } catch (error) {
      console.error(error);
      const errorMessage = 'Failed to get an answer. Please try again.';
      setMessages([...newMessages, { role: 'assistant', content: errorMessage }]);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Document Assistant</CardTitle>
        <CardDescription>Upload a document and ask questions about its content.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="file"
            accept=".txt"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto">
            <Upload className="mr-2 h-4 w-4" />
            Upload .txt Document
          </Button>
          {documentContent && <p className="text-sm text-muted-foreground self-center">Document loaded. You can now ask questions.</p>}
        </div>

        <div className="flex-grow border rounded-lg p-4 bg-muted/30 flex flex-col">
          <ScrollArea className="flex-grow pr-4 -mr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn("p-3 rounded-lg max-w-sm md:max-w-md", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background')}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                   {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {loading && messages[messages.length-1]?.role === 'user' &&(
                 <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-background flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin text-primary"/>
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Ask a question about the document..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleAskQuestion()}
              disabled={loading || !documentContent}
            />
            <Button onClick={handleAskQuestion} disabled={loading || !documentContent}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
