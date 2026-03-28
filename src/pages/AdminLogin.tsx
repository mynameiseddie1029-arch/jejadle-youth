import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "@/lib/storage";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await adminLogin(email, pw);
    setLoading(false);
    if (success) {
      toast.success("로그인 성공");
      navigate("/admin/dashboard");
    } else {
      toast.error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card rounded-2xl shadow-lg p-8 max-w-sm w-full animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-foreground">관리자 로그인</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            type="email"
            className="form-input"
          />
          <input
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호"
            type="password"
            className="form-input"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
        >
          ← 신청서로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
