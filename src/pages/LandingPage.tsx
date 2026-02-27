// import { useNavigate } from 'react-router-dom';
// import {
//   MessageSquare, Shield, Users, ArrowRight, Lock, Sparkles,
//   TrendingUp, Target, Eye, Star, Zap, CheckCircle,
//   Twitter, Linkedin, Github, Mail, Globe, BookOpen,
//   DollarSign, HelpCircle, ShieldCheck, Users2,
//   Brain
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useEffect, useState, useRef } from 'react';
// import { useAuth } from '@/hooks/useAuth';

// const LandingPage = () => {
//   const navigate = useNavigate();
//   const { userEmail, isAdmin } = useAuth();
//   const [isVisible, setIsVisible] = useState(false);
//   const [animatedStats, setAnimatedStats] = useState([false, false, false, false]);
//   const [animatedFeatures, setAnimatedFeatures] = useState([false, false, false]);

//   const statsRef = useRef<HTMLDivElement>(null);
//   const featuresRef = useRef<HTMLDivElement>(null);
//   const ctaRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     setIsVisible(true);

//     // Animate stats with delay
//     const timer1 = setTimeout(() => setAnimatedStats([true, false, false, false]), 200);
//     const timer2 = setTimeout(() => setAnimatedStats([true, true, false, false]), 300);
//     const timer3 = setTimeout(() => setAnimatedStats([true, true, true, false]), 400);
//     const timer4 = setTimeout(() => setAnimatedStats([true, true, true, true]), 500);

//     return () => {
//       clearTimeout(timer1);
//       clearTimeout(timer2);
//       clearTimeout(timer3);
//       clearTimeout(timer4);
//     };
//   }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             if (entry.target === featuresRef.current) {
//               // Animate features with delay
//               setTimeout(() => setAnimatedFeatures([true, false, false]), 100);
//               setTimeout(() => setAnimatedFeatures([true, true, false]), 200);
//               setTimeout(() => setAnimatedFeatures([true, true, true]), 300);
//             }
//           }
//         });
//       },
//       { threshold: 0.3, rootMargin: '0px 0px -50px 0px' }
//     );

//     if (featuresRef.current) observer.observe(featuresRef.current);
//     if (ctaRef.current) observer.observe(ctaRef.current);

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float-slow"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-float-slow-reverse"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-pulse-glow"></div>

//         {/* Floating particles */}
//         {[...Array(10)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-1 h-1 bg-primary/20 rounded-full"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animation: `float-particle ${Math.random() * 10 + 10}s infinite ease-in-out ${Math.random() * 5}s`
//             }}
//           />
//         ))}
//       </div>

//       {/* Navigation Header */}
//       {/* <div className="absolute top-6 right-6 z-50 animate-fade-in-down hidden md:block">
//         <div className="flex items-center gap-6 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-border/50">
//           <button 
//             onClick={() => navigate('/about')}
//             className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
//           >
//             <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
//             About
//           </button>
//           <button 
//             onClick={() => navigate('/how-it-works')}
//             className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
//           >
//             <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
//             How It Works
//           </button>
//           <button 
//             onClick={() => navigate('/pricing')}
//             className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
//           >
//             <DollarSign className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
//             Pricing
//           </button>
//           <button 
//             onClick={() => navigate('/contact')}
//             className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
//           >
//             <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
//             Contact
//           </button>
//         </div>
//       </div> */}

//       {/* Mobile Navigation */}
//       <div className="absolute top-6 right-6 z-50 animate-fade-in-down md:hidden">
//         <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg border border-border/50">
//           <HelpCircle className="w-6 h-6 text-foreground" />
//         </div>
//       </div>

//       <div className={`max-w-6xl w-full transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

//         {/* Hero Section */}
//         <div className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white rounded-3xl p-8 md:p-12 overflow-hidden mb-8 shadow-2xl shadow-primary/20 animate-fade-in">
//           {/* Animated Background Pattern */}
//           <div className="absolute inset-0 opacity-10">
//             <div
//               className="absolute inset-0 animate-grid-move"
//               style={{
//                 backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
//                 backgroundSize: '100px 100px'
//               }}
//             ></div>
//           </div>

