"use client";

import {
  type AriaToastProps,
  useToast,
  useToastRegion,
} from "@react-aria/toast";
import {
  ToastQueue,
  type ToastState,
  useToastQueue,
} from "@react-stately/toast";
import { type ReactNode, useRef } from "react";
import { Button } from "react-aria-components";
import { createPortal } from "react-dom";
import { IoIosClose } from "react-icons/io";

import { twMerge } from "tailwind-merge";
import { useIsMounted } from "usehooks-ts";

type ToastProperties = AriaToastProps<ReactNode> & {
  readonly state: ToastState<ReactNode>;
};

function Toast({ state, ...properties }: ToastProperties) {
  const reference = useRef(null);
  const { toastProps, titleProps, closeButtonProps } = useToast(
    properties,
    state,
    reference
  );

  return (
    <div
      {...toastProps}
      ref={reference}
      className={twMerge(
        "z-50 border p-2 pl-4 w-80",
        "flex items-center justify-between"
      )}
    >
      <div {...titleProps}>{properties.toast.content}</div>
      <Button {...closeButtonProps} className={twMerge("outline-none p-1")}>
        <IoIosClose className="size-4" />
      </Button>
    </div>
  );
}

const toasts = new ToastQueue<ReactNode>({
  maxVisibleToasts: 5,
});

export function toast(text: string) {
  return toasts.add(text, { timeout: 5000 });
}

export function Toaster() {
  const reference = useRef(null);
  const state = useToastQueue(toasts);
  const { regionProps } = useToastRegion({}, state, reference);
  const isMounted = useIsMounted();

  return isMounted()
    ? createPortal(
        state.visibleToasts.length >= 0 ? (
          <div
            className={twMerge(
              "fixed bottom-4 right-4",
              "flex flex-col gap-4",
              "bg-slate-900"
            )}
            {...regionProps}
            ref={reference}
          >
            {state.visibleToasts.map((toast) => (
              <Toast key={toast.key} toast={toast} state={state} />
            ))}
          </div>
        ) : undefined,
        window.document.body
      )
    : null;
}
