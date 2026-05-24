/**
 * Centralized mock data for the Profile Settings application.
 * All UI content is sourced from these objects and rendered via JavaScript.
 */

export const siteConfig = {
  name: "MyAccount",
  title: "Profile Settings — MyAccount",
  copyright: "© 2024 MyAccount. All rights reserved.",
  logoHref: "index.html#home",
};

export const navigationLinks = [
  { id: "home", label: "Home", href: "index.html#home" },
  { id: "profile", label: "Profile", href: "index.html#profile" },
  { id: "security", label: "Security", href: "index.html#security" },
  { id: "notifications", label: "Notifications", href: "index.html#notifications" },
  { id: "help", label: "Help", href: "index.html#help" },
];

export const userMenu = {
  name: "John Doe",
  items: [
    { label: "Account", href: "index.html#profile" },
    { label: "Sign out", href: "index.html#home", action: "sign-out" },
  ],
};

export const footerLinks = [
  { label: "Privacy Policy", href: "privacy.html" },
  { label: "Terms of Service", href: "terms.html" },
];

export const pageContent = {
  heading: "Profile Settings",
  subtitle: "Update your personal information and account preferences.",
  home: {
    title: "Welcome back",
    description:
      "Manage your account settings using the sections below. All changes are saved when you click Save Changes.",
  },
  sections: {
    profile: {
      title: "Profile Information",
      description: "Update your name and email address.",
    },
    security: {
      title: "Security",
      description: "Change your password to keep your account secure.",
    },
    notifications: {
      title: "Notification Preferences",
      description: "Choose how you would like to receive updates.",
    },
  },
};

export const profileData = {
  fullName: "John Doe",
  email: "john.doe",
  password: "short",
  emailNotifications: true,
};

export const formFields = {
  profile: [
    {
      id: "full-name",
      name: "fullName",
      label: "Full Name",
      type: "text",
      required: true,
      autocomplete: "name",
      validate: "fullName",
    },
    {
      id: "email",
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      autocomplete: "email",
      validate: "email",
    },
  ],
  security: [
    {
      id: "password",
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      autocomplete: "new-password",
      minlength: 8,
      validate: "password",
      hasToggle: true,
    },
  ],
};

export const notificationPreferences = {
  legend: "Email Notifications",
  checkbox: {
    id: "email-notifications",
    name: "emailNotifications",
    label: "Receive email notifications",
    hint: "We'll send you important updates via email.",
  },
};

export const buttonLabels = {
  save: "Save Changes",
  cancel: "Cancel",
  deleteAccount: "Delete Account",
  showPassword: "Show",
  hidePassword: "Hide",
  showPasswordAria: "Show password",
  hidePasswordAria: "Hide password",
};

export const successMessage = {
  title: "Profile updated successfully!",
  text: "Your changes have been saved.",
  dismissLabel: "Dismiss success message",
};

export const modalContent = {
  id: "delete-modal",
  title: "Delete Account?",
  description: "This action cannot be undone. All your data will be permanently removed.",
  cancelLabel: "Cancel",
  confirmLabel: "Yes, Delete My Account",
  closeLabel: "Close dialog",
};

export const helpContent = {
  title: "Need help?",
  description: "Visit our Help Center for more information.",
  linkLabel: "Go to Help Center",
  linkHref: "index.html#help",
};

export const helpSectionContent = {
  title: "Help Center",
  topics: [
    {
      question: "How do I update my profile?",
      answer: "Navigate to the Profile section, edit your details, and click Save Changes.",
    },
    {
      question: "How do I change my password?",
      answer: "Go to the Security section, enter a new password (minimum 8 characters), and save.",
    },
    {
      question: "How do I manage notifications?",
      answer: "Use the Notifications section to toggle email notification preferences.",
    },
  ],
  contactEmail: "support@myaccount.example.com",
};

export const validationMessages = {
  fullName: {
    required: "Full name is required.",
  },
  email: {
    required: "Email address is required.",
    invalid: "Please enter a valid email address.",
  },
  password: {
    required: "Password is required.",
    minLength: "Password must be at least 8 characters long.",
  },
};
