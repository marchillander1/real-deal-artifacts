import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Building2, User, Zap, Target, Shield } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            💡 How MatchWise Works
          </h1>
        </div>
      </section>

      {/* Who is MatchWise for */}
      <section className="py-16 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Who is MatchWise for?
          </h2>
          <div className="max-w-4xl mx-auto">
            <ul className="space-y-4 text-lg text-slate-300">
              <li className="flex items-start">
                <span className="text-blue-400 mr-3">•</span>
                Companies tired of paying for "maybe" matches and endless CV piles.
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-3">•</span>
                Consulting firms that want to keep their consultants active without expensive bench time.
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-3">•</span>
                Independent consultants who want to stand out and actually get chosen — not just "exist" in a database.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Choose Your Path */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Choose your path right from the start
          </h2>

          {/* For Companies */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <Building2 className="h-8 w-8 text-blue-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">For Companies</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Performance Plan */}
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h4 className="text-xl font-bold text-blue-400 mb-4">🎯 Performance Plan</h4>
                <p className="text-slate-300 mb-4">For companies ready to win in the open market.</p>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Instant access to our external network of pre-vetted, market-ready consultants.
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Browse, filter, and find exactly who you need — fast.
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    No upfront costs, no retainers, no guesswork.
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Only pay a 2% success fee when the consultant actually starts.
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Simple. Fair. Risk-free.
                  </li>
                </ul>
              </div>

              {/* Talent Activation Plan */}
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h4 className="text-xl font-bold text-purple-400 mb-4">🧩 Talent Activation Plan</h4>
                <p className="text-slate-300 mb-4">For consulting firms wanting to stop losing money on idle consultants.</p>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Upload your entire bench via <Link to="/talent-activation" className="text-purple-300 hover:text-purple-200 underline">/talent-activation</Link>.
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Our AI analyzes and packages each consultant so they're not just visible, but irresistible.
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Full control: availability, pricing, and visibility (public or private).
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Keep your consultants active, visible, and billable — always.
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Only pay 2% when you actually place someone.
                  </li>
                </ul>
              </div>
            </div>

            {/* Internal Pro Plan */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h4 className="text-xl font-bold text-yellow-400 mb-4">💡 Internal Pro Plan</h4>
              <p className="text-slate-300 mb-4">For companies that want to level up internal teams.</p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Deep AI profiles: strengths, values, hidden superpowers.
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Build internal "dream teams" for projects or strategic initiatives.
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Automatically generate stunning internal presentations and reports.
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <strong className="text-white">Add-on: Whitelabel portal</strong> (offer your own branded experience)
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  No technical headaches, no hidden costs. Fixed price — talk to us.
                </li>
              </ul>
            </div>
          </div>

          {/* For Independent Consultants */}
          <div>
            <div className="flex items-center mb-8">
              <User className="h-8 w-8 text-green-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">For Independent Consultants</h3>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h4 className="text-xl font-bold text-green-400 mb-4">🔥 CV Upload</h4>
              <p className="text-slate-300 mb-4">For those tired of being just another file in someone's inbox.</p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Go to <Link to="/cv-upload" className="text-green-300 hover:text-green-200 underline">/cv-upload</Link>.
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Upload your CV and LinkedIn profile.
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Add a personal description to show who you really are beyond buzzwords.
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Our AI transforms your profile into a sleek, ready-to-pitch package.
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Become visible to top companies actively looking for talent. Stop waiting. Start landing gigs.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI Heavy Lifting */}
      <section className="py-16 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            💻 Let the AI do the heavy lifting
          </h2>
          <div className="max-w-4xl mx-auto text-slate-300 space-y-4">
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-blue-400 mr-3">•</span>
                Our AI doesn't just scan for keywords or "project manager" boxes.
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-3">•</span>
                It deeply understands each person: skills, personality, values, ambitions.
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-3">•</span>
                Finds hidden strengths most people miss, the unique traits that make you shine.
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-3">•</span>
                Instantly creates one-pagers and presentation decks that don't just look good — they sell.
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-3">•</span>
                Generates ready-to-go sales material without endless interviews or manual guesswork.
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-3">•</span>
                Positions every consultant in the best possible light, matching both technical needs and cultural fit.
              </li>
            </ul>
            <p className="text-lg font-medium text-white mt-6">
              The result? You stop guessing and start knowing. Your consultants don't just "fit on paper" but truly fit.
            </p>
          </div>
        </div>
      </section>

      {/* How AI Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            🤖 How does MatchWise AI really work?
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-slate-300 mb-6">
              We don't just scan keywords — we analyze the <em className="text-white">whole person</em>.
            </p>
            
            <p className="text-slate-300 mb-6">
              Our Human-First AI combines NLP (Natural Language Processing), semantic analysis, and advanced prompt engineering via Gemini AI to understand both technical skills and soft factors.
            </p>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-8">
              <h3 className="text-xl font-bold text-blue-400 mb-4">What does this mean?</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3">•</span>
                  We analyze CV structure, wording, role descriptions, and hidden signals to understand personality and working style.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3">•</span>
                  LinkedIn analysis covers profile text, recent posts & comments, tone of voice, and engagement patterns.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3">•</span>
                  We extract top values, preferred team dynamics, leadership style, and communication preferences.
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-8">
              <h3 className="text-xl font-bold text-purple-400 mb-4">Method in action:</h3>
              <div className="space-y-4 text-slate-300">
                <p><strong className="text-white">1️⃣</strong> Semantic analysis identifies personality traits (inspired by OCEAN and work psychology models), communication style (e.g., direct, storytelling), and value patterns.</p>
                <p><strong className="text-white">2️⃣</strong> Consultants can add a personal description — this is weighted heavily in the final AI profile to combine external signals with self-perception.</p>
                <p><strong className="text-white">3️⃣</strong> If signals are missing or unclear, we flag them as "inconclusive" and allow the consultant to clarify.</p>
              </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-8">
              <h3 className="text-xl font-bold text-green-400 mb-4">Why does it matter?</h3>
              <p className="text-slate-300 mb-4">
                Most project failures don't happen because of tech gaps — they happen due to poor cultural or personal fit.
                By deeply analyzing the human side, we help companies find consultants who don't just look good on paper but actually thrive in their teams and environments.
              </p>
              <p className="text-white font-medium">
                The result? Better matches, faster onboarding, stronger collaborations — and projects that win.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Match, Shortlist & Select */}
      <section className="py-16 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            🤝 Match, shortlist & select
          </h2>
          <div className="max-w-4xl mx-auto text-slate-300 space-y-4">
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-blue-400 mr-3">•</span>
                Companies log in at <Link to="/matchwiseai" className="text-blue-300 hover:text-blue-200 underline">/matchwiseai</Link>.
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-3">•</span>
                Search across all consultants — your own or external.
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-3">•</span>
                Filter not only by skills, but by deeper traits: values, team style, availability, price.
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-3">•</span>
                Build shortlists quickly, compare side-by-side, and save favorites.
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-3">•</span>
                Download AI-crafted CVs, pitch decks, and even personal cover letters so you're always ready to impress.
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-3">•</span>
                Confidently push forward profiles that won't just "look good" but deliver.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Only Pay When Real */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            💰 Only pay when it's real
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <ul className="space-y-4 text-lg text-slate-300">
              <li className="flex items-center justify-center">
                <span className="text-green-400 mr-3">✓</span>
                Zero cost to browse, analyze, or shortlist.
              </li>
              <li className="flex items-center justify-center">
                <span className="text-green-400 mr-3">✓</span>
                You only pay a 2% success fee when someone is actually placed (Performance & Talent Activation).
              </li>
              <li className="flex items-center justify-center">
                <span className="text-green-400 mr-3">✓</span>
                Internal Pro Plan? Fixed price, no surprise fees.
              </li>
              <li className="flex items-center justify-center">
                <span className="text-green-400 mr-3">✓</span>
                CV Upload? Always free for consultants.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Control & Transparency */}
      <section className="py-16 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            📊 Total control & full transparency
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <ul className="space-y-4 text-lg text-slate-300">
              <li className="flex items-center justify-center">
                <span className="text-blue-400 mr-3">•</span>
                Real-time dashboards to track requests, active consultants, and placements.
              </li>
              <li className="flex items-center justify-center">
                <span className="text-blue-400 mr-3">•</span>
                Update or tweak profiles anytime.
              </li>
              <li className="flex items-center justify-center">
                <span className="text-blue-400 mr-3">•</span>
                See what works, double down, and win more deals.
              </li>
            </ul>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default HowItWorks;