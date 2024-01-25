function Validator(options) {
  let selectorRules = {};

  //
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  // hàm kiểm tra và thực hiện validate
  let validate = (inputElement, rule) => {
    // gọi tới thẻ span của khung đang nhập liệu
    let errorElement = getParent(
      inputElement,
      options.formGroupSelector,
    ).querySelector(options.errorSelector);
    let errorMessage;

    //  lấy ra các rules của selector
    let rules = selectorRules[rule.selector];
    // lặp và từng rule& kiểm tra
    // nếu có lỗi thì dừng việc kiểm tra
    for (let i = 0; i < rules.length; ++i) {
      switch (inputElement.type) {
        case "radia":
        case "checkbox":
          errorMessage = rule[i](
            formElement.querySelector(rule.selector + ":checked"),
          );
          break;
        default:
          break;
      }
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }
    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add(
        "invalid",
      );
    } else {
      errorElement.innerText = "";
      getParent(inputElement, options.formGroupSelector).classList.remove(
        "invalid",
      );
    }
    return errorMessage;
  };

  // lấy element của form cần validate
  let formElement = document.querySelector(options.form);

  if (formElement) {
    //khi submit form
    formElement.onsubmit = function (e) {
      e.preventDefault();
      let isFormValid = true;

      // kiểm tra tất cả các điều kiện xem có thõa mãn không
      options.rules.forEach(function (rule) {
        let inputElement = formElement.querySelector(rule.selector);
        let isValid = validate(inputElement, rule);
        if (isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        // trường hợp submit với javascript
        if (typeof options.onsubmit === "function") {
          let enableInputs = formElement.querySelectorAll("[name]");
          let formValues = Array.from(enableInputs).reduce((values, input) => {
            values[input.name] = input.value;
            return values;
          }, {});
          options.onsubmit({ formValues });
        }
        // trường hợp submit với hành vi khác=
        else {
          formElement.submit();
        }
      }
    };
    // kiểm tra từng rule và xử lý ( lắng nghe sự kiện blur, input,...)
    options.rules.forEach(function (rule) {
      // lưu lại các rule cho mõi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
      let inputElement = formElement.querySelector(rule.selector);
      // gọi tới thẻ span của khung đang nhập liệu
      let errorElement = getParent(
        inputElement,
        options.formGroupSelector,
      ).querySelector(options.errorSelector);
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
          getParent(inputElement, options.formGroupSelector).classList.remove(
            "invalid",
          );
        };
      }
    });
  }
}
// quy tắc :
// hợp lệ thì trả về undifine
// không hợp lệ thì message thông báo
Validator.isRequired = function (selector, message = "") {
  return {
    selector: selector,
    test: function (value = "") {
      return value.trim() ? undefined : message || "Vui lòng nhập trường này!!";
    },
  };
};
Validator.isEmail = function (selector, message = "") {
  return {
    selector: selector,
    test: function (value) {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value.trim())
        ? undefined
        : message || "Email không hợp lệ !!!";
    },
  };
};
Validator.minLength = function (selector, min) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : `Vui lòng nhập tối thiểu ${min} kí tự !!!`;
    },
  };
};
Validator.isConfirmed = function (selector, getConfirmValue, message = "") {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || `Giá trị nhập lại không chính xác`;
    },
  };
};

Validator({
  form: "#form-1",
  formGroupSelector: ".form-group",
  errorSelector: ".form-message",
  rules: [
    Validator.isRequired("#fullname", "Vui lòng nhập họ tên đầy đủ!!!"),
    Validator.isRequired("#email"),
    Validator.isEmail("#email"),
    Validator.isRequired("#password"),
    Validator.minLength("#password", 6),
    Validator.isRequired("#password_confirmation"),
    Validator.isRequired(`input[name="gender"]`),
    Validator.isConfirmed("#password_confirmation", function () {
      return document.querySelector("#form-1 #password").value;
    }),
  ],
  onsubmit: function (data) {
    console.log(data);
  },
});
