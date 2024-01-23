function Validator(options) {
  // hàm kiểm tra và thực hiện validate
  let validate = (inputElement, rule) => {
    // gọi tới thẻ span của khung đang nhập liệu
    let errorElement = inputElement.parentElement.querySelector(
      options.errorSelector,
    );
    // kiểm tra xem người dùng nhập đúnh không
    let errorMessage = rule.test(inputElement.value);
    // xử lý hiển thị nội dung lỗi lên thẻ span ở ngay dưới khung nhập liệu
    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }
  };

  // lấy element của form cần validate
  let formElement = document.querySelector(options.form);
  if (formElement) {
    options.rules.forEach(function (rule) {
      let inputElement = formElement.querySelector(rule.selector);
      // gọi tới thẻ span của khung đang nhập liệu
      let errorElement = inputElement.parentElement.querySelector(
        options.errorSelector,
      );
      // kiểm tra xem người dùng nhập đúnh không
      let errorMessage = rule.test(inputElement.value);
      // xử lý hiển thị nội dung lỗi lên thẻ span ở ngay dưới khung nhập liệu
      if (inputElement) {
        // xử lý khi người dùng blur khỏi khung nhập
        inputElement.onblur = () => {
          validate(inputElement, rule, errorElement, errorMessage);
        };
        //xử lý khi người dùng nhập input
        inputElement.oninput = () => {
          errorElement.innerText = "";
          inputElement.parentElement.classList.remove("invalid");
        };
      }
    });
  }
}
// quy tắc :
// hợp lệ thì trả về undifine
// không hợp lệ thì message thông báo
Validator.isRequired = function (selector) {
  return {
    selector: selector,
    test: function (value = "") {
      return value.trim() ? undefined : "Vui lòng nhập lại !!!";
    },
  };
};
Validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value.trim()) ? undefined : "Email không hợp lệ !!!";
    },
  };
};
Validator.minLength = function (selector, min) {
  return {
    selector: selector,
    test: function (value) {
      return value >= min
        ? undefined
        : `Vui lòng nhập tối thiểu ${min} kí tự !!!`;
    },
  };
};
Validator.isConfirmed = function (selector, getConfirmValue) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : `Mật khẩu không chính xác`;
    },
  };
};

Validator({
  form: "#form-1",
  errorSelector: ".form-message",
  rules: [
    Validator.isRequired("#fullname"),
    Validator.isEmail("#email"),
    Validator.isRequired("#password"),
    Validator.minLength("#password", 6),
    Validator.isConfirmed("#password_confirmation", function () {
      return document.querySelector("#form-1 #password").value;
    }),
  ],
});
