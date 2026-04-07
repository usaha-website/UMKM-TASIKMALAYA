type ToastNoticeProps = {
  message: string;
};

export default function ToastNotice({ message }: ToastNoticeProps) {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border border-emerald-300/40 bg-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-100 shadow-lg backdrop-blur">
      {message}
    </div>
  );
}
