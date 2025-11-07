// index.js
// Author: Lucas Rantanen
// Date: 2025-11-07
// javascript for form

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addForm");
  const table = document.getElementById("infotable").querySelector("tbody");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const telInput = document.getElementById("tel");
  const birthInput = document.getElementById("birthDate");
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
    return (/^(\+|0)[1-9][0-9 \-\(\)\.]{7,14}$/.test(str) &&
      digits.length >= 7 &&
      digits.length <= 14
    );
  };

  const validate = () => {
    let ok = true;
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setError(nameError, "Name needs to be atleast 2 letters long.");
      ok = false;
    } else {
      setError(nameError, "");
    }
    if (!emailInput.value.trim() || !emailInput.checkValidity()) {
      setError(emailError, "Enter an Email-address");
      ok = false;
    } else {
      setError(emailError, "");
    }
    if (!telLooksOk(telInput.value.trim())) {
      setError(telError, "Give a real tel. number (esim. +358 401234567).");
      ok = false;
    } else {
      setError(telError, "");
    }
    const b = birthInput.value;
    if (!b) {
      setError(birthError, "Pick a birth date.");
      ok = false;
    } else if (isFutureDate(b)) {
      setError(birthError, "Birth date cant be in future.");
      ok = false;
    } else if (calcAge(b) < 15) {
      setError(birthError, "Age restricted +15");
      ok = false;
    } else {
      setError(birthError, "");
    }
    if (!rightsInput.checked) {
      setError(rightsError, "Accept the terms and conditions.");
      ok = false;
    } else {
      setError(rightsError, "");
    }

    return ok;
  };
  nameInput.addEventListener("input", () => {
    const val = nameInput.value.trim();
    if (val.length < 2) {
      setError(nameError, "Name needs to be at least 2 letters long.");
    } else {
      setError(nameError, "");
    }
  });

  emailInput.addEventListener("input", validate);
  telInput.addEventListener("input", validate);
  birthInput.addEventListener("change", validate);
  rightsInput.addEventListener("change", validate);
  const newRow = ({ name, email, tel, birth, rights }) => {
    const tr = document.createElement("tr");

    const cells = [
      new Date.now().toISOString(),
      name,
      email,
      tel,
      birth,
      rights ? "✔" : "X",
    ];
    cells.forEach((text) => {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    });

    table.appendChild(row);
  };
  nameInput.addEventListener("input", () => {
    const val = nameInput.value.trim();
    if (val.length < 2 || val.length > 15) {
      setError(nameError, "Invalid name (only letters and 3-15 characters)");
    } else {
      setError(nameError, "");
    }
  });
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
