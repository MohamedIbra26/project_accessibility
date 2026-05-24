/**
 * Form validation — single responsibility: validate fields and manage error state.
 */

export function createValidator(messages) {
  const rules = {
    fullName(value) {
      if (!value.trim()) return messages.fullName.required;
      return "";
    },
    email(value) {
      const trimmed = value.trim();
      if (!trimmed) return messages.email.required;
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pattern.test(trimmed)) return messages.email.invalid;
      return "";
    },
    password(value) {
      if (!value) return messages.password.required;
      if (value.length < 8) return messages.password.minLength;
      return "";
    },
  };

  function validateField(ruleName, value) {
    const rule = rules[ruleName];
    return rule ? rule(value) : "";
  }

  function validateAll(fields) {
    const errors = {};
    let isValid = true;

    fields.forEach(({ name, rule, value }) => {
      const message = validateField(rule, value);
      errors[name] = message;
      if (message) isValid = false;
    });

    return { isValid, errors };
  }

  return { validateField, validateAll };
}

export function applyFieldError(input, errorEl, message, extraDescribedBy = []) {
  const hasError = Boolean(message);

  input.setAttribute("aria-invalid", hasError ? "true" : "false");

  if (hasError) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    input.setAttribute("aria-describedby", [...extraDescribedBy, errorEl.id].join(" "));
  } else {
    errorEl.textContent = "";
    errorEl.hidden = true;
    if (extraDescribedBy.length) {
      input.setAttribute("aria-describedby", extraDescribedBy.join(" "));
    } else {
      input.removeAttribute("aria-describedby");
    }
  }

  return !hasError;
}

export function clearFieldError(input, errorEl, extraDescribedBy = []) {
  return applyFieldError(input, errorEl, "", extraDescribedBy);
}
