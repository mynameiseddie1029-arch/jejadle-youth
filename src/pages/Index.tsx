import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addRequest } from "@/lib/storage";
import { toast } from "sonner";

const REASONS = ["개인사", "학업", "가정사", "친구 관계", "연애"];
const DAYS = ["금요일", "토요일", "일요일"];
const METHODS = ["점심 식사", "저녁 식사", "카페", "교회", "전화", "카톡"];

const Index = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    grade: "",
    phone: "",
    reason: "",
    customReason: "",
    date: "",
    time: "",
    method: "",
    customMethod: "",
    prayer: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.grade || !form.phone || !form.date || !form.time) {
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }
    const reason = form.reason === "직접 입력" ? form.customReason : form.reason;
    const method = form.method === "직접 입력" ? form.customMethod : form.method;
    if (!reason || !method) {
      toast.error("심방 사유와 방법을 선택해주세요.");
      return;
    }
    setLoading(true);
    const success = await addRequest({
      name: form.name,
      grade: form.grade,
      phone: form.phone,
      reason,
      date: form.date,
      time: form.time,
      method,
      prayer: form.prayer,
    });
    setLoading(false);
    if (success) {
      setSubmitted(true);
    } else {
      toast.error("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card rounded-2xl shadow-lg p-8 max-w-md w-full text-center animate-fade-in">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">신청이 완료되었습니다!</h2>
          <p className="text-muted-foreground text-sm">담당 사역자가 곧 연락드리겠습니다.</p>
          <button
            onClick={() => { setSubmitted(false); setForm({ name: "", grade: "", phone: "", reason: "", customReason: "", date: "", time: "", method: "", customMethod: "", prayer: "" }); }}
            className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            새 신청서 작성
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-accent-foreground px-4 py-1.5 rounded-full text-xs font-medium mb-4">
            ✝️ 제자들교회 청소년부
          </div>
          <h1 className="text-2xl font-bold text-foreground">심방 신청서</h1>
          <p className="text-muted-foreground text-sm mt-1">아래 항목을 작성해주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
          <Field label="이름" required>
            <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="이름을 입력해주세요" className="form-input" />
          </Field>

          <Field label="학년" required>
            <input value={form.grade} onChange={(e) => update("grade", e.target.value)} placeholder="예: 중1, 고2" className="form-input" />
          </Field>

          <Field label="핸드폰 번호" required>
            <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="010-0000-0000" className="form-input" type="tel" />
          </Field>

          <Field label="심방 사유" required>
            <ChipSelect options={[...REASONS, "직접 입력"]} value={form.reason} onChange={(v) => update("reason", v)} />
            {form.reason === "직접 입력" && (
              <input value={form.customReason} onChange={(e) => update("customReason", e.target.value)} placeholder="사유를 직접 입력해주세요" className="form-input mt-2" />
            )}
          </Field>

          <Field label="심방 날짜" required>
            <ChipSelect options={DAYS} value={form.date} onChange={(v) => update("date", v)} />
          </Field>

          <Field label="시간" required>
            <input value={form.time} onChange={(e) => update("time", e.target.value)} placeholder="예: 오후 2시" className="form-input" />
          </Field>

          <Field label="심방 방법" required>
            <ChipSelect options={[...METHODS, "직접 입력"]} value={form.method} onChange={(v) => update("method", v)} />
            {form.method === "직접 입력" && (
              <input value={form.customMethod} onChange={(e) => update("customMethod", e.target.value)} placeholder="방법을 직접 입력해주세요" className="form-input mt-2" />
            )}
          </Field>

          <Field label="요청 사항 및 기도 제목">
            <textarea value={form.prayer} onChange={(e) => update("prayer", e.target.value)} placeholder="자유롭게 작성해주세요" rows={3} className="form-input resize-none" />
          </Field>

          <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-base hover:opacity-90 transition-opacity shadow-md disabled:opacity-50">
            {loading ? "신청 중..." : "신청하기"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => navigate("/admin")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            관리자 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </div>
  );
}

function ChipSelect({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border ${
            value === opt
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card text-foreground border-border hover:border-primary/50"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default Index;