//           {/* Floating Elements */}
//           <div className="absolute top-6 right-6 animate-float">
//             <Sparkles className="w-8 h-8 text-accent/40" />
//           </div>

//           <div className="absolute bottom-6 left-6 animate-float-delayed">
//             <Star className="w-6 h-6 text-white/30" />
//           </div>

//           <div className="relative z-10">
//             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
//               <div className="flex-1 animate-slide-in-left">
//                 {/* <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-scale-in">
//                   <TrendingUp className="w-4 h-4" />
//                   <span className="text-sm font-medium">Trusted by 500+ organizations</span>
//                 </div> */}

//                 <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight animate-fade-in-up">
//                   Share Your <span className="text-accent animate-gradient-text">Voice</span>,
//                   <br />
//                   Shape The <span className="text-accent animate-gradient-text-delayed">Future</span>
//                 </h1>

//                 <p className="text-xl text-white/90 mb-8 max-w-2xl leading-relaxed animate-fade-in-up-delayed">
//                   An <span className="font-semibold">AI-Powered, secure platform</span> for honest 360° feedback that transforms leadership and drives organizational excellence.
//                 </p>

//                 <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up-delayed-2">
//                   <Button
//                     onClick={() => navigate('/feedback')}
//                     className="vox-btn-primary group px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden animate-button-shimmer"
//                     size="lg"
//                   >
//                     <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></span>
//                     Start Giving Feedback
//                     <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
//                   </Button>

//                   {isAdmin && (
//                     <Button
//                       onClick={() => navigate('/admin')}
//                       variant="outline"
//                       className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-2xl hover:scale-[1.02] transition-all duration-300"
//                       size="lg"
//                     >
//                       <Eye className="mr-3 w-5 h-5" />
//                       Admin Dashboard
//                     </Button>
//                   )}
//                 </div>
//               </div>

//               <div className="flex-shrink-0 animate-scale-in-rotate">
//                 <div className="relative w-64 h-64 md:w-80 md:h-80">
//                   <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full animate-pulse-slow"></div>
//                   <div className="absolute inset-4 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full animate-spin-slow"></div>
//                   <div className="absolute inset-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300">
//                     <MessageSquare className="w-32 h-32 text-white" />
//                   </div>
//                   <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center animate-float">
//                     <Zap className="w-8 h-8 text-accent" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats Section */}
//         <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
//           {[
//             { value: "AI-Powered", label: "Predictive Analytics" },
//             { value: "360°", label: "Comprehensive Insights" },
//             { value: "Insight-driven", label: "Analytics Platform" },
//             { value: "0", label: "Personal Data Stored" }
//           ].map((stat, index) => (
//             <div
//               key={index}
//               className={`bg-white rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] ${animatedStats[index] ? 'animate-scale-in-stats opacity-100' : 'opacity-0'
//                 }`}
//               style={{ animationDelay: `${index * 100}ms` }}
//             >
//               <div className="text-3xl font-bold text-primary mb-2 hover:scale-110 transition-transform duration-300 inline-block">
//                 {stat.value}
//               </div>
//               <div className="text-sm text-muted-foreground font-medium">
//                 {stat.label}
//               </div>
//               <div
//                 className="h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-4 animate-width-grow"
//                 style={{ animationDelay: `${index * 100 + 200}ms` }}
//               />
//             </div>
//           ))}
//         </div>

