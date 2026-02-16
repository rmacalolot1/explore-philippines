import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Crown, Sparkles, Eye, EyeOff } from "lucide-react";
import splashBg from "@/assets/splash-bg.jpg";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Account created! Please check your email to verify.");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-end bg-background overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: `url(${splashBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-foreground/15" />
      {/* Color accent overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8" />

      {/* Floating confetti */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 7 + 3,
            height: Math.random() * 7 + 3,
            background: [
              "hsl(18 90% 52%)",
              "hsl(42 95% 54%)",
              "hsl(338 80% 52%)",
              "hsl(168 70% 34%)",
              "hsl(252 65% 50%)",
            ][i % 5],
            top: `${5 + Math.random() * 35}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [0.7, 1.3, 0.7],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Top branding section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mt-16 mb-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
          className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl gradient-festive shadow-festive shimmer overflow-hidden"
        >
          <Crown className="h-9 w-9 text-primary-foreground relative z-10" />
        </motion.div>
        <h1 className="font-display text-6xl font-bold text-primary drop-shadow-md">SeekLakaw</h1>
        <p className="mt-2.5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground font-body">
          <Sparkles className="h-3.5 w-3.5 text-festival-gold" />
          <span className="tracking-wide">Discover Philippine Festivals</span>
          <Sparkles className="h-3.5 w-3.5 text-festival-gold" />
        </p>
      </motion.div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 w-full max-w-sm px-6 pb-10"
      >
        <div className="rounded-3xl glass-strong p-6 shadow-elevated">
          <h2 className="text-xl font-extrabold font-body text-card-foreground mb-1">
            {isLogin ? "Welcome Back" : "Join the Adventure"}
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            {isLogin ? "Sign in to continue exploring" : "Create your account to get started"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-card-foreground text-sm font-semibold">Display Name</Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Juan dela Cruz"
                  required={!isLogin}
                  className="h-12 rounded-xl bg-muted/40 border-border/40 focus:border-primary/50"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-card-foreground text-sm font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-12 rounded-xl bg-muted/40 border-border/40 focus:border-primary/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-card-foreground text-sm font-semibold">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="h-12 rounded-xl bg-muted/40 border-border/40 pr-12 focus:border-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-festive text-primary-foreground font-bold h-12 text-base shadow-festive hover:opacity-90 transition-all rounded-xl shimmer overflow-hidden"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                />
              ) : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Toggle */}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-primary hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
