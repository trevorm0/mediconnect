'use strict';

// ── DOM references ──────────────────────────────────────────────────────────
const signupForm            = document.getElementById('signupForm');
const fullNameInput         = document.getElementById('signup-name');
const emailInput            = document.getElementById('signup-email');
const dobInput              = document.getElementById('signup-dob');
const countryCodeSelect     = document.getElementById('signup-country-code');
const phoneInput            = document.getElementById('signup-phone');
const passwordInput         = document.getElementById('signup-password');
const confirmPasswordInput  = document.getElementById('signup-confirm-password');
const accountTypeSelect     = document.getElementById('signup-account-type');

const nameError             = document.getElementById('nameError');
const emailError            = document.getElementById('emailError');
const dobError              = document.getElementById('dobError');
const phoneError            = document.getElementById('phoneError');
const passwordError         = document.getElementById('passwordError');
const confirmPasswordError  = document.getElementById('confirmPasswordError');
const accountTypeError      = document.getElementById('accountTypeError');

const customModal           = document.getElementById('customModal');
const modalTitle            = document.getElementById('modalTitle');
const modalMessage          = document.getElementById('modalMessage');
const closeModalButton      = document.getElementById('closeModalButton');

// ── Modal helpers ───────────────────────────────────────────────────────────
function showModal(title, message) {
  modalTitle.textContent   = title;
  modalMessage.textContent = message;
  customModal.classList.remove('hidden');
  document.body.classList.add('modal-active');
  closeModalButton.focus(); // accessibility: move focus into modal
}

function hideModal() {
  customModal.classList.add('hidden');
  document.body.classList.remove('modal-active');
}

closeModalButton.addEventListener('click', hideModal);

// Close modal when clicking the backdrop
customModal.addEventListener('click', function (e) {
  if (e.target === customModal) hideModal();
});

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !customModal.classList.contains('hidden')) {
    hideModal();
  }
});

// ── Validation functions ────────────────────────────────────────────────────

/**
 * Full name must contain at least two words (first + last name),
 * each consisting only of letters (and optional hyphens for hyphenated names).
 * The original regex only accepted a single word with no spaces, which
 * makes it impossible to enter a real full name.
 */
function validateFullName(name) {
  const trimmed = name.trim();
  // Allow letters, spaces, hyphens, and apostrophes (e.g. O'Brien, Mary-Jane Smith)
  const regex = /^[A-Za-z'-]+(\s[A-Za-z'-]+)+$/;
  if (!regex.test(trimmed)) {
    nameError.textContent = 'Please enter your first and last name (letters only).';
    return false;
  }
  nameError.textContent = '';
  return true;
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.trim())) {
    emailError.textContent = 'Please enter a valid email address.';
    return false;
  }
  emailError.textContent = '';
  return true;
}

function validateDob(dobString) {
  const dob = new Date(dobString);
  const today = new Date();
  // Strip time so comparison is date-only
  today.setHours(0, 0, 0, 0);
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  if (isNaN(dob.getTime())) {
    dobError.textContent = 'Please enter a valid date of birth.';
    return false;
  }
  if (dob > today) {
    dobError.textContent = 'Date of birth cannot be in the future.';
    return false;
  }
  if (dob > eighteenYearsAgo) {
    dobError.textContent = 'You must be at least 18 years old to register.';
    return false;
  }
  dobError.textContent = '';
  return true;
}

function validatePhoneNumber(countryCode, phoneNumber) {
  if (!countryCode) {
    phoneError.textContent = 'Please select a country code.';
    return false;
  }

  let local = phoneNumber.trim();

  // For Kenyan numbers, strip a leading 0 before the 9-digit local number
  if (countryCode === '+254' && local.startsWith('0')) {
    local = local.substring(1);
  }

  // Accept 7–15 digits (ITU-T E.164 max is 15 total digits)
  const localNumRegex = /^\d{7,15}$/;
  if (!localNumRegex.test(local)) {
    phoneError.textContent = 'Please enter a valid phone number (7–15 digits).';
    return false;
  }

  phoneError.textContent = '';
  return true;
}

function validatePassword(password) {
  const minLength     = 8;
  const hasUpperCase  = /[A-Z]/.test(password);
  const hasLowerCase  = /[a-z]/.test(password);
  const hasNumber     = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?]+/.test(password);

  if (
    password.length < minLength ||
    !hasUpperCase ||
    !hasLowerCase ||
    !hasNumber ||
    !hasSpecialChar
  ) {
    passwordError.textContent =
      'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.';
    return false;
  }
  passwordError.textContent = '';
  return true;
}

function validateConfirmPassword(password, confirmPassword) {
  if (password !== confirmPassword) {
    confirmPasswordError.textContent = 'Passwords do not match.';
    return false;
  }
  confirmPasswordError.textContent = '';
  return true;
}

function validateAccountType(accountType) {
  if (!accountType) {
    accountTypeError.textContent = 'Please select an account type.';
    return false;
  }
  accountTypeError.textContent = '';
  return true;
}

// ── Live (inline) validation ────────────────────────────────────────────────
fullNameInput.addEventListener('input',
  () => validateFullName(fullNameInput.value));

emailInput.addEventListener('input',
  () => validateEmail(emailInput.value));

dobInput.addEventListener('change',
  () => validateDob(dobInput.value));

phoneInput.addEventListener('input',
  () => validatePhoneNumber(countryCodeSelect.value, phoneInput.value));

countryCodeSelect.addEventListener('change',
  () => { if (phoneInput.value) validatePhoneNumber(countryCodeSelect.value, phoneInput.value); });

passwordInput.addEventListener('input',
  () => validatePassword(passwordInput.value));

confirmPasswordInput.addEventListener('input',
  () => validateConfirmPassword(passwordInput.value, confirmPasswordInput.value));

accountTypeSelect.addEventListener('change',
  () => validateAccountType(accountTypeSelect.value));

// ── Form submit ─────────────────────────────────────────────────────────────
signupForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const isFullNameValid         = validateFullName(fullNameInput.value);
  const isEmailValid            = validateEmail(emailInput.value);
  const isDobValid              = validateDob(dobInput.value);
  const isPhoneValid            = validatePhoneNumber(countryCodeSelect.value, phoneInput.value);
  const isPasswordValid         = validatePassword(passwordInput.value);
  const isConfirmPasswordValid  = validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
  const isAccountTypeValid      = validateAccountType(accountTypeSelect.value);

  if (
    isFullNameValid &&
    isEmailValid &&
    isDobValid &&
    isPhoneValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    isAccountTypeValid
  ) {
    // Build the final phone number
    let finalPhone = phoneInput.value.trim();
    if (countryCodeSelect.value === '+254' && finalPhone.startsWith('0')) {
      finalPhone = countryCodeSelect.value + finalPhone.substring(1);
    } else {
      finalPhone = countryCodeSelect.value + finalPhone;
    }

    const username    = fullNameInput.value.trim();
    const accountType = accountTypeSelect.options[accountTypeSelect.selectedIndex].text;

    // Log sanitised data (no password logged)
    console.info('New registration:', {
      fullname:    username,
      email:       emailInput.value.trim(),
      dob:         dobInput.value,
      phone:       finalPhone,
      accountType: accountTypeSelect.value,
    });

    showModal(
      'Registration Successful!',
      `Welcome, ${username}! You have registered as a ${accountType}.`
    );

    signupForm.reset();
  } else {
    showModal('Registration Failed', 'Please correct the highlighted errors and try again.');
  }
});
