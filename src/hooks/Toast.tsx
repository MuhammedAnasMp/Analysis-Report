import React from "react";
import ReactDOMServer from "react-dom/server"; // Add this to render JSX components to string
import Toastify from "toastify-js";

// Avatar type: URL string, SVG string, or JSX component
type AvatarType = string | React.ReactNode;

interface BaseToastOptions {
  duration?: number;
}

// Markup1 Toast (with title, avatar, and action link)
interface Markup1ToastOptions extends BaseToastOptions {
  type: "markup1";
  message: string;
  title: string;
  avatar?: AvatarType;
  actionText?: string;
  actionLink?: string; // Link instead of onClick
}

// Markup2 Toast (with status, image/icon, and message)
interface Markup2ToastOptions extends BaseToastOptions {
  type: "markup2";
  message: string;
  status: "success" | "failed" | "warning" | "normal";
  avatar?: AvatarType;
}

// Union type for both
type ToastOptions = Markup1ToastOptions | Markup2ToastOptions;

const useToast = () => {
  const showToast = (options: ToastOptions) => {
    const toastId = `toast-${Date.now()}`;
    let toastHTML = "";

    // Function to render avatar (URL, SVG string, or JSX component)
    const renderAvatar = (avatar?: AvatarType) => {
      if (!avatar) return "";
      if (typeof avatar === "string") {
        // If avatar is a URL or raw SVG string
        return avatar.includes("<svg") ? avatar : `<img class="inline-block size-8 rounded-full" src="${avatar}" alt="Avatar" />`;
      }

      // If avatar is a React component, render it to static HTML
      if (React.isValidElement(avatar)) {
        return ReactDOMServer.renderToStaticMarkup(avatar);
      }

      return "";
    };

    // Handle Markup1 Toast (with title, avatar, and action link)
    if (options.type === "markup1") {
      const { message, title, avatar, actionText, actionLink } = options;
      toastHTML = `
        <div id="${toastId}" class="max-w-xs relative bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700">
          <div class="flex p-4">
            <div class="shrink-0">
              ${renderAvatar(avatar)}
            </div>
            <div class="ms-4 me-5">
              <h3 class="text-gray-800 font-medium text-sm dark:text-white">
                <span class="font-semibold">${title}</span>
              </h3>
              <div class="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                ${message}
              </div>
              ${actionText && actionLink ? `
                <div class="mt-3">
                  <a href="${actionLink}" class="text-blue-600 decoration-2 hover:underline font-medium text-sm focus:outline-none focus:underline dark:text-blue-500">
                    ${actionText}
                  </a>
                </div>
              ` : ""}
            </div>
            <button onclick="document.getElementById('${toastId}').remove();" type="button"
              class="absolute top-3 end-3 inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 dark:text-white"
              aria-label="Close">
              <span class="sr-only">Close</span>
              <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
    }

    // Handle Markup2 Toast (with status, image/icon, and message)
    if (options.type === "markup2") {
      const { message, status, avatar } = options;

      // Define styles & icons for each status
      const statusStyles: Record<string, { color: string}> = {
        success: {
          color: "bg-green-100 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-400 dark:text-green-300",
        
        },
        failed: {
          color: "bg-red-100 border-red-500 text-red-700 dark:bg-red-900 dark:border-red-400 dark:text-red-300",

        },
        warning: {
          color: "bg-yellow-100 border-yellow-500 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-400 dark:text-yellow-300",
        },
        normal: {
          color: "bg-gray-100 border-gray-500 text-gray-700 dark:bg-gray-900 dark:border-gray-400 dark:text-gray-300",
          
        },
      };

      const { color } = statusStyles[status];

      toastHTML = `
        <div id="${toastId}" class="flex items-center p-4 border-l-4 rounded-xl shadow-lg ${color}">
          <div class="shrink-0">
            ${renderAvatar(avatar)}
          </div>
          <div class="ml-3">
            <p class="text-sm">${message}</p>
          </div>
          <div class="ml-auto text-lg">
           
          </div>
          <button onclick="document.getElementById('${toastId}').remove();" type="button"
            class="ml-3 inline-flex shrink-0 justify-center items-center size-5 rounded-lg opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100"
            aria-label="Close">
            <span class="sr-only">Close</span>
            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      `;
    }

    // Display toast using Toastify
    Toastify({
      text: toastHTML,
      className: "hs-toastify-on:opacity-100 opacity-0 fixed -top-[150px] right-[20px] z-[90] transition-all duration-300 w-[320px] text-sm rounded-xl shadow-lg",
      duration: options.duration || 3000,
      close: false, // Manual close button in markup
      escapeMarkup: false, // Allows raw HTML
    }).showToast();
  };

  return { showToast };
};

export default useToast;