//         {/* Trust Indicators */}
//         {/* <div className="mb-12 text-center animate-fade-in">
//           <h3 className="text-xl font-semibold text-muted-foreground mb-6">Trusted by forward-thinking organizations</h3>
//           <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 opacity-70">
//             <div className="w-28 h-10 md:w-32 md:h-12 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-300">
//               <span className="font-bold text-primary text-sm md:text-base">TECH CORP</span>
//             </div>
//             <div className="w-28 h-10 md:w-32 md:h-12 bg-gradient-to-r from-secondary/5 to-secondary/10 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-300">
//               <span className="font-bold text-secondary text-sm md:text-base">INNOVA INC</span>
//             </div>
//             <div className="w-28 h-10 md:w-32 md:h-12 bg-gradient-to-r from-accent/5 to-accent/10 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-300">
//               <span className="font-bold text-accent text-sm md:text-base">GROWTH CO</span>
//             </div>
//             <div className="w-28 h-10 md:w-32 md:h-12 bg-gradient-to-r from-primary/5 to-secondary/10 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-300">
//               <span className="font-bold text-foreground text-sm md:text-base">LEADERSHIP LAB</span>
//             </div>
//           </div>
//         </div> */}

//         {/* Features Section */}
//         <div ref={featuresRef} className="mb-12">
//           <div className="text-center mb-10 animate-fade-in-up">
//             <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Vox?</h2>
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//               Built with privacy and impact in mind, our platform ensures every voice matters
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6">
//             {[
//               // {
//               //   icon: <Lock className="w-8 h-8 text-secondary" />,
//               //   title: "Truly Anonymous Feedback",
//               //   description: "We designed Vox to never know who you are. From submission to analysis, your feedback remains completely detached from your identity."
//               // },
//               {
//                 icon: <Brain className="w-8 h-8 text-secondary" />,
//                 title: "AI-Powered Sentiment Analysis",
//                 description: "Our advanced NLP models automatically detect emotional tone, urgency, and sentiment patterns across all feedback, surfacing what matters most."
//               },
//               {
//                 icon: <Users className="w-8 h-8 text-secondary" />,
//                 title: "Actionable Insights",
//                 description: "Advanced analytics turn feedback into clear action plans. Track progress and measure improvement over time."
//               },
//               {
//                 icon: <Eye className="w-8 h-8 text-secondary" />,
//                 title: "Leadership Development Intelligence",
//                 description: "Gain visibility into leadership effectiveness across your organization. Our dashboard highlights patterns, trends, and opportunities for meaningful professional growth."
//               },
//             ].map((feature, index) => (
//               <div
//                 key={index}
//                 className={`group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden ${animatedFeatures[index] ? 'animate-slide-up-features opacity-100' : 'opacity-0 translate-y-10'
//                   }`}
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-600"></div>
//                 <div className="relative z-10">
//                   <div className="inline-flex p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
//                     {feature.icon}
//                   </div>
//                   <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
//                   <p className="text-muted-foreground mb-4">{feature.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Final CTA */}
//         <div ref={ctaRef} className="relative bg-gradient-to-br from-foreground to-foreground/90 text-white rounded-3xl p-12 overflow-hidden shadow-2xl animate-fade-in-up">
//           <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] animate-grid-move-slow"></div>

//           {/* Floating checkmarks */}
//           {[...Array(3)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute text-accent/20 animate-checkmark-float"
//               style={{
//                 left: `${Math.random() * 70 + 15}%`,
//                 top: `${Math.random() * 70 + 15}%`,
//                 animationDelay: `${i * 0.5}s`
//               }}
//             >
//               <CheckCircle className="w-8 h-8" />
//             </div>
//           ))}

//           <div className="relative z-10 text-center">
//             <div className="w-16 h-16 mx-auto mb-6 hover:rotate-180 transition-transform duration-600">
//               <Target className="w-16 h-16 text-accent" />
//             </div>

