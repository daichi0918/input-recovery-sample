// // for text or select
// type InputValue = {
//   name: string;
//   val: string;
// };

// // for radio or checkbox
// type InputCheck = {
//   name: string;
//   ids: string[];
// };

// type SaveType = {
//   values: InputValue[];
//   checks: InputCheck[];
// };

$(document).ready(function () {
  /**
   * for text or select
   * @returns {InputValue[]}
   */
  // : InputValue[]
  const getInputValues = () => {
    // hidden のやつは希望日
    return $(
      "input[type=text],input[type=email],input[type=tel],textarea,select,input[type=hidden][name='data\\[T31202\\]\\[calendarData\\]']"
    )
      .get()
      .map((element) => {
        const v = $(element).val();
        const val = typeof v === 'string' ? v : '';
        return {
          name: $(element).attr('name') || '',
          val,
        };
      });
  };

  /**
   * for radio or checkbox
   * @returns {InputCheck[]}
   */
  const getInputChecks = () => {
    const ret = [];
    $('input[type=checkbox],input[type=radio]').each((_, element) => {
      const name = $(element).attr('name') || '';
      const checked = $(element).prop('checked');
      const id = $(element).attr('id');
      // console.log('!checked || !id:', !checked || !id);
      if (!checked) return;
      let r = ret.find((r) => r.name === name);
      if (!r) {
        r = { name, ids: [] };
        ret.push(r);
      }
      r.ids.push(id);
    });
    return ret;
  };

  const onChange = () => {
    const values = getInputValues();
    const checks = getInputChecks();
    const saveData = { values, checks };

    try {
      localStorage.setItem('inputValues', JSON.stringify(saveData));
      console.log(saveData);
    } catch (e) {
      console.error('saveData error: ', e);
    }
  };

  /* 入力値保存 */
  $('input, select, textarea').on('input change', onChange);

  /* 入力復元 */
  const restoreInputs = () => {
    const storedData = localStorage.getItem('inputValues');
    if (!storedData) return; // データがない場合は終了

    let data;
    try {
      data = JSON.parse(storedData); // JSON文字列をオブジェクトに変換
    } catch (error) {
      console.error('JSONのパースに失敗しました:', error);
      return; // パースエラー時は処理を中断
    }

    // データ構造を確認し、valuesとchecksが存在するか確認
    if (!Array.isArray(data.values) || !Array.isArray(data.checks)) {
      console.error('データ形式が正しくありません:', data);
      return; // 不正な形式の場合は処理を中断
    }

    // フォームの値を復元
    data.values.forEach((v) => {
      $(`[name="${v.name}"]`).val(v.val);
      if ($(`[name="${v.name}"]`).attr('type') === 'hidden') {
        // hidden の場合は希望日なので希望日選択処理をする
        window.calendar_data.confirmTime = JSON.parse(v.val);
        window.confirmTimes();
      } else {
        // レーベンサイトはバリデーション実行しないとエラーが残ってしまうのでバリデーションを発動させる
        $(`[name="${v.name}"]`).trigger('blur').trigger('change');
      }
    });

    data.checks.forEach((c) => {
      c.ids.forEach((id) => {
        $(`[id="${id}"]`).prop('checked', true);
        // レーベンサイトはバリデーション実行しないとエラーが残ってしまうのでバリデーションを発動させる
        $(`[id="${id}"]`).trigger('change');
        if ($(`[id="${id}"]`).attr('type') === 'radio') {
          $(`[id="${id}"]`).trigger('click');
        }
      });
    });
  };

  restoreInputs();
});
