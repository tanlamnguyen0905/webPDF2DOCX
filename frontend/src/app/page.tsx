// Trang chủ — hero + khu vực upload nhanh.
// Xem mô tả chi tiết: done/UI_UX_Design/ui_des.md §3
export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold">Convert PDF sang Word nhanh chóng</h1>
      <p className="mt-4 text-gray-600">
        Tải lên file PDF và chuyển đổi sang file Word .docx. Hỗ trợ chế độ miễn phí và
        chế độ nâng cao bằng coin.
      </p>
      {/* TODO: <UploadBox /> */}
    </main>
  );
}
