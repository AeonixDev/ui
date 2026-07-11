import type { Variant } from "./types.js";

export type ToastId = string;
export type ToastPosition = `${"bottom" | "top"}-${"center" | "left" | "right"}`;

export type ToastOptions = {
	dismissible?: boolean;
	duration?: number;
	id?: ToastId;
	message: string;
	position?: ToastPosition;
	title?: string;
	variant?: Variant;
};

export type ToastData = Required<
	Pick<ToastOptions, "dismissible" | "duration" | "id" | "message" | "position" | "variant">
> &
	Pick<ToastOptions, "title">;

export type ToastContext = {
	readonly toasts: ToastData[];
	addToast: (toast: ToastOptions) => ToastId;
	removeToast: (id: ToastId) => void;
};

export const toastContextKey = Symbol("toast");
