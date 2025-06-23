
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BookMeetingButton from '../BookMeetingButton';

interface ContactForm {
  name: string;
  email: string;
  company: string;
  message: string;
}

const ContactSection = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/book-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: '', // Optional field
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Message sent!",
          description: "We'll get back to you within 24 hours.",
        });
        
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            company: '',
            message: ''
          });
        }, 3000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Ready to transform your consultant matching process? Let's discuss how MatchWise AI can help your business find the perfect consultants faster than ever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6">About MatchWise AI</h3>
                <p className="text-slate-300 mb-6">
                  We're revolutionizing the way companies find IT consultants through our AI-powered matching platform. Our mission is to connect the right talent with the right opportunities in record time.
                </p>
                <div className="flex flex-col space-y-2 mb-6">
                  <BookMeetingButton />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-slate-300">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span>marc@matchwise.tech</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span>+46 70 123 45 67</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span>Stockholm, Sweden</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                    <p className="text-slate-300">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-name" className="text-slate-300">Name *</Label>
                        <Input
                          id="contact-name"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="bg-slate-600 border-slate-500 text-white mt-1"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-email" className="text-slate-300">Email *</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="bg-slate-600 border-slate-500 text-white mt-1"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contact-company" className="text-slate-300">Company *</Label>
                      <Input
                        id="contact-company"
                        required
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="bg-slate-600 border-slate-500 text-white mt-1"
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact-message" className="text-slate-300">Message *</Label>
                      <Textarea
                        id="contact-message"
                        required
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="bg-slate-600 border-slate-500 text-white mt-1 h-32"
                        placeholder="Tell us about your consultant needs or questions..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
