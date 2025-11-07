// index.js
// Author: Lucas Rantanen
// Date: 2025-11-07
// javascript for form

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("fullForm");
  const tbody = document.querySelector("#timetable tbody");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const telInput = document.getElementById("tel");
  const birthInput = document.getElementById("birth");
  const rightsInput = document.getElementById("rights");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const telError = document.getElementById("telError");
  const birthError = document.getElementById("birthError");
  const rightsError = document.getElementById("rightsError");

  const setError = (el, msg) => (el.textContent = msg || "");
  const isFutureDate = (yyyyMmDd) => {
    if (!yyyyMmDd) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(yyyyMmDd + "T00:00:00");
    return d > today;
  };

  const calcAge = (yyyyMmDd) => {
    if (!yyyyMmDd) return 0;
    const now = new Date();
    const b = new Date(yyyyMmDd + "T00:00:00");
    let age = now.getFullYear() - b.getFullYear();
    const m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
    return age;
  };

  const telLooksOk = (str) => {
    const digits = (str || "").replace(/\D/g, "");
    return (
      /^\+?[\d\s\-()]{7,25}$/.test(str) &&
      digits.length >= 7 &&
      digits.length <= 12
    );
  };

  const validate = () => {
    let ok = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 3 || nameInput.value.trim().length > 15) {
      setError(nameError, "Name needs to be between 3-15 letters.");
      ok = false;
    } else {
      setError(nameError, "");
    }

    if (!emailInput.value.trim() || !emailInput.checkValidity()) {
      setError(emailError, "Enter an Email");
      ok = false;
    } else {
      setError(emailError, "");
    }

    if (!telLooksOk(telInput.value.trim())) {
      setError(telError, "Only real phone numbers, 7-14 numbers.");
      ok = false;
    } else {
      setError(telError, "");
    }

    const b = birthInput.value;
    if (!b) {
      setError(birthError, "Pick a birth date.");
      ok = false;
    } else if (isFutureDate(b)) {
      setError(birthError, "Your birth cannot be dated in the future.");
      ok = false;
    } else if (calcAge(b) < 18) {
      setError(birthError, "Age restricted +18");
      ok = false;
    } else {
      setError(birthError, "");
    }

    if (!rightsInput.checked) {
      setError(rightsError, "Forfeiting rights is required.");
      ok = false;
    } else {
      setError(rightsError, "");
    }

    return ok;
  };

  nameInput.addEventListener("input", () => {
    const val = nameInput.value.trim();
    if (val.length < 3 || val.length > 15) {
      setError(nameError, "Name needs to be between 3-15 letters.");
    } else {
      setError(nameError, "");
    }
  });

  emailInput.addEventListener("input", () => {
    if (!emailInput.value.trim() || !emailInput.checkValidity()) {
      setError(emailError, "Enter an Email");
    } else {
      setError(emailError, "");
    }
  });
  telInput.addEventListener("input", () => {
    if (!telLooksOk(telInput.value.trim())) {
      setError(telError, "Only real phone numbers, 7-14 numbers.");
    } else {
      setError(telError, "");
    }
  });
  birthInput.addEventListener("change", () => {
    const b = birthInput.value;
    if (!b) {
      setError(birthError, "Pick a birth date.");
    } else if (isFutureDate(b)) {
      setError(birthError, "Your birth cannot be dated in the future.");
    } else if (calcAge(b) < 18) {
      setError(birthError, "Age restricted +18");
    } else {
      setError(birthError, "");
    }
  });
  rightsInput.addEventListener("change", () => {
    if (!rightsInput.checked) {
      setError(rightsError, "Forfeiting rights is required.");
    } else {
      setError(rightsError, "");
    }
  });

  const addRow = ({ name, email, tel, birth, rights }) => {
    const tr = document.createElement("tr");

    const cells = [
      new Date().toString(),
      name,
      email,
      tel,
      birth,
      rights ? "✓" : "X",
    ];

    cells.forEach((text) => {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const ok = validate();
    if (!ok) {
      if (nameError.textContent) nameInput.focus();
      else if (emailError.textContent) emailInput.focus();
      else if (telError.textContent) telInput.focus();
      else if (birthError.textContent) birthInput.focus();
      else if (rightsError.textContent) rightsInput.focus();
      return;
    }

    addRow({
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      tel: telInput.value.trim(),
      birth: birthInput.value,
      rights: rightsInput.checked,
    });

    form.reset();
    nameInput.focus();
  });

  form.addEventListener("reset", () => {
    [nameError, emailError, telError, birthError, rightsError].forEach((el) =>
      setError(el, "")
    );
  });
});
