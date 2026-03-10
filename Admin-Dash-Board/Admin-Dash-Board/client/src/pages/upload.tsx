import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Upload,
  FolderUp,
  FileText,
  CheckCircle2,
  X,
  ArrowRight,
  Table2,
  AlertCircle,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { uploadDataset } from "@/lib/api";

interface UploadedFile {
  name: string;
  size: string;
  columns: string[];
  rows: number;
}

export default function UploadPage() {
  const [, navigate] = useLocation();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    document.title = "Upload Data - InsightAI";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);

    const response = await uploadDataset(file);

    if (response?.error) {
      setIsProcessing(false);
      // In a future iteration, we could surface this via toast or inline message.
      return;
    }

    const rows = Number(response.rows) || 0;
    const columns = Number(response.columns) || 0;
    const columnNames: string[] = Array.isArray(response.column_names)
      ? response.column_names
      : [];

    // Save to localStorage
    try {
      localStorage.setItem("uploadedFile", file.name);
      localStorage.setItem("uploadedRows", String(rows));
      localStorage.setItem("uploadedColumns", String(columns));
      localStorage.setItem("uploadedColumnNames", JSON.stringify(columnNames));
      localStorage.setItem("lastUploadTime", Date.now().toString());
    } catch {
      // ignore storage errors
    }

    const sizeInMB = file.size / (1024 * 1024);
    const formattedSize =
      sizeInMB >= 1
        ? `${sizeInMB.toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(1)} KB`;

    setUploadedFile({
      name: file.name,
      size: formattedSize,
      columns: columnNames,
      rows,
    });

    setIsProcessing(false);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        void handleFileUpload(file);
      }
    },
    []
  );

  const handleFileInput = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        void handleFileUpload(file);
      }
    };
    input.click();
  };

  const handleStartAnalyzing = async () => {
    // Fetch summary data from backend to pass to Dashboard-Mirror
    try {
      const res = await fetch("http://localhost:8000/summary");
      if (res.ok) {
        const summary = await res.json();
        localStorage.setItem("insightai_dashboard_data", JSON.stringify({
          chart: "bar",
          title: "Dataset Analysis",
          data: summary.data || [],
          insight: summary.summary || "",
          columns: summary.column_names || [],
          rows: summary.rows || 0,
        }));
      }
    } catch (e) {
      console.warn("Could not fetch summary, dashboard will use sample data:", e);
    }
    // Open Dashboard-Mirror with the data
    window.open("http://localhost:5000/dashboard", "_blank");
  };

  return (
    <AppLayout title="Upload Dataset">
      <div className="max-w-3xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-[#1C2434] mb-2" data-testid="text-upload-title">
            Upload Your Dataset
          </h1>
          <p className="text-[#64748B]">
            Upload your CSV dataset to start analyzing your data with AI-powered insights.
          </p>
        </motion.div>

        {!uploadedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer ${
                isDragOver
                  ? "border-[#465FFF] bg-[#465FFF]/5"
                  : "border-[#E2E8F0] bg-white hover:border-[#465FFF]/40 hover:bg-[#F8FAFC]"
              }`}
              data-testid="dropzone-upload"
            >
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-[#F1F5F9] rounded-2xl flex items-center justify-center">
                    <FolderUp className="w-10 h-10 text-[#94A3B8]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#1C2434] rounded-full flex items-center justify-center">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-[#1C2434] mb-2" data-testid="text-upload-heading">
                  Upload your files
                </h3>
                <p className="text-sm text-[#64748B] mb-6">
                  Drag and drop your files here or{" "}
                  <button
                    onClick={handleFileInput}
                    className="text-[#465FFF] font-medium hover:underline"
                    data-testid="button-choose-files"
                  >
                    choose files
                  </button>
                </p>

                <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                  <span>CSV files supported</span>
                  <span className="w-1 h-1 bg-[#94A3B8] rounded-full" />
                  <span>Max 50MB</span>
                </div>
              </div>

              {isProcessing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-[#465FFF] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-[#1C2434]">Processing file...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: FileText, title: "CSV Format", desc: "Standard comma-separated values" },
                { icon: Table2, title: "Auto Detection", desc: "Columns detected automatically" },
                { icon: AlertCircle, title: "Secure Upload", desc: "Your data stays private" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 border border-[#E2E8F0] text-center"
                  data-testid={`card-info-${i}`}
                >
                  <div className="w-10 h-10 bg-[#F1F5F9] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-5 h-5 text-[#465FFF]" />
                  </div>
                  <p className="text-sm font-medium text-[#1C2434]">{item.title}</p>
                  <p className="text-xs text-[#94A3B8] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
              <div className="p-6 border-b border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#1C2434]" data-testid="text-file-name">
                        {uploadedFile.name}
                      </h3>
                      <p className="text-sm text-[#64748B]">
                        {uploadedFile.size} · {uploadedFile.rows.toLocaleString()} rows
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="p-2 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8]"
                    data-testid="button-remove-file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-sm font-semibold text-[#1C2434] mb-4">
                  Columns detected ({uploadedFile.columns.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {uploadedFile.columns.map((col) => (
                    <div
                      key={col}
                      className="flex items-center gap-2 bg-[#F8FAFC] rounded-xl px-4 py-3 border border-[#E2E8F0]"
                      data-testid={`badge-column-${col.toLowerCase()}`}
                    >
                      <div className="w-2 h-2 rounded-full bg-[#465FFF]" />
                      <span className="text-sm font-medium text-[#1C2434]">{col}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleStartAnalyzing}
              className="w-full bg-gradient-to-r from-[#465FFF] to-[#7B8AFF] text-white rounded-xl py-3 h-12 text-sm font-medium shadow-lg shadow-blue-200/30"
              data-testid="button-start-analyzing"
            >
              Start Analyzing Data
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
