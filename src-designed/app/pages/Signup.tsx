import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";
import { Logo } from "../components/Logo";
import { SocialButtons } from "../components/SocialButtons";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const fieldWrap =
    "flex h-[56px] w-full items-center gap-3 rounded-full border border-white/40 bg-white px-5";
  const input =
    "flex-1 bg-transparent font-['Helvetica_Now_Display:Light',sans-serif] text-[16px] text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a]/50";

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
        <Logo textClassName="text-white" markSize={30} className="text-white" />

        <div className="text-center text-white">
          <h2 className="font-['Georgia_Pro:Light_Italic',serif] text-[44px] italic leading-[1.2]">
            Create your account
          </h2>
          <p className="mt-2 font-['Helvetica_Now_Display:Light',sans-serif] text-[16px] text-white/75">
            Sign up to start planning your events
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <div className={fieldWrap}>
            <User className="size-5 text-[#1a1a1a]" strokeWidth={2} />
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={set("name")}
              className={input}
              required
            />
          </div>
          <div className={fieldWrap}>
            <Mail className="size-5 text-[#1a1a1a]" strokeWidth={2} />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={set("email")}
              className={input}
              required
            />
          </div>
          <div className={fieldWrap}>
            <Lock className="size-5 text-[#1a1a1a]" strokeWidth={2} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={set("password")}
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
          <div className={fieldWrap}>
            <Lock className="size-5 text-[#1a1a1a]" strokeWidth={2} />
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              value={form.confirm}
              onChange={set("confirm")}
              className={input}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="text-[#1a1a1a]/75"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="h-[56px] w-full rounded-full bg-black font-['Helvetica_Now_Display:Medium',sans-serif] text-[16px] text-white transition-transform hover:scale-[1.01]"
        >
          Create Account
        </button>

        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-white/25" />
          <span className="font-['Helvetica_Now_Display:Regular',sans-serif] text-[12px] text-white/60">
            or
          </span>
          <div className="h-px flex-1 bg-white/25" />
        </div>

        <SocialButtons onClick={() => navigate("/dashboard")} />

        <p className="font-['Helvetica_Now_Display:Light',sans-serif] text-[14px] text-white/75">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-['Helvetica_Now_Display:Medium',sans-serif] text-white underline-offset-2 hover:underline"
          >
            Sign in
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