//             <h2 className="text-4xl font-bold mb-4 animate-typewriter">Ready to Transform Your Organization?</h2>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-delayed">
//               <Button
//                 onClick={() => navigate('/feedback')}
//                 className="bg-white text-foreground hover:bg-white/90 px-10 py-7 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] font-semibold relative overflow-hidden group"
//                 size="lg"
//               >
//                 <span className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600"></span>
//                 <span className="relative z-10">Start Free Feedback Session</span>
//               </Button>
//               {isAdmin && (
//                 <Button
//                   onClick={() => {
//                     navigate('/admin');
//                     window.scrollTo(0, 0);
//                   }}
//                   variant="outline"
//                   className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-10 py-7 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] font-semibold"
//                   size="lg"
//                 >
//                   Explore Admin Features
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-12 text-center text-sm text-muted-foreground animate-fade-in">
//           {/* Social Media Links */}
//           <div className="flex justify-center gap-6 mb-6">
//             <a
//               href="https://twitter.com/vox-feedback"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all duration-300 group"
//               title="Follow us on Twitter"
//             >
//               <Twitter className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
//             </a>
//             <a
//               href="https://linkedin.com/company/voxfeedback"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all duration-300 group"
//               title="Connect on LinkedIn"
//             >
//               <Linkedin className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
//             </a>
//             <a
//               href="https://github.com/voxfeedback"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all duration-300 group"
//               title="Check our GitHub"
//             >
//               <Github className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
//             </a>
//             <a
//               href="mailto:contact@voxfeedback.com"
//               className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all duration-300 group"
//               title="Email us"
//             >
//               <Mail className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
//             </a>
//           </div>

//           {/* Legal and Info Links */}
//           <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6 text-foreground/80">
//             <button
//               onClick={() => navigate('/privacy')}
//               className="text-sm hover:text-primary transition-colors duration-300 flex items-center gap-1 group"
//             >
//               <ShieldCheck className="w-3 h-3 group-hover:scale-125 transition-transform duration-300" />
//               Privacy Policy
//             </button>
//             <button
//               onClick={() => navigate('/terms')}
//               className="text-sm hover:text-primary transition-colors duration-300"
//             >
//               Terms of Service
//             </button>
//             <button
//               onClick={() => navigate('/security')}
//               className="text-sm hover:text-primary transition-colors duration-300 flex items-center gap-1 group"
//             >
//               <Shield className="w-3 h-3 group-hover:scale-125 transition-transform duration-300" />
//               Security
//             </button>
//             <button
//               onClick={() => navigate('/careers')}
//               className="text-sm hover:text-primary transition-colors duration-300 flex items-center gap-1 group"
//             >
//               <Users2 className="w-3 h-3 group-hover:scale-125 transition-transform duration-300" />
//               Careers
//             </button>
//             <button
//               onClick={() => navigate('/blog')}
//               className="text-sm hover:text-primary transition-colors duration-300 flex items-center gap-1 group"
//             >
//               <BookOpen className="w-3 h-3 group-hover:scale-125 transition-transform duration-300" />
//               Blog
//             </button>
//           </div>

//           <p className="mb-2">
//             Vox is an enterprise-grade confidential feedback platform designed to collect anonymous 360° input
//             regarding organizational leadership and management performance.
//           </p>
//           <p>© {new Date().getFullYear()} Vox Feedback Platform. All rights reserved.</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;




import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Shield, Users, ArrowRight, Lock, Sparkles,
  TrendingUp, Target, Eye, Star, Zap, CheckCircle,
  Twitter, Linkedin, Github, Mail, Globe, BookOpen,
  DollarSign, HelpCircle, ShieldCheck, Users2,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

