import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRequests, isAdminLoggedIn, adminLogout, deleteRequest, type VisitRequest } from "@/lib/storage";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function generatePDF(requests: VisitRequest[], title: string) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.text(`출력일: ${new Date().toLocaleDateString("ko-KR")}`, 14, 28);

  const rows = requests.map((r, i) => [
    i + 1,
    r.name,
    r.grade,
    r.phone,
    r.reason,
    r.date,
    r.time,
    r.method,
    r.prayer || "-",
    new Date(r.created_at).toLocaleDateString("ko-KR"),
  ]);

  autoTable(doc, {
    startY: 34,
    head: [["#", "이름", "학년", "연락처", "사유", "날짜", "시간", "방법", "기도제목", "신청일"]],
    body: rows,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [0, 183, 182] },
  });

  doc.save(`${title}.pdf`);
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const loggedIn = await isAdminLoggedIn();
      if (!loggedIn) {
        navigate("/admin");
        return;
      }
      const data = await getRequests();
      setRequests(data);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const handleDelete = async (id: string) => {
    const success = await deleteRequest(id);
    if (success) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("삭제되었습니다.");
    } else {
      toast.error("삭제에 실패했습니다.");
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-xl font-bold text-foreground">심방 신청서 관리</h1>
            <p className="text-sm text-muted-foreground">총 {requests.length}건</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (requests.length === 0) { toast.error("신청서가 없습니다."); return; }
                generatePDF(requests, "제자들교회_심방신청서_전체");
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              📄 일괄 다운로드
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-sm p-12 text-center animate-fade-in">
            <p className="text-muted-foreground">아직 신청서가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="bg-card rounded-2xl shadow-sm p-5 animate-fade-in border border-border">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{r.name}</span>
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{r.grade}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.phone}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Tag label="사유" value={r.reason} />
                      <Tag label="날짜" value={r.date} />
                      <Tag label="시간" value={r.time} />
                      <Tag label="방법" value={r.method} />
                    </div>
                    {r.prayer && (
                      <p className="text-sm text-muted-foreground mt-2 bg-muted rounded-lg p-2.5">
                        🙏 {r.prayer}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      신청일: {new Date(r.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0 ml-4">
                    <button
                      onClick={() => generatePDF([r], `심방신청서_${r.name}`)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="PDF 다운로드"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="삭제"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
      <span className="font-medium">{label}</span> {value}
    </span>
  );
}

export default AdminDashboard;
