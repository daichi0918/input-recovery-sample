$(document).ready(function () {
  // フォームが送信されるとデータをログに出力
  $('#sampleForm').on('submit', function (e) {
    e.preventDefault(); // デフォルトの送信を防ぐ
    const formData = $(this).serializeArray();
    console.log(formData);
    alert('フォームが送信されました！');
  });
});