const LandingPage = () => {
  const navigate = useNavigate();
  const { userEmail, isAdmin, isLoading: authLoading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState([false, false, false, false]);
  const [animatedFeatures, setAnimatedFeatures] = useState([false, false, false]);

  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);

    // Animate stats with delay
    const timer1 = setTimeout(() => setAnimatedStats([true, false, false, false]), 200);
    const timer2 = setTimeout(() => setAnimatedStats([true, true, false, false]), 300);
    const timer3 = setTimeout(() => setAnimatedStats([true, true, true, false]), 400);
    const timer4 = setTimeout(() => setAnimatedStats([true, true, true, true]), 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === featuresRef.current) {
              // Animate features with delay
              setTimeout(() => setAnimatedFeatures([true, false, false]), 100);
              setTimeout(() => setAnimatedFeatures([true, true, false]), 200);
              setTimeout(() => setAnimatedFeatures([true, true, true]), 300);
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -50px 0px' }
    );

    if (featuresRef.current) observer.observe(featuresRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-float-slow-reverse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-pulse-glow"></div>

        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${Math.random() * 10 + 10}s infinite ease-in-out ${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="absolute top-6 right-6 z-50 animate-fade-in-down md:hidden">
        <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg border border-border/50">
          <HelpCircle className="w-6 h-6 text-foreground" />
        </div>
      </div>

      <div className={`max-w-6xl w-full transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white rounded-3xl p-8 md:p-12 overflow-hidden mb-8 shadow-2xl shadow-primary/20 animate-fade-in">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0 animate-grid-move"
              style={{
                backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
                backgroundSize: '100px 100px'
              }}
            ></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-6 right-6 animate-float">
            <Sparkles className="w-8 h-8 text-accent/40" />
          </div>

          <div className="absolute bottom-6 left-6 animate-float-delayed">
            <Star className="w-6 h-6 text-white/30" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 animate-slide-in-left">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight animate-fade-in-up">
                  Share Your <span className="text-accent animate-gradient-text">Voice</span>,
                  <br />
                  Shape The <span className="text-accent animate-gradient-text-delayed">Future</span>
                </h1>

                <p className="text-xl text-white/90 mb-8 max-w-2xl leading-relaxed animate-fade-in-up-delayed">
                  An <span className="font-semibold">AI-Powered, secure platform</span> for honest 360° feedback that transforms leadership and drives organizational excellence.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up-delayed-2">
                  <Button
                    onClick={() => navigate('/feedback')}
                    className="vox-btn-primary group px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden animate-button-shimmer"
                    size="lg"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></span>
                    Start Giving Feedback
                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>

                  {/* Admin button - only show if user is authenticated as admin */}
                  {isAdmin && (
                    <Button
                      onClick={() => navigate('/admin')}
                      variant="outline"
                      className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-2xl hover:scale-[1.02] transition-all duration-300"
                      size="lg"
                    >
                      <Eye className="mr-3 w-5 h-5" />
                      Admin Dashboard
                    </Button>
                  )}
                </div>

                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 text-xs text-white/50">
                    Auth Status: {authLoading ? 'Loading' : isAdmin ? 'Admin' : 'Not Admin'}
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 animate-scale-in-rotate">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full animate-pulse-slow"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300">
                    <MessageSquare className="w-32 h-32 text-white" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center animate-float">
                    <Zap className="w-8 h-8 text-accent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { value: "AI-Powered", label: "Predictive Analytics" },
            { value: "360°", label: "Comprehensive Insights" },
            { value: "Insight-driven", label: "Analytics Platform" },
            { value: "0", label: "Personal Data Stored" }
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] ${animatedStats[index] ? 'animate-scale-in-stats opacity-100' : 'opacity-0'
                }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl font-bold text-primary mb-2 hover:scale-110 transition-transform duration-300 inline-block">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
              <div
                className="h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-4 animate-width-grow"
                style={{ animationDelay: `${index * 100 + 200}ms` }}
              />
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div ref={featuresRef} className="mb-12">
          <div className="text-center mb-10 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Vox?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with privacy and impact in mind, our platform ensures every voice matters
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Brain className="w-8 h-8 text-secondary" />,
                title: "AI-Powered Sentiment Analysis",
                description: "Our advanced NLP models automatically detect emotional tone, urgency, and sentiment patterns across all feedback, surfacing what matters most."
              },
              {
                icon: <Users className="w-8 h-8 text-secondary" />,
                title: "Actionable Insights",
                description: "Advanced analytics turn feedback into clear action plans. Track progress and measure improvement over time."
              },
              {
                icon: <Eye className="w-8 h-8 text-secondary" />,
                title: "Leadership Development Intelligence",
                description: "Gain visibility into leadership effectiveness across your organization. Our dashboard highlights patterns, trends, and opportunities for meaningful professional growth."
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden ${animatedFeatures[index] ? 'animate-slide-up-features opacity-100' : 'opacity-0 translate-y-10'
                  }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-600"></div>
                <div className="relative z-10">
                  <div className="inline-flex p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div ref={ctaRef} className="relative bg-gradient-to-br from-foreground to-foreground/90 text-white rounded-3xl p-12 overflow-hidden shadow-2xl animate-fade-in-up">
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] animate-grid-move-slow"></div>

          {/* Floating checkmarks */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute text-accent/20 animate-checkmark-float"
              style={{
                left: `${Math.random() * 70 + 15}%`,
                top: `${Math.random() * 70 + 15}%`,
                animationDelay: `${i * 0.5}s`
              }}
            >
              <CheckCircle className="w-8 h-8" />
            </div>
          ))}

          <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto mb-6 hover:rotate-180 transition-transform duration-600">
              <Target className="w-16 h-16 text-accent" />
            </div>

            <h2 className="text-4xl font-bold mb-4 animate-typewriter">Ready to Transform Your Organization?</h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-delayed">
              <Button
                onClick={() => navigate('/feedback')}
                className="bg-white text-foreground hover:bg-white/90 px-10 py-7 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] font-semibold relative overflow-hidden group"
                size="lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600"></span>
                <span className="relative z-10">Start Free Feedback Session</span>
              </Button>
              
              {/* Admin button in CTA section */}
              {isAdmin && (
                <Button
                  onClick={() => {
                    navigate('/admin');
                    window.scrollTo(0, 0);
                  }}
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-10 py-7 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] font-semibold"
                  size="lg"
                >
                  Explore Admin Features
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground animate-fade-in">
          {/* Social Media Links */}
          <div className="flex justify-center gap-6 mb-6">
            <a
              href="https://twitter.com/vox-feedback"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all duration-300 group"
              title="Follow us on Twitter"
            >
              <Twitter className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a
              href="https://linkedin.com/company/voxfeedback"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all duration-300 group"
              title="Connect on LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a
              href="https://github.com/voxfeedback"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all duration-300 group"
              title="Check our GitHub"
            >
              <Github className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            </a>
            <a
              href="mailto:contact@voxfeedback.com"
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:scale-110 transition-all duration-300 group"
              title="Email us"
            >
              <Mail className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            </a>
          </div>

          {/* Legal and Info Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6 text-foreground/80">
            <button
              onClick={() => navigate('/privacy')}
              className="text-sm hover:text-primary transition-colors duration-300 flex items-center gap-1 group"
            >
              <ShieldCheck className="w-3 h-3 group-hover:scale-125 transition-transform duration-300" />
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/terms')}
              className="text-sm hover:text-primary transition-colors duration-300"
            >
              Terms of Service
            </button>
            <button
              onClick={() => navigate('/security')}
              className="text-sm hover:text-primary transition-colors duration-300 flex items-center gap-1 group"
            >
              <Shield className="w-3 h-3 group-hover:scale-125 transition-transform duration-300" />
              Security
            </button>
            <button
              onClick={() => navigate('/careers')}
              className="text-sm hover:text-primary transition-colors duration-300 flex items-center gap-1 group"
            >
              <Users2 className="w-3 h-3 group-hover:scale-125 transition-transform duration-300" />
              Careers
            </button>
            <button
              onClick={() => navigate('/blog')}
              className="text-sm hover:text-primary transition-colors duration-300 flex items-center gap-1 group"
            >
              <BookOpen className="w-3 h-3 group-hover:scale-125 transition-transform duration-300" />
              Blog
            </button>
          </div>

          <p className="mb-2">
            Vox is an enterprise-grade confidential feedback platform designed to collect anonymous 360° input
            regarding organizational leadership and management performance.
          </p>
          <p>© {new Date().getFullYear()} Vox Feedback Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;