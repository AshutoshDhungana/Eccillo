import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";
import { Logo } from "../components/Logo";
import { SocialButtons } from "../components/SocialButtons";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const fieldWrap =
    "flex h-[56px] w-full items-center gap-3 rounded-full bg-white px-5";
  const input =
    "flex-1 bg-transparent font-['Helvetica_Now_Display:Light',sans-serif] text-[16px] text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a]/50";

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
        <Logo textClassName="text-white" markSize={30} className="text-white" />

        <div className="text-center text-white">
          <h2 className="font-['Georgia_Pro:Light_Italic',serif] text-[44px] italic leading-[1.2]">
            Welcome back
          </h2>
          <p className="mt-2 font-['Helvetica_Now_Display:Light',sans-serif] text-[16px] text-white/75">
            Sign in to continue to your account.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <div className={fieldWrap}>
            <Mail className="size-5 text-[#1e1e1e]" strokeWidth={2} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={input}
              required
            />
          </div>
          <div className={fieldWrap}>
            <Lock className="size-5 text-[#1e1e1e]" strokeWidth={2} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-[#1a1a1a]/75"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="h-[56px] w-full rounded-full bg-black font-['Helvetica_Now_Display:Medium',sans-serif] text-[16px] text-white transition-transform hover:scale-[1.01]"
        >
          Sign In
        </button>

        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-white/25" />
          <span className="font-['Helvetica_Now_Display:Light',sans-serif] text-[12px] text-white/60">
            or
          </span>
          <div className="h-px flex-1 bg-white/25" />
        </div>

        <SocialButtons onClick={() => navigate("/dashboard")} />

        <p className="font-['Helvetica_Now_Display:Light',sans-serif] text-[14px] text-white/75">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="font-['Helvetica_Now_Display:Medium',sans-serif] text-white underline-offset-2 hover:underline"
          >
            Sign up
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